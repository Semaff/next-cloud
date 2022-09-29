import { getElementCoordinates, getElementSize } from "./getElementProperties";

/*
  DOMRect is used for mocking getBoundingClientRect
  =====================================================
*/
class DOMRect {
  bottom: number = 0;
  left: number = 0;
  right: number = 0;
  top: number = 0;

  constructor(public x = 0, public y = 0, public width = 0, public height = 0) { };

  static fromRect(other?: DOMRectInit): DOMRect {
    return new DOMRect(other?.x, other?.y, other?.width, other?.height)
  }

  toJSON() {
    return JSON.stringify(this)
  }
}

/*
  Tests
  =========
*/
describe("Get Element Properties validation", () => {
  let divElement: HTMLDivElement;

  beforeAll(() => {
    divElement = document.createElement("div");
    divElement.getBoundingClientRect = jest.fn(() => new DOMRect(50, 50, 120, 120));
    document.body.appendChild(divElement);
  });

  test("Check Element size", () => {
    expect(getElementSize(divElement)).toEqual({ height: 120, width: 120 });
  });

  test("Check Element offset", () => {
    expect(getElementCoordinates(divElement)).toEqual({ offsetX: 0, offsetY: 0 });
  });

  afterAll(() => {
    document.body.removeChild(divElement);
  });
});
