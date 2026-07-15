export function track(event: string, props: Record<string, any>) {
  console.log(`[Analytics] Event: ${event}`, props);
}
