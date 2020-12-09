import isPlainObject from 'is-plain-object';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const isMobile = (() => {
  if (typeof navigator === 'undefined' || typeof navigator.userAgent !== 'string') {
    return false;
  }
  return /Mobile/.test(navigator.userAgent);
})();

export const isBrowser = (() => {
  return typeof window !== 'undefined';
})();

export const isTestEnv = (() => {
  return process.env.NODE_ENV === 'test';
})();

export function formatDate(date: Date) {
  const OneDayAgo = new Date().getTime() - 1 * 24 * 60 * 60 * 1000;

  return date.getTime() < OneDayAgo ? dayjs(date).format('dddd, MMMM D') : dayjs(date).fromNow();
}

// This function ensures that the user has granted the browser permission to use audio and video
// devices. If permission has not been granted, it will cause the browser to ask for permission
// for audio and video at the same time (as opposed to separate requests).
export async function ensureMediaPermissions() {
  const devices = await navigator.mediaDevices.enumerateDevices();
  const shouldAskForMediaPermissions = devices.every(
    (device) => !(device.deviceId && device.label),
  );
  if (shouldAskForMediaPermissions) {
    return navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((mediaStream) => mediaStream.getTracks().forEach((track) => track.stop()));
  }
}

// Recursively removes any object keys with a value of undefined
export function removeUndefineds<T>(obj: T): T {
  if (!isPlainObject(obj)) return obj;

  const target: { [name: string]: any } = {};

  for (const key in obj) {
    const val = obj[key];
    if (typeof val !== 'undefined') {
      target[key] = removeUndefineds(val);
    }
  }

  return target as T;
}
