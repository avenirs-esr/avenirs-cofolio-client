import { mockedTraceAssociations } from '@/__mocks__/fixtures/student'
import { EFileType, type TraceDetailDTO } from '@/api/avenir-esr'
import TermsStep from '@/features/student/traces/views/StudentTraceView/components/UpdateTraceModal/TermsStep.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a terms step', () => {
  let wrapper: VueWrapper<InstanceType<typeof TermsStep>>

  const mockedTrace: TraceDetailDTO = {
    id: 'mock-trace',
    title: 'An awesome trace',
    link: 'https://example.com',
    isAssociated: true,
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
      url: 'exemple.com/image',
      uploadedAt: '2025-06-02T11:42:00.000Z',
    },
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
      associations: mockedTraceAssociations
    }, global: { stubs } })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render the impact and alert messages', () => {
      expect(wrapper.find('.caption-regular').text()).toEqual('Vos modifications affecteront la trace dans les associations suivantes :')
      expect(wrapper.find('.alert-message').text()).toEqual('Attention, message d\'information')
    })
  })
})
