# Seeding the demo

This repository is the public demo of Bridge. Its branches, pull requests and issues are real GitHub data, written
by `scripts/seed-demo.mjs` through the Bridge MCP server (`npx @bridge-ds/cli mcp --repo peterbono/bridge-demo-ds`),
so they carry the same bodies, labels, tiers and checks as a team using Bridge would get.

The people named in the changes (Ann Leroy, Leo Martin, Dana Moreau) are fictional requesters. They only appear in
the text of a change. Every GitHub action is done by the account that runs the script.

## What the script writes

| Phase | What | How |
| --- | --- | --- |
| `history` | Past changes merged to main: token changes, docs, an applied suggestion, a fix that closes a request, an adoption fix in the Account app | `bridge_propose_token_change`, `bridge_save_docs`, `bridge apply`, plain branches for code, then a squash merge |
| `open` | The changes waiting for review: 6 token changes, 4 component changes (each closes a request), 2 docs changes (one drafted by Claude), a new brand, 3 suggestions, 3 requests nobody started, a product branch in the Account app | Bridge MCP tools; component code from `scripts/seed/patches/*.patch` |
| `states` | Send for review (some stay draft), owner comments, and one late merge that changes the token a suggestion edits, so that suggestion is outdated | `bridge_send_for_review`, `bridge_comment`, a token change merged last |

The plan (titles, summaries, edits) lives in `scripts/seed/plan.mjs`. `scripts/seed/state.json` records what each
item became (pull request or issue number).

## Run it

Needs node 20 or later, git, and `gh` signed in with write access to the repository.

```sh
node scripts/seed-demo.mjs check     # dry run of every token, docs and brand change: tier, contrast, nothing written
node scripts/seed-demo.mjs history
node scripts/seed-demo.mjs open
node scripts/seed-demo.mjs states
```

Each step skips an item whose pull request or issue already exists with the same title, so a phase can be run again
after a failure.

## Refresh from scratch

The demo ages: merged changes leave "this month", open branches fall behind main. To start over:

1. Delete the repository (`gh repo delete peterbono/bridge-demo-ds`), recreate it from the initial commit (the
   design system copy, `bridge.config.json`, the `bridge-data` workflow) and push.
2. Delete `scripts/seed/state.json`.
3. Run the four commands above.

To only top up: close or merge some open pull requests, remove their entries from `state.json`, run `open` and
`states` again.

## Limits, on purpose

- **Approvals.** GitHub refuses self-approval on a pull request, and Bridge ignores the author's own review of a
  suggestion. With one account, nothing here can show as approved or as changes requested. A second owner listed in
  `governance.owners` would make those states real.
- **Deprecation.** Bridge's token edits have no `$deprecated` operation, so the deprecation is a plain commit with
  the same labels and body shape.
- **Component code.** Bridge files requests for components; the code is a branch and pull request that says
  `Closes #n`, as a developer (or their Claude) would open it.
