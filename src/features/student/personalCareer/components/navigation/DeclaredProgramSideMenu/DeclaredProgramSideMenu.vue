<script setup lang="ts">
import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import DeclaredProgramCompactCard
  from '@/features/student/personalCareer/components/cards/DeclaredProgramCompactCard/DeclaredProgramCompactCard.vue'
import { AvButton, AvSideMenu, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useInfiniteScroll } from '@vueuse/core'
import { useI18n } from 'vue-i18n'

export interface DeclaredProgramSideMenuProps {
  selectedProgramId: string
  programs: DeclaredProgramViewDTO[]
  countPrograms?: number
}
const { selectedProgramId, programs, countPrograms = 0 } = defineProps<DeclaredProgramSideMenuProps>()
const emit = defineEmits<{
  (e: 'selectProgram', programId: string): void
  (e: 'loadMorePrograms'): void
}>()

const { t } = useI18n()

const programsContainer = ref<HTMLElement | null>(null)

useInfiniteScroll(
  programsContainer,
  () => {
    emit('loadMorePrograms')
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
    <div class="declared-program-side-menu av-col av-gap-md">
      <span
        class="s2-bold"
        :class="{ 'av-sr-only': isCollapsed }"
      >
        <span class="s2-regular">
          {{ t('student.personalCareer.views.DeclaredProgramDetailedView.sideMenu.title') }}
        </span>
        ({{ countPrograms }})
      </span>

      <AvIconText
        v-if="isCollapsed"
        :icon="icon"
        :text="programs.length.toString()"
        typography-class="s2-bold"
        gap="var(--spacing-sm)"
      />

      <div
        ref="programsContainer"
        class="declared-program-side-menu__programs av-col av-gap-sm"
      >
        <div
          v-for="program in programs"
          :key="program.id"
        >
          <AvButton
            v-if="isCollapsed"
            :label="program.title"
            :icon="icon"
            :variant="program.id === selectedProgramId ? 'OUTLINED' : 'DEFAULT'"
            icon-only
            @click="$emit('selectProgram', program.id)"
          />

          <a
            v-else
            role="button"
            tabindex="0"
            :aria-pressed="program.id === selectedProgramId"
            :class="{ 'declared-program-side-menu__program--selected': program.id === selectedProgramId }"
            @keydown.enter="$emit('selectProgram', program.id)"
            @keydown.space="$emit('selectProgram', program.id)"
            @click="$emit('selectProgram', program.id)"
          >
            <DeclaredProgramCompactCard
              :title="program.title"
              :valorized="false"
              :icon-name="icon"
            />
          </a>
        </div>
      </div>
    </div>
  </AvSideMenu>
</template>

<style scoped lang="scss">
.declared-program-side-menu {
  &__programs {
    max-height: 40rem;
    overflow-y: auto;
  }

  &__program {
    display: flex;
    align-items: center;
    padding: var(--spacing-xs) var(--spacing-sm);
    border-radius: var(--radius-lg);
    background: var(--other-background-base);
    border: 1px solid var(--divider);
    cursor: pointer;

    &:hover {
      border-color: var(--dark-background-primary1);
    }
  }

  &__program--selected {
    :deep(.av-card) {
      border: 1px solid var(--dark-background-primary1) !important;
      box-shadow: 0 0 0 2px var(--dark-background-primary1);
    }
  }
}
</style>
