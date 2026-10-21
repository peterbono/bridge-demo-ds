// Minimal MCP stdio client for the Bridge MCP server (newline-delimited JSON-RPC). No dependency.
import { spawn } from 'node:child_process';
import { execFileSync } from 'node:child_process';

export async function connectBridge({ repo, cli = '@bridge-ds/cli@0.11.1', cwd } = {}) {
  const token = process.env.GITHUB_TOKEN || execFileSync('gh', ['auth', 'token'], { encoding: 'utf8' }).trim();
  const child = spawn('npx', ['-y', cli, 'mcp', '--repo', repo], {
    cwd,
    env: { ...process.env, GITHUB_TOKEN: token },
    stdio: ['pipe', 'pipe', 'pipe'],
  });
  child.stderr.on('data', (d) => { if (process.env.SEED_DEBUG) process.stderr.write(d); });
  let buf = '';
  let id = 0;
  const pending = new Map();
  child.stdout.on('data', (d) => {
    buf += d;
    let i;
    while ((i = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, i).trim();
      buf = buf.slice(i + 1);
      if (!line) continue;
      let msg;
      try { msg = JSON.parse(line); } catch { continue; }
      if (msg.id !== undefined && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
      }
    }
  });
  const request = (method, params) => new Promise((resolve, reject) => {
    const n = ++id;
    pending.set(n, { resolve, reject });
    child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id: n, method, params }) + '\n');
  });
  const notify = (method, params) => child.stdin.write(JSON.stringify({ jsonrpc: '2.0', method, params }) + '\n');
  await request('initialize', { protocolVersion: '2025-06-18', capabilities: {}, clientInfo: { name: 'bridge-demo-seed', version: '1.0.0' } });
  notify('notifications/initialized', {});
  return {
    listTools: async () => (await request('tools/list', {})).tools,
    async call(name, args) {
      const res = await request('tools/call', { name, arguments: args });
      const text = (res.content ?? []).filter((c) => c.type === 'text').map((c) => c.text).join('\n');
      let json;
      try { json = JSON.parse(text); } catch { json = undefined; }
      return { isError: !!res.isError, text, json, structured: res.structuredContent };
    },
    close: () => child.kill(),
  };
}
