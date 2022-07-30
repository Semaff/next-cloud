export function encodePath(path: string): string {
    const parsedPath = path.replaceAll("/", "\\");

    let encodedPath: string;
    if (parsedPath === "\\") {
        encodedPath = "";
    } else {
        encodedPath = encodeURIComponent(parsedPath);
    }

    return encodedPath;
}