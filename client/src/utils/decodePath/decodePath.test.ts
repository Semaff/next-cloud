import decodePath from "./decodePath";

describe("Decode Path validation", () => {
  test("Path is empty", () => {
    expect(decodePath("")).toBe("");
    expect(decodePath("/")).toBe("");
    expect(decodePath("\\")).toBe("");
  });

  test("Path has \\ and /", () => {
    expect(decodePath("some\\random/path")).toBe("some\\random\\path");
    expect(decodePath("some/random\\path/haha")).toBe("some\\random\\path\\haha");
  });

  test("Path has \\ or / as first symbol", () => {
    expect(decodePath("/first/symbol/is/slash")).toBe("first\\symbol\\is\\slash");
    expect(decodePath("\\first/symbol/is/back-slash")).toBe("first\\symbol\\is\\back-slash");
  });

  test("Path has Encoded Components", () => {
    expect(decodePath("/some%20space/with%20white")).toBe("some space\\with white");
    expect(decodePath("\\some%20little%20space/with%20extra%20spaces")).toBe("some little space\\with extra spaces");
  });
})
