<script setup lang="ts">
import type { MindMapNodeTemplateProps } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/mind-map-nodes.types'
import ButtonNodeTemplate from '@/common/components/VueFlow/ButtonNodeTemplate/ButtonNodeTemplate.vue'
import { GLOBAL_NODE_HANDLES } from '@/common/components/VueFlow/global-nodes.types'
import { useModal } from '@/common/composables'
import { useNodes } from '@/common/composables/VueFlow/use-nodes/use-nodes'
import { MIND_MAP_FLOW_ID } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/components/MindMap/config'
import { SELF_KNOWLEDGE_NODE_TYPES } from '@/features/student/buildProject/views/BuildProjectView/sections/BuildProjectSection/types/self-knowledge-nodes.types'
import { useSelfKnowledgeCategoriesAvailableQuery, useSelfKnowledgeCategoriesQuery } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useToasterStore } from '@/store'
import { AvCheckbox, AvCheckboxesGroup, AvModal, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useVueFlow } from '@vue-flow/core'
import { useI18n } from 'vue-i18n'

const { id } = defineProps<MindMapNodeTemplateProps>()

const { t } = useI18n()
const { showModal, displayModal, hideModal } = useModal()
const { nodes } = useVueFlow()
const { addNode } = useNodes(MIND_MAP_FLOW_ID)
const { addErrorMessage } = useToasterStore()
const { categories } = useSelfKnowledgeCategoriesQuery()
const { categoriesAvailable } = useSelfKnowledgeCategoriesAvailableQuery()

const allCategories = computed(() => categories.value.concat(categoriesAvailable.value))
const availableCategories = computed(() => allCategories.value.filter(category => categoryExists(category.id) === false))
const usedCategoriesCount = computed(() => allCategories.value.length - availableCategories.value.length)

const selectedCategoriesIds = ref<string[]>([])

function closeModal () {
  selectedCategoriesIds.value = []
  hideModal()
}

function categoryExists (categoryId: string) {
  return nodes.value.some(node =>
    node.type === SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_CATEGORY && node.id === categoryId
  )
}

function onConfirmAddCategories () {
  selectedCategoriesIds.value.forEach((selectedId, index) => {
    const category = allCategories.value.find(category => category.id === selectedId)

    if (!category) {
      addErrorMessage(t('student.buildProject.mindMap.selfKnowledge.addCategoryButton.errors.categoryNotFound', { id: selectedId }))
      return
    }

    addNode({
      id: selectedId,
      type: SELF_KNOWLEDGE_NODE_TYPES.SELF_KNOWLEDGE_CATEGORY,
      position: {
        x: -150 - category.title.length * 7,
        y: (usedCategoriesCount.value) * 175 + 20,
      },
      data: {
        label: category.title,
        right: true,
        bottom: true
      },
      parentId: id,
      parentHandle: GLOBAL_NODE_HANDLES.LEFT,
      nodeHandle: GLOBAL_NODE_HANDLES.RIGHT,
      withoutSnapshot: index > 0
    })

    addNode({
      id: `add-element-${selectedId}`,
      type: SELF_KNOWLEDGE_NODE_TYPES.ADD_SELF_KNOWLEDGE_ELEMENT_BUTTON,
      position: {
        x: category.title.length * 4,
        y: 80,
      },
      data: {
        categoryId: selectedId,
        top: true,
        bottom: true,
      },
      parentId: selectedId,
      parentHandle: GLOBAL_NODE_HANDLES.BOTTOM,
      nodeHandle: GLOBAL_NODE_HANDLES.TOP,
      withoutSnapshot: true,
    })
  })

  closeModal()
}
</script>

<template>
  <ButtonNodeTemplate
    v-bind="$props"
    :label="t('student.buildProject.mindMap.selfKnowledge.addCategoryButton.label')"
    :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
    :flow-id="MIND_MAP_FLOW_ID"
    @click="displayModal"
  >
    <template #modal>
      <AvModal
        :opened="showModal"
        :close-button-label="t('global.buttons.cancel')"
        :confirm-button-label="t('student.buildProject.mindMap.selfKnowledge.addCategoryButton.confirm', { count: selectedCategoriesIds.length })"
        :confirm-button-icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        :confirm-button-disabled="selectedCategoriesIds.length === 0"
        @close="closeModal"
        @confirm="onConfirmAddCategories"
      >
        <div
          v-if="availableCategories.length > 0"
          class="add-self-knowledge-categories-modal__body"
        >
          <AvCheckboxesGroup id="add-self-knowledge-categories-modal-checkboxes-group">
            <AvCheckbox
              v-for="category in availableCategories"
              :id="category.id"
              :key="category.id"
              v-model="selectedCategoriesIds"
              :value="category.id"
              :name="category.id"
              :label="category.title"
            />
          </AvCheckboxesGroup>
        </div>
      </AvModal>
    </template>
  </ButtonNodeTemplate>
</template>
