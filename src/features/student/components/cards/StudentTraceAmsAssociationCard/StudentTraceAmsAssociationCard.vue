<script lang="ts" setup>
import type { AmsViewDTO } from '@/api/avenir-esr'
import StudentAmsStatusBadge from '@/features/student/components/badges/StudentAmsStatusBadge/StudentAmsStatusBadge.vue'
import StudentTraceAssociationCard from '@/features/student/components/cards/StudentTraceAssociationCard/StudentTraceAssociationCard.vue'

export interface StudentTraceAmsAssociationCardProps {
  ams: AmsViewDTO
}

const { ams } = defineProps<StudentTraceAmsAssociationCardProps>()
</script>

<template>
  <StudentTraceAssociationCard :title="ams.title">
    <template #title-prepend>
      <StudentAmsStatusBadge :status="ams.status" />
    </template>
    <template #body>
      <slot name="body" />
    </template>
  </StudentTraceAssociationCard>
</template>

<style lang="scss" scoped></style>
