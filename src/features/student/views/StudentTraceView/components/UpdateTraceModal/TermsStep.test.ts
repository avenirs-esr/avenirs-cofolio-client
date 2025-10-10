import { mockedTraceAssociations } from '@/__mocks__/fixtures/student'
import { EFileType, ESkillLevelStatus, ETraceStatus, type TraceDetailDTO } from '@/api/avenir-esr'
import TermsStep from '@/features/student/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { mount, type VueWrapper } from '@vue/test-utils'
import { BddTest } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a terms step', () => {
  let wrapper: VueWrapper<InstanceType<typeof TermsStep>>

  const mockedTrace: TraceDetailDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    status: ETraceStatus.ASSOCIATED,
    createdAt: '2025-06-01T10:42:00.000Z',
    updatedAt: '2025-06-02T11:42:00.000Z',
    programName: 'An awesome program',
    aiUseJustification: 'An awesome justification',
    isGroup: false,
    personalNote: 'An awesome personal note',
    attachment: {
      id: 'mock-attachment',
      fileName: 'An awesome attachment',
      fileType: EFileType.TXT,
      fileSize: 1,
      version: 1,
      uploadedAt: '2025-06-02T11:42:00.000Z',
    },
    associationsTrace: mockedTraceAssociations
  }

  const stubs = {
    AvList: {
      name: 'AvList',
      props: ['size', 'role'],
      template: '<div class="av-list-stub"><slot/></div>'
    },
    AvListItem: {
      name: 'AvListItem',
      props: [
        'title',
        'icon',
        'iconColor',
        'color'
      ],
      template: `
      <div
        class="av-list-item-stub"
        :data-title="title"
        :data-icon="icon"
        :data-icon-color="iconColor"
        :data-color="color"
      >
        <div class="title">{{ title }}</div>
        <slot />
      </div>
    `
    },
    StudentSkillLevelStatusBadge: {
      name: 'StudentSkillLevelStatusBadge',
      props: ['status'],
      template: '<div class="status-badge">{{ status }}</div>'
    }
  }

  beforeEach(async () => {
    wrapper = mount(TermsStep, { props: {
      trace: mockedTrace,
    }, global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the impact and alert messages', () => {
      expect(wrapper.find('.caption-regular').text()).toEqual('Vos modifications affecteront la trace dans les associations suivantes :')
      expect(wrapper.find('.alert-message').text()).toEqual('Attention, message d\'information')
    })

    BddTest().then('it should render all skill-level and additional-skill items', () => {
      const items = wrapper.findAll('.av-list-item-stub')
      const expectedCount
        = mockedTraceAssociations.skillLevelAssociations.length
          + mockedTraceAssociations.additionalSkillAssociations.length
      expect(items.length).toBe(expectedCount)
    })

    BddTest().then('it should set correct title text on each rendered item', () => {
      const items = wrapper.findAll('.av-list-item-stub').map(n => n.get('.title').text())
      const expectedTitles = [
        ...mockedTraceAssociations.skillLevelAssociations.map(s => s.skillTitle),
        ...mockedTraceAssociations.additionalSkillAssociations.map(a => a.title)
      ]
      expect(items).toEqual(expectedTitles)
    })

    BddTest().then('it should use the right icon, icon color and text color for skill-level items', () => {
      const skillItems = wrapper.findAll('.av-list-item-stub')
        .slice(0, mockedTraceAssociations.skillLevelAssociations.length)

      const byTitle = (title: string) =>
        skillItems.find(w => w.attributes('data-title') === title)!

      const active = mockedTraceAssociations.skillLevelAssociations.find(s => s.status === ESkillLevelStatus.UNDER_ACQUISITION)!
      const inactive = mockedTraceAssociations.skillLevelAssociations.find(s => s.status !== ESkillLevelStatus.UNDER_ACQUISITION)!

      const activeItem = byTitle(active.skillTitle)
      expect(activeItem.attributes('data-icon')).toBe(MDI_ICONS.RECORD_CIRCLE_OUTLINE)
      expect(activeItem.attributes('data-icon-color')).toBe('var(--dark-background-primary1)')
      expect(activeItem.attributes('data-color')).toBe('')

      const inactiveItem = byTitle(inactive.skillTitle)
      expect([MDI_ICONS.CLOSE_CIRCLE_OUTLINE]).toContain(inactiveItem.attributes('data-icon'))
      expect(inactiveItem.attributes('data-icon-color')).toBe('var(--text2)')
      expect(inactiveItem.attributes('data-color')).toBe('var(--text2)')
    })

    BddTest().then('it should display a badge only for non-active statuses', () => {
      const badges = wrapper.findAll('.status-badge').map(b => b.text())
      expect(badges).toContain(ESkillLevelStatus.VALIDATED)
      expect(badges).toContain(ESkillLevelStatus.UNDER_REVIEW)
      expect(badges.length).toBe(3)
    })

    BddTest().then('it should render additional skills with the expected icon and color', () => {
      const offset = mockedTraceAssociations.skillLevelAssociations.length
      const additionalItems = wrapper.findAll('.av-list-item-stub').slice(offset)

      for (const additionalItem of additionalItems) {
        expect(additionalItem.attributes('data-icon')).toBe(MDI_ICONS.RECORD_CIRCLE_OUTLINE)
        expect(additionalItem.attributes('data-icon-color')).toBe('var(--dark-background-primary1)')
      }
    })
  })
})
