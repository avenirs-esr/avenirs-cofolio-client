<script setup lang="ts">
import { useNavigation } from '@/common/composables'
import { parseDateISO } from '@/common/utils'
import { StudentTrackCard } from '@/features/student/components'
import { useStudentTracksSummaryQuery } from '@/features/student/queries'
import { AvButton, AvCard, MDI_ICONS } from '@/ui'
import { compareDesc } from 'date-fns'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { navigateToStudentTracks } = useNavigation()
const { data: tracks } = useStudentTracksSummaryQuery()

const renderedTracks = computed(() => {
  return tracks.value
    .slice()
    .sort((a, b) => compareDesc(parseDateISO(a.filedAt), parseDateISO(b.filedAt)))
    .slice(0, 3)
})
</script>

<template>
  <AvCard
    background-color="--white"
    title-background="--white"
  >
    <template #title>
      <div class="tracks-widget-container__title">
        <VIcon
          :name="MDI_ICONS.ATTACH_FILE"
          color="var(--foreground-icon)"
          scale="1.5"
        />
        <span class="n5">
          {{ t('student.widgets.tracks.title') }}
        </span>
      </div>
    </template>
    <template #body>
      <div class="tracks-widget-container__body">
        <StudentTrackCard
          v-for="track in renderedTracks"
          :key="track.id"
          :track="track"
        />
      </div>
    </template>
    <template #footer>
      <div class="tracks-widget-container__footer">
        <AvButton
          :label="t('student.widgets.tracks.buttons.seeAll')"
          :on-click="navigateToStudentTracks"
          :icon="MDI_ICONS.ARROW_RIGHT"
          size="sm"
        />
      </div>
    </template>
  </AvCard>
</template>

<style lang="scss" scoped>
.tracks-widget-container__title {
  display: flex;
  flex-direction: row;
  gap: 0.75rem;
  align-items: center;
  padding-left: 0.75rem;
}

.tracks-widget-container__body {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.tracks-widget-container__footer {
  display: flex;
  flex-direction: row-reverse;
  padding-top: 1.25rem;
}
</style>
