<script setup lang="ts">
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import ValorizedBadge from '@/common/components/badges/ValorizedBadge/ValorizedBadge.vue'
import SideMenu from '@/common/components/navigation/SideMenu/SideMenu.vue'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import CompactCard from '@/features/global/components/cards/CompactCard/CompactCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface DeclaredExperienceSideMenuProps {
  experienceCount?: number
  selectedExperienceId: string
  experiences: DeclaredExperienceViewDTO[]
}

const { selectedExperienceId, experiences, experienceCount = 0 } = defineProps<DeclaredExperienceSideMenuProps>()

const emit = defineEmits<{
  (e: 'selectExperience', experienceId: string): void
  (e: 'loadMoreExperiences'): void
}>()

const { t } = useI18n()

const experiencesContainer = ref<HTMLElement | null>(null)

useInfiniteScroll(
  experiencesContainer,
  () => {
    emit('loadMoreExperiences')
  },
  { distance: INFINITE_SCROLL_BOTTOM_DISTANCE }
)

const isCollapsed = ref(false)
</script>

<template>
  <SideMenu
    v-model:collapsed="isCollapsed"
    collapsed-width="fit-content"
  >
    <div class="declared-experience-side-menu">
      <div
        v-if="!isCollapsed"
        ref="experiencesContainer"
        class="declared-experience-side-menu__experiences av-p-xxxs av-col av-gap-sm"
      >
        <span class="s2-bold">
          <span class="s2-regular">
            {{ capitalize(t(`student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsSideMenu.title`)) }}
          </span>
          ({{ experienceCount }})
        </span>
        <div
          v-for="experience in experiences"
          :key="experience.id"
        >
          <a
            role="button"
            tabindex="0"
            :aria-pressed="experience.id === selectedExperienceId"
            :class="{ 'declared-experience-side-menu__experience--selected': experience.id === selectedExperienceId }"
            @keydown.enter="$emit('selectExperience', experience.id)"
            @keydown.space="$emit('selectExperience', experience.id)"
            @click="$emit('selectExperience', experience.id)"
          >
            <CompactCard
              :element="{ id: experience.id, title: experience.title }"
              :icon="MDI_ICONS.HUB_OUTLINE"
              color="var(--text1)"
              icon-color="var(--icon)"
              background-color="var(--surface-background)"
              border-color="var(--other-border-skill-card)"
              icon-border-color="var(--other-border-skill-card)"
            >
              <ValorizedBadge
                v-if="experience.valorized"
                :valorized="experience.valorized"
              />
            </CompactCard>
          </a>
        </div>
      </div>
    </div>
  </SideMenu>
</template>

<style lang="scss" scoped>
.declared-experience-side-menu {
  &__experiences {
    max-height: 40rem;
    overflow-y: auto;
  }

  &__experience {

    &:hover {
      border-color: var(--dark-background-primary1);
    }
  }

  &__experience--selected {
    :deep(.av-card) {
      border: 1px solid var(--dark-background-primary1) !important;
      box-shadow: 0 0 0 2px var(--dark-background-primary1);
    }
  }
}
</style>
