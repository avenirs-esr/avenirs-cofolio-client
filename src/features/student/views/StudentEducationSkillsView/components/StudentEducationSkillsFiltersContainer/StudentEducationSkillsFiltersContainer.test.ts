import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { StudentProgressViewSortableFields } from '@/features/student/types'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import StudentEducationSkillsFiltersContainer from './StudentEducationSkillsFiltersContainer.vue'

const AvSelectStub = defineComponent({
  name: 'AvSelect',
  props: {
    modelValue: [String, Number],
    options: Array,
    defaultUnselectedText: String,
    dense: Boolean
  },
  emits: ['update:modelValue'],
  template: `
    <select 
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option v-if="defaultUnselectedText !== undefined" value="">{{ defaultUnselectedText }}</option>
      <option 
        v-for="option in options" 
        :key="option.value" 
        :value="option.value"
      >
        {{ option.text }}
      </option>
    </select>
  `
})

describe('studentEducationSkillsFiltersContainer', () => {
  describe('given a student education skills filters container', () => {
    let wrapper: ReturnType<typeof mount<typeof StudentEducationSkillsFiltersContainer>>

    beforeEach(() => {
      wrapper = mount<typeof StudentEducationSkillsFiltersContainer>(StudentEducationSkillsFiltersContainer, {
        global: {
          stubs: {
            AvSelect: AvSelectStub
          }
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render a filter container', () => {
        const container = wrapper.find('.filter-and-sort-container')
        expect(container.exists()).toBe(true)
      })

      it('then it should render an AvSelect component', () => {
        const select = wrapper.findComponent({ name: 'AvSelect' })
        expect(select.exists()).toBe(true)
      })

      it('then the AvSelect should have correct props', () => {
        const select = wrapper.findComponent({ name: 'AvSelect' })
        expect(select.props('defaultUnselectedText')).toBe('')
        expect(select.props('dense')).toBe(true)
      })

      it('then the select should have default value selected', () => {
        const expectedDefault = formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC)
        const select = wrapper.find('select')
        expect(select.element.value).toBe(expectedDefault)
      })

      it('then the select should render all sort options with French translations', () => {
        const select = wrapper.find('select')
        const options = select.findAll('option')

        expect(options).toHaveLength(5)

        expect(options[0].text()).toBe('')
        expect(options[1].text()).toBe('Trier de A à Z')
        expect(options[1].attributes('value')).toBe(formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC))

        expect(options[2].text()).toBe('Trier de Z à A')
        expect(options[2].attributes('value')).toBe(formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.DESC))

        expect(options[3].text()).toBe('Trier du plus récent au plus ancien')
        expect(options[3].attributes('value')).toBe(formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.DESC))

        expect(options[4].text()).toBe('Trier du plus ancien au plus récent')
        expect(options[4].attributes('value')).toBe(formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.ASC))
      })
    })

    describe('when the sort value changes', () => {
      it('then it should update the selected option', async () => {
        const newSortValue = formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.DESC)

        await wrapper.setProps({ sort: newSortValue })

        const select = wrapper.find('select')
        expect(select.element.value).toBe(newSortValue)
      })
    })
  })
})
