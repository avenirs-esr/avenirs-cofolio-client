<script setup lang="ts">
import AddAdditionalSkillAutocompleteField from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/components/AddAdditionalSkillAutocompleteField/AddAdditionalSkillAutocompleteField.vue'
import AddAdditionalSkillLevelField from '@/features/student/views/StudentProjectSkillsView/components/AddAdditionalSkillDrawer/components/AddAdditionalSkillLevelField/AddAdditionalSkillLevelField.vue'
import { useSkillsStore, useToasterStore } from '@/store'
import { AvButton, AvDrawer, MDI_ICONS } from '@/ui'
import { useI18n } from 'vue-i18n'
import { useAdditionalSkillForm } from './use-additional-skill-form/use-additional-skill-form'

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

function handleCancel () {
  form.reset()
  skillsStore.hideCreateAdditionalSkillDrawer()
}
</script>

<template>
  <AvDrawer
    :show="showDrawer"
    position="left"
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
          <AddAdditionalSkillAutocompleteField :form="form" />
          <AddAdditionalSkillLevelField :form="form" />
        </form>
      </div>
    </div>

    <template #footer>
      <div
        v-memo="[isFormValid]"
        class="add-additional-skill-drawer__footer"
      >
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
