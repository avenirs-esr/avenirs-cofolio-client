import type { ProgramProgressDTO } from '@/api/avenir-esr'
import type { AvTagPickerOption } from '@/ui'
import ProgramProgressSelector from '@/features/student/views/StudentEducationAmsView/components/ProgramProgressSelector/ProgramProgressSelector.vue'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect } from 'vitest'

describe('programProgressSelector', () => {
  const stubs = {
    AvTagPicker: {
      name: 'AvTagPicker',
      props: [
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

  const mockPrograms: ProgramProgressDTO[] = [
    { id: '1', name: 'Master Chimie Verte et Éco-Innovations USMB (2 ans)' },
    { id: '2', name: 'Master Biologie marine USMB (2 ans)' },
    { id: '3', name: 'Master Sciences de l\'Environnement (1 an)' }
  ]

  describe('given a program progress selector without selected program', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(ProgramProgressSelector, {
        props: { programs: mockPrograms },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then it should render the selector container', () => {
        expect(wrapper.find('.program-progress-selector').exists()).toBe(true)
      })

      it('then it should render the AvTagPicker', () => {
        expect(wrapper.findComponent({ name: 'AvTagPicker' }).exists()).toBe(true)
      })

      it('then no option should be initially selected', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toBeUndefined()
      })

      it('then programs should be converted to options correctly', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const expectedOptions = mockPrograms.map(program => ({
          label: program.name,
          value: program.id
        }))
        expect(tagPicker.props('options')).toEqual(expectedOptions)
      })
    })

    describe('when a user clicks on an option button', () => {
      beforeEach(async () => {
        const optionButton = wrapper.find('[data-testid="option-2"]')
        await optionButton.trigger('click')
      })

      it('then the programSelected event should be emitted with the correct program', () => {
        expect(wrapper.emitted('programSelected')).toBeTruthy()
        const firstEmittedEventArgs = wrapper.emitted<[ProgramProgressDTO]>('programSelected')?.[0]
        expect(firstEmittedEventArgs?.[0]).toEqual(mockPrograms[1])
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

      it('then the programSelected event should be emitted with correct program', () => {
        expect(wrapper.emitted('programSelected')).toBeTruthy()
        const firstEmittedEventArgs = wrapper.emitted<[ProgramProgressDTO]>('programSelected')?.[0]
        expect(firstEmittedEventArgs?.[0]).toEqual(mockPrograms[2])
      })
    })

    describe('when an option with invalid ID is selected', () => {
      beforeEach(async () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        const invalidOption: AvTagPickerOption = {
          label: 'Non-existent Program',
          value: 'invalid-id',
        }
        await tagPicker.props('handleSelectChange')(invalidOption)
        await wrapper.vm.$nextTick()
      })

      it('then no programSelected event should be emitted', () => {
        expect(wrapper.emitted('programSelected')).toBeFalsy()
      })
    })
  })

  describe('given a program progress selector with selected program', () => {
    const selectedProgram = mockPrograms[0]
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(ProgramProgressSelector, {
        props: {
          programs: mockPrograms,
          selectedProgram
        },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then the AvTagPicker should receive the selected program as a mapped option', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('selected')).toEqual({
          label: selectedProgram.name,
          value: selectedProgram.id
        })
      })
    })
  })

  describe('given a program progress selector with empty programs array', () => {
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(ProgramProgressSelector, {
        props: { programs: [] },
        global: { stubs }
      })
    })

    describe('when the component is rendered', () => {
      it('then the AvTagPicker should receive an empty options array', () => {
        const tagPicker = wrapper.findComponent({ name: 'AvTagPicker' })
        expect(tagPicker.props('options')).toEqual([])
      })
    })
  })

  describe('given a program progress selector with specific program mapping', () => {
    const program: ProgramProgressDTO = {
      id: 'test-id',
      name: 'Test Program Name'
    }
    let wrapper: VueWrapper

    beforeEach(() => {
      wrapper = mount(ProgramProgressSelector, {
        props: {
          programs: [program],
          selectedProgram: program
        },
        global: { stubs }
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
})
