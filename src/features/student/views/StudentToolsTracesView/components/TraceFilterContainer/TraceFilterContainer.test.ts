import type { AvMultiselectOption } from '@avenirs-esr/avenirs-dsav'
import { createMockedAllSkillListItemDTO } from '@/__mocks__/fixtures/student/skills.fixtures'
import { createAllSkillsHandler } from '@/__mocks__/msw/handlers/student/skills.handlers'
import { server } from '@/__mocks__/msw/server'
import { TraceFilterFileTypesItem, TraceFilterStatusesItem } from '@/api/avenir-esr'
import TraceFilterContainer from '@/features/student/views/StudentToolsTracesView/components/TraceFilterContainer/TraceFilterContainer.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { format } from 'date-fns'
import { createPinia, setActivePinia } from 'pinia'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

interface TraceFilterContainerRefs {
  typesSelected: AvMultiselectOption[]
  statusesSelected: AvMultiselectOption[]
  skillsSelected: AvMultiselectOption[]
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
    AvMultiselect: {
      name: 'AvMultiselect',
      props: {
        modelValue: Array,
        options: Array,
        label: String,
        defaultUnselectedText: String,
        selectedText: String,
        dense: Boolean
      },
      emits: ['update:modelValue'],
      template: `
        <div :class="{ 'av-multiselect--dense': dense }">
          <label>{{ label }}</label>
          <select
            multiple
            :value="modelValue.map(o => o.value)"
            @change="$emit(
              'update:modelValue',
              Array.from($event.target.selectedOptions).map(o => ({
                label: o.text,
                value: o.value
              }))
            )"
          >
            <option
              v-for="option in options"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </option>
          </select>
          <p class="av-multiselect__caption">
            {{ modelValue.length
              ? (selectedText || modelValue.length + ' sélection(s)')
              : defaultUnselectedText
            }}
          </p>
        </div>
      `
    },
    AvButton: AvButtonStub
  }

  const mockedAllSkills = createMockedAllSkillListItemDTO()

  BddTest().and('isAssociated is true', () => {
    beforeEach(async () => {
      vi.clearAllMocks()
      setActivePinia(createPinia())
      const handler = createAllSkillsHandler(mockedAllSkills)
      server.use(handler)
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

      BddTest().then('it should render the skills multiselect', () => {
        const skillsMultiselect = wrapper.find('.skills-multiselect')
        expect(skillsMultiselect.exists()).toBe(true)
        const avMultiselect = skillsMultiselect.getComponent({ name: 'AvMultiselect' })
        expect(avMultiselect.props('label')).toBe('Compétence')
      })

      BddTest().then('it should render the skills multiselect options', () => {
        const skillsMultiselect = wrapper.find('.skills-multiselect')
        const avMultiselect = skillsMultiselect.getComponent({ name: 'AvMultiselect' })
        const select = avMultiselect.find('select')
        expect(select.findAll('option').length).toBe(mockedAllSkills.length)
      })

      BddTest().then('it should render the start date input', () => {
        const startDateInput = wrapper.find('.start-date-input')
        expect(startDateInput.exists()).toBe(true)
        const avInput = startDateInput.getComponent({ name: 'AvInput' })
        expect(avInput.props('label')).toBe('Date de début')
      })

      BddTest().then('it should render the end date input', () => {
        const endDateInput = wrapper.find('.end-date-input')
        expect(endDateInput.exists()).toBe(true)
        const avInput = endDateInput.getComponent({ name: 'AvInput' })
        expect(avInput.props('label')).toBe('Date de fin')
      })

      BddTest().then('it should render the types multiselect', () => {
        const typesMultiselect = wrapper.find('.types-multiselect')
        expect(typesMultiselect.exists()).toBe(true)
        const avMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })
        expect(avMultiselect.props('label')).toBe('Type')
      })

      BddTest().then('it should render the types multiselect options', () => {
        const typesMultiselect = wrapper.find('.types-multiselect')
        const avMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })
        const select = avMultiselect.find('select')
        expect(select.findAll('option').length).toBe(5)
      })

      BddTest().then('it should render the statuses multiselect', () => {
        const statusesMultiselect = wrapper.find('.statuses-multiselect')
        expect(statusesMultiselect.exists()).toBe(true)
        const avMultiselect = statusesMultiselect.getComponent({ name: 'AvMultiselect' })
        expect(avMultiselect.props('label')).toBe('Statut')
      })

      BddTest().then('it should render the types statuses options', () => {
        const statusesMultiselect = wrapper.find('.statuses-multiselect')
        const avMultiselect = statusesMultiselect.getComponent({ name: 'AvMultiselect' })
        const select = avMultiselect.find('select')
        expect(select.findAll('option').length).toBe(4)
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
          statuses: [],
          skillIds: [],
          fromDate: '',
          toDate: '',
          keyword: 'example'
        })
      })
    })

    BddTest().when('some skills are selected in the skills select', async () => {
      let avMultiselect: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const skillsMultiselect = wrapper.find('.skills-multiselect')
        avMultiselect = skillsMultiselect.getComponent({ name: 'AvMultiselect' })

        const select = avMultiselect.find('select')
        await select.setValue([mockedAllSkills[0].skillId, mockedAllSkills[1].skillId])
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(avMultiselect.emitted('update:modelValue')).toBeDefined()
        const emittedValues = avMultiselect.emitted('update:modelValue')![0][0] as Array<[AvMultiselectOption[]]>
        expect(emittedValues).toEqual([
          { value: mockedAllSkills[0].skillId, label: mockedAllSkills[0].title },
          { value: mockedAllSkills[1].skillId, label: mockedAllSkills[1].title },
        ])
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          statuses: [],
          skillIds: [mockedAllSkills[0].skillId, mockedAllSkills[1].skillId],
          fromDate: '',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('a date is selected in the start date input', async () => {
      let startDateAvInput: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const startDateInput = wrapper.find('.start-date-input')
        startDateAvInput = startDateInput.getComponent({ name: 'AvInput' })
        await startDateAvInput.find('input').setValue('2025-10-10')
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(startDateAvInput.emitted('update:modelValue')?.[0][0]).toEqual('2025-10-10')
      })

      BddTest().then('it should set the minDate of the end date input', async () => {
        const endDateInput = wrapper.find('.end-date-input')
        const endDateAvInput = endDateInput.getComponent({ name: 'AvInput' })
        expect(format(endDateAvInput.props('minDate'), 'yyyy-MM-dd')).toBe('2025-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          statuses: [],
          skillIds: [],
          fromDate: '2025-10-10',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('a date is selected in the end date input', async () => {
      let endDateAvInput: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const endDateInput = wrapper.find('.end-date-input')
        endDateAvInput = endDateInput.getComponent({ name: 'AvInput' })
        await endDateAvInput.find('input').setValue('2026-10-10')
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(endDateAvInput.emitted('update:modelValue')?.[0][0]).toEqual('2026-10-10')
      })

      BddTest().then('it should set the maxDate of the start date input', async () => {
        const startDateInput = wrapper.find('.start-date-input')
        const startDateAvInput = startDateInput.getComponent({ name: 'AvInput' })
        expect(format(startDateAvInput.props('maxDate'), 'yyyy-MM-dd')).toBe('2026-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          statuses: [],
          skillIds: [],
          fromDate: '',
          toDate: '2026-10-10',
          keyword: ''
        })
      })
    })

    BddTest().when('some types are selected in the types select', async () => {
      let avMultiselect: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const typesMultiselect = wrapper.find('.types-multiselect')
        avMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })

        const select = avMultiselect.find('select')
        await select.setValue([TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG])
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(avMultiselect.emitted('update:modelValue')).toBeDefined()
        const emittedValues = avMultiselect.emitted('update:modelValue')![0][0] as Array<[AvMultiselectOption[]]>
        expect(emittedValues).toEqual([
          { value: TraceFilterFileTypesItem.DOC, label: 'Fichier DOC' },
          { value: TraceFilterFileTypesItem.PNG, label: 'Fichier PNG' },
        ])
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG],
          statuses: [],
          skillIds: [],
          fromDate: '',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('some statuses are selected in the statuses select', async () => {
      let avMultiselect: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const statusesMultiselect = wrapper.find('.statuses-multiselect')
        avMultiselect = statusesMultiselect.getComponent({ name: 'AvMultiselect' })

        const select = avMultiselect.find('select')
        await select.setValue([
          TraceFilterStatusesItem.ASSOCIATED_EVALUATED,
          TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION
        ])
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(avMultiselect.emitted('update:modelValue')).toBeDefined()
        const emittedValues = avMultiselect.emitted('update:modelValue')![0][0] as Array<[AvMultiselectOption[]]>
        expect(emittedValues).toEqual([
          {
            value: TraceFilterStatusesItem.ASSOCIATED_EVALUATED,
            label: 'Associée à un niveau de compétence évalué'
          },
          {
            value: TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION,
            label: 'Associée à un niveau de compétence soumis pour évaluation'
          },
        ])
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          statuses: [TraceFilterStatusesItem.ASSOCIATED_EVALUATED, TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION],
          skillIds: [],
          fromDate: '',
          toDate: '',
          keyword: ''
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

        const skillsMultiselect = wrapper.find('.skills-multiselect')
        const skillsAvMultiselect = skillsMultiselect.getComponent({ name: 'AvMultiselect' })
        const skillsSelect = skillsAvMultiselect.find('select')
        await skillsSelect.setValue([mockedAllSkills[0].skillId, mockedAllSkills[1].skillId])

        const startDateInput = wrapper.find('.start-date-input')
        const startDateAvInput = startDateInput.getComponent({ name: 'AvInput' })
        await startDateAvInput.find('input').setValue('2025-10-10')

        const endDateInput = wrapper.find('.end-date-input')
        const endDateAvInput = endDateInput.getComponent({ name: 'AvInput' })
        await endDateAvInput.find('input').setValue('2026-10-10')

        const typesMultiselect = wrapper.find('.types-multiselect')
        const typesAvMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })
        const typesSelect = typesAvMultiselect.find('select')
        await typesSelect.setValue([TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG])

        const statusesMultiselect = wrapper.find('.statuses-multiselect')
        const statusesAvMultiselect = statusesMultiselect.getComponent({ name: 'AvMultiselect' })
        const statusesSelect = statusesAvMultiselect.find('select')
        await statusesSelect.setValue([
          TraceFilterStatusesItem.ASSOCIATED_EVALUATED,
          TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION
        ])
      })

      BddTest().then('the values should be set in the component refs', () => {
        expect(vm.keyword).toBe('example')
        expect(vm.skillsSelected.map(skill => skill.value)).toEqual([
          mockedAllSkills[0].skillId,
          mockedAllSkills[1].skillId
        ])
        expect(vm.fromDateSelected).toBe('2025-10-10')
        expect(vm.toDateSelected).toBe('2026-10-10')
        expect(vm.typesSelected.map(type => type.value)).toEqual([
          TraceFilterFileTypesItem.DOC,
          TraceFilterFileTypesItem.PNG
        ])
        expect(vm.statusesSelected.map(status => status.value)).toEqual([
          TraceFilterStatusesItem.ASSOCIATED_EVALUATED,
          TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION
        ])
      })

      BddTest().then('the trace filter container should emit the filters', () => {
        const emitted = wrapper.emitted('update:filters')
        const lastEmitted = emitted![emitted!.length - 1][0]
        expect(lastEmitted).toEqual({
          fileTypes: [TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG],
          statuses: [
            TraceFilterStatusesItem.ASSOCIATED_EVALUATED,
            TraceFilterStatusesItem.ASSOCIATED_IN_EVALUATION
          ],
          skillIds: [mockedAllSkills[0].skillId, mockedAllSkills[1].skillId,],
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
          expect(vm.skillsSelected.length).toBe(0)
          expect(vm.fromDateSelected).toBe('')
          expect(vm.toDateSelected).toBe('')
          expect(vm.typesSelected.length).toBe(0)
          expect(vm.statusesSelected.length).toBe(0)
        })

        BddTest().then('the trace filter container should emit the reset filter', () => {
          const emitted = wrapper.emitted('update:filters')
          const lastEmitted = emitted![emitted!.length - 1][0]
          expect(lastEmitted).toEqual({
            fileTypes: [],
            statuses: [],
            skillIds: [],
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
      const handler = createAllSkillsHandler(mockedAllSkills)
      server.use(handler)
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

      BddTest().then('it should render the start date input', () => {
        const startDateInput = wrapper.find('.start-date-input')
        expect(startDateInput.exists()).toBe(true)
        const avInput = startDateInput.getComponent({ name: 'AvInput' })
        expect(avInput.props('label')).toBe('Date de début')
      })

      BddTest().then('it should render the end date input', () => {
        const endDateInput = wrapper.find('.end-date-input')
        expect(endDateInput.exists()).toBe(true)
        const avInput = endDateInput.getComponent({ name: 'AvInput' })
        expect(avInput.props('label')).toBe('Date de fin')
      })

      BddTest().then('it should render the types multiselect', () => {
        const typesMultiselect = wrapper.find('.types-multiselect')
        expect(typesMultiselect.exists()).toBe(true)
        const avMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })
        expect(avMultiselect.props('label')).toBe('Type')
      })

      BddTest().then('it should render the types multiselect options', () => {
        const typesMultiselect = wrapper.find('.types-multiselect')
        const avMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })
        const select = avMultiselect.find('select')
        expect(select.findAll('option').length).toBe(5)
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
          statuses: [],
          skillIds: [],
          fromDate: '',
          toDate: '',
          keyword: 'example'
        })
      })
    })

    BddTest().when('a date is selected in the start date input', async () => {
      let startDateAvInput: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const startDateInput = wrapper.find('.start-date-input')
        startDateAvInput = startDateInput.getComponent({ name: 'AvInput' })
        await startDateAvInput.find('input').setValue('2025-10-10')
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(startDateAvInput.emitted('update:modelValue')?.[0][0]).toEqual('2025-10-10')
      })

      BddTest().then('it should set the minDate of the end date input', async () => {
        const endDateInput = wrapper.find('.end-date-input')
        const endDateAvInput = endDateInput.getComponent({ name: 'AvInput' })
        expect(format(endDateAvInput.props('minDate'), 'yyyy-MM-dd')).toBe('2025-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          statuses: [],
          skillIds: [],
          fromDate: '2025-10-10',
          toDate: '',
          keyword: ''
        })
      })
    })

    BddTest().when('a date is selected in the end date input', async () => {
      let endDateAvInput: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const endDateInput = wrapper.find('.end-date-input')
        endDateAvInput = endDateInput.getComponent({ name: 'AvInput' })
        await endDateAvInput.find('input').setValue('2026-10-10')
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(endDateAvInput.emitted('update:modelValue')?.[0][0]).toEqual('2026-10-10')
      })

      BddTest().then('it should set the maxDate of the start date input', async () => {
        const startDateInput = wrapper.find('.start-date-input')
        const startDateAvInput = startDateInput.getComponent({ name: 'AvInput' })
        expect(format(startDateAvInput.props('maxDate'), 'yyyy-MM-dd')).toBe('2026-10-10')
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [],
          statuses: [],
          skillIds: [],
          fromDate: '',
          toDate: '2026-10-10',
          keyword: ''
        })
      })
    })

    BddTest().when('some types are selected in the types select', async () => {
      let avMultiselect: Omit<VueWrapper, 'exists'>

      beforeEach(async () => {
        const typesMultiselect = wrapper.find('.types-multiselect')
        avMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })

        const select = avMultiselect.find('select')
        await select.setValue([TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG])
      })

      BddTest().then('it should emit update:modelValue', async () => {
        expect(avMultiselect.emitted('update:modelValue')).toBeDefined()
        const emittedValues = avMultiselect.emitted('update:modelValue')![0][0] as Array<[AvMultiselectOption[]]>
        expect(emittedValues).toEqual([
          { value: TraceFilterFileTypesItem.DOC, label: 'Fichier DOC' },
          { value: TraceFilterFileTypesItem.PNG, label: 'Fichier PNG' },
        ])
      })

      BddTest().then('the trace filter container should emit update:filters', () => {
        expect(wrapper.emitted('update:filters')?.[0][0]).toEqual({
          fileTypes: [TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG],
          statuses: [],
          skillIds: [],
          fromDate: '',
          toDate: '',
          keyword: ''
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

        const startDateInput = wrapper.find('.start-date-input')
        const startDateAvInput = startDateInput.getComponent({ name: 'AvInput' })
        await startDateAvInput.find('input').setValue('2025-10-10')

        const endDateInput = wrapper.find('.end-date-input')
        const endDateAvInput = endDateInput.getComponent({ name: 'AvInput' })
        await endDateAvInput.find('input').setValue('2026-10-10')

        const typesMultiselect = wrapper.find('.types-multiselect')
        const typesAvMultiselect = typesMultiselect.getComponent({ name: 'AvMultiselect' })
        const typesSelect = typesAvMultiselect.find('select')
        await typesSelect.setValue([TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG])
      })

      BddTest().then('the values should be set in the component refs', () => {
        expect(vm.keyword).toBe('example')
        expect(vm.fromDateSelected).toBe('2025-10-10')
        expect(vm.toDateSelected).toBe('2026-10-10')
        expect(vm.typesSelected.map(type => type.value)).toEqual([
          TraceFilterFileTypesItem.DOC,
          TraceFilterFileTypesItem.PNG
        ])
      })

      BddTest().then('the trace filter container should emit the filters', () => {
        const emitted = wrapper.emitted('update:filters')
        const lastEmitted = emitted![emitted!.length - 1][0]
        expect(lastEmitted).toEqual({
          fileTypes: [TraceFilterFileTypesItem.DOC, TraceFilterFileTypesItem.PNG],
          statuses: [],
          skillIds: [],
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
            statuses: [],
            skillIds: [],
            fromDate: '',
            toDate: '',
            keyword: ''
          })
        })
      })
    })
  })
})
