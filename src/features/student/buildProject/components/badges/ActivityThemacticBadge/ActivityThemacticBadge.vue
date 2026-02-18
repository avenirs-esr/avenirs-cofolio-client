<script lang="ts" setup>
import { EActivityThematic } from '@/api/avenir-esr'
import { ICONS } from '@/features/student/global/icons'
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ActivityThematicBadgeProps {
  thematic: EActivityThematic
}

const { thematic } = defineProps<ActivityThematicBadgeProps>()

const { t } = useI18n()

const label = computed(() => t(`student.buildProject.activities.thematics.${thematic}`))

const icon = computed(() => {
  switch (thematic) {
    case EActivityThematic.EXPERIENCES:
      return ICONS.EXPERIENCES
    case EActivityThematic.FUTURE_PLANS:
      return ICONS.FUTURES
    case EActivityThematic.PROGRAMS:
      return ICONS.PROGRAMS
    case EActivityThematic.RESUMES:
      return ICONS.RESUMES
    case EActivityThematic.SELF_KNOWLEDGE:
      return ICONS.SELF_KNOWLEDGE
    case EActivityThematic.TRAJECTORIES:
      return ICONS.TRAJECTORIES
    case EActivityThematic.TRANSVERSAL:
    default:
      return ICONS.TRANSVERSAL
  }
})
</script>

<template>
  <AvBadge
    :label="label"
    :icon="icon"
    color="var(--light-foreground-accent)"
    background-color="var(--light-background-accent)"
    border-color="transparent"
  />
</template>
