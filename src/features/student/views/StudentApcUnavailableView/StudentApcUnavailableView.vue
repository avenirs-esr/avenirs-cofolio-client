<script setup lang="ts">
import { useStudentApcAccess } from '@/features/student/composables'
import { studentHomeRoute } from '@/features/student/routes'
import { useRouter } from 'vue-router'

const { showApcGenericInfoPage } = useStudentApcAccess()
const router = useRouter()

watchEffect(() => {
  if (!showApcGenericInfoPage.value) {
    router.replace(studentHomeRoute)
  }
})
</script>

<template>
  StudentApcUnavailablePage
</template>

<style scoped lang="scss">

</style>
