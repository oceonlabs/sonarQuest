import * as t from "@babel/types";
function capitalize(str) {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
function buildEnvOnlyCallExpressionHandler(env) {
  return function envOnlyCallExpressionHandler(path, opts) {
    const isEnvMatch = env === "client" ? opts.env === "client" : opts.env === "server";
    if (isEnvMatch) {
      const innerInputExpression = path.node.arguments[0];
      if (!t.isExpression(innerInputExpression)) {
        throw new Error(
          `${env}Only() functions must be called with a function!`
        );
      }
      path.replaceWith(innerInputExpression);
      return;
    }
    path.replaceWith(
      t.arrowFunctionExpression(
        [],
        t.blockStatement([
          t.throwStatement(
            t.newExpression(t.identifier("Error"), [
              t.stringLiteral(
                `create${capitalize(env)}OnlyFn() functions can only be called on the ${env}!`
              )
            ])
          )
        ])
      )
    );
  };
}
const handleCreateServerOnlyFnCallExpression = buildEnvOnlyCallExpressionHandler("server");
const handleCreateClientOnlyFnCallExpression = buildEnvOnlyCallExpressionHandler("client");
export {
  handleCreateClientOnlyFnCallExpression,
  handleCreateServerOnlyFnCallExpression
};
//# sourceMappingURL=envOnly.js.map
