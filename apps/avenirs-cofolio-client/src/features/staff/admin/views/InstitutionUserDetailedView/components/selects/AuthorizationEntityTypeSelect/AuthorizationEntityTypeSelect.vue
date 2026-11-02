<script setup lang="ts">
import type { AvSelectOption, AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import type { EAuthorizationEntityType, ExternalUserDetailDTO } from '@/api/avenir-esr'
import { AvSelect } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { useGetExternalUserAuthorizationTypes } from '@/api/avenir-esr'

interface AuthorizationEntityTypeSelectProps {
  user: ExternalUserDetailDTO
}

const { user } = defineProps<AuthorizationEntityTypeSelectProps>()

const contextType = defineModel<EAuthorizationEntityType | undefined>({ required: true })

const { t } = useI18n()

const userId = computed(() => user.id)
const { data: types } = useGetExternalUserAuthorizationTypes(userId.value)

const options = computed<AvSelectOption[]>(() =>
  (types.value ?? []).map(type => ({
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
    v-if="options.length > 0"
    v-model="selectedOption"
    :options="options"
    :label="t('staff.admin.views.InstitutionUserDetailedView.components.selects.AuthorizationEntityTypeSelect.label')"
    :placeholder="t('staff.admin.views.InstitutionUserDetailedView.components.selects.AuthorizationEntityTypeSelect.placeholder')"
    required
    width="100%"
  />
</template>
