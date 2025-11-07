# AGENTS.md - Fares Project Portfolio Website

## Build, Lint, and Test Commands
- **Dev server**: `npm run dev` (runs on 0.0.0.0 with turbopack)
- **Build**: `npm run build` (Next.js production build)
- **Type check**: `bunx tsc --noEmit` (run this before committing)
- **Lint**: `npm run lint` (runs TypeScript check + Next.js lint)
- **Format**: `bunx biome format --write` (formats with Biome)
- **No test framework configured** (no test scripts present)

## Architecture & Structure
- **Framework**: Next.js 15 (App Router) with React 18, TypeScript, and Tailwind CSS
- **Package manager**: Uses Bun/npm (has both bun.lock and package-lock.json)
- **Project structure**: `/src/app/` (Next.js App Router pages), `/src/lib/` (utilities)
- **Styling**: Tailwind CSS + shadcn/ui components (style: "new-york", uses CSS variables)
- **Path aliases**: `@/*` maps to `./src/*` (configured in tsconfig.json and components.json)
- **Special dependencies**: GSAP, Locomotive Scroll, same-runtime (loaded via unpkg CDN)

## Code Style Guidelines
- **Formatting**: Biome formatter with 2-space indents, double quotes for JS/TS
- **TypeScript**: Strict mode enabled, use proper types (no `any` unless necessary)
- **Imports**: Use `@/` path alias for imports (e.g., `import { cn } from "@/lib/utils"`)
- **Client components**: Mark with `'use client'` directive when using hooks/browser APIs
- **CSS**: Use Tailwind utility classes; use `cn()` helper from `@/lib/utils` for conditional classes
- **Naming**: camelCase for variables/functions, PascalCase for components
