import path from "path";
import ts from "typescript";
import { parseConfig } from "../src/parseConfig";
import { addModuleExports } from "../src/addModuleExports";

describe("addModuleExports", () => {
  it("Properly transforms demo", () => {
    const basePath = path.resolve(__dirname, "../demo");
    const { options, fileNames } = parseConfig(basePath);
    const program = ts.createProgram({ options, rootNames: fileNames });

    const inputs: { [fileName: string]: string } = {};
    program.emit(undefined, (fileName, data) => {
      const relFileName = path.relative(basePath, fileName);
      inputs[relFileName] = data;
    });

    const outputFileNames = Object.keys(inputs)
      .filter(fileName => fileName.endsWith(".js"))
      .sort();
    expect(outputFileNames).toMatchSnapshot();

    outputFileNames.forEach(fileName => {
      expect(addModuleExports(inputs[fileName])).toMatchSnapshot(fileName);
    });
  });
});
