<script setup lang="ts">
import ValorizedDeclaredExperiencesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperiencesContainer/ValorizedDeclaredExperiencesContainer.vue'
import ValorizedDeclaredProgramsContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramsContainer/ValorizedDeclaredProgramsContainer.vue'
import ValorizedDeclaredSkillsContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillsContainer/ValorizedDeclaredSkillsContainer.vue'
</script>

<template>
  <div class="av-col av-gap-md">
    <ValorizedDeclaredSkillsContainer />
    <ValorizedDeclaredExperiencesContainer />
    <ValorizedDeclaredProgramsContainer />
  </div>
</template>
