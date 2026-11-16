# Moving component translations

Both apps' `src/plugins/vue-i18n/vue-i18n.ts` merge `AvSharedMessages` first, then app-global `src/locales/*.json`, then app-feature `src/features/**/locales/*.json`. The shared messages originate from `packages/shared/src/i18n/locales/en.json` and `fr.json` via `packages/shared/src/i18n/index.ts`. Consequently, **leaving an identical key in an app may shadow the shared value**. Search both apps before and after moving.

In shared, existing component keys follow the namespace `global.components.<category>[.<subcategory>].<ComponentName>.<label>`; the portion after `global.components` mirrors the path after `packages/shared/src/ui/components/`. For example, `src/ui/components/interactions/inputs/Input/Input.vue` reads `global.components.interactions.inputs.Input.limit`, and `src/ui/components/cards/Card/Card.vue` reads `global.components.cards.Card.collapse`. For shared layouts or another category, inspect nearby shared components and locale objects and propose an appropriate matching prefix instead of assuming a category.

Always import `useI18n` from `vue-i18n` and call `const { t } = useI18n()` in `<script setup>`. Use `t('...')` in both the script and template; never use the global `$t('...')` helper. Convert any existing `$t(...)` calls in the moved component to `t(...)` during extraction.

Before editing:

1. Inventory all `t('...')` keys in the script and template, any legacy `$t('...')` calls to convert, and keys constructed dynamically; inspect the complete `en`/`fr` subtrees in each app and shared. Some keys may live in a feature locale instead of `src/locales`, and some may already be defined in shared.
2. Classify keys as owned by the component vs passed in by consumers or shared business vocabulary. Move only owned keys. If Cofolio/Backoffice translations disagree, ask which shared wording to use rather than silently overriding one app's text. If an app truly needs distinct wording, keep it as an app-owned prop/translation and document the choice instead of duplicating a shared-owned key.
3. Establish `oldKey → newKey` for each language; preserve interpolation placeholders, plural forms, HTML and punctuation. Add missing translations only when the text can be verified or agreed with the user.

After the destination is approved, add the translated subtree to **both** shared JSON files, update code/tests to the new keys, and remove **just** the migrated leaves from both apps' global and feature locales; remove empty ancestors only when no other keys use them. Keep keys alphabetically ordered inside edited locale objects (as the repo convention requires) and JSON parseable. Compare the resolved effective messages in both apps if key collisions are possible.
