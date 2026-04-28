# TestNodeModulesV5

A production-ready **Next.js 14** + **TypeScript 5** boilerplate scaffolded with **Clean Architecture**. Every source file lives in a strictly typed layer with enforced dependency rules, so the codebase stays maintainable as it scales.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Getting Started](#getting-started)
3. [Project Structure](#project-structure)
4. [Clean Architecture Layers](#clean-architecture-layers)
5. [REST API](#rest-api)
6. [Testing](#testing)
7. [Linting & Formatting](#linting--formatting)
8. [Adding Features](#adding-features)

---

## Tech Stack

| Concern       | Choice                    |
|---------------|---------------------------|
| Framework     | Next.js 14 (App Router)   |
| Language      | TypeScript 5 (strict)     |
| Testing       | Jest + ts-jest            |
| Linting       | ESLint + `@typescript-eslint` |
| Formatting    | Prettier                  |
| IDs           | UUID v4 (`uuid` package)  |
| Persistence   | In-memory (swap-ready)    |

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9 (or pnpm / yarn)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Copy the environment template
cp .env.local.example .env.local

# 3. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the landing page.

### Available Scripts

| Script                | Description                              |
|-----------------------|------------------------------------------|
| `npm run dev`         | Start Next.js development server         |
| `npm run build`       | Production build                         |
| `npm run start`       | Start production server                  |
| `npm run type-check`  | TypeScript type checking (no emit)       |
| `npm run lint`        | ESLint check                             |
| `npm run lint:fix`    | ESLint auto-fix                          |
| `npm run format`      | Prettier format all files                |
| `npm run format:check`| Prettier check (CI-friendly)             |
| `npm test`            | Run Jest test suite                      |
| `npm run test:watch`  | Jest in watch mode                       |
| `npm run test:coverage` | Jest with coverage report              |

---

## Project Structure

```
TestNodeModulesV5/
├── src/
│   ├── app/                          # Next.js App Router pages & API routes
│   │   ├── api/
│   │   │   └── posts/
│   │   │       ├── route.ts          # GET /api/posts, POST /api/posts
│   │   │       └── [id]/
│   │   │           ├── route.ts      # GET /api/posts/:id, DELETE /api/posts/:id
│   │   │           └── publish/
│   │   │               └── route.ts  # PATCH /api/posts/:id/publish
│   │   ├── posts/
│   │   │   └── page.tsx              # Server-rendered posts list page
│   │   ├── layout.tsx
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css
│   │
│   ├── domain/                       # ★ Enterprise business rules
│   │   ├── entities/
│   │   │   └── Post.ts
│   │   ├── value-objects/
│   │   │   ├── PostId.ts
│   │   │   ├── PostTitle.ts
│   │   │   └── PostContent.ts
│   │   ├── repositories/
│   │   │   └── IPostRepository.ts
│   │   ├── services/
│   │   │   └── PostSlugService.ts
│   │   └── errors/
│   │       └── DomainError.ts
│   │
│   ├── application/                  # ★ Application business rules
│   │   ├── use-cases/
│   │   │   ├── CreatePostUseCase.ts
│   │   │   ├── GetPostUseCase.ts
│   │   │   ├── ListPostsUseCase.ts
│   │   │   ├── PublishPostUseCase.ts
│   │   │   └── DeletePostUseCase.ts
│   │   ├── dtos/
│   │   │   └── PostDTO.ts
│   │   ├── mappers/
│   │   │   └── PostMapper.ts
│   │   └── errors/
│   │       └── ApplicationError.ts
│   │
│   ├── infrastructure/               # ★ Frameworks & Drivers (I/O)
│   │   ├── repositories/
│   │   │   └── InMemoryPostRepository.ts
│   │   ├── id/
│   │   │   └── UuidGenerator.ts
│   │   └── container.ts             # Dependency injection root
│   │
│   └── interfaces/                  # ★ Interface Adapters
│       └── http/
│           ├── controllers/
│           │   └── PostController.ts
│           └── helpers/
│               └── apiResponse.ts
│
├── CLAUDE.md                         # Global architecture contract
├── architecture.json                 # Machine-readable layer rules
├── jest.config.ts
├── next.config.ts
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── package.json
```

---

## Clean Architecture Layers

Clean Architecture organises code into concentric layers where **dependencies only point inward**. Outer layers know about inner layers; inner layers know nothing about outer layers.

```
┌──────────────────────────────────────────┐
│            interfaces/                   │  ← HTTP controllers, Next.js routes, React pages
│  ┌────────────────────────────────────┐  │
│  │         application/               │  │  ← Use cases, DTOs, mappers
│  │  ┌──────────────────────────────┐  │  │
│  │  │         domain/              │  │  │  ← Entities, value objects, domain services
│  │  └──────────────────────────────┘  │  │
│  └────────────────────────────────────┘  │
│            infrastructure/               │  ← DB, HTTP clients, ID generators
└──────────────────────────────────────────┘
```

### `src/domain/` — Enterprise Business Rules

The **innermost** layer. Contains all business logic and invariants.

- **Entities** — objects with identity that protect their own state (`Post`)
- **Value Objects** — immutable, equality-by-value (`PostId`, `PostTitle`, `PostContent`)
- **Domain Services** — pure logic that spans multiple entities (`PostSlugService`)
- **Repository Interfaces** — describe *what* persistence operations exist, not *how*

> ❌ Zero external dependencies. No imports from any other layer. No `process.env`.

### `src/application/` — Application Business Rules

Orchestrates domain objects to fulfil use cases. Knows *what* to do, not *how*.

- **Use Cases** — one class per operation, one `execute(dto)` method (`CreatePostUseCase`, etc.)
- **DTOs** — plain data contracts crossing the layer boundary (`PostDTO`)
- **Mappers** — translate domain entities → DTOs (`PostMapper`)

> ❌ No ORM, no HTTP client, no infrastructure imports.

### `src/infrastructure/` — Frameworks & Drivers

Implements the interfaces defined in domain/application. All I/O lives here.

- **Repository implementations** — `InMemoryPostRepository` (swap for a real DB adapter)
- **ID generators** — `UuidGenerator` wraps the `uuid` library
- **DI container** — `container.ts` wires everything together

> ❌ No business logic. Never imported directly by `interfaces/`.

### `src/interfaces/` — Interface Adapters

Entry points into the application. Translates HTTP input into use-case calls.

- **Controllers** — validate input → call use case → serialize output (`PostController`)
- **API helpers** — `apiResponse.ts` standardises JSON responses and HTTP status codes
- **Next.js App Router routes** — thin wrappers that delegate to the controller

> ❌ No business logic. No direct repository calls. No domain entity manipulation.

---

## REST API

All endpoints return `{ success: true, data: ... }` on success and `{ success: false, error: "..." }` on failure.

| Method   | Path                        | Description                  |
|----------|-----------------------------|------------------------------|
| `GET`    | `/api/posts`                | List all posts               |
| `GET`    | `/api/posts?authorId=x`     | Filter posts by author       |
| `POST`   | `/api/posts`                | Create a new post (draft)    |
| `GET`    | `/api/posts/:id`            | Get a single post            |
| `PATCH`  | `/api/posts/:id/publish`    | Publish a draft post         |
| `DELETE` | `/api/posts/:id`            | Delete a post                |

### Example — Create a Post

```bash
curl -X POST http://localhost:3000/api/posts \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Post",
    "content": "Hello clean architecture world! This is my first post.",
    "authorId": "user-001"
  }'
```

### Example — Publish a Post

```bash
curl -X PATCH http://localhost:3000/api/posts/<id>/publish
```

---

## Testing

Tests are co-located with source code under `__tests__/` directories within each layer.

```bash
npm test                  # run all tests
npm run test:watch        # watch mode
npm run test:coverage     # with coverage report
```

Test coverage targets:

- **Domain** — full unit test coverage of entities, value objects, and services
- **Application** — use-case integration tests using the in-memory repository
- **Infrastructure** — repository implementation tests

---

## Linting & Formatting

```bash
npm run lint          # check for ESLint errors
npm run lint:fix      # auto-fix where possible
npm run format        # Prettier format
npm run format:check  # Prettier check (use in CI)
npm run type-check    # tsc --noEmit
```

ESLint is configured with layer-aware `no-restricted-imports` rules that prevent illegal cross-layer imports at lint time.

---

## Adding Features

Follow this checklist for any new feature:

1. **Domain** — define the entity/value-object/interface in `src/domain/`
2. **Application** — write a new use case class in `src/application/use-cases/`; add its DTO in `src/application/dtos/`
3. **Infrastructure** — implement the repository or service in `src/infrastructure/`; wire it in `container.ts`
4. **Interfaces** — add a route handler in `src/app/api/` and (optionally) a controller method in `src/interfaces/http/controllers/`
5. **Tests** — add unit tests next to each layer

> **Never skip a layer.** If a controller calls a repository directly, the architecture contract is broken.
