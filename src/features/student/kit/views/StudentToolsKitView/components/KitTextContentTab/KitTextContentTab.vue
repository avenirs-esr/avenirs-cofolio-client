<script setup lang="ts">
import { EExperienceType } from '@/api/avenir-esr'
import ValorizedDeclaredExperiencesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperiencesContainer/ValorizedDeclaredExperiencesContainer.vue'
import ValorizedDeclaredProgramsContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramsContainer/ValorizedDeclaredProgramsContainer.vue'
import ValorizedDeclaredSkillsContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillsContainer/ValorizedDeclaredSkillsContainer.vue'
</script>

<template>
  <div class="av-col av-gap-md">
    <ValorizedDeclaredSkillsContainer />
    <ValorizedDeclaredExperiencesContainer :experience-type="EExperienceType.PROFESSIONAL" />
    <ValorizedDeclaredExperiencesContainer :experience-type="EExperienceType.PERSONAL" />
    <ValorizedDeclaredProgramsContainer />
  </div>
</template>
