<script lang="ts" setup>
import { AvCard, AvVIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export interface StudentTraceAssociationCardProps {
  title: string
  icon?: string
}

withDefaults(defineProps<StudentTraceAssociationCardProps>(), {
  icon: MDI_ICONS.STAR_SHOOTING_OUTLINE
})
</script>

<template>
  <div class="student-trace-association-card">
    <AvCard border-color="var(--other-border-skill-card)">
      <template #title>
        <div class="title-container">
          <div class="association-title">
            <AvVIcon
              :name="icon"
              color="var(--text2)"
              :size="1.3"
            />
            <span class="b2-regular ellipsis">{{ title }}</span>
          </div>
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

:deep(.av-card__title) {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-color: var(--light-background-neutral) !important;
}
</style>
