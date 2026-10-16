<script lang="ts" setup>
import { AvBadge, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EGroupType } from '@/api/avenir-esr'

export interface GroupTypeBadgeProps {
  type: EGroupType
}

const { type } = defineProps<GroupTypeBadgeProps>()

const { t } = useI18n()

const label = computed(() =>
  t(`staff.admin.views.AdminInstitutionGroupsView.components.badges.GroupTypeBadge.label.${type}`)
)

const icon = computed(() => {
  switch (type) {
    case EGroupType.PROGRAM:
      return MDI_ICONS.SCHOOL_OUTLINE
    case EGroupType.PROGRAM_OPTION:
      return MDI_ICONS.BOOK_OPEN_BLANK_VARIANT_OUTLINE
    case EGroupType.STUDENT_GROUP:
    default:
      return MDI_ICONS.PEOPLE_GROUP_OUTLINE
  }
})
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    background-color="var(--light-background-neutral)"
    color="var(--light-foreground-neutral)"
    data-testid="group-type-badge"
    ellipsis
  />
</template>
