import StudentProjectExperiencesContainer from '@/features/student/views/StudentProjectExperiencesView/components/StudentProjectExperiencesContainer/StudentProjectExperiencesContainer.vue'
import { ProjectExperienceItems } from '@/features/student/views/StudentProjectExperiencesView/types'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'

const stubs = {
  AvSideNavigation: {
    name: 'AvSideNavigation',
    props: {
      items: Array,
      selectedItem: String,
      isSideMenuCollapsed: Boolean,
      collapsedWidth: String
    },
    emits: ['update:selectedItem', 'update:isSideMenuCollapsed'],
    template: '<div class="av-side-navigation-stub" @click="$emit(\'update:isSideMenuCollapsed\', !isSideMenuCollapsed)" />'
  },
  StudentProjectExperiencesCareersSection: {
    name: 'StudentProjectExperiencesCareersSection',
    template: '<div class="careers-section-stub">Careers Section</div>'
  },
  StudentProjectExperiencesEducationsSection: {
    name: 'StudentProjectExperiencesEducationsSection',
    template: '<div class="educations-section-stub">Educations Section</div>'
  },
  StudentProjectExperiencesExperiencesSection: {
    name: 'StudentProjectExperiencesExperiencesSection',
    template: '<div class="experiences-section-stub">Experiences Section</div>'
  },
  StudentProjectExperiencesActivitiesSection: {
    name: 'StudentProjectExperiencesActivitiesSection',
    template: '<div class="activities-section-stub">Activities Section</div>'
  }
}

describe('studentProjectExperiencesContainer', () => {
  describe('given a project experiences container component', () => {
    let wrapper: VueWrapper<InstanceType<typeof StudentProjectExperiencesContainer>>

    beforeEach(() => {
      wrapper = mount(StudentProjectExperiencesContainer, {
        global: {
          stubs
        }
      })
    })

    describe('when the component is mounted', () => {
      it('then it should render the main container with correct class', () => {
        expect(wrapper.find('.student-project-experiences-container').exists()).toBe(true)
      })

      it('then it should render an AvSideNavigation component', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.exists()).toBe(true)
        expect(sideNavigation.props('isSideMenuCollapsed')).toBe(false)
        expect(sideNavigation.props('selectedItem')).toBe(ProjectExperienceItems.CAREERS)
        expect(sideNavigation.props('items')).toHaveLength(4)
      })

      it('then it should have navigation items with correct properties', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        const items = sideNavigation.props('items')
        expect(items).toEqual([
          { id: ProjectExperienceItems.CAREERS, label: expect.any(String), icon: expect.any(String) },
          { id: ProjectExperienceItems.EDUCATIONS, label: expect.any(String), icon: expect.any(String) },
          { id: ProjectExperienceItems.EXPERIENCES, label: expect.any(String), icon: expect.any(String) },
          { id: ProjectExperienceItems.ACTIVITIES, label: expect.any(String), icon: expect.any(String) }
        ])
      })

      it('then it should render the content area', () => {
        const contentArea = wrapper.find('.student-project-experiences-container__content')
        expect(contentArea.exists()).toBe(true)
      })

      it('then it should display the careers section by default', () => {
        const careersSection = wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' })
        expect(careersSection.exists()).toBe(true)
      })
    })

    describe('when the side menu is collapsed', () => {
      beforeEach(async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.trigger('click')
      })

      it('then the side navigation should be collapsed', () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        expect(sideNavigation.props('isSideMenuCollapsed')).toBe(true)
      })
    })

    describe('when different menu items are selected', () => {
      it('then it should display experiences section when EXPERIENCES is selected', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.EXPERIENCES)

        const experiencesSection = wrapper.findComponent({ name: 'StudentProjectExperiencesExperiencesSection' })
        expect(experiencesSection.exists()).toBe(true)
      })

      it('then it should display activities section when ACTIVITIES is selected', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.ACTIVITIES)

        const activitiesSection = wrapper.findComponent({ name: 'StudentProjectExperiencesActivitiesSection' })
        expect(activitiesSection.exists()).toBe(true)
      })

      it('then it should display careers section when CAREERS is selected', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.CAREERS)

        const careersSection = wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' })
        expect(careersSection.exists()).toBe(true)
      })

      it('then it should display educations section when EDUCATIONS is selected', async () => {
        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.EDUCATIONS)

        const educationsSection = wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' })
        expect(educationsSection.exists()).toBe(true)
      })
    })

    describe('when the displayed section changes', () => {
      it('then only one section should be displayed at a time', async () => {
        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' }).exists()).toBe(true)
        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' }).exists()).toBe(false)

        const sideNavigation = wrapper.findComponent({ name: 'AvSideNavigation' })
        await sideNavigation.vm.$emit('update:selectedItem', ProjectExperienceItems.EDUCATIONS)

        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesCareersSection' }).exists()).toBe(false)
        expect(wrapper.findComponent({ name: 'StudentProjectExperiencesEducationsSection' }).exists()).toBe(true)
      })
    })
  })
})
