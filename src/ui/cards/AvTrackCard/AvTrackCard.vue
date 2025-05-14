<script lang="ts" setup>
import { STUDENT_TOOLS_TRACKS_ROUTE } from '@/features/student/routes'
import { AvCard, type AvTrackCardProps, MDI_ICONS, RI_ICONS } from '@/ui'
import { DsfrTag } from '@gouvminint/vue-dsfr'

const { track, to = { name: STUDENT_TOOLS_TRACKS_ROUTE } } = defineProps<AvTrackCardProps>()
const { name, skillCount, activityCount } = track

function getRandomSkillColor () {
  const random = Math.floor(Math.random() * 12) + 1
  return `var(--skill${random})`
}

const theme = ref({
  hoverBorderColor: 'var(--dark-background-primary1)',
})
</script>

<template>
  <div class="av-track-card">
    <RouterLink :to="to">
      <AvCard
        border-color="--other-skill-card-border"
        title-background="--background-surface-background"
        title-height="4.375rem"
      >
        <template #title>
          <div class="av-track-card__title">
            <div class="av-track-card__titlecontent">
              <span class="b1-bold av-track-card__titletruncate">
                {{ name }}
              </span>
            </div>
            <div
              class="av-track-card__icon"
              :style="{ background: 'var(--background-surface-background)' }"
            >
              <VIcon
                :name="MDI_ICONS.ATTACH_FILE"
                color="var(--foreground-text1)"
                scale="1.75"
              />
            </div>
          </div>
        </template>
        <template #body>
          <div class="av-track-card__body">
            <div class="av-track-card__line av-track-card__skillline">
              <div
                v-for="n in Math.min(skillCount, 2)"
                :key="n"
                class="av-track-card__lineicon"
                :style="{ backgroundColor: getRandomSkillColor() }"
              >
                <VIcon
                  :name="MDI_ICONS.STAR_SHOOTING"
                  color="var(--white)"
                />
              </div>
              <span class="b2-regular">{{ skillCount }} compétences</span>
            </div>
            <div class="av-track-card__line">
              <VIcon
                :name="MDI_ICONS.TEST_TUBE_EMPTY"
                color="var(--foreground-text2)"
              />
              <span class="b2-regular">{{ activityCount }} mise en situation</span>
            </div>
            <div class="av-track-card__line">
              <VIcon
                :name="MDI_ICONS.SWAP_VERTICAL_VARIANT"
                color="var(--foreground-text2)"
              />
              <span class="b2-regular">Projet de vie</span>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="av-track-card__footer">
            <DsfrTag
              label="Groupe"
              :icon="RI_ICONS.DICE_4"
            />
          </div>
        </template>
      </AvCard>
    </RouterLink>
  </div>
</template>

<style lang="scss" scoped>
.av-card:hover {
  border: 1px solid v-bind('theme.hoverBorderColor') !important;
  box-shadow: 0 0 0 2px v-bind('theme.hoverBorderColor');
}

.av-card {
  height: 14rem;
}

.av-track-card {
  width: 17.125rem;
  height: 14rem;
}

.av-track-card__title {
  position: relative
}

.av-track-card__titlecontent {
  width: 11.25rem;
  height: 3rem;
}

.av-track-card__titletruncate {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  height: 3rem;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  overflow-wrap: break-word;
}

.av-track-card__icon {
  position: absolute;
  width: 2.75rem;
  height: 2.75rem;
  border-radius: 0.75rem;
  border: 1px solid var(--other-skill-card-border);
  right: 0.75rem;
  top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
}

.av-track-card__body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.av-track-card__line {
    display: flex;
    flex-direction: row;
    gap: 0.75rem;
    align-items: center;
}

.av-track-card__lineicon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1.375rem;
  width: 1.375rem;
  border-radius: 0.25rem;
}

.av-track-card__line.av-track-card__skillline {
    gap: 0.5rem;
}

.av-track-card__footer {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.25rem;
}

.fr-tag {
  color: var(--foreground-text2);
  background-color: var(--light-background-neutral);
}
</style>
