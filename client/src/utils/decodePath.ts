export default function decodePath(path: string) {
    const decodedPath = decodeURIComponent(path.slice(1));
    return decodedPath.split("/").join("\\");
}