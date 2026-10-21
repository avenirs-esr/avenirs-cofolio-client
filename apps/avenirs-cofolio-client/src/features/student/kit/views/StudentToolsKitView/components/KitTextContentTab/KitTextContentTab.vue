<script setup lang="ts">
import ValorizedActivitiesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedActivitiesContainer/ValorizedActivitiesContainer.vue'
import ValorizedDeclaredExperiencesContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredExperiencesContainer/ValorizedDeclaredExperiencesContainer.vue'
import ValorizedDeclaredProgramsContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramsContainer/ValorizedDeclaredProgramsContainer.vue'
import ValorizedDeclaredSkillsContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredSkillsContainer/ValorizedDeclaredSkillsContainer.vue'
import ValorizedSelfKnowledgeContainer from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedSelfKnowledgeContainer/ValorizedSelfKnowledgeContainer.vue'
</script>

<template>
  <div class="av-col av-gap-md">
    <ValorizedDeclaredSkillsContainer />
    <ValorizedDeclaredExperiencesContainer :professional-experience="true" />
    <ValorizedDeclaredExperiencesContainer :professional-experience="false" />
    <ValorizedActivitiesContainer />
    <ValorizedDeclaredProgramsContainer />
    <ValorizedSelfKnowledgeContainer interests-only />
    <ValorizedSelfKnowledgeContainer />
  </div>
</template>
