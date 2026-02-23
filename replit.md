# Five Nights at Pablo's

## Overview

This is a browser-based horror game inspired by "Five Nights at Freddy's," built as a full-stack web application. The game is called "Five Nights at Pablo's" and features a security camera monitoring system where players must survive nights by managing power, doors, lights, and cameras while avoiding animatronic-style enemies (represented by photos of friends). The game runs entirely client-side with a CRT/retro horror aesthetic, using interval-based game loops and custom audio management. The backend currently serves as a minimal Express server with a PostgreSQL database, though the game logic itself is client-side only.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript, bundled via Vite
- **Routing**: Wouter (lightweight client-side router) with routes for MainMenu (`/`), GameRoom (`/game`), ResultScreen (`/result`), and a 404 page
- **UI Components**: shadcn/ui component library (new-york style) built on Radix UI primitives with Tailwind CSS
- **State Management**: Custom React hook (`use-game-engine.ts`) manages all game state using `useState`/`useEffect` with interval-based game loops. No global state library — game state is local to the GameRoom page
- **Data Fetching**: TanStack React Query is set up but minimally used since the game is primarily client-side
- **Styling**: Tailwind CSS with CSS variables for theming. Custom dark horror theme with CRT monitor effects (scanlines, vignette, static noise), monospace fonts (VT323, Share Tech Mono), and green/red glow effects
- **Game State Persistence**: `sessionStorage` for current game session (night number, results) and `localStorage` for progression (unlocked nights)

### Game Architecture
- **Game Loop**: Interval-based state updates in `use-game-engine.ts` hook managing time progression, power consumption, enemy AI movement, door/light/camera toggling
- **Enemy AI**: Four enemies with aggression levels that increase per night, moving through camera locations toward the player's office doors
- **Audio System**: Dedicated `AudioPlayer` component managing multiple audio tracks (phone calls, ambience, door sounds, jumpscares) using HTML5 Audio API
- **Key Components**:
  - `OfficeRoom` — Main office view with door/light controls
  - `MonitorUI` — Camera surveillance overlay
  - `GameHud` — Power and time display
  - `Jumpscare` — Full-screen jumpscare animation
  - `CRTContainer` — Visual wrapper adding CRT monitor effects

### Backend Architecture
- **Runtime**: Node.js with Express 5 (TypeScript via tsx)
- **Server**: HTTP server created with `http.createServer`, supports both development (Vite dev server middleware) and production (static file serving)
- **API**: Minimal — `registerRoutes` function is essentially empty. The server currently just serves the frontend
- **Build**: Custom build script using esbuild for server bundling and Vite for client bundling. Server outputs to `dist/index.cjs`, client to `dist/public/`

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM with `node-postgres` driver
- **Schema**: Single `users` table (id, username, password) defined in `shared/schema.ts` — this appears to be boilerplate and is not actively used by the game
- **Migrations**: Drizzle Kit with `db:push` command for schema sync
- **Storage Layer**: `DatabaseStorage` class in `server/storage.ts` implementing an `IStorage` interface with basic CRUD for users
- **Validation**: Zod schemas generated from Drizzle schema via `drizzle-zod`

### Path Aliases
- `@/*` → `client/src/*`
- `@shared/*` → `shared/*`
- `@assets` → `attached_assets/` (for game images and audio files)

## External Dependencies

### Database
- **PostgreSQL** — Required, connected via `DATABASE_URL` environment variable. Uses `pg` (node-postgres) pool and Drizzle ORM

### Key NPM Packages
- **Vite** — Dev server and frontend bundler with React plugin
- **Drizzle ORM + Drizzle Kit** — Database ORM and migration tooling for PostgreSQL
- **Express 5** — HTTP server framework
- **shadcn/ui + Radix UI** — Comprehensive UI component library
- **TanStack React Query** — Server state management (set up but lightly used)
- **Wouter** — Client-side routing
- **Tailwind CSS** — Utility-first CSS framework
- **Zod** — Schema validation
- **connect-pg-simple** — PostgreSQL session store (available but not actively used)

### Replit-specific Plugins
- `@replit/vite-plugin-runtime-error-modal` — Runtime error overlay
- `@replit/vite-plugin-cartographer` — Dev tooling (dev only)
- `@replit/vite-plugin-dev-banner` — Dev banner (dev only)

### Assets
- Game images (JPEG photos of friends used as enemy sprites) stored in `attached_assets/`
- Audio files (MP3 — phone calls, ambience, door sounds, jumpscares) stored in `client/src/assets/`
- Google Fonts: VT323, Share Tech Mono, DM Sans, Fira Code, Geist Mono, Architects Daughter