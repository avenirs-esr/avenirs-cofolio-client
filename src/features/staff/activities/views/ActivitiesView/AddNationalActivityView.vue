<script setup lang="ts">
import PageTitle from '@/common/components/PageTitle/PageTitle.vue'
import { ROUTES } from '@/common/constants'
import { AvInput, AvCancelConfirmButtons } from '@avenirs-esr/avenirs-dsav'
import { useNavigation } from '@/common/composables'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
// const { navigateToStaffActivityLibrary } = useNavigation()

const TITLE_MAX_LENGTH = 80
const title = ref('')

const isTitleTooLong = computed(() => title.value.length > TITLE_MAX_LENGTH)
const isTitleEmpty = computed(() => title.value.trim().length === 0)
const canSave = computed(() => !isTitleEmpty.value && !isTitleTooLong.value)

const titleErrorMessage = computed(() => {
  if (isTitleTooLong.value) {
    return t('staff.global.views.staffActivitiesAddNationalActivityView.errors.titleTooLong')
  }
  return undefined
})

const breadcrumbLinks = computed(() => [
  { text: t('staff.global.navigation.tabs.home'), to: ROUTES.STAFF.HOME },
  // { text: t('staff.global.navigation.tabs.activityLibrary.header'), to: ROUTES.STAFF.ACTIVITY_LIBRARY },
  { text: t('staff.global.navigation.tabs.activityLibrary.items.addActivity') }
])

function onCancel () {
  // navigateToStaffActivityLibrary()
}

function onSave () {
  // TODO: à brancher sur le futur endpoint de création d'activité nationale
  console.log('save', title.value)
}
</script>

<template>
  <!-- <PageTitle
    :title="t('staff.global.views.addNationalActivityView.title')"
    :breadcrumb-links="breadcrumbLinks"
    :back="ROUTES.STAFF.ACTIVITY_LIBRARY"
  /> -->
</template>
