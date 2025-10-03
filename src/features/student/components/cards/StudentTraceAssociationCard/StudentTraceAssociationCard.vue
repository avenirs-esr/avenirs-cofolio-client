<script lang="ts" setup>
import { AvCard, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceAssociationCardProps {
  title: string
  icon?: string
}

const {
  icon = MDI_ICONS.STAR_SHOOTING_OUTLINE
} = defineProps<StudentTraceAssociationCardProps>()
</script>

<template>
  <div class="student-trace-association-card">
    <AvCard border-color="var(--other-border-skill-card)">
      <template #title>
        <div class="title-container">
          <AvIconText
            :icon="icon"
            :text="title"
            text-color="var(--text2)"
            icon-color="var(--text2)"
          />
          <slot name="title-prepend" />
        </div>
      </template>
      <template #body>
        <div class="body-container">
          <slot name="body" />
        </div>
      </template>
    </AvCard>
  </div>
</template>

<style lang="scss" scoped>
.student-trace-association-card {
  width: 100%;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.association-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.body-container {
  padding: var(--spacing-xs) var(--spacing-xs);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

:deep() {
  .av-card__title {
    padding: var(--spacing-xs) var(--spacing-sm);
    border-color: var(--light-background-neutral) !important;
  }

  .av-card {
    padding-bottom: var(--spacing-xs);
  }

  .av-card__body .body-container {
    padding: 0 var(--spacing-xs);
  }

  .icon-text--container {
    gap: var(--spacing-sm);
  }
}
</style>
