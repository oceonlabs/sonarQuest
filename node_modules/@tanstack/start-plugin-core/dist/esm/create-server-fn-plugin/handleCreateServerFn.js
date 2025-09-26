import * as t from "@babel/types";
import { getRootCallExpression, codeFrameError } from "../start-compiler-plugin/utils.js";
function handleCreateServerFn(path, opts) {
  const validMethods = ["middleware", "inputValidator", "handler"];
  const callExpressionPaths = {
    middleware: null,
    inputValidator: null,
    handler: null
  };
  const rootCallExpression = getRootCallExpression(path);
  if (!rootCallExpression.parentPath.isVariableDeclarator()) {
    throw new Error("createServerFn must be assigned to a variable!");
  }
  const variableDeclarator = rootCallExpression.parentPath.node;
  const existingVariableName = variableDeclarator.id.name;
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
        "createServerFn().inputValidator() must be called with a validator!"
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
  const handlerFnPath = callExpressionPaths.handler?.get(
    "arguments.0"
  );
  if (!callExpressionPaths.handler || !handlerFnPath.node) {
    throw codeFrameError(
      opts.code,
      path.node.callee.loc,
      `createServerFn must be called with a "handler" property!`
    );
  }
  const handlerFn = handlerFnPath.node;
  if (t.isIdentifier(handlerFn)) {
    if (opts.env === "client") {
      const binding = handlerFnPath.scope.getBinding(handlerFn.name);
      if (binding) {
        binding.path.remove();
      }
    }
  }
  handlerFnPath.replaceWith(
    t.arrowFunctionExpression(
      [t.identifier("opts"), t.identifier("signal")],
      t.blockStatement(
        // Everything in here is server-only, since the client
        // will strip out anything in the 'use server' directive.
        [
          t.returnStatement(
            t.callExpression(
              t.identifier(`${existingVariableName}.__executeServer`),
              [t.identifier("opts"), t.identifier("signal")]
            )
          )
        ],
        [t.directive(t.directiveLiteral("use server"))]
      )
    )
  );
  if (opts.env === "server") {
    callExpressionPaths.handler.node.arguments.push(handlerFn);
  }
}
export {
  handleCreateServerFn
};
//# sourceMappingURL=handleCreateServerFn.js.map
