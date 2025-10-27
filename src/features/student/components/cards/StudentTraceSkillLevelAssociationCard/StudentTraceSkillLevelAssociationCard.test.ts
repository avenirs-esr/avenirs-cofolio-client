import type { VueWrapper } from '@vue/test-utils'
import { EAmsStatus, ESkillLevelStatus, type SkillLevelAssociationDTO } from '@/api/avenir-esr'
import { StudentTraceSkillLevelAssociationCard } from '@/features/student/components/cards'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const stubs = {
  AvBadge: AvBadgeStub,
  StudentTraceAssociationCard: {
    name: 'StudentTraceAssociationCard',
    template: `
      <div class="student-trace-association-card">
        <div class="title-prepend"><slot name="title-prepend" /></div>
        <div class="body"><slot name="body" /></div>
      </div>
    `,
    props: {
      title: String
    }
  },
  StudentSkillLevelStatusBadge: {
    name: 'StudentSkillLevelStatusBadge',
    template: '<div class="student-skill-level-status-badge" />',
    props: {
      status: String
    }
  },
  StudentTraceAssociationContentBadge: {
    name: 'StudentTraceAssociationContentBadge',
    template: '<div class="student-trace-association-content-badge" />',
    props: {
      label: String,
      iconDataUrl: String
    }
  },
  StudentAmsStatusBadge: {
    name: 'StudentAmsStatusBadge',
    template: '<div class="student-ams-status-badge" />',
    props: {
      status: String
    }
  }
}

BddTest().given('a student trace skill level association card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceSkillLevelAssociationCard>>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with skill without AMS', () => {
    const skillWithoutAms: SkillLevelAssociationDTO = {
      id: 'skill-1',
      skillTitle: 'Compétence Test',
      level: 'Niv. 1',
      status: ESkillLevelStatus.VALIDATED
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceSkillLevelAssociationCard, {
        props: {
          skill: skillWithoutAms
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render StudentTraceAssociationCard with skill title', () => {
      const card = wrapper.findComponent({ name: 'StudentTraceAssociationCard' })

      expect(card.exists()).toBe(true)
      expect(card.props('title')).toBe('Compétence Test')
    })

    BddTest().then('it should render skill level badge', () => {
      const levelBadge = wrapper.findComponent({ name: 'AvBadge' })

      expect(levelBadge.exists()).toBe(true)
      expect(levelBadge.props('label')).toBe('Niv. 1')
      expect(levelBadge.props('color')).toBe('var(--card)')
      expect(levelBadge.props('backgroundColor')).toBe('var(--skill3)')
      expect(levelBadge.props('small')).toBe(true)
      expect(levelBadge.props('ellipsis')).toBe(true)
    })

    BddTest().then('it should render skill status badge', () => {
      const statusBadge = wrapper.findComponent({ name: 'StudentSkillLevelStatusBadge' })

      expect(statusBadge.exists()).toBe(true)
      expect(statusBadge.props('status')).toBe(ESkillLevelStatus.VALIDATED)
    })

    BddTest().then('it should not render AMS section', () => {
      const amsContentBadge = wrapper.findComponent({ name: 'StudentTraceAssociationContentBadge' })
      const amsStatusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })

      expect(amsContentBadge.exists()).toBe(false)
      expect(amsStatusBadge.exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with skill with AMS', () => {
    const skillWithAms: SkillLevelAssociationDTO = {
      id: 'skill-2',
      skillTitle: 'Compétence avec AMS',
      level: 'Niv. 2',
      status: ESkillLevelStatus.UNDER_ACQUISITION,
      ams: {
        id: 'ams-1',
        title: 'SAE 1.4 Etude des risques',
        status: EAmsStatus.COMPLETED
      }
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceSkillLevelAssociationCard, {
        props: {
          skill: skillWithAms
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render AMS content badge with title', () => {
      const amsContentBadge = wrapper.findComponent({ name: 'StudentTraceAssociationContentBadge' })

      expect(amsContentBadge.exists()).toBe(true)
      expect(amsContentBadge.props('label')).toBe('SAE 1.4 Etude des risques')
    })

    BddTest().then('it should render AMS status badge', () => {
      const amsStatusBadge = wrapper.findComponent({ name: 'StudentAmsStatusBadge' })

      expect(amsStatusBadge.exists()).toBe(true)
      expect(amsStatusBadge.props('status')).toBe(EAmsStatus.COMPLETED)
    })
  })

  BddTest().when('the component is mounted with custom level color', () => {
    const skill: SkillLevelAssociationDTO = {
      id: 'skill-3',
      skillTitle: 'Compétence Custom Color',
      level: 'Niv. 3',
      status: ESkillLevelStatus.NOT_STARTED
    }

    beforeEach(() => {
      wrapper = mountComponent(StudentTraceSkillLevelAssociationCard, {
        props: {
          skill,
          levelColor: 'var(--skill1)'
        },
        global: {
          stubs
        }
      })
    })

    BddTest().then('it should render level badge with custom color', () => {
      const levelBadge = wrapper.findComponent({ name: 'AvBadge' })

      expect(levelBadge.exists()).toBe(true)
      expect(levelBadge.props('backgroundColor')).toBe('var(--skill1)')
    })
  })

  BddTest().when('the component is mounted with all statuses', () => {
    const skillValidated: SkillLevelAssociationDTO = {
      id: 'skill-4',
      skillTitle: 'Compétence Validée',
      level: 'Niv. 1',
      status: ESkillLevelStatus.VALIDATED
    }

    const skillUnderAcquisition: SkillLevelAssociationDTO = {
      id: 'skill-5',
      skillTitle: 'Compétence En Cours',
      level: 'Niv. 2',
      status: ESkillLevelStatus.UNDER_ACQUISITION
    }

    const skillNotStarted: SkillLevelAssociationDTO = {
      id: 'skill-6',
      skillTitle: 'Compétence Non Démarrée',
      level: 'Niv. 3',
      status: ESkillLevelStatus.NOT_STARTED
    }

    BddTest().then('it should render VALIDATED status correctly', () => {
      wrapper = mountComponent(StudentTraceSkillLevelAssociationCard, {
        props: { skill: skillValidated },
        global: { stubs }
      })

      const statusBadge = wrapper.findComponent({ name: 'StudentSkillLevelStatusBadge' })
      expect(statusBadge.props('status')).toBe(ESkillLevelStatus.VALIDATED)
    })

    BddTest().then('it should render UNDER_ACQUISITION status correctly', () => {
      wrapper = mountComponent(StudentTraceSkillLevelAssociationCard, {
        props: { skill: skillUnderAcquisition },
        global: { stubs }
      })

      const statusBadge = wrapper.findComponent({ name: 'StudentSkillLevelStatusBadge' })
      expect(statusBadge.props('status')).toBe(ESkillLevelStatus.UNDER_ACQUISITION)
    })

    BddTest().then('it should render NOT_STARTED status correctly', () => {
      wrapper = mountComponent(StudentTraceSkillLevelAssociationCard, {
        props: { skill: skillNotStarted },
        global: { stubs }
      })

      const statusBadge = wrapper.findComponent({ name: 'StudentSkillLevelStatusBadge' })
      expect(statusBadge.props('status')).toBe(ESkillLevelStatus.NOT_STARTED)
    })
  })
})
