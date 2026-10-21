# Governance

How changes reach this design system. It follows the Bridge model; the full version lives in
[peterbono/ai-design-system-demo, docs/GOVERNANCE.md](https://github.com/peterbono/ai-design-system-demo/blob/main/docs/GOVERNANCE.md).

## Risk tiers

| Tier | Examples | Pull request | Approvals |
| ---- | -------- | ------------ | --------- |
| 1, low | Docs, story fixes, a token description edit | Ready for review | 1 owner |
| 2, medium | New component, new variant or prop, visual tweak with existing tokens | Draft until design review | Design and tech owner |
| 3, high | Token added, changed, renamed or removed; a new brand; guardrail files | Draft, labelled `tokens` | Design and tech owner, mandatory |

## Who reviews

`governance.owners` in `bridge.config.json`. In this demo one person holds both roles, so
`soloOwnerCanApproveBoth` is on and the owner override is allowed with a written reason.

## How changes arrive

- **Branches and pull requests** (`"changes": "direct"`): token changes, brands and docs open a `bridge/*` branch
  with a draft pull request.
- **Suggestions**: a designer without write access files the exact change as an issue labelled
  `bridge-suggestion` (`bridge propose --suggest`). The owners approve it there, a developer applies it.
- **Requests**: component work is a `component-change` issue a developer implements in a pull request that says
  `Closes #n`.
