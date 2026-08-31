<script lang="ts" setup>
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails, FormCancelConfirmButtons } from '@/common/components'
import KitValorizationToggleFormField
  from '@/features/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.vue'
import DeclaredExperienceActivitySectorFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.vue'
import DeclaredExperienceDescriptionFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.vue'
import DeclaredExperienceExternalLinkFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.vue'
import DeclaredExperienceLocationFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.vue'
import DeclaredExperienceOrganizationFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.vue'
import DeclaredExperiencePeriodFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.vue'
import DeclaredExperienceSourceOfInformationFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.vue'
import DeclaredExperienceSummaryFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.vue'
import DeclaredExperienceTitleFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.vue'
import DeclaredExperienceTypeFormField
  from '@/features/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.vue'
import { useUpdateDeclaredExperienceForm } from '@/features/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/use-update-declared-experience-form/use-update-declared-experience-form'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

export interface UpdateDeclaredExperienceFormProps {
  declaredExperience: DeclaredExperienceViewDTO
  onExperienceUpdated?: () => void
  onCancel?: () => void
}

const props = defineProps<UpdateDeclaredExperienceFormProps>()
const emit = defineEmits<{
  (e: 'dirtyChange', value: boolean): void
}>()

const { t } = useI18n()

const { form, isFormValid, isSubmitting } = useUpdateDeclaredExperienceForm(
  props.declaredExperience,
  props.onExperienceUpdated
)

function handleSubmit () {
  form.handleSubmit()
}

function handleCancel () {
  props.onCancel?.()
}

const state = form.useStore(state => state)

watch(
  state,
  newState => emit('dirtyChange', newState.isDirty),
  { immediate: true }
)

const createdAtPrefixed = computed(() => capitalize(t('student.personalCareer.global.experience')))
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <div
      class="av-col av-gap-md"
      data-testid="update-declared-experience-form__content"
    >
      <KitValorizationToggleFormField :form="form" />
      <div
        class="av-col av-row--md av-justify-between av-gap-xl"
      >
        <div
          class="av-col av-gap-md av-flex-fill"
          data-testid="update-declared-experience-form__main"
        >
          <div class="av-col av-row--md av-gap-md av-align-baseline--md">
            <div class="av-flex-fill">
              <DeclaredExperienceTitleFormField :form="form" />
            </div>
            <div class="av-flex-fill">
              <DeclaredExperienceTypeFormField :form="form" />
            </div>
          </div>

          <DeclaredExperienceOrganizationFormField :form="form" />

          <div class="av-col av-row--md av-gap-md av-align-baseline--md">
            <div class="av-flex-fill">
              <DeclaredExperienceActivitySectorFormField :form="form" />
            </div>
            <div class="av-flex-fill">
              <DeclaredExperienceLocationFormField :form="form" />
            </div>
          </div>

          <DeclaredExperiencePeriodFormField :form="form" />

          <DeclaredExperienceSourceOfInformationFormField :form="form" />

          <DeclaredExperienceExternalLinkFormField :form="form" />
        </div>

        <div
          class="update-declared-experience-form__side av-col av-gap-xl av-flex-fill"
          data-testid="update-declared-experience-form__side"
        >
          <div class="av-col av-gap-sm av-justify-between">
            <DeclaredExperienceDescriptionFormField :form="form" />

            <DeclaredExperienceSummaryFormField :form="form" />

            <CreationUpdateDateDetails
              :created-at="declaredExperience.createdAt"
              :created-at-prefix="createdAtPrefixed"
              :updated-at="declaredExperience.updatedAt"
            />
          </div>
        </div>
      </div>
    </div>
  </form>
  <div
    class="av-row av-justify-end av-pt-md"
    data-testid="update-declared-experience-form__actions"
  >
    <FormCancelConfirmButtons
      :is-submitting="isSubmitting"
      :is-form-valid="isFormValid"
      @cancel="handleCancel"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped lang="scss">
.update-declared-experience-form__side {
  :deep(textarea) {
    height: 100% !important;
    min-height: 10rem;
    flex: 1;
    resize: none;
  }
}
</style>
