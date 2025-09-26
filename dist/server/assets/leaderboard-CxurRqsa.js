import { jsx, jsxs } from "react/jsx-runtime";
import { f as mockDevelopers, C as Card, a as CardHeader, b as CardTitle, c as CardDescription, d as CardContent, B as Badge, h as mockTeams, P as Progress } from "./mockData-YaSKcHyi.js";
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
function Leaderboard() {
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Leaderboard" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Top performers in code quality improvement" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Individual Rankings" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: mockDevelopers.map((developer, index) => /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: `absolute top-0 left-0 w-1 h-full ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-blue-500"}` }),
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : index === 2 ? "bg-amber-600" : "bg-blue-500"}`, children: [
                "#",
                developer.rank
              ] }),
              /* @__PURE__ */ jsx("div", { className: "text-4xl", children: developer.avatar }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-xl", children: developer.name }),
                /* @__PURE__ */ jsx(CardDescription, { children: developer.email })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-blue-600", children: developer.score.toLocaleString() }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "points" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-2 md:grid-cols-3 gap-4 mb-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-green-600", children: developer.stats.bugsFixed }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Bugs Fixed" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-red-600", children: developer.stats.vulnerabilitiesFixed }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Vulnerabilities" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-yellow-600", children: developer.stats.codeSmellsFixed }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Code Smells" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsxs("div", { className: "text-lg font-semibold text-blue-600", children: [
                  developer.stats.coverageImprovement.toFixed(1),
                  "%"
                ] }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Coverage +" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-purple-600", children: developer.stats.totalCommits }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Commits" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "text-center", children: [
                /* @__PURE__ */ jsx("div", { className: "text-lg font-semibold text-indigo-600", children: developer.achievements.length }),
                /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "Achievements" })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-sm text-gray-500", children: "Recent Achievements" }),
              /* @__PURE__ */ jsxs("div", { className: "flex flex-wrap gap-2", children: [
                developer.achievements.map((achievement) => /* @__PURE__ */ jsxs(Badge, { variant: "secondary", className: "text-xs", children: [
                  achievement.icon,
                  " ",
                  achievement.name
                ] }, achievement.id)),
                developer.achievements.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "No achievements yet" })
              ] })
            ] })
          ] })
        ] }, developer.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Team Rankings" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: mockTeams.map((team, index) => /* @__PURE__ */ jsxs(Card, { className: "relative overflow-hidden", children: [
          /* @__PURE__ */ jsx("div", { className: `absolute top-0 left-0 w-1 h-full ${index === 0 ? "bg-yellow-500" : "bg-blue-500"}` }),
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxs("div", { className: `flex items-center justify-center w-12 h-12 rounded-full text-white font-bold text-lg ${index === 0 ? "bg-yellow-500" : "bg-blue-500"}`, children: [
                "#",
                team.rank
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx(CardTitle, { className: "text-xl", children: team.name }),
                /* @__PURE__ */ jsxs(CardDescription, { children: [
                  team.members.length,
                  " members • ",
                  team.projects.length,
                  " projects"
                ] })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
              /* @__PURE__ */ jsx("div", { className: "text-3xl font-bold text-blue-600", children: team.totalScore.toLocaleString() }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: "total points" })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxs(CardContent, { children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium mb-3 text-sm text-gray-500", children: "Team Members" }),
              /* @__PURE__ */ jsx("div", { className: "space-y-2", children: team.members.map((member) => /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between p-2 bg-gray-100/30 rounded-md", children: [
                /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsx("div", { className: "text-lg", children: member.avatar }),
                  /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsx("div", { className: "font-medium text-sm", children: member.name }),
                    /* @__PURE__ */ jsxs("div", { className: "text-xs text-gray-500", children: [
                      member.achievements.length,
                      " achievements"
                    ] })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "text-right", children: [
                  /* @__PURE__ */ jsx("div", { className: "font-semibold text-blue-600", children: member.score.toLocaleString() }),
                  /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500", children: "points" })
                ] })
              ] }, member.id)) })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsx("h4", { className: "font-medium mb-2 text-sm text-gray-500", children: "Projects" }),
              /* @__PURE__ */ jsx("div", { className: "flex flex-wrap gap-2", children: team.projects.map((project) => /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: project.name }, project.id)) })
            ] })
          ] })
        ] }, team.id)) }),
        /* @__PURE__ */ jsxs(Card, { className: "mt-6 border-2 border-dashed border-primary/20", children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { className: "flex items-center gap-2", children: "🏆 Monthly Challenge" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Fix 50 issues to win the monthly challenge" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                /* @__PURE__ */ jsx("span", { children: "Progress" }),
                /* @__PURE__ */ jsx("span", { children: "32/50 issues" })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: 64, className: "h-3" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsx(Badge, { variant: "secondary", className: "text-sm", children: "🎯 18 issues remaining" }) })
          ] }) })
        ] })
      ] })
    ] })
  ] }) });
}
const SplitComponent = Leaderboard;
export {
  SplitComponent as component
};
