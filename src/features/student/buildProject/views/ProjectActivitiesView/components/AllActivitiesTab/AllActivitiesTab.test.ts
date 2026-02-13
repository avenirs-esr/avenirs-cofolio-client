import { AllActivitiesHeaderCardStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesHeaderCard/AllActivitiesHeaderCard.stub'
import AllActivitiesTab from '@/features/student/buildProject/views/ProjectActivitiesView/components/AllActivitiesTab/AllActivitiesTab.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const navigateToStudentProjectActivitiesCatalog = vi.fn()

vi.mock('@/common/composables', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/composables')>()
  return {
    ...actual,
    useNavigation: () => ({
      navigateToStudentProjectActivitiesCatalog,
    }),
  }
})

BddTest().given('the all activities tab', () => {
  let wrapper: VueWrapper<InstanceType<typeof AllActivitiesTab>>

  const stubs = { AllActivitiesHeaderCard: AllActivitiesHeaderCardStub }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AllActivitiesTab, { global: { stubs } })
    })

    BddTest().then('it should render the all activities header card', () => {
      expect(wrapper.findComponent(AllActivitiesHeaderCardStub).exists()).toBe(true)
    })
  })

  BddTest().when('the user clicks on the see all activities button', () => {
    beforeEach(() => {
      const seeAllActivitiesButton = wrapper.find('[data-testid="see-all-activities-button"]')
      seeAllActivitiesButton.trigger('click')
    })

    BddTest().then('it should navigate to the project activities catalog', () => {
      expect(navigateToStudentProjectActivitiesCatalog).toHaveBeenCalled()
    })
  })
})
