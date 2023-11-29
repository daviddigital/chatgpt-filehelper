import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { processFileContent } from "./processFileContent";
import { resolveImportPath, searchForInputFile } from "./utilities";

export function main(fileName: string): string {
  let filePath = resolveImportPath(process.cwd(), fileName);
  if (!filePath) {
    filePath = searchForInputFile(fileName);
    if (!filePath) {
      return `File not found:${fileName}`;
    }
  }
  const processedContent = processFileContent(filePath);
  return processedContent;
}

if (require.main === module) {
  const fileName: string | undefined = process.argv[2];
  if (!fileName) {
    console.log("Please provide a file name");
    process.exit(1);
  }
  const output = main(fileName);

  // get the path to the OS temp directory
  const logFilePath = path.join(os.tmpdir(), `.output-${Date.now()}.log`);

  fs.writeFileSync(logFilePath, output);
  console.log(`File processed successfully. Output saved to ${logFilePath}`);
}
