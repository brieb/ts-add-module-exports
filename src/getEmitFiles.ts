import ts from "typescript";
import { ParsedConfig } from "./parseConfig";

export function getEmitFiles({ options, fileNames }: ParsedConfig) {
  const program = ts.createProgram({ options, rootNames: fileNames });

  const emitFiles: string[] = [];
  program.emit(undefined, fileName => {
    emitFiles.push(fileName);
  });

  return emitFiles;
}
