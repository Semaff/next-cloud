export default function decodePath(path: string) {
  if (path[0] === "/" || path[0] === "\\") {
    path = path.slice(1);
  }

  const decodedPath = decodeURIComponent(path);
  return decodedPath.split("/").join("\\");
}