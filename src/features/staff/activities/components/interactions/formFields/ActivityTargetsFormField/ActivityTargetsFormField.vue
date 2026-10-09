<script setup lang="ts">
import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { ActivityTarget } from '@/features/staff/activities/types/activity-targets.types'
import type { EditActivityForm } from '@/features/staff/activities/types/forms.types'
import type { IdTitle } from '@/types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import { useStaffScope } from '@/api/avenir-esr'
import { QuerySuspense } from '@/common/components'
import Autocomplete from '@/common/components/interaction/selects/Autocomplete/Autocomplete.vue'
import { scopeToActivityTargets } from '@/features/staff/activities/utils/activity-targets.utils'
import ToggleParameterCard from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.vue'
import SelectedAssociateItemsContainer
  from '@/features/student/associations/components/cards/SelectedAssociateItemsContainer/SelectedAssociateItemsContainer.vue'
import { AvMessage, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface ActivityTargetsFormFieldProps {
  form: EditActivityForm
  persistedIds?: string[]
  lockPersisted?: boolean
}

interface SelectedTarget extends IdTitle {
  typeLabel: string
  locked: boolean
}

const { form, persistedIds = [], lockPersisted = false } = defineProps<ActivityTargetsFormFieldProps>()

const emit = defineEmits<{
  autosave: [value: ActivityDraftUpdateRequest]
}>()

const { t } = useI18n()

const search = ref('')

const { data: scope, isLoading, error } = useStaffScope()

const institutionIds = form.useStore(state => state.values.targetInstitutionIds)
const groupIds = form.useStore(state => state.values.targetGroupIds)

const availableTargets = computed(() => scopeToActivityTargets(scope.value))
const availableTargetsById = computed(() => new Map(availableTargets.value.map(target => [target.id, target])))

const selectedIds = computed(() => [...institutionIds.value, ...groupIds.value])
const isNationalField = form.useField({ name: 'isNational' })

function isLocked (id: string): boolean {
  return lockPersisted && persistedIds.includes(id)
}

function getTypeLabel (target: ActivityTarget): string {
  return t(`staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.types.${target.type}`)
}

function toOption (target: ActivityTarget): AvAutocompleteOption {
  const context = target.path.length > 0 ? ` · ${target.path.join(' › ')}` : ''

  return {
    value: target.id,
    label: target.title,
    description: `${getTypeLabel(target)}${context}`,
  }
}

const options = computed<AvAutocompleteOption[]>(() => availableTargets.value.map(toOption))

function toSelectedTarget (id: string, isInstitution: boolean): SelectedTarget {
  const target = availableTargetsById.value.get(id)

  return {
    id,
    title: target?.title ?? t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.outOfScopeTitle'),
    typeLabel: target
      ? getTypeLabel(target)
      : t(`staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.types.${isInstitution ? 'INSTITUTION' : 'GROUP'}`),
    locked: isLocked(id),
  }
}

const selectedTargets = computed<SelectedTarget[]>(() => [
  ...institutionIds.value.map(id => toSelectedTarget(id, true)),
  ...groupIds.value.map(id => toSelectedTarget(id, false)),
])

const hasLockedTargets = computed(() => selectedTargets.value.some(target => target.locked))

const isNational = computed({
  get: () => isNationalField.state.value.value === true,
  set: (newValue: boolean) => {
    form.setFieldValue('isNational', newValue)
    if (newValue) {
      form.setFieldValue('targetInstitutionIds', [])
      form.setFieldValue('targetGroupIds', [])
      emit('autosave', { national: true, targetInstitutionIds: [], targetGroupIds: [] })
    }
    else {
      emit('autosave', { national: false })
    }
  },
})

function updateTargets (nextInstitutionIds: string[], nextGroupIds: string[]) {
  form.setFieldValue('targetInstitutionIds', nextInstitutionIds)
  form.setFieldValue('targetGroupIds', nextGroupIds)
  emit('autosave', { targetInstitutionIds: nextInstitutionIds, targetGroupIds: nextGroupIds })
}

const selectedOptions = computed<AvAutocompleteOption[]>({
  get: () => selectedIds.value
    .map(id => availableTargetsById.value.get(id))
    .filter((target): target is ActivityTarget => !!target)
    .map(toOption),
  set: (newOptions) => {
    const pickedIds = new Set(newOptions.map(option => option.value.toString()))
    const keepsId = (id: string) => pickedIds.has(id) || isLocked(id) || !availableTargetsById.value.has(id)
    const addedTargets = [...pickedIds]
      .filter(id => !selectedIds.value.includes(id))
      .map(id => availableTargetsById.value.get(id)!)

    updateTargets(
      [...institutionIds.value.filter(keepsId), ...addedTargets.filter(target => target.isInstitution).map(target => target.id)],
      [...groupIds.value.filter(keepsId), ...addedTargets.filter(target => !target.isInstitution).map(target => target.id)],
    )
  },
})

function removeTarget (id: string) {
  if (isLocked(id)) {
    return
  }

  updateTargets(
    institutionIds.value.filter(institutionId => institutionId !== id),
    groupIds.value.filter(groupId => groupId !== id),
  )
}
</script>

<template>
  <div
    class="av-col av-gap-sm"
    data-testid="activity-targets-form-field"
  >
    <ToggleParameterCard
      v-model="isNational"
      toggle-id="activity-national-toggle"
      data-testid="activity-national-parameter-toggle"
      :title="t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.nationalToggleTitle')"
      :icon="MDI_ICONS.MAP_MARKER_MULTIPLE_OUTLINE"
      :disabled="hasLockedTargets"
      :disabled-tooltip="t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.nationalToggleDisabledTooltip')"
    >
      <span class="b2-regular av-text-text1">{{
        t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.nationalToggleDescription')
      }}</span>
    </ToggleParameterCard>

    <AvMessage
      type="info"
      data-testid="activity-targets-scope-message"
      :message="isNational
        ? t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.national')
        : t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.targeted', { count: selectedIds.length })"
    />

    <span class="b2-regular av-text-text1">{{
      t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.description')
    }}</span>

    <QuerySuspense
      :is-loading="isLoading"
      :error="error"
      :error-title="t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.fetchError')"
    >
      <Autocomplete
        v-model="selectedOptions"
        v-model:search="search"
        :options="options"
        :multi-select="true"
        :show-selected-section="false"
        :display-selection-in-input="false"
        :input-options="{
          label: `${t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.label')}${isNational ? '' : ' *'}`,
          placeholder: t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.placeholder'),
          disabled: isNational,
          disabledTooltip: t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.targetsDisabledTooltip'),
        }"
        :items-title-max-lines="2"
        dropdown-class="activity-targets-form-field__dropdown"
        dropdown-width="100%"
        data-testid="activity-targets-autocomplete"
      />
    </QuerySuspense>

    <AvMessage
      v-if="hasLockedTargets"
      type="info"
      data-testid="activity-targets-locked-message"
      :message="t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.locked')"
    />

    <SelectedAssociateItemsContainer
      v-if="selectedTargets.length > 0"
      :items="selectedTargets"
      horizontal
      :is-item-disabled="target => target.locked"
      :disabled-tooltip="t('staff.activities.views.EditNationalActivityView.ActivityTargetsFormField.removeDisabledTooltip')"
      data-testid="activity-targets-selected-list"
      @delete="removeTarget"
    >
      <template #item="{ item }">
        <div
          class="av-col av-gap-xxs av-py-xs av-pl-sm av-pr-xl av-border-width-sm av-border-style-solid av-border-stroke av-radius-md av-background-base"
          data-testid="activity-targets-selected-item"
        >
          <span
            class="caption-light av-text-text1"
            data-testid="activity-targets-selected-type"
          >{{ item.typeLabel }}</span>
          <span
            class="b2-bold av-text-text1 av-wrap-anywhere"
            :title="item.title"
          >{{ item.title }}</span>
        </div>
      </template>
    </SelectedAssociateItemsContainer>
  </div>
</template>

<style lang="scss" scoped>
:deep(.activity-targets-form-field__dropdown) {
  position: static !important;
}
</style>
