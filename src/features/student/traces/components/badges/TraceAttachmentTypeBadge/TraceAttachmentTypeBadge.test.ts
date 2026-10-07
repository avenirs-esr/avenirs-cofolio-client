import type { VueWrapper } from '@vue/test-utils'
import { EFileType } from '@/api/avenir-esr'
import TraceAttachmentTypeBadge from '@/features/student/traces/components/badges/TraceAttachmentTypeBadge/TraceAttachmentTypeBadge.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvBadgeStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a trace attachment type badge', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceAttachmentTypeBadge>>

  const stubs = { AvBadge: AvBadgeStub }

  BddTest().when('the component is mounted with a PDF file type', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAttachmentTypeBadge, {
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

    BddTest().then('it should use the document icon', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('icon')).toBe(MDI_ICONS.FILE_DOCUMENT_MULTIPLE_OUTLINE)
    })
  })

  BddTest().when('the component is mounted with a DOCX file type', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAttachmentTypeBadge, {
        props: { fileType: EFileType.DOCX },
        global: { stubs }
      })
    })

    BddTest().then('it should render the file type as the badge label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('DOCX')
    })

    BddTest().then('it should use the document icon', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('icon')).toBe(MDI_ICONS.FILE_DOCUMENT_MULTIPLE_OUTLINE)
    })
  })

  BddTest().when('the component is mounted with a PNG file type', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAttachmentTypeBadge, {
        props: { fileType: EFileType.PNG },
        global: { stubs }
      })
    })

    BddTest().then('it should render the file type as the badge label', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('PNG')
    })

    BddTest().then('it should use the image icon', () => {
      expect(wrapper.findComponent(AvBadgeStub).props('icon')).toBe(MDI_ICONS.FILE_IMAGE_OUTLINE)
    })
  })

  BddTest().when('the component is mounted without a file type', () => {
    beforeEach(() => {
      wrapper = mountComponent(TraceAttachmentTypeBadge, {
        props: { fileType: undefined },
        global: { stubs }
      })
    })

    BddTest().then('it should render the link badge', () => {
      expect(wrapper.findComponent(AvBadgeStub).exists()).toBe(true)
      expect(wrapper.findComponent(AvBadgeStub).props('label')).toBe('lien')
      expect(wrapper.findComponent(AvBadgeStub).props('icon')).toBe(MDI_ICONS.LINK)
    })
  })
})
