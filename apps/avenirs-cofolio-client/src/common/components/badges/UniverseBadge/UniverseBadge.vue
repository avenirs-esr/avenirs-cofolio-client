<script setup lang="ts">
import { AvBadge } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'
import { EUniverse } from '@/api/avenir-esr'
import { ICONS } from '@/common/constants'

interface UniverseBadgeProps {
  universe: EUniverse
}

const { universe } = defineProps<UniverseBadgeProps>()

const { t } = useI18n()

const icon = computed(() => {
  switch (universe) {
    case EUniverse.STAFF:
      return ICONS.STAFF
    case EUniverse.STUDENT:
    default:
      return ICONS.STUDENT
  }
})

const avBadgeProps = computed(() => ({
  label: t(`global.universes.${universe}`),
  color: 'var(--light-foreground-secondary)',
  backgroundColor: 'var(--light-background-neutral)',
  icon: icon.value,
})
)
</script>

<template>
  <AvBadge
    data-testid="universe-badge"
    :data-universe="universe"
    v-bind="avBadgeProps"
    border-color="transparent"
    ellipsis
  />
</template>
