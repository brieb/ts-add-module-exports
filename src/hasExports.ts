import astTypes from "ast-types";

const n = astTypes.namedTypes;

export interface HasExportsResult {
  hasModuleExports: boolean;
  hasExportsNamed: boolean;
  hasExportsDefault: boolean;
}

function isRootLevel(ast: any, node: any) {
  return ast.program.body.indexOf(node) !== -1;
}

function isExports(objectName: string, propertyName: string) {
  return (
    (objectName === "exports" || objectName === "_exports") &&
    propertyName !== "__esModule"
  );
}

export function hasExports(ast: any): HasExportsResult {
  let hasModuleExports = false;
  let hasExportsNamed = false;
  let hasExportsDefault = false;

  astTypes.visit(ast, {
    visitMemberExpression(path: any) {
      if (
        isRootLevel(ast, path.parent.parent.value) &&
        n.Identifier.check(path.node.object) &&
        n.Identifier.check(path.node.property)
      ) {
        const objectName = path.node.object.name;
        const propertyName = path.node.property.name;

        if (isExports(objectName, propertyName)) {
          if (propertyName === "default") {
            hasExportsDefault = true;
          } else {
            hasExportsNamed = true;
          }
        }

        if (`${objectName}.${propertyName}` === "module.exports") {
          hasModuleExports = true;
        }
      }

      this.traverse(path);
    },
    visitCallExpression(path: any) {
      if (
        isRootLevel(ast, path.parent.value) &&
        n.MemberExpression.check(path.node.callee) &&
        n.Identifier.check(path.node.callee.object) &&
        n.Identifier.check(path.node.callee.property) &&
        path.node.callee.object.name === "Object" &&
        path.node.callee.property.name === "defineProperty"
      ) {
        const obj = path.node.arguments[0];
        const prop = path.node.arguments[1];

        if (n.Identifier.check(obj) && n.Identifier.check(prop)) {
          const objectName = obj.name;
          const propertyName = prop.name;
          if (isExports(objectName, propertyName)) {
            if (propertyName === "default") {
              hasExportsDefault = true;
            } else {
              hasExportsNamed = true;
            }
          }
        }
      }

      this.traverse(path);
    }
  });

  return {
    hasModuleExports,
    hasExportsNamed,
    hasExportsDefault
  };
}
