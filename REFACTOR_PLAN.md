# Autocalcy Refactor Plan

This plan breaks the highest-impact improvements into small, review-friendly pull requests.

## PR 1 — Secure Gemini API usage (highest priority)

### Goal
Move Gemini calls from the client to a server API route so secrets are never exposed in the browser bundle.

### Tasks
1. Add `app/api/ai/route.ts` and move Gemini SDK usage there.
2. Replace `NEXT_PUBLIC_GEMINI_API_KEY` with server-only `GEMINI_API_KEY`.
3. Update `app/components/AIInput.tsx` to call `/api/ai` instead of importing Gemini logic directly.
4. Add robust error responses and input validation in the API route.
5. Update README setup instructions.

### Acceptance checks
- No Gemini key is referenced from client code.
- API route returns valid JSON errors for bad requests.
- Existing AI calculator flow still works from UI.

## PR 2 — Replace dynamic expression execution

### Goal
Remove `new Function` usage in expression evaluation and move to a safer parser-based evaluator.

### Tasks
1. Add a safe math parser dependency (e.g. `expr-eval`), or implement a limited parser.
2. Keep an allowlist of operators and functions (`+ - * / ^ % sqrt sin cos tan log ln`).
3. Port `evaluateExpression` to parser-based execution.
4. Add unit tests for valid/invalid expressions and edge cases (division by zero, malformed input).

### Acceptance checks
- `new Function`/`eval` is not used for math evaluation.
- Invalid input is consistently rejected.
- Current supported expressions continue to work.

## PR 3 — Add tests for calculator core behavior

### Goal
Protect current behavior with tests before deeper refactors.

### Tasks
1. Add test setup (Vitest + React Testing Library).
2. Unit test `processButtonClick` workflows:
   - operator chaining
   - decimals
   - `%`
   - divide-by-zero
   - scientific functions
3. Unit test `history` helpers with localStorage mocking.
4. Add one UI smoke test for AI submit button enabled/disabled states.

### Acceptance checks
- `npm test` runs in CI/local.
- Core logic has baseline coverage on critical paths.

## PR 4 — Prompt maintainability cleanup

### Goal
Avoid prompt drift by keeping one source of truth.

### Tasks
1. Move system prompt to a dedicated module (or load from one canonical text file).
2. Update Gemini service code to import from that source.
3. Keep examples synchronized with calculator capabilities.

### Acceptance checks
- Prompt text exists in only one canonical location.
- Prompt changes are easy to review.

## PR 5 — State and component simplification

### Goal
Reduce complexity and dead code in state management and AI input flow.

### Tasks
1. Remove dead reducer logic and unused imports in `CalculatorContext`.
2. Split `AIInput` submit flow into focused functions:
   - request parsing
   - evaluation
   - animation
   - post-success state updates
3. Add typed error categories to improve user-facing error messages.

### Acceptance checks
- No unused imports/dead branches in touched modules.
- `AIInput` is easier to read and test.

## PR 6 — Small quality/hygiene fixes

### Goal
Apply low-risk consistency improvements.

### Tasks
1. Replace history ID generation with `crypto.randomUUID()` fallback.
2. Remove stray files not part of the product.
3. Document trig mode behavior (degrees vs radians) in UI/help text.

### Acceptance checks
- IDs are stable and collision-safe.
- Repository is cleaner and easier to maintain.

---

## Suggested execution order
1. PR 1 (security)
2. PR 2 (execution safety)
3. PR 3 (test safety net)
4. PR 4 (prompt maintainability)
5. PR 5 (state/component cleanup)
6. PR 6 (hygiene)

## Rollout notes
- Keep each PR small and independently releasable.
- Prefer feature parity first, optimization second.
- Validate each PR with lint + targeted tests before merge.
