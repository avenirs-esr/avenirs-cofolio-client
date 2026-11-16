# Export flow and API contracts

Paths below start at `apps/avenirs-cofolio-client/src/features/student/kit/`; generated hooks/DTOs live in `packages/shared/src/api/avenir-esr/generated/`, exported by `@avenirs-esr/shared/api/avenir-esr`. Never edit generated output directly.

## Modal and form

`views/StudentToolsKitView/components/interaction/ExportKitButton/ExportKitButton.vue` uses `useModal` to open `components/overlay/ExportKitModal/ExportKitModal.vue`; its `close` event closes it. The modal uses `ConfirmationModal`, `AvCheckboxesGroup` (two options) and shared `Input`.

`views/StudentToolsKitView/composables/use-export-kit-form/use-export-kit-form.ts` is a TanStack form:

| Field | Default | Validation / UI |
|---|---|---|
| `exportOptions: ExportKitOptions[]` | `[]` | `validateRequired`, at least one of `TEXT_CONTENT = 'textContent'` or `MEDIA_CONTENT = 'mediaContent'` |
| `kitName: string` | `''` | `validateRequired` then `validateMaxLength(..., KIT_NAME_MAX_LENGTH = 80)`; Input also has `maxlength=80` |

Valid only if dirty, valid, not validating, no name-field errors, and at least one option. Modal also disables confirm unless `canExportKit(values)` (`rules/export-kit.rules.ts`: name has non-whitespace content and an option is selected). Change and submit validators use `useFormValidators`; closing resets defaults and temporary `kitName`. No autosave.

Submission (`ExportKitModal.exportKit`) records name, awaits DOCX first if selected, then awaits ZIP if selected. DOCX success shows a toast; ZIP `useDownloadMedia` success downloads `${kitName}.zip` and toasts, error shows API error and **keeps the modal open**; otherwise it closes and resets. `isLoading` passed to the confirmation modal is currently the DOCX generator's `isLoading`, not the media mutation's pending state. A DOCX generation error is not caught in this component.

## Export and queries

| Hook | Endpoint / parameters | Response | Used by |
|---|---|---|---|
| `useGetSkillProgresses` | `GET /me/skill-progress?isValorized=true&pageSize=100` | `PagedResponseSkillProgressDTO` | card + DOCX skills; DOCX also calls `useGetAdditionalSkillConfig` for level labels |
| `useGetDeclaredExperienceView` | `GET /me/declared/experiences/view?isValorized=true&pageSize=100` | `PagedResponseDeclaredExperienceViewDTO` | card + DOCX experiences |
| `useGetDeclaredActivitiesView` | `GET /me/activity-progress?isValorized=true&pageSize=100` | `PagedResponseDeclaredActivityViewDTO` | card + DOCX activities |
| `useGetDeclaredPrograms` | `GET /me/declared/programs?isValorized=true&pageSize=100` | `PagedResponseDeclaredProgramViewDTO` | card + DOCX programs |
| `useGetSelfKnowledgeElements` | `GET /me/self-knowledge/elements?isValorized=true&pageSize=100`, cards also filter `selfKnowledgeCategories` | `PagedResponseSelfKnowledgeElementViewDTO` | card + DOCX self-knowledge |
| `useTracesView` | `POST /me/traces/view?pageSize=100`, `TraceFilter` `{ isAssociated: boolean, isValorized: true }` | `PagedResponseTraceViewDTO` | multimedia cards only |
| `useDownloadMedia` | `GET /me/kit/download-media` | `Blob` | ZIP export; no client-side trace bundling |

All list hooks are generated queries with query keys including their parameters, so duplicated card/section calls with the same params can share TanStack cache. There are no Kit-owned mutations, invalidations, or polling; ZIP download uses an Orval mutation wrapper despite being HTTP GET.

`composables/use-export-kit/use-export-kit.ts` instantiates section generators and creates a `docx.Document` with 1 cm page margins and sections in this order: profile, skills, experiences, activities, programs, self-knowledge. `Packer.toBlob` + `common/utils/download/download.ts` triggers the download (filename passed as kit name). No trace/media content is embedded in the DOCX.

Section generators in `composables/use-export-kit/sectionsGenerators/`:

- `use-generate-profile-section.ts`: `useCurrentUser()` profile name/email/bio, cover and avatar if available. `utils/use-image-run-data.query.ts` fetches/converts picture data only when the URL is present.
- `use-generate-skills-section.ts`: title, referential and configured skill-level label from `useGetAdditionalSkillConfig()`.
- `use-generate-experiences-sections.ts`: professional vs other groups, title, organization, localized dates, optional description/type.
- `use-generate-activities-section.ts`: activity title and thematic.
- `use-generate-programs-section.ts`: title, organization, optional dates/result.
- `use-generate-self-knowledge-sections.ts`: interests, then other-category group (strengths, values, aspirations, motivation, improvement, inspirations, obligations, testimonials).

Empty sections are omitted. The aggregate `useExportKit.isLoading` tracks the profile and valorized list queries, not the profile image conversion queries or skill config. Media export relies on backend ZIP contents rather than these document generators.
