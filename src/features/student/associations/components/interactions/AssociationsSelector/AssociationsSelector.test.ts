import {
  createMockedDeclaredActivityAssociation,
  createMockedDeclaredExperienceAssociations,
  createMockedDeclaredSkillAssociations,
  createMockedTraceAssociations,
  mockedEmptyAssociations
} from '@/__mocks__/fixtures/student/associations.fixtures'
import { type AssociationsDTO, EAssociationContextType, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { ICONS } from '@/common/constants'
import AssociationsSelector, {
  type AssociationsSelectorProps
} from '@/features/student/associations/components/interactions/AssociationsSelector/AssociationsSelector.vue'
import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import { DeclaredExperienceTypeBadgeStub }
  from '@/features/student/personalCareer/components/badges/DeclaredExperienceTypeBadge/DeclaredExperienceTypeBadge.stub'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const stubs = {
  CompactCardSelector: CompactCardSelectorStub,
  DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub,
  DeclaredExperienceTypeBadge: DeclaredExperienceTypeBadgeStub,
  AvBadge: AvBadgeStub
}

function mountSelector (props: AssociationsSelectorProps & { modelValue?: string[] }) {
  return mountComponent(AssociationsSelector, { props, global: { stubs } })
}

BddTest().given('an associations selector', () => {
  let wrapper: ReturnType<typeof mountSelector>

  const findSelector = () => wrapper.findComponent(CompactCardSelectorStub)

  BddTest().when('it is mounted with trace associations', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      traceAssociations: createMockedTraceAssociations(2),
      declaredSkillAssociations: createMockedDeclaredSkillAssociations(1)
    }

    beforeEach(() => {
      wrapper = mountSelector({ associatedContextType: EAssociationContextType.TRACE, associations })
    })

    BddTest().then('it should render the selector', () => {
      expect(wrapper.find('[data-testid="associations-selector"]').exists()).toBe(true)
    })

    BddTest().then('it should only propose the trace associations, without slot', () => {
      expect(findSelector().props('elements')).toEqual(associations.traceAssociations.map(({ associationId, trace }) => ({
        id: associationId,
        title: trace.title
      })))
    })

    BddTest().then('it should use the trace icon and the default colors', () => {
      expect(findSelector().props('icon')).toBe(ICONS.TRACES)
      expect(findSelector().props('iconColor')).toBeUndefined()
      expect(findSelector().props('backgroundColor')).toBeUndefined()
    })

    BddTest().then('it should not render any badge', () => {
      expect(wrapper.findComponent(DeclaredActivityStatusBadgeStub).exists()).toBe(false)
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(false)
      expect(wrapper.findComponent(DeclaredExperienceTypeBadgeStub).exists()).toBe(false)
    })

    BddTest().then('it should be editable by default', () => {
      expect(findSelector().props('readonly')).toBe(false)
    })
  })

  BddTest().when('it is mounted with declared activity associations', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      declaredActivityAssociations: [
        createMockedDeclaredActivityAssociation({ associationId: '1', status: EDeclaredActivityStatus.SUBSCRIBED }),
        createMockedDeclaredActivityAssociation({ associationId: '2', status: EDeclaredActivityStatus.SUBMITTED }),
        createMockedDeclaredActivityAssociation({ associationId: '3', status: EDeclaredActivityStatus.COMPLETED }),
        createMockedDeclaredActivityAssociation({ associationId: '4', status: EDeclaredActivityStatus.IN_PROGRESS })
      ]
    }

    beforeEach(() => {
      wrapper = mountSelector({ associatedContextType: EAssociationContextType.DECLARED_ACTIVITY, associations })
    })

    BddTest().then('it should propose the declared activity associations with their declared activity', () => {
      expect(findSelector().props('elements')).toEqual(associations.declaredActivityAssociations.map(({ associationId, declaredActivity }) =>
        expect.objectContaining({ id: associationId, title: declaredActivity.title, baseElement: declaredActivity, showSlot: true })))
    })

    BddTest().then('it should disable the associations that can not be deleted', () => {
      expect(findSelector().props('elements').map(({ disabled }) => disabled))
        .toEqual([false, true, true, false])
    })

    BddTest().then('it should use the activity icon and colors', () => {
      expect(findSelector().props('icon')).toBe(ICONS.ACTIVITY)
      expect(findSelector().props('iconColor')).toBe('var(--icon)')
      expect(findSelector().props('backgroundColor')).toBe('var(--surface-background)')
    })

    BddTest().then('it should render a status badge for every association', () => {
      const badges = wrapper.findAllComponents(DeclaredActivityStatusBadgeStub)

      expect(badges.map(badge => badge.props('status'))).toEqual([
        EDeclaredActivityStatus.SUBSCRIBED,
        EDeclaredActivityStatus.SUBMITTED,
        EDeclaredActivityStatus.COMPLETED,
        EDeclaredActivityStatus.IN_PROGRESS
      ])
    })

    BddTest().and('an association is selected', () => {
      beforeEach(async () => {
        await wrapper.findAll('[data-testid="compact-card-selector"]')[0].trigger('click')
      })

      BddTest().then('it should update the model with the association id', () => {
        expect(wrapper.emitted('update:modelValue')).toEqual([[['1']]])
      })
    })
  })

  BddTest().when('it is mounted with declared skill associations', () => {
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      declaredSkillAssociations: createMockedDeclaredSkillAssociations(2)
    }

    beforeEach(() => {
      wrapper = mountSelector({ associatedContextType: EAssociationContextType.DECLARED_SKILL, associations })
    })

    BddTest().then('it should propose the declared skill associations with their declared skill', () => {
      expect(findSelector().props('elements')).toEqual(associations.declaredSkillAssociations.map(({ associationId, declaredSkill }) => ({
        id: associationId,
        title: declaredSkill.title,
        baseElement: declaredSkill,
        showSlot: true
      })))
    })

    BddTest().then('it should use the skill icon', () => {
      expect(findSelector().props('icon')).toBe(ICONS.SKILLS)
    })

    BddTest().then('it should render a translated type badge for every association', () => {
      const badges = wrapper.findAllComponents(AvBadgeStub)

      expect(badges).toHaveLength(2)
      badges.forEach((badge) => {
        expect(badge.props()).toMatchObject({
          label: 'Rome 4.0',
          color: 'var(--text1)',
          borderColor: 'var(--other-border-skill-card)',
          backgroundColor: 'var(--surface-background)',
          icon: MDI_ICONS.BOOKMARK_CHECK,
          small: true,
          ellipsis: true
        })
      })
    })
  })

  BddTest().when('it is mounted with declared experience associations', () => {
    const [firstAssociation, secondAssociation] = createMockedDeclaredExperienceAssociations(2)
    const associations: AssociationsDTO = {
      ...mockedEmptyAssociations,
      declaredExperienceAssociations: [
        firstAssociation,
        { ...secondAssociation, declaredExperience: { ...secondAssociation.declaredExperience, experienceType: undefined } }
      ]
    }

    beforeEach(() => {
      wrapper = mountSelector({ associatedContextType: EAssociationContextType.DECLARED_EXPERIENCE, associations })
    })

    BddTest().then('it should only show the slot of the declared experiences having a type', () => {
      expect(findSelector().props('elements')).toEqual(associations.declaredExperienceAssociations.map(({ associationId, declaredExperience }) => ({
        id: associationId,
        title: declaredExperience.title,
        baseElement: declaredExperience,
        showSlot: !!declaredExperience.experienceType
      })))
    })

    BddTest().then('it should use the experience icon', () => {
      expect(findSelector().props('icon')).toBe(ICONS.EXPERIENCES)
    })

    BddTest().then('it should render the experience type badge of the typed declared experience only', () => {
      const badges = wrapper.findAllComponents(DeclaredExperienceTypeBadgeStub)

      expect(badges).toHaveLength(1)
      expect(badges[0].props('experienceType')).toBe(firstAssociation.declaredExperience.experienceType)
    })
  })

  BddTest().when('it is mounted without association of the given context type', () => {
    beforeEach(() => {
      wrapper = mountSelector({
        associatedContextType: EAssociationContextType.DECLARED_SKILL,
        associations: { ...mockedEmptyAssociations, traceAssociations: createMockedTraceAssociations(1) }
      })
    })

    BddTest().then('it should not propose any element', () => {
      expect(findSelector().props('elements')).toEqual([])
    })
  })

  BddTest().when('it is mounted in readonly mode with selected associations', () => {
    beforeEach(() => {
      wrapper = mountSelector({
        associatedContextType: EAssociationContextType.TRACE,
        associations: { ...mockedEmptyAssociations, traceAssociations: createMockedTraceAssociations(2) },
        readonly: true,
        modelValue: ['association-2']
      })
    })

    BddTest().then('it should pass readonly down to the compact card selector', () => {
      expect(findSelector().props('readonly')).toBe(true)
    })

    BddTest().then('it should pass the selected association ids down to the compact card selector', () => {
      expect(findSelector().props('modelValue')).toEqual(['association-2'])
    })
  })
})
