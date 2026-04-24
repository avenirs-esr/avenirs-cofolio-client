<script setup lang="ts">
import { EUserCategory, useGetProfile, useGetSelfKnowledgeCategories } from '@/api/avenir-esr'
import UpdateProfileDrawer from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.vue'
import ProfileCard from '@/common/components/ProfileCard/ProfileCard.vue'
import { useDrawer, useModal } from '@/common/composables'
import SelfKnowledgeCategoryElementsPaginatorCard from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeCategoryElementsPaginatorCard/SelfKnowledgeCategoryElementsPaginatorCard.vue'
import AddSelfKnowledgeCategoriesModal from '@/features/student/selfKnowledge/components/modals/AddSelfKnowledgeCategoriesModal/AddSelfKnowledgeCategoriesModal.vue'
import AddSelfKnowledgeCategoryElementDrawer
  from '@/features/student/selfKnowledge/components/overlays/AddSelfKnowledgeCategoryElementDrawer/AddSelfKnowledgeCategoryElementDrawer.vue'
import { AvButton, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const {
  displayModal: displayAddCategoryModal,
  hideModal: hideAddCategoryModal,
  showModal: showAddCategoryModal
} = useModal()
const { showDrawer, displayDrawer, hideDrawer } = useDrawer()
const { data: fetchedCategories } = useGetSelfKnowledgeCategories()
const { data: studentSummary } = useGetProfile(EUserCategory.STUDENT)

const categories = computed(() => fetchedCategories.value ?? [])
</script>

<template>
  <div
    class="av-col av-gap-xl"
    data-testid="self-knowledge-section"
  >
    <AvIconText
      data-testid="self-knowledge-section-title"
      typography-class="n4"
      :icon="MDI_ICONS.ACCOUNT_CIRCLE_OUTLINE"
      icon-color="var(--icon)"
      :text="t('student.selfKnowledge.SelfKnowledgeMainSection.title.content')"
      text-color="var(--title)"
      gap="0.75rem"
    />

    <div
      v-if="studentSummary"
      class="av-row av-justify-end"
    >
      <AvButton
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        :label="t('global.buttons.update')"
        variant="OUTLINED"
        small
        data-testid="display-update-profile-drawer-button"
        @click="displayDrawer"
      />
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
      <AvButton
        :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
        :label="t('student.selfKnowledge.SelfKnowledgeMainSection.buttons.addCategory')"
        variant="OUTLINED"
        small
        @click="displayAddCategoryModal"
      />
    </div>
    <div class="av-col av-gap-xl">
      <SelfKnowledgeCategoryElementsPaginatorCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
      />
    </div>
  </div>

  <AddSelfKnowledgeCategoriesModal
    :show="showAddCategoryModal"
    @cancel="hideAddCategoryModal"
    @confirm="hideAddCategoryModal"
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
