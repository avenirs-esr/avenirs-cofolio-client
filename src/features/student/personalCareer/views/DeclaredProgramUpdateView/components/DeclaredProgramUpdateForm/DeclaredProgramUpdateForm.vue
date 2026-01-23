<script lang="ts" setup>
import type { DeclaredProgramDetailedDTO } from '@/api/avenir-esr'
import { CreationUpdateDateDetails } from '@/common/components'
import DeclaredProgramDescriptionFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramDescriptionFormField/DeclaredProgramDescriptionFormField.vue'
import DeclaredProgramLinkFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramLinkFormField/DeclaredProgramLinkFormField.vue'
import DeclaredProgramOrganizationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramOrganizationFormField/DeclaredProgramOrganizationFormField.vue'
import DeclaredProgramPeriodFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramPeriodFormField/DeclaredProgramPeriodFormField.vue'
import DeclaredProgramResultFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramResultFormField/DeclaredProgramResultFormField.vue'
import DeclaredProgramSourceOfInformationFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramSourceOfInformationFormField/DeclaredProgramSourceOfInformationFormField.vue'
import DeclaredProgramTitleFormField
  from '@/features/student/personalCareer/components/interactions/formFields/DeclaredProgramTitleFormField/DeclaredProgramTitleFormField.vue'
import { useUpdateDeclaredProgramForm } from '@/features/student/personalCareer/views/DeclaredProgramUpdateView/components/use-update-declared-program-form/use-update-declared-program-form'
import { AvCancelConfirmButtons, AvCard, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import capitalize from 'lodash-es/capitalize'
import { useI18n } from 'vue-i18n'

interface UpdateDeclaredProgramFormProps {
  declaredProgramDetailed: DeclaredProgramDetailedDTO
  onProgramUpdated?: () => void
  onCancel?: () => void
}

const props = defineProps<UpdateDeclaredProgramFormProps>()
const emit = defineEmits<{
  (e: 'dirtyChange', value: boolean): void
}>()

const { t } = useI18n()

const { form, isFormValid, isSubmitting } = useUpdateDeclaredProgramForm(
  props.declaredProgramDetailed,
  props.onProgramUpdated
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

const createdAtPrefix = computed(() =>
  capitalize(t('student.personalCareer.views.DeclaredProgramDetailedView.DeclaredProgramDetailed.program'))
)
</script>

<template>
  <AvCard
    data-testid="update-declared-program-form"
  >
    <form @submit.prevent="handleSubmit">
      <div
        class="av-col av-row--md av-justify-between av-gap-xl"
        data-testid="update-declared-program-form__content"
      >
        <div
          class="av-col av-gap-md av-flex-fill"
          data-testid="update-declared-program-form__main"
        >
          <DeclaredProgramTitleFormField :form="form" />

          <DeclaredProgramOrganizationFormField :form="form" />

          <DeclaredProgramPeriodFormField :form="form" />

          <DeclaredProgramResultFormField :form="form" />

          <DeclaredProgramSourceOfInformationFormField :form="form" />

          <DeclaredProgramLinkFormField :form="form" />

          <CreationUpdateDateDetails
            :created-at="declaredProgramDetailed.createdAt"
            :updated-at="declaredProgramDetailed.updatedAt"
            :created-at-prefix="createdAtPrefix"
          />
        </div>

        <div
          class="update-declared-program-form__side av-col av-gap-xl av-flex-fill"
          data-testid="update-declared-program-form__side"
        >
          <div
            class="av-col av-gap-sm"
            data-testid="update-declared-program-form__field"
          >
            <DeclaredProgramDescriptionFormField :form="form" />
          </div>
        </div>
      </div>
    </form>

    <template #footer>
      <div
        class="av-row av-justify-end"
        data-testid="update-declared-program-form__actions"
      >
        <AvCancelConfirmButtons
          :cancel-label="t('global.buttons.cancel')"
          :confirm-label="t('global.buttons.save')"
          :cancel-icon="MDI_ICONS.CLOSE_CIRCLE_OUTLINE"
          :confirm-icon="MDI_ICONS.CONTENT_SAVE_OUTLINE"
          :cancel-is-loading="isSubmitting"
          :confirm-disabled="!isFormValid"
          :confirm-is-loading="isSubmitting"
          @cancel="handleCancel"
          @confirm="handleSubmit"
        />
      </div>
    </template>
  </AvCard>
</template>

<style scoped lang="scss">
.update-declared-program-form {
  border: none !important;
  &__side {
    :deep(textarea) {
      height: 50vh !important;
      resize: none;
    }
  }
}
</style>
