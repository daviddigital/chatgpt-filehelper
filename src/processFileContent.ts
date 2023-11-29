import * as fs from "fs";
import * as path from "path";
import {
  findLocalImports,
  resolveImportPath,
  minifyContent,
} from "./utilities";

const PROCESSED_FILES: Set<string> = new Set();

export function processFileContent(filePath: string): string {
  if (PROCESSED_FILES.has(filePath)) {
    return "";
  }
  PROCESSED_FILES.add(filePath);

  const content = fs.readFileSync(filePath, "utf8");
  let combinedContent = `${path.basename(filePath)} ${minifyContent(
    content
  ).trim()}\n`;

  let localImports = findLocalImports(content);
  localImports.forEach((importPath) => {
    const resolvedPath = resolveImportPath(path.dirname(filePath), importPath);
    if (resolvedPath) {
      combinedContent += processFileContent(resolvedPath);
    }
  });

  return combinedContent;
}
