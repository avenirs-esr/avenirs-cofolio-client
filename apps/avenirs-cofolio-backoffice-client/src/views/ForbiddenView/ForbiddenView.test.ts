import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'
import ForbiddenView from '@/views/ForbiddenView/ForbiddenView.vue'

BddTest().given('a forbidden view', () => {
  BddTest().when('the view is mounted', () => {
    BddTest().then('it should render the title and the description', () => {
      const wrapper = mount(ForbiddenView)

      expect(wrapper.find('h1').text()).toBe('Accès interdit')
      expect(wrapper.find('[role="status"]').text()).toBe('Vous n\'avez pas les droits nécessaires pour accéder à cette page.')
    })
  })
})
