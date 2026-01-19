<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { useDeclaredProgramDetailedQuery } from '@/features/student/personalCareer/queries/use-declared-programs.query'
import DeclaredProgramDetailed
  from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import { useI18n } from 'vue-i18n'

interface DeclaredProgramDetailedViewProps {
  declaredProgramId: string
}
const { declaredProgramId } = defineProps<DeclaredProgramDetailedViewProps>()

const { t } = useI18n()
const { declaredProgramDetailed } = useDeclaredProgramDetailedQuery(declaredProgramId)

const programTitle = computed(() => declaredProgramDetailed.value?.title)
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.experiences') }
])
</script>

<template>
  <PageTitle
    :title="t('student.personalCareer.views.DeclaredProgramDetailedView.title', { programTitle })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.PROJECT_SKILLS"
  />
  <DeclaredProgramDetailed
    v-if="declaredProgramDetailed"
    :declared-program-detailed="declaredProgramDetailed"
  />
</template>

<style scoped lang="scss">

</style>
