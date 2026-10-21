#!/usr/bin/env node
// Seeds (or refreshes) the sample changes of the Bridge demo repository. See docs/SEEDING.md.
//
//   node scripts/seed-demo.mjs check              dry run every token, docs and brand change through Bridge (writes nothing)
//   node scripts/seed-demo.mjs history            merge the past changes to main
//   node scripts/seed-demo.mjs open               open the changes waiting for review, the requests and the product branch
//   node scripts/seed-demo.mjs states             send for review, owner comments, the late merge that outdates a suggestion
//   node scripts/seed-demo.mjs all               history, open, states
//
// Needs: node 20+, git, gh (signed in with write access to the repo). The GitHub token comes from GITHUB_TOKEN or
// `gh auth token`. Steps are idempotent: an item whose pull request or issue already exists (same title) is skipped.
// Env: SEED_REPO (default peterbono/bridge-demo-ds), SEED_CLI (default @bridge-ds/cli@0.11.1), SEED_DEBUG=1.
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { connectBridge } from './mcp-client.mjs';
import { HISTORY, LATE_MERGE, OPEN, PRODUCT_BRANCH, REQUESTS } from './seed/plan.mjs';

const REPO = process.env.SEED_REPO || 'peterbono/bridge-demo-ds';
const CLI = process.env.SEED_CLI || '@bridge-ds/cli@0.11.1';
const HERE = dirname(fileURLToPath(import.meta.url));
const PATCHES = join(HERE, 'seed', 'patches');
const STATE_FILE = join(HERE, 'seed', 'state.json');
const phase = process.argv[2] || 'check';

const log = (...a) => console.log(...a);
const sh = (cmd, args, opts = {}) => execFileSync(cmd, args, { encoding: 'utf8', stdio: ['pipe', 'pipe', 'pipe'], ...opts }).trim();
const gh = (...args) => sh('gh', args);
const ghJson = (...args) => JSON.parse(gh(...args) || 'null');
const noEmDash = (s) => { if (/\u2014/.test(JSON.stringify(s))) throw new Error(`Em dash in: ${JSON.stringify(s).slice(0, 80)}`); return s; };

const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : {};
const save = () => writeFileSync(STATE_FILE, JSON.stringify(state, null, 2) + '\n');

// Bridge prefixes titles ("feat(tokens): ", "Button: ") and lowers the first letter after the prefix.
const sameTitle = (have, want) => {
  const a = have.toLowerCase();
  const b = want.toLowerCase();
  return a === b || a.endsWith(`: ${b}`);
};
function findPr(title) {
  const list = ghJson('pr', 'list', '-R', REPO, '--state', 'all', '--limit', '200', '--json', 'number,title,state,headRefName');
  return list.find((p) => sameTitle(p.title, title));
}
function findIssue(title) {
  const list = ghJson('issue', 'list', '-R', REPO, '--state', 'all', '--limit', '200', '--json', 'number,title,state');
  return list.find((i) => sameTitle(i.title, title));
}

let bridge;
async function mcp(name, args) {
  bridge ??= await connectBridge({ repo: REPO, cli: CLI });
  noEmDash(args);
  const r = await bridge.call(name, args);
  if (r.isError) throw new Error(`${name}: ${r.text.slice(0, 600)}`);
  return r.json ?? r.text;
}

// ---------------------------------------------------------------- writers

async function tokenPr(item, { dryRun = false } = {}) {
  const found = !dryRun && findPr(item.title);
  if (found) return log(`skip  #${found.number} ${item.title}`), found.number;
  const r = await mcp('bridge_propose_token_change', { title: item.title, summary: item.summary, edits: item.edits, changes: 'direct', dryRun });
  if (dryRun) return log(`check tier ${r.tier} ${r.status} ${item.title}: contrast moved ${r.contrast?.moved}, new failures ${r.contrast?.newFailures?.length ?? 0}`);
  log(`open  #${r.pr} ${item.title} (tier ${r.tier ?? '?'})`);
  return r.pr;
}

async function suggestion(item, { dryRun = false } = {}) {
  const found = !dryRun && findIssue(item.title);
  if (found) return log(`skip  #${found.number} ${item.title}`), found.number;
  const r = await mcp('bridge_propose_token_change', { title: item.title, summary: item.summary, edits: item.edits, changes: 'suggest', dryRun });
  if (dryRun) return log(`check suggestion ${r.status} ${item.title}`);
  log(`issue #${r.number} ${item.title} (suggestion)`);
  return r.number;
}

async function docs(item, { dryRun = false, changes = 'direct' } = {}) {
  const found = !dryRun && (changes === 'direct' ? findPr(item.title) : findIssue(item.title));
  if (found) return log(`skip  #${found.number} ${item.title}`), found.number;
  const r = await mcp('bridge_save_docs', { component: item.component, docs: item.docs, title: item.title, ...(item.notes ? { notes: item.notes } : {}), changes, dryRun });
  if (dryRun) return log(`check docs ${item.component}: ${r.status ?? 'ok'}`);
  const n = r.pr ?? r.number;
  log(`${changes === 'direct' ? 'open ' : 'issue'} #${n} ${item.title} (docs)`);
  if (item.claudeDraft && changes === 'direct') markClaudeDraft(n, item.component);
  return n;
}

async function brand(item, { dryRun = false } = {}) {
  const title = `New brand: ${item.name}`;
  const found = !dryRun && ghJson('pr', 'list', '-R', REPO, '--state', 'all', '--json', 'number,headRefName').find((p) => p.headRefName === `bridge/brand-${item.slug}`);
  if (found) return log(`skip  #${found.number} ${title}`), found.number;
  const { key: _k, kind: _kind, review: _r, ...args } = item;
  const r = await mcp('bridge_propose_brand', { ...args, changes: 'direct', dryRun });
  if (dryRun) return log(`check brand ${item.slug}: ${r.status ?? ''} blocked=${r.blocked ?? false} failures=${r.contrast?.failures?.length ?? r.failures?.length ?? 0}`);
  log(`open  #${r.pr} ${title} (brand)`);
  return r.pr;
}

async function request(req) {
  const found = findIssue(req.title);
  if (found) return log(`skip  #${found.number} ${req.title}`), found.number;
  const r = await mcp('bridge_create_request', req);
  log(`issue #${r.number} ${req.title} (request)`);
  return r.number;
}

function workdir() {
  const dir = mkdtempSync(join(tmpdir(), 'bridge-demo-seed-'));
  sh('gh', ['repo', 'clone', REPO, dir, '--', '-q']);
  sh('git', ['-C', dir, 'config', 'user.name', sh('gh', ['api', 'user', '-q', '.login'])]);
  return dir;
}

/** Component code, the developer way: a request issue (when given), a branch from main with the patch, a pull request that closes it. */
async function codePr(item, { draft = true } = {}) {
  const found = findPr(item.prTitle);
  if (found) return log(`skip  #${found.number} ${item.prTitle}`), found.number;
  const issue = item.request ? await request(item.request) : undefined;
  const dir = workdir();
  sh('git', ['-C', dir, 'checkout', '-q', '-b', item.branch]);
  sh('git', ['-C', dir, 'am', '-q', join(PATCHES, item.patch)]);
  sh('git', ['-C', dir, 'push', '-q', '-u', 'origin', item.branch]);
  const body = noEmDash(item.prBody(issue));
  const args = ['pr', 'create', '-R', REPO, '--head', item.branch, '--base', 'main', '--title', item.prTitle, '--body', body];
  if (draft) args.push('--draft');
  for (const l of item.labels ?? []) args.push('--label', l);
  ensureLabels(item.labels ?? []);
  const url = gh(...args);
  const n = Number(url.split('/').pop());
  log(`open  #${n} ${item.prTitle} (code${issue ? `, closes #${issue}` : ''})`);
  return n;
}

/** Records in the docs file that Claude drafted it and that it needs review, as the Docs drafts workflow does. */
function markClaudeDraft(n, component) {
  const branch = ghJson('pr', 'view', String(n), '-R', REPO, '--json', 'headRefName').headRefName;
  const dir = workdir();
  sh('git', ['-C', dir, 'checkout', '-q', branch]);
  const p = join(dir, 'packages/react/src/components', component, `${component}.docs.json`);
  const json = JSON.parse(readFileSync(p, 'utf8'));
  json.draftedBy = 'claude';
  json.needsReview = true;
  writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
  sh('git', ['-C', dir, 'commit', '-q', '-am', `docs(${component}): drafted by Claude, needs review`]);
  sh('git', ['-C', dir, 'push', '-q']);
  log(`mark  #${n} ${component} docs drafted by Claude`);
}

function ensureLabels(labels) {
  const have = new Set(ghJson('label', 'list', '-R', REPO, '--limit', '200', '--json', 'name').map((l) => l.name));
  for (const l of labels) if (!have.has(l)) gh('label', 'create', l, '-R', REPO, '--color', 'ededed');
}

/** A deprecation: Bridge's edit ops have no $deprecated, so this one is a plain commit with the same labels and body shape. */
async function deprecationPr(item) {
  const found = findPr(item.title);
  if (found) return log(`skip  #${found.number} ${item.title}`), found.number;
  const dir = workdir();
  sh('git', ['-C', dir, 'checkout', '-q', '-b', item.branch]);
  const segs = item.path.split('.');
  for (const f of item.files) {
    const p = join(dir, 'packages/tokens/src', f);
    const json = JSON.parse(readFileSync(p, 'utf8'));
    let node = json;
    for (const s of segs) node = node[s];
    const ordered = {};
    for (const [k, v] of Object.entries(node)) { ordered[k] = v; if (k === '$value') ordered.$deprecated = item.deprecated; }
    for (const k of Object.keys(node)) delete node[k];
    Object.assign(node, ordered);
    writeFileSync(p, JSON.stringify(json, null, 2) + '\n');
  }
  mkdirSync(join(dir, '.changeset'), { recursive: true });
  writeFileSync(join(dir, '.changeset', `${item.branch.replace(/\//g, '-')}.md`), `---\n"@demo-ds/tokens": minor\n---\n\nDeprecate \`${item.path}\`. ${item.deprecated}\n`);
  sh('git', ['-C', dir, 'add', '-A']);
  sh('git', ['-C', dir, 'commit', '-q', '-m', `tokens: deprecate ${item.path}`]);
  sh('git', ['-C', dir, 'push', '-q', '-u', 'origin', item.branch]);
  const body = noEmDash(`## What changed and why\n\n${item.summary}\n\n## Risk tier\n\n- [x] Tier 3: token change (deprecation, no value change), needs design + tech approval\n- Semver bump: \`minor\` now, \`major\` when the token is removed\n\n## Token changes\n\n| Token | Change | Files |\n| --- | --- | --- |\n| \`${item.path}\` | \`$deprecated\`: ${item.deprecated} | ${item.files.join(', ')} |\n\n## Checks\n\n- Values unchanged in every mode: no contrast pair moves.\n- No component reads \`--${segs.join('-')}\`.\n`);
  ensureLabels(['tier: 3', 'tokens']);
  const url = gh('pr', 'create', '-R', REPO, '--head', item.branch, '--base', 'main', '--title', item.title, '--body', body, '--draft', '--label', 'tier: 3', '--label', 'tokens');
  const n = Number(url.split('/').pop());
  log(`open  #${n} ${item.title} (deprecation)`);
  return n;
}

function merge(n, title) {
  const pr = ghJson('pr', 'view', String(n), '-R', REPO, '--json', 'state,isDraft');
  if (pr.state === 'MERGED') return log(`skip  #${n} already merged`);
  if (pr.isDraft) gh('pr', 'ready', String(n), '-R', REPO);
  gh('pr', 'merge', String(n), '-R', REPO, '--squash', '--delete-branch');
  log(`merge #${n} ${title ?? ''}`);
}

/** A suggestion that went the whole way: filed, applied by a developer (bridge apply), merged in a PR that closes it. */
async function appliedSuggestion(item) {
  const n = await suggestion(item);
  const found = findPr(`Apply suggestion #${n}: ${item.title}`);
  if (found) return log(`skip  #${found.number} apply #${n}`);
  const dir = workdir();
  const token = process.env.GITHUB_TOKEN || sh('gh', ['auth', 'token']);
  // The suggestion's author cannot approve it (Bridge ignores self-reviews), so a solo seeder applies it unapproved;
  // Bridge says so on the issue.
  const out = sh('npx', ['-y', CLI, 'apply', String(n), '--force-unapproved', '--json'], { cwd: dir, env: { ...process.env, GITHUB_TOKEN: token } });
  const res = JSON.parse(out);
  const branch = res.branch ?? sh('git', ['-C', dir, 'branch', '--show-current']);
  sh('git', ['-C', dir, 'push', '-q', '-u', 'origin', branch]);
  const url = gh('pr', 'create', '-R', REPO, '--head', branch, '--base', 'main', '--title', `Apply suggestion #${n}: ${item.title}`, '--body', `Applies the Bridge suggestion #${n} with \`bridge apply ${n}\`: same change, checks re-run on today's main.\n\nCloses #${n}\n`, '--label', 'tier: 1');
  const pr = Number(url.split('/').pop());
  log(`open  #${pr} apply suggestion #${n}`);
  merge(pr, `apply suggestion #${n}`);
}

// ---------------------------------------------------------------- phases

async function check() {
  for (const item of [...HISTORY, ...OPEN, LATE_MERGE]) {
    if (item.kind === 'token') await tokenPr(item, { dryRun: true });
    else if (item.kind === 'suggestion' || item.kind === 'suggestion-applied') await suggestion(item, { dryRun: true });
    else if (item.kind === 'docs') await docs(item, { dryRun: true });
    else if (item.kind === 'docs-suggestion') await docs(item, { dryRun: true, changes: 'suggest' });
    else if (item.kind === 'brand') await brand(item, { dryRun: true });
    else noEmDash(item);
  }
}

async function history() {
  for (const item of HISTORY) {
    if (state[item.key]?.merged) { log(`skip  ${item.key} (merged)`); continue; }
    if (item.kind === 'token') merge(await tokenPr(item), item.title);
    else if (item.kind === 'docs') merge(await docs(item), item.title);
    else if (item.kind === 'code') merge(await codePr(item, { draft: false }), item.prTitle);
    else if (item.kind === 'suggestion-applied') await appliedSuggestion(item);
    state[item.key] = { merged: true };
    save();
  }
}

async function open() {
  for (const item of OPEN) {
    if (state[item.key]?.number) { log(`skip  ${item.key} (#${state[item.key].number})`); continue; }
    let n;
    if (item.kind === 'token') n = await tokenPr(item);
    else if (item.kind === 'deprecation') n = await deprecationPr(item);
    else if (item.kind === 'code') n = await codePr(item);
    else if (item.kind === 'docs') n = await docs(item);
    else if (item.kind === 'docs-suggestion') n = await docs(item, { changes: 'suggest' });
    else if (item.kind === 'brand') n = await brand(item);
    else if (item.kind === 'suggestion') n = await suggestion(item);
    state[item.key] = { number: n };
    save();
  }
  for (const req of REQUESTS) {
    const key = `r-${req.title}`;
    if (state[key]) continue;
    state[key] = { number: await request(req) };
    save();
  }
  await productBranch();
}

async function productBranch() {
  if (state['p-profile']?.number) return log(`skip  product branch #${state['p-profile'].number}`);
  const r = await mcp('bridge_start_exploration', { name: PRODUCT_BRANCH.name, purpose: PRODUCT_BRANCH.purpose, useCase: PRODUCT_BRANCH.useCase, product: PRODUCT_BRANCH.product, experimental: PRODUCT_BRANCH.experimental });
  const n = r.pr;
  const branch = r.branch;
  log(`open  #${n} ${branch} (product branch)`);
  const dir = workdir();
  sh('git', ['-C', dir, 'checkout', '-q', branch]);
  writeFileSync(join(dir, PRODUCT_BRANCH.file), readFileSync(join(HERE, 'seed', 'product', 'Profile.tsx'), 'utf8'));
  writeFileSync(join(dir, PRODUCT_BRANCH.css), readFileSync(join(HERE, 'seed', 'product', 'profile.module.css'), 'utf8'));
  sh('git', ['-C', dir, 'add', '-A']);
  sh('git', ['-C', dir, 'commit', '-q', '-m', 'Account app: first pass of the profile page']);
  sh('git', ['-C', dir, 'push', '-q']);
  state['p-profile'] = { number: n, branch };
  save();
  // What the page invents outside the library, recorded in the branch description where Studio shows it.
  try {
    await mcp('bridge_missing_pieces', { pr: n, record: true });
    log(`pieces #${n} recorded`);
  } catch (e) {
    log(`pieces #${n} not recorded: ${e.message.slice(0, 200)}`);
  }
}

async function states() {
  for (const item of OPEN) {
    const n = state[item.key]?.number;
    if (!n || item.kind === 'suggestion' || item.kind === 'docs-suggestion') continue;
    if (item.review) {
      const pr = ghJson('pr', 'view', String(n), '-R', REPO, '--json', 'isDraft');
      if (pr.isDraft) { await mcp('bridge_send_for_review', { pr: n }); log(`ready #${n} ${item.title ?? item.prTitle}`); }
    }
    if (item.comment && !state[item.key].commented) {
      await mcp('bridge_comment', { pr: n, body: item.comment });
      state[item.key].commented = true;
      save();
      log(`note  #${n}`);
    }
  }
  if (!state[LATE_MERGE.key]?.merged) {
    merge(await tokenPr(LATE_MERGE), LATE_MERGE.title);
    state[LATE_MERGE.key] = { merged: true };
    save();
  }
}

try {
  if (phase === 'check') await check();
  else if (phase === 'history') await history();
  else if (phase === 'open') await open();
  else if (phase === 'states') await states();
  else if (phase === 'all') { await history(); await open(); await states(); }
  else throw new Error(`Unknown phase "${phase}". Use check, history, open, states or all.`);
} finally {
  bridge?.close();
}
