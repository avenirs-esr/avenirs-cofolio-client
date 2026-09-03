import type { TraceViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EFileType, ETraceAuthorType } from '@/api/avenir-esr'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import TraceValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/TraceValorizedItem/TraceValorizedItem.vue'
import { ValorizedItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.stub'
import { TraceAiProducedBadgeStub } from '@/features/student/traces/components/badges/TraceAiProducedBadge/TraceAiProducedBadge.stub'
import { TraceAuthorTypeBadgeStub } from '@/features/student/traces/components/badges/TraceAuthorTypeBadge/TraceAuthorTypeBadge.stub'
import { TraceFileTypeBadgeStub } from '@/features/student/traces/components/badges/TraceFileTypeBadge/TraceFileTypeBadge.stub'
import { AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return { ...actual, useTextTruncation: () => ({ isTruncated: mockIsTruncated }) }
})

const BASE_TRACE: TraceViewDTO = {
  id: 'a985c67e-1ae0-4cc9-9ebd-b40fff4ee553',
  title: 'Ma trace de test',
  isAssociated: true,
  createdAt: '2025-03-03T10:00:00.000Z',
  updatedAt: '2025-03-03T10:00:00.000Z',
  authorType: ETraceAuthorType.PERSONAL
}

BddTest().given('a trace valorized item', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceValorizedItem>>
  let valorizedItem: VueWrapper<InstanceType<typeof ValorizedItemStub>>

  const stubs = {
    AvButton: AvButtonStub,
    AvTooltip: AvTooltipStub,
    ValorizedItem: ValorizedItemStub,
    TraceFileTypeBadge: TraceFileTypeBadgeStub,
    TraceAuthorTypeBadge: TraceAuthorTypeBadgeStub,
    TraceAiProducedBadge: TraceAiProducedBadgeStub,
  }

  function mountTraceValorizedItem (trace: TraceViewDTO, type: ValorizedItemType.ASSOCIATED_TRACE | ValorizedItemType.NON_ASSOCIATED_TRACE = ValorizedItemType.ASSOCIATED_TRACE) {
    wrapper = mountComponent(TraceValorizedItem, {
      props: { trace, type },
      global: { stubs }
    })
  }

  BddTest().when('the trace has no attachment, AI justification or personal note', () => {
    beforeEach(async () => {
      mountTraceValorizedItem(BASE_TRACE)
      await flushPromises()
      valorizedItem = wrapper.findComponent(ValorizedItemStub)
    })

    BddTest().then('it should render the wrapped ValorizedItem with the trace title', () => {
      expect(valorizedItem.exists()).toBe(true)
      expect(valorizedItem.props('title')).toBe('Ma trace de test')
    })

    BddTest().then('it should link the element to ValorizedItem', () => {
      expect(valorizedItem.exists()).toBe(true)
      expect(valorizedItem.props('itemId')).toEqual(BASE_TRACE.id)
    })

    BddTest().then('it should render the formatted creation date', () => {
      expect(wrapper.text()).toContain('Ajoutée le 03/03/2025')
    })

    BddTest().then('it should not render the file type badge', () => {
      expect(wrapper.findComponent(TraceFileTypeBadgeStub).exists()).toBe(false)
    })

    BddTest().then('it should render the AI produced badge with aiProduced set to false', () => {
      const badge = wrapper.findComponent(TraceAiProducedBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('aiProduced')).toBe(false)
    })

    BddTest().then('it should not render a personal note', () => {
      expect(wrapper.find('[data-testid="trace-valorized-item-personal-note"]').exists()).toBe(false)
    })
  })

  BddTest().when('the trace is a file with an author type, an AI justification and a personal note', () => {
    beforeEach(async () => {
      mountTraceValorizedItem({
        ...BASE_TRACE,
        attachment: {
          id: 'file-1',
          fileName: 'mon-fichier.pdf',
          fileType: EFileType.PDF,
          fileSize: 2516582,
          url: 'https://example.com/mon-fichier.pdf',
          uploadedAt: '2025-03-03T10:00:00.000Z'
        },
        authorType: ETraceAuthorType.PERSONAL,
        aiUseJustification: 'Génération assistée par IA',
        personalNote: 'Une note personnelle détaillée sur cette trace.'
      })
      await flushPromises()
      valorizedItem = wrapper.findComponent(ValorizedItemStub)
    })

    BddTest().then('it should render the formatted date and file size', () => {
      expect(wrapper.text()).toContain('Ajoutée le 03/03/2025')
      expect(wrapper.text()).toContain('2,4')
    })

    BddTest().then('it should render the file type badge', () => {
      expect(wrapper.findComponent(TraceFileTypeBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the author type badge', () => {
      expect(wrapper.findComponent(TraceAuthorTypeBadgeStub).exists()).toBe(true)
    })

    BddTest().then('it should render the AI produced badge with aiProduced set to true', () => {
      const badge = wrapper.findComponent(TraceAiProducedBadgeStub)
      expect(badge.exists()).toBe(true)
      expect(badge.props('aiProduced')).toBe(true)
    })

    BddTest().then('it should render the personal note prefixed with "Ma note personnelle"', () => {
      const note = wrapper.find('[data-testid="trace-valorized-item-personal-note"]')
      expect(note.exists()).toBe(true)
      expect(note.text()).toBe('Ma note personnelle : Une note personnelle détaillée sur cette trace.')
    })
  })

  BddTest().when('mounted with NON_ASSOCIATED_TRACE type', () => {
    beforeEach(async () => {
      mountTraceValorizedItem(BASE_TRACE, ValorizedItemType.NON_ASSOCIATED_TRACE)
      await flushPromises()
      valorizedItem = wrapper.findComponent(ValorizedItemStub)
    })

    BddTest().then('it should still link the trace to ValorizedItem', () => {
      expect(valorizedItem.props('itemId')).toBe(BASE_TRACE.id)
    })
  })
})
