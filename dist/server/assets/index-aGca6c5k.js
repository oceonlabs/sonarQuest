import { jsx, jsxs } from "react/jsx-runtime";
import { C as Card, a as CardHeader, b as CardTitle, d as CardContent, m as mockProjects, f as mockDevelopers, h as mockTeams, B as Badge, c as CardDescription, P as Progress, g as getRatingLabel, e as getRatingColor } from "./mockData-YaSKcHyi.js";
import "react";
import "./router-CMODOzh_.js";
import "@tanstack/react-router";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-progress";
function Dashboard() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "SonarQuest Dashboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Gamify your code quality journey with SonarQube integration" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-8", children: [
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Total Projects" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-blue-600", children: mockProjects.length }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Active projects being monitored" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Active Developers" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-blue-600", children: mockDevelopers.length }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Contributing to code quality" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs(Card, { children: [
        /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "Teams" }) }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-blue-600", children: mockTeams.length }),
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: "Competing in the challenge" })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Projects" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: mockProjects.map((project) => /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: project.name }),
              /* @__PURE__ */ jsx(Badge, { variant: project.qualityGateStatus === "OK" ? "success" : project.qualityGateStatus === "WARN" ? "warning" : "destructive", children: project.qualityGateStatus })
            ] }),
            /* @__PURE__ */ jsx(CardDescription, { children: project.description })
          ] }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 gap-4", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between mb-2", children: [
                  /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Coverage" }),
                  /* @__PURE__ */ jsxs("span", { className: "text-sm", children: [
                    project.metrics.coverage.toFixed(1),
                    "%"
                  ] })
                ] }),
                /* @__PURE__ */ jsx(Progress, { value: project.metrics.coverage, className: "h-2" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
                /* @__PURE__ */ jsx("span", { className: "text-sm font-medium", children: "Ratings" }),
                /* @__PURE__ */ jsxs("div", { className: "flex gap-2", children: [
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: getRatingColor(project.metrics.reliability_rating), children: [
                    "R: ",
                    getRatingLabel(project.metrics.reliability_rating)
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: getRatingColor(project.metrics.security_rating), children: [
                    "S: ",
                    getRatingLabel(project.metrics.security_rating)
                  ] }),
                  /* @__PURE__ */ jsxs(Badge, { variant: "outline", className: getRatingColor(project.metrics.sqale_rating), children: [
                    "M: ",
                    getRatingLabel(project.metrics.sqale_rating)
                  ] })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4 grid grid-cols-3 gap-4 text-sm", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-red-600", children: project.metrics.bugs }),
                /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "Bugs" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-orange-600", children: project.metrics.vulnerabilities }),
                /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "Vulnerabilities" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "font-semibold text-yellow-600", children: project.metrics.code_smells }),
                /* @__PURE__ */ jsx("div", { className: "text-gray-500", children: "Code Smells" })
              ] })
            ] })
          ] })
        ] }, project.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Developer Leaderboard" }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "Top Contributors" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Based on code quality improvements" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsx("div", { className: "space-y-4", children: mockDevelopers.map((developer, index) => /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4 p-3 rounded-lg bg-gray-100/50", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-center w-8 h-8 rounded-full bg-blue-600 text-blue-600-foreground font-bold text-sm", children: [
              "#",
              developer.rank
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-2xl", children: developer.avatar }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsx("div", { className: "font-semibold", children: developer.name }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500", children: [
                developer.stats.issuesFixed,
                " issues fixed • ",
                developer.achievements.length,
                " achievements"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-lg text-blue-600", children: developer.score.toLocaleString() }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "points" })
            ] })
          ] }, developer.id)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
          /* @__PURE__ */ jsx("h3", { className: "text-xl font-semibold mb-4", children: "Team Rankings" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-3", children: mockTeams.map((team) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "font-semibold flex items-center gap-2", children: [
                /* @__PURE__ */ jsxs(Badge, { variant: "outline", children: [
                  "#",
                  team.rank
                ] }),
                team.name
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mt-1", children: [
                team.members.length,
                " members • ",
                team.projects.length,
                " projects"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "font-bold text-xl text-blue-600", children: team.totalScore.toLocaleString() }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "points" })
            ] })
          ] }) }) }, team.id)) })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mt-8", children: [
      /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-4", children: "Recent Achievements" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: mockDevelopers.flatMap((dev) => dev.achievements).slice(0, 8).map((achievement) => /* @__PURE__ */ jsx(Card, { className: "text-center", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-4xl mb-2", children: achievement.icon }),
        /* @__PURE__ */ jsx("h3", { className: "font-semibold", children: achievement.name }),
        /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500 mt-1", children: achievement.description }),
        /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "mt-2", children: achievement.category })
      ] }) }, achievement.id)) })
    ] })
  ] }) });
}
const SplitComponent = Dashboard;
export {
  SplitComponent as component
};
