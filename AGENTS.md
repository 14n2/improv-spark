
# Improv Spark — Agent Instructions

## Project

Improv Spark is a lightweight random prompt generator
for improvisational theatre.

The MVP generates Chinese location prompts for
workshops, rehearsals, and individual practice.

## Source of truth

- The approved PRD is located in `docs/`.
- Find and read the relevant PRD sections before
  implementing a feature.
- Do not silently change approved product requirements.
- If requirements conflict, explain the conflict
  before implementation.

## Tech stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Vitest for logic tests
- GitHub Pages for deployment

Web MVP first. A future version may migrate to
Taro for WeChat Mini Programs.

## Architecture

- Keep UI components separate from business logic.
- Keep randomization logic independent of React.
- Store location prompts in a local JSON file.
- Use TypeScript with explicit, meaningful types.
- Prefer simple solutions over unnecessary abstractions.
- Avoid backend services, databases, authentication,
  and external APIs for the MVP.

## Core behavior

- Exactly 40 unique Chinese location prompts.
- Draw exactly one location at a time.
- Use Fisher–Yates shuffle with a shuffle bag.
- No duplicates within a cycle.
- Reshuffle automatically after all prompts are drawn.
- Avoid immediate repetition across cycle boundaries.
- Reset drawing state when the page reloads.
- Do not persist or display drawing history.
- Animate text changes for 1–2 seconds.
- Keep the result visible until the next draw.
- Prevent repeated draws during animation.

## Design

- Mobile-first responsive design.
- Playful, creative visual style.
- Soft, low-saturation colors.
- Modern sans-serif typography.
- One large centered card.
- No sound effects.
- No theatre troupe branding.
- Use Tailwind CSS for styling.
- Respect reduced-motion preferences.

## Development workflow

1. Inspect relevant existing files before editing.
2. For substantial tasks, present a short plan first.
3. Implement only the requested scope.
4. Add or update tests for changed business logic.
5. Run applicable tests, lint, and build commands.
6. Review the diff for unintended modifications.
7. Report changes, validation results, and limitations.

Do not claim tests passed unless they were run.

## Safety and scope

- Do not modify the PRD without explicit approval.
- Do not add dependencies without explaining why.
- Do not introduce features outside the approved MVP.
- Do not make destructive changes without approval.
- Do not create commits, push, or deploy without
  explicit user approval.
- Never commit credentials or secrets.
- Avoid unrelated refactoring.
- Keep changes small and reviewable.

## Completion report

At the end of each task, summarize:

- Files created or modified
- Functionality implemented
- Tests and build results
- Remaining issues or follow-up tasks
