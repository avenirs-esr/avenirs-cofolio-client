<script lang="ts" setup>
import type { DeclaredSkillProgressDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails, FormCancelConfirmButtons } from '@/common/components'
import DeclaredSkillRefCard from '@/features/student/declaredSkills/components/cards/DeclaredSkillRefCard/DeclaredSkillRefCard.vue'
import DeclaredSkillLevelRadioButtonSetFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.vue'
import DeclaredSkillReflectionFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillReflectionFormField/DeclaredSkillReflectionFormField.vue'
import { useUpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import KitValorizationToggleFormField from '@/features/student/global/components/interaction/formFields/KitValorizationToggleFormField/KitValorizationToggleFormField.vue'
import { AvInput } from '@avenirs-esr/avenirs-dsav'
import { useI18n } from 'vue-i18n'

interface UpdateDeclaredSkillFormProps {
  declaredSkillProgressDetails: DeclaredSkillProgressDetailsDTO
  onSkillUpdated?: () => void
  onCancel?: () => void
}

const props = defineProps<UpdateDeclaredSkillFormProps>()
const emit = defineEmits<{
  (e: 'dirtyChange', value: boolean): void
}>()
const { t } = useI18n()

function handleSkillUpdated () {
  emit('dirtyChange', false)
  props.onSkillUpdated?.()
}

const { form, isFormValid, isSubmitting } = useUpdateDeclaredSkillForm(
  props.declaredSkillProgressDetails,
  handleSkillUpdated
)

function handleSubmit () {
  form.handleSubmit()
}

function handleCancel () {
  emit('dirtyChange', false)
  props.onCancel?.()
}

const state = form.useStore(state => state)

watch(
  state,
  newState => emit('dirtyChange', newState.isDirty),
  { immediate: true }
)
</script>

<template>
  <form
    data-testid="update-declared-skill-form"
    @submit.prevent="handleSubmit"
  >
    <div
      class="av-col av-row--md av-justify-between av-gap-xl"
      data-testid="update-declared-skill-form__content"
    >
      <div
        class="av-col av-gap-md av-flex-fill"
        data-testid="update-declared-skill-form__main"
      >
        <KitValorizationToggleFormField :form="form" />
        <AvInput
          :label="t('student.declaredSkills.views.StudentDeclaredSkillView.declaredSkillDetails.skillTitle')"
          label-class="caption-regular"
          :model-value="declaredSkillProgressDetails.title"
          disabled
        />

        <DeclaredSkillRefCard
          :type="declaredSkillProgressDetails.type"
          :path-segments="declaredSkillProgressDetails.pathSegments"
        />

        <div data-testid="update-declared-skill-form__field">
          <DeclaredSkillLevelRadioButtonSetFormField :form="form" />
        </div>
      </div>

      <div
        class="update-declared-skill-form__side av-col av-gap-xl av-flex-fill"
        data-testid="update-declared-skill-form__side"
      >
        <div
          class="av-col av-gap-sm"
          data-testid="update-declared-skill-form__field"
        >
          <DeclaredSkillReflectionFormField :form="form" />
        </div>

        <div class="av-row av-justify-end">
          <CreationUpdateDateDetails
            :created-at="declaredSkillProgressDetails.createdAt"
            :updated-at="declaredSkillProgressDetails.updatedAt"
            has-feminine-label
          />
        </div>
      </div>
    </div>
  </form>

  <div
    class="av-row av-justify-end av-pt-md"
    data-testid="update-declared-skill-form__actions"
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
.update-declared-skill-form {
  &__side {
    :deep(textarea) {
      height: 60vh !important;
      resize: none;
    }
  }
}
</style>
