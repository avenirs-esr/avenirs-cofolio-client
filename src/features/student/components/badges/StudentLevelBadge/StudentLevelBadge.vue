<script setup lang="ts">
import type { LevelDTO, LevelDTO_Temp } from '@/types'
import { AvBadge } from '@/ui'
import { useI18n } from 'vue-i18n'
import { levelToBadge } from './utils'

const { level } = defineProps<{ level: LevelDTO | LevelDTO_Temp }>()

const { t } = useI18n()

const levelBadge = computed(() => levelToBadge(level))
const label = computed(() => t(levelBadge.value.labelkey))
</script>

<template>
  <AvBadge
    v-bind="levelBadge"
    :label="label"
    small
    ellipsis
  />
</template>

<style lang="scss" scoped></style>
