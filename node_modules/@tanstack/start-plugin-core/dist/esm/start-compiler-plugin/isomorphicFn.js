import * as t from "@babel/types";
import { getRootCallExpression } from "./utils.js";
function handleCreateIsomorphicFnCallExpression(path, opts) {
  const rootCallExpression = getRootCallExpression(path);
  const callExpressionPaths = {
    client: null,
    server: null
  };
  const validMethods = Object.keys(callExpressionPaths);
  rootCallExpression.traverse({
    MemberExpression(memberExpressionPath) {
      if (t.isIdentifier(memberExpressionPath.node.property)) {
        const name = memberExpressionPath.node.property.name;
        if (validMethods.includes(name) && memberExpressionPath.parentPath.isCallExpression()) {
          callExpressionPaths[name] = memberExpressionPath.parentPath;
        }
      }
    }
  });
  if (validMethods.every(
    (method) => !callExpressionPaths[method]
  )) {
    const variableId = rootCallExpression.parentPath.isVariableDeclarator() ? rootCallExpression.parentPath.node.id : null;
    console.warn(
      "createIsomorphicFn called without a client or server implementation!",
      "This will result in a no-op function.",
      "Variable name:",
      t.isIdentifier(variableId) ? variableId.name : "unknown"
    );
  }
  const envCallExpression = callExpressionPaths[opts.env];
  if (!envCallExpression) {
    rootCallExpression.replaceWith(
      t.arrowFunctionExpression([], t.blockStatement([]))
    );
    return;
  }
  const innerInputExpression = envCallExpression.node.arguments[0];
  if (!t.isExpression(innerInputExpression)) {
    throw new Error(
      `createIsomorphicFn().${opts.env}(func) must be called with a function!`
    );
  }
  rootCallExpression.replaceWith(innerInputExpression);
}
export {
  handleCreateIsomorphicFnCallExpression
};
//# sourceMappingURL=isomorphicFn.js.map
