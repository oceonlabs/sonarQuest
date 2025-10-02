# SonarQuest Architecture Overview 🏗️

This document provides a comprehensive overview of the SonarQuest application architecture, including component relationships, data flow, and key design patterns.

> 💡 **Looking for a simpler visual guide?** Check out **[ARCHITECTURE_VISUAL.md](./docs/ARCHITECTURE_VISUAL.md)** for an easier-to-follow visual walkthrough with simplified diagrams and explanations.

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SonarQuest Application                             │
│                         (TanStack Start + React)                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              ROUTING LAYER                                   │
│                         (TanStack Router)                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  router.tsx  ──┬──> __root.tsx (Root Layout)                                │
│                │                                                              │
│                ├──> routes/index.tsx         ──> Dashboard Component         │
│                ├──> routes/leaderboard.tsx   ──> Leaderboard Component       │
│                ├──> routes/projects.tsx      ──> Projects Component          │
│                └──> routes/achievements.tsx  ──> Achievements Component      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           PRESENTATION LAYER                                 │
│                          (React Components)                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─────────────────┐     ┌──────────────────────────────────────────────┐  │
│  │  Header.tsx     │────▶│  SonarQubeConnectionModal.tsx                │  │
│  │  (Navigation)   │     │  (Connection Management)                     │  │
│  └─────────────────┘     └──────────────────────────────────────────────┘  │
│           │                             │                                    │
│           │                             │                                    │
│  ┌────────▼──────────────────────────────▼─────────────────────────────┐   │
│  │                     Page Components                                  │   │
│  │                                                                       │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────┐ │   │
│  │  │ Dashboard    │  │ Leaderboard  │  │ Projects     │  │ Achieve │ │   │
│  │  │              │  │              │  │              │  │ -ments  │ │   │
│  │  │ • Stats      │  │ • Individual │  │ • Quality    │  │         │ │   │
│  │  │ • Projects   │  │   Rankings   │  │   Gates      │  │ • Badge │ │   │
│  │  │ • Developers │  │ • Team       │  │ • Coverage   │  │   System│ │   │
│  │  │ • Teams      │  │   Rankings   │  │ • Issues     │  │ • Progr │ │   │
│  │  │              │  │ • Challenges │  │ • Debt       │  │   -ess  │ │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  └─────────┘ │   │
│  └───────────────────────────────────────────────────────────────────────┘  │
│           │                   │                │                │            │
│           └───────────────────┴────────────────┴────────────────┘            │
│                                    │                                          │
│  ┌─────────────────────────────────▼──────────────────────────────────┐     │
│  │                        UI Components Library                        │     │
│  │                      (Reusable Components)                          │     │
│  │                                                                      │     │
│  │  components/ui/                                                      │     │
│  │  ├─ Card.tsx         (Content containers)                           │     │
│  │  ├─ Button.tsx       (Action buttons with variants)                 │     │
│  │  ├─ Badge.tsx        (Status indicators)                            │     │
│  │  ├─ Progress.tsx     (Progress bars)                                │     │
│  │  ├─ Dialog.tsx       (Modal dialogs)                                │     │
│  │  ├─ Input.tsx        (Form inputs)                                  │     │
│  │  └─ Label.tsx        (Form labels)                                  │     │
│  │                                                                      │     │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                           BUSINESS LOGIC LAYER                               │
│                          (Services & Utilities)                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                        DataService (Singleton)                       │   │
│  │                  Central Data Management & Caching                   │   │
│  │                                                                       │   │
│  │  • getProjects()         • getDevelopers()                           │   │
│  │  • getProjectDetails()   • getTeams()                                │   │
│  │  • getProjectActivity()  • getAchievements()                         │   │
│  │  • getProjectIssues()    • Cache Management (5 min TTL)              │   │
│  │                                                                       │   │
│  └─────────┬────────────────────────────────────────────────────────────┘   │
│            │                                                                  │
│            │                                                                  │
│  ┌─────────▼──────────────────┬───────────────────────────────────────┐     │
│  │                            │                                        │     │
│  │  ┌──────────────────────┐  │  ┌──────────────────────────────────┐ │     │
│  │  │ ConfigService        │  │  │ SonarQube Service Layer          │ │     │
│  │  │ (Singleton)          │  │  │                                  │ │     │
│  │  │                      │  │  │ ┌──────────────────────────────┐ │ │     │
│  │  │ • Configuration      │  │  │ │ sonarqubeClientService       │ │ │     │
│  │  │   Management         │  │  │ │ (Browser/Client-side)        │ │ │     │
│  │  │ • Environment Vars   │◀─┼──│ │ • Cloudflare bypass          │ │ │     │
│  │  │ • LocalStorage       │  │  │ │ • Direct API calls           │ │ │     │
│  │  │ • Subscription       │  │  │ └──────────────────────────────┘ │ │     │
│  │  │   Pattern            │  │  │                                  │ │     │
│  │  └──────────────────────┘  │  │ ┌──────────────────────────────┐ │ │     │
│  │                            │  │ │ sonarqubeService             │ │ │     │
│  │                            │  │ │ (Server-side Proxy)          │ │ │     │
│  │  ┌──────────────────────┐  │  │ │ • Server function calls      │ │ │     │
│  │  │ mockData.ts          │  │  │ │ • CORS bypass                │ │ │     │
│  │  │                      │  │  │ └──────────────────────────────┘ │ │     │
│  │  │ • Sample Data        │  │  │                                  │ │     │
│  │  │ • Type Definitions   │  │  │ ┌──────────────────────────────┐ │ │     │
│  │  │ • Mock Projects      │  │  │ │ sonarqubeProxy.ts            │ │ │     │
│  │  │ • Mock Developers    │  │  │ │ (Server Function)            │ │ │     │
│  │  │ • Mock Teams         │  │  │ │ • TanStack Start proxy       │ │ │     │
│  │  │ • Mock Achievements  │  │  │ │ • Backend API calls          │ │ │     │
│  │  └──────────────────────┘  │  │ └──────────────────────────────┘ │ │     │
│  │                            │  └──────────────────────────────────┘ │     │
│  │                            │                                        │     │
│  │  ┌──────────────────────┐  │  ┌──────────────────────────────────┐ │     │
│  │  │ Cloudflare Handlers  │  │  │ Proxy Services                   │ │     │
│  │  │                      │  │  │                                  │ │     │
│  │  │ • cloudflareDetector │  │  │ • proxyService.ts                │ │     │
│  │  │ • cloudflareBypass   │  │  │   (HTTP/SOCKS5/Tunnel support)   │ │     │
│  │  │ • CloudflareHelper   │  │  │                                  │ │     │
│  │  │ • CloudflareStatus   │  │  │                                  │ │     │
│  │  └──────────────────────┘  │  └──────────────────────────────────┘ │     │
│  │                            │                                        │     │
│  └────────────────────────────┴────────────────────────────────────────┘     │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                          Custom Hooks                                │   │
│  │                                                                       │   │
│  │  lib/hooks/                                                          │   │
│  │  └─ useSonarQubeConnection.ts  (Connection state management)         │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                          Utilities                                   │   │
│  │                                                                       │   │
│  │  lib/utils.ts                                                        │   │
│  │  • cn() - className utility (clsx + tailwind-merge)                  │   │
│  │  • Helper functions                                                  │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATA SOURCES                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌────────────────────────────────┐        ┌──────────────────────────────┐ │
│  │   SonarQube API (Real)         │        │   Mock Data (Fallback)       │ │
│  │                                 │        │                              │ │
│  │  • /api/projects/search         │        │  • mockProjects              │ │
│  │  • /api/measures/component      │        │  • mockDevelopers            │ │
│  │  • /api/project_analyses/search │        │  • mockTeams                 │ │
│  │  • /api/issues/search           │        │  • mockAchievements          │ │
│  │                                 │        │                              │ │
│  │  Authentication:                │        │  Used when:                  │ │
│  │  • Bearer Token                 │        │  • Not connected             │ │
│  │  • Organization support         │        │  • API errors                │ │
│  │                                 │        │  • Development mode          │ │
│  └────────────────────────────────┘        └──────────────────────────────┘ │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                       STYLING & BUILD SYSTEM                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Tailwind CSS v4                                                     │   │
│  │  • Utility-first CSS framework                                       │   │
│  │  • Custom theme configuration                                        │   │
│  │  • Responsive design utilities                                       │   │
│  │  • @tailwindcss/vite plugin                                          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Vite Build Tool                                                     │   │
│  │  • Fast HMR (Hot Module Replacement)                                 │   │
│  │  • TypeScript support                                                │   │
│  │  • Production builds                                                 │   │
│  │  • Dev server (port 3000)                                            │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  Component Styling Pattern                                           │   │
│  │  • class-variance-authority (cva) for variant management             │   │
│  │  • Radix UI primitives for accessible components                     │   │
│  │  • Custom design system with consistent styling                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
┌──────────────┐
│   User       │
│   Action     │
└──────┬───────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          React Component                                     │
│  (Dashboard, Projects, Leaderboard, Achievements)                            │
└──────┬───────────────────────────────────────────────────────────────────────┘
       │
       │ Calls data service methods
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DataService                                         │
│  • Checks cache (5-minute TTL)                                               │
│  • Returns cached data if available                                          │
└──────┬───────────────────────────────────────────────────────────────────────┘
       │
       │ Cache miss or expired
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ConfigService                                           │
│  • Check if SonarQube is connected                                           │
│  • Get connection configuration                                              │
└──────┬───────────────────────────────────────────────────────────────────────┘
       │
       ├───────────────────┬──────────────────────────────────────────┐
       │                   │                                           │
       ▼                   ▼                                           ▼
┌──────────────┐    ┌────────────────────┐              ┌─────────────────────┐
│ Connected?   │    │ Use Real Service   │              │  Use Mock Data      │
│ (Yes)        │    │                    │              │  (Fallback)         │
└──────┬───────┘    └────────┬───────────┘              └─────────────────────┘
       │                     │                                    ▲
       │                     │                                    │
       ▼                     ▼                                    │
┌──────────────────────────────────────────┐                     │
│  SonarQube Service Layer                 │                     │
│                                           │                     │
│  ┌────────────────────────────────────┐  │                     │
│  │ sonarqubeClientService             │  │                     │
│  │ • Try direct browser API calls     │──┼─ Error ─────────────┤
│  │ • Cloudflare bypass strategies     │  │                     │
│  └────────────────────────────────────┘  │                     │
│                                           │                     │
│  ┌────────────────────────────────────┐  │                     │
│  │ sonarqubeService                   │  │                     │
│  │ • Server-side proxy via TanStack  │──┼─ Error ─────────────┤
│  │ • CORS-free API calls              │  │                     │
│  └────────────────────────────────────┘  │                     │
└──────┬────────────────────────────────────┘                     │
       │                                                           │
       │ Success                                                   │
       │                                                           │
       ▼                                                           │
┌─────────────────────────────────────────────────────────────────┼───────────┐
│                      SonarQube API / Mock Data                  │           │
│  • Project metrics                                              │           │
│  • Quality gates                                                            │
│  • Code coverage                                                            │
│  • Issues (bugs, vulnerabilities, code smells)                              │
│  • Technical debt                                                           │
└──────┬──────────────────────────────────────────────────────────────────────┘
       │
       │ Transform & enrich data
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DataService                                             │
│  • Cache the results                                                         │
│  • Transform to internal format                                              │
│  • Return to component                                                       │
└──────┬───────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          React Component                                     │
│  • Update state                                                              │
│  • Re-render UI                                                              │
│  • Display data to user                                                      │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Configuration Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Application Startup                                     │
└──────┬───────────────────────────────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ConfigService Initialization                            │
└──────┬───────────────────────────────────────────────────────────────────────┘
       │
       ├───────────────────────────────┬──────────────────────────────────┐
       │                               │                                   │
       ▼                               ▼                                   ▼
┌──────────────────┐     ┌────────────────────────┐      ┌────────────────────┐
│ Environment Vars │     │ LocalStorage Check     │      │ Default Config     │
│ Present?         │     │ (User Preferences)     │      │ (Disconnected)     │
│                  │     │                        │      │                    │
│ VITE_SONARQUBE   │     │ Load saved config     │      │ No connection      │
│ _URL & TOKEN     │     │ if env not set         │      │ Use mock data      │
└──────┬───────────┘     └────────┬───────────────┘      └────────┬───────────┘
       │                          │                                │
       │ Priority: 1              │ Priority: 2                    │ Priority: 3
       │ (Highest)                │                                │
       └───────────┬──────────────┴────────────────────────────────┘
                   │
                   ▼
       ┌─────────────────────────────────────────┐
       │  Configuration Loaded                   │
       │  • isConfiguredViaEnv flag set          │
       │  • Read-only if from env vars           │
       └─────────────────┬───────────────────────┘
                         │
                         ▼
       ┌─────────────────────────────────────────┐
       │  Notify Subscribers                     │
       │  • DataService                          │
       │  • UI Components                        │
       └─────────────────────────────────────────┘
```

## Component Hierarchy

```
__root.tsx (Root Layout)
│
├─ Header.tsx
│  ├─ Navigation Links (Dashboard, Leaderboard, Projects, Achievements)
│  └─ SonarQubeConnectionModal
│     ├─ Dialog (UI Component)
│     ├─ CloudflareStatus
│     ├─ CloudflareHelper
│     └─ Form Components (Input, Label, Button)
│
└─ Router Outlet
   │
   ├─ routes/index.tsx → Dashboard.tsx
   │  ├─ Card (Stats Overview)
   │  │  ├─ Total Projects
   │  │  ├─ Active Developers
   │  │  └─ Open Issues
   │  │
   │  ├─ Card (Recent Projects)
   │  │  ├─ Badge (Quality Gate Status)
   │  │  ├─ Progress (Coverage)
   │  │  └─ Rating Badges
   │  │
   │  ├─ Card (Top Developers)
   │  │  └─ Developer List with Scores
   │  │
   │  └─ Card (Team Leaderboard)
   │     └─ Team List with Rankings
   │
   ├─ routes/leaderboard.tsx → Leaderboard.tsx
   │  ├─ Card (Individual Rankings)
   │  │  └─ Developer Cards with Metrics
   │  │
   │  ├─ Card (Team Rankings)
   │  │  └─ Team Cards with Scores
   │  │
   │  └─ Card (Monthly Challenges)
   │     └─ Challenge Progress Bars
   │
   ├─ routes/projects.tsx → Projects.tsx
   │  ├─ Card (Summary Stats)
   │  │  ├─ Total Projects
   │  │  ├─ Quality Gates
   │  │  └─ Average Coverage
   │  │
   │  └─ Project Cards (Grid)
   │     ├─ Quality Gate Badge
   │     ├─ Coverage Progress
   │     ├─ Issue Breakdown
   │     ├─ Technical Debt
   │     └─ Action Buttons
   │
   └─ routes/achievements.tsx → Achievements.tsx
      ├─ Card (Achievement Categories)
      │  ├─ Reliability Badges
      │  ├─ Security Badges
      │  ├─ Coverage Badges
      │  └─ Maintainability Badges
      │
      ├─ Card (Progress Tracking)
      │  └─ Upcoming Achievements
      │
      └─ Card (Recent Activity)
         └─ Achievement Timeline
```

## Key Design Patterns

### 1. Singleton Pattern
- **ConfigService**: Manages global configuration state
- **DataService**: Centralized data fetching and caching

### 2. Observer Pattern
- **ConfigService**: Subscription system for configuration changes
- Components subscribe to config updates and re-render accordingly

### 3. Strategy Pattern
- **SonarQube Service Layer**: Multiple strategies for API access
  - Direct browser calls (sonarqubeClientService)
  - Server-side proxy (sonarqubeService)
  - Mock data fallback

### 4. Facade Pattern
- **DataService**: Provides simplified interface to complex SonarQube API
- Hides implementation details of caching, service selection, and error handling

### 5. Proxy Pattern
- **sonarqubeProxy**: Server-side proxy to bypass CORS restrictions
- **proxyService**: Configurable proxy support (HTTP/SOCKS5/Cloudflare Tunnel)

### 6. Factory Pattern
- **createSonarQubeService**: Creates service instances with configuration
- **createSonarQubeClientService**: Creates client-side service instances

## Technology Stack

### Core Framework
- **TanStack Start**: Full-stack React framework
- **React 19**: UI library with latest features
- **TypeScript**: Type-safe development

### Routing
- **TanStack Router**: File-based routing with type safety
- **Code splitting**: Automatic route-based splitting

### Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **class-variance-authority**: Type-safe variant styling
- **clsx + tailwind-merge**: Conditional className utilities

### UI Components
- **Radix UI**: Accessible component primitives
  - Dialog, Label, Progress, Separator, Slot
- **Custom components**: Built on Radix with Tailwind styling

### Build & Development
- **Vite**: Fast build tool with HMR
- **Vitest**: Unit testing framework
- **TypeScript compiler**: Type checking

### State Management
- **React State**: Component-level state
- **Service Singletons**: Global state via services
- **Observer Pattern**: Custom subscription system

## API Integration Strategies

### 1. Environment Configuration (Recommended)
```
VITE_SONARQUBE_URL=https://sonarqube.example.com
VITE_SONARQUBE_TOKEN=your_token
VITE_USE_REAL_SONARQUBE=true
```
- Auto-connects on startup
- Read-only configuration
- Consistent across deployments

### 2. Manual Configuration
- UI-based connection dialog
- Saved to browser localStorage
- User can connect/disconnect at will

### 3. Cloudflare Protection Handling
- **Detection**: Automatic identification of protection level
- **Bypass Strategies**:
  - Enhanced browser headers
  - User-agent rotation
  - Request timing and delays
  - Exponential backoff retry logic

### 4. Fallback System
```
Try sonarqubeClientService (direct)
  ↓ (on failure)
Try sonarqubeService (server proxy)
  ↓ (on failure)
Use mockData (fallback)
```

## Caching Strategy

### DataService Cache
- **TTL**: 5 minutes (300,000ms)
- **Storage**: In-memory Map
- **Invalidation**: Time-based automatic expiry
- **Key Structure**: Method-based keys (e.g., "projects", "developers")

### Benefits
- Reduced API calls
- Faster page loads
- Better user experience
- Protection against rate limiting

## Security Considerations

### Token Management
- Tokens stored in environment variables (server-side)
- Tokens stored in localStorage (browser-side)
- Never exposed in client code logs
- Transmitted via Authorization header

### CORS Handling
- Server-side proxy for cross-origin requests
- TanStack Start server functions
- No client-side CORS bypass attempts

### Environment Isolation
- Development uses mock data by default
- Production requires explicit configuration
- Clear separation of concerns

## Performance Optimizations

### 1. Code Splitting
- Route-based automatic splitting
- Lazy loading of page components
- Smaller initial bundle size

### 2. Caching
- 5-minute cache for API responses
- Reduces redundant network calls
- Improves perceived performance

### 3. Memoization
- React component optimization
- Prevents unnecessary re-renders

### 4. Build Optimization
- Vite production builds
- Tree shaking
- Minification
- Asset optimization

## Deployment Options

### 1. Standard Node.js
```bash
npm run build
npm start
```

### 2. Docker
```bash
docker build -t sonarquest .
docker run -p 3000:3000 sonarquest
```

### 3. Docker Compose
```bash
docker-compose up -d
```

### 4. Vercel/Netlify
- Automatic deployments
- Environment variable configuration
- Edge network distribution

## Future Enhancement Opportunities

### Potential Improvements
1. **Real-time Updates**: WebSocket integration for live metrics
2. **Persistent Storage**: Database for historical data tracking
3. **Authentication**: Multi-user support with role-based access
4. **Notifications**: Alert system for quality gate failures
5. **Custom Dashboards**: User-configurable widgets
6. **Export Features**: PDF reports, CSV exports
7. **Integration**: Slack, Teams, Discord notifications
8. **Analytics**: Usage tracking and insights
9. **Mobile App**: Native mobile application
10. **Plugin System**: Extensible architecture for custom features

### Scalability Considerations
- **API Rate Limiting**: Implement request throttling
- **Database Layer**: Add persistent storage for scalability
- **Microservices**: Split services for independent scaling
- **CDN**: Static asset delivery via CDN
- **Load Balancing**: Multiple instance support

## Development Workflow

### Getting Started
```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm run dev

# Run tests
npm run test

# Build for production
npm run build
```

### File Organization Best Practices
- Components in `/src/components`
- Services in `/src/lib`
- Routes in `/src/routes`
- UI components in `/src/components/ui`
- Types co-located with implementation

### Adding New Features
1. Define types in appropriate service file
2. Add service methods to DataService
3. Create/update components
4. Add routes if needed
5. Update documentation

## Conclusion

SonarQuest follows modern React architecture patterns with clear separation of concerns:
- **Presentation**: React components and UI library
- **Business Logic**: Services and data management
- **Data**: SonarQube API integration with fallback
- **Infrastructure**: Build tools and deployment

The architecture is designed to be:
- **Maintainable**: Clear structure and separation
- **Extensible**: Easy to add new features
- **Performant**: Caching and optimization
- **Resilient**: Fallback mechanisms and error handling
- **Secure**: Token management and CORS handling

This modular approach enables the application to grow and adapt to changing requirements while maintaining code quality and developer experience.
