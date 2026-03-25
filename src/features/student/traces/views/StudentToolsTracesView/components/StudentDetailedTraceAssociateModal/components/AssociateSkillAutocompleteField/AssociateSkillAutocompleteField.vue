<script setup lang="ts">
import type { ETraceAssociationType } from '@/api/avenir-esr'
import type {
  AssociateTraceForm,
  TraceAssociationOption
} from '@/features/student/traces/views/StudentToolsTracesView/components/StudentDetailedTraceAssociateModal/components/use-associate-trace-form/use-associate-trace-form'
import { highlightCaptionText, highlightTitleText } from '@/common/utils'
import { useTracesAssociationQuery } from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { AvAutocomplete, AvListItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import isEmpty from 'lodash-es/isEmpty'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

interface SearchTraceAssociationFieldProps {
  associationType: ETraceAssociationType
  form: AssociateTraceForm
}

const props = defineProps<SearchTraceAssociationFieldProps>()
const associationType = props.associationType
const form = props.form

const PAGE_SIZE = 10
const SEARCH_MIN_LENGTH = 3

const { t } = useI18n()

const searchQuery = ref('')
const page = ref(0)
const pageSize = ref(PAGE_SIZE)

const { associations, isLoading, isFetching, hasNextPage, fetchNextPage, refetch }
  = useTracesAssociationQuery(
    computed(() => toValue(associationType)),
    searchQuery,
    pageSize
  )

const items = associations

function handleSearch (query: string) {
  searchQuery.value = query
  page.value = 0
  refetch()
}

function handleClear () {
  searchQuery.value = ''
  page.value = 0
}

function handleLoadMore () {
  if (hasNextPage.value && !isFetching.value) {
    fetchNextPage()
  }
}

const options = computed(() =>
  (items.value ?? []).map(item => ({
    id: item.id ?? '',
    label: item.title,
    value: item.id ?? item.title,
    title: item.title,
    type: item.type as ETraceAssociationType,
    description: item.description ?? '',
  }))
)

const displayedOptions = computed(() => {
  if (searchQuery.value.trim().length < SEARCH_MIN_LENGTH) {
    return []
  }
  return options.value
})

function getOptionLabel (option: TraceAssociationOption): string {
  return option.title
}

function getOptionKey (option: TraceAssociationOption): string {
  return option.id || option.title
}

const emptySlotTextContent = computed<string>(() => {
  const keyword = toValue(searchQuery)

  if (keyword.length >= SEARCH_MIN_LENGTH && toValue(options).length === 0) {
    return t('student.traces.views.StudentToolsTracesView.studentDetailedTraceAssociateModal.errors.noResultsFound')
  }
  if (!isEmpty(keyword) && keyword.length < SEARCH_MIN_LENGTH) {
    return t('student.traces.views.StudentToolsTracesView.studentDetailedTraceAssociateModal.minimumCharacters', { count: SEARCH_MIN_LENGTH })
  }
  return t('student.traces.views.StudentToolsTracesView.studentDetailedTraceAssociateModal.startTyping')
})

function getSelectedItemsCount (value: unknown): number {
  return Array.isArray(value) ? value.length : 0
}
</script>

<template>
  <div class="search-trace-association-field av-col av-gap-sm">
    <component
      :is="form.Field"
      v-slot="slot"
      name="selectedAssociation"
    >
      <AvAutocomplete
        dropdown-class="associate-dropdown"
        dropdown-width="100%"
        :model-value="Array.isArray(slot.field.state.value) ? slot.field.state.value : []"
        :options="displayedOptions"
        :loading="isLoading || isFetching"
        :input-options="{
          label: t('student.traces.views.StudentToolsTracesView.studentDetailedTraceAssociateModal.searchLabel'),
          placeholder: t('student.traces.views.StudentToolsTracesView.studentDetailedTraceAssociateModal.searchPlaceholder'),
          errorMessage: slot.field.state.meta.errors?.join(', '),
        }"
        :get-option-label="getOptionLabel"
        :get-option-key="getOptionKey"
        :multi-select="true"
        :show-selected-section="true"
        :selected-items-count-label="t('global.AvAutoComplete.elementsSelectedLabel', { count: getSelectedItemsCount(slot.field.state.value) })"
        :server-side-filtering="true"
        :enable-load-more="true"
        max-dropdown-height="14.5rem"
        :debounce-delay="500"
        @search="handleSearch"
        @update:model-value="(v) => slot.field.handleChange(v as TraceAssociationOption[])"
        @clear="handleClear"
        @load-more="handleLoadMore"
      >
        <template #empty>
          <div v-memo="[searchQuery, options]">
            <span class="b2-regular">
              {{ emptySlotTextContent }}
            </span>
          </div>
        </template>

        <template #item="{ option, isSelected, toggle }">
          <AvListItem
            v-memo="[option, isSelected, toggle, searchQuery]"
            hover-background-color="var(--light-background-neutral)"
            :selected="isSelected"
            :icon="MDI_ICONS.STAR_SHOOTING_OUTLINE"
            :icon-size="2"
            icon-color="var(--icon)"
            color-on-hover="var(--text1)"
            @click="toggle"
          >
            <div
              v-memo="[option, isSelected]"
              class="trace-item av-row av-align-center av-justify-between av-gap-md av-radius-md"
            >
              <div class="av-col av-flex-fill">
                <div
                  class="b1-bold"
                  v-html="highlightTitleText(option.title, searchQuery)"
                />
                <div
                  v-if="option.description?.length"
                  class="caption-light"
                >
                  <span
                    class="trace-item__path-segment"
                    v-html="highlightCaptionText(option.description, searchQuery)"
                  />
                </div>
              </div>
            </div>
          </AvListItem>
        </template>
      </AvAutocomplete>
    </component>
  </div>
</template>

<style scoped lang="scss">
.search-trace-association-field {
  position: relative;
}

:deep(.associate-dropdown) {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10000;
}

.caption-light {
  .trace-item__path-segment {
    &:not(:last-child)::after {
      content: ' > ';
      margin: 0 var(--spacing-xxxs);
    }
  }
}

:deep(.highlight) {
  color: var(--light-foreground-primary1) !important;
}
</style>
