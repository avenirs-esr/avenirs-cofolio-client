<script setup lang="ts">
import { EActivityThematic } from '@/api/avenir-esr'
import Loader from '@/common/components/Loader/Loader.vue'
import { useNavigation } from '@/common/composables'
import { useActivitiesNavigationQuery } from '@/features/student/buildProject/queries/use-activities.query/use-activities.query'
import { AvSelect, type AvSelectOption, type AvSelectSelectedOption } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

defineOptions({
  inheritAttrs: false,
})

const { t } = useI18n()
const route = useRoute()
const { navigateToStudentProjectActivitiesCatalog } = useNavigation()

const { activities: activitiesRef, isLoading, isError } = useActivitiesNavigationQuery()

function isEActivityThematic (value: string): value is EActivityThematic {
  return Object.values(EActivityThematic).includes(value as EActivityThematic)
}

function getThematicLabel (title: string) {
  return isEActivityThematic(title) ? t(`student.buildProject.activities.thematics.${title}`) : title
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

const routeId = computed(() =>
  typeof route.params.id === 'string'
    ? route.params.id
    : Array.isArray(route.params.id)
      ? route.params.id[0]
      : undefined
)

const routeThematic = computed(() =>
  typeof route.params.thematic === 'string'
    ? route.params.thematic
    : Array.isArray(route.params.thematic)
      ? route.params.thematic[0]
      : undefined
)

const selectedItem = ref<AvSelectSelectedOption>({
  itemId: routeId.value ?? selectOptions.value?.[0]?.children?.[0]?.id ?? '',
  parentId: routeThematic.value ?? selectOptions.value?.[0]?.id ?? undefined,
})

function onSelectChange (value: AvSelectSelectedOption) {
  selectedItem.value = value

  const { parentId, itemId } = value

  if (!parentId || !itemId || !isEActivityThematic(parentId)) {
    return
  }

  navigateToStudentProjectActivitiesCatalog({ theme: parentId, id: itemId })
}
</script>

<template>
  <Loader
    :is-loading="isLoading && !isError"
    size="2xl"
  >
    <AvSelect
      v-bind="$attrs"
      data-testid="activities-select-navigation"
      :selected-item="selectedItem"
      :options="selectOptions"
      :placeholder="t('student.buildProject.views.projectActivitiesView.title')"
      :label="t('student.global.navigation.selects.label')"
      @update:selected-item="onSelectChange"
    />
  </Loader>
</template>
