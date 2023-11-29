"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.minifyContent = exports.searchForInputFile = exports.resolveImportPath = exports.findLocalImports = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const EXCLUDED_DIRS = ["node_modules", "dist", "build"];
const EXTENSIONS = [".js", ".jsx", ".ts", ".tsx"];
function findLocalImports(content) {
    const importRegex = /import\s+.+\s+from\s+['"](.+)['"]/g;
    let match;
    let imports = [];
    while ((match = importRegex.exec(content)) !== null) {
        if (match[1].startsWith(".")) {
            imports.push(match[1]);
        }
    }
    return imports;
}
exports.findLocalImports = findLocalImports;
function resolveImportPath(basePath, relativePath) {
    if (path.isAbsolute(relativePath)) {
        return fs.existsSync(relativePath) ? relativePath : null;
    }
    for (const ext of EXTENSIONS) {
        const fullPath = path
            .resolve(basePath, relativePath)
            .replace(/(\.jsx|\.js|\.tsx|\.ts)?$/, ext);
        if (fs.existsSync(fullPath) &&
            !EXCLUDED_DIRS.some((dir) => fullPath.includes(dir))) {
            return fullPath;
        }
    }
    return null;
}
exports.resolveImportPath = resolveImportPath;
function searchForInputFile(fileName, startPath = process.cwd()) {
    if (!fs.existsSync(startPath)) {
        return null;
    }
    const files = fs.readdirSync(startPath);
    for (const file of files) {
        const filePath = path.join(startPath, file);
        if (fs.statSync(filePath).isDirectory() && !EXCLUDED_DIRS.includes(file)) {
            const found = searchForInputFile(fileName, filePath);
            if (found)
                return found;
        }
        else if (path.basename(filePath) === fileName) {
            return filePath;
        }
    }
    return null;
}
exports.searchForInputFile = searchForInputFile;
function minifyContent(content) {
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
    // Filter out empty lines and join
    return minifiedLines.filter((line) => line.length > 0).join("");
}
exports.minifyContent = minifyContent;
