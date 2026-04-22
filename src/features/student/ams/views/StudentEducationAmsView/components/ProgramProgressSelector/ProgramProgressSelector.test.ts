import { mockedProgramsProgressView } from '@/__mocks__/fixtures/student'
import { createProgramProgressViewHandler } from '@/__mocks__/msw/handlers/student/program-progress.handlers'
import { server } from '@/__mocks__/msw/server'
import { useAmsStore } from '@/features/student/ams/stores/ams.store'
import ProgramProgressSelector from '@/features/student/ams/views/StudentEducationAmsView/components/ProgramProgressSelector/ProgramProgressSelector.vue'
import { AvTagPickerStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a program progress selector', () => {
  let wrapper: VueWrapper<InstanceType<typeof ProgramProgressSelector>>

  const stubs = {
    AvTagPicker: AvTagPickerStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().and('without initial selected program', () => {
    beforeEach(() => {
      server.use(createProgramProgressViewHandler(mockedProgramsProgressView))
      wrapper = mountComponent(ProgramProgressSelector, {
        global: {
          stubs,
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

      BddTest().then('programs should be converted to options correctly', async () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const expectedOptions = mockedProgramsProgressView.map(program => ({
          label: program.name,
          value: program.id
        }))
        await vi.waitFor(() => expect(tagPicker.props('options')).toEqual(expectedOptions))
      })

      BddTest().then('the label should be passed to AvTagPicker', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('label')).toBe('Mes formations :')
      })
    })

    BddTest().when('a user clicks on an option button', () => {
      beforeEach(async () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const expectedOptions = mockedProgramsProgressView.map(program => ({
          label: program.name,
          value: program.id
        }))
        await vi.waitFor(() => expect(tagPicker.props('options')).toEqual(expectedOptions))

        expect(tagPicker.findAll('button').length).toBeGreaterThanOrEqual(1)

        await tagPicker.findAll('button')[1].trigger('click')
      })

      BddTest().then('the selectedProgramProgressId model should be updated', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockedProgramsProgressView[1].name,
          value: mockedProgramsProgressView[1].id
        })
      })

      BddTest().then('the currentPage should be reset to 0', () => {
        const store = useAmsStore()
        expect(store.currentPage).toBe(0)
      })
    })
  })

  BddTest().and('with initial selected program', () => {
    beforeEach(async () => {
      server.use(createProgramProgressViewHandler(mockedProgramsProgressView))
      wrapper = mountComponent(ProgramProgressSelector, {
        props: {
          modelValue: mockedProgramsProgressView[0].id
        },
        global: {
          stubs,
        }
      })
      await flushPromises()
    })

    BddTest().when('the component is rendered', () => {
      BddTest().then('the AvTagPicker should receive the selected program as a mapped option', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockedProgramsProgressView[0].name,
          value: mockedProgramsProgressView[0].id
        })
      })
    })
  })

  BddTest().and('with empty programs array', () => {
    beforeEach(() => {
      server.use(createProgramProgressViewHandler([]))
      wrapper = mountComponent(ProgramProgressSelector, {
        global: {
          stubs,
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
      server.use(createProgramProgressViewHandler(mockedProgramsProgressView))
      wrapper = mountComponent(ProgramProgressSelector, {
        global: {
          stubs,
        }
      })

      await wrapper.vm.$nextTick()
      await flushPromises()
    })

    BddTest().when('the programs are fetched', () => {
      BddTest().then('the first program should be automatically selected', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: mockedProgramsProgressView[0].name,
          value: mockedProgramsProgressView[0].id
        })
      })
    })
  })

  BddTest().and('the programs are not yet fetched', () => {
    beforeEach(() => {
      server.use(createProgramProgressViewHandler([]))
      wrapper = mountComponent(ProgramProgressSelector, {
        global: {
          stubs,
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
})
