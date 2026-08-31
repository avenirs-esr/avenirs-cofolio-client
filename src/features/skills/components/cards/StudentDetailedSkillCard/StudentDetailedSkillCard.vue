<script lang="ts" setup>
import FloatingIconCard from '@/features/global/components/cards/FloatingIconCard/FloatingIconCard.vue'

export interface StudentDetailedSkillCardProps {
  id: string
  name: string
  skillColor: string
  icon: string
  color: string
  to: string
}

const { id, icon, color, name, skillColor, to } = defineProps<StudentDetailedSkillCardProps>()

const iconOptions = {
  name: icon,
  color,
  bottom: 'calc(-1 * var(--spacing-lg))',
  right: '0.75rem',
  borderColor: 'var(--other-background-base)',
}
</script>

<template>
  <RouterLink
    class="student-detailed-skill-card"
    :to="{ name: to, params: { id } }"
    data-testid="student-detailed-skill-card"
  >
    <FloatingIconCard
      :title="name"
      :icon-options="iconOptions"
      :color="skillColor"
      border-color="var(--other-border-skill-card)"
      :border-color-on-hover="skillColor"
      :header-rows="1"
      title-typography-classes="n5"
      height="fit-content"
    >
      <template #body>
        <slot />
      </template>
    </FloatingIconCard>
  </RouterLink>
</template>

<style lang="scss" scoped>
.student-detailed-skill-card {
  width: 100%;

  :deep(.floating-icon-card) {
    flex: 1;
  }

  :deep(.n5) {
    color: v-bind('color');
  }
}
</style>
