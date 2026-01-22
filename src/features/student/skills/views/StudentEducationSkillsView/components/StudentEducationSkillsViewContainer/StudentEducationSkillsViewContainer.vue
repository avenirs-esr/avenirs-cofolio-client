<script setup lang="ts">
import type { StudentProgressViewDTO } from '@/api/avenir-esr'
import StudentDetailedEducationalSkillCard from '@/features/student/skills/components/cards/StudentDetailedEducationalSkillCard/StudentDetailedEducationalSkillCard.vue'

const { course } = defineProps<{ course: StudentProgressViewDTO }>()
</script>

<template>
  <div class="av-col av-gap-md">
    <span class="n5 av-text-text1">
      {{ course.name }}
    </span>
    <div class="av-col av-gap-lg">
      <StudentDetailedEducationalSkillCard
        v-for="(skill, index) in course.skills"
        :key="skill.id"
        :skill="skill"
        :skill-color="`var(--skill${index + 1})`"
      />
    </div>
  </div>
</template>
