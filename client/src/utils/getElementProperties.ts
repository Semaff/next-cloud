export function getElementSize(element: HTMLElement) {
    const sizes = element.getBoundingClientRect();
    const width = sizes.width;
    const height = sizes.height;
    return { width, height };
}

export function getElementOffset(element: HTMLElement) {
    const { width: documentWidth, height: documentHeight } = getElementSize(document.documentElement);
    const { width, height } = getElementSize(element);
    const offsetX = documentWidth - width;
    const offsetY = documentHeight - height;
    return { offsetX, offsetY };
}