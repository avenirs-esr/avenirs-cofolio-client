import type { VueWrapper } from '@vue/test-utils'
import DeclaredExperienceAssociations
  from '@/features/student/personalCareer/views/DeclaredExperienceView/components/DeclaredExperienceAssociations/DeclaredExperienceAssociations.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a declared experience associations component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceAssociations>>

  BddTest().when('the component is rendered', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeclaredExperienceAssociations)
    })

    BddTest().then('it should render the placeholder container', () => {
      const placeholder = wrapper.find('[data-testid="declared-experience-associations-placeholder"]')
      expect(placeholder.exists()).toBe(true)
    })

    BddTest().then('it should render the todo message', () => {
      expect(wrapper.text()).toContain('TODO #1444 - Associations à implémenter')
    })
  })
})
