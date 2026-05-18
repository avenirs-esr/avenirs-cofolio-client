<script setup lang="ts">
import { type GetSelfKnowledgeElementsParams, type SelfKnowledgeCategoryDTO, useGetSelfKnowledgeElements } from '@/api/avenir-esr'
import QuerySuspense from '@/common/components/QuerySuspense/QuerySuspense.vue'
import { useModal } from '@/common/composables'
import SelfKnowledgeElementCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeElementCard/SelfKnowledgeElementCard.vue'
import SelfKnowledgeElementsDropdown from '@/features/student/selfKnowledge/components/dropdowns/SelfKnowledgeElementsDropdown/SelfKnowledgeElementsDropdown.vue'
import DeleteSelfKnowledgeCategoryModal from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoryModal/DeleteSelfKnowledgeCategoryModal.vue'
import DeleteSelfKnowledgeElementsModal from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeElementsModal/DeleteSelfKnowledgeElementsModal.vue'
import { useSelfKnowledgeCategory } from '@/features/student/selfKnowledge/composables/use-self-knowledge-category/use-self-knowledge-category'
import { useSelfKnowledgeStore } from '@/features/student/selfKnowledge/stores/self-knowledge.store'
import { AvCard, AvIconText, AvPagination, getPaginationPages } from '@avenirs-esr/avenirs-dsav'
import { keepPreviousData } from '@tanstack/vue-query'
import { useI18n } from 'vue-i18n'

export interface SelfKnowledgeCategoryElementsPaginatorCardProps {
  category: SelfKnowledgeCategoryDTO
}

const { category } = defineProps<SelfKnowledgeCategoryElementsPaginatorCardProps>()

const { t } = useI18n()
const { openAddElementDrawer } = useSelfKnowledgeStore()

const currentPage = ref(0)

const params = computed<GetSelfKnowledgeElementsParams>(() => ({ page: currentPage.value }))

const { data, isLoading, error } = useGetSelfKnowledgeElements(computed(() => category.id), params, {
  query: { enabled: computed(() => !!category.id), placeholderData: keepPreviousData }
})

const elements = computed(() => data.value?.data ?? [])
const pageInfo = computed(() => data.value?.page)

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

const totalElements = computed(() => pageInfo.value?.totalElements ?? 0)
const categoryTitle = computed(() => `${category.title} (${totalElements.value})`)
const totalPages = computed(() => pageInfo.value?.totalPages ?? 0)
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

      <QuerySuspense
        :error="error"
        :is-loading="isLoading"
        :is-empty="elements.length === 0"
        :empty-state-message="t('student.selfKnowledge.SelfKnowledgeMainSection.categoryElementsPaginator.emptyState')"
      >
        <div class="av-col av-justify-end av-gap-md">
          <AvPagination
            v-if="pageInfo"
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

          <div class="av-row av-justify-start av-gap-md av-wrap category-elements-paginator__cards">
            <SelfKnowledgeElementCard
              v-for="element in elements"
              :key="element.id"
              :element="element"
              :category-id="category.id"
            />
          </div>
        </div>
      </QuerySuspense>
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

  <DeleteSelfKnowledgeElementsModal
    v-if="pageInfo"
    :show="showDeleteElementModal"
    :category-id="category.id"
    :total-count="pageInfo.totalElements"
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
