<script setup lang="ts">
import type { AssociateElementOption, AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import type { IdTitle } from '@/types'
import { ConfirmationModal, FormCancelConfirmButtons } from '@/common/components'
import { useModal } from '@/common/composables'
import { useUnsavedChangesGuard } from '@/common/composables/use-unsaved-changes-guard/use-unsaved-changes-guard'
import {
  useSearchActivitiesForAssociationQuery,
  useSearchDeclaredSkillsForAssociationWithTraceQuery
} from '@/features/student/traces/queries/use-traces.query/use-traces.query'
import { useTracesStore } from '@/features/student/traces/stores/traces.store'
import { EAssociationTypeKey } from '@/features/student/traces/types/traces.types'
import AssociateElementsDrawerSection from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociateElementsDrawerSection/AssociateElementsDrawerSection.vue'
import CreateTraceFormDeclarationItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormDeclarationItems/CreateTraceFormDeclarationItems.vue'
import CreateTraceFormTraceDefinitionItems from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/CreateTraceFormTraceDefinitionItems/CreateTraceFormTraceDefinitionItems.vue'
import { useCreateTraceForm } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/use-create-tarce-form/use-create-trace-form'
import { useToasterStore } from '@/store'
import { AvAccordion, AvAccordionsGroup, AvDrawer, AvIconText, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { debounce } from 'lodash-es'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tracesStore = useTracesStore()
const { addSuccessMessage } = useToasterStore()

const showDrawer = toRef(tracesStore, 'showCreateTraceDrawer')

const searchQuery = ref('')
const associationSelections = ref<Record<string, IdTitle[]>>({})
const activeTypeKey = ref<string>(EAssociationTypeKey.DECLARED_SKILLS)

function onTraceCreated () {
  addSuccessMessage({
    timeout: 2000,
    description: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.createTraceForm.success')
  })
  confirmCancel()
}

const { form, isFormValid, isSubmitting } = useCreateTraceForm(onTraceCreated)

const isFormDirty = form.useStore(state => state.isDirty)

const {
  showModal: showDiscardChangesModal,
  displayModal: displayDiscardChangesModal,
  hideModal: hideDiscardChangesModal
} = useModal()

const {
  canLeave,
  confirm,
  cancel
} = useUnsavedChangesGuard({
  isDirty: isFormDirty,
  openModal: displayDiscardChangesModal,
  closeModal: hideDiscardChangesModal
})

const activeAccordion = ref(0)

function confirmCancel () {
  form.reset()
  associationSelections.value = {}
  searchQuery.value = ''
  activeTypeKey.value = EAssociationTypeKey.DECLARED_SKILLS
  activeAccordion.value = 0
  tracesStore.hideCreateTraceDrawer()
}

async function handleCancel () {
  if (await canLeave()) {
    confirmCancel()
  }
}

async function onSave () {
  await form.handleSubmit()
}

// During trace creation, we don't have a real traceId yet.
// During trace creation, the BE search endpoints require a traceId to exclude already-associated elements.
// Since the trace doesn't exist yet, any valid UUID works — the BE finds no existing associations for it.
// TODO : create an endpoint to search elements without providing a traceId
const PLACEHOLDER_TRACE_ID = '00000000-0000-0000-0000-000000000000'
const searchTraceId = computed(() => showDrawer.value ? PLACEHOLDER_TRACE_ID : '')

function makeSearchParams (typeKey: EAssociationTypeKey) {
  return computed(() => ({
    keyword: activeTypeKey.value === typeKey
      ? (searchQuery.value.trim() || undefined)
      : undefined,
    page: 0,
    pageSize: 100,
  }))
}

const {
  skills,
  isLoading: isSkillsLoading
} = useSearchDeclaredSkillsForAssociationWithTraceQuery({
  traceId: searchTraceId,
  params: makeSearchParams(EAssociationTypeKey.DECLARED_SKILLS)
})

const {
  activities,
  isLoading: isActivitiesLoading
} = useSearchActivitiesForAssociationQuery({
  traceId: searchTraceId,
  params: makeSearchParams(EAssociationTypeKey.ACTIVITIES)
})

const typeConfigs = computed<AssociateElementTypeConfig[]>(() => [
  {
    key: EAssociationTypeKey.DECLARED_SKILLS,
    label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.types.declaredSkills'),
    searchPlaceholder: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.searchPlaceholder.declaredSkills')
  },
  {
    key: EAssociationTypeKey.ACTIVITIES,
    label: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.types.activities'),
    searchPlaceholder: t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.associateElements.searchPlaceholder.activities')
  }
])

const currentOptions = computed<AssociateElementOption[]>(() => {
  if (activeTypeKey.value === EAssociationTypeKey.DECLARED_SKILLS) {
    return skills.value.map(skill => ({
      id: skill.id,
      title: skill.title,
      disabled: skill.disabled,
      description: skill.type
        ? t(`student.declaredSkills.declaredSkillTypes.${skill.type}`)
        : undefined
    }))
  }
  return activities.value.map(activity => ({
    id: activity.id,
    title: activity.title,
    disabled: activity.disabled,
    description: activity.thematic
      ? t(`student.buildProject.activities.thematics.${activity.thematic}`)
      : undefined
  }))
})

const isSearchLoading = computed(() => {
  if (activeTypeKey.value === EAssociationTypeKey.DECLARED_SKILLS) {
    return isSkillsLoading.value
  }
  return isActivitiesLoading.value
})

const onSearch = debounce((query: string) => {
  searchQuery.value = query
}, 350)

function onTypeChange (typeKey: string) {
  activeTypeKey.value = typeKey
  searchQuery.value = ''
}

const associationSelectionsField = form.useField({ name: 'associationSelections' })

watch(associationSelections, (newSelections) => {
  associationSelectionsField.api.handleChange(newSelections)
}, { deep: true })
</script>

<template>
  <ConfirmationModal
    :show="showDiscardChangesModal"
    @confirm="confirm"
    @close="cancel"
  />
  <AvDrawer
    :show="showDrawer"
    position="right"
    width="50rem"
    @escape-pressed="handleCancel"
  >
    <div class="av-col av-h-full av-gap-md">
      <AvIconText
        :icon="MDI_ICONS.PENCIL_OUTLINE"
        icon-color="var(--icon)"
        :text="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.title')"
        text-color="var(--title)"
        typography-class="n6"
        gap="var(--spacing-xs)"
        data-testid="student-tools-traces-add-trace-drawer__title"
      />

      <div class="av-col av-flex-fill">
        <form
          novalidate
          @submit.prevent.stop="form.handleSubmit"
        >
          <AvAccordionsGroup v-model:active-accordion="activeAccordion">
            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.addTrace')"
              :icon="MDI_ICONS.IMAGE_OUTLINE"
            >
              <CreateTraceFormTraceDefinitionItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.declarations')"
              :icon="MDI_ICONS.FILE_DOCUMENT_BOX_MULTIPLE_OUTLINE"
            >
              <CreateTraceFormDeclarationItems :form="form" />
            </AvAccordion>

            <AvAccordion
              :title="t('student.traces.views.StudentToolsTracesView.studentToolsTracesAddTraceDrawer.accordionItems.associateTrace')"
              :icon="MDI_ICONS.PLUS_CIRCLE_OUTLINE"
            >
              <AssociateElementsDrawerSection
                v-model:selections-by-type="associationSelections"
                :type-configs="typeConfigs"
                :options="currentOptions"
                :loading="isSearchLoading"
                data-testid="associate-elements-section"
                @search="onSearch"
                @type-change="onTypeChange"
              />
            </AvAccordion>
          </AvAccordionsGroup>
        </form>
      </div>
    </div>

    <template #footer>
      <div class="av-row av-justify-end av-gap-sm av-p-md">
        <FormCancelConfirmButtons
          :cancel-label="t('global.buttons.exit')"
          :is-submitting="isSubmitting"
          :is-form-valid="isFormValid"
          @cancel="handleCancel"
          @submit="onSave"
        />
      </div>
    </template>
  </AvDrawer>
</template>

<style scoped lang="scss">
.placeholder-content {
  font-style: italic;
}
</style>
