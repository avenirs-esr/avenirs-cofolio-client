import type { BaseApiException } from '@/common/exceptions'
import type { UseQueryDefinedReturnType } from '@tanstack/vue-query'
import type { Ref } from 'vue'
import { EDurationUnit, type TrainingPathDTO } from '@/api/avenir-esr'

import { useAmsStore } from '@/features/student/ams/stores/ams.store'
import ProgramProgressSelector from '@/features/student/ams/views/StudentEducationAmsView/components/ProgramProgressSelector/ProgramProgressSelector.vue'
import { useAllMyProgramProgressQuery } from '@/features/student/skills'
import { AvTagPickerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/features/student/skills', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/features/student/skills')>()
  return {
    ...actual,
    useAllMyProgramProgressQuery: vi.fn()
  }
})

const mockedUseAllMyProgramProgressQuery = vi.mocked(useAllMyProgramProgressQuery)

BddTest().given('a program progress selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProgramProgressSelector>>

  const stubs = {
    AvTagPicker: AvTagPickerStub
  }

  const mockPrograms: TrainingPathDTO[] = [
    {
      id: '1',
      name: 'Master Chimie Verte et Éco-Innovations USMB (2 ans)',
      durationUnit: EDurationUnit.YEAR,
      durationCount: 2
    },
    {
      id: '2',
      name: 'Master Biologie marine USMB (2 ans)',
      durationUnit: EDurationUnit.YEAR,
      durationCount: 2
    },
    {
      id: '3',
      name: 'Master Sciences de l\'Environnement (1 an)',
      durationUnit: EDurationUnit.YEAR,
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

  BddTest().and('without initial selected program', () => {
    beforeEach(() => {
      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    BddTest().when('the component is rendered', () => {
      BddTest().then('it should render the selector container', () => {
        expect(wrapper.find('.program-progress-selector').exists()).toBe(true)
      })

      BddTest().then('it should render the AvTagPicker', () => {
        expect(wrapper.findComponent({ name: 'AvTagPicker' }).exists()).toBe(true)
      })

      BddTest().then('programs should be converted to options correctly', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const expectedOptions = mockPrograms.map(program => ({
          label: program.name,
          value: program.id
        }))
        expect(tagPicker.props('options')).toEqual(expectedOptions)
      })

      BddTest().then('the label should be passed to AvTagPicker', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('label')).toBe('Mes formations :')
      })
    })

    BddTest().when('a user clicks on an option button', () => {
      beforeEach(async () => {
        const optionButton = wrapper.find('[data-testid="option-2"]')
        await optionButton.trigger('click')
      })

      BddTest().then('the selectedProgramProgressId model should be updated', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[1].name,
          value: mockPrograms[1].id
        })
      })

      BddTest().then('the currentPage should be reset to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })

    BddTest().when('a new option is selected via the handler', () => {
      beforeEach(async () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const selectedOption = {
          label: mockPrograms[2].name,
          value: mockPrograms[2].id
        }
        await tagPicker.props('handleSelectChange')(selectedOption)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('the selectedProgramProgressId model should be updated', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[2].name,
          value: mockPrograms[2].id
        })
      })

      BddTest().then('the currentPage should be reset to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })
  })

  BddTest().and('with initial selected program', () => {
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

    BddTest().when('the component is rendered', () => {
      BddTest().then('the AvTagPicker should receive the selected program as a mapped option', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[0].name,
          value: mockPrograms[0].id
        })
      })
    })
  })

  BddTest().and('with empty programs array', () => {
    beforeEach(() => {
      mockUseAllMyProgramProgressQuery([])
      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    BddTest().when('the component is rendered', () => {
      BddTest().then('the AvTagPicker should receive an empty options array', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('options')).toEqual([])
      })
    })
  })

  BddTest().and('the programs are fetched and no program is initially selected', () => {
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

    BddTest().when('the programs are fetched', () => {
      BddTest().then('the first program should be automatically selected', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockPrograms[0].name,
          value: mockPrograms[0].id
        })
      })
    })
  })

  BddTest().and('the programs are not yet fetched', () => {
    beforeEach(() => {
      mockUseAllMyProgramProgressQuery([], false)
      wrapper = mount(ProgramProgressSelector, {
        global: {
          stubs,
          plugins: [createPinia()]
        }
      })
    })

    BddTest().when('the component is mounted', () => {
      BddTest().then('no program should be automatically selected', async () => {
        await wrapper.vm.$nextTick()
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toBeUndefined()
      })
    })
  })

  BddTest().and('with specific program mapping', () => {
    const program: TrainingPathDTO = {
      id: 'test-id',
      name: 'Test Program Name',
      durationUnit: EDurationUnit.YEAR,
      durationCount: 2
    }

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

    BddTest().when('the component is rendered', () => {
      BddTest().then('the program should be correctly mapped to an AvTagPickerOption', () => {
        const expectedOption = {
          label: 'Test Program Name',
          value: 'test-id'
        }
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual(expectedOption)
      })
    })
  })

  BddTest().and('programs data changes', () => {
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

    BddTest().when('programs are loaded after initial mount', () => {
      BddTest().then('options should be updated correctly', async () => {
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
