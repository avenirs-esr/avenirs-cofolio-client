import type { ComponentMountingOptions, VueWrapper } from '@vue/test-utils'
import type { EditActivityFormData } from '@/features/staff/activities/types/forms.types'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvMessageStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { useForm } from '@tanstack/vue-form'
import { mount } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import { EActivityThematic } from '@/api/avenir-esr'
import ActivityAssessmentFormFieldsContainer from '@/features/staff/activities/components/interactions/ActivityAssessmentFormFieldsContainer/ActivityAssessmentFormFieldsContainer.vue'
import { ActivityAssessmentCommentFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentCommentFormField/ActivityAssessmentCommentFormField.stub'
import { ActivityAssessmentGradeFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentGradeFormField/ActivityAssessmentGradeFormField.stub'
import { ActivityAssessmentValidationFormFieldStub } from '@/features/staff/activities/components/interactions/formFields/ActivityAssessmentValidationFormField/ActivityAssessmentValidationFormField.stub'
import { ACTIVITY_TRACE_SETTING_INFINITY_VALUE } from '@/features/staff/activities/config'
import { EditActivityFormDataBannerAction } from '@/features/staff/activities/types/forms.types'
import { ToggleParameterCardStub } from '@/features/staff/global/components/cards/ToggleParameterCard/ToggleParameterCard.stub'

const DESCRIPTION = 'Activez cette option pour permettre une évaluation finale des apprenants. Cette évaluation entraînera la clôture de l\'activité.'
const DISABLED_INFORMATION = 'Ce paramètre ne peut plus être modifié car des apprenants sont déjà inscrits à cette activité.'
const TITLE = 'Évaluation de l\'activité'
const WILL_BE_DISABLED_INFORMATION = 'Après l\'inscription d\'un premier apprenant, ce paramètre ne pourra plus être modifié.'

type MountingOptions = ComponentMountingOptions<typeof ActivityAssessmentFormFieldsContainer>
type ContainerProps = Omit<MountingOptions['props'], 'form'>
type ErrorField = 'assessmentGrade' | 'assessmentValidation'

function createTestWrapper (overrides: Partial<EditActivityFormData>, props: ContainerProps) {
  return defineComponent({
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
        isNational: false,
        assessmentComment: false,
        assessmentGrade: undefined,
        assessmentValidation: false,
        targetInstitutionIds: [],
        targetGroupIds: [],
        ...overrides,
      }
      const form = useForm({ defaultValues })
      return {
        form,
        props,
      }
    },
    components: { ActivityAssessmentFormFieldsContainer },
    template: '<ActivityAssessmentFormFieldsContainer :form="form" v-bind="props" />',
  })
}

BddTest().given('an ActivityAssessmentFormFieldsContainer component', () => {
  let wrapper: VueWrapper<InstanceType<ReturnType<typeof createTestWrapper>>>

  const stubs = {
    ActivityAssessmentCommentFormField: ActivityAssessmentCommentFormFieldStub,
    ActivityAssessmentGradeFormField: ActivityAssessmentGradeFormFieldStub,
    ActivityAssessmentValidationFormField: ActivityAssessmentValidationFormFieldStub,
    AvMessage: AvMessageStub,
    ToggleParameterCard: ToggleParameterCardStub,
  }

  const mountWith = (overrides: Partial<EditActivityFormData> = {}, props: ContainerProps = {}) => {
    wrapper = mount(createTestWrapper(overrides, props), {
      global: { stubs },
    })
  }

  const getForm = () => wrapper.vm.form
  const getContainer = () => wrapper.findComponent(ActivityAssessmentFormFieldsContainer) as VueWrapper<InstanceType<typeof ActivityAssessmentFormFieldsContainer>>
  const getParameterCard = () => wrapper.findComponent(ToggleParameterCardStub)
  const getCommentField = () => wrapper.findComponent(ActivityAssessmentCommentFormFieldStub)
  const getValidationField = () => wrapper.findComponent(ActivityAssessmentValidationFormFieldStub)
  const getGradeField = () => wrapper.findComponent(ActivityAssessmentGradeFormFieldStub)
  const getDescription = () => wrapper.find('[data-testid="assessment-parameter-description"]')

  const findMessage = (testId: string) => wrapper.findAllComponents(AvMessageStub).find(message => message.vm.$attrs['data-testid'] === testId)
  const getInformationMessage = () => findMessage('assessment-parameter-information')
  const getOptionsError = () => findMessage('assessment-options-error')

  const getValues = () => getForm().state.values
  const getFieldErrors = (name: ErrorField) => getForm().getFieldMeta(name)?.errors ?? []
  const getAutosaves = () => getContainer().emitted('autosave')
  const getLastAutosave = () => getAutosaves()?.at(-1)?.[0]
  const getLastAssessmentEnabledUpdate = () => getContainer().emitted('updateAssessmentEnabled')?.at(-1)?.[0]
  const getLastGradeEnabledUpdate = () => getContainer().emitted('updateGradeEnabled')?.at(-1)?.[0]

  const setAssessmentEnabled = async (value: boolean) => {
    getParameterCard().vm.$emit('update:modelValue', value)
    await wrapper.vm.$nextTick()
  }

  const setComment = async (value: boolean) => {
    getForm().setFieldValue('assessmentComment', value)
    getCommentField().vm.$emit('change')
    await wrapper.vm.$nextTick()
  }

  const setGradeEnabled = async (value: boolean) => {
    const gradeField = getGradeField()
    gradeField.vm.$emit('updateGradeEnabled', value)

    if (!value) {
      getForm().setFieldValue('assessmentGrade', undefined)
      gradeField.vm.$emit('change')
    }

    await wrapper.vm.$nextTick()
  }

  const setGrade = async (value: number | undefined) => {
    getForm().setFieldValue('assessmentGrade', value)
    getGradeField().vm.$emit('change')
    await wrapper.vm.$nextTick()
  }

  const setValidation = async (value: boolean) => {
    getForm().setFieldValue('assessmentValidation', value)
    getValidationField().vm.$emit('change')
    await wrapper.vm.$nextTick()
  }

  const setFieldError = async (name: ErrorField, error: string) => {
    getForm().setFieldMeta(name, prev => ({
      ...prev,
      errorMap: { onSubmit: error }
    }))
    await wrapper.vm.$nextTick()
  }

  BddTest().when('the component is mounted without assessment', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render the card unchecked, with the correct title, icon and description', () => {
      expect(getParameterCard().props()).toMatchObject({
        modelValue: false,
        title: TITLE,
        icon: MDI_ICONS.TEXT_BOX_CHECK_OUTLINE,
      })
      expect(getDescription().text()).toBe(DESCRIPTION)
    })

    BddTest().then('it should render the future disabled information message', () => {
      expect(getInformationMessage()?.props('message')).toBe(WILL_BE_DISABLED_INFORMATION)
    })

    BddTest().then('it should not render the options', () => {
      expect(getCommentField().exists()).toBe(false)
      expect(getValidationField().exists()).toBe(false)
      expect(getGradeField().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted disabled', () => {
    const disabledProps = {
      disabled: true,
      disabledTooltip: 'Disabled tooltip',
    }

    beforeEach(() => {
      mountWith({
        assessmentComment: true
      }, disabledProps)
    })

    BddTest().then('it should forward the disabled state to the parameter card and the options', () => {
      expect(getParameterCard().props()).toMatchObject(disabledProps)
      expect(getCommentField().props()).toMatchObject(disabledProps)
      expect(getValidationField().props()).toMatchObject(disabledProps)
      expect(getGradeField().props()).toMatchObject(disabledProps)
    })

    BddTest().then('it should render the disabled information message', () => {
      expect(getInformationMessage()?.props('message')).toBe(DISABLED_INFORMATION)
    })
  })

  BddTest().when('the assessment is enabled', () => {
    beforeEach(async () => {
      mountWith()
      await setAssessmentEnabled(true)
    })

    BddTest().then('it should render the options', () => {
      expect(getCommentField().exists()).toBe(true)
      expect(getValidationField().exists()).toBe(true)
      expect(getGradeField().exists()).toBe(true)
    })

    BddTest().then('it should emit the assessment as enabled', () => {
      expect(getLastAssessmentEnabledUpdate()).toBe(true)
    })

    BddTest().then('it should not emit autosave while no option is selected', () => {
      expect(getAutosaves()).toBeFalsy()
    })

    BddTest().and('an option is checked', () => {
      beforeEach(async () => {
        await setComment(true)
      })

      BddTest().then('it should emit autosave with the option', () => {
        expect(getLastAutosave()).toEqual({
          assessment: {
            comment: true
          }
        })
      })
    })
  })

  BddTest().when('the options error is set', () => {
    const optionsError = 'Options error'

    beforeEach(async () => {
      mountWith()
      await setAssessmentEnabled(true)
      await setFieldError('assessmentValidation', optionsError)
    })

    BddTest().then('it should display it below the options', () => {
      expect(getOptionsError()?.props('message')).toBe(optionsError)
    })

    BddTest().and('an option is checked', () => {
      beforeEach(async () => {
        await setComment(true)
      })

      BddTest().then('it should clear the options error', () => {
        expect(getOptionsError()).toBeUndefined()
      })
    })

    BddTest().and('the grade option is enabled', () => {
      beforeEach(async () => {
        await setGradeEnabled(true)
      })

      BddTest().then('it should clear the options error', () => {
        expect(getOptionsError()).toBeUndefined()
      })
    })
  })

  BddTest().when('the component is mounted with a comment', () => {
    beforeEach(() => {
      mountWith({
        assessmentComment: true
      })
    })

    BddTest().then('it should render the card checked', () => {
      expect(getParameterCard().props('modelValue')).toBe(true)
    })

    BddTest().then('it should render all the options', () => {
      expect(getCommentField().exists()).toBe(true)
      expect(getValidationField().exists()).toBe(true)
      expect(getGradeField().exists()).toBe(true)
    })

    BddTest().then('it should emit the initial assessment state', () => {
      expect(getLastAssessmentEnabledUpdate()).toBe(true)
    })

    BddTest().and('the only option is unchecked', () => {
      beforeEach(async () => {
        await setComment(false)
      })

      BddTest().then('it should keep the card checked', () => {
        expect(getParameterCard().props('modelValue')).toBe(true)
      })

      BddTest().then('it should not emit autosave', () => {
        expect(getAutosaves()).toBeFalsy()
      })
    })

    BddTest().and('the validation option is checked', () => {
      beforeEach(async () => {
        await setValidation(true)
      })

      BddTest().then('it should hide the grade option', () => {
        expect(getCommentField().exists()).toBe(true)
        expect(getValidationField().exists()).toBe(true)
        expect(getGradeField().exists()).toBe(false)
      })

      BddTest().then('it should emit autosave with all the selected options', () => {
        expect(getLastAutosave()).toEqual({
          assessment: {
            comment: true,
            validation: true
          }
        })
      })
    })
  })

  BddTest().when('the grade option is enabled', () => {
    beforeEach(async () => {
      mountWith({
        assessmentComment: true
      })
      await setGradeEnabled(true)
    })

    BddTest().then('it should hide the validation option', () => {
      expect(getCommentField().exists()).toBe(true)
      expect(getValidationField().exists()).toBe(false)
      expect(getGradeField().exists()).toBe(true)
    })

    BddTest().then('it should emit the grade as enabled', () => {
      expect(getLastGradeEnabledUpdate()).toBe(true)
    })

    BddTest().then('it should not emit autosave while the grade is invalid', () => {
      expect(getAutosaves()).toBeFalsy()
    })

    BddTest().and('another option is changed while the grade is invalid', () => {
      beforeEach(async () => {
        await setComment(false)
      })

      BddTest().then('it should not emit autosave', () => {
        expect(getAutosaves()).toBeFalsy()
      })
    })

    BddTest().and('a valid grade is set', () => {
      beforeEach(async () => {
        await setGrade(12.5)
      })

      BddTest().then('it should emit autosave with the grade', () => {
        expect(getLastAutosave()).toEqual({
          assessment: {
            comment: true,
            grade: 12.5
          }
        })
      })
    })
  })

  BddTest().when('the component is mounted with a comment and a grade', () => {
    beforeEach(() => {
      mountWith({
        assessmentComment: true,
        assessmentGrade: 20
      })
    })

    BddTest().then('it should hide the validation option', () => {
      expect(getCommentField().exists()).toBe(true)
      expect(getValidationField().exists()).toBe(false)
      expect(getGradeField().exists()).toBe(true)
    })

    BddTest().then('it should emit the initial grade state', () => {
      expect(getLastGradeEnabledUpdate()).toBe(true)
    })

    BddTest().and('the grade option is disabled', () => {
      beforeEach(async () => {
        await setGradeEnabled(false)
      })

      BddTest().then('it should show the validation option again', () => {
        expect(getCommentField().exists()).toBe(true)
        expect(getValidationField().exists()).toBe(true)
        expect(getGradeField().exists()).toBe(true)
      })

      BddTest().then('it should emit the grade as disabled', () => {
        expect(getLastGradeEnabledUpdate()).toBe(false)
      })

      BddTest().then('it should emit autosave without the grade', () => {
        expect(getLastAutosave()).toEqual({
          assessment: {
            comment: true
          }
        })
      })
    })

    BddTest().and('the comment is unchecked while the grade has an error', () => {
      const gradeError = 'Grade error'

      beforeEach(async () => {
        await setFieldError('assessmentGrade', gradeError)
        await setComment(false)
      })

      BddTest().then('it should keep the grade error', () => {
        expect(getFieldErrors('assessmentGrade')).toEqual([gradeError])
      })
    })

    BddTest().and('the assessment is disabled while errors are displayed', () => {
      beforeEach(async () => {
        await setFieldError('assessmentGrade', 'Grade error')
        await setFieldError('assessmentValidation', 'Options error')
        await setAssessmentEnabled(false)
      })

      BddTest().then('it should hide the options', () => {
        expect(getCommentField().exists()).toBe(false)
        expect(getValidationField().exists()).toBe(false)
        expect(getGradeField().exists()).toBe(false)
      })

      BddTest().then('it should reset the options', () => {
        expect(getValues()).toMatchObject({
          assessmentComment: false,
          assessmentGrade: undefined,
          assessmentValidation: false,
        })
      })

      BddTest().then('it should clear the errors', () => {
        expect(getFieldErrors('assessmentGrade')).toEqual([])
        expect(getFieldErrors('assessmentValidation')).toEqual([])
      })

      BddTest().then('it should emit autosave with an empty assessment', () => {
        expect(getLastAutosave()).toEqual({
          assessment: {}
        })
      })

      BddTest().then('it should emit the assessment and the grade as disabled', () => {
        expect(getLastAssessmentEnabledUpdate()).toBe(false)
        expect(getLastGradeEnabledUpdate()).toBe(false)
      })
    })
  })
})
