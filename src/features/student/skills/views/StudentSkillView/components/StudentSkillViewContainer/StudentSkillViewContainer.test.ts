import type { SkillDetailedDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import StudentSkillDetailedSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillDetailedSection/StudentSkillDetailedSection.vue'
import StudentSkillEvaluateSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillEvaluateSection/StudentSkillEvaluateSection.vue'
import StudentSkillLevelDetailedSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillLevelDetailedSection/StudentSkillLevelDetailedSection.vue'
import StudentSkillProgressSection
  from '@/features/student/skills/views/StudentSkillView/components/StudentSkillProgressSection/StudentSkillProgressSection.vue'
import StudentSkillViewContainer from '@/features/student/skills/views/StudentSkillView/components/StudentSkillViewContainer/StudentSkillViewContainer.vue'
import { AvSideNavigation, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a student skill view container component', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentSkillViewContainer>>

  const mockSkillDetailed: SkillDetailedDTO = {
    id: 'skill-2-2',
    name: 'Compétence A',
    skillLevels: [
      { id: '1', name: 'Niveau 1' },
      { id: '2', name: 'Niveau 2' },
    ],
  }

  const stubs = {
    AvSideNavigation: {
      name: 'AvSideNavigation',
      props: {
        items: Array,
        selectedItem: [String, Number],
        isSideMenuCollapsed: Boolean,
        collapsedWidth: String,
      },
      emits: ['update:selectedItem', 'update:isSideMenuCollapsed'],
      template: `
        <div class="av-side-navigation-stub"
             @click="$emit('update:isSideMenuCollapsed', !isSideMenuCollapsed)">
        </div>`,
    },
    StudentSkillDetailedSection: {
      name: 'StudentSkillDetailedSection',
      template: '<div class="skill-detailed-section-stub">Skill Detailed Section</div>',
    },
    StudentSkillLevelDetailedSection: {
      name: 'StudentSkillLevelDetailedSection',
      template: '<div class="skill-level-detailed-section-stub">Skill Level Detailed Section</div>',
    },
    StudentSkillProgressSection: {
      name: 'StudentSkillProgressSection',
      template: '<div class="skill-progress-section-stub">Skill Progress Section</div>',
    },
    StudentSkillEvaluateSection: {
      name: 'StudentSkillEvaluateSection',
      template: '<div class="skill-evaluate-section-stub">Skill Evaluate Section</div>',
    },
  }

  beforeEach(() => {
    wrapper = mountComponent(StudentSkillViewContainer, {
      props: { skillDetailed: mockSkillDetailed },
      global: { stubs },
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the main container with correct class', () => {
      expect(wrapper.find('.student-skill-view-container').exists()).toBe(true)
    })

    BddTest().then('it should render an AvSideNavigation component', () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      expect(sideNavigation.exists()).toBe(true)
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(false)
      expect(sideNavigation.props('selectedItem')).toBe('SKILL_DETAILED')
      expect(sideNavigation.props('items')).toHaveLength(5)
    })

    BddTest().then('it should have navigation items with correct properties and order', () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      const items = sideNavigation.props('items') as Array<any>

      expect(items).toEqual([
        { id: 'SKILL_DETAILED', label: 'COMPÉTENCE A', icon: MDI_ICONS.STAR_SHOOTING_OUTLINE },
        { id: 'level:1', label: 'NIVEAU 1', icon: MDI_ICONS.FILE_TREE_OUTLINE },
        { id: 'level:2', label: 'NIVEAU 2', icon: MDI_ICONS.FILE_TREE_OUTLINE },
        { id: 'SKILL_PROGRESS', label: expect.any(String), icon: MDI_ICONS.CHART_TIMELINE_VARIANT_SHIMMER },
        { id: 'SKILL_EVALUATE', label: expect.any(String), icon: MDI_ICONS.NOTEBOOK_CHECK },
      ])
    })

    BddTest().then('it should render the content area', () => {
      const contentArea = wrapper.find('[data-testid="student-skill-view-container__content"]')
      expect(contentArea.exists()).toBe(true)
    })

    BddTest().then('it should display the skill detailed section by default', () => {
      const detailed = wrapper.findComponent(StudentSkillDetailedSection)
      expect(detailed.exists()).toBe(true)
    })
  })

  BddTest().when('the side menu is collapsed', () => {
    beforeEach(async () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      await sideNavigation.trigger('click')
    })

    BddTest().then('the side navigation should be collapsed', () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      expect(sideNavigation.props('isSideMenuCollapsed')).toBe(true)
    })
  })

  BddTest().when('a level item is selected', () => {
    BddTest().then('it should display level section', async () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      await sideNavigation.vm.$emit('update:selectedItem', 'level:1')
      const levelSection = wrapper.findComponent(StudentSkillLevelDetailedSection)
      expect(levelSection.exists()).toBe(true)
    })
  })

  BddTest().when('SKILL_PROGRESS is selected', () => {
    BddTest().then('it should display progress section', async () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      await sideNavigation.vm.$emit('update:selectedItem', 'SKILL_PROGRESS')
      const progressSection = wrapper.findComponent(StudentSkillProgressSection)
      expect(progressSection.exists()).toBe(true)
    })
  })

  BddTest().when('SKILL_EVALUATE is selected', () => {
    BddTest().then('it should display evaluate section', async () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      await sideNavigation.vm.$emit('update:selectedItem', 'SKILL_EVALUATE')
      const evalSection = wrapper.findComponent(StudentSkillEvaluateSection)
      expect(evalSection.exists()).toBe(true)
    })
  })

  BddTest().when('SKILL_DETAILED is selected', () => {
    BddTest().then('it should display detailed section', async () => {
      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      await sideNavigation.vm.$emit('update:selectedItem', 'SKILL_DETAILED')
      const detailedSection = wrapper.findComponent(StudentSkillDetailedSection)
      expect(detailedSection.exists()).toBe(true)
    })
  })

  BddTest().when('the displayed section changes', () => {
    BddTest().then('it should display only one section at a time', async () => {
      expect(wrapper.findComponent(StudentSkillDetailedSection).exists()).toBe(true)
      expect(wrapper.findComponent(StudentSkillLevelDetailedSection).exists()).toBe(false)

      const sideNavigation = wrapper.findComponent(AvSideNavigation)
      await sideNavigation.vm.$emit('update:selectedItem', 'level:2')

      expect(wrapper.findComponent(StudentSkillDetailedSection).exists()).toBe(false)
      expect(wrapper.findComponent(StudentSkillLevelDetailedSection).exists()).toBe(true)
    })
  })
})
