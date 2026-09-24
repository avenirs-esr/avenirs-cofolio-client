<script setup lang="ts">
import { EUserCategory, useGetProfile, useGetSelfKnowledgeCategories } from '@/api/avenir-esr'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import ManageEntityDropdown from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.vue'
import UpdateProfileDrawer from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import ProfileCard from '@/common/components/ProfileCard/ProfileCard.vue'
import { useDrawer, useModal } from '@/common/composables'
import { ICONS } from '@/common/constants'
import SelfKnowledgeCategoryElementsPaginatorCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeCategoryElementsPaginatorCard/SelfKnowledgeCategoryElementsPaginatorCard.vue'
import AddSelfKnowledgeCategoriesModal from '@/features/student/selfKnowledge/components/modals/AddSelfKnowledgeCategoriesModal/AddSelfKnowledgeCategoriesModal.vue'
import DeleteSelfKnowledgeCategoriesModal from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoriesModal/DeleteSelfKnowledgeCategoriesModal.vue'
import AddSelfKnowledgeCategoryElementDrawer
  from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/AddSelfKnowledgeCategoryElementDrawer.vue'
import { AvButton, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const {
  openModal: openAddCategoryModal,
  closeModal: closeAddCategoryModal,
  modalOpened: addCategoryModalOpened
} = useModal()
const {
  openModal: openDeleteCategoriesModal,
  closeModal: closeDeleteCategoriesModal,
  modalOpened: deleteCategoriesModalOpened
} = useModal()
const { showDrawer, displayDrawer, hideDrawer } = useDrawer()
const { data: fetchedCategories } = useGetSelfKnowledgeCategories()
const { data: studentSummary } = useGetProfile(EUserCategory.STUDENT)

const categories = computed(() => fetchedCategories.value ?? [])

function handleActionSelected (action: Action) {
  switch (action) {
    case Action.ADD:
      openAddCategoryModal()
      break
    case Action.DELETE:
      openDeleteCategoriesModal()
      break
  }
}
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="self-knowledge-section"
  >
    <div class="av-row av-wrap av-gap-sm av-justify-between av-align-center av-mb-sm">
      <AvIconText
        data-testid="self-knowledge-section-title"
        typography-class="n4"
        :icon="ICONS.SELF_KNOWLEDGE"
        icon-color="var(--icon)"
        :text="t('student.selfKnowledge.SelfKnowledgeMainSection.title')"
        text-color="var(--title)"
        gap="var(--spacing-sm)"
      />

      <div
        v-if="studentSummary"
        class="av-row av-justify-end"
      >
        <AvButton
          :icon="MDI_ICONS.PENCIL_OUTLINE"
          :label="t('student.selfKnowledge.SelfKnowledgeMainSection.buttons.updateProfile')"
          variant="OUTLINED"
          small
          data-testid="display-update-profile-drawer-button"
          @click="displayDrawer"
        />
      </div>
    </div>

    <ProfileCard
      v-if="studentSummary"
      :first-name="studentSummary.firstname"
      :last-name="studentSummary.lastname"
      :profile-picture-url="studentSummary.profilePicture.url"
      :cover-picture-url="studentSummary.coverPicture.url"
      :bio="studentSummary.bio"
    />

    <div class="av-row av-justify-end">
      <ManageEntityDropdown
        entity-name="mes catégories"
        :actions="[Action.ADD, Action.DELETE]"
        @action-selected="handleActionSelected"
      />
    </div>
    <div class="av-col av-gap-xl">
      <SelfKnowledgeCategoryElementsPaginatorCard
        v-for="category in categories"
        :key="category.type"
        :category="category"
      />
    </div>
  </div>

  <AddSelfKnowledgeCategoriesModal
    :opened="addCategoryModalOpened"
    @cancel="closeAddCategoryModal"
    @confirm="closeAddCategoryModal"
  />
  <DeleteSelfKnowledgeCategoriesModal
    :opened="deleteCategoriesModalOpened"
    :categories="categories"
    @cancel="closeDeleteCategoriesModal"
    @deleted="closeDeleteCategoriesModal"
  />
  <AddSelfKnowledgeCategoryElementDrawer />

  <UpdateProfileDrawer
    v-if="studentSummary"
    :key="showDrawer ? 'drawer-open' : 'drawer-closed'"
    v-bind="studentSummary"
    :show="showDrawer"
    :on-close="hideDrawer"
  />
</template>
