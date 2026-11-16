# Feature checklist

What to record when learning a feature, by layer. Skip the sections that don't apply to
the project — the goal is that a future session can answer "where is X / how does Y work /
what happens when Z" without opening the code. Always use repo-relative paths.

## Contents
- Cross-cutting (every feature)
- Front: Vue 3
- Back: BFF / Node (NestJS, Express, Fastify, Hono…)
- Back: Java / Spring
- Monorepo end-to-end
- Reference file template

## Cross-cutting (every feature)

- **Purpose** in 2–3 sentences, in business terms.
- **Entry points**: routes/URLs, menu entries, CLI commands, events consumed.
- **File map**: annotated tree of the feature folder(s), only meaningful files.
- **Business rules**: conditions, statuses and transitions, permissions/roles, feature
  flags, edge cases, magic values — each with the file where it's enforced.
- **Data model**: main types/interfaces and what each field means when not obvious.
- **External calls**: every downstream service/API called, with method + path, the
  client/wrapper used, auth, and what the feature does with the response or errors.
- **Tests**: where they live, what is covered, test helpers/fixtures/mocks specific
  to this feature.
- **Gotchas**: things that surprised you, known bugs, TODOs, in-progress migrations.
- **Open questions**: what you couldn't verify.

## Front: Vue 3

- Router: route names, paths, params, guards, lazy-loaded views, meta.
- Views/pages → component tree (only the components that hold logic).
- Composables: name, inputs, returned refs/functions, side effects.
- Store (Pinia/Vuex): state shape, getters, actions, which components use it.
- API layer: functions/services that call the back, endpoint each one hits,
  request/response types, caching (TanStack Query keys, etc.).
- i18n: namespace/key prefix, locale files, notable pluralisation/formatting.
- Forms & validation (vee-validate, zod, yup…): schemas and where they live.
- Design-system components used and any wrapper components.
- Emitted events / provide-inject contracts between components.

## Back: BFF / Node

- Endpoints table: method, path, handler/controller file, auth/guards, request
  params/body, response shape, status codes.
- Service/handler flow per endpoint: which downstream calls, in which order,
  parallel or sequential, error handling and fallbacks.
- Mapping: downstream payload → BFF DTO, field by field when non-trivial
  (put this in a dedicated `bff-<feature>-mapping.md` when large).
- Config: env vars, feature flags, timeouts, base URLs per environment.
- Caching, retries, pagination conventions.

## Back: Java / Spring

- Controllers and endpoints (as above), DTOs, validation annotations.
- Services, repositories, entities, DB tables and important queries.
- Messaging: Kafka topics produced/consumed, payload schema.
- Scheduled jobs, security config affecting the feature.

## Monorepo end-to-end

Write one **flow table** in SKILL.md that links layers:

| User action | Front call (file) | Endpoint | BFF handler | Downstream |
|---|---|---|---|---|
| Open order detail | `useOrderQuery` (front/src/features/order/api.ts) | `GET /orders/:id` | `handlers/order/get.ts` | OneOM `GET /v2/orders/{id}` |

Plus shared packages/contracts used by both sides.

## Reference file template

```markdown
# <Layer> — <feature> <aspect>

> Scope: what this file covers. Read when: <situation>.

## File map
## <Main sections from the checklist above>
## Gotchas
```

Keep each reference file focused on one layer or concern; add a table of contents if it
grows past ~300 lines, or split it.
