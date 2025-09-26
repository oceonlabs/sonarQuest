import * as t from "@babel/types";
import { parseAst, generateFromAst } from "@tanstack/router-utils";
import babel__default from "@babel/core";
import { findReferencedIdentifiers, deadCodeElimination } from "babel-dead-code-elimination";
import { handleCreateServerFn } from "./handleCreateServerFn.js";
import { handleCreateMiddleware } from "./handleCreateMiddleware.js";
const LookupSetup = {
  ServerFn: { candidateCallIdentifier: /* @__PURE__ */ new Set(["handler"]) },
  Middleware: {
    candidateCallIdentifier: /* @__PURE__ */ new Set(["server", "client", "createMiddlewares"])
  }
};
class ServerFnCompiler {
  constructor(options) {
    this.options = options;
    this.validLookupKinds = options.lookupKinds;
  }
  moduleCache = /* @__PURE__ */ new Map();
  initialized = false;
  validLookupKinds;
  async init(id) {
    await Promise.all(
      this.options.lookupConfigurations.map(async (config) => {
        const libId = await this.options.resolveId(config.libName, id);
        if (!libId) {
          throw new Error(`could not resolve "${config.libName}"`);
        }
        let rootModule = this.moduleCache.get(libId);
        if (!rootModule) {
          rootModule = {
            ast: null,
            bindings: /* @__PURE__ */ new Map(),
            exports: /* @__PURE__ */ new Map(),
            code: "",
            id: libId
          };
          this.moduleCache.set(libId, rootModule);
        }
        rootModule.exports.set(config.rootExport, {
          tag: "Normal",
          name: config.rootExport
        });
        rootModule.exports.set("*", {
          tag: "Namespace",
          name: config.rootExport,
          targetId: libId
        });
        rootModule.bindings.set(config.rootExport, {
          type: "var",
          init: t.identifier(config.rootExport),
          resolvedKind: `Root`
        });
        this.moduleCache.set(libId, rootModule);
      })
    );
    this.initialized = true;
  }
  ingestModule({ code, id }) {
    const ast = parseAst({ code });
    const bindings = /* @__PURE__ */ new Map();
    const exports = /* @__PURE__ */ new Map();
    for (const node of ast.program.body) {
      if (t.isImportDeclaration(node)) {
        const source = node.source.value;
        for (const s of node.specifiers) {
          if (t.isImportSpecifier(s)) {
            const importedName = t.isIdentifier(s.imported) ? s.imported.name : s.imported.value;
            bindings.set(s.local.name, { type: "import", source, importedName });
          } else if (t.isImportDefaultSpecifier(s)) {
            bindings.set(s.local.name, {
              type: "import",
              source,
              importedName: "default"
            });
          } else if (t.isImportNamespaceSpecifier(s)) {
            bindings.set(s.local.name, {
              type: "import",
              source,
              importedName: "*"
            });
          }
        }
      } else if (t.isVariableDeclaration(node)) {
        for (const decl of node.declarations) {
          if (t.isIdentifier(decl.id)) {
            bindings.set(decl.id.name, {
              type: "var",
              init: decl.init ?? null
            });
          }
        }
      } else if (t.isExportNamedDeclaration(node)) {
        if (node.declaration) {
          if (t.isVariableDeclaration(node.declaration)) {
            for (const d of node.declaration.declarations) {
              if (t.isIdentifier(d.id)) {
                exports.set(d.id.name, { tag: "Normal", name: d.id.name });
                bindings.set(d.id.name, { type: "var", init: d.init ?? null });
              }
            }
          }
        }
        for (const sp of node.specifiers) {
          if (t.isExportNamespaceSpecifier(sp)) {
            exports.set(sp.exported.name, {
              tag: "Namespace",
              name: sp.exported.name,
              targetId: node.source?.value || ""
            });
          } else if (t.isExportSpecifier(sp)) {
            const local = sp.local.name;
            const exported = t.isIdentifier(sp.exported) ? sp.exported.name : sp.exported.value;
            exports.set(exported, { tag: "Normal", name: local });
          }
        }
      } else if (t.isExportDefaultDeclaration(node)) {
        const d = node.declaration;
        if (t.isIdentifier(d)) {
          exports.set("default", { tag: "Default", name: d.name });
        } else {
          const synth = "__default_export__";
          bindings.set(synth, { type: "var", init: d });
          exports.set("default", { tag: "Default", name: synth });
        }
      }
    }
    const info = { code, id, ast, bindings, exports };
    this.moduleCache.set(id, info);
    return info;
  }
  invalidateModule(id) {
    return this.moduleCache.delete(id);
  }
  async compile({ code, id }) {
    if (!this.initialized) {
      await this.init(id);
    }
    const { bindings, ast } = this.ingestModule({ code, id });
    const candidates = this.collectCandidates(bindings);
    if (candidates.length === 0) {
      return null;
    }
    const toRewrite = [];
    for (const handler of candidates) {
      const kind = await this.resolveExprKind(handler, id);
      if (this.validLookupKinds.has(kind)) {
        toRewrite.push({ callExpression: handler, kind });
      }
    }
    if (toRewrite.length === 0) {
      return null;
    }
    const pathsToRewrite = [];
    babel__default.traverse(ast, {
      CallExpression(path) {
        const found = toRewrite.findIndex((h) => path.node === h.callExpression);
        if (found !== -1) {
          pathsToRewrite.push({ nodePath: path, kind: toRewrite[found].kind });
          toRewrite.splice(found, 1);
        }
      }
    });
    if (toRewrite.length > 0) {
      throw new Error(
        `Internal error: could not find all paths to rewrite. please file an issue`
      );
    }
    const refIdents = findReferencedIdentifiers(ast);
    pathsToRewrite.map((p) => {
      if (p.kind === "ServerFn") {
        handleCreateServerFn(p.nodePath, { env: this.options.env, code });
      } else {
        handleCreateMiddleware(p.nodePath, { env: this.options.env });
      }
    });
    deadCodeElimination(ast, refIdents);
    return generateFromAst(ast, {
      sourceMaps: true,
      sourceFileName: id,
      filename: id
    });
  }
  // collects all candidate CallExpressions at top-level
  collectCandidates(bindings) {
    const candidates = [];
    for (const binding of bindings.values()) {
      if (binding.type === "var") {
        const handler = isCandidateCallExpression(
          binding.init,
          this.validLookupKinds
        );
        if (handler) {
          candidates.push(handler);
        }
      }
    }
    return candidates;
  }
  async resolveIdentifierKind(ident, id, visited = /* @__PURE__ */ new Set()) {
    const info = await this.getModuleInfo(id);
    const binding = info.bindings.get(ident);
    if (!binding) {
      return "None";
    }
    if (binding.resolvedKind) {
      return binding.resolvedKind;
    }
    const vKey = `${id}:${ident}`;
    if (visited.has(vKey)) {
      return "None";
    }
    visited.add(vKey);
    const resolvedKind = await this.resolveBindingKind(binding, id, visited);
    binding.resolvedKind = resolvedKind;
    return resolvedKind;
  }
  async resolveBindingKind(binding, fileId, visited = /* @__PURE__ */ new Set()) {
    if (binding.resolvedKind) {
      return binding.resolvedKind;
    }
    if (binding.type === "import") {
      const target = await this.options.resolveId(binding.source, fileId);
      if (!target) {
        return "None";
      }
      const importedModule = await this.getModuleInfo(target);
      const moduleExport = importedModule.exports.get(binding.importedName);
      if (!moduleExport) {
        return "None";
      }
      const importedBinding = importedModule.bindings.get(moduleExport.name);
      if (!importedBinding) {
        return "None";
      }
      if (importedBinding.resolvedKind) {
        return importedBinding.resolvedKind;
      }
      const resolvedKind2 = await this.resolveBindingKind(
        importedBinding,
        importedModule.id,
        visited
      );
      importedBinding.resolvedKind = resolvedKind2;
      return resolvedKind2;
    }
    const resolvedKind = await this.resolveExprKind(
      binding.init,
      fileId,
      visited
    );
    binding.resolvedKind = resolvedKind;
    return resolvedKind;
  }
  async resolveExprKind(expr, fileId, visited = /* @__PURE__ */ new Set()) {
    if (!expr) {
      return "None";
    }
    let result = "None";
    if (t.isCallExpression(expr)) {
      if (!t.isExpression(expr.callee)) {
        return "None";
      }
      const calleeKind = await this.resolveCalleeKind(
        expr.callee,
        fileId,
        visited
      );
      if (calleeKind !== "None") {
        if (calleeKind === `Root` || calleeKind === `Builder`) {
          return `Builder`;
        }
        for (const kind of this.validLookupKinds) {
          if (calleeKind === kind) {
            return kind;
          }
        }
      }
    } else if (t.isMemberExpression(expr) && t.isIdentifier(expr.property)) {
      result = await this.resolveCalleeKind(expr.object, fileId, visited);
    }
    if (result === "None" && t.isIdentifier(expr)) {
      result = await this.resolveIdentifierKind(expr.name, fileId, visited);
    }
    if (result === "None" && t.isTSAsExpression(expr)) {
      result = await this.resolveExprKind(expr.expression, fileId, visited);
    }
    if (result === "None" && t.isTSNonNullExpression(expr)) {
      result = await this.resolveExprKind(expr.expression, fileId, visited);
    }
    if (result === "None" && t.isParenthesizedExpression(expr)) {
      result = await this.resolveExprKind(expr.expression, fileId, visited);
    }
    return result;
  }
  async resolveCalleeKind(callee, fileId, visited = /* @__PURE__ */ new Set()) {
    if (t.isIdentifier(callee)) {
      return this.resolveIdentifierKind(callee.name, fileId, visited);
    }
    if (t.isMemberExpression(callee) && t.isIdentifier(callee.property)) {
      const prop = callee.property.name;
      if (this.validLookupKinds.has("ServerFn") && LookupSetup["ServerFn"].candidateCallIdentifier.has(prop)) {
        const base = await this.resolveExprKind(callee.object, fileId, visited);
        if (base === "Root" || base === "Builder") {
          return "ServerFn";
        }
        return "None";
      } else if (this.validLookupKinds.has("Middleware") && LookupSetup["Middleware"].candidateCallIdentifier.has(prop)) {
        const base = await this.resolveExprKind(callee.object, fileId, visited);
        if (base === "Root" || base === "Builder" || base === "Middleware") {
          return "Middleware";
        }
        return "None";
      }
      if (t.isIdentifier(callee.object)) {
        const info = await this.getModuleInfo(fileId);
        const binding = info.bindings.get(callee.object.name);
        if (binding && binding.type === "import" && binding.importedName === "*") {
          const targetModuleId = await this.options.resolveId(
            binding.source,
            fileId
          );
          if (targetModuleId) {
            const targetModule = await this.getModuleInfo(targetModuleId);
            const exportEntry = targetModule.exports.get(callee.property.name);
            if (exportEntry) {
              const exportedBinding = targetModule.bindings.get(
                exportEntry.name
              );
              if (exportedBinding) {
                return await this.resolveBindingKind(
                  exportedBinding,
                  targetModule.id,
                  visited
                );
              }
            }
          } else {
            return "None";
          }
        }
      }
      return this.resolveExprKind(callee.object, fileId, visited);
    }
    return this.resolveExprKind(callee, fileId, visited);
  }
  async getModuleInfo(id) {
    let cached = this.moduleCache.get(id);
    if (cached) {
      return cached;
    }
    await this.options.loadModule(id);
    cached = this.moduleCache.get(id);
    if (!cached) {
      throw new Error(`could not load module info for ${id}`);
    }
    return cached;
  }
}
function isCandidateCallExpression(node, lookupKinds) {
  if (!t.isCallExpression(node)) return void 0;
  const callee = node.callee;
  if (!t.isMemberExpression(callee) || !t.isIdentifier(callee.property)) {
    return void 0;
  }
  for (const kind of lookupKinds) {
    if (LookupSetup[kind].candidateCallIdentifier.has(callee.property.name)) {
      return node;
    }
  }
  return void 0;
}
export {
  ServerFnCompiler
};
//# sourceMappingURL=compiler.js.map
