<script setup lang="ts">
import type { PasswordInpuProps } from './types'

const props = withDefaults(defineProps<PasswordInpuProps>(), {
  label: 'Mot de passe',
  id: 'input-password',
  checkboxId: 'password-checkbox',
  checkboxLabel: 'Afficher',
  checkboxAriaLabel: 'Afficher le mot de passe',
  href: undefined,
  forgotLabel: 'Mot de passe oublié ?',
})

const { label, id, checkboxId, checkboxLabel, checkboxAriaLabel } = props
</script>

<template>
  <div class="fr-password">
    <label
      class="fr-password__label fr-label"
      :for="`${id}-input`"
    > {{ label }} </label>
    <div class="fr-input-wrap">
      <input
        id="id"
        class="fr-password__input fr-input"
        autocapitalize="off"
        autocorrect="off"
        :aria-describedby="`${id}-input-messages`"
        aria-required="true"
        name="password"
        autocomplete="off"
        type="password"
      >
    </div>
    <div
      :id="`${id}-input-messages`"
      class="fr-messages-group"
      aria-live="polite"
    />
    <div class="fr-password__checkbox fr-checkbox-group fr-checkbox-group--sm">
      <input
        :id="checkboxId"
        :aria-label="checkboxAriaLabel"
        type="checkbox"
      >
      <label
        class="fr--password__checkbox fr-label"
        :for="checkboxId"
      > {{ checkboxLabel }} </label>
    </div>
    <p v-if="href">
      <a
        :id="`${id}-link`"
        :href="href"
        class="fr-link"
      >{{ forgotLabel }}</a>
    </p>
  </div>
</template>

<style lang="scss" scoped></style>
