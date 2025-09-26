import { codeFrameColumns } from "@babel/code-frame";
function getRootCallExpression(path) {
  let rootCallExpression = path;
  while (rootCallExpression.parentPath.isMemberExpression()) {
    const parent = rootCallExpression.parentPath;
    if (parent.parentPath.isCallExpression()) {
      rootCallExpression = parent.parentPath;
    }
  }
  return rootCallExpression;
}
function codeFrameError(code, loc, message) {
  const frame = codeFrameColumns(
    code,
    {
      start: loc.start,
      end: loc.end
    },
    {
      highlightCode: true,
      message
    }
  );
  return new Error(frame);
}
export {
  codeFrameError,
  getRootCallExpression
};
//# sourceMappingURL=utils.js.map
