import { VideoData } from "@/types/video";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMediaUrl(videoData: VideoData, fieldName: string) {
  const possibleUrl =
    (videoData as any)?.[fieldName]?.url ||
    (videoData as any)?.attributes?.[fieldName]?.data?.attributes?.url ||
    (videoData as any)?.attributes?.[fieldName]?.url ||
    (videoData as any)?.[fieldName]?.data?.attributes?.url;

  if (!possibleUrl) return undefined;

  const base =
    (process.env.NEXT_PUBLIC_STRAPI_URL as string) ||
    (process.env.STRAPI_URL as string) ||
    "";
  return `${base}${possibleUrl}`;
}
