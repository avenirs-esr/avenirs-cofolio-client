import AllActivitiesHeaderCard from '@/features/student/global/views/ProjectActivitiesView/components/AllActivitiesHeaderCard/AllActivitiesHeaderCard.vue'
import { AvButtonStub, AvCardStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('an all activities header card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AllActivitiesHeaderCard>>

  const stubs = { AvCard: AvCardStub, AvButton: AvButtonStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AllActivitiesHeaderCard, { global: { stubs } })
    })

    BddTest().then('it should render the description', () => {
      expect(wrapper.text()).toContain('Activités proposées par votre SUIO et votre établissement. Pour toute demande d’activités complémentaires, veuillez-vous rapprocher de votre conseiller d’orientation.')
    })

    BddTest().then('it should render the see all button', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.exists()).toBe(true)
      expect(button.props('label')).toBe('Voir toutes les activités')
    })

    BddTest().and('the button is clicked', () => {
      beforeEach(() => {
        const button = wrapper.findComponent(AvButtonStub)
        button.trigger('click')
      })

      BddTest().then('it should emit the seeAllEvents event', () => {
        expect(wrapper.emitted('seeAllEvents')).toBeTruthy()
      })
    })
  })
})
