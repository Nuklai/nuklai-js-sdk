import { MillisecondsPerSecond } from "../constants/consts";

export function getUnixRMilli(now: number, add: number): bigint {
  let currentTime = now;
  if (currentTime < 0) {
    currentTime = Date.now();
  }
  const t = BigInt(currentTime) + BigInt(add);
  return t - (t % MillisecondsPerSecond);
}
