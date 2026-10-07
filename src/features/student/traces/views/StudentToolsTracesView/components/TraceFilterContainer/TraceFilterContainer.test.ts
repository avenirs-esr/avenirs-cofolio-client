import type { AvMultiselectOption } from '@avenirs-esr/avenirs-dsav'
import { TraceFilterFileTypesItem } from '@/api/avenir-esr'
import { DatePeriodPickerStub } from '@/common/components/interaction/inputs/DatePeriodPicker/DatePeriodPicker.stub'
import { FileTypeMultiselectStub } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.stub'
import { FileGlobalType } from '@/common/components/interaction/selects/FileTypeMultiselect/FileTypeMultiselect.types'
import { TraceType } from '@/features/student/traces/types/traces.types'
import TraceFilterContainer from '@/features/student/traces/views/StudentToolsTracesView/components/TraceFilterContainer/TraceFilterContainer.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const mockModalOpened = ref(false)
const mockOpenModal = vi.fn()
const mockCloseModal = vi.fn()

export const mockIsMobile = ref(false)

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useModal: () => ({
      modalOpened: mockModalOpened,
      openModal: mockOpenModal,
      closeModal: mockCloseModal
    }),
  }
})

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({
      isMobile: mockIsMobile,
    })
  }
})

interface TraceFilterContainerRefs {
  typesSelected: TraceFilterFileTypesItem[]
  fromDateSelected: string
  toDateSelected: string
  keyword: string
}

vi.mock('lodash-es', () => ({
  debounce: (fn: unknown) => fn
}))

BddTest().given('a trace filter container', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceFilterContainer>>

  const stubs = {
    AvInput: {
      name: 'AvInput',
      props: {
        modelValue: String,
        type: String,
        label: String,
        maxDate: Date,
        minDate: Date
      },
      emits: ['update:modelValue'],
      template: `
        <input
          class="av-input"
          :value="modelValue"
          :type="type"
          :min="minDate"
          :max="maxDate"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      `
    },
    AvButton: AvButtonStub,
    DatePeriodPicker: DatePeriodPickerStub,
    FileTypeMultiselect: FileTypeMultiselectStub,
  }

  BddTest().and('isAssociated is true', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      wrapper = mountComponent(TraceFilterContainer, {
        props: { isAssociated: true },
        global: { stubs },
        useTanstack: true,
        usePinia: true
      })

      await flushPromises()
    })

    BddTest().when('the trace filter container is mounted', () => {
      BddTest().then('it should render the search input', () => {
        const searchInput = wrapper.find('.search-input')
        expect(searchInput.exists()).toBe(true)
        const avInput = searchInput.getComponent({ name: 'AvInput' })
        expect(avInput.props('label')).toBe('Rechercher une trace associée')
      })

      BddTest().then('it should not render the skills multiselect', () => {
        const skillsMultiselect = wrapper.find('.skills-multiselect')
        expect(skillsMultiselect.exists()).toBe(false)
      })

      BddTest().then('it should render the date period picker with the expected placeholder', () => {
        const datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        expect(datePeriodPicker.exists()).toBe(true)
        expect(datePeriodPicker.props('type')).toBe('date')
        expect(datePeriodPicker.props('showOngoing')).toBe(false)
        expect(datePeriodPicker.props('placeholder')).toBe('Sélectionner une période')
      })

      BddTest().then('it should render the types multiselect', () => {
        const typesMultiselect = wrapper.findComponent(FileTypeMultiselectStub)
        expect(typesMultiselect.exists()).toBe(true)
      })

      BddTest().then('it should not render the statuses multiselect', () => {
        const statusesMultiselect = wrapper.find('.statuses-multiselect')
        expect(statusesMultiselect.exists()).toBe(false)
      })

      BddTest().then('it should render the reset filter button', () => {
        expect(wrapper.find('.reset-button').exists()).toBe(true)
        const resetButton = wrapper.find('.reset-button')
        expect(resetButton.exists()).toBe(true)
        const avButton = resetButton.getComponent({ name: 'AvButton' })
        expect(avButton.props('label')).toBe('Réinitialiser les filtres')
      })
    })

    BddTest().when('a keyword is typed in the search input', async () => {
      let avInput: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const searchInput = wrapper.find('.search-input')
        avInput = searchInput.getComponent({ name: 'AvInput' })
        await avInput.find('input').setValue('example')
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(avInput.emitted('update:modelValue')?.[0][0]).toEqual('example')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          fromDate: '',
          toDate: '',
          keyword: 'example'
        })
      })
    })

    BddTest().when('a start date is selected in the date period picker', async () => {
      let datePeriodPicker: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        datePeriodPicker.vm.$emit('update:startDate', '2025-10-10')
      })

      BddTest().then('it should receive the selected start date', async () => {
        expect(datePeriodPicker.emitted('update:startDate')?.[0][0]).toEqual('2025-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          fromDate: '2025-10-10',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('an end date is selected in the date period picker', async () => {
      let datePeriodPicker: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        datePeriodPicker.vm.$emit('update:endDate', '2026-10-10')
      })

      BddTest().then('it should receive the selected end date', async () => {
        expect(datePeriodPicker.emitted('update:endDate')?.[0][0]).toEqual('2026-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          fromDate: '',
          toDate: '2026-10-10',
          keyword: ''
        })
      })
    })

    BddTest().when('some types are selected in the types select', async () => {
      let typesMultiselect: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        typesMultiselect = wrapper.findComponent(FileTypeMultiselectStub)

        const select = typesMultiselect.find('select')
        await select.setValue([FileGlobalType.PDF])
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(typesMultiselect.emitted('update:modelValue')).toBeDefined()
        const emittedValues = typesMultiselect.emitted('update:modelValue')![0][0] as Array<[AvMultiselectOption[]]>
        expect(emittedValues).toEqual([{ value: FileGlobalType.PDF, label: FileGlobalType.PDF }])
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [TraceFilterFileTypesItem.PDF],
          fromDate: '',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('a link and a file type are selected in the types select', async () => {
      beforeEach(async () => {
        const typesSelect = wrapper.findComponent(FileTypeMultiselectStub).find('select')
        await typesSelect.setValue([TraceType.LINK, FileGlobalType.PDF])
      })

      BddTest().then('it should emit the link filter separately from file types', () => {
        const emitted = wrapper.emitted('update:filters')
        const lastEmitted = emitted![emitted!.length - 1][0]

        expect(lastEmitted).toEqual({
          fileTypes: [TraceFilterFileTypesItem.PDF],
          fromDate: '',
          toDate: '',
          keyword: '',
          isLink: true
        })
      })
    })

    BddTest().when('values are set', () => {
      let vm: TraceFilterContainerRefs

      beforeEach(async () => {
        vm = wrapper.vm as unknown as TraceFilterContainerRefs

        const searchInput = wrapper.find('.search-input')
        const searchAvInput = searchInput.getComponent({ name: 'AvInput' })
        await searchAvInput.find('input').setValue('example')

        const datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        datePeriodPicker.vm.$emit('update:startDate', '2025-10-10')
        datePeriodPicker.vm.$emit('update:endDate', '2026-10-10')

        const typesSelect = wrapper.findComponent(FileTypeMultiselectStub).find('select')
        await typesSelect.setValue([FileGlobalType.PDF])
      })

      BddTest().then('the values should be set in the component refs', () => {
        expect(vm.keyword).toBe('example')
        expect(vm.fromDateSelected).toBe('2025-10-10')
        expect(vm.toDateSelected).toBe('2026-10-10')
        expect(vm.typesSelected).toEqual([
          FileGlobalType.PDF
        ])
      })

      BddTest().then('the trace filter container should emit the filters', () => {
        const emitted = wrapper.emitted('update:filters')
        const lastEmitted = emitted![emitted!.length - 1][0]
        expect(lastEmitted).toEqual({
          fileTypes: [FileGlobalType.PDF],
          fromDate: '2025-10-10',
          toDate: '2026-10-10',
          keyword: 'example'
        })
      })

      BddTest().and('the reset button is clicked', () => {
        beforeEach(async () => {
          const resetButton = wrapper.find('.reset-button')
          const avButton = resetButton.findComponent({ name: 'AvButton' })
          await avButton.trigger('click')
        })

        BddTest().then('it should reset the refs', () => {
          expect(vm.keyword).toBe('')
          expect(vm.fromDateSelected).toBe('')
          expect(vm.toDateSelected).toBe('')
          expect(vm.typesSelected.length).toBe(0)
        })

        BddTest().then('the trace filter container should emit the reset filter', () => {
          const emitted = wrapper.emitted('update:filters')
          const lastEmitted = emitted![emitted!.length - 1][0]
          expect(lastEmitted).toEqual({
            fileTypes: [],
            fromDate: '',
            toDate: '',
            keyword: ''
          })
        })
      })
    })
  })

  BddTest().and('isAssociated is false', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      wrapper = mountComponent(TraceFilterContainer, {
        props: { isAssociated: false },
        global: { stubs },
        useTanstack: true,
        usePinia: true
      })

      await flushPromises()
    })

    BddTest().when('the trace filter container is mounted', () => {
      BddTest().then('it should render the search input', () => {
        const searchInput = wrapper.find('.search-input')
        expect(searchInput.exists()).toBe(true)
        const avInput = searchInput.getComponent({ name: 'AvInput' })
        expect(avInput.props('label')).toBe('Rechercher une trace non associée')
      })

      BddTest().then('it should not render the skills multiselect', () => {
        const skillsMultiselect = wrapper.find('.skills-multiselect')
        expect(skillsMultiselect.exists()).toBe(false)
      })

      BddTest().then('it should render the date period picker with the expected placeholder', () => {
        const datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        expect(datePeriodPicker.exists()).toBe(true)
        expect(datePeriodPicker.props('type')).toBe('date')
        expect(datePeriodPicker.props('showOngoing')).toBe(false)
        expect(datePeriodPicker.props('placeholder')).toBe('Sélectionner une période')
      })

      BddTest().then('it should render the types multiselect', () => {
        const typesMultiselect = wrapper.findComponent(FileTypeMultiselectStub)
        expect(typesMultiselect.exists()).toBe(true)
      })

      BddTest().then('it should not render the statuses multiselect', () => {
        const statusesMultiselect = wrapper.find('.statuses-multiselect')
        expect(statusesMultiselect.exists()).toBe(false)
      })

      BddTest().then('it should render the reset filter button', () => {
        expect(wrapper.find('.reset-button').exists()).toBe(true)
        const resetButton = wrapper.find('.reset-button')
        expect(resetButton.exists()).toBe(true)
        const avButton = resetButton.getComponent({ name: 'AvButton' })
        expect(avButton.props('label')).toBe('Réinitialiser les filtres')
      })
    })

    BddTest().when('a keyword is typed in the search input', async () => {
      let avInput: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const searchInput = wrapper.find('.search-input')
        avInput = searchInput.getComponent({ name: 'AvInput' })
        await avInput.find('input').setValue('example')
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(avInput.emitted('update:modelValue')?.[0][0]).toEqual('example')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          fromDate: '',
          toDate: '',
          keyword: 'example'
        })
      })
    })

    BddTest().when('a start date is selected in the date period picker', async () => {
      let datePeriodPicker: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        datePeriodPicker.vm.$emit('update:startDate', '2025-10-10')
      })

      BddTest().then('it should receive the selected start date', async () => {
        expect(datePeriodPicker.emitted('update:startDate')?.[0][0]).toEqual('2025-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          fromDate: '2025-10-10',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('an end date is selected in the date period picker', async () => {
      let datePeriodPicker: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        datePeriodPicker.vm.$emit('update:endDate', '2026-10-10')
      })

      BddTest().then('it should receive the selected end date', async () => {
        expect(datePeriodPicker.emitted('update:endDate')?.[0][0]).toEqual('2026-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          fromDate: '',
          toDate: '2026-10-10',
          keyword: ''
        })
      })
    })

    BddTest().when('some types are selected in the types select', async () => {
      let typesMultiselect: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        typesMultiselect = wrapper.findComponent(FileTypeMultiselectStub)

        const select = typesMultiselect.find('select')
        await select.setValue([FileGlobalType.PDF])
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(typesMultiselect.emitted('update:modelValue')).toBeDefined()
        const emittedValues = typesMultiselect.emitted('update:modelValue')![0][0] as Array<[AvMultiselectOption[]]>
        expect(emittedValues).toEqual([{ value: FileGlobalType.PDF, label: FileGlobalType.PDF }])
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [TraceFilterFileTypesItem.PDF],
          fromDate: '',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('a link and a file type are selected in the types select', async () => {
      beforeEach(async () => {
        const typesSelect = wrapper.findComponent(FileTypeMultiselectStub).find('select')
        await typesSelect.setValue([TraceType.LINK, FileGlobalType.PDF])
      })

      BddTest().then('it should emit the link filter separately from file types', () => {
        const emitted = wrapper.emitted('update:filters')
        const lastEmitted = emitted![emitted!.length - 1][0]

        expect(lastEmitted).toEqual({
          fileTypes: [TraceFilterFileTypesItem.PDF],
          fromDate: '',
          toDate: '',
          keyword: '',
          isLink: true
        })
      })
    })

    BddTest().when('values are set', () => {
      let vm: TraceFilterContainerRefs

      beforeEach(async () => {
        vm = wrapper.vm as unknown as TraceFilterContainerRefs

        const searchInput = wrapper.find('.search-input')
        const searchAvInput = searchInput.getComponent({ name: 'AvInput' })
        await searchAvInput.find('input').setValue('example')

        const datePeriodPicker = wrapper.findComponent(DatePeriodPickerStub)
        datePeriodPicker.vm.$emit('update:startDate', '2025-10-10')
        datePeriodPicker.vm.$emit('update:endDate', '2026-10-10')

        const typesSelect = wrapper.findComponent(FileTypeMultiselectStub).find('select')
        await typesSelect.setValue([FileGlobalType.PDF])
      })

      BddTest().then('the values should be set in the component refs', () => {
        expect(vm.keyword).toBe('example')
        expect(vm.fromDateSelected).toBe('2025-10-10')
        expect(vm.toDateSelected).toBe('2026-10-10')
        expect(vm.typesSelected).toEqual([
          TraceFilterFileTypesItem.PDF
        ])
      })

      BddTest().then('the trace filter container should emit the filters', () => {
        const emitted = wrapper.emitted('update:filters')
        const lastEmitted = emitted![emitted!.length - 1][0]
        expect(lastEmitted).toEqual({
          fileTypes: [TraceFilterFileTypesItem.PDF],
          fromDate: '2025-10-10',
          toDate: '2026-10-10',
          keyword: 'example'
        })
      })

      BddTest().and('the reset button is clicked', () => {
        beforeEach(async () => {
          const resetButton = wrapper.find('.reset-button')
          const avButton = resetButton.findComponent({ name: 'AvButton' })
          await avButton.trigger('click')
        })

        BddTest().then('it should reset the refs', () => {
          expect(vm.keyword).toBe('')
          expect(vm.fromDateSelected).toBe('')
          expect(vm.toDateSelected).toBe('')
          expect(vm.typesSelected.length).toBe(0)
        })

        BddTest().then('the trace filter container should emit the reset filter', () => {
          const emitted = wrapper.emitted('update:filters')
          const lastEmitted = emitted![emitted!.length - 1][0]
          expect(lastEmitted).toEqual({
            fileTypes: [],
            fromDate: '',
            toDate: '',
            keyword: ''
          })
        })
      })
    })
  })

  BddTest().and('is on mobile', () => {
    beforeEach(() => {
      mockIsMobile.value = true
    })

    BddTest().when('the component is mounted', () => {
      let wrapper: VueWrapper<InstanceType<typeof TraceFilterContainer>>

      beforeEach(async () => {
        setActivePinia(createPinia())
        wrapper = mountComponent(TraceFilterContainer, {
          props: { isAssociated: true },
          global: { stubs },
          useTanstack: true,
          usePinia: true
        })

        await flushPromises()
      })

      BddTest().then('it should render the filter button', () => {
        const buttons = wrapper.findAllComponents({ name: 'AvButton' })
        const filterButton = buttons.find(button => button.props('label') === 'Filtrer les traces')
        expect(filterButton).toBeDefined()
      })

      BddTest().and('the filter button is clicked', () => {
        beforeEach(async () => {
          const buttons = wrapper.findAllComponents({ name: 'AvButton' })
          const filterButton = buttons.find(button => button.props('label') === 'Filtrer les traces')
          await filterButton!.trigger('click')
        })

        BddTest().then('it should display the modal', () => {
          expect(mockOpenModal).toHaveBeenCalled()
        })
      })
    })
  })
})
