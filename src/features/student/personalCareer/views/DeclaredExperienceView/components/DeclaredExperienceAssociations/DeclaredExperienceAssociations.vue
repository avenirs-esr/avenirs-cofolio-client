<script setup lang="ts">
import type { TraceAssociationDTO } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import { QuerySuspense } from '@/common/components'
import AssociatedTracesCard
  from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/AssociatedTracesCard/AssociatedTracesCard.vue'
import { useI18n } from 'vue-i18n'

interface DeclaredExperienceAssociationsProps {
  traceAssociations: TraceAssociationDTO[]
  associationsError?: BaseApiException | null | undefined
}

const { traceAssociations } = defineProps<DeclaredExperienceAssociationsProps>()

const { t } = useI18n()

const countAssociations = computed(() => traceAssociations.length)
</script>

<template>
  <div class="declared-experience-associations-container">
    <div
      class="av-col av-gap-xl av-pt-xl"
      data-testid="declared-experience-associations"
    >
      <QuerySuspense
        :error="associationsError"
        :error-title="t('student.personalCareer.views.DeclaredExperienceView.errors.fetchAssociations')"
        :empty-state-message="t('student.personalCareer.views.DeclaredExperienceView.empty.associations')"
        :is-empty="countAssociations === 0"
      >
        <AssociatedTracesCard :associated-traces="traceAssociations" />
      </QuerySuspense>
    </div>
  </div>
</template>
