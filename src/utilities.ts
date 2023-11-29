import * as fs from "fs";
import * as path from "path";

const EXCLUDED_DIRS: string[] = ["node_modules", "dist", "build"];
const EXTENSIONS: string[] = [".js", ".jsx", ".ts", ".tsx"];

export function findLocalImports(content: string): string[] {
  const importRegex: RegExp = /import\s+.+\s+from\s+['"](.+)['"]/g;
  let match: RegExpExecArray | null;
  let imports: string[] = [];
  while ((match = importRegex.exec(content)) !== null) {
    if (match[1].startsWith(".")) {
      imports.push(match[1]);
    }
  }
  return imports;
}

export function resolveImportPath(
  basePath: string,
  relativePath: string
): string | null {
  if (path.isAbsolute(relativePath)) {
    return fs.existsSync(relativePath) ? relativePath : null;
  }
  for (const ext of EXTENSIONS) {
    const fullPath = path
      .resolve(basePath, relativePath)
      .replace(/(\.jsx|\.js|\.tsx|\.ts)?$/, ext);
    if (
      fs.existsSync(fullPath) &&
      !EXCLUDED_DIRS.some((dir) => fullPath.includes(dir))
    ) {
      return fullPath;
    }
  }
  return null;
}

export function searchForInputFile(
  fileName: string,
  startPath: string = process.cwd()
): string | null {
  if (!fs.existsSync(startPath)) {
    return null;
  }
  const files = fs.readdirSync(startPath);
  for (const file of files) {
    const filePath = path.join(startPath, file);
    if (fs.statSync(filePath).isDirectory() && !EXCLUDED_DIRS.includes(file)) {
      const found = searchForInputFile(fileName, filePath);
      if (found) return found;
    } else if (path.basename(filePath) === fileName) {
      return filePath;
    }
  }
  return null;
}

export function minifyContent(content: string): string {
  const lines = content.split("\n");
  const minifiedLines = lines.map((line) => {
    // Remove single-line imports
    if (line.startsWith("import ") && line.endsWith(";")) {
      return "";
    }

    // Remove single-line comments
    const commentIndex = line.indexOf("//");
    if (commentIndex !== -1) {
      line = line.substring(0, commentIndex);
    }

    return line.trim().replace(/\s*([():])\s*/g, "$1");
  });

  // Filter out empty lines
  return minifiedLines.filter((line) => line.length > 0).join("");
}
