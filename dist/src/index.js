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
exports.main = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const processFileContent_1 = require("./processFileContent");
const utilities_1 = require("./utilities");
function main(fileName) {
    let filePath = (0, utilities_1.resolveImportPath)(process.cwd(), fileName);
    if (!filePath) {
        filePath = (0, utilities_1.searchForInputFile)(fileName);
        if (!filePath) {
            return `File not found:${fileName}`;
        }
    }
    const processedContent = (0, processFileContent_1.processFileContent)(filePath);
    return processedContent;
}
exports.main = main;
if (require.main === module) {
    const fileName = process.argv[2];
    if (!fileName) {
        console.log("Please provide a file name");
        process.exit(1);
    }
    const output = main(fileName);
    const logFilePath = path.join(process.cwd(), `.output-${Date.now()}.log`);
    fs.writeFileSync(logFilePath, output);
    console.log(`File processed successfully. Output saved to ${logFilePath}`);
}
