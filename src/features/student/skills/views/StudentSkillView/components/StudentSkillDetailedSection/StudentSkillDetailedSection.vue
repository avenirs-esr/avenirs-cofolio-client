<script setup lang="ts">
import Card from '@/common/components/cards/Card/Card.vue'
import { useI18n } from 'vue-i18n'

const { skillName } = defineProps<{ skillName: string }>()

const { t } = useI18n()
</script>

<template>
  <div class="student-skill-detailed-section av-pb-md">
    <Card
      border-color="var(--other-border-skill-card)"
      title-background="var(--surface-background)"
      title-height="4.375rem"
    >
      <template #title>
        <h3>{{ t('student.skills.views.StudentSkillView.detailed.title') }}</h3>
      </template>
      <template #body>
        <h3 class="student-skill-detailed-name av-pt-sm">
          {{ skillName }}
        </h3>
      </template>
    </Card>
  </div>
</template>

<style lang="scss" scoped>
.student-skill-detailed-name {
  color: var(--dark-background-primary1);
}
</style>
