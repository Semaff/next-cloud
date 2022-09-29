import { emailPattern, onlyLettersPattern, passwordPattern } from "./regExps";

describe("Check Email pattern", () => {
  test("Good email", () => {
    expect(emailPattern.test("example@mail.ru")).toEqual(true);
  });

  test("Email without @", () => {
    expect(emailPattern.test("examplemail.ru")).toEqual(false);
  });

  test("Email without .", () => {
    expect(emailPattern.test("example@mail")).toEqual(false);
  });
});

describe("Check Only Letters pattern", () => {
  test("Only letters", () => {
    expect(onlyLettersPattern.test("letters something")).toEqual(true);
  });

  test("Letters with numbers", () => {
    expect(onlyLettersPattern.test("w1th number")).toEqual(false);
  });

  test("Letters with not okay special characters", () => {
    expect(onlyLettersPattern.test("not okay special characters |/\\")).toEqual(false);
  });

  test("Letters with okay special characters", () => {
    expect(onlyLettersPattern.test("letters with okay characters .,'-")).toEqual(true);
  });
});

describe("Password pattern", () => {
  test("Less than 6 symbols", () => {
    expect(passwordPattern.test("exa1!")).toEqual(false);
  });

  test("Without special characters", () => {
    expect(passwordPattern.test("example11")).toEqual(false);
  });

  test("Without numbers", () => {
    expect(passwordPattern.test("example!!")).toEqual(false);
  });

  test("Good passwords", () => {
    expect(passwordPattern.test("e1e1!!")).toEqual(true);
    expect(passwordPattern.test("example1!")).toEqual(true);
    expect(passwordPattern.test("ex3mple!")).toEqual(true);
  });
});
