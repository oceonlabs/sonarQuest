# SonarQuest Documentation

Welcome to the SonarQuest documentation directory! This folder contains comprehensive guides and references for understanding, using, and extending SonarQuest.

## 📚 Available Documentation

### Architecture Documentation

#### [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md) 🎨
**Start here if you're new!** A simplified, visual guide to the SonarQuest architecture with:
- 🏗️ High-level architecture diagrams
- 🔄 Data flow journey explanations
- 🎨 Component structure visualizations
- 📦 File organization maps
- 🔌 Connection strategy diagrams
- 🚀 Performance optimization insights

**Perfect for**: Developers new to the project, visual learners, quick reference

#### [../ARCHITECTURE.md](../ARCHITECTURE.md) 📖
Comprehensive technical architecture documentation with:
- Detailed system architecture diagrams
- Complete data flow documentation
- Component hierarchy and relationships
- Design patterns and their implementations
- Technology stack deep-dive
- API integration strategies
- Security considerations
- Performance optimizations
- Deployment options
- Future enhancement opportunities

**Perfect for**: Deep technical understanding, system design reference, architecture reviews

## 🎯 Quick Start Guide

### New to SonarQuest?

1. **Read**: [../README.md](../README.md) - Getting started, installation, and basic usage
2. **Explore**: [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md) - Understand the architecture visually
3. **Dive deeper**: [../ARCHITECTURE.md](../ARCHITECTURE.md) - Technical details and patterns

### Looking for specific information?

| What you need | Where to find it |
|---------------|------------------|
| Getting started | [../README.md](../README.md) |
| Visual overview | [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md) |
| Technical details | [../ARCHITECTURE.md](../ARCHITECTURE.md) |
| SonarQube setup | [../README.md](../README.md#sonarqube-integration-) |
| Cloudflare issues | [../CLOUDFLARE_BYPASS.md](../CLOUDFLARE_BYPASS.md) |
| Contributing | [../README.md](../README.md#development-) |

## 📊 Documentation Structure

```
sonarQuest/
│
├── README.md                    ← Start here: Getting started guide
├── ARCHITECTURE.md              ← Technical architecture documentation
├── CLOUDFLARE_BYPASS.md         ← Cloudflare handling guide
├── CODE_OF_CONDUCT.md           ← Community guidelines
│
└── docs/                        ← Additional documentation
    ├── README.md                ← This file
    └── ARCHITECTURE_VISUAL.md   ← Visual architecture guide
```

## 🔍 Architecture Overview at a Glance

### High-Level Structure

```
┌─────────────────────────────────────────────┐
│              User Browser                    │
│                                              │
│  React App (TanStack Start)                 │
│  ├── Pages (Dashboard, Projects, etc.)      │
│  ├── Components (UI elements)               │
│  └── Services (Data, Config, API)           │
│                                              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         TanStack Start Server                │
│         (Proxy for API calls)                │
└──────────────┬───────────────────────────────┘
               │
               ▼
┌──────────────────────────────────────────────┐
│         SonarQube Server                     │
│         (External API)                       │
└──────────────────────────────────────────────┘
```

### Key Components

- **Routing**: TanStack Router with file-based routing
- **UI**: React components with Tailwind CSS
- **Data**: DataService with 5-minute caching
- **Configuration**: ConfigService with env var support
- **API**: Multiple strategies (client, server proxy, mock)

### Data Flow

```
User Action
    → Component
        → DataService (checks cache)
            → SonarQube API (via client or proxy)
                → Cache & Display
```

## 🛠️ Technology Stack

- **Framework**: TanStack Start (React-based)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom (Radix UI based)
- **Build**: Vite
- **Testing**: Vitest

## 🎓 Learning Path

### For New Developers

1. **Week 1**: Set up the project and explore the UI
   - Follow [../README.md](../README.md) setup instructions
   - Run `npm run dev` and explore each page
   - Review [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md)

2. **Week 2**: Understand the architecture
   - Read [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md) in detail
   - Explore the `src/` directory structure
   - Review key files: `dataService.ts`, `configService.ts`

3. **Week 3**: Deep dive into implementation
   - Read [../ARCHITECTURE.md](../ARCHITECTURE.md)
   - Study design patterns used
   - Review component implementations

4. **Week 4**: Make your first contribution
   - Pick a small feature or bug
   - Follow contributing guidelines
   - Submit a pull request

### For Architects/Reviewers

1. **Architecture Review**:
   - [../ARCHITECTURE.md](../ARCHITECTURE.md) - Complete system design
   - Design patterns: Singleton, Observer, Strategy, Facade
   - Separation of concerns and modularity

2. **Security Review**:
   - Token management (env vars vs localStorage)
   - CORS handling via server proxy
   - Cloudflare bypass strategies

3. **Performance Review**:
   - Caching strategy (5-minute TTL)
   - Code splitting (route-based)
   - Build optimization (Vite)

## 🔗 External Resources

- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Documentation](https://tanstack.com/router)
- [SonarQube API Documentation](https://docs.sonarqube.org/latest/extend/web-api/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React 19 Documentation](https://react.dev/)

## 💡 Tips for Understanding the Codebase

1. **Start with the routes**: Look at `src/routes/` to understand pages
2. **Follow the data**: Trace how data flows from DataService to components
3. **Check the types**: TypeScript types are defined near their usage
4. **Use the diagrams**: Visual diagrams make complex relationships clear
5. **Run it locally**: Nothing beats hands-on exploration

## 🤝 Contributing to Documentation

Found something unclear? Want to improve the documentation?

1. Update the relevant documentation file
2. Ensure diagrams and code examples are accurate
3. Test that all internal links work
4. Submit a pull request

## 📮 Questions?

- **Technical questions**: Open an issue on GitHub
- **Architecture questions**: Refer to [../ARCHITECTURE.md](../ARCHITECTURE.md)
- **Getting started**: Check [../README.md](../README.md)
- **Visual explanations**: See [ARCHITECTURE_VISUAL.md](./ARCHITECTURE_VISUAL.md)

---

**Happy coding!** 🚀 Making code quality fun, one commit at a time!