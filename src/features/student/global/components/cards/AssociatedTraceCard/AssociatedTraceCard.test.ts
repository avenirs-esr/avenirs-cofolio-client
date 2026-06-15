import { mockedDeclaredActivityAssociations } from '@/__mocks__/fixtures/student/activities.fixtures'
import { ICONS, ROUTES } from '@/common/constants'
import AssociatedTraceCard, { type AssociatedTraceCardProps } from '@/features/student/global/components/cards/AssociatedTraceCard/AssociatedTraceCard.vue'
import { AssociationCardStub } from '@/features/student/global/components/cards/AssociationCard/AssociationCard.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, vi } from 'vitest'

BddTest().given('an associatied trace card', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociatedTraceCard>>

  const stubs = { AssociationCard: AssociationCardStub }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    const props: AssociatedTraceCardProps = {
      associatedTrace: mockedDeclaredActivityAssociations.traceAssociations[0],
    }

    beforeEach(() => {
      wrapper = mount(AssociatedTraceCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the AssociationCard with the correct props', () => {
      const associationCard = wrapper.findComponent(AssociationCardStub)
      expect(associationCard.exists()).toBe(true)
      expect(associationCard.props()).toMatchObject({
        title: props.associatedTrace.trace.title,
        icon: ICONS.TRACES,
        color: 'var(--text1)',
        backgroundColor: 'var(--light-background-neutral)',
        hoverBorderColor: 'var(--dark-background-primary1)',
        iconBorderColor: 'var(--other-border-skill-card)',
        to: { name: ROUTES.STUDENT.TOOLS_TRACE.name, params: { id: props.associatedTrace.trace.id } }
      })
    })
  })
})
