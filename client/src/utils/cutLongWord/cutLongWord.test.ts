import { cutLongWord } from "./cutLongWord";

describe("Cut Long Word validation", () => {
  test("Word is more than 16 symbols", () => {
    expect(cutLongWord("Long Word More than 16 symbols")).toBe("Long Word Mor...")
  });

  test("Word is less than 16 symbols", () => {
    expect(cutLongWord("Small Word")).toBe("Small Word")
  });

  test("Word is 16 symbols", () => {
    expect(cutLongWord("..... symbols 16")).toBe("..... symbols 16")
  });
})
