import { jsx } from "react/jsx-runtime";
import * as React from "react";
import { c as cn } from "./router-BDnQG1OW.js";
import { cva } from "class-variance-authority";
import * as ProgressPrimitive from "@radix-ui/react-progress";
const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("flex flex-col space-y-1.5 p-6", className), ...props }));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    ),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-gray-500", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
        secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-gray-900 border-gray-300",
        success: "border-transparent bg-green-500 text-white hover:bg-green-600",
        warning: "border-transparent bg-yellow-500 text-white hover:bg-yellow-600"
      }
    },
    defaultVariants: {
      variant: "default"
    }
  }
);
function Badge({ className, variant, ...props }) {
  return /* @__PURE__ */ jsx("div", { className: cn(badgeVariants({ variant }), className), ...props });
}
const Progress = React.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsx(
  ProgressPrimitive.Root,
  {
    ref,
    className: cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-gray-200",
      className
    ),
    ...props,
    children: /* @__PURE__ */ jsx(
      ProgressPrimitive.Indicator,
      {
        className: "h-full w-full flex-1 bg-blue-600 transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = ProgressPrimitive.Root.displayName;
const mockProjects = [
  {
    id: "1",
    name: "SonarQuest Frontend",
    key: "sonarquest-frontend",
    description: "React-based frontend for SonarQuest gamification platform",
    qualityGateStatus: "OK",
    metrics: {
      reliability_rating: 1,
      security_rating: 1,
      sqale_rating: 1,
      coverage: 87.5,
      duplicated_lines_density: 3.2,
      ncloc: 12500,
      bugs: 2,
      vulnerabilities: 0,
      code_smells: 15,
      technical_debt: 120
    },
    lastAnalysisDate: "2025-01-15T10:30:00Z"
  },
  {
    id: "2",
    name: "SonarQuest API",
    key: "sonarquest-api",
    description: "Backend API for SonarQuest gamification system",
    qualityGateStatus: "WARN",
    metrics: {
      reliability_rating: 2,
      security_rating: 1,
      sqale_rating: 2,
      coverage: 72.8,
      duplicated_lines_density: 5.1,
      ncloc: 8900,
      bugs: 5,
      vulnerabilities: 1,
      code_smells: 28,
      technical_debt: 245
    },
    lastAnalysisDate: "2025-01-14T16:45:00Z"
  },
  {
    id: "3",
    name: "Data Analytics Service",
    key: "data-analytics",
    description: "Microservice for processing and analyzing code metrics",
    qualityGateStatus: "ERROR",
    metrics: {
      reliability_rating: 3,
      security_rating: 2,
      sqale_rating: 3,
      coverage: 45.2,
      duplicated_lines_density: 12.8,
      ncloc: 6300,
      bugs: 12,
      vulnerabilities: 3,
      code_smells: 45,
      technical_debt: 380
    },
    lastAnalysisDate: "2025-01-13T09:20:00Z"
  }
];
const mockAchievements = [
  {
    id: "bug-hunter",
    name: "Bug Hunter",
    description: "Fixed 10+ bugs in a single month",
    icon: "🐛",
    earnedDate: "2025-01-10T00:00:00Z",
    category: "reliability"
  },
  {
    id: "security-champion",
    name: "Security Champion",
    description: "Resolved 5+ security vulnerabilities",
    icon: "🔒",
    earnedDate: "2025-01-05T00:00:00Z",
    category: "security"
  },
  {
    id: "code-cleaner",
    name: "Code Cleaner",
    description: "Fixed 25+ code smells",
    icon: "✨",
    earnedDate: "2024-12-28T00:00:00Z",
    category: "maintainability"
  },
  {
    id: "coverage-hero",
    name: "Coverage Hero",
    description: "Improved test coverage by 15%+",
    icon: "🎯",
    earnedDate: "2024-12-20T00:00:00Z",
    category: "coverage"
  }
];
const mockDevelopers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex.johnson@company.com",
    avatar: "👨‍💻",
    stats: {
      totalCommits: 127,
      issuesFixed: 45,
      codeSmellsFixed: 32,
      bugsFixed: 18,
      vulnerabilitiesFixed: 5,
      coverageImprovement: 12.3
    },
    achievements: mockAchievements.slice(0, 3),
    score: 2850,
    rank: 1
  },
  {
    id: "2",
    name: "Sarah Chen",
    email: "sarah.chen@company.com",
    avatar: "👩‍💻",
    stats: {
      totalCommits: 98,
      issuesFixed: 38,
      codeSmellsFixed: 28,
      bugsFixed: 15,
      vulnerabilitiesFixed: 8,
      coverageImprovement: 18.7
    },
    achievements: [mockAchievements[1], mockAchievements[3]],
    score: 2720,
    rank: 2
  },
  {
    id: "3",
    name: "Mike Rodriguez",
    email: "mike.rodriguez@company.com",
    avatar: "🧑‍💻",
    stats: {
      totalCommits: 85,
      issuesFixed: 29,
      codeSmellsFixed: 22,
      bugsFixed: 12,
      vulnerabilitiesFixed: 3,
      coverageImprovement: 8.4
    },
    achievements: [mockAchievements[0], mockAchievements[2]],
    score: 2180,
    rank: 3
  },
  {
    id: "4",
    name: "Emma Wilson",
    email: "emma.wilson@company.com",
    avatar: "👩‍🔬",
    stats: {
      totalCommits: 76,
      issuesFixed: 25,
      codeSmellsFixed: 19,
      bugsFixed: 9,
      vulnerabilitiesFixed: 2,
      coverageImprovement: 6.1
    },
    achievements: [mockAchievements[2]],
    score: 1940,
    rank: 4
  }
];
const mockTeams = [
  {
    id: "1",
    name: "Frontend Wizards",
    members: mockDevelopers.slice(0, 2),
    projects: [mockProjects[0]],
    totalScore: 5570,
    rank: 1
  },
  {
    id: "2",
    name: "Backend Heroes",
    members: mockDevelopers.slice(2, 4),
    projects: [mockProjects[1], mockProjects[2]],
    totalScore: 4120,
    rank: 2
  }
];
const getRatingColor = (rating) => {
  switch (rating) {
    case 1:
      return "text-green-600";
    case 2:
      return "text-yellow-600";
    case 3:
      return "text-orange-600";
    case 4:
    case 5:
      return "text-red-600";
    default:
      return "text-gray-600";
  }
};
const getRatingLabel = (rating) => {
  switch (rating) {
    case 1:
      return "A";
    case 2:
      return "B";
    case 3:
      return "C";
    case 4:
      return "D";
    case 5:
      return "E";
    default:
      return "N/A";
  }
};
export {
  Badge as B,
  Card as C,
  Progress as P,
  CardHeader as a,
  CardTitle as b,
  CardDescription as c,
  CardContent as d,
  getRatingColor as e,
  mockDevelopers as f,
  getRatingLabel as g,
  mockTeams as h,
  mockAchievements as i,
  mockProjects as m
};
