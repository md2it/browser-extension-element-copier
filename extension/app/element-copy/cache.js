function createStringCache() {
  const cache2 = /* @__PURE__ */ new Map();
  return {
    snapshot(entries) {
      cache2.clear();
      for (const { key, value } of entries) {
        cache2.set(key, value);
      }
    },
    get(key) {
      return cache2.get(key);
    },
    has() {
      return cache2.size > 0;
    },
    clear() {
      cache2.clear();
    }
  };
}

export { createStringCache };
