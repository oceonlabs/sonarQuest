import { Link, createRootRoute, HeadContent, Scripts, createFileRoute, lazyRouteComponent, createRouter } from "@tanstack/react-router";
import { jsx, jsxs } from "react/jsx-runtime";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { TanstackDevtools } from "@tanstack/react-devtools";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-blue-600 text-white hover:bg-blue-700",
        destructive: "bg-red-600 text-white hover:bg-red-700",
        outline: "border border-gray-300 bg-white hover:bg-gray-50 hover:text-gray-900",
        secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900",
        link: "text-blue-600 underline-offset-4 hover:underline"
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return /* @__PURE__ */ jsx(
      Comp,
      {
        className: cn(buttonVariants({ variant, size, className })),
        ref,
        ...props
      }
    );
  }
);
Button.displayName = "Button";
function Header() {
  return /* @__PURE__ */ jsx("header", { className: "sticky top-0 z-50 w-full border-b bg-gray-50/95 backdrop-blur supports-[backdrop-filter]:bg-gray-50/60", children: /* @__PURE__ */ jsxs("div", { className: "container flex h-16 items-center justify-between px-4", children: [
    /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsx("div", { className: "text-2xl", children: "🎮" }),
      /* @__PURE__ */ jsx(Link, { to: "/", className: "text-xl font-bold text-blue-600", children: "SonarQuest" })
    ] }),
    /* @__PURE__ */ jsxs("nav", { className: "flex items-center gap-6", children: [
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/",
          className: "text-sm font-medium transition-colors hover:text-blue-600",
          activeOptions: { exact: true },
          activeProps: { className: "text-blue-600" },
          inactiveProps: { className: "text-gray-500" },
          children: "Dashboard"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/leaderboard",
          className: "text-sm font-medium transition-colors hover:text-blue-600",
          activeProps: { className: "text-blue-600" },
          inactiveProps: { className: "text-gray-500" },
          children: "Leaderboard"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/projects",
          className: "text-sm font-medium transition-colors hover:text-blue-600",
          activeProps: { className: "text-blue-600" },
          inactiveProps: { className: "text-gray-500" },
          children: "Projects"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/achievements",
          className: "text-sm font-medium transition-colors hover:text-blue-600",
          activeProps: { className: "text-blue-600" },
          inactiveProps: { className: "text-gray-500" },
          children: "Achievements"
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", children: "Connect SonarQube" }) })
  ] }) });
}
const appCss = "/assets/styles-Bl3CRbMQ.css";
const Route$4 = createRootRoute({
  head: () => ({
    meta: [{
      charSet: "utf-8"
    }, {
      name: "viewport",
      content: "width=device-width, initial-scale=1"
    }, {
      title: "SonarQuest - Gamify Your Code Quality"
    }],
    links: [{
      rel: "stylesheet",
      href: appCss
    }]
  }),
  shellComponent: RootDocument
});
function RootDocument({
  children
}) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsx("head", { children: /* @__PURE__ */ jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxs("body", { children: [
      /* @__PURE__ */ jsx(Header, {}),
      children,
      /* @__PURE__ */ jsx(TanstackDevtools, { config: {
        position: "bottom-left"
      }, plugins: [{
        name: "Tanstack Router",
        render: /* @__PURE__ */ jsx(TanStackRouterDevtoolsPanel, {})
      }] }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const $$splitComponentImporter$3 = () => import("./projects-CdBy8JBy.js");
const Route$3 = createFileRoute("/projects")({
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./leaderboard-CW_BtRGd.js");
const Route$2 = createFileRoute("/leaderboard")({
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./achievements-C82Fb-yh.js");
const Route$1 = createFileRoute("/achievements")({
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-BUh0jA4W.js");
const Route = createFileRoute("/")({
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const ProjectsRoute = Route$3.update({
  id: "/projects",
  path: "/projects",
  getParentRoute: () => Route$4
});
const LeaderboardRoute = Route$2.update({
  id: "/leaderboard",
  path: "/leaderboard",
  getParentRoute: () => Route$4
});
const AchievementsRoute = Route$1.update({
  id: "/achievements",
  path: "/achievements",
  getParentRoute: () => Route$4
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$4
});
const rootRouteChildren = {
  IndexRoute,
  AchievementsRoute,
  LeaderboardRoute,
  ProjectsRoute
};
const routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  return createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  Button as B,
  cn as c,
  router as r
};
