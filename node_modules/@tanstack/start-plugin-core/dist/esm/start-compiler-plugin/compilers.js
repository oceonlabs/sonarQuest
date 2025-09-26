import * as babel from "@babel/core";
import * as t from "@babel/types";
import { findReferencedIdentifiers, deadCodeElimination } from "babel-dead-code-elimination";
import { parseAst, generateFromAst } from "@tanstack/router-utils";
import { handleCreateMiddleware } from "../create-server-fn-plugin/handleCreateMiddleware.js";
import { transformFuncs } from "./constants.js";
import { handleCreateIsomorphicFnCallExpression } from "./isomorphicFn.js";
import { handleCreateClientOnlyFnCallExpression, handleCreateServerOnlyFnCallExpression } from "./envOnly.js";
function compileStartOutputFactory(framework) {
  return function compileStartOutput(opts) {
    const identifiers = {
      createServerOnlyFn: {
        name: "createServerOnlyFn",
        handleCallExpression: handleCreateServerOnlyFnCallExpression,
        paths: []
      },
      createClientOnlyFn: {
        name: "createClientOnlyFn",
        handleCallExpression: handleCreateClientOnlyFnCallExpression,
        paths: []
      },
      createIsomorphicFn: {
        name: "createIsomorphicFn",
        handleCallExpression: handleCreateIsomorphicFnCallExpression,
        paths: []
      },
      createMiddleware: {
        name: "createMiddleware",
        handleCallExpression: handleCreateMiddleware,
        paths: []
      }
    };
    const ast = parseAst(opts);
    const doDce = opts.dce ?? true;
    const refIdents = doDce ? findReferencedIdentifiers(ast) : void 0;
    babel.traverse(ast, {
      Program: {
        enter(programPath) {
          programPath.traverse({
            ImportDeclaration: (path) => {
              if (path.node.source.value !== `@tanstack/${framework}-start`) {
                return;
              }
              path.node.specifiers.forEach((specifier) => {
                transformFuncs.forEach((identifierKey) => {
                  const identifier = identifiers[identifierKey];
                  if (specifier.type === "ImportSpecifier" && specifier.imported.type === "Identifier") {
                    if (specifier.imported.name === identifierKey) {
                      identifier.name = specifier.local.name;
                    }
                  }
                  if (specifier.type === "ImportNamespaceSpecifier") {
                    identifier.name = `${specifier.local.name}.${identifierKey}`;
                  }
                });
              });
            },
            CallExpression: (path) => {
              transformFuncs.forEach((identifierKey) => {
                if (t.isIdentifier(path.node.callee) && path.node.callee.name === identifiers[identifierKey].name) {
                  if (path.scope.getBinding(identifiers[identifierKey].name)?.path.node.type === "FunctionDeclaration") {
                    return;
                  }
                  return identifiers[identifierKey].paths.push(path);
                }
                if (t.isMemberExpression(path.node.callee)) {
                  if (t.isIdentifier(path.node.callee.object) && t.isIdentifier(path.node.callee.property)) {
                    const callname = [
                      path.node.callee.object.name,
                      path.node.callee.property.name
                    ].join(".");
                    if (callname === identifiers[identifierKey].name) {
                      identifiers[identifierKey].paths.push(path);
                    }
                  }
                }
                return;
              });
            }
          });
          transformFuncs.forEach((identifierKey) => {
            identifiers[identifierKey].paths.forEach((path) => {
              identifiers[identifierKey].handleCallExpression(
                path,
                opts
              );
            });
          });
        }
      }
    });
    if (doDce) {
      deadCodeElimination(ast, refIdents);
    }
    return generateFromAst(ast, {
      sourceMaps: true,
      sourceFileName: opts.filename,
      filename: opts.filename
    });
  };
}
export {
  compileStartOutputFactory
};
//# sourceMappingURL=compilers.js.map
