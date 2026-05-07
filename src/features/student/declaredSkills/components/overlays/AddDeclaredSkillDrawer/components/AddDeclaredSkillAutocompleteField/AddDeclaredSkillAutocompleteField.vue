<script setup lang="ts">
import type { DeclaredSkillOption } from '@/features/student/declaredSkills/components/overlays/AddDeclaredSkillDrawer/types'
import type {
  DeclaredSkillForm,
  UpdateDeclaredSkillForm
} from '@/features/student/declaredSkills/types/forms.types'
import { type ExternalSkillDTO, type PagedResponseExternalSkillDTO, useSearchExternalSkillsInfinite } from '@/api/avenir-esr'
import { highlightCaptionText, highlightTitleText } from '@/common/utils'
import DeclaredSkillTypeBadge from '@/features/student/declaredSkills/components/badges/DeclaredSkillTypeBadge/DeclaredSkillTypeBadge.vue'
import { AvAutocomplete, AvListItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import isEmpty from 'lodash-es/isEmpty'
import { markRaw, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

interface SearchSkillFieldProps {
  form: DeclaredSkillForm | UpdateDeclaredSkillForm
}

const { form } = defineProps<SearchSkillFieldProps>()
const FormField = markRaw(form.Field)

const { t } = useI18n()

const SEARCH_SKILLS_MIN_LENGTH = 3
const PAGE_SIZE = 10

const searchQuery = ref('')
const pageSize = ref(PAGE_SIZE)

const params = computed(() => ({
  keyword: searchQuery.value,
  pageSize: pageSize.value
}))

const {
  data,
  hasNextPage,
  fetchNextPage,
  isLoading,
  isFetchingNextPage
} = useSearchExternalSkillsInfinite(params, {
  query: {
    enabled: computed(() => searchQuery.value.length >= SEARCH_SKILLS_MIN_LENGTH),
    getNextPageParam: (lastPage: PagedResponseExternalSkillDTO) => {
      const { page, totalPages } = lastPage.page
      return page + 1 < totalPages ? page + 1 : undefined
    }
  }
})

const apiSkills = computed<ExternalSkillDTO[]>(() => {
  return data.value ? data.value.pages.flatMap(page => page.data) : []
})

const skills = computed((): DeclaredSkillOption[] => {
  return apiSkills.value.map((skill: ExternalSkillDTO): DeclaredSkillOption => ({
    label: skill.title,
    value: skill.id,
    ...skill
  }))
})

function handleSearch (query: string) {
  searchQuery.value = query
}

function handleClear () {
  searchQuery.value = ''
}

function handleLoadMore () {
  if (hasNextPage.value && !isFetchingNextPage.value) {
    fetchNextPage()
  }
}

function getOptionLabel (option: DeclaredSkillOption): string {
  return option.title
}

function getOptionKey (option: DeclaredSkillOption): string {
  return option.id
}

const emptySlotTextContent = computed<string>(() => {
  const keyword = toValue(searchQuery)

  if (keyword.length >= SEARCH_SKILLS_MIN_LENGTH && toValue(skills).length === 0) {
    return t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.autocompleteField.noResultsFound')
  }
  if (!isEmpty(keyword) && keyword.length < SEARCH_SKILLS_MIN_LENGTH) {
    return t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.autocompleteField.minimumCharacters')
  }

  return t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.autocompleteField.startTyping')
})
</script>

<template>
  <div
    class="av-col av-gap-sm"
    data-testid="search-skill-field"
  >
    <FormField name="selectedSkills">
      <template #default="{ field }">
        <AvAutocomplete
          :model-value="field.state.value"
          :options="skills"
          :loading="isLoading || isFetchingNextPage"
          :input-options="{
            label: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.autocompleteField.searchLabel'),
            placeholder: t('student.declaredSkills.overlays.AddDeclaredSkillDrawer.autocompleteField.searchPlaceholder'),
            errorMessage: field.state.meta.errors?.join(', '),
          }"
          :get-option-label="getOptionLabel"
          :get-option-key="getOptionKey"
          :multi-select="false"
          :server-side-filtering="true"
          :enable-load-more="true"
          max-dropdown-height="14.5rem"
          :debounce-delay="500"
          @update:model-value="field.handleChange"
          @update:search="handleSearch"
          @clear="handleClear"
          @load-more="handleLoadMore"
        >
          <template #empty>
            <div v-memo="[searchQuery, skills]">
              <span
                class="b2-regular"
              >
                {{ emptySlotTextContent }}
              </span>
            </div>
          </template>
          <template #item="{ option, isSelected, toggle }">
            <AvListItem
              v-memo="[option, isSelected, toggle, searchQuery]"
              hover-background-color="var(--light-background-neutral)"
              :selected="isSelected"
              :icon="MDI_ICONS.STARS"
              :icon-size="2"
              icon-color="var(--icon)"
              color-on-hover="var(--text1)"
              @click="toggle"
            >
              <div
                v-memo="[option, isSelected]"
                class="skill-item av-row av-align-center av-justify-between av-gap-md"
                data-testid="skill-item"
              >
                <div
                  class="av-col av-flex-fill"
                  data-testid="skill-item__content"
                >
                  <div
                    class="b1-bold"
                    v-html="highlightTitleText(option.title, searchQuery)"
                  />

                  <div class="caption-light">
                    <span
                      v-for="(segment, index) in option.pathSegments"
                      :key="index"
                      class="skill-item__path-segment"
                      v-html="highlightCaptionText(segment, searchQuery)"
                    />
                  </div>
                </div>

                <DeclaredSkillTypeBadge
                  :label="t(`student.declaredSkills.declaredSkillTypes.${option.type}`)"
                />
              </div>
            </AvListItem>
          </template>
        </AvAutocomplete>
      </template>
    </FormField>
  </div>
</template>

<style scoped lang="scss">
.caption-light {
  .skill-item__path-segment {
    &:not(:last-child)::after {
      content: ' > ';
      margin: 0 var(--spacing-xxxs);
    }
  }
}
</style>
