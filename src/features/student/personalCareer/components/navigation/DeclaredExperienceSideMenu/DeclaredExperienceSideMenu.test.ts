import type { DeclaredExperienceViewDTO } from '@/api/avenir-esr'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { DeclaredExperienceCompactCardStub } from
  '@/features/student/personalCareer/components/cards/DeclaredExperienceCompactCard/DeclaredExperienceCompactCard.stub'
import DeclaredExperienceSideMenu, {
  type DeclaredExperienceSideMenuProps
} from
  '@/features/student/personalCareer/components/navigation/DeclaredExperienceSideMenu/DeclaredExperienceSideMenu.vue'
import {
  AvButtonStub,
  AvIconTextStub,
  BddTest
} from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const AvSideMenuStub = defineComponent({
  name: 'AvSideMenu',
  props: ['collapsed', 'collapsedWidth'],
  emits: ['update:collapsed'],
  template: '<div class="av-side-menu-stub"><slot /></div>',
})

BddTest().given('a DeclaredExperienceSideMenu component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredExperienceSideMenu>>

  const dummyExperiences: DeclaredExperienceViewDTO[] = [
    {
      id: 'declared-experience-1',
      title: 'Stage développeur front-end',
      organization: 'Startup Paris',
      startDate: '2022-01-01',
      createdAt: '2022-01-01T10:00:00Z',
      updatedAt: '2022-01-01T10:00:00Z',
    },
    {
      id: 'declared-experience-2',
      title: 'Alternance full-stack',
      organization: 'Entreprise Lyon',
      startDate: '2023-01-01',
      createdAt: '2023-01-01T10:00:00Z',
      updatedAt: '2023-01-01T10:00:00Z',
    },
    {
      id: 'declared-experience-3',
      title: 'Freelance React',
      organization: 'Client Remote',
      startDate: '2024-01-01',
      createdAt: '2024-01-01T10:00:00Z',
      updatedAt: '2024-01-01T10:00:00Z',
    },
  ]

  const props: DeclaredExperienceSideMenuProps = {
    experiences: dummyExperiences,
    selectedExperienceId: 'declared-experience-2',
    experienceCount: 7,
  }

  const stubs = {
    AvSideMenu: AvSideMenuStub,
    AvIconText: AvIconTextStub,
    AvButton: AvButtonStub,
    FloatingIconCard: FloatingIconCardStub,
    DeclaredExperienceCompactCard: DeclaredExperienceCompactCardStub,
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredExperienceSideMenu, {
        props,
        global: { stubs },
      })
    })

    BddTest().then('it should render the side menu with the correct number of experiences', () => {
      const sideMenu = wrapper.findComponent(AvSideMenuStub)
      expect(sideMenu.exists()).toBe(true)

      const experienceItems = sideMenu.findAllComponents(DeclaredExperienceCompactCardStub)

      expect(experienceItems.length).toBe(dummyExperiences.length)
    })

    BddTest().then('it should render the title with count when not collapsed', () => {
      const title = wrapper.find('span.s2-bold')

      expect(title.exists()).toBe(true)
      expect(title.text()).toContain(`(${props.experienceCount})`)
    })

    BddTest().then('it should not render the AvIconText', () => {
      const iconText = wrapper.findComponent(AvIconTextStub)
      expect(iconText.exists()).toBe(false)
    })

    BddTest().then('it should highlight the selected experience', () => {
      const selectedItem = wrapper.find('a[role="button"][aria-pressed="true"]')

      expect(selectedItem.exists()).toBe(true)
      expect(selectedItem.classes()).toContain('declared-experience-side-menu__experience--selected')
    })

    BddTest().and('an experience is clicked', () => {
      beforeEach(async () => {
        const items = wrapper.findAll('a[role="button"]')
        await items[0].trigger('click')
      })

      BddTest().then('it should emit selectExperience event', () => {
        expect(wrapper.emitted('selectExperience')).toBeTruthy()
        expect(wrapper.emitted('selectExperience')?.[0]).toEqual(['declared-experience-1'])
      })
    })

    BddTest().and('a keyboard enter is pressed on an experience', () => {
      beforeEach(async () => {
        const items = wrapper.findAll('a[role="button"]')
        await items[2].trigger('keydown.enter')
      })

      BddTest().then('it should emit selectExperience event', () => {
        expect(wrapper.emitted('selectExperience')).toBeTruthy()
        expect(wrapper.emitted('selectExperience')?.[0]).toEqual(['declared-experience-3'])
      })
    })

    BddTest().and('a keyboard space is pressed on an experience', () => {
      beforeEach(async () => {
        const items = wrapper.findAll('a[role="button"]')
        await items[2].trigger('keydown.space')
      })

      BddTest().then('it should emit selectExperience event', () => {
        expect(wrapper.emitted('selectExperience')).toBeTruthy()
        expect(wrapper.emitted('selectExperience')?.[0]).toEqual(['declared-experience-3'])
      })
    })

    BddTest().and('the side menu is collapsed', () => {
      beforeEach(async () => {
        wrapper.findComponent(AvSideMenuStub).vm.$emit('update:collapsed', true)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the collapsed state', () => {
        const sideMenu = wrapper.findComponent(AvSideMenuStub)
        expect(sideMenu.props('collapsed')).toBe(true)
      })
    })
  })
})
