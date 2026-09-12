#### Purpose

<!-- The problem this PR solves. Link the issue it fixes (e.g. "Fixes #123") and any related PRs in other mochify-js repos. -->
<!-- How the change works, so reviewers can spot mistakes in the implementation. -->

<!-- #### Breaking changes (only for breaking changes) -->
<!-- What breaks for users, and how they should migrate. -->

#### How to verify

<!-- How a reviewer can see this change working, e.g. steps to reproduce the problem and confirm it is fixed. If existing or new tests cover it, name them. -->

#### Checklist

- [ ] PR title follows Conventional Commits, with `!` for breaking changes
- [ ] Tests cover the change
- [ ] Matching PRs are open in mochify-js/cli or the driver repos if they need changes too (e.g. new options)
- [ ] `npm run lint`, `npm run prettier:check`, `npx tsc`, `npm run types:check` (then `npm run clean`) and `npm run coverage:check` pass locally
- [ ] No unrelated changes
