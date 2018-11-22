import ts from "typescript";
import { createParseConfigHost } from "./createParseConfigHost";

export interface ParsedConfig {
  options: ts.CompilerOptions;
  fileNames: string[];
}

export function parseConfig(basePath: string): ParsedConfig {
  const configFileName = ts.findConfigFile(
    basePath,
    ts.sys.fileExists,
    "tsconfig.json"
  );
  if (!configFileName) {
    throw new Error("tsconfig.json file not found");
  }

  const configFileContents = ts.sys.readFile(configFileName) || "";
  const { config, error } = ts.parseConfigFileTextToJson(
    configFileName,
    configFileContents
  );
  if (error) {
    throw new Error(
      `Error parsing TS config file ${configFileName}: ${error.messageText}`
    );
  }

  const { options, fileNames, errors } = ts.parseJsonConfigFileContent(
    config,
    createParseConfigHost(),
    basePath
  );
  if (errors.length > 0) {
    throw new Error(`Errors parsing TS config: ${JSON.stringify(errors)}`);
  }

  return { options, fileNames };
}
