<script setup lang="ts">
import type { AvSelectModelValue, AvSelectOptionGroup } from '@avenirs-esr/avenirs-dsav'
import { AvSelect, getAvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { Loader } from '@avenirs-esr/shared'
import { useI18n } from 'vue-i18n'
import { EActivityThematic, useGetActivityNavigation } from '@/api/avenir-esr'
import { useNavigation } from '@/common/composables'
import { isEnumMember } from '@/common/utils'

export interface ActivitiesSelectNavigationProps {
  widget: boolean
}

const { widget } = defineProps<ActivitiesSelectNavigationProps>()

const { t } = useI18n()
const route = useRoute()
const { navigateToStudentActivitiesCatalog, navigateToStudentWidgetActivityCatalog } = useNavigation()

const { data: activitiesRef, isLoading, isError } = useGetActivityNavigation()

function getThematicLabel (title: string) {
  return isEnumMember(EActivityThematic, title)
    ? t(`global.activities.badges.thematics.${title}`)
    : title
}

const selectOptions = computed<AvSelectOptionGroup[]>(() => {
  const activities = activitiesRef.value ?? []

  return activities
    .map(activity => ({
      id: activity.title,
      label: getThematicLabel(activity.title),
      children: (activity.items ?? []).map(item => ({
        value: item.id,
        label: item.title,
      })),
    }))
})

const routeId = computed(() => typeof route.params.id === 'string' ? route.params.id : undefined)

const routeThematic = computed(() => typeof route.params.thematic === 'string' ? route.params.thematic : undefined)

const selectedOption = ref<AvSelectModelValue>(null)

watch([routeId, routeThematic, selectOptions], ([id, thematic, options]) => {
  const firstThematic = options[0]
  const firstActivity = firstThematic?.children?.[0]

  const selectedValue = id ?? firstActivity?.value
  const parentId = thematic ?? firstThematic?.id

  selectedOption.value = selectedValue !== undefined
    ? {
        value: selectedValue,
        label: options
          .flatMap(option => option.children ?? [])
          .find(option => option.value === selectedValue)
          ?.label ?? '',
        ...(parentId ? { parentId } : {}),
      }
    : null
}, { immediate: true },)

function onSelectChange (value: AvSelectModelValue) {
  const selectedValue = getAvSelectSelectedOption(value)

  if (!selectedValue) {
    return
  }

  selectedOption.value = selectedValue

  const { parentId, value: activityId } = selectedValue

  if (!parentId || !activityId || !isEnumMember(EActivityThematic, parentId)) {
    return
  }

  if (routeThematic.value === parentId && routeId.value === activityId) {
    return
  }

  const navParams = {
    thematic: parentId,
    id: String(activityId),
    replace: !routeThematic.value || !routeId.value,
  }

  widget
    ? navigateToStudentWidgetActivityCatalog(navParams)
    : navigateToStudentActivitiesCatalog(navParams)
}
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <AvSelect
      data-testid="activities-select-navigation"
      :model-value="selectedOption"
      :options="selectOptions"
      :placeholder="t('student.activities.views.ActivitiesCatalogView.ActivitiesSelectNavigation.placeholder')"
      :label="t('global.navigation.accessTo')"
      required
      width="100%"
      collapse-max-height="35vh"
      @update:model-value="onSelectChange"
    />
  </Loader>
</template>
