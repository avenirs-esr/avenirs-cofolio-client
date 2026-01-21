<script setup lang="ts">
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import DeclaredExperienceCompactCard
  from '@/features/student/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.vue'
import { AvButton, AvSideMenu, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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
  { distance: 10 }
)

const isCollapsed = ref(false)
const icon = MDI_ICONS.SCHOOL_OUTLINE
</script>

<template>
  <AvSideMenu
    v-model:collapsed="isCollapsed"
    collapsed-width="fit-content"
  >
    <div class="declared-experience-side-menu">
      <span
        class="s2-bold"
        :class="{ 'av-sr-only': isCollapsed }"
      >
        <span class="s2-regular">
          {{ capitalize(t(`student.personalCareer.views.DeclaredExperienceView.DeclaredExperienceDetailsSideMenu.title`)) }}
        </span>
        ({{ experienceCount }})
      </span>
      <AvIconText
        v-if="isCollapsed"
        :icon="icon"
        :text="experiences.length.toString()"
        typography-class="s2-bold"
        gap="var(--spacing-sm)"
      />
      <div
        ref="experiencesContainer"
        class="declared-experience-side-menu__experiences av-col av-gap-sm av-mt-sm"
      >
        <div
          v-for="experience in experiences"
          :key="experience.id"
        >
          <AvButton
            v-if="isCollapsed"
            :label="experience.title"
            :icon="icon"
            :variant="experience.id === selectedExperienceId ? 'OUTLINED' : 'DEFAULT'"
            icon-only
            @click="$emit('selectExperience', experience.id)"
          />
          <a
            v-else
            role="button"
            tabindex="0"
            :aria-pressed="experience.id === selectedExperienceId"
            :class="{ 'declared-experience-side-menu__experience--selected': experience.id === selectedExperienceId }"
            @keydown.enter="$emit('selectExperience', experience.id)"
            @keydown.space="$emit('selectExperience', experience.id)"
            @click="$emit('selectExperience', experience.id)"
          >
            <DeclaredExperienceCompactCard
              :title="experience.title"
              :valorized="false"
              :icon-name="icon"
            />
          </a>
        </div>
      </div>
    </div>
  </AvSideMenu>
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
