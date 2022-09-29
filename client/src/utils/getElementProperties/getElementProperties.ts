export function getElementSize(element: HTMLElement) {
  const sizes = element.getBoundingClientRect();
  const width = sizes.width;
  const height = sizes.height;
  return { width, height };
}

export function getElementCoordinates(element: HTMLElement) {
  const { left, top } = element.getBoundingClientRect();
  return { offsetX: left, offsetY: top };
}