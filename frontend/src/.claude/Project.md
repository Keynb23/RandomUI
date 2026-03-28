Project Overview

Claude: Always read this file first. Then follow the "What to read next" guidance below based on the task.


What This Is
A weather application built for fun. The goal is smooth, clean, responsive UI with a strong aesthetic identity. Functionality is secondary to feel — this app should be a pleasure to look at and interact with.
Stack: React, TypeScript, Vite, TailwindCSS, React Router v6, Zod, Vitest

What to Read Next
Use this table to know which .claude/ files to read for a given task. Read project.md first, then the relevant files below.
Task typeRead these filesStyling, UI, visual changesstyles.md, naming.mdCreating or editing components / JSXnaming.md, comments.md, styles.mdRouting, pages, navigationroutes.mdError handling, error UI, API failureserrors.mdWriting or editing any code (always)comments.md, naming.mdData fetching, schemas, Zod validationerrors.md, comments.mdNew feature (touches multiple areas)Read all files

Project Structure
src/
  components/       ← Reusable UI components
  pages/            ← One folder per route
  features/         ← Domain logic (weather data, location, etc.)
  errors/           ← AppError class and error code definitions
  schemas/          ← Shared Zod schemas
  router/           ← Route definitions
  hooks/            ← Custom React hooks
  utils/            ← Pure utility functions
.claude/
  project.md        ← You are here
  styles.md         ← Visual direction, color tokens, typography
  naming.md         ← JSX className and file naming conventions
  comments.md       ← How and where to write comments
  routes.md         ← Route structure and conventions
  errors.md         ← Error codes, AppError class, ErrorScreen

Principles

UI first. This app should feel polished and intentional at every screen size.
Dark theme only. No light mode. See styles.md.
Consistent conventions. Naming, comments, and errors follow the .claude/ docs — no exceptions.
Trust boundaries. All external data (API responses, localStorage) is validated with Zod.
Errors are never silent. Every failure has a code and a user-facing message. See errors.md.


Current Features

 Current weather by city name
 Current weather by geolocation
 Extended forecast view
 Unit toggle (°F / °C)
 Settings (default city, preferred unit)