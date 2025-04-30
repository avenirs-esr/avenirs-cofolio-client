<script setup lang="ts">
import type { InputProps } from './types'
import { computeIconClass } from '@/utils'
import { computed } from 'vue'
import { Message } from '../feedback'

const props = withDefaults(defineProps<InputProps>(), {
  label: 'label',
  id: '',
  groupId: undefined,
  type: 'text',
  disabled: false,
  hint: undefined,
  textArea: false,
  icon: undefined,
  defaultValue: undefined,
  placeholder: undefined,
  status: undefined,
  validMessage: 'Opération réussie',
  errorMessage: 'Une erreur est survenue',
  inputName: undefined,
  autocomplete: undefined,
})

const {
  label,
  id,
  type,
  disabled,
  hint,
  icon,
  defaultValue,
  placeholder,
  status,
  errorMessage,
  validMessage,
  inputName,
  autocomplete,
  textArea,
} = props

const inputGroupDisabledClass = computed(() => (disabled ? 'fr-input-group--disabled' : undefined))
const inputPasswordClass = computed(() => (type === 'password' ? 'fr-password__input' : undefined))
const labelPasswordClass = computed(() => (type === 'password' ? 'fr-password__label' : undefined))
const idMessages = computed(() => `${id}-messages`)
const iconClass = computed(() => computeIconClass(!!icon, icon))
const inputGroupStatusClass = computed(() => {
  if (status) {
    return `fr-input-group--${status}`
  }
  return undefined
})
</script>

<template>
  <div
    :id="groupId"
    class="fr-input-group"
    :class="[inputGroupDisabledClass, inputGroupStatusClass]"
  >
    <label
      class="fr-label"
      :class="[labelPasswordClass]"
      :for="id"
    >
      {{ label }} <span
        v-if="hint"
        class="fr-hint-text"
      >{{ hint }}</span></label>
    <div
      v-if="icon"
      class="fr-input-wrap"
      :class="[inputGroupDisabledClass, iconClass]"
    >
      <component
        :is="textArea ? 'textarea' : 'input'"
        :id="id"
        class="fr-input"
        :class="[inputPasswordClass]"
        :aria-describedby="idMessages"
        :disabled="disabled"
        :type="textArea ? undefined : type"
        :value="defaultValue"
        :placeholder="placeholder"
        :name="inputName"
        :autocomplete="textArea ? undefined : autocomplete"
        :autocorrect="type === 'password' ? 'off' : undefined"
        :autocapitalize="type === 'password' ? 'off' : undefined"
        :aria-required="type === 'password' ? true : undefined"
      />
    </div>
    <component
      :is="textArea ? 'textarea' : 'input'"
      v-else
      :id="id"
      class="fr-input"
      :class="[inputPasswordClass]"
      :aria-describedby="idMessages"
      :disabled="disabled"
      :type="textArea ? undefined : type"
      :value="defaultValue"
      :placeholder="placeholder"
      :name="inputName"
      :autocomplete="textArea ? undefined : autocomplete"
      :autocorrect="type === 'password' ? 'off' : undefined"
      :autocapitalize="type === 'password' ? 'off' : undefined"
      :aria-required="type === 'password' ? true : undefined"
    />
    <div
      :id="idMessages"
      class="fr-messages-group"
      aria-live="polite"
    >
      <Message
        :status="status"
        :error="errorMessage"
        :valid="validMessage"
        :id-parent="id"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
