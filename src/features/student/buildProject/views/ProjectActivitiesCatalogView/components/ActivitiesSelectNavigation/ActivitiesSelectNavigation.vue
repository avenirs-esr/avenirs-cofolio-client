<script setup lang="ts">
import { EActivityThematic, useGetActivityNavigation } from '@/api/avenir-esr'
import Loader from '@/common/components/Loader/Loader.vue'
import { useNavigation } from '@/common/composables'
import { isEnumMember } from '@/common/utils'
import { AvSelect, type AvSelectOption, type AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const { navigateToStudentProjectActivitiesCatalog } = useNavigation()

const { data: activitiesRef, isLoading, isError } = useGetActivityNavigation()

function getThematicLabel (title: string) {
  return isEnumMember(EActivityThematic, title) ? t(`global.activities.badges.thematics.${title}`) : title
}

const selectOptions = computed<AvSelectOption[]>(() => {
  const activities = activitiesRef.value ?? []

  return activities
    .map(activity => ({
      id: activity.title,
      label: getThematicLabel(activity.title),
      children: (activity.items ?? []).map(item => ({
        id: item.id,
        label: item.title,
      })),
    }))
})

const routeId = computed(() => typeof route.params.id === 'string' ? route.params.id : undefined)

const routeThematic = computed(() => typeof route.params.thematic === 'string' ? route.params.thematic : undefined)

const selectedItem = ref<AvSelectSelectedOption>({
  itemId: routeId.value ?? selectOptions.value?.[0]?.children?.[0]?.id ?? '',
  parentId: routeThematic.value ?? selectOptions.value?.[0]?.id ?? undefined,
})

watch([routeId, routeThematic, selectOptions], ([id, thematic, options]) => {
  selectedItem.value = {
    itemId: id ?? options?.[0]?.children?.[0]?.id ?? '',
    parentId: thematic ?? options?.[0]?.id ?? undefined,
  }
}, { immediate: true })

function onSelectChange (value: AvSelectSelectedOption) {
  selectedItem.value = value

  const { parentId, itemId } = value

  if (!parentId || !itemId || !isEnumMember(EActivityThematic, parentId)) {
    return
  }

  if (routeThematic.value === parentId && routeId.value === itemId) {
    return
  }

  navigateToStudentProjectActivitiesCatalog({
    thematic: parentId,
    id: itemId,
    replace: !routeThematic.value || !routeId.value,
  })
}
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <AvSelect
      data-testid="activities-select-navigation"
      :selected-item="selectedItem"
      :options="selectOptions"
      :placeholder="t('student.buildProject.views.projectActivitiesView.title')"
      :label="t('student.global.navigation.selects.label')"
      @update:selected-item="onSelectChange"
    />
  </Loader>
</template>
