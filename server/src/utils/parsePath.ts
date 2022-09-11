export function parsePath(curPath: string | string[]): string {
    if (Array.isArray(curPath)) {
        return curPath.join("\\");
    }

    return curPath;
}