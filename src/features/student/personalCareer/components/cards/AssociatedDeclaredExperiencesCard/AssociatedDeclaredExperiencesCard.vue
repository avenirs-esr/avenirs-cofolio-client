<script setup lang="ts">
import type { DeclaredExperienceAssociationDTO } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'
import AssociationsCard from '@/features/student/global/components/cards/AssociationsCard/AssociationsCard.vue'
import AssociatedDeclaredExperienceCard
  from '@/features/student/personalCareer/components/cards/AssociatedDeclaredExperienceCard/AssociatedDeclaredExperienceCard.vue'
import { useI18n } from 'vue-i18n'

export interface AssociatedDeclaredExperiencesCardProps {
  associatedExperiences: DeclaredExperienceAssociationDTO[]
  disabled?: boolean
}

const { associatedExperiences, disabled } = defineProps<AssociatedDeclaredExperiencesCardProps>()

const { t } = useI18n()

const title = computed(() => t('student.personalCareer.cards.AssociatedDeclaredExperiencesCard.title', { count: associatedExperiences.length }))
</script>

<template>
  <AssociationsCard
    v-if="associatedExperiences.length > 0"
    :title
    :icon="ICONS.EXPERIENCES"
    data-testid="associated-declared-experiences-card"
  >
    <AssociatedDeclaredExperienceCard
      v-for="associatedExperience in associatedExperiences"
      :key="associatedExperience.associationId"
      :declared-experience="associatedExperience.declaredExperience"
      :disabled="disabled"
    />
  </AssociationsCard>
</template>
