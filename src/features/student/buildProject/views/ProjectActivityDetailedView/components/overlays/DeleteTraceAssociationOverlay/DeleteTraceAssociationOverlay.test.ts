import type { VueWrapper } from '@vue/test-utils'
import { TraceCompactCardStub } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/TraceCompactCard/TraceCompactCard.stub'
import DeleteTraceAssociationOverlay, {
  type DeleteTraceAssociationOverlayProps
} from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/overlays/DeleteTraceAssociationOverlay/DeleteTraceAssociationOverlay.vue'
import { DeleteOverlayStub } from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'

BddTest().given('a delete trace association overlay', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteTraceAssociationOverlay>>

  const stubs = {
    TraceCompactCard: TraceCompactCardStub,
    DeleteOverlay: DeleteOverlayStub
  }

  const props: DeleteTraceAssociationOverlayProps = {
    trace: {
      id: 'trace-1',
      title: 'Trace Title'
    }
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteTraceAssociationOverlay, {
        props,
        global: { stubs }
      })
    })

    BddTest().then('it should render the delete overlay', () => {
      const overlay = wrapper.findComponent(DeleteOverlayStub)

      expect(overlay.exists()).toBe(true)
    })

    BddTest().then('it should render the trace compact card', () => {
      const traceCompactCard = wrapper.findComponent(TraceCompactCardStub)

      expect(traceCompactCard.exists()).toBe(true)
    })

    BddTest().then('it should pass the trace to the trace compact card', () => {
      const traceCompactCard = wrapper.findComponent(TraceCompactCardStub)

      expect(traceCompactCard.props('trace')).toEqual({
        id: 'trace-1',
        title: 'Trace Title'
      })
    })

    BddTest().and('the delete overlay emits delete', () => {
      beforeEach(async () => {
        const overlay = wrapper.findComponent(DeleteOverlayStub)
        overlay.vm.$emit('delete')
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should emit delete with the trace id', () => {
        expect(wrapper.emitted('delete')).toEqual([['trace-1']])
      })
    })
  })
})
