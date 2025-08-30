<script setup lang="ts">
import type { AdditionalSkillOption } from './types'
import { AdditionalSkillProgressDTOLevel } from '@/api/avenir-esr'
import AdditionalSkillTypeBadge from '@/features/student/components/badges/AdditionalSkillTypeBadge/AdditionalSkillTypeBadge.vue'
import { useAdditionalSkillForm } from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/use-additional-skill-form/use-additional-skill-form'
import { useSkillsStore, useToasterStore } from '@/store'
import { AvAutocomplete, AvButton, AvDrawer, AvListItem, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const skillsStore = useSkillsStore()
const { addSuccessMessage } = useToasterStore()

const showDrawer = toRef(skillsStore, 'showCreateAdditionalSkillDrawer')

function onSkillAdded () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.success')
  })
  handleCancel()
}

const { form, isFormValid } = useAdditionalSkillForm(onSkillAdded)

const searchQuery = ref('')

const mockSkills = ref<AdditionalSkillOption[]>([
  {
    id: '1',
    label: 'Accueillir des enfants',
    value: '1',
    title: 'Accueillir des enfants',
    pathSegments: ['Relation client', 'accueillir, renseigner', 'accueillir, orienter, informer une personne'],
    type: 'ROME 4.0',
    level: AdditionalSkillProgressDTOLevel.BEGINNER
  },
  {
    id: '2',
    label: 'Gérer la relation client',
    value: '2',
    title: 'Gérer la relation client',
    pathSegments: ['Relation client', 'gestion client', 'gérer les réclamations'],
    type: 'ROME 4.0',
    level: AdditionalSkillProgressDTOLevel.INTERMEDIATE
  },
  {
    id: '3',
    label: 'Animation pédagogique',
    value: '3',
    title: 'Animation pédagogique',
    pathSegments: ['Éducation', 'animation', 'animer des groupes d\'enfants'],
    type: 'ROME 4.0',
    level: AdditionalSkillProgressDTOLevel.BEGINNER
  }
])

const filteredSkills = computed(() => {
  if (!searchQuery.value || searchQuery.value.trim().length === 0) {
    return mockSkills.value
  }

  const query = searchQuery.value.toLowerCase().trim()

  return mockSkills.value.filter(skill =>
    skill.title.toLowerCase().includes(query)
    || skill.pathSegments.some(segment =>
      segment.toLowerCase().includes(query)
    )
  )
})

function handleSearch (query: string) {
  searchQuery.value = query
}

function handleCancel () {
  form.reset()
  searchQuery.value = ''
  skillsStore.hideCreateAdditionalSkillDrawer()
}

function getOptionLabel (option: AdditionalSkillOption): string {
  return option.title
}

function getOptionKey (option: AdditionalSkillOption): string {
  return option.id
}

function highlightMatchedText (text: string, query: string): string {
  if (!query || query.trim().length === 0) {
    return text
  }

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escapedQuery})`, 'gi')
  return text.replace(regex, '<span class="highlight">$1</span>')
}
</script>

<template>
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="50rem"
    @escape-pressed="handleCancel"
  >
    <div class="add-additional-skill-drawer">
      <div class="add-additional-skill-drawer__header">
        <div class="add-additional-skill-drawer__icon">
          <VIcon
            :name="MDI_ICONS.PENCIL_OUTLINE"
            size="1.5rem"
            color="var(--text2)"
          />
        </div>
        <h2 class="add-additional-skill-drawer__title">
          {{ t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.title') }}
        </h2>
      </div>

      <div class="add-additional-skill-drawer__content">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <div class="add-additional-skill-drawer__search-section">
            <form.Field
              name="selectedSkills"
            >
              <template #default="{ field }">
                <AvAutocomplete
                  :model-value="field.state.value"
                  :options="filteredSkills"
                  :input-options="{
                    label: t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.searchLabel'),
                    placeholder: t('student.views.studentProjectSkillsView.skillsViewTabs.skillsViewOtherTab.addAdditionalSkillDrawer.searchPlaceholder'),
                    errorMessage: field.state.meta.errors?.join(', '),
                  }"
                  :get-option-label="getOptionLabel"
                  :get-option-key="getOptionKey"
                  :multi-select="false"
                  :server-side-filtering="true"
                  @update:model-value="field.handleChange"
                  @search="handleSearch"
                >
                  <template #item="{ option, isSelected, toggle }">
                    <AvListItem
                      clickable
                      hover-background-color="var(--light-background-neutral)"
                      :selected="isSelected"
                      :icon="MDI_ICONS.STARS"
                      :icon-size="2"
                      icon-color="var(--icon)"
                      color-on-hover="var(--text1)"
                      @click="toggle"
                    >
                      <div class="skill-item">
                        <div class="skill-item__content">
                          <div
                            class="skill-item__title"
                            v-html="highlightMatchedText(option.title, searchQuery)"
                          />

                          <div class="skill-item__path">
                            <span
                              v-for="(segment, index) in option.pathSegments"
                              :key="index"
                              class="skill-item__path-segment"
                              v-html="highlightMatchedText(segment, searchQuery)"
                            />
                          </div>
                        </div>

                        <AdditionalSkillTypeBadge
                          :label="option.type"
                          background-color="var(--dark-background-primary1)"
                        />
                      </div>
                    </AvListItem>
                  </template>
                </AvAutocomplete>
              </template>
            </form.Field>
          </div>
        </form>
      </div>
    </div>

    <template #footer>
      <div class="add-additional-skill-drawer__footer">
        <AvButton
          :label="t('global.buttons.cancel')"
          variant="OUTLINED"
          type="button"
          @click="handleCancel"
        />
        <AvButton
          :label="t('global.buttons.save')"
          variant="FLAT"
          :disabled="!isFormValid"
          @click="form.handleSubmit"
        />
      </div>
    </template>
  </AvDrawer>
</template>

<style scoped lang="scss">
.add-additional-skill-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--spacing-lg);
}

.add-additional-skill-drawer__header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.add-additional-skill-drawer__icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.add-additional-skill-drawer__title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text1);
  margin: 0;
}

.add-additional-skill-drawer__content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.add-additional-skill-drawer__search-section {
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
  transition: background-color 0.2s ease;
}

.skill-item__content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.skill-item__badge {
  display: flex;
  align-items: flex-start;
}

.skill-item__title {
  font-weight: var(--font-weight-bold);
  color: var(--text1);
  font-size: var(--font-size-base);
}

.skill-item__path {
  display: flex;
  flex-wrap: wrap;
  gap: 0;
  color: var(--text1);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-light);

  .skill-item__path-segment {
    &:not(:last-child)::after {
      content: ' > ';
      margin: 0 var(--spacing-xxs);
    }
  }
}

.add-additional-skill-drawer__footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
}
</style>

<style lang="scss">
.highlight {
  color: var(--light-foreground-primary1) !important;
  background-color: transparent;
  font-weight: var(--font-weight-bold);
}
</style>
