<script setup lang="ts">
import { useAddToolForm } from '#shared/composables/use-add-tool-form/use-add-tool-form'
import { useModal } from '#shared/composables/use-modal/use-modal'
import { useUnsavedChangesGuard } from '#shared/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import FormCancelConfirmButtons from '#shared/ui/components/interactions/buttons/FormCancelConfirmButtons/FormCancelConfirmButtons.vue'
import ImageUpload from '#shared/ui/components/interactions/files/ImageUpload/ImageUpload.vue'
import Input from '#shared/ui/components/interactions/inputs/Input/Input.vue'
import ToolDescriptionTextarea from '#shared/ui/components/interactions/inputs/ToolDescriptionTextarea/ToolDescriptionTextarea.vue'
import ToolNameInput from '#shared/ui/components/interactions/inputs/ToolNameInput/ToolNameInput.vue'
import Drawer from '#shared/ui/components/overlay/drawers/Drawer/Drawer.vue'
import ConfirmationModal from '#shared/ui/components/overlay/modals/ConfirmationModal/ConfirmationModal.vue'
import { BANNER_RATIO } from '#shared/utils/image.config'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { computed, markRaw, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export interface AddToolDrawerProps {
  show: boolean
  isNational?: boolean
}

const { show, isNational = false } = defineProps<AddToolDrawerProps>()

const emit = defineEmits<{
  close: []
}>()

const { t } = useI18n()
const { form, isFormValid, isSubmitting } = useAddToolForm({ isNational, onToolAdded: close })
const { modalOpened, openModal, closeModal } = useModal()
const isDirty = form.useStore(state => state.isDirty)
const { canLeave, confirm, cancel } = useUnsavedChangesGuard({ isDirty, openModal, closeModal })

const FormField = markRaw(form.Field)
const i18nKey = 'global.components.overlay.drawers.AddToolDrawer'

const formKey = ref(0)

const title = computed(() => isNational ? t(`${i18nKey}.title.national`) : t(`${i18nKey}.title.local`))

function close () {
  form.reset()
  formKey.value++
  emit('close')
}

async function handleCancel () {
  if (await canLeave()) {
    close()
  }
}
</script>

<template>
  <Drawer
    :show
    :aria-label="title"
    @close="handleCancel"
  >
    <div class="av-col av-gap-lg">
      <span class="n6 av-text-text1">{{ title }}</span>

      <form
        :key="formKey"
        class="av-col av-gap-md"
        novalidate
        data-testid="add-tool-form"
        @submit.prevent.stop="form.handleSubmit"
      >
        <FormField name="name">
          <template #default="{ field }">
            <ToolNameInput
              :model-value="field.state.value"
              :error-message="field.state.meta.errors.filter(Boolean).join(', ')"
              required
              data-testid="add-tool-name-input"
              @blur="field.handleBlur"
              @update:model-value="(value) => field.handleChange(value ?? '')"
            />
          </template>
        </FormField>

        <FormField name="banner">
          <template #default="{ field }">
            <div class="av-col av-gap-xs">
              <span class="b2-regular av-text-text1">{{ t(`${i18nKey}.fields.banner.label`) }}</span>
              <ImageUpload
                :model-value="field.state.value"
                :image-alt="t(`${i18nKey}.fields.banner.alt`)"
                :aspect-ratio="BANNER_RATIO"
                :on-update="(file) => field.handleChange(file)"
                :on-delete-image="() => field.handleChange(null)"
                data-testid="add-tool-banner-upload"
              />
            </div>
          </template>
        </FormField>

        <FormField name="description">
          <template #default="{ field }">
            <ToolDescriptionTextarea
              :model-value="field.state.value"
              :error-message="field.state.meta.errors.filter(Boolean).join(', ')"
              required
              data-testid="add-tool-description-input"
              @blur="field.handleBlur"
              @update:model-value="(value) => field.handleChange(value ?? '')"
            />
          </template>
        </FormField>

        <FormField name="url">
          <template #default="{ field }">
            <Input
              :model-value="field.state.value"
              type="url"
              :label="t(`${i18nKey}.fields.url.label`)"
              :placeholder="t(`${i18nKey}.fields.url.placeholder`)"
              :prefix-icon="MDI_ICONS.LINK"
              :error-message="field.state.meta.errors.filter(Boolean).join(', ')"
              required
              data-testid="add-tool-url-input"
              @blur="field.handleBlur"
              @update:model-value="(value) => field.handleChange(String(value ?? ''))"
            />
          </template>
        </FormField>
      </form>
    </div>

    <template #footer>
      <div class="av-row av-justify-end">
        <FormCancelConfirmButtons
          :is-submitting
          :is-form-valid
          :confirm-label="t(`${i18nKey}.add`)"
          :confirm-icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
          @cancel="handleCancel"
          @submit="form.handleSubmit"
        />
      </div>
    </template>
  </Drawer>

  <ConfirmationModal
    :opened="modalOpened"
    :description="t(`${i18nKey}.confirmationModal.description`)"
    @close="cancel"
    @confirm="confirm"
  />
</template>
