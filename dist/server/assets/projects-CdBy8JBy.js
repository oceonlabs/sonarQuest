import { jsx, jsxs } from "react/jsx-runtime";
import { m as mockProjects, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, B as Badge, d as CardContent, P as Progress, g as getRatingLabel, e as getRatingColor } from "./mockData-CWy8eZ3w.js";
import { B as Button } from "./router-BDnQG1OW.js";
import "react";
import "class-variance-authority";
import "@radix-ui/react-progress";
import "@tanstack/react-router";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
import "@radix-ui/react-slot";
import "clsx";
import "tailwind-merge";
function Projects() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Projects" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Monitor and improve code quality across all your projects" })
      ] }),
      /* @__PURE__ */ jsx(Button, { children: "Add Project" })
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6", children: [
      mockProjects.map((project) => /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden hover:shadow-lg transition-shadow", children: [
        /* @__PURE__ */ jsx("div", { className: `absolute top-0 left-0 right-0 h-1 ${project.qualityGateStatus === "OK" ? "bg-green-500" : project.qualityGateStatus === "WARN" ? "bg-yellow-500" : "bg-red-500"}` }),
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg line-clamp-1", children: project.name }),
              /* @__PURE__ */ jsx(CardDescription, { className: "text-sm mt-1 line-clamp-2", children: project.description })
            ] }),
            /* @__PURE__ */ jsx(
              Badge,
              {
                variant: project.qualityGateStatus === "OK" ? "success" : project.qualityGateStatus === "WARN" ? "warning" : "destructive",
                className: "ml-2 flex-shrink-0",
                children: project.qualityGateStatus
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
            "Last analysis: ",
            new Date(project.lastAnalysisDate).toLocaleDateString()
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { className: "space-y-4", children: [
          /* @__PURE__ */ jsxs("div", { className: "space-y-3", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Test Coverage" }),
                /* @__PURE__ */ jsxs("span", { className: project.metrics.coverage >= 80 ? "text-green-600" : project.metrics.coverage >= 60 ? "text-yellow-600" : "text-red-600", children: [
                  project.metrics.coverage.toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Progress,
                {
                  value: project.metrics.coverage,
                  className: "h-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Duplicated Lines" }),
                /* @__PURE__ */ jsxs("span", { className: project.metrics.duplicated_lines_density <= 3 ? "text-green-600" : project.metrics.duplicated_lines_density <= 10 ? "text-yellow-600" : "text-red-600", children: [
                  project.metrics.duplicated_lines_density.toFixed(1),
                  "%"
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Progress,
                {
                  value: Math.min(project.metrics.duplicated_lines_density, 20) * 5,
                  className: "h-2"
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
            /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Ratings" }),
            /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
              /* @__PURE__ */ jsxs(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${getRatingColor(project.metrics.reliability_rating)}`,
                  children: [
                    "R: ",
                    getRatingLabel(project.metrics.reliability_rating)
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${getRatingColor(project.metrics.security_rating)}`,
                  children: [
                    "S: ",
                    getRatingLabel(project.metrics.security_rating)
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                Badge,
                {
                  variant: "outline",
                  className: `text-xs ${getRatingColor(project.metrics.sqale_rating)}`,
                  children: [
                    "M: ",
                    getRatingLabel(project.metrics.sqale_rating)
                  ]
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-3 gap-4 pt-2 border-t", children: [
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-red-600", children: project.metrics.bugs }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Bugs" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-orange-600", children: project.metrics.vulnerabilities }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Vulnerabilities" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsx("div", { className: "text-lg font-bold text-yellow-600", children: project.metrics.code_smells }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Code Smells" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Technical Debt" }),
            /* @__PURE__ */ jsxs("span", { className: "text-gray-500", children: [
              project.metrics.technical_debt,
              "min"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center text-sm", children: [
            /* @__PURE__ */ jsx("span", { className: "font-medium", children: "Lines of Code" }),
            /* @__PURE__ */ jsx("span", { className: "text-gray-500", children: project.metrics.ncloc.toLocaleString() })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex gap-2 pt-2", children: [
            /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", className: "flex-1", children: "View Details" }),
            /* @__PURE__ */ jsx(Button, { size: "sm", className: "flex-1", children: "Fix Issues" })
          ] })
        ] })
      ] }, project.id)),
      /* @__PURE__ */ jsx(Card, { className: "border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors cursor-pointer group", children: /* @__PURE__ */ jsxs(CardContent, { className: "flex flex-col items-center justify-center h-full min-h-[400px] text-center p-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-4 group-hover:scale-110 transition-transform", children: "➕" }),
        /* @__PURE__ */ jsx(CardTitle, { className: "text-lg mb-2 text-gray-500 group-hover:text-blue-600", children: "Add New Project" }),
        /* @__PURE__ */ jsx(CardDescription, { className: "text-center", children: "Connect your SonarQube project to start tracking code quality metrics" }),
        /* @__PURE__ */ jsx(Button, { className: "mt-4", children: "Connect Project" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs(Card, { className: "mt-8", children: [
      /* @__PURE__ */ jsxs(CardHeader, { children: [
        /* @__PURE__ */ jsx(CardTitle, { children: "Project Summary" }),
        /* @__PURE__ */ jsx(CardDescription, { children: "Overview of all monitored projects" })
      ] }),
      /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-6", children: [
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-green-600", children: mockProjects.filter((p) => p.qualityGateStatus === "OK").length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Passing Quality Gate" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-yellow-600", children: mockProjects.filter((p) => p.qualityGateStatus === "WARN").length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Warning Status" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-red-600", children: mockProjects.filter((p) => p.qualityGateStatus === "ERROR").length }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Failed Quality Gate" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
          /* @__PURE__ */ jsx("div", { className: "text-2xl font-bold text-blue-600", children: mockProjects.reduce((acc, p) => acc + p.metrics.ncloc, 0).toLocaleString() }),
          /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "Total Lines of Code" })
        ] })
      ] }) })
    ] })
  ] }) });
}
const SplitComponent = Projects;
export {
  SplitComponent as component
};
