import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { type TrainingPathDTO, TrainingPathDTODurationUnit } from '@/api/avenir-esr'
import { useAllMyProgramProgressQuery } from '@/features/student/queries'
import ProgramProgressSelector from '@/features/student/views/StudentEducationAmsView/components/ProgramProgressSelector/ProgramProgressSelector.vue'
import { useAmsStore } from '@/store'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('@/features/student/queries', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/queries')>()
  return {
    ...actual,
    useAllMyProgramProgressQuery: vi.fn()
  }
})

const mockedUseAllMyProgramProgressQuery = vi.mocked(useAllMyProgramProgressQuery)

describe('programProgressSelector', () => {
  const stubs = {
    AvTagPicker: {
      name: 'AvTagPicker',
      props: [
        'label',
        'options',
        'selected',
        'handleSelectChange'
      ],
      template: `
        <div class="av-tag-picker-stub">
          <button
            v-for="option in options"
            :key="option.value"
            :data-testid="'option-' + option.value"
            @click="handleSelectChange(option)"
          >
            {{ option.label }}
          </button>
        </div>
      `
    }
  }

  const mockPrograms: TrainingPathDTO[] = [
    {
      id: '1',
      name: 'Master Chimie Verte et Éco-Innovations USMB (2 ans)',
      durationUnit: TrainingPathDTODurationUnit.YEAR,
      durationCount: 2
    },
    {
      id: '2',
      name: 'Master Biologie marine USMB (2 ans)',
      durationUnit: TrainingPathDTODurationUnit.YEAR,
      durationCount: 2
    },
    {
      id: '3',
      name: 'Master Sciences de l\'Environnement (1 an)',
      durationUnit: TrainingPathDTODurationUnit.YEAR,
      durationCount: 2
    }
  ]

  function mockUseAllMyProgramProgressQuery (programs: TrainingPathDTO[], isFetched = true): void {
    const mockData: Ref<TrainingPathDTO[]> = ref(programs)
    const mockIsFetched: Ref<boolean> = ref(isFetched)
    const mockError: Ref<BaseApiException | null> = ref(null)

    const queryMockedData = {
      data: mockData,
      isFetched: mockIsFetched,
      error: mockError,
    } as unknown as UseQueryDefinedReturnType<TrainingPathDTO[], BaseApiException>

    mockedUseAllMyProgramProgressQuery.mockReturnValue(queryMockedData)
  }

  beforeEach(() => {
    vi.clearAllMocks()
    setActivePinia(createPinia())
    mockUseAllMyProgramProgressQuery(mockPrograms)
  })

  describe('given a program progress selector without initial selected program', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    describe('when the component is rendered', () => {
      it('then it should render the selector container', () => {
        expect(wrapper.find('.program-progress-selector').exists()).toBe(true)
      })

      it('then it should render the AvTagPicker', () => {
        expect(wrapper.findComponent({ name: 'AvTagPicker' }).exists()).toBe(true)
      })

      it('then programs should be converted to options correctly', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const expectedOptions = mockPrograms.map(program => ({
          label: program.name,
          value: program.id
        }))
        expect(tagPicker.props('options')).toEqual(expectedOptions)
      })

      it('then the label should be passed to AvTagPicker', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('label')).toBe('Mes formations :')
      })
    })

    describe('when a user clicks on an option button', () => {
      beforeEach(async () => {
        const optionButton = wrapper.find('[data-testid="option-2"]')
        await optionButton.trigger('click')
      })

      it('then the selectedProgramProgressId model should be updated', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[1].name,
          value: mockPrograms[1].id
        })
      })

      it('then the currentPage should be reset to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })

    describe('when a new option is selected via the handler', () => {
      beforeEach(async () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const selectedOption = {
          label: mockPrograms[2].name,
          value: mockPrograms[2].id
        }
        await tagPicker.props('handleSelectChange')(selectedOption)
        await wrapper.vm.$nextTick()
      })

      it('then the selectedProgramProgressId model should be updated', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[2].name,
          value: mockPrograms[2].id
        })
      })

      it('then the currentPage should be reset to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })
  })

  describe('given a program progress selector with initial selected program', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(ProgramProgressSelector, {
        props: {
          modelValue: mockPrograms[0].id
        },
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    describe('when the component is rendered', () => {
      it('then the AvTagPicker should receive the selected program as a mapped option', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[0].name,
          value: mockPrograms[0].id
        })
      })
    })
  })

  describe('given a program progress selector with empty programs array', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      mockUseAllMyProgramProgressQuery([])
      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    describe('when the component is rendered', () => {
      it('then the AvTagPicker should receive an empty options array', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('options')).toEqual([])
      })
    })
  })

  describe('given the programs are fetched and no program is initially selected', () => {
    let wrapper: VueWrapper

    beforeEach(async () => {
      const mockData: Ref<TrainingPathDTO[]> = ref(mockPrograms)
      const mockIsFetched: Ref<boolean> = ref(false)
      const mockError: Ref<BaseApiException | null> = ref(null)

      const queryMockedData = {
        data: mockData,
        isFetched: mockIsFetched,
        error: mockError,
      } as unknown as UseQueryDefinedReturnType<TrainingPathDTO[], BaseApiException>

      mockedUseAllMyProgramProgressQuery.mockReturnValue(queryMockedData)

      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })

      mockIsFetched.value = true
      await wrapper.vm.$nextTick()
    })

    describe('when the programs are fetched', () => {
      it('then the first program should be automatically selected', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[0].name,
          value: mockPrograms[0].id
        })
      })
    })
  })

  describe('given the programs are not yet fetched', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      mockUseAllMyProgramProgressQuery([], false)
      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then no program should be automatically selected', async () => {
        await wrapper.vm.$nextTick()
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toBeUndefined()
      })
    })
  })

  describe('given a program progress selector with specific program mapping', () => {
    const program: TrainingPathDTO = {
      id: 'test-id',
      name: 'Test Program Name',
      durationUnit: TrainingPathDTODurationUnit.YEAR,
      durationCount: 2
    }
    let wrapper: VueWrapper

    beforeEach(() => {
      mockUseAllMyProgramProgressQuery([program])
      wrapper = mount(ProgramProgressSelector, {
        props: {
          modelValue: program.id
        },
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    describe('when the component is rendered', () => {
      it('then the program should be correctly mapped to an AvTagPickerOption', () => {
        const expectedOption = {
          label: 'Test Program Name',
          value: 'test-id'
        }
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual(expectedOption)
      })
    })
  })

  describe('given programs data changes', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      const mockData: Ref<TrainingPathDTO[]> = ref([])
      const mockIsFetched: Ref<boolean> = ref(false)
      const mockError: Ref<BaseApiException | null> = ref(null)

      const queryMockedData = {
        data: mockData,
        isFetched: mockIsFetched,
        error: mockError,
      } as unknown as UseQueryDefinedReturnType<TrainingPathDTO[], BaseApiException>

      mockedUseAllMyProgramProgressQuery.mockReturnValue(queryMockedData)

      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    describe('when programs are loaded after initial mount', () => {
      it('then options should be updated correctly', async () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('options')).toEqual([])

        const queryReturn = mockedUseAllMyProgramProgressQuery.mock.results[0].value
        queryReturn.data.value = mockPrograms
        queryReturn.isFetched.value = true

        await wrapper.vm.$nextTick()

        expect(tagPicker.props('options')).toEqual(
          mockPrograms.map(program => ({
            label: program.name,
            value: program.id
          }))
        )
      })
    })
  })
})
