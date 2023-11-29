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
exports.processFileContent = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const utilities_1 = require("./utilities");
const PROCESSED_FILES = new Set();
function processFileContent(filePath) {
    if (PROCESSED_FILES.has(filePath)) {
        return "";
    }
    PROCESSED_FILES.add(filePath);
    const content = fs.readFileSync(filePath, "utf8");
    let combinedContent = `${path.basename(filePath)} ${(0, utilities_1.minifyContent)(content).trim()}\n`;
    let localImports = (0, utilities_1.findLocalImports)(content);
    localImports.forEach((importPath) => {
        const resolvedPath = (0, utilities_1.resolveImportPath)(path.dirname(filePath), importPath);
        if (resolvedPath) {
            combinedContent += processFileContent(resolvedPath);
        }
    });
    return combinedContent;
}
exports.processFileContent = processFileContent;
