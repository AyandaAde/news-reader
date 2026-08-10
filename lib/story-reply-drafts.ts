const STORAGE_KEY = "eilo-story-reply-drafts";

function draftKey(briefingId: string, storyId: string) {
  return `${briefingId}:${storyId}`;
}

function readDrafts(): Record<string, string> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {};
    }

    return JSON.parse(raw) as Record<string, string>;
  } catch {
    return {};
  }
}

function writeDrafts(drafts: Record<string, string>) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(drafts));
}

export function setStoryReplyDraft(
  briefingId: string,
  storyId: string,
  text: string,
) {
  const drafts = readDrafts();
  drafts[draftKey(briefingId, storyId)] = text;
  writeDrafts(drafts);
}

export function consumeStoryReplyDraft(
  briefingId: string,
  storyId: string,
): string {
  const drafts = readDrafts();
  const key = draftKey(briefingId, storyId);
  const draft = drafts[key] ?? "";
  delete drafts[key];
  writeDrafts(drafts);
  return draft;
}
