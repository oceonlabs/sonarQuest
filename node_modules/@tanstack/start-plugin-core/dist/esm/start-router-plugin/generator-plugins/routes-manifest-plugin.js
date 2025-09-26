import { rootRouteId } from "@tanstack/router-core";
function routesManifestPlugin() {
  return {
    name: "routes-manifest-plugin",
    onRouteTreeChanged: ({ routeTree, rootRouteNode, routeNodes }) => {
      const routesManifest = {
        [rootRouteId]: {
          filePath: rootRouteNode.fullPath,
          children: routeTree.map((d) => d.routePath)
        },
        ...Object.fromEntries(
          routeNodes.map((d) => {
            const filePathId = d.routePath;
            return [
              filePathId,
              {
                filePath: d.fullPath,
                parent: d.parent?.routePath ? d.parent.routePath : void 0,
                children: d.children?.map((childRoute) => childRoute.routePath)
              }
            ];
          })
        )
      };
      globalThis.TSS_ROUTES_MANIFEST = { routes: routesManifest };
    }
  };
}
export {
  routesManifestPlugin
};
//# sourceMappingURL=routes-manifest-plugin.js.map
