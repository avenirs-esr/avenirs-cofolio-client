import type { CheckBoxResultListProps } from '@/features/student/global/components/interaction/CheckboxResultList/CheckboxResultList.vue'
import CheckboxResultList from '@/features/student/global/components/interaction/CheckboxResultList/CheckboxResultList.vue'
import { AvCheckboxListItemStub, AvListStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

BddTest().given('a checkbox result list', () => {
  let wrapper: VueWrapper<InstanceType<typeof CheckboxResultList>>

  const stubs = {
    AvList: AvListStub,
    AvCheckboxListItem: AvCheckboxListItemStub,
  }

  BddTest().when('the component is mounted with results', () => {
    const props: CheckBoxResultListProps = {
      results: [
        { id: '1', title: 'Result 1', description: 'Description for result 1' },
        { id: '2', title: 'Result 2', description: 'Description for result 2' },
        { id: '3', title: 'Result 3', },
      ],
    }

    beforeEach(() => {
      wrapper = mount(CheckboxResultList, { props, global: { stubs } })
    })

    BddTest().then('it should render the correct number of checkboxes', () => {
      const checkboxes = wrapper.findAllComponents(AvCheckboxListItemStub)
      expect(checkboxes).toHaveLength(props.results.length)
    })

    BddTest().then('it should display the correct titles and descriptions', () => {
      const checkboxes = wrapper.findAllComponents(AvCheckboxListItemStub)

      expect(checkboxes[0].text()).toContain('Result 1')
      expect(checkboxes[0].text()).toContain('Description for result 1')

      expect(checkboxes[1].text()).toContain('Result 2')
      expect(checkboxes[1].text()).toContain('Description for result 2')

      expect(checkboxes[2].text()).toContain('Result 3')
    })

    BddTest().and('the user selects a checkbox', () => {
      beforeEach(async () => {
        const firstCheckbox = wrapper.findComponent(AvCheckboxListItemStub)
        const input = firstCheckbox.find('input[type="checkbox"]')
        await input.trigger('change')
      })

      BddTest().then('the selected item should be updated', () => {
        expect(wrapper.findComponent(AvCheckboxListItemStub).emitted('update:modelValue')).toBeTruthy()
      })
    })
  })
})
