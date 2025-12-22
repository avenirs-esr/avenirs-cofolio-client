<script setup lang="ts">
import { AddDeclaredProgramDrawer } from '@/features/student/personalCareer'
import { usePersonalCareerStore } from '@/features/student/personalCareer/stores/personalCareer.store'
import DeclaredProgramsMoreActionsDropdown
  from '@/features/student/personalCareer/views/PersonalCareerView/sections/ProgramsSection/components/DeclaredProgramsMoreActionsDropdown/DeclaredProgramsMoreActionsDropdown.vue'

const { displayAddDeclaredProgramDrawer } = usePersonalCareerStore()
</script>

<template>
  <div class="declared-programs-tab">
    <div class="av-row av-row--right">
      <DeclaredProgramsMoreActionsDropdown @add-selected="displayAddDeclaredProgramDrawer" />
    </div>
    <div class="declared-programs__content">
      Placement for Declared Programs content
    </div>
    <AddDeclaredProgramDrawer />
  </div>
</template>

<style scoped lang="scss">

</style>
