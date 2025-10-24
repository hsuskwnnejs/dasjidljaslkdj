// src/features/remote-media/remote-media.ts
import { get, set } from "idb-keyval";
import { MediaLink, MediaType } from "@/types/Media";

const REMOTE_MEDIA_KEY = "remote-media";

/**
 * Return stored array of strings (URLs).
 */
export async function getRemoteMediaUrls(): Promise<string[]> {
  const arr = (await get<string[]>(REMOTE_MEDIA_KEY)) || [];
  return arr;
}

/**
 * Persist array of urls.
 */
export async function setRemoteMediaUrls(urls: string[]): Promise<void> {
  await set(REMOTE_MEDIA_KEY, urls);
}

/**
 * Heuristically infer MediaType from URL extension.
 */
function urlToMediaType(url: string): MediaType {
  const lower = url.split("?")[0].split("#")[0].toLowerCase();
  if (lower.endsWith(".mp4") || lower.endsWith(".webm") || lower.endsWith(".mov") || lower.endsWith(".m4v")) {
    return MediaType.Video;
  }
  if (lower.endsWith(".gif")) {
    return MediaType.Gif;
  }
  if (/\.(jpe?g|png|bmp|webp|avif)$/.test(lower)) {
    return MediaType.Picture;
  }
  return MediaType.Picture;
}

/**
 * Convert urls to MediaLink[] in the same shape used elsewhere.
 */
export async function getRemoteMediaLinks(): Promise<MediaLink[]> {
  const urls = await getRemoteMediaUrls();
  return urls
    .map((u) => {
      if (!u) return undefined;
      try {
        const parsed = new URL(u);
        const direct = parsed.toString();
        return {
          sourceLink: u,
          directLink: direct,
          mediaType: urlToMediaType(u),
        } as MediaLink;
      } catch (e) {
        return undefined;
      }
    })
    .filter((l): l is MediaLink => Boolean(l));
}

/**
 * Add one url (deduplicated).
 */
export async function addRemoteMediaUrl(url: string): Promise<void> {
  const list = await getRemoteMediaUrls();
  if (!list.includes(url)) {
    list.push(url);
    await setRemoteMediaUrls(list);
  }
}

/**
 * Remove one url.
 */
export async function removeRemoteMediaUrl(url: string): Promise<void> {
  const list = await getRemoteMediaUrls();
  const filtered = list.filter((x) => x !== url);
  await setRemoteMediaUrls(filtered);
}
