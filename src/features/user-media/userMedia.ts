export function getUserMediaLinks(): string[] {
  const stored = localStorage.getItem("userMediaLinks");
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveUserMediaLinks(links: string[]) {
  localStorage.setItem("userMediaLinks", JSON.stringify(links));
}
