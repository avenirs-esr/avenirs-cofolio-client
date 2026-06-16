import type { TraceViewDTO } from '@/api/avenir-esr'
import { CompactCardStub } from '@/features/student/global/components/cards/CompactCard/CompactCard.stub'
import StudentTraceViewCompactCard
  from '@/features/student/traces/views/StudentToolsTracesView/components/StudentTraceViewCompactCard/StudentTraceViewCompactCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('a student trace view compact card', () => {
  let wrapper: VueWrapper<InstanceType<typeof StudentTraceViewCompactCard>>

  const trace: TraceViewDTO = {
    id: 'trace-id',
    title: 'Ma trace',
    isAssociated: true,
    createdAt: '2026-06-15T10:00:00.000Z',
    updatedAt: '2026-06-15T10:00:00.000Z'
  }

  const stubs = {
    CompactCard: CompactCardStub
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
    expect(wrapper.find('[data-testid="compact-card"]').exists()).toBe(true)
  })

  BddTest().then('it should provide trace element to compact card', () => {
    const card = wrapper.findComponent({ name: 'CompactCard' })

    expect(card.props('element')).toEqual({
      id: trace.id,
      title: trace.title
    })
  })

  BddTest().then('it should configure compact card icon', () => {
    const card = wrapper.findComponent({ name: 'CompactCard' })

    expect(card.props('icon')).toBe(MDI_ICONS.ATTACH_FILE)
    expect(card.props('iconColor')).toBe('var(--text1)')
    expect(card.props('iconBorderColor')).toBe('var(--other-border-skill-card)')
  })

  BddTest().then('it should configure compact card display', () => {
    const card = wrapper.findComponent({ name: 'CompactCard' })

    expect(card.props('color')).toBe('var(--text1)')
    expect(card.props('backgroundColor')).toBe('var(--surface-background)')
    expect(card.props('borderColor')).toBe('var(--other-border-skill-card)')
  })
})
