<script setup lang="ts">
import type { StudentProgressOverviewDTO } from '@/api/avenir-esr'
import StudentSkillCard from '@/features/student/skills/components/cards/StudentSkillCard/StudentSkillCard.vue'

const { course, maxSkillsDisplayed = 6 } = defineProps<{ course: StudentProgressOverviewDTO, maxSkillsDisplayed: number }>()

const skills = computed(() => course.skills.slice().slice(0, maxSkillsDisplayed))
</script>

<template>
  <div class="av-col av-gap-sm av-px-sm">
    <div class="ellipsis-container">
      <span
        class="s1-regular ellipsis"
        :title="course.programTitle"
      >
        {{ course.programTitle }}
      </span>
    </div>
    <div class="av-row av-wrap av-gap-md">
      <StudentSkillCard
        v-for="(skill, index) in skills"
        :key="skill.id"
        :skill="skill"
        :skill-color="`--skill${index + 1}`"
      />
    </div>
  </div>
</template>
