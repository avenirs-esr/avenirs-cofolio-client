<script setup lang="ts">
import type { AvSelectOption, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EAuthorizationEntityType } from '@/api/avenir-esr'

const contextType = defineModel<EAuthorizationEntityType>({ required: true })

const { t } = useI18n()

const options = computed<AvSelectOption[]>(() =>
  Object.values(EAuthorizationEntityType).map(type => ({
    value: type,
    label: t(`staff.admin.views.InstitutionUserDetailedView.components.selects.AuthorizationEntityTypeSelect.options.${type}.label`),
  })),
)

const selectedOption = computed<AvSelectSelectedOption | null>({
  get: () => options.value.find(option => option.value === contextType.value) ?? null,
  set: (option) => {
    if (option) {
      contextType.value = option.value as EAuthorizationEntityType
    }
  },
})
</script>

<template>
  <AvSelect
    v-model="selectedOption"
    :options="options"
    :label="t('staff.admin.views.InstitutionUserDetailedView.components.selects.AuthorizationEntityTypeSelect.label')"
    :placeholder="t('staff.admin.views.InstitutionUserDetailedView.components.selects.AuthorizationEntityTypeSelect.placeholder')"
    required
    width="100%"
  />
</template>
