import formatSize from "./formatSize";

describe("Format Size validation", () => {
  test("Size is empty", () => {
    expect(formatSize(0)).toBe("0B");
  });

  test("Size is more than a Bit (0)", () => {
    expect(formatSize(6)).toBe("6B");
    expect(formatSize(100)).toBe("100B");
    expect(formatSize(273)).toBe("273B");
    expect(formatSize(1023)).toBe("1023B");
  });

  test("Size is more than a B (1024)", () => {
    expect(formatSize(1025)).toBe("1.0Kb");
    expect(formatSize(1125)).toBe("1.1Kb");
    expect(formatSize(2125)).toBe("2.1Kb");
    expect(formatSize(10125)).toBe("9.9Kb");
    expect(formatSize(105125)).toBe("102.7Kb");
    expect(formatSize(1024000)).toBe("1000.0Kb");
  });

  test("Size is more than a Kb (1048576)", () => {
    expect(formatSize(1048586)).toBe("1.0Mb");
    expect(formatSize(10098586)).toBe("9.6Mb");
    expect(formatSize(90078586)).toBe("85.9Mb");
    expect(formatSize(300048586)).toBe("286.1Mb");
    expect(formatSize(1020045431)).toBe("972.8Mb");
  });

  test("Size is more than a Mb (1073741824)", () => {
    expect(formatSize(1073741824)).toBe("1.0Gb");
    expect(formatSize(9055441825)).toBe("8.4Gb");
    expect(formatSize(102055441335)).toBe("95.0Gb");
    expect(formatSize(674515441335)).toBe("628.2Gb");
  });
});
