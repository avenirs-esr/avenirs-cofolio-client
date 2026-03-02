<script lang="ts" setup>
import { EActivityThematic } from '@/api/avenir-esr'
import Loader from '@/common/components/Loader/Loader.vue'
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { useNavigation } from '@/common/composables'
import { ROUTES } from '@/common/constants'
import { isEnumMember } from '@/common/utils'
import ActivityErrorMessage from '@/features/student/buildProject/components/feedback/ActivityErrorMessage/ActivityErrorMessage.vue'
import { useActivitiesNavigationQuery, useActivityDetailQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import ActivitiesPreviousNextNavigation from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesPreviousNextNavigation/ActivitiesPreviousNextNavigation.vue'
import ActivitiesSelectNavigation
  from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSelectNavigation/ActivitiesSelectNavigation.vue'
import ActivitiesSideNavigation
  from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivitiesSideNavigation/ActivitiesSideNavigation.vue'
import ActivityPreview from '@/features/student/buildProject/views/ProjectActivitiesCatalogView/components/ActivityPreview/ActivityPreview.vue'
import { useAvBreakpoints } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface ProjectActivitiesCatalogViewProps {
  thematic?: string
  id?: string
}

const props = defineProps<ProjectActivitiesCatalogViewProps>()

const { t } = useI18n()
const { isMobile } = useAvBreakpoints()
const { navigateToStudentProjectActivitiesCatalog } = useNavigation()

const { activityDetail, isLoading, isError, error } = useActivityDetailQuery(computed(() => props.id ?? ''))
const { activities, isLoading: isNavigationLoading, isError: isNavigationError } = useActivitiesNavigationQuery()

const firstCatalogEntry = computed(() => {
  const firstThematic = activities.value?.[0]?.title
  const firstItemId = activities.value?.[0]?.items?.[0]?.id

  if (!firstThematic || !firstItemId || !isEnumMember(EActivityThematic, firstThematic)) {
    return undefined
  }

  return {
    thematic: firstThematic,
    id: firstItemId,
  }
})

watchEffect(() => {
  const thematic = props.thematic
  const id = props.id
  const loading = isNavigationLoading.value
  const hasError = isNavigationError.value
  const firstEntry = firstCatalogEntry.value

  if ((thematic && id) || loading || hasError || !firstEntry) {
    return
  }

  void navigateToStudentProjectActivitiesCatalog({
    thematic: firstEntry.thematic,
    id: firstEntry.id,
    replace: true,
  })
})

const breadcrumbLinks = computed(() => [
  { text: t('student.global.navigation.tabs.home'), to: ROUTES.STUDENT.HOME },
  { text: t('student.global.navigation.tabs.project.header') },
  { text: t('student.global.navigation.tabs.project.items.activities') }
])
</script>

<template>
  <PageTitle
    :title="t('student.buildProject.activities.views.ProjectActivitiesCatalogView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STUDENT.HOME"
  />
  <div
    class="av-py-md av-gap-sm"
    :class="[isMobile ? 'av-col' : 'av-row']"
    data-testid="activities-layout"
  >
    <div
      v-if="isMobile"
      class="av-row av-flex-fill av-justify-center"
    >
      <ActivitiesSelectNavigation />
    </div>
    <ActivitiesSideNavigation v-else />

    <div class="av-col av-gap-sm">
      <ActivitiesPreviousNextNavigation />
      <div class="av-row av-flex-fill av-justify-center">
        <Loader
          :is-loading="isLoading && !isError"
          size="2xl"
        >
          <ActivityPreview
            v-if="activityDetail"
            :activity="activityDetail"
          />
        </Loader>
      </div>
    </div>
  </div>
  <ActivityErrorMessage :error="error" />
</template>
