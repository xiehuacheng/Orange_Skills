# Creating Skills — Waiting & Forward-Test Protocol

Complements `SKILL.md`. Read when you reach a human-in-the-loop checkpoint (Step 1-7) or are about to declare a skill done.

## While Waiting for the User

Skill creation has many human-in-the-loop checkpoints. Between them, you have **no work to do**. "Stay ready and answer briefly" is not obvious, so this file defines what waiting looks like.

### Do all of the following — no more, no less

1. Show a brief, evidence-anchored status line at the top of your reply: where you are, what is blocking, what action you want from the user.
2. List the asset(s) needed for the user to act (file path, link, screenshot).
3. Optionally explain why you cannot proceed, but only in one or two sentences. Do not re-litigate earlier decisions.
4. Do **not** run any other tool calls. Do **not** start a subagent. Do **not** preempt the user's reply with "while we wait, let me also…".

### Do not do these while waiting

- Re-read the same file repeatedly.
- Re-ask the same question via `AskUserQuestion`.
- Issue a foreground `bash` to simulate progress (no progress to simulate).
- Mark a TodoList task as `in_progress` and leave it there. Use one of: `in_progress` if the wait is actively your turn (rare); `drop` if the user went silent; or omit the task from the active list entirely and add it back when the user returns.

### When the user returns

Do not re-summarize the whole conversation. Pick up where you left off in one sentence and resume the next step.

---

## Forward-Test Protocol (mandatory before declaring "done")

The forward-test exists to verify that a **clean** agent — one with no context from your creation session — can use the skill correctly. This is the only forward-test that proves anything. Running the skill yourself ("I copied template.tex to `/tmp` and ran `tectonic`") is **not** a forward-test; it tests LaTeX, not the skill.

### Procedure

1. Spawn a subagent with the `default` (task) worker. **Do not give it any history, recap, or summary of the creation conversation.**
2. In the subagent's first message, give only:
   - The skill's path (`file://` or `skill://`).
   - A **realistic single user request** representative of when this skill should trigger (the request must include the trigger phrases listed in your skill's `description`).
   - A clean working directory (e.g. `/tmp/forward-test-<skill-name>/`).
3. Do **not** include: the creation transcript, your design rationale, your hypotheses, the test plan, expected outputs, or anything else. The subagent sees only the skill and the user request.
4. Let the subagent run to completion. Read the artifacts it produced.
5. Pass criteria (all of these):
   - The subagent triggered the skill (read the SKILL.md).
   - It followed the skill's own workflow in order.
   - It stopped at every approval point in the SKILL.md.
   - Its output respects the skill's "Cannot do" boundaries.
   - Its output style matches the "Default behavior" declarations.
6. Fail criteria (any of these means the skill is **not** done):
   - The subagent skipped a step.
   - The subagent did something the "Cannot do" section forbids.
   - The subagent never read the SKILL.md and went freestyle.
   - The subagent asked the user for things the skill said it would default.
7. If the test fails, **fix the SKILL.md**. Do not patch the test, do not patch the subagent's behavior, do not rewrite the skill to match what the subagent *did*. Rewrite until the clean subagent does the right thing.

When the forward-test passes, only then is the skill done. Bump the skill `version` whenever behavior changes.

---

## Subagent Delegation Patterns

### Don't

- Embedding the full creation transcript as context for a subagent. The subagent should see only what a real user would see: the skill and the trigger.
- Asking a subagent to "do forward-test of skill X" and giving it the skill's source code inline. Give a path; let the subagent read.
- Forward-testing multiple skills in the same subagent session. One skill per session or your failure attribution becomes meaningless.

### Do

- Use the `task` (default worker) agent for forward-tests unless you have a specific reason to use a specialist.
- Read the subagent's transcript before deciding pass/fail. Look for: did it read the skill, did it stop at approval points, did it respect boundaries, did it ask the things the default should handle.