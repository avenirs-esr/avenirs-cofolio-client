import { AllActivitiesHeaderCardStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesHeaderCard/AllActivitiesHeaderCard.stub'
import { AllActivitiesSectionStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesSection/AllActivitiesSection.stub'
import AllActivitiesTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesTab/AllActivitiesTab.vue'
import { NewActivitiesPaginatorCardStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/NewActivitiesPaginatorCard/NewActivitiesPaginatorCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { nextTick } from 'vue'

BddTest().given('the all activities tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AllActivitiesTab>>
  let scrollIntoViewSpy: ReturnType<typeof vi.spyOn>

  const stubs = {
    AllActivitiesHeaderCard: AllActivitiesHeaderCardStub,
    AllActivitiesSection: AllActivitiesSectionStub,
    NewActivitiesPaginatorCard: NewActivitiesPaginatorCardStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AllActivitiesTab, { global: { stubs } })
    })

    BddTest().then('it should render the all activities header card', () => {
      expect(wrapper.findComponent(AllActivitiesHeaderCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the new activities paginator card', () => {
      expect(wrapper.findComponent(NewActivitiesPaginatorCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the all activities section', () => {
      expect(wrapper.findComponent(AllActivitiesSectionStub).exists()).toBe(true)
    })
  })

  BddTest().when('the user clicks on the see all activities button', () => {
    beforeEach(async () => {
      if (!('scrollIntoView' in HTMLElement.prototype)) {
        Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
          value: vi.fn(),
          writable: true,
        })
      }

      scrollIntoViewSpy = vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {})

      wrapper = mount(AllActivitiesTab, { global: { stubs } })
      await nextTick()

      const seeAllActivitiesButton = wrapper.find('[data-testid="see-all-activities-button"]')
      await seeAllActivitiesButton.trigger('click')
    })

    afterEach(() => {
      scrollIntoViewSpy?.mockRestore()
    })

    BddTest().then('it should scroll to the all activities section', () => {
      expect(scrollIntoViewSpy).toHaveBeenCalledTimes(1)

      expect(scrollIntoViewSpy).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      })
    })
  })
})
