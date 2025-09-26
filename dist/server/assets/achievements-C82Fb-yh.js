import { jsx, jsxs } from "react/jsx-runtime";
import { i as mockAchievements, f as mockDevelopers, C as Card, d as CardContent, P as Progress, B as Badge, a as CardHeader, b as CardTitle, c as CardDescription } from "./mockData-CWy8eZ3w.js";
import "react";
import "./router-BDnQG1OW.js";
import "@tanstack/react-router";
import "@tanstack/react-router-devtools";
import "@tanstack/react-devtools";
import "@radix-ui/react-slot";
import "class-variance-authority";
import "clsx";
import "tailwind-merge";
import "@radix-ui/react-progress";
function Achievements() {
  const allAchievements = mockAchievements.map((achievement) => {
    const earnedCount = mockDevelopers.filter(
      (dev) => dev.achievements.some((a) => a.id === achievement.id)
    ).length;
    return { ...achievement, earnedCount, totalDevelopers: mockDevelopers.length };
  });
  const recentAchievements = mockDevelopers.flatMap(
    (dev) => dev.achievements.map((achievement) => ({
      ...achievement,
      developerName: dev.name,
      developerAvatar: dev.avatar
    }))
  ).sort((a, b) => new Date(b.earnedDate).getTime() - new Date(a.earnedDate).getTime()).slice(0, 6);
  const getCategoryColor = (category) => {
    switch (category) {
      case "reliability":
        return "bg-green-500 text-white";
      case "security":
        return "bg-red-500 text-white";
      case "maintainability":
        return "bg-blue-500 text-white";
      case "coverage":
        return "bg-purple-500 text-white";
      case "general":
        return "bg-gray-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const getCategoryIcon = (category) => {
    switch (category) {
      case "reliability":
        return "🔧";
      case "security":
        return "🛡️";
      case "maintainability":
        return "🧹";
      case "coverage":
        return "📊";
      case "general":
        return "⭐";
      default:
        return "🏆";
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "min-h-screen bg-gray-50", children: /* @__PURE__ */ jsxs("div", { className: "container mx-auto px-4 py-8", children: [
    /* @__PURE__ */ jsxs("div", { className: "mb-8", children: [
      /* @__PURE__ */ jsx("h1", { className: "text-4xl font-bold text-gray-900 mb-2", children: "Achievements" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-500", children: "Unlock badges and rewards for improving code quality" })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8", children: ["reliability", "security", "maintainability", "coverage", "general"].map((category) => {
      const categoryAchievements = allAchievements.filter((a) => a.category === category);
      const totalEarned = categoryAchievements.reduce((sum, a) => sum + a.earnedCount, 0);
      const totalPossible = categoryAchievements.length * mockDevelopers.length;
      return /* @__PURE__ */ jsx(Card, { className: "text-center", children: /* @__PURE__ */ jsxs(CardContent, { className: "pt-6", children: [
        /* @__PURE__ */ jsx("div", { className: "text-3xl mb-2", children: getCategoryIcon(category) }),
        /* @__PURE__ */ jsx("div", { className: "font-semibold capitalize", children: category }),
        /* @__PURE__ */ jsxs("div", { className: "text-sm text-gray-500 mt-1", children: [
          totalEarned,
          "/",
          totalPossible,
          " earned"
        ] }),
        /* @__PURE__ */ jsx(
          Progress,
          {
            value: totalEarned / totalPossible * 100,
            className: "h-2 mt-2"
          }
        )
      ] }) }, category);
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-8", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-6", children: "All Achievements" }),
        /* @__PURE__ */ jsx("div", { className: "space-y-4", children: allAchievements.map((achievement) => /* @__PURE__ */ jsx(Card, { className: "hover:shadow-md transition-shadow", children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsx("div", { className: "text-4xl flex-shrink-0", children: achievement.icon }),
          /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-start justify-between gap-2 mb-2", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsx("h3", { className: "font-semibold text-lg", children: achievement.name }),
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-500", children: achievement.description })
              ] }),
              /* @__PURE__ */ jsx(
                Badge,
                {
                  className: getCategoryColor(achievement.category),
                  variant: "secondary",
                  children: achievement.category
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-4", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                /* @__PURE__ */ jsx("span", { children: "Earned by developers" }),
                /* @__PURE__ */ jsxs("span", { children: [
                  achievement.earnedCount,
                  "/",
                  achievement.totalDevelopers
                ] })
              ] }),
              /* @__PURE__ */ jsx(
                Progress,
                {
                  value: achievement.earnedCount / achievement.totalDevelopers * 100,
                  className: "h-2"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "mt-3", children: [
              achievement.earnedCount === 0 && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs", children: "🔒 Unclaimed" }),
              achievement.earnedCount === 1 && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-purple-600", children: "💎 Legendary" }),
              achievement.earnedCount > 1 && achievement.earnedCount <= mockDevelopers.length * 0.25 && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-blue-600", children: "💠 Rare" }),
              achievement.earnedCount > mockDevelopers.length * 0.25 && achievement.earnedCount <= mockDevelopers.length * 0.75 && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-green-600", children: "🟢 Common" }),
              achievement.earnedCount > mockDevelopers.length * 0.75 && /* @__PURE__ */ jsx(Badge, { variant: "outline", className: "text-xs text-gray-600", children: "⚪ Basic" })
            ] })
          ] })
        ] }) }) }, achievement.id)) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("h2", { className: "text-2xl font-semibold mb-6", children: "Recent Achievements" }),
          /* @__PURE__ */ jsx("div", { className: "space-y-4", children: recentAchievements.map((achievement, index) => /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsx(CardContent, { className: "pt-6", children: /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
            /* @__PURE__ */ jsx("div", { className: "text-2xl", children: achievement.icon }),
            /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 mb-1", children: [
                /* @__PURE__ */ jsx("span", { className: "text-lg", children: achievement.developerAvatar }),
                /* @__PURE__ */ jsx("span", { className: "font-semibold", children: achievement.developerName }),
                /* @__PURE__ */ jsx("span", { className: "text-gray-500 text-sm", children: "earned" })
              ] }),
              /* @__PURE__ */ jsx("div", { className: "font-medium", children: achievement.name }),
              /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: new Date(achievement.earnedDate).toLocaleDateString() })
            ] }),
            /* @__PURE__ */ jsx(
              Badge,
              {
                className: getCategoryColor(achievement.category),
                variant: "secondary",
                children: achievement.category
              }
            )
          ] }) }) }, `${achievement.id}-${achievement.developerName}-${index}`)) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { children: [
          /* @__PURE__ */ jsxs(CardHeader, { children: [
            /* @__PURE__ */ jsx(CardTitle, { children: "🎯 Progress Tracking" }),
            /* @__PURE__ */ jsx(CardDescription, { children: "Track your journey toward upcoming achievements" })
          ] }),
          /* @__PURE__ */ jsx(CardContent, { children: /* @__PURE__ */ jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                /* @__PURE__ */ jsx("span", { children: "🔥 Streak Master (7 consecutive days)" }),
                /* @__PURE__ */ jsx("span", { children: "4/7 days" })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: 57, className: "h-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                /* @__PURE__ */ jsx("span", { children: "🧹 Clean Code Champion (50 code smells)" }),
                /* @__PURE__ */ jsx("span", { children: "32/50 fixed" })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: 64, className: "h-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                /* @__PURE__ */ jsx("span", { children: "🎯 Coverage Expert (90% coverage)" }),
                /* @__PURE__ */ jsx("span", { children: "87.5/90%" })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: 97, className: "h-2" })
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-sm mb-2", children: [
                /* @__PURE__ */ jsx("span", { children: "🚀 Performance Pro (0ms response time)" }),
                /* @__PURE__ */ jsx("span", { children: "12/0ms avg" })
              ] }),
              /* @__PURE__ */ jsx(Progress, { value: 0, className: "h-2" }),
              /* @__PURE__ */ jsx("div", { className: "text-xs text-gray-500 mt-1", children: "Need to optimize response times" })
            ] })
          ] }) })
        ] }),
        /* @__PURE__ */ jsxs(Card, { className: "border-2 border-dashed border-primary/20", children: [
          /* @__PURE__ */ jsx(CardHeader, { children: /* @__PURE__ */ jsx(CardTitle, { className: "text-lg", children: "💡 Achievement Tips" }) }),
          /* @__PURE__ */ jsxs(CardContent, { className: "text-sm space-y-2", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "🐛" }),
              /* @__PURE__ */ jsx("span", { children: "Focus on fixing bugs to unlock reliability achievements" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "🔒" }),
              /* @__PURE__ */ jsx("span", { children: "Address security vulnerabilities for security badges" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "📈" }),
              /* @__PURE__ */ jsx("span", { children: "Improve test coverage to earn coverage achievements" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsx("span", { children: "✨" }),
              /* @__PURE__ */ jsx("span", { children: "Clean up code smells for maintainability rewards" })
            ] })
          ] })
        ] })
      ] })
    ] })
  ] }) });
}
const SplitComponent = Achievements;
export {
  SplitComponent as component
};
