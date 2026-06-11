<script lang="ts" setup>
import type { DeclaredSkillProgressDetailsDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails, FormCancelConfirmButtons } from '@/common/components'
import Card from '@/common/components/cards/Card/Card.vue'
import DeclaredSkillRefCard from '@/features/student/declaredSkills/components/cards/DeclaredSkillRefCard/DeclaredSkillRefCard.vue'
import DeclaredSkillLevelRadioButtonSetFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillLevelRadioButtonSetFormField/DeclaredSkillLevelRadioButtonSetFormField.vue'
import DeclaredSkillReflectionFormField from '@/features/student/declaredSkills/components/interactions/formFields/DeclaredSkillReflectionFormField/DeclaredSkillReflectionFormField.vue'
import { useUpdateDeclaredSkillForm } from '@/features/student/declaredSkills/views/StudentUpdateDeclaredSkillView/components/use-update-declared-skill-form/use-update-declared-skill-form'
import { AvInput, RI_ICONS } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
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

const { form, isFormValid, isSubmitting } = useUpdateDeclaredSkillForm(
  props.declaredSkillProgressDetails,
  props.onSkillUpdated
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

const createdAtPrefix = computed(() => capitalize(t('student.skills.skill')))
</script>

<template>
  <Card data-testid="update-declared-skill-form">
    <form @submit.prevent="handleSubmit">
      <div
        class="av-col av-row--md av-justify-between av-gap-xl"
        data-testid="update-declared-skill-form__content"
      >
        <div
          class="av-col av-gap-md av-flex-fill"
          data-testid="update-declared-skill-form__main"
        >
          <AvInput
            :label="t('student.declaredSkills.views.StudentDeclaredSkillView.declaredSkillDetails.skillTitle')"
            label-class="caption-regular"
            :prefix-icon="RI_ICONS.LOADER_LINE"
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

          <CreationUpdateDateDetails
            :created-at="declaredSkillProgressDetails.createdAt"
            :updated-at="declaredSkillProgressDetails.updatedAt"
            :created-at-prefix="createdAtPrefix"
          />
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
        </div>
      </div>
    </form>

    <template #footer>
      <div
        class="av-row av-justify-end"
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
  </Card>
</template>

<style scoped lang="scss">
.update-declared-skill-form {
  &__side {
    :deep(textarea) {
      height: 75vh !important;
      resize: none;
    }
  }
}
</style>
