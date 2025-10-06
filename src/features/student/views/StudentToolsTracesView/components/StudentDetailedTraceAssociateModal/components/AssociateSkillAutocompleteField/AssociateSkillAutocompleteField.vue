<script setup lang="ts">
import type { ETraceAssociationType, PagedResponseTraceAssociationSearchResult, TraceAssociationSearchResult } from '@/api/avenir-esr'
import type { BaseApiException } from '@/common/exceptions'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav/dist/components/interaction/selects/AvAutocomplete/AvAutocomplete.types'
import type { UseQueryReturnType } from '@tanstack/vue-query'
import { useTracesAssociationQuery } from '@/features/student/queries'
import { AvAutocomplete, AvListItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import isEmpty from 'lodash-es/isEmpty'
import { toValue } from 'vue'
import { useI18n } from 'vue-i18n'

interface SearchTraceAssociationFieldProps {
  associationType: ETraceAssociationType
  fieldName?: string
  pageSize?: number
  minLength?: number
  form: any
}

const props = withDefaults(defineProps<SearchTraceAssociationFieldProps>(), {
  fieldName: 'selectedTraceAssociation',
  pageSize: 10,
  minLength: 3,
})

const form = props.form
const { t } = useI18n()

const SEARCH_MIN_LENGTH = props.minLength
const PAGE_SIZE = props.pageSize

const searchQuery = ref('')
const page = ref(0)
const pageSize = ref(PAGE_SIZE)

const params = computed(() => ({
  keyword: searchQuery.value,
  page: page.value,
  pageSize: pageSize.value,
}))

const { data, isLoading, isFetching, refetch } = useTracesAssociationQuery(
  computed(() => toValue(props.associationType)),
  params,
) as UseQueryReturnType<PagedResponseTraceAssociationSearchResult, BaseApiException>

const items = computed(() => data.value?.data ?? [])
const totalPages = computed(() => data.value?.page?.totalPages ?? 0)
const hasNextPage = computed(() => (page.value + 1) < totalPages.value)

function handleSearch (query: string) {
  searchQuery.value = query
  page.value = 0
  refetch()
}

function handleClear () {
  searchQuery.value = ''
  page.value = 0
  // refetch()
}

function handleLoadMore () {
  if (hasNextPage.value && !isFetching.value) {
    page.value = page.value + 1
    // refetch()
  }
}

export interface TraceAssociationOption extends AvAutocompleteOption {
  type: ETraceAssociationType
  title: string
  description?: string | undefined
}

const options = computed<TraceAssociationOption[]>(() => {
  return (items.value as TraceAssociationSearchResult[]).map(item => ({
    label: item.title,
    value: item.id ?? item.title,
    ...item,
  }))
})

const displayedOptions = computed(() => {
  const q = searchQuery.value.trim()
  if (q.length === 0) {
    return []
  }
  if (q.length < SEARCH_MIN_LENGTH) {
    return []
  }
  return options.value
})

function getOptionLabel (option: TraceAssociationSearchResult): string {
  return option.title
}

function getOptionKey (option: TraceAssociationSearchResult): string {
  return option.id || option.title
}

const emptySlotTextContent = computed<string>(() => {
  const keyword = toValue(searchQuery)

  if (keyword.length >= SEARCH_MIN_LENGTH && toValue(options).length === 0) {
    return t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.errors.noResultsFound')
  }
  if (!isEmpty(keyword) && keyword.length < SEARCH_MIN_LENGTH) {
    return t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.errors.minimumCharacters')
  }
  return t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.startTyping')
})

function highlightMatchedText (text: string, query: string, className: string): string {
  if (!query || query.trim().length === 0) {
    return text
  }
  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, `<span class="${className} highlight">$1</span>`)
}

function highlightTitleText (text: string, query: string): string {
  return highlightMatchedText(text, query, 'b1-bold')
}

function highlightCaptionText (text: string, query: string): string {
  return highlightMatchedText(text, query, 'caption-light')
}
</script>

<template>
  <div class="search-trace-association-field">
    <form.Field :name="props.fieldName">
      <template #default="{ field }">
        <AvAutocomplete
          dropdown-class="associate-dropdown"
          dropdown-width="100%"
          :model-value="Array.isArray(field.state.value) ? field.state.value : []"
          :options="displayedOptions"
          :loading="isLoading || isFetching"
          :input-options="{
            label: t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.searchLabel'),
            placeholder: t('student.views.studentToolsTracesView.studentDetailedTraceAssociateModal.searchPlaceholder'),
            errorMessage: field.state.meta.errors?.join(', '),
          }"
          :get-option-label="getOptionLabel"
          :get-option-key="getOptionKey"
          :multi-select="true"
          :server-side-filtering="true"
          :enable-load-more="true"
          max-dropdown-height="14.5rem"
          :debounce-delay="500"
          @update:model-value="field.handleChange"
          @search="handleSearch"
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
              clickable
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
                class="trace-item"
              >
                <div class="trace-item__content">
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
      </template>
    </form.Field>
  </div>
</template>

<style scoped lang="scss">
.search-trace-association-field { position: relative; }

:deep(.associate-dropdown) {
  position: absolute;
  left: 0;
  right: 0;
  z-index: 10000;
}
.search-trace-association-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

:deep(.trace-item) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  border-radius: var(--radius-md);
}

.trace-item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
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
