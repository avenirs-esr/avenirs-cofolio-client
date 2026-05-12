<script setup lang="ts">
import type { GetSelfKnowledgeElementsParams } from '@/api/avenir-esr'
import type { MindMapNodeTemplateProps } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import { useGetSelfKnowledgeElements } from '@/api/avenir-esr'
import ButtonNodeTemplate from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useModal } from '@/common/composables'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH, SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH } from '@/features/student/buildProject/config'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { type AddElementFormData, useAddElementForm } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/composables/use-add-element-form/use-add-element-form'
import { SELF_KNOWLEDGE_NODE_TYPES } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/self-knowledge-nodes.types'
import CategoryElementRatingRadioButtonSet from '@/features/student/selfKnowledge/components/interactions/inputs/CategoryElementRatingRadioButtonSet/CategoryElementRatingRadioButtonSet.vue'
import { useToasterStore } from '@/store'
import { AvCheckbox, AvCheckboxesGroup, AvInput, AvModal, AvTab, AvTabs, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { markRaw } from 'vue'
import { useI18n } from 'vue-i18n'

const { id, data } = defineProps<MindMapNodeTemplateProps>()

const { showModal, displayModal, hideModal } = useModal()
const { addNode, findNodeByTitleAndDescription } = useNodes(MIND_MAP_FLOW_ID)
const { addErrorMessage } = useToasterStore()
const { t } = useI18n()

const params = computed<GetSelfKnowledgeElementsParams>(() => ({
  page: 0, // TODO: temporary value for POC purpose - need a real pagination later
  pageSize: 12 // TODO: temporary value for POC purpose - need a real pagination later
}))

const { data: fetchedElements } = useGetSelfKnowledgeElements(computed(() => data.categoryId as string), params, {
  query: { enabled: computed(() => !!data.categoryId), placeholderData: keepPreviousData }
})
const elements = computed(() => fetchedElements.value ? fetchedElements.value.data : [])
const { form, isModified, isValid, resetForm } = useAddElementForm(data => onConfirmAddElements(data))
const FormField = markRaw(form.Field)

const availableElements = computed(() =>
  elements.value.filter((element) => {
    const existingNode = findNodeByTitleAndDescription(element.title, element.description)
    return !existingNode
  })
)
const usedElementsCount = computed(() =>
  elements.value.length - availableElements.value.length
)

enum TabIndex {
  ELEMENTS = 0,
  CUSTOM_ELEMENTS = 1,
}

const selectedElementsIds = ref<string[]>([])
const activeTab = ref(TabIndex.ELEMENTS)

function closeModal () {
  selectedElementsIds.value = []
  resetForm()
  hideModal()
}

function onConfirmAddElements (formData?: AddElementFormData) {
  const idsToAdd = formData ? [crypto.randomUUID()] : selectedElementsIds.value

  idsToAdd.forEach((selectedId, index) => {
    let title: string
    let description: string
    let rating: number | undefined

    if (activeTab.value === TabIndex.ELEMENTS) {
      const element = elements.value.find(element => element.id === selectedId)
      if (!element) {
        addErrorMessage(t('student.buildProject.mindMap.selfKnowledge.addElementButton.errors.elementNotFound', { id: selectedId }))
        return
      }
      title = element.title
      description = element.description
      rating = element.rating
    }
    else {
      if (!formData) {
        addErrorMessage(t('student.buildProject.mindMap.selfKnowledge.addElementButton.errors.formDataUndefined'))
        return
      }
      title = formData.title
      description = formData.description
      rating = formData.rating
    }

    const existingNode = findNodeByTitleAndDescription(title, description)
    if (existingNode) {
      addErrorMessage(t('student.buildProject.mindMap.selfKnowledge.addElementButton.errors.existingNode'))
      return
    }

    addNode({
      id: selectedId,
      type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_ELEMENT,
      parentId: id,
      parentHandle: GLOBAL_NODE_HANDLES.BOTTOM,
      width: 300,
      position: {
        x: 60,
        y: (usedElementsCount.value) * 100 + 40,
      },
      data: {
        title,
        description,
        rating,
        categoryId: data.categoryId,
        left: true,
      },
      withoutSnapshot: index > 0
    })
  })

  closeModal()
}
</script>

<template>
  <ButtonNodeTemplate
    v-bind="$props"
    :label="t('student.buildProject.mindMap.selfKnowledge.addElementButton.label')"
    :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
    :flow-id="MIND_MAP_FLOW_ID"
    icon-only
    small
    @click="displayModal"
  >
    <template #modal>
      <AvModal
        :opened="showModal"
        :close-button-label="t('global.buttons.cancel')"
        :confirm-button-label="t('student.buildProject.mindMap.selfKnowledge.addElementButton.confirm', { count: activeTab === TabIndex.ELEMENTS ? selectedElementsIds.length : 1 })"
        :confirm-button-icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        :confirm-button-disabled="activeTab === TabIndex.ELEMENTS ? selectedElementsIds.length === 0 : !isModified || !isValid"
        @close="closeModal"
        @confirm="activeTab === TabIndex.ELEMENTS ? onConfirmAddElements() : form.handleSubmit()"
      >
        <AvTabs
          v-model="activeTab"
          compact
        >
          <AvTab
            :title="t('student.buildProject.mindMap.selfKnowledge.addElementButton.tabs.existing.title')"
            :icon="MDI_ICONS.BOOK_LOCATION_OUTLINE"
          >
            <div
              v-if="availableElements.length > 0"
              class="add-self-knowledge-categories-modal__body"
            >
              <AvCheckboxesGroup id="add-self-knowledge-categories-modal-checkboxes-group">
                <AvCheckbox
                  v-for="element in availableElements"
                  :id="element.id"
                  :key="element.id"
                  v-model="selectedElementsIds"
                  :value="element.id"
                  :name="element.id"
                  :label="element.title"
                />
              </AvCheckboxesGroup>
            </div>
          </AvTab>

          <AvTab
            :title="t('student.buildProject.mindMap.selfKnowledge.addElementButton.tabs.new.title')"
            :icon="MDI_ICONS.STARS"
          >
            <form
              id="add-custom-element-form"
              @submit.prevent.stop="form.handleSubmit"
            >
              <div class="add-custom-element-form-container">
                <FormField name="title">
                  <template #default="{ field }">
                    <AvInput
                      :model-value="field.state.value"
                      :error-message="field.state.meta.errors.join(', ')"
                      :label="t('student.buildProject.mindMap.selfKnowledge.addElementButton.tabs.new.form.title')"
                      required
                      @update:model-value="(value) => field.handleChange(String(value ?? ''))"
                    >
                      <template
                        v-if="!$slots.maxLengthCaption"
                        #maxLengthCaption="{ currentValue }"
                      >
                        <span class="caption-light">
                          {{ t('global.inputs.textarea.limit', {
                            count: currentValue?.toString().length || 0,
                            maxlength: SELF_KNOWLEDGE_ELEMENT_TITLE_MAX_LENGTH,
                          }) }}
                        </span>
                      </template>
                    </AvInput>
                  </template>
                </FormField>
                <FormField name="description">
                  <template #default="{ field }">
                    <AvInput
                      :model-value="field.state.value"
                      :error-message="field.state.meta.errors.join(', ')"
                      :label="t('student.buildProject.mindMap.selfKnowledge.addElementButton.tabs.new.form.description')"
                      is-textarea
                      required
                      @update:model-value="(value) => field.handleChange(String(value ?? ''))"
                    >
                      <template
                        v-if="!$slots.maxLengthCaption"
                        #maxLengthCaption="{ currentValue }"
                      >
                        <span class="caption-light">
                          {{ t('global.inputs.textarea.limit', {
                            count: currentValue?.toString().length || 0,
                            maxlength: SELF_KNOWLEDGE_ELEMENT_DESCRIPTION_MAX_LENGTH,
                          }) }}
                        </span>
                      </template>
                    </AvInput>
                  </template>
                </FormField>
                <FormField name="rating">
                  <template #default="{ field }">
                    <CategoryElementRatingRadioButtonSet
                      :model-value="field.state.value ?? undefined"
                      :error-message="field.state.meta.errors?.join(', ')"
                      @blur="field.handleBlur"
                      @update:model-value="(value) => field.handleChange(value ?? 0)"
                    />
                  </template>
                </FormField>
              </div>
            </form>
          </AvTab>
        </AvTabs>
      </AvModal>
    </template>
  </ButtonNodeTemplate>
</template>
