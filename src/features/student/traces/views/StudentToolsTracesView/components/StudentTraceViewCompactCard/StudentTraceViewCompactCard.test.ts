import type { TraceViewDTO } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import StudentTraceViewCompactCard
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceViewCompactCard/StudentTraceViewCompactCard.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, RouterLinkStub, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student trace view compact card', () => {
  let wrapper: VueWrapper

  const trace: TraceViewDTO = {
    id: 'trace-id',
    title: 'Ma trace',
    isAssociated: true,
    isDeletable: true,
    createdAt: '2026-06-15T10:00:00.000Z',
    updatedAt: '2026-06-15T10:00:00.000Z'
  }

  const stubs = {
    RouterLink: RouterLinkStub,
    FloatingIconCard: FloatingIconCardStub
  }

  function mountComponent (customTrace: TraceViewDTO = trace) {
    wrapper = mount(StudentTraceViewCompactCard, {
      props: {
        trace: customTrace
      },
      global: { stubs }
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mountComponent()
  })

  BddTest().then('it should render the card', () => {
    expect(wrapper.find('[data-testid="trace-card"]').exists()).toBe(true)
  })

  BddTest().then('it should redirect to trace detail page', () => {
    const routerLink = wrapper.findComponent(RouterLinkStub)

    expect(routerLink.props('to')).toEqual({
      name: ROUTES.STUDENT.TRACE.name,
      params: { id: trace.id }
    })
  })

  BddTest().then('it should provide trace title to floating icon card', () => {
    const card = wrapper.findComponent({ name: 'FloatingIconCard' })

    expect(card.props('title')).toBe(trace.title)
  })

  BddTest().then('it should configure floating icon card display', () => {
    const card = wrapper.findComponent({ name: 'FloatingIconCard' })

    expect(card.props('height')).toBe('8rem')
    expect(card.props('headerRows')).toBe(2)
    expect(card.props('titleTypographyClasses')).toBe('b1-bold')
    expect(card.props('titleColor')).toBe('var(--text1)')
  })

  BddTest().then('it should provide icon options to floating icon card', () => {
    const card = wrapper.findComponent({ name: 'FloatingIconCard' })

    expect(card.props('iconOptions')).toEqual(
      expect.objectContaining({
        color: 'var(--text1)',
        bottom: 'calc(-1 * var(--spacing-xl))',
        right: 'var(--spacing-xs)',
        borderColor: 'var(--other-border-skill-card)'
      })
    )
  })
})
