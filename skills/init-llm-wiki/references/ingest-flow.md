# Mandatory Ingest Flow — Discuss First, Write After

To stay close to Karpathy's original LLM Wiki spirit, Ingest is **not** a batch task that "throws materials in and auto-generates cards." It is a human-machine collaborative curation process. The main session must complete the two phases below before deciding whether to dispatch sub-agents to create cards in parallel.

---

## Phase One — Discuss Key Takeaways

This step runs **first** and cannot be skipped. Focus is content-level conversation, not page planning.

1. **Read all raw materials awaiting processing** (from `00-Raw/`).
2. **Extract key takeaways by source**: 1–2 sentence summary per source, then core arguments, key concepts, important data, conflicts with or additions to existing wiki content, author limitations/assumptions. Do not preset quantities; list according to actual content.
3. **Present the takeaways to the user and discuss**:
   - What do these materials mainly say?
   - Which points are most valuable?
   - Which conflict with existing knowledge or need updating?
   - Does the user have anything to add, question, or especially emphasize?
4. **Adjust takeaway priorities based on user feedback.**

---

## Phase Two — Plan Page Schemes Based on Takeaways

Only after Phase One is confirmed do you translate discussion results into a concrete wiki writing plan.

1. **Propose a "Processing List for This Round"**:
   - New concept/entity cards
   - Existing pages that need updating
   - Comparison/algorithm pages worth creating
   - Overlapping topics suggested for merging or boundary clarification
   - Content not yet worth a standalone card but mentionable in existing pages
2. **Show the processing list to the user and wait for confirmation**: let the user see what will be written/changed/merged, ask whether any items need adjustment, addition, skipping, or merging.
3. **Only after user confirmation** dispatch sub-agents to create/update specific cards in parallel.
4. **After sub-agents complete, the main session performs deduplication and boundary clarification**, updating `index.md`, relevant overviews, and `log.md`.

---

## Sub-Agent Failure Handling

If a sub-agent fails or times out, the main session takes over and manually completes the corresponding cards to avoid blocking. See `WORKFLOWS.md` (created by this skill at init time) for the full workflow.