<script setup lang="ts">
import type { SelfKnowledgeCategoryDTO } from '@/api/avenir-esr'
import { useModal } from '@/common/composables'
import SelfKnowledgeElementCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCard/SelfKnowledgeElementCard.vue'
import SelfKnowledgeElementsDropdown from '@/features/student/selfKnowledge/components/dropdowns/SelfKnowledgeElementsDropdown/SelfKnowledgeElementsDropdown.vue'
import DeleteSelfKnowledgeCategoryModal from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoryModal/DeleteSelfKnowledgeCategoryModal.vue'
import DeleteSelfKnowledgeElementModal from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeElementsModal/DeleteSelfKnowledgeElementsModal.vue'
import { useSelfKnowledgeCategory } from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { useSelfKnowledgeCategoryElementsViewQuery } from '@/features/student/selfKnowledge/queries/self-knowledge.query/self-knowledge.query'
import { useSelfKnowledgeStore } from '@/features/student/selfKnowledge/stores/self-knowledge.store'
import { AvCard, AvIconText, AvPagination, getPaginationPages } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeCategoryElementsPaginatorCardProps {
  category: SelfKnowledgeCategoryDTO
}

const { category } = defineProps<SelfKnowledgeCategoryElementsPaginatorCardProps>()

const { t } = useI18n()
const { openAddElementDrawer } = useSelfKnowledgeStore()

const currentPage = ref(0)

const { elements, pageInfo, isLoading } = useSelfKnowledgeCategoryElementsViewQuery({
  selfKnowledgeCategoryId: computed(() => category.id),
  page: currentPage
})

const {
  categoryType,
  categoryIcon
} = useSelfKnowledgeCategory(computed(() => category.id))

const {
  displayModal: displayDeleteCategoryModal,
  hideModal: hideDeleteCategoryModal,
  showModal: showDeleteCategoryModal
} = useModal()

const {
  displayModal: displayDeleteElementModal,
  hideModal: hideDeleteElementModal,
  showModal: showDeleteElementModal
} = useModal()

const totalElements = computed(() => pageInfo.value.totalElements)
const categoryTitle = computed(() => `${category.title} (${totalElements.value})`)
const totalPages = computed(() => pageInfo.value.totalPages)
const pages = computed(() => getPaginationPages(totalPages))

function openAddCategoryElementDrawer () {
  openAddElementDrawer(category)
}

function onElementDeleted () {
  if (elements.value.length === 0 && currentPage.value > 0) {
    currentPage.value -= 1
  }
  hideDeleteElementModal()
}
</script>

<template>
  <AvCard
    background-color="var(--surface-background)"
    title-background="var(--surface-background)"
    border-color="var(--stroke)"
    collapsible
  >
    <template #title>
      <div class="av-row av-align-center av-justify-between av-w-full av-gap-md av-px-md">
        <AvIconText
          typography-class="n5"
          :icon="categoryIcon"
          icon-color="var(--icon)"
          :text="categoryTitle"
          text-color="var(--title)"
          gap="var(--spacing-sm)"
        />
        <div class="av-row av-align-center av-gap-sm">
          <SelfKnowledgeElementsDropdown
            :category-type="categoryType"
            @delete-selected="displayDeleteElementModal"
            @delete-category-selected="displayDeleteCategoryModal"
            @add-selected="openAddCategoryElementDrawer"
          />
        </div>
      </div>
    </template>

    <div class="av-col av-gap-sm">
      <span class="s2-regular av-text-text2">{{ category.description }}</span>

      <div
        v-if="!isLoading && elements.length > 0"
        class="av-col av-justify-end av-gap-md"
      >
        <AvPagination
          class="category-elements-paginator__pagination"
          :current-page="pageInfo.page"
          :pages="pages"
          compact
          :prev-page-label="t('global.avPagination.prevPageTitle')"
          :next-page-label="t('global.avPagination.nextPageTitle')"
          :compact-current-page-label="t('global.avPagination.current', {
            current: (pageInfo.page + 1),
            total: (pageInfo.totalPages),
          })"
          @update:current-page="(page) => currentPage = page"
        />

        <div class="av-row av-justify-start av-gap-md av-wrap av-px-sm category-elements-paginator__cards">
          <SelfKnowledgeElementCard
            v-for="element in elements"
            :key="element.id"
            :element="element"
            :category-id="category.id"
          />
        </div>
      </div>

      <div
        v-else-if="!isLoading && elements.length === 0"
        class="av-row av-justify-center av-p-xl"
      >
        <span class="b2-regular av-text-text2">
          {{ t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.emptyState') }}
        </span>
      </div>
    </div>
  </AvCard>

  <DeleteSelfKnowledgeCategoryModal
    :show="showDeleteCategoryModal"
    :category-id="category.id"
    :category-title="category.title"
    :elements-count="elements.length"
    @cancel="hideDeleteCategoryModal"
    @confirm="hideDeleteCategoryModal"
  />

  <DeleteSelfKnowledgeElementModal
    :show="showDeleteElementModal"
    :category-type="categoryType"
    :elements="elements"
    @cancel="hideDeleteElementModal"
    @confirm="onElementDeleted"
  />
</template>

<style lang="scss" scoped>
.category-elements-paginator {
  &__pagination {
    :deep(.av-pagination__list) {
      justify-content: flex-end !important;
    }
  }

  &__cards {
    > * {
      flex: 1 1 calc((100% - 2 * var(--spacing-md)) / 3);
      min-width: 20rem;
      max-width: calc((100% - 2 * var(--spacing-md)) / 3);
    }
  }
}
</style>
