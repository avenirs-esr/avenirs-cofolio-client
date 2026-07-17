import type { TraceViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EFileType, ETraceAuthorType } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import TraceValorizedItem from '@/features/student/kit/views/StudentToolsKitView/components/TraceValorizedItem/TraceValorizedItem.vue'
import { AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const BASE_TRACE: TraceViewDTO = {
  id: 'a985c67e-1ae0-4cc9-9ebd-b40fff4ee553',
  title: 'Ma trace de test',
  isAssociated: true,
  createdAt: '2025-03-03T10:00:00.000Z',
  updatedAt: '2025-03-03T10:00:00.000Z'
}

BddTest().given('a trace valorized item', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceValorizedItem>>

  const stubs = {
    AvButton: AvButtonStub,
    AvTooltip: AvTooltipStub
  }

  function mountTraceValorizedItem (trace: TraceViewDTO, type: ValorizedItemType = ValorizedItemType.ASSOCIATED_TRACE, isLastItem = false) {
    wrapper = mountComponent(TraceValorizedItem, {
      props: { trace, type, isLastItem },
      global: { stubs }
    })
  }

  BddTest().when('the trace has no attachment, author type, AI justification or personal note', () => {
    beforeEach(async () => {
      mountTraceValorizedItem(BASE_TRACE)
      await flushPromises()
    })

    BddTest().then('it should render the wrapped ValorizedItem with the trace title', () => {
      expect(wrapper.find('[data-testid="valorized-item"]').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe('Ma trace de test')
    })

    BddTest().then('it should render the access button pointing to the trace detail route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.TOOLS_TRACE.name,
        params: { id: BASE_TRACE.id }
      })
    })

    BddTest().then('it should render the formatted creation date', () => {
      expect(wrapper.text()).toContain('Ajoutée le 03/03/2025')
    })

    BddTest().then('it should not render the file type badge', () => {
      expect(wrapper.find('[data-testid="trace-file-type-badge"]').exists()).toBe(false)
    })

    BddTest().then('it should not render the author type badge', () => {
      expect(wrapper.find('[data-testid="trace-author-type-badge"]').exists()).toBe(false)
    })

    BddTest().then('it should not render the AI produced badge', () => {
      expect(wrapper.find('[data-testid="trace-ai-produced-badge"]').exists()).toBe(false)
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
    })

    BddTest().then('it should render the formatted date and file size', () => {
      expect(wrapper.text()).toContain('Ajoutée le 03/03/2025')
      expect(wrapper.text()).toContain('2,4')
    })

    BddTest().then('it should render the file type badge', () => {
      expect(wrapper.find('[data-testid="trace-file-type-badge"]').exists()).toBe(true)
    })

    BddTest().then('it should render the author type badge', () => {
      expect(wrapper.find('[data-testid="trace-author-type-badge"]').exists()).toBe(true)
    })

    BddTest().then('it should render the AI produced badge', () => {
      expect(wrapper.find('[data-testid="trace-ai-produced-badge"]').exists()).toBe(true)
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
    })

    BddTest().then('it should still render the access button pointing to the trace detail route', () => {
      expect(wrapper.findComponent(AvButtonStub).props('to')).toEqual({
        name: ROUTES.STUDENT.TOOLS_TRACE.name,
        params: { id: BASE_TRACE.id }
      })
    })
  })
})
