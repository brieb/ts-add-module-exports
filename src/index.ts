import ts from "typescript";
import { addModuleExports } from "./addModuleExports";
import { getEmitFiles } from "./getEmitFiles";
import { parseConfig } from "./parseConfig";

const basePath = process.cwd();

const { options, fileNames } = parseConfig(basePath);

if (options.module !== ts.ModuleKind.CommonJS) {
  throw new Error(
    'Only intended for CommonJS modules (i.e. "module": "commonjs")'
  );
}

getEmitFiles({ options, fileNames })
  .filter(file => file.endsWith(".js") && ts.sys.fileExists(file))
  .forEach(jsFile => {
    ts.sys.writeFile(jsFile, addModuleExports(ts.sys.readFile(jsFile)!));
  });
