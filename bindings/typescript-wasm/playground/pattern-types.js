// Which STIX object types a pattern compares, and which of those can never
// match because they are not cyber-observable objects (SCOs).

export const SCO_TYPES = new Set([
  "artifact", "autonomous-system", "directory", "domain-name", "email-addr", "email-message",
  "file", "ipv4-addr", "ipv6-addr", "mac-addr", "mutex", "network-traffic", "process", "software",
  "url", "user-account", "windows-registry-key", "x509-certificate",
]);

/** Distinct object types of every object path in a parsed AST or IR (first-seen order). */
export function objectTypesOf(node) {
  const found = new Set();
  const walk = (n) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== "object") return;
    for (const [k, v] of Object.entries(n)) {
      if (k === "object_type" && typeof v === "string") found.add(v);
      else walk(v);
    }
  };
  walk(node);
  return [...found];
}

/** Types that are neither SCOs nor custom (`x-`) types. */
export function nonObservableTypes(types) {
  return types.filter((t) => !SCO_TYPES.has(t) && !t.startsWith("x-"));
}
