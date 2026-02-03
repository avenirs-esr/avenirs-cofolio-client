<script lang="ts" setup>
import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails, FormCancelConfirmButtons } from '@/common/components'
import DeclaredExperienceActivitySectorFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceActivitySectorFormField/DeclaredExperienceActivitySectorFormField.vue'
import DeclaredExperienceDescriptionFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceDescriptionFormField/DeclaredExperienceDescriptionFormField.vue'
import DeclaredExperienceExternalLinkFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceExternalLinkFormField/DeclaredExperienceExternalLinkFormField.vue'
import DeclaredExperienceLocationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceLocationFormField/DeclaredExperienceLocationFormField.vue'
import DeclaredExperienceOrganizationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceOrganizationFormField/DeclaredExperienceOrganizationFormField.vue'
import DeclaredExperiencePeriodFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperiencePeriodFormField/DeclaredExperiencePeriodFormField.vue'
import DeclaredExperienceSourceOfInformationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSourceOfInformationFormField/DeclaredExperienceSourceOfInformationFormField.vue'
import DeclaredExperienceSummaryFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceSummaryFormField/DeclaredExperienceSummaryFormField.vue'
import DeclaredExperienceTitleFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTitleFormField/DeclaredExperienceTitleFormField.vue'
import DeclaredExperienceTypeFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredExperienceTypeFormField/DeclaredExperienceTypeFormField.vue'
import { useUpdateDeclaredExperienceForm } from '@/features/student/personalCareer/views/DeclaredExperienceUpdateView/components/UpdateDeclaredExperienceForm/use-update-declared-experience-form/use-update-declared-experience-form'
import { AvCard } from '@avenirs-esr/avenirs-dsav'
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
  <AvCard data-testid="update-declared-experience-form">
    <form @submit.prevent="handleSubmit">
      <div
        class="av-col av-row--md av-justify-between av-gap-xl"
        data-testid="update-declared-experience-form__content"
      >
        <div
          class="av-col av-gap-md column-equal"
          data-testid="update-declared-experience-form__main"
        >
          <div
            class="av-row av-gap-md"
            style="align-items: baseline;"
          >
            <div class="half-width">
              <DeclaredExperienceTitleFormField
                class="full-width-input"
                :form="form"
              />
            </div>
            <div class="half-width">
              <DeclaredExperienceTypeFormField
                class="full-width-input"
                :form="form"
              />
            </div>
          </div>

          <DeclaredExperienceOrganizationFormField
            class="full-width-input"
            :form="form"
          />

          <div
            class="av-row av-gap-md"
            style="align-items: baseline;"
          >
            <div class="half-width">
              <DeclaredExperienceActivitySectorFormField
                class="full-width-input"
                :form="form"
              />
            </div>
            <div class="half-width">
              <DeclaredExperienceLocationFormField
                class="full-width-input"
                :form="form"
              />
            </div>
          </div>

          <DeclaredExperiencePeriodFormField :form="form" />

          <DeclaredExperienceSourceOfInformationFormField
            class="full-width-input"
            :form="form"
          />

          <DeclaredExperienceExternalLinkFormField
            class="full-width-input"
            :form="form"
          />
        </div>

        <div
          class="update-declared-experience-form__side av-col av-gap-xl column-equal"
          data-testid="update-declared-experience-form__side"
        >
          <div
            class="layout-declared-experience-detailed__side av-col av-gap-md full-height-container"
            data-testid="update-declared-experience-form__field"
          >
            <DeclaredExperienceDescriptionFormField :form="form" />
            <DeclaredExperienceSummaryFormField :form="form" />

            <CreationUpdateDateDetails
              class="push-to-bottom"
              :created-at="declaredExperience.createdAt"
              :created-at-prefix="createdAtPrefixed"
              :updated-at="declaredExperience.updatedAt"
            />
          </div>
        </div>
      </div>
    </form>
    <template #footer>
      <div
        class="av-row av-justify-end"
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
  </AvCard>
</template>

<style scoped lang="scss">
.update-declared-experience-form {
  border: none !important;
  &__side {
    display: flex;
    flex-direction: column;

    :deep(textarea) {
      height: 25vh !important;
      resize: none;
      width: 100%;
    }
  }
}

.full-height-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.push-to-bottom {
  margin-top: auto;
}

.column-equal {
  flex: 1;
  width: 0;
  min-width: 0;
}

.half-width {
  flex: 1;
  width: 0;
  min-width: 0;
}

.full-width-input {
  width: 100%;
  :deep(.fr-input-group),
  :deep(.fr-input),
  :deep(.fr-select),
  :deep(input),
  :deep(select),
  :deep([role="combobox"]) {
    width: 100% !important;
    max-width: 100% !important;
    box-sizing: border-box;
  }
}
</style>
