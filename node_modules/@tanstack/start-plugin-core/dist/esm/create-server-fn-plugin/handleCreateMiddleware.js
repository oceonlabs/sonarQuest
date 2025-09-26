import * as t from "@babel/types";
import { getRootCallExpression } from "../start-compiler-plugin/utils.js";
function handleCreateMiddleware(path, opts) {
  const rootCallExpression = getRootCallExpression(path);
  const callExpressionPaths = {
    middleware: null,
    inputValidator: null,
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
  if (callExpressionPaths.inputValidator) {
    const innerInputExpression = callExpressionPaths.inputValidator.node.arguments[0];
    if (!innerInputExpression) {
      throw new Error(
        "createMiddleware().inputValidator() must be called with a validator!"
      );
    }
    if (opts.env === "client") {
      if (t.isMemberExpression(callExpressionPaths.inputValidator.node.callee)) {
        callExpressionPaths.inputValidator.replaceWith(
          callExpressionPaths.inputValidator.node.callee.object
        );
      }
    }
  }
  const serverFnPath = callExpressionPaths.server?.get(
    "arguments.0"
  );
  if (callExpressionPaths.server && serverFnPath.node && opts.env === "client") {
    if (t.isMemberExpression(callExpressionPaths.server.node.callee)) {
      callExpressionPaths.server.replaceWith(
        callExpressionPaths.server.node.callee.object
      );
    }
  }
}
export {
  handleCreateMiddleware
};
//# sourceMappingURL=handleCreateMiddleware.js.map
