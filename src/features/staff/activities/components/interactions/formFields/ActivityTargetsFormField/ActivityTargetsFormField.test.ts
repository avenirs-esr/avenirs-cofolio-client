import type { ActivityDraftUpdateRequest } from '@/api/avenir-esr'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import {
  mockedDevProgramOptionNode,
  mockedDevStudentGroupNode,
  mockedOutOfScopeTargetId,
  mockedPrimaryInstitutionNode,
  mockedProgramNode,
  mockedProgramStudentGroupNode,
  mockedSecondaryInstitutionNode,
} from '@/__mocks__/fixtures/staffs/staff-scope.fixtures'
import { getStaffScopeErrorHandler } from '@/__mocks__/msw/handlers/staffs/staff-scope.handlers'
import { server } from '@/__mocks__/msw/server'
import { EActivityThematic } from '@/api/avenir-esr'
import { AutocompleteStub } from '@/common/components/interaction/selects/Autocomplete/Autocomplete.stub'
import ActivityTargetsFormField from '@/features/staff/activities/components/interactions/formFields/ActivityTargetsFormField/ActivityTargetsFormField.vue'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { ToggleParameterCardStub } from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.stub'
import { AvButtonStub, AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

interface MountFieldOptions {
  institutionIds?: string[]
  groupIds?: string[]
  persistedIds?: string[]
  lockPersisted?: boolean
  isNational?: boolean
}

const onAutosave = vi.fn<(value: ActivityDraftUpdateRequest) => void>()

function mountField ({ institutionIds = [], groupIds = [], persistedIds = [], lockPersisted = false, isNational = false }: MountFieldOptions = {}) {
  const TestWrapper = defineComponent({
    setup () {
      const defaultValues: EditActivityFormData = {
        title: 'Test activity',
        thematic: EActivityThematic.TRANSVERSAL,
        description: '',
        enableReflection: true,
        recommendedCompletionContexts: '',
        startDate: undefined,
        endDate: undefined,
        feedbackAllowedIterations: undefined,
        summary: '',
        traceAllowedAssociations: ACTIVITY_TRACE_SETTING_INFINITY_VALUE,
        bannerAction: EditActivityFormDataBannerAction.NONE,
        files: [],
        links: [],
        isNational,
        targetInstitutionIds: institutionIds,
        targetGroupIds: groupIds,
      }
      const form = useForm({ defaultValues })
      return { form, persistedIds, lockPersisted, onAutosave }
    },
    components: { ActivityTargetsFormField },
    template: `
      <ActivityTargetsFormField
        :form="form"
        :persisted-ids="persistedIds"
        :lock-persisted="lockPersisted"
        @autosave="onAutosave"
      />
    `,
  })

  return mountComponent(TestWrapper, {
    global: {
      stubs: {
        Autocomplete: AutocompleteStub,
        ToggleParameterCard: ToggleParameterCardStub,
        AvButton: AvButtonStub,
        AvMessage: AvMessageStub,
      },
    },
  })
}

BddTest().given('an ActivityTargetsFormField component', () => {
  let wrapper: ReturnType<typeof mountField>

  const getAutocomplete = () => wrapper.findComponent(AutocompleteStub) as VueWrapper<InstanceType<typeof AutocompleteStub>>
  const getOptions = () => getAutocomplete().props('options') as AvAutocompleteOption[]
  const getOption = (id: string) => getOptions().find(option => option.value === id)!
  const getNationalToggle = () => wrapper.findComponent(ToggleParameterCardStub) as VueWrapper<InstanceType<typeof ToggleParameterCardStub>>
  const getActivityTargetsScopeMessage = () => wrapper.find('[data-testid="activity-targets-scope-message"]')
  const getSelectedItems = () => wrapper.findAll('[data-testid="activity-targets-selected-item"]')
  const getRemoveButtons = () => wrapper.findAllComponents(AvButtonStub) as VueWrapper<InstanceType<typeof AvButtonStub>>[]

  const select = async (...ids: string[]) => {
    getAutocomplete().vm.$emit('update:modelValue', ids.map(getOption))
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the staff scope is loaded', () => {
    beforeEach(async () => {
      wrapper = mountField({ isNational: true })
      await flushPromises()
    })

    BddTest().then('it should offer the targets grouped by type with their hierarchical context', () => {
      expect(getOptions()).toEqual([
        { value: mockedPrimaryInstitutionNode.id, label: mockedPrimaryInstitutionNode.title, description: 'Établissement' },
        { value: mockedSecondaryInstitutionNode.id, label: mockedSecondaryInstitutionNode.title, description: `Établissement · ${mockedPrimaryInstitutionNode.title}` },
        { value: mockedProgramNode.id, label: mockedProgramNode.title, description: 'Formation' },
        { value: mockedDevProgramOptionNode.id, label: mockedDevProgramOptionNode.title, description: `Option de formation · ${mockedProgramNode.title}` },
        { value: mockedDevStudentGroupNode.id, label: mockedDevStudentGroupNode.title, description: `Groupe d'étudiants · ${mockedProgramNode.title} › ${mockedDevProgramOptionNode.title}` },
        { value: mockedProgramStudentGroupNode.id, label: mockedProgramStudentGroupNode.title, description: `Groupe d'étudiants · ${mockedProgramNode.title}` },
      ])
    })

    BddTest().then('it should flag the activity as national and disable the targets selection', () => {
      expect(getNationalToggle().props('modelValue')).toBe(true)
      expect(getAutocomplete().props('inputOptions')).toMatchObject({ disabled: true })
      expect(getActivityTargetsScopeMessage().text()).toContain('Activité nationale')
      expect(getSelectedItems()).toHaveLength(0)
    })
  })

  BddTest().when('the national toggle is switched on while targets are selected', () => {
    beforeEach(async () => {
      wrapper = mountField({ institutionIds: [mockedSecondaryInstitutionNode.id] })
      await flushPromises()
      getNationalToggle().vm.$emit('update:modelValue', true)
      await flushPromises()
    })

    BddTest().then('it should clear the targets and autosave the national scope', () => {
      expect(getSelectedItems()).toHaveLength(0)
      expect(onAutosave).toHaveBeenCalledWith({ targetInstitutionIds: [], targetGroupIds: [] })
    })
  })

  BddTest().when('the national toggle is switched off', () => {
    beforeEach(async () => {
      wrapper = mountField({ isNational: true })
      await flushPromises()
      getNationalToggle().vm.$emit('update:modelValue', false)
      await flushPromises()
    })

    BddTest().then('it should enable the targets selection without autosaving', () => {
      expect(getAutocomplete().props('inputOptions')).toMatchObject({ disabled: false })
      expect(onAutosave).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the activity already has targets', () => {
    beforeEach(async () => {
      wrapper = mountField({
        institutionIds: [mockedSecondaryInstitutionNode.id],
        groupIds: [mockedDevProgramOptionNode.id, mockedOutOfScopeTargetId],
      })
      await flushPromises()
    })

    BddTest().then('it should flag the activity as targeted', () => {
      expect(getActivityTargetsScopeMessage().text()).toContain('Activité ciblée')
    })

    BddTest().then('it should display the existing targets with their type', () => {
      expect(getSelectedItems().map(item => item.text())).toEqual([
        `Établissement${mockedSecondaryInstitutionNode.title}`,
        `Option de formation${mockedDevProgramOptionNode.title}`,
        'Formation ou groupeCible hors de votre périmètre',
      ])
    })

    BddTest().then('it should only preselect the targets available in the scope', () => {
      expect(getAutocomplete().props('modelValue')).toEqual([getOption(mockedSecondaryInstitutionNode.id), getOption(mockedDevProgramOptionNode.id)])
    })
  })

  BddTest().when('the staff selects targets', () => {
    beforeEach(async () => {
      wrapper = mountField()
      await flushPromises()
    })

    BddTest().then('it should save an institution as a target institution', async () => {
      await select(mockedPrimaryInstitutionNode.id)

      expect(onAutosave).toHaveBeenLastCalledWith({ targetInstitutionIds: [mockedPrimaryInstitutionNode.id], targetGroupIds: [] })
    })

    BddTest().then('it should save a program as a target group', async () => {
      await select(mockedProgramNode.id)

      expect(onAutosave).toHaveBeenLastCalledWith({ targetInstitutionIds: [], targetGroupIds: [mockedProgramNode.id] })
    })

    BddTest().then('it should save a program option as a target group', async () => {
      await select(mockedDevProgramOptionNode.id)

      expect(onAutosave).toHaveBeenLastCalledWith({ targetInstitutionIds: [], targetGroupIds: [mockedDevProgramOptionNode.id] })
    })

    BddTest().then('it should save a student group as a target group', async () => {
      await select(mockedDevStudentGroupNode.id)

      expect(onAutosave).toHaveBeenLastCalledWith({ targetInstitutionIds: [], targetGroupIds: [mockedDevStudentGroupNode.id] })
    })

    BddTest().then('it should accept several types simultaneously, including a hierarchy redundancy', async () => {
      await select(mockedPrimaryInstitutionNode.id, mockedProgramNode.id, mockedDevProgramOptionNode.id, mockedDevStudentGroupNode.id)

      expect(onAutosave).toHaveBeenLastCalledWith({
        targetInstitutionIds: [mockedPrimaryInstitutionNode.id],
        targetGroupIds: [mockedProgramNode.id, mockedDevProgramOptionNode.id, mockedDevStudentGroupNode.id],
      })
      expect(getSelectedItems()).toHaveLength(4)
    })
  })

  BddTest().when('the activity is not locked (draft or unpublished)', () => {
    beforeEach(async () => {
      wrapper = mountField({
        institutionIds: [mockedPrimaryInstitutionNode.id],
        groupIds: [mockedProgramNode.id],
        persistedIds: [mockedPrimaryInstitutionNode.id, mockedProgramNode.id],
      })
      await flushPromises()
    })

    BddTest().then('it should let the staff remove a persisted target', async () => {
      expect(getRemoveButtons()[0]!.props('disabled')).toBeFalsy()

      getRemoveButtons()[0]!.vm.$emit('click', new Event('click'))
      await flushPromises()

      expect(onAutosave).toHaveBeenLastCalledWith({ targetInstitutionIds: [], targetGroupIds: [mockedProgramNode.id] })
    })

    BddTest().then('it should not display the locked information message', () => {
      expect(wrapper.find('[data-testid="activity-targets-locked-message"]').exists()).toBe(false)
    })

    BddTest().then('it should let the staff deselect a persisted target from the selector', async () => {
      await select(mockedProgramNode.id)

      expect(onAutosave).toHaveBeenLastCalledWith({ targetInstitutionIds: [], targetGroupIds: [mockedProgramNode.id] })
    })
  })

  BddTest().when('the activity is locked (published with enrolled students)', () => {
    beforeEach(async () => {
      wrapper = mountField({
        institutionIds: [mockedPrimaryInstitutionNode.id],
        groupIds: [mockedProgramNode.id, mockedOutOfScopeTargetId],
        persistedIds: [mockedPrimaryInstitutionNode.id, mockedProgramNode.id, mockedOutOfScopeTargetId],
        lockPersisted: true,
      })
      await flushPromises()
    })

    BddTest().then('it should explain why persisted targets cannot be removed', () => {
      expect(wrapper.find('[data-testid="activity-targets-locked-message"]').text()).toContain('ne peuvent plus être retirées')
    })

    BddTest().then('it should disable the removal of every persisted target', () => {
      expect(getRemoveButtons().map(button => button.props('disabled'))).toEqual([true, true, true])
    })

    BddTest().then('it should keep persisted targets when the selector tries to deselect them', async () => {
      await select()

      expect(onAutosave).toHaveBeenLastCalledWith({
        targetInstitutionIds: [mockedPrimaryInstitutionNode.id],
        targetGroupIds: [mockedProgramNode.id, mockedOutOfScopeTargetId],
      })
    })

    BddTest().then('it should still allow adding a new target, then removing it before saving', async () => {
      await select(mockedPrimaryInstitutionNode.id, mockedProgramNode.id, mockedDevStudentGroupNode.id)

      expect(onAutosave).toHaveBeenLastCalledWith({
        targetInstitutionIds: [mockedPrimaryInstitutionNode.id],
        targetGroupIds: [mockedProgramNode.id, mockedOutOfScopeTargetId, mockedDevStudentGroupNode.id],
      })

      const newTargetButton = getRemoveButtons()[3]!
      expect(newTargetButton.props('disabled')).toBeFalsy()

      newTargetButton.vm.$emit('click', new Event('click'))
      await flushPromises()

      expect(onAutosave).toHaveBeenLastCalledWith({
        targetInstitutionIds: [mockedPrimaryInstitutionNode.id],
        targetGroupIds: [mockedProgramNode.id, mockedOutOfScopeTargetId],
      })
    })
  })

  BddTest().when('the staff scope cannot be fetched', () => {
    beforeEach(async () => {
      server.use(getStaffScopeErrorHandler)
      wrapper = mountField()
      await flushPromises()
    })

    BddTest().then('it should not render the selector', () => {
      expect(getAutocomplete().exists()).toBe(false)
    })
  })
})
