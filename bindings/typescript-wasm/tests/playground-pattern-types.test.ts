import { describe, expect, it } from "vitest";
import { Engine } from "../pkg/stix_wasm.js";
// @ts-expect-error plain JS module
import { objectTypesOf, nonObservableTypes } from "../playground/pattern-types.js";

const engine = new Engine();
const typesOf = (src: string) => {
  const p = engine.parsePattern(src);
  try {
    return nonObservableTypes(objectTypesOf(p.ast));
  } finally {
    p.free();
  }
};

describe("pattern-types", () => {
  it("flags an SDO type", () => {
    expect(typesOf("[opinion:opinion = 'strongly-agree']")).toEqual(["opinion"]);
  });
  it("accepts SCOs", () => {
    expect(typesOf("[file:name = 'a' AND ipv4-addr:value = '1.1.1.1']")).toEqual([]);
  });
  it("ignores custom types", () => {
    expect(typesOf("[x-custom:foo = 1]")).toEqual([]);
  });
  it("lists only non-SCOs in a mix", () => {
    expect(typesOf("[file:name = 'a'] OR [threat-actor:name = 'b']")).toEqual(["threat-actor"]);
  });
  it("reads the IR too", () => {
    const p = engine.parsePattern("[opinion:opinion = 'x']");
    expect(objectTypesOf(p.ir)).toEqual(["opinion"]);
    p.free();
  });
});
