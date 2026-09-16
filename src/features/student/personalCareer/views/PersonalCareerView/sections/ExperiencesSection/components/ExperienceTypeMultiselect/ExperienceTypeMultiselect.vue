<script lang="ts" setup>
import { EExperienceType } from '@/api/avenir-esr'
import { useWatchQueryParam } from '@/common/composables'
import { ProBasedExperienceType } from '@/features/student/global/types/experiences.types'
import { AvMultiselect, type AvMultiselectOption } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineProps<{ maxHeight?: string }>()

const { t } = useI18n()

const typesSelected = defineModel<AvMultiselectOption[]>({ default: [] })

const typesOptions: AvMultiselectOption[] = [
  EExperienceType.PROFESSIONAL,
  EExperienceType.PERSONAL,
  EExperienceType.VOLUNTEER
].map(type => ({
  value: type,
  label: t(`student.personalCareer.declaredExperienceType.${type}`)
}))

useWatchQueryParam('type', (newValue) => {
  if (newValue === ProBasedExperienceType.PROFESSIONAL) {
    typesSelected.value = [typesOptions[0]]
  }
  else if (newValue === ProBasedExperienceType.OTHER) {
    typesSelected.value = [typesOptions[1], typesOptions[2]]
  }
})
</script>

<template>
  <AvMultiselect
    v-model="typesSelected"
    class="experience-type-multiselect"
    :options="typesOptions"
    :label="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.ExperienceTypeMultiselect.label')"
    :placeholder="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.ExperienceTypeMultiselect.placeholder')"
    :selected-text="t('student.personalCareer.views.PersonalCareerView.ExperiencesSection.ExperienceTypeMultiselect.selected', { count: typesSelected.length })"
    dense
    width="20rem"
    height="2.5rem"
    :collapse-max-height="maxHeight"
    data-testid="experience-type-multiselect"
  />
</template>
