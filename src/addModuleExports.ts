import astTypes from "ast-types";
import { parse, print } from "recast";
import { hasExports } from "./hasExports";

const b = astTypes.builders;

export function addModuleExports(input: string): string {
  const ast = parse(input, { parser: require("recast/parsers/babel") });

  const { hasModuleExports, hasExportsNamed, hasExportsDefault } = hasExports(
    ast
  );

  if (!hasExportsNamed && !hasModuleExports && hasExportsDefault) {
    ast.program.body.push(
      b.expressionStatement(
        b.assignmentExpression(
          "=",
          b.memberExpression(b.identifier("module"), b.identifier("exports")),
          b.memberExpression(
            b.identifier("exports"),
            b.stringLiteral("default"),
            true
          )
        )
      )
    );
  }

  return print(ast).code;
}
