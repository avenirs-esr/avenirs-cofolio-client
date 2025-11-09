import { StudentProjectExperiencesActivitiesSectionStub } from '@/features/student/global/views/StudentProjectExperiencesView/components/StudentProjectExperiencesActivitiesSection/StudentProjectExperiencesActivitiesSection.stub'
import { StudentProjectExperiencesCareersSectionStub } from '@/features/student/global/views/StudentProjectExperiencesView/components/StudentProjectExperiencesCareersSection/StudentProjectExperiencesCareersSection.stub'
import StudentProjectExperiencesContainer from '@/features/student/global/views/StudentProjectExperiencesView/components/StudentProjectExperiencesContainer/StudentProjectExperiencesContainer.vue'
import { StudentProjectExperiencesEducationsSectionStub } from '@/features/student/global/views/StudentProjectExperiencesView/components/StudentProjectExperiencesEducationsSection/StudentProjectExperiencesEducationsSection.stub'
import { StudentProjectExperiencesExperiencesSectionStub } from '@/features/student/global/views/StudentProjectExperiencesView/components/StudentProjectExperiencesExperiencesSection/StudentProjectExperiencesExperiencesSection.stub'
import { ProjectExperienceItems } from '@/features/student/global/views/StudentProjectExperiencesView/types'
import { AvSideNavigationStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  AvSideNavigation: AvSideNavigationStub,
  StudentProjectExperiencesCareersSection: StudentProjectExperiencesCareersSectionStub,
  StudentProjectExperiencesEducationsSection: StudentProjectExperiencesEducationsSectionStub,
  StudentProjectExperiencesExperiencesSection: StudentProjectExperiencesExperiencesSectionStub,
  StudentProjectExperiencesActivitiesSection: StudentProjectExperiencesActivitiesSectionStub
}

BddTest().given('a project experiences container component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesContainer>>

  beforeEach(() => {
    wrapper = mount(StudentProjectExperiencesContainer, {
      global: {
        stubs
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-project-experiences-container').exists()).toBe(true)
    })

    BddTest().then('it should render an AvSideNavigation component', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.exists()).toBe(true)
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(false)
      expect(sideNavigation.props('selectedItem')).toBe(ProjectExperienceItems.CAREERS)
      expect(sideNavigation.props('items')).toHaveLength(4)
    })

    BddTest().then('it should have navigation items with correct properties', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      const items = sideNavigation.props('items')
      expect(items).toEqual([
        { id: ProjectExperienceItems.CAREERS, label: expect.any(String), icon: expect.any(String) },
        { id: ProjectExperienceItems.EDUCATIONS, label: expect.any(String), icon: expect.any(String) },
        { id: ProjectExperienceItems.EXPERIENCES, label: expect.any(String), icon: expect.any(String) },
        { id: ProjectExperienceItems.ACTIVITIES, label: expect.any(String), icon: expect.any(String) }
      ])
    })

    BddTest().then('it should render the content area', () => {
      const contentArea = wrapper.find('.student-project-experiences-container__content')
      expect(contentArea.exists()).toBe(true)
    })

    BddTest().then('it should display the careers section by default', () => {
      const careersSection = wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' })
      expect(careersSection.exists()).toBe(true)
    })
  })

  BddTest().when('the side menu is collapsed', () => {
    beforeEach(async () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.trigger('click')
    })

    BddTest().then('the side navigation should be collapsed', () => {
      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(true)
    })
  })

  BddTest().when('different menu items are selected', () => {
    BddTest().and('EXPERIENCES is selected', () => {
      BddTest().then('it should display experiences section', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.EXPERIENCES)

        const experiencesSection = wrapper.findComponent({ name: 'StudentProjectExperiencesExperiencesSection' })
        expect(experiencesSection.exists()).toBe(true)
      })
    })

    BddTest().and('ACTIVITIES is selected', () => {
      BddTest().then('it should display activities section', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.ACTIVITIES)

        const activitiesSection = wrapper.findComponent({ name: 'StudentProjectExperiencesActivitiesSection' })
        expect(activitiesSection.exists()).toBe(true)
      })
    })

    BddTest().and('CAREERS is selected', () => {
      BddTest().then('it should display careers section', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.CAREERS)

        const careersSection = wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' })
        expect(careersSection.exists()).toBe(true)
      })
    })

    BddTest().and('EDUCATIONS is selected', () => {
      BddTest().then('it should display educations section', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.EDUCATIONS)

        const educationsSection = wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' })
        expect(educationsSection.exists()).toBe(true)
      })
    })
  })

  BddTest().when('the displayed section changes', () => {
    BddTest().then('only one section should be displayed at a time', async () => {
      expect(wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' }).exists()).toBe(true)
      expect(wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' }).exists()).toBe(false)

      const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
      await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.EDUCATIONS)

      expect(wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' }).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' }).exists()).toBe(true)
    })
  })
})
