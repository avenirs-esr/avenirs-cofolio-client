<script setup lang="ts">
import type { AdditionalSkillDTO } from '@/api/avenir-esr'
import type {
  UpdateAdditionalSkillForm
} from '@/features/student/additionalSkills/views/StudentUpdateAdditionalSkillView/components/use-update-additional-skill-form/use-update-additional-skill-form'
import type { AdditionalSkillOption } from '@/features/student/skills/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/types'
import type {
  AdditionalSkillForm
} from '@/features/student/skills/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import { highlightCaptionText, highlightTitleText } from '@/common/utils'
import { AdditionalSkillTypeBadge, useSearchAdditionalSkillsQuery } from '@/features/student/additionalSkills'
import { AvAutocomplete, AvListItem, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import isEmpty from 'lodash-es/isEmpty'
import { markRaw, toValue } from 'vue'
import { useI18n } from 'vue-i18n'

interface SearchSkillFieldProps {
  form: AdditionalSkillForm | UpdateAdditionalSkillForm
}

const { form } = defineProps<SearchSkillFieldProps>()
const FormField = markRaw(form.Field)

const { t } = useI18n()

const SEARCH_SKILLS_MIN_LENGTH = 3
const PAGE_SIZE = 10

const searchQuery = ref('')
const pageSize = ref(PAGE_SIZE)

const { skills: apiSkills, hasNextPage, fetchNextPage, isLoading, isFetchingNextPage } = useSearchAdditionalSkillsQuery(
  searchQuery,
  pageSize
)

const skills = computed((): AdditionalSkillOption[] => {
  return apiSkills.value.map((skill: AdditionalSkillDTO): AdditionalSkillOption => ({
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

function getOptionLabel (option: AdditionalSkillOption): string {
  return option.title
}

function getOptionKey (option: AdditionalSkillOption): string {
  return option.id
}

const emptySlotTextContent = computed<string>(() => {
  const keyword = toValue(searchQuery)

  if (keyword.length >= SEARCH_SKILLS_MIN_LENGTH && toValue(skills).length === 0) {
    return t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.noResultsFound')
  }
  if (!isEmpty(keyword) && keyword.length < SEARCH_SKILLS_MIN_LENGTH) {
    return t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.minimumCharacters')
  }

  return t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.startTyping')
})
</script>

<template>
  <div class="search-skill-field">
    <FormField name="selectedSkills">
      <template #default="{ field }">
        <AvAutocomplete
          :model-value="field.state.value"
          :options="skills"
          :loading="isLoading || isFetchingNextPage"
          :input-options="{
            label: t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.searchLabel'),
            placeholder: t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.searchPlaceholder'),
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
          @search="handleSearch"
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
              clickable
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
                class="skill-item"
              >
                <div class="skill-item__content">
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

                <AdditionalSkillTypeBadge
                  :label="t(`student.additionalSkillTypes.${option.type}`)"
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
.search-skill-field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

:deep(.skill-item) {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-md);
  border-radius: var(--radius-md);
}

.skill-item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.caption-light {
  .skill-item__path-segment {
    &:not(:last-child)::after {
      content: ' > ';
      margin: 0 var(--spacing-xxxs);
    }
  }
}
</style>

<style lang="scss">
.highlight {
  color: var(--light-foreground-primary1) !important;
}
</style>
