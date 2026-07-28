<script setup lang="ts">
import type { DeclaredActivityAssociationDTO, DeclaredActivityViewDTO } from '@/api/avenir-esr'
import DeclaredActivityStatusBadge from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.vue'
import { isDeletableDeclaredActivityAssociation } from '@/common/activities/rules/activities.rules'
import { ICONS } from '@/common/constants'
import CompactCardSelector from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.vue'

export interface DeleteActivitiesSelectorProps {
  associations: DeclaredActivityAssociationDTO[]
  readonly?: boolean
}

defineOptions({
  inheritAttrs: false
})

const { associations } = defineProps<DeleteActivitiesSelectorProps>()

const selectedIds = defineModel<string[]>({ default: [] })

const selectableElements = computed(() => associations.map((association) => {
  const { associationId, declaredActivity } = association
  return {
    id: associationId,
    title: declaredActivity.title,
    baseElement: declaredActivity,
    showSlot: true,
    disabled: !isDeletableDeclaredActivityAssociation(association)
  }
}))
</script>

<template>
  <div class="av-row av-justify-center av-gap-sm av-radius-md av-wrap">
    <CompactCardSelector
      v-model="selectedIds"
      :elements="selectableElements"
      :icon="ICONS.ACTIVITY"
      color="var(--text1)"
      icon-color="var(--icon)"
      background-color="var(--surface-background)"
      checkbox-color="var(--dark-background-primary1)"
      overlay-color="var(--dark-background-primary1)"
      :overlay-opacity="0.25"
      :readonly="readonly"
    >
      <template #default="{ element }">
        <DeclaredActivityStatusBadge
          :status="(element as DeclaredActivityViewDTO).status"
        />
      </template>
    </CompactCardSelector>
  </div>
</template>
