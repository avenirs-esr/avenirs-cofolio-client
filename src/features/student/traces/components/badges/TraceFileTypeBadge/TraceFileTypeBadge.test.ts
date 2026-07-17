import type { VueWrapper } from '@vue/test-utils'
import { EFileType } from '@/api/avenir-esr'
import TraceFileTypeBadge from '@/features/student/traces/components/badges/TraceFileTypeBadge/TraceFileTypeBadge.vue'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a trace file type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceFileTypeBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the component is mounted with a PDF file type', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceFileTypeBadge, {
        props: { fileType: EFileType.PDF },
        global: { stubs }
      })
    })

    BddTest().then('it should render the file type as the badge label', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('label')).toBe('PDF')
    })

    BddTest().then('it should use the surface background and skill card border colors', () => {
      const badge = wrapper.findComponent(AvBadgeStub)
      expect(badge.props('backgroundColor')).toBe('var(--surface-background)')
      expect(badge.props('borderColor')).toBe('var(--other-border-skill-card)')
    })
  })

  BddTest().when('the component is mounted with a DOCX file type', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceFileTypeBadge, {
        props: { fileType: EFileType.DOCX },
        global: { stubs }
      })
    })

    BddTest().then('it should render the file type as the badge label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('DOCX')
    })
  })
})
