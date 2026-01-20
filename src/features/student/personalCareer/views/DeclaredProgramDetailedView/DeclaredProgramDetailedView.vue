<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import DeclaredProgramSideMenu
  from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import {
  usePaginatedDeclaredPrograms
} from '@/features/student/personalCareer/composables/use-paginated-declared-programs/use-paginated-declared-programs'
import {
  useDeclaredProgramDetailedQuery
} from '@/features/student/personalCareer/queries/use-declared-programs.query'

import DeclaredProgramDetailed
  from '@/features/student/personalCareer/views/DeclaredProgramDetailedView/components/DeclaredProgramDetailed/DeclaredProgramDetailed.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const selectedProgramId = computed(() => String(route.params.id ?? ''))

const { declaredPrograms, pageInfo, loadMoreDeclaredPrograms } = usePaginatedDeclaredPrograms({ pageSize: 3 })
const { declaredProgramDetailed } = useDeclaredProgramDetailedQuery(selectedProgramId)

const programTitle = computed(() => declaredProgramDetailed.value?.title)
const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.experiences') }
])

function onSelectProgram (programId: string) {
  router.push({ name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name, params: { id: programId } })
}
</script>

<template>
  <PageTitle
    :title="t('student.personalCareer.views.DeclaredProgramDetailedView.title', { programTitle })"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.PROJECT_SKILLS"
  />
  <div class="av-row av-gap-sm">
    <DeclaredProgramSideMenu
      :selected-program-id="selectedProgramId"
      :programs="declaredPrograms"
      :count-programs="pageInfo.totalElements"
      @select-program="onSelectProgram"
      @load-more-programs="loadMoreDeclaredPrograms"
    />
    <DeclaredProgramDetailed
      v-if="declaredProgramDetailed"
      :key="declaredProgramDetailed.id"
      :declared-program-detailed="declaredProgramDetailed"
    />
  </div>
</template>
