// The sample changes of the Bridge demo. Every item becomes real GitHub data in peterbono/bridge-demo-ds, written
// with the Bridge MCP server (`@bridge-ds/cli mcp --repo ...`) or, for component code, as a plain branch and pull
// request the way a developer implements a request. The people named here are fictional requesters: their names only
// appear inside the text (summaries, notes, bodies). Every GitHub action is done by the account behind the token.
//
// Phases, in order (see docs/SEEDING.md):
//   history  changes merged to main, so History, Activity and "merged this month" have data
//   open     the changes waiting for review, the requests and the product branch
//   states   send for review, owner comments, and one late merge that makes a suggestion outdated

// ---------------------------------------------------------------- history: merged to main

export const HISTORY = [
  {
    key: 'h-compact-rows',
    kind: 'token',
    title: 'Raise the table row height in compact density',
    summary:
      'Leo found that compact tables cut descenders on two-line cells in the Account app invoices. One size step up (36 to 40px) keeps compact tables dense and readable.',
    edits: [{ op: 'set', path: 'table.row-height', value: '{size.10}', mode: { density: 'compact' } }],
  },
  {
    key: 'h-raised-description',
    kind: 'token',
    title: 'Describe when to use the raised surface',
    summary: 'Designers kept asking whether a card or a popover should use surface.raised. The description now says it.',
    edits: [
      { op: 'set', path: 'color.surface.raised', description: 'Things that float above the page: popovers, menus, dropdowns. Cards that sit on the page use surface.default.', mode: { theme: 'light' } },
      { op: 'set', path: 'color.surface.raised', description: 'Things that float above the page: popovers, menus, dropdowns. Cards that sit on the page use surface.default.', mode: { theme: 'dark' } },
    ],
  },
  {
    key: 'h-warning-text',
    kind: 'token',
    title: 'Darken warning text on light banners',
    summary:
      'Warning banners read as washed out next to danger and info. Ann asked for one step darker so the three tones carry the same weight.',
    edits: [{ op: 'set', path: 'color.feedback.warning.text', value: '{palette.warning.800}', mode: { theme: 'light' } }],
  },
  {
    key: 'h-slow-motion',
    kind: 'token',
    title: 'Slow down drawer and toast entrance',
    summary: 'Drawers felt abrupt on large screens. 400ms gives the panel time to read as sliding in, not popping.',
    edits: [{ op: 'set', path: 'motion.duration.slow', value: '{duration.400}' }],
  },
  {
    key: 'h-signal-dark',
    kind: 'token',
    title: 'Brighter signal color in dark theme',
    summary: 'The new-item dot and the selected tab underline were hard to spot on dark surfaces. One step brighter fixes it.',
    edits: [{ op: 'set', path: 'color.signal.default', value: '{palette.accent.300}', mode: { theme: 'dark' } }],
  },
  {
    key: 'h-button-docs',
    kind: 'docs',
    component: 'Button',
    title: 'Button: say when the ghost button fits',
    docs: {
      whenNotToUse: [
        'Navigation to another page: use Link, or Button with render={<a href="..." />} so it stays a link.',
        'A ghost button as the only action of a dialog or a form: people miss it. Use primary.',
        'Destructive actions that cannot be undone without a confirmation: use danger and an AlertDialog.',
      ],
    },
  },
  {
    key: 'h-card-docs',
    kind: 'docs',
    component: 'Card',
    title: 'Card: guidance for tables inside a card',
    docs: {
      contentGuidelines: [
        'Header: a noun phrase that names what the card holds, sentence case, no trailing period.',
        'Body: one idea per card. Two ideas are two cards.',
        'Tables inside a card: set padding="none" so the rows reach the edges and line up with the header divider.',
      ],
    },
  },
  {
    key: 'h-focus-offset-suggestion',
    kind: 'suggestion-applied',
    title: 'Explain the focus ring offset',
    summary: 'Dana asked why the focus ring floats 2px away from inputs. The description now says why, for designers reading the token in Figma.',
    edits: [
      { op: 'set', path: 'focus.ring.offset', description: 'Gap between the control and its focus ring, so the ring stays visible on any fill and border.', mode: { theme: 'light' } },
      { op: 'set', path: 'focus.ring.offset', description: 'Gap between the control and its focus ring, so the ring stays visible on any fill and border.', mode: { theme: 'dark' } },
    ],
  },
  {
    key: 'h-spinner-reduced-motion',
    kind: 'code',
    patch: 'h-spinner-reduced-motion.patch',
    branch: 'agent/request-spinner-reduced-motion',
    request: {
      component: 'Spinner',
      kind: 'bug',
      title: 'Spinner spins at full speed with reduced motion on',
      summary:
        'With Reduce motion turned on in macOS, the Spinner still turns at full speed in the Account app. It should slow down but keep turning, so people still see that something is running.',
      changes: [{ field: 'animation under reduced motion', before: 'full speed', after: 'slower turn' }],
    },
    prTitle: 'Spinner: slow the turn under reduced motion',
    prBody: (n) => `## What changed and why\n\nThe Spinner turns three times slower when the system asks for reduced motion. It keeps turning: a stopped spinner reads as frozen.\n\nCloses #${n}\n\n## Risk tier\n\n- [x] Tier 1: low risk, one code owner (an accessibility fix with no visual change by default)\n\n## Checks\n\n- No token change. The duration still reads \`--motion-duration-spin\`.\n- Changeset: \`patch\`.\n`,
    labels: ['tier: 1'],
  },
  {
    key: 'h-account-tokens',
    kind: 'code',
    patch: 'h-account-app-tokens.patch',
    branch: 'account/use-tokens',
    prTitle: 'Account app: use tokens for page width, row borders and muted text',
    prBody: () => `## What changed and why\n\nThe adoption audit listed three values in the Account app that equal a token exactly. They now read the token, so the page follows density and brand changes.\n\n- \`960px\` to \`var(--size-240)\`\n- \`1px\` to \`var(--border-width-default)\`\n- \`14px\` to \`var(--font-size-200)\`\n\nThe usage bar color and the plan price size have no exact token yet and stay as they are.\n`,
    labels: ['product: account'],
  },
];

// ---------------------------------------------------------------- open: waiting for review

export const OPEN = [
  // Token changes (pull requests, Tier 3 unless the classifier says otherwise)
  {
    key: 't-primary',
    kind: 'token',
    title: 'Deepen the primary blue for stronger buttons',
    summary:
      'In usability sessions, the primary button on the Billing page got lost next to the blue usage bar. A slightly deeper Harbor 700 separates the action from data colors and raises white-on-blue contrast.',
    edits: [{ op: 'set', path: 'color.harbor.700', value: '#0a4380' }],
    review: true,
  },
  {
    key: 't-space-14',
    kind: 'token',
    title: 'Add a 56px spacing step for page sections',
    summary:
      'Account pages jump from 48 to 64px between sections, and Dana keeps hand-typing 56px in Figma. A space.14 step makes that gap a token instead of a one-off.',
    edits: [{ op: 'add', path: 'space.14', value: '56px', type: 'dimension', description: 'Between page sections on roomy layouts.' }],
    review: true,
    comment:
      'Before we add a step: could space.12 (48px) cover the Billing page sections if the cards lose their top margin? If not, 56 is fine with me. Please add one story that shows it next to 48 and 64.',
  },
  {
    key: 't-radius',
    kind: 'token',
    title: 'Tighter card and panel corners',
    summary:
      'Cards at 20px read soft next to the 12px controls inside them. Ann suggests 16px for containers, so cards and inputs feel like one family. Overlays keep 20px.',
    edits: [{ op: 'set', path: 'radius.container', value: '{radius.2xl}', file: 'brands/bridge.tokens.json' }],
    review: false,
  },
  {
    key: 't-dark-muted',
    kind: 'token',
    title: 'Fix muted text contrast on dark raised surfaces',
    summary:
      'Helper text under inputs inside dark popovers sits close to the AA limit. One step lighter for muted text in dark theme gives every pair room.',
    edits: [{ op: 'set', path: 'color.text.muted', value: '{palette.neutral.300}', mode: { theme: 'dark' } }],
    review: true,
  },
  {
    key: 't-highlight',
    kind: 'token',
    title: 'Add a highlight surface for new items',
    summary:
      'Product wants rows that just arrived (a new invoice, a new teammate) to stand out for a moment. A semantic surface.highlight keeps that tint consistent in light and dark instead of each team picking a blue.',
    edits: [
      { op: 'add', path: 'color.surface.highlight', value: '{palette.accent.50}', type: 'color', description: 'Rows and cards that just arrived. Fades back to the default surface.', file: 'semantic/light.tokens.json' },
      { op: 'add', path: 'color.surface.highlight', value: '{palette.accent.950}', type: 'color', description: 'Rows and cards that just arrived. Fades back to the default surface.', file: 'semantic/dark.tokens.json' },
    ],
    review: true,
  },
  {
    key: 't-deprecate-zone',
    kind: 'deprecation',
    branch: 'bridge/deprecate-color-bg-zone',
    title: 'Deprecate color.bg.zone',
    path: 'color.bg.zone',
    files: ['semantic/light.tokens.json', 'semantic/dark.tokens.json'],
    deprecated: 'Use color.agent.surface for areas Claude wrote, or color.bg.subtle for a quiet band. Removed in 2.0.',
    summary:
      'Nothing in the components reads color.bg.zone any more, and designers confuse it with color.agent.surface (same value in both themes). Marking it deprecated first gives product teams one release to move before it is removed.',
    review: true,
  },

  // Component changes (code: a request issue, then a pull request that closes it)
  {
    key: 'c-profile-header',
    kind: 'code',
    patch: 'c1-profile-header.patch',
    branch: 'agent/request-profile-header',
    request: {
      component: 'ProfileHeader',
      kind: 'new-component',
      title: 'New ProfileHeader for profile and account pages',
      summary:
        'Dana is designing the Account app profile page and rebuilt the same avatar, name and role block three times in Figma. A ProfileHeader next to PageHeader would give every profile the same top.',
      changes: [
        { field: 'component', after: 'ProfileHeader' },
        { field: 'parts', after: 'avatar, name, subtitle, meta, actions' },
      ],
      product: 'account',
    },
    prTitle: 'New ProfileHeader component',
    prBody: (n) => `## What changed and why\n\nA ProfileHeader for pages about one person: avatar (lg), the name as a real heading, a subtitle, optional meta and up to two actions. Built from Avatar and the PageHeader rhythm, tokens only.\n\nCloses #${n}\n\n## Risk tier\n\n- [x] Tier 2: new component, design review then design and tech approval\n\n## How it meets the UI quality bar\n\n- Progressive disclosure: name and role first, meta and actions only when given.\n- Gestalt: actions sit on the same row as the name they act on, and wrap under it on narrow screens.\n- Fitts: actions are DS Buttons at control height.\n\n## Checks\n\n- \`ProfileHeader.docs.json\` with every section, \`AllStates\` story with a long name in a narrow container.\n- No new token. Changeset: \`minor\`.\n`,
    labels: ['tier: 2'],
    review: true,
    comment: 'Looks right in light and dark. One question for design: should the avatar go xl (64px) once the Avatar xl branch ships? Fine to merge as lg first.',
  },
  {
    key: 'c-button-loading',
    kind: 'code',
    patch: 'c2-button-loading-label.patch',
    branch: 'agent/request-button-loading-label',
    request: {
      component: 'Button',
      kind: 'prop-change',
      title: 'Button: change the label while loading',
      summary:
        'On Save, the button shows a spinner but still says "Save changes", and screen reader users hear nothing. Ann asks for a loading label ("Saving") that is announced once.',
      changes: [{ field: 'loadingLabel', before: '', after: 'text shown and announced while loading' }],
    },
    prTitle: 'Button: loadingLabel announces the action while it runs',
    prBody: (n) => `## What changed and why\n\nNew \`loadingLabel\` prop. While \`loading\` is on, the label switches ("Save changes" becomes "Saving") inside a polite live region, so screen readers hear it once. Without the prop nothing changes.\n\nCloses #${n}\n\n## Risk tier\n\n- [x] Tier 2: new prop, design review then design and tech approval\n\n## Checks\n\n- New \`LoadingLabel\` story. Button width can change with the label: check it in toolbars.\n- No new token. Changeset: \`minor\`.\n`,
    labels: ['tier: 2'],
    review: true,
  },
  {
    key: 'c-card-subtle',
    kind: 'code',
    patch: 'c3-card-subtle.patch',
    branch: 'agent/request-card-subtle',
    request: {
      component: 'Card',
      kind: 'new-variant',
      title: 'Card: a subtle tone for secondary groups',
      summary:
        'Side panels like "Before you invite people" compete with the main form because every card has the same border. Dana asks for a quieter card: tinted, no border.',
      changes: [{ field: 'tone', before: 'default', after: 'subtle' }],
    },
    prTitle: 'Card: subtle tone for secondary groups',
    prBody: (n) => `## What changed and why\n\n\`tone="subtle"\` paints the card with \`color.bg.subtle\` and drops the hairline border, so secondary groups step back from the main content.\n\nCloses #${n}\n\n## Risk tier\n\n- [x] Tier 2: new variant with existing tokens\n\n## Checks\n\n- New \`Subtle\` story. Check the tint against the page background in dark theme.\n- No new token. Changeset: \`minor\`.\n`,
    labels: ['tier: 2'],
    review: false,
  },
  {
    key: 'c-avatar-xl',
    kind: 'code',
    patch: 'c4-avatar-xl.patch',
    branch: 'agent/request-avatar-xl',
    request: {
      component: 'Avatar',
      kind: 'new-variant',
      title: 'Avatar: an xl size for profile pages',
      summary: 'The profile page mock uses a 64px avatar. Avatar stops at lg (40px), so the Account app scales it by hand.',
      changes: [{ field: 'size', before: 'xs, sm, md, lg', after: 'xs, sm, md, lg, xl' }],
      product: 'account',
    },
    prTitle: 'Avatar: xl size for profile pages',
    prBody: (n) => `## What changed and why\n\nNew \`size="xl"\`: 64px tile, 40px illustrated mark, initials at \`font-size-300\`. Guidance says once per page, for the person the page is about.\n\nCloses #${n}\n\n## Risk tier\n\n- [x] Tier 2: new variant with existing tokens\n\n## Checks\n\n- Story control lists xl. No new token. Changeset: \`minor\`.\n`,
    labels: ['tier: 2'],
    review: true,
  },

  // Docs guidance
  {
    key: 'd-tabs',
    kind: 'docs',
    component: 'Tabs',
    title: 'Tabs: when tabs are the wrong choice',
    notes: 'Ann wrote this after the checkout review, where a four-step flow was built with Tabs.',
    docs: {
      whenNotToUse: [
        'Steps people go through in order (checkout, onboarding): use a stepper or separate pages.',
        'Comparing content side by side: tabs hide one side. Show both.',
        'More than six labels, or labels that wrap: use SidebarNav or a Select.',
      ],
    },
    review: true,
  },
  {
    key: 'd-slider-claude',
    kind: 'docs',
    component: 'Slider',
    title: 'Slider: usage guidance drafted by Claude',
    docs: {
      summary: 'Picks a value, or a range, on a continuous scale where the exact number matters less than the position.',
      whenToUse: [
        'Settings people tune by feel and check right away: volume, zoom, a price range filter.',
        'Pair it with a NumberField when people also need to type an exact value.',
      ],
      whenNotToUse: [
        'Exact values such as a quantity or an amount of money: use NumberField.',
        'A handful of named choices: use SegmentedControl or RadioGroup.',
      ],
      accessibility: [
        'Every thumb has an accessible name: the visible label, or aria-label for each end of a range.',
        'Arrow keys move one step, Page Up and Page Down move ten, Home and End jump to the ends.',
        'Show the current value as text next to the slider: color and position alone do not say it.',
      ],
    },
    // Claude wrote this prose. Like the Docs drafts workflow, a second commit on the branch records it in the file
    // ("draftedBy": "claude", "needsReview": true), so Studio shows "Draft by Claude, needs review".
    claudeDraft: true,
    notes: 'Slider had no usage guidance. Claude drafted it from the component code and the design language; it needs a designer to read it before it ships.',
    review: true,
  },

  // New brand
  {
    key: 'b-forest',
    kind: 'brand',
    slug: 'forest',
    name: 'Forest',
    from: 'bridge',
    primary: '#1F5F3A',
    neutral: '#2A2F2C',
    radius: 'soft',
    notes:
      'The sustainability product launches in March with a green identity. Forest reuses every component and swaps palette and radius roles only. Brand guidelines from the marketing team, primary #1F5F3A.',
    review: true,
  },

  // Suggestions from designers (issues labelled bridge-suggestion)
  {
    key: 's-moderate-motion',
    kind: 'suggestion',
    title: 'Snappier dialogs and accordions',
    summary: 'Dana: dialogs and accordions feel a beat slow next to menus. 180ms would match how fast people click through settings.',
    edits: [{ op: 'set', path: 'motion.duration.moderate', value: '180ms' }],
  },
  {
    key: 's-dark-emphasis-border',
    kind: 'suggestion',
    title: 'Clearer emphasis borders in dark theme',
    summary: 'Ann: in dark theme the emphasis border on selected cards almost disappears on raised surfaces. One step lighter keeps it visible.',
    edits: [{ op: 'set', path: 'color.border.emphasis', value: '{palette.neutral.600}', mode: { theme: 'dark' } }],
  },
  {
    key: 's-empty-state-docs',
    kind: 'docs-suggestion',
    component: 'EmptyState',
    title: 'EmptyState: always offer the next step',
    docs: {
      contentGuidelines: [
        'Title: what is empty, in plain words ("No invoices yet"), not an error.',
        'Description: why it is empty and what will fill it, one sentence.',
        'Action: the next step people can take from here ("Create an invoice"). Leave it out only when there is nothing to do.',
      ],
    },
  },
];

// Requests nobody started yet (status: requested)
export const REQUESTS = [
  {
    component: 'Toast',
    kind: 'prop-change',
    title: 'Toast: an undo action after deleting',
    summary: 'After deleting a teammate or an invoice draft, people want a few seconds to undo. Leo asks for an action slot on Toast with a longer timeout when it is used.',
    changes: [{ field: 'action', after: 'one button, e.g. Undo' }],
    product: 'account',
  },
  {
    component: 'Table',
    kind: 'prop-change',
    title: 'Table: keep the header visible on scroll',
    summary: 'Invoice tables run past the fold and people lose track of the columns. A stickyHeader option would keep the header row in view.',
    changes: [{ field: 'stickyHeader', before: 'none', after: 'boolean' }],
  },
  {
    component: 'Select',
    kind: 'new-variant',
    title: 'Select: search field when there are many options',
    summary: 'The country select in Billing lists every country. Dana suggests a search field at the top of the list past 10 options, or a guidance note to use Combobox instead.',
    changes: [{ field: 'searchable', after: 'search field past 10 options' }],
  },
];

// A product branch: an exploration in the Account app that needs pieces the library lacks
export const PRODUCT_BRANCH = {
  name: 'Profile page',
  purpose: 'Try the new profile page in the Account app with real components before the library has a ProfileHeader. Dana tests it with customers next week.',
  useCase: 'user-test',
  product: 'account',
  experimental: ['Account app: profile page', 'ProfileHeader (not in the library yet)'],
  file: 'apps/account/src/pages/Profile.tsx',
  css: 'apps/account/src/profile.module.css',
};

// The late merge of the states phase: it changes the token suggestion s-moderate-motion edits, so that
// suggestion no longer applies cleanly (outdated).
export const LATE_MERGE = {
  key: 'h-moderate-250',
  kind: 'token',
  title: 'Give dialogs a little more time to settle',
  summary: 'Leo measured that the dialog content shifts while it fades in at 200ms on slower laptops. 250ms lets it land before the fade ends.',
  edits: [{ op: 'set', path: 'motion.duration.moderate', value: '{duration.250}' }],
};
