import ImageKit from "imagekit";

import { ENV } from "../env.server";

let client: ImageKit | null = null;

export function isImageKitConfigured(): boolean {
  return Boolean(
    ENV.IMAGEKIT_PUBLIC_KEY &&
    ENV.IMAGEKIT_PRIVATE_KEY &&
    ENV.IMAGEKIT_URL_ENDPOINT,
  );
}

export function getImageKit(): ImageKit {
  if (!isImageKitConfigured()) {
    throw new Error(
      "ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, and IMAGEKIT_URL_ENDPOINT in .env",
    );
  }

  if (!client) {
    client = new ImageKit({
      publicKey: ENV.IMAGEKIT_PUBLIC_KEY ?? "",
      privateKey: ENV.IMAGEKIT_PRIVATE_KEY ?? "",
      urlEndpoint: ENV.IMAGEKIT_URL_ENDPOINT ?? "",
    });
  }

  return client;
}

export function imageKitFolder(...parts: string[]): string {
  const base = ENV.IMAGEKIT_FOLDER || "campuslink";
  const rest = parts.filter(Boolean).join("/");

  return rest ? `${base}/${rest}` : base;
}
