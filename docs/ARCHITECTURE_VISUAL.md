# SonarQuest Visual Architecture Guide

A simplified visual guide to understanding the SonarQuest architecture.

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER BROWSER                              │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    React Application                        │ │
│  │                                                             │ │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │ │
│  │  │Dashboard │  │Leaderboard│ │ Projects │  │Achieveme│  │ │
│  │  │   Page   │  │   Page    │  │   Page   │  │nts Page │  │ │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │ │
│  │       │               │              │             │       │ │
│  │       └───────────────┴──────────────┴─────────────┘       │ │
│  │                         │                                   │ │
│  │                         ▼                                   │ │
│  │              ┌────────────────────┐                        │ │
│  │              │   DataService      │                        │ │
│  │              │   (with Cache)     │                        │ │
│  │              └────────────────────┘                        │ │
│  │                         │                                   │ │
│  │       ┌─────────────────┼─────────────────┐               │ │
│  │       │                 │                 │               │ │
│  │       ▼                 ▼                 ▼               │ │
│  │  ┌────────┐    ┌──────────────┐    ┌────────┐           │ │
│  │  │SonarQube│    │ConfigService│    │  Mock  │           │ │
│  │  │ Client  │    │             │    │  Data  │           │ │
│  │  │ Service │    └──────────────┘    └────────┘           │ │
│  │  └────────┘                                               │ │
│  └─────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
┌───────────────────────────────────────────────────────────────┐
│                      SERVER SIDE                               │
│  (TanStack Start Backend)                                      │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              SonarQube Proxy Service                      │ │
│  │              (Handles CORS & Auth)                        │ │
│  └──────────────────────────────────────────────────────────┘ │
└───────────────────────────────┬───────────────────────────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   SonarQube Server    │
                    │   (External API)      │
                    └───────────────────────┘
```

## 🔄 Data Flow Journey

### Scenario: User Opens Dashboard

```
1. User navigates to "/"
   │
   ▼
2. TanStack Router loads Dashboard component
   │
   ▼
3. Dashboard calls DataService.getProjects()
   │
   ├─> Check cache
   │   ├─ Cache hit ──> Return cached data ✓
   │   └─ Cache miss ─┐
   │                  │
   │                  ▼
4. DataService checks ConfigService
   │
   ├─> Connected to SonarQube?
   │   ├─ Yes ─┐
   │   │       ▼
   │   │   Try SonarQubeClientService (browser API)
   │   │       │
   │   │       ├─ Success ──> Cache & return data ✓
   │   │       └─ Fail ─┐
   │   │               │
   │   │               ▼
   │   │   Try SonarQubeService (server proxy)
   │   │       │
   │   │       ├─ Success ──> Cache & return data ✓
   │   │       └─ Fail ─┐
   │   │               │
   │   └─ No ──────────┤
   │                   │
   │                   ▼
   └──────> Use Mock Data ──> Return mock data ✓
                              (Fallback always works)
```

## 🎨 Component Structure

```
App Root (__root.tsx)
│
├── Header (Always visible)
│   ├── Logo & Title
│   ├── Navigation Menu
│   │   ├── Dashboard
│   │   ├── Leaderboard
│   │   ├── Projects
│   │   └── Achievements
│   │
│   └── Connection Status
│       └── SonarQube Connection Modal
│           ├── Connection Form
│           ├── Cloudflare Status
│           └── Settings
│
└── Page Content (Router Outlet)
    │
    ├── Dashboard Page
    │   ├── Stats Cards (3 columns)
    │   │   ├── Total Projects
    │   │   ├── Active Developers
    │   │   └── Open Issues
    │   │
    │   ├── Recent Projects Grid
    │   │   └── Project Cards
    │   │       ├── Quality Gate Badge
    │   │       ├── Coverage Bar
    │   │       └── Rating Badges
    │   │
    │   ├── Top Developers List
    │   │   └── Developer Cards with Scores
    │   │
    │   └── Team Leaderboard
    │       └── Team Rankings
    │
    ├── Leaderboard Page
    │   ├── Individual Rankings Table
    │   ├── Team Rankings Table
    │   └── Monthly Challenges
    │
    ├── Projects Page
    │   ├── Summary Stats
    │   └── Project Grid
    │       └── Detailed Project Cards
    │           ├── Quality Metrics
    │           ├── Issue Breakdown
    │           ├── Technical Debt
    │           └── Action Buttons
    │
    └── Achievements Page
        ├── Achievement Categories
        │   ├── 🔧 Reliability
        │   ├── 🛡️ Security
        │   ├── 📊 Coverage
        │   └── 🧹 Maintainability
        │
        ├── Progress Tracking
        └── Recent Activity Timeline
```

## 🗂️ Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     DataService                              │
│  (Central hub for all data operations)                       │
│                                                               │
│  Methods:                                                     │
│  • getProjects() ────────────┐                              │
│  • getProjectDetails()       │                              │
│  • getProjectActivity()      │                              │
│  • getProjectIssues()        │                              │
│  • getDevelopers()           │  All methods                 │
│  • getTeams()                ├─> use caching                │
│  • getAchievements()         │  & error handling            │
│                              │                              │
│  Internal:                   │                              │
│  • Cache Map (5 min TTL)     │                              │
│  • Singleton instance ───────┘                              │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
         ▼                    ▼                    ▼
┌──────────────────┐  ┌──────────────┐  ┌─────────────────┐
│ ConfigService    │  │SonarQube     │  │ Mock Data       │
│                  │  │Services      │  │                 │
│ • Connection     │  │              │  │ • mockProjects  │
│   settings       │  │ Client-side: │  │ • mockDevelopers│
│ • Env vars       │  │ • Direct API │  │ • mockTeams     │
│ • LocalStorage   │  │              │  │ • mockAchieve.  │
│ • Subscribers    │  │ Server-side: │  │                 │
│                  │  │ • Proxy API  │  │ Used as fallback│
└──────────────────┘  └──────────────┘  └─────────────────┘
```

## 🔌 SonarQube Connection Strategies

### Strategy 1: Direct Browser Connection
```
Browser ──────> SonarQube API (Direct)
        │
        └─ Pros: Fast, no proxy overhead
        └─ Cons: CORS issues, Cloudflare protection
        └─ Used: When CORS is enabled and no protection
```

### Strategy 2: Server Proxy
```
Browser ──> TanStack Start Server ──> SonarQube API
        │
        └─ Pros: No CORS, bypasses browser restrictions
        └─ Cons: Extra hop, server load
        └─ Used: When CORS blocks or as fallback
```

### Strategy 3: Mock Data
```
Browser ──> In-Memory Mock Data
        │
        └─ Pros: Always works, no network needed
        └─ Cons: Not real data
        └─ Used: Development or when API fails
```

## 🎯 Configuration Priority

```
┌───────────────────────────────────────────────────────┐
│  1. Environment Variables (Highest Priority)          │
│     VITE_SONARQUBE_URL                                │
│     VITE_SONARQUBE_TOKEN                              │
│     VITE_USE_REAL_SONARQUBE                           │
│                                                        │
│     → Read-only, cannot be changed via UI             │
│     → Ideal for production deployments                │
└───────────────────────────────────────────────────────┘
                    │
                    ▼ (If not set)
┌───────────────────────────────────────────────────────┐
│  2. Browser LocalStorage (Medium Priority)            │
│     Saved from Connection Modal                       │
│                                                        │
│     → User can modify via UI                          │
│     → Persists across sessions                        │
│     → Ideal for development                           │
└───────────────────────────────────────────────────────┘
                    │
                    ▼ (If not configured)
┌───────────────────────────────────────────────────────┐
│  3. Default Configuration (Lowest Priority)           │
│     isConnected: false                                │
│     Use mock data                                     │
│                                                        │
│     → Safe fallback mode                              │
│     → Always works                                    │
└───────────────────────────────────────────────────────┘
```

## 📦 File Organization Map

```
sonarQuest/
│
├── src/
│   │
│   ├── components/              ← React UI Components
│   │   ├── ui/                  ← Reusable UI primitives
│   │   │   ├── card.tsx         ← Card container
│   │   │   ├── button.tsx       ← Button with variants
│   │   │   ├── badge.tsx        ← Status badges
│   │   │   ├── progress.tsx     ← Progress bars
│   │   │   ├── dialog.tsx       ← Modal dialogs
│   │   │   ├── input.tsx        ← Form inputs
│   │   │   └── label.tsx        ← Form labels
│   │   │
│   │   ├── Dashboard.tsx        ← Main dashboard
│   │   ├── Leaderboard.tsx      ← Rankings page
│   │   ├── Projects.tsx         ← Projects page
│   │   ├── Achievements.tsx     ← Achievements page
│   │   ├── Header.tsx           ← Navigation header
│   │   ├── SonarQubeConnectionModal.tsx  ← Connection UI
│   │   ├── CloudflareHelper.tsx ← Cloudflare help
│   │   └── CloudflareStatus.tsx ← Connection status
│   │
│   ├── lib/                     ← Business Logic & Services
│   │   ├── dataService.ts       ← 🌟 Main data hub
│   │   ├── configService.ts     ← Configuration manager
│   │   ├── sonarqubeService.ts  ← Server-side API
│   │   ├── sonarqubeClientService.ts ← Client-side API
│   │   ├── sonarqubeProxy.ts    ← Server function
│   │   ├── proxyService.ts      ← Proxy config
│   │   ├── cloudflareDetector.ts ← CF detection
│   │   ├── cloudflareBypass.ts  ← CF bypass logic
│   │   ├── mockData.ts          ← Sample data
│   │   ├── utils.ts             ← Utilities
│   │   └── hooks/
│   │       └── useSonarQubeConnection.ts ← Connection hook
│   │
│   ├── routes/                  ← TanStack Router Pages
│   │   ├── __root.tsx           ← Root layout
│   │   ├── index.tsx            ← "/" → Dashboard
│   │   ├── leaderboard.tsx      ← "/leaderboard"
│   │   ├── projects.tsx         ← "/projects"
│   │   └── achievements.tsx     ← "/achievements"
│   │
│   ├── router.tsx               ← Router setup
│   ├── routeTree.gen.ts         ← Generated routes
│   └── styles.css               ← Global styles
│
├── public/                      ← Static assets
│
├── docs/
│   └── ARCHITECTURE_VISUAL.md   ← 🎨 This file
│
├── ARCHITECTURE.md              ← 📚 Full documentation
├── README.md                    ← Getting started
├── package.json                 ← Dependencies
└── vite.config.ts              ← Build config
```

## 🎨 UI Component Hierarchy

```
All Pages Use These Base Components:

Card Component
├─ CardHeader
│  ├─ CardTitle
│  └─ CardDescription
├─ CardContent
└─ CardFooter

Button Component (Variants)
├─ default (blue)
├─ destructive (red)
├─ outline (white with border)
├─ secondary (gray)
├─ ghost (transparent)
└─ link (underlined text)

Badge Component (Variants)
├─ default (blue)
├─ secondary (gray)
├─ destructive (red)
├─ outline (bordered)
├─ success (green)
└─ warning (yellow)

Progress Component
└─ Animated progress bar with percentage

Dialog Component
├─ DialogTrigger (button)
├─ DialogContent (modal)
│  ├─ DialogHeader
│  │  ├─ DialogTitle
│  │  └─ DialogDescription
│  └─ DialogFooter
└─ Close button

Input & Label
├─ Input (text fields)
└─ Label (form labels)
```

## 🔐 Security Flow

```
Token Storage & Usage:

┌─────────────────────────────────────┐
│  Environment Variables (Server)     │
│  VITE_SONARQUBE_TOKEN               │
│  ✓ Never sent to browser            │
│  ✓ Used by server-side proxy        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  LocalStorage (Browser)             │
│  'sonarquest-config'                │
│  ✓ Used by client-side service      │
│  ⚠️  Visible in browser DevTools    │
└─────────────────────────────────────┘

Token Usage:
1. Server-side proxy ──> Uses env var token
2. Client-side API ──> Uses localStorage token
3. Never logged to console
4. Sent via Authorization: Bearer header
```

## 🚀 Performance Optimization

```
1. Route-Based Code Splitting
   ┌─────────────────────────────────┐
   │  Each page is a separate chunk  │
   │  • Dashboard chunk              │
   │  • Leaderboard chunk            │
   │  • Projects chunk               │
   │  • Achievements chunk           │
   │                                 │
   │  Only loads what's needed!      │
   └─────────────────────────────────┘

2. Data Caching (5 minutes)
   ┌─────────────────────────────────┐
   │  First request: API call        │
   │  │                               │
   │  ├─> Cache result                │
   │  │                               │
   │  Next requests (< 5 min):       │
   │  └─> Return from cache ✓        │
   │                                 │
   │  After 5 min: Refresh cache     │
   └─────────────────────────────────┘

3. Build Optimization
   ┌─────────────────────────────────┐
   │  Vite production build          │
   │  • Tree shaking                 │
   │  • Minification                 │
   │  • Asset optimization           │
   │  • Gzip compression             │
   └─────────────────────────────────┘
```

## 🐛 Error Handling Strategy

```
API Request Flow with Error Handling:

User Action
    │
    ▼
Try Client Service
    │
    ├─ Success ──> Return data ✓
    │
    └─ Error (Network, CORS, Cloudflare)
        │
        ▼
Try Server Proxy
    │
    ├─ Success ──> Return data ✓
    │
    └─ Error (Auth, API, Timeout)
        │
        ▼
Use Mock Data (Always succeeds)
    │
    └─> Return mock data ✓

User always sees something working! 🎉
```

## 🔄 Real-time Updates Potential

```
Current: Static data fetching
Future: WebSocket support

┌─────────────────────────────────────┐
│  SonarQube Server                   │
│  (Could emit events)                │
└─────────────┬───────────────────────┘
              │
              ▼ WebSocket
┌─────────────────────────────────────┐
│  Backend Server                     │
│  • Listen to SonarQube events       │
│  • Broadcast to clients             │
└─────────────┬───────────────────────┘
              │
              ▼ WebSocket
┌─────────────────────────────────────┐
│  React App                          │
│  • Receive real-time updates        │
│  • Auto-refresh UI                  │
│  • Show notifications               │
└─────────────────────────────────────┘

Potential Events:
• Quality gate changed
• New issues found
• Coverage improved
• Build completed
```

## 📱 Responsive Design

```
The app adapts to different screen sizes:

Mobile (< 768px)
├─ Single column layout
├─ Stacked cards
├─ Hamburger menu (future)
└─ Touch-friendly buttons

Tablet (768px - 1024px)
├─ Two column grid
├─ Medium cards
└─ Larger touch targets

Desktop (> 1024px)
├─ Three column grid
├─ Full navigation bar
├─ Hover effects
└─ Keyboard shortcuts (future)

Tailwind Breakpoints:
• sm: 640px
• md: 768px
• lg: 1024px
• xl: 1280px
• 2xl: 1536px
```

## 🎯 Key Takeaways

1. **Modular Architecture**: Clean separation of concerns
2. **Resilient Data Flow**: Multiple fallback strategies
3. **User-Friendly**: Always shows something useful
4. **Performance**: Caching and code splitting
5. **Flexible Configuration**: Env vars or UI-based
6. **Type-Safe**: Full TypeScript coverage
7. **Modern Stack**: Latest React & build tools
8. **Extensible**: Easy to add new features

## 📚 Related Documentation

- **[ARCHITECTURE.md](../ARCHITECTURE.md)** - Comprehensive technical details
- **[README.md](../README.md)** - Getting started guide
- **[CLOUDFLARE_BYPASS.md](../CLOUDFLARE_BYPASS.md)** - Cloudflare handling

---

**Questions?** Check the full [ARCHITECTURE.md](../ARCHITECTURE.md) for deeper technical details!
