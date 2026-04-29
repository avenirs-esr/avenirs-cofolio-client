<script setup lang="ts">
import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import ValorizedBadge from '@/common/components/ValorizedBadge/ValorizedBadge.vue'
import { INFINITE_SCROLL_BOTTOM_DISTANCE } from '@/common/constants'
import CompactCard from '@/features/student/global/components/cards/CompactCard/CompactCard.vue'
import { AvSideMenu, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
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
  { distance: INFINITE_SCROLL_BOTTOM_DISTANCE }
)
const isCollapsed = ref(false)
</script>

<template>
  <AvSideMenu
    v-model:collapsed="isCollapsed"
    collapsed-width="fit-content"
  >
    <div class="declared-program-side-menu av-col av-gap-md">
      <div
        v-if="!isCollapsed"
        ref="programsContainer"
        class="declared-program-side-menu__programs av-p-xxxs av-col av-gap-sm"
      >
        <span class="s2-bold">
          <span class="s2-regular">
            {{ t('student.personalCareer.navigation.DeclaredProgramSideMenu.title') }}
          </span>
          ({{ countPrograms }})
        </span>
        <div
          v-for="program in programs"
          :key="program.id"
        >
          <a
            role="button"
            tabindex="0"
            class="declared-program-side-menu__program av-row av-align-center"
            :aria-pressed="program.id === selectedProgramId"
            :class="{ 'declared-program-side-menu__program--selected': program.id === selectedProgramId }"
            @keydown.enter="$emit('selectProgram', program.id)"
            @keydown.space="$emit('selectProgram', program.id)"
            @click="$emit('selectProgram', program.id)"
          >
            <CompactCard
              :element="{ id: program.id, title: program.title }"
              :icon="MDI_ICONS.HUB_OUTLINE"
              color="var(--text1)"
              icon-color="var(--icon)"
              background-color="var(--surface-background)"
              border-color="var(--other-border-skill-card)"
              icon-border-color="var(--other-border-skill-card)"
            >
              <ValorizedBadge v-if="false" />
            </CompactCard>
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
