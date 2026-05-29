export type StringCache<K extends string = string> = {
  snapshot(entries: readonly { key: K; value: string }[]): void;
  get(key: K): string | undefined;
  has(): boolean;
  clear(): void;
};

export function createStringCache<K extends string = string>(): StringCache<K> {
  const cache = new Map<K, string>();

  return {
    snapshot(entries) {
      cache.clear();
      for (const { key, value } of entries) {
        cache.set(key, value);
      }
    },
    get(key) {
      return cache.get(key);
    },
    has() {
      return cache.size > 0;
    },
    clear() {
      cache.clear();
    },
  };
}
