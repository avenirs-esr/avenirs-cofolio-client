import AddCard from '@/common/components/cards/AddCard/AddCard.vue'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { expect } from 'vitest'

BddTest().given('an AddCard component', () => {
  const stubs = { AvIcon: AvIconStub }

  function mountCard (props: { label?: string } = {}) {
    return mount(AddCard, {
      props,
      global: { stubs },
    })
  }

  BddTest().when('the component is mounted without a label prop', () => {
    let wrapper: ReturnType<typeof mountCard>

    beforeEach(() => {
      wrapper = mountCard()
    })

    BddTest().then('it should render the AvIcon', () => {
      expect(wrapper.findComponent(AvIconStub).exists()).toBe(true)
    })

    BddTest().then('it should display the default i18n label', () => {
      expect(wrapper.find('.b1-regular').text()).toBe('Ajouter')
    })

    BddTest().then('it should emit click when the button is clicked', async () => {
      await wrapper.find('[data-testid="add-card"]').trigger('click')
      expect(wrapper.emitted('click')).toBeTruthy()
    })
  })

  BddTest().when('the component is mounted with a custom label prop', () => {
    let wrapper: ReturnType<typeof mountCard>
    const customLabel = 'Custom label'

    beforeEach(() => {
      wrapper = mountCard({ label: customLabel })
    })

    BddTest().then('it should display the custom label instead of the i18n default', () => {
      expect(wrapper.find('.b1-regular').text()).toBe(customLabel)
    })
  })
})
