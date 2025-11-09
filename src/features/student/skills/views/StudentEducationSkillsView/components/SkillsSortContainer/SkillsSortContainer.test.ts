import { SortDirection } from '@/common/types'
import { formatSortParam } from '@/common/utils'
import { StudentProgressViewSortableFields } from '@/features/student/types'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'
import SkillsSortContainer from './SkillsSortContainer.vue'

BddTest().given('a student education skills filters container', () => {
  let wrapper: VueWrapper<InstanceType<typeof SkillsSortContainer>>

  beforeEach(() => {
    wrapper = mount(SkillsSortContainer, {
      global: {
        stubs: {
          AvSelect: AvSelectStub
        }
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render a filter container', () => {
      const container = wrapper.find('.filter-and-sort-container')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render an AvSelect component', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('the AvSelect should have correct props', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('placeholder')).toBe('')
      expect(select.props('dense')).toBe(true)
    })

    BddTest().then('the select should have default value selected', () => {
      const expectedDefault = formatSortParam(StudentProgressViewSortableFields.NAME, SortDirection.ASC)
      const select = wrapper.find('select')
      expect(select.element.value).toBe(expectedDefault)
    })

    BddTest().then('the select should render all sort options with French translations', () => {
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

  BddTest().when('the sort value changes', () => {
    BddTest().then('it should update the selected option', async () => {
      const newSortValue = formatSortParam(StudentProgressViewSortableFields.DATE, SortDirection.DESC)

      await wrapper.setProps({ sort: newSortValue })

      const select = wrapper.find('select')
      expect(select.element.value).toBe(newSortValue)
    })
  })
})
