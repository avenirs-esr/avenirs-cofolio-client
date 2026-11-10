import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComposable } from 'tests/utils'
import { mockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student'
import { createGetAssociationsHandler } from '@/__mocks__/msw/handlers/student/associations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EAssociationContextType } from '@/api/avenir-esr'
import { useAssociationType } from '@/features/student/associations/composables/use-association-type/use-association-type'
import { countAssociations } from '@/features/student/associations/utils/associations.utils'

const { mockGetAssociateState } = vi.hoisted(() => ({
  mockGetAssociateState: vi.fn(),
}))

vi.mock('@/features/student/associations/composables/use-association-limit/use-association-limit', () => ({
  useAssociationLimits: () => ({
    getAssociateState: mockGetAssociateState,
  }),
}))

const CONTEXT = EAssociationContextType.DECLARED_EXPERIENCE
const TRACE = EAssociationContextType.TRACE
const DECLARED_ACTIVITY = EAssociationContextType.DECLARED_ACTIVITY
const SKILL = EAssociationContextType.DECLARED_SKILL
const DECLARED_PROGRAM = EAssociationContextType.DECLARED_PROGRAM
const ELEMENT_ID = 'element-1'

const SELECTABLE_TYPES = [TRACE, DECLARED_ACTIVITY, SKILL, DECLARED_PROGRAM]

function mount (overrides: Partial<Parameters<typeof useAssociationType>[0]> = {}) {
  return mountComposable(
    () => useAssociationType({
      contextType: CONTEXT,
      elementId: ELEMENT_ID,
      action: 'associate',
      ...overrides,
    }),
    { useTanstack: true, useI18n: true },
  )
}

BddTest().given('the useAssociationType composable in associate mode', () => {
  let composable: ReturnType<typeof useAssociationType>
  let unmount: () => void

  beforeEach(() => {
    vi.clearAllMocks()
    mockGetAssociateState.mockReturnValue({ disabled: false, disabledTooltip: undefined })
    const mounted = mount({ action: 'associate' })
    composable = mounted.result
    unmount = mounted.unmount
  })

  afterEach(() => {
    unmount()
  })

  BddTest().when('the selectable types are retrievde', () => {
    BddTest().then('it should exclude the current context type', () => {
      expect(composable.selectableTypes.value).toEqual(SELECTABLE_TYPES)
    })
  })

  BddTest().when('the composable is initialized', () => {
    BddTest().then('it should preselect the first selectable type', () => {
      expect(composable.selectedType.value).toBe(TRACE)
    })

    BddTest().then('selectedOption should match the preselected type', () => {
      expect(composable.selectedOption.value).toEqual(
        composable.typeOptions.value.find(o => o.value === TRACE),
      )
    })
  })

  BddTest().when('the type options are built', () => {
    BddTest().then('it should build one translated option per selectable type', () => {
      expect(composable.typeOptions.value).toEqual([
        { value: TRACE, label: 'Trace', disabled: false, disabledTooltip: undefined },
        { value: DECLARED_ACTIVITY, label: 'Activité', disabled: false, disabledTooltip: undefined },
        { value: SKILL, label: 'Compétence', disabled: false, disabledTooltip: undefined },
        { value: DECLARED_PROGRAM, label: 'Formation', disabled: false, disabledTooltip: undefined },
      ])
    })
  })

  BddTest().when('a type is limited by the association limits', () => {
    beforeEach(() => {
      mockGetAssociateState.mockImplementation((type: EAssociationContextType) =>
        type === TRACE
          ? { disabled: true, disabledTooltip: 'Limite atteinte' }
          : { disabled: false, disabledTooltip: undefined },
      )
    })

    BddTest().then('it should disable that type with its tooltip', () => {
      const traceOption = composable.typeOptions.value.find(o => o.value === TRACE)!
      expect(traceOption).toEqual({
        value: TRACE,
        label: 'Trace',
        disabled: true,
        disabledTooltip: 'Limite atteinte',
      })
    })

    BddTest().then('it should leave the other types enabled', () => {
      const others = composable.typeOptions.value.filter(o => o.value !== TRACE)
      expect(others.every(o => o.disabled === false)).toBe(true)
    })
  })

  BddTest().when('an option is selected', () => {
    beforeEach(() => {
      const programOption = composable.typeOptions.value.find(o => o.value === DECLARED_PROGRAM)!
      composable.selectedOption.value = programOption
    })

    BddTest().then('it should update selectedType', () => {
      expect(composable.selectedType.value).toBe(DECLARED_PROGRAM)
    })

    BddTest().then('the selectedOption getter should follow', () => {
      expect(composable.selectedOption.value?.value).toBe(DECLARED_PROGRAM)
    })
  })
})

BddTest().given('the useAssociationType composable in dissociate mode with declared activity associations', () => {
  let composable: ReturnType<typeof useAssociationType>
  let unmount: () => void

  beforeEach(async () => {
    vi.clearAllMocks()
    server.use(createGetAssociationsHandler(mockedDeclaredActivityAssociations))

    const mounted = mount({ action: 'dissociate' })
    composable = mounted.result
    unmount = mounted.unmount

    await vi.waitUntil(() => composable.associations.value !== undefined)
  })

  afterEach(() => {
    unmount()
  })

  BddTest().when('the request is enabled', () => {
    BddTest().then('it should not use the association limits', () => {
      expect(mockGetAssociateState).not.toHaveBeenCalled()
    })
  })

  BddTest().then('each option reflects whether the type has associations', () => {
    for (const option of composable.typeOptions.value) {
      const expectedDisabled = countAssociations(mockedDeclaredActivityAssociations, [option.value]) === 0
      expect(option.disabled).toBe(expectedDisabled)
    }
  })
})
