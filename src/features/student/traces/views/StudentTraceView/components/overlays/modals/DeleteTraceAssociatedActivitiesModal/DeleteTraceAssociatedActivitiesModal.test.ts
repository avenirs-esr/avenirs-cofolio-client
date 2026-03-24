import type { DeclaredActivityAssociationDTO } from '@/api/avenir-esr'
import { EActivityThematic, EDeclaredActivityStatus } from '@/api/avenir-esr'
import { CompactCardSelectorStub } from '@/features/student/global/components/cards/CompactCardSelector/CompactCardSelector.stub'
import { DeleteAssociationsModalStub } from '@/features/student/global/components/overlays/modals/DeleteAssociationsModal/DeleteAssociationsModal.stub'
import DeleteTraceAssociatedActivitiesModal, {
  type DeleteTraceAssociatedActivitiesModalProps
} from '@/features/student/traces/views/StudentTraceView/components/overlays/modals/DeleteTraceAssociatedActivitiesModal/DeleteTraceAssociatedActivitiesModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a delete trace associated activities modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteTraceAssociatedActivitiesModal>>

  const stubs = {
    DeleteAssociationsModal: DeleteAssociationsModalStub,
    CompactCardSelector: CompactCardSelectorStub,
  }

  const associations: DeclaredActivityAssociationDTO[] = [
    {
      associationId: 'assoc-1',
      declaredActivity: {
        id: 'activity-1',
        activityId: 'act-1',
        title: 'Activité 1',
        thematic: EActivityThematic.PROGRAMS,
        status: EDeclaredActivityStatus.IN_PROGRESS,
        summary: 'Summary 1',
      }
    },
    {
      associationId: 'assoc-2',
      declaredActivity: {
        id: 'activity-2',
        activityId: 'act-2',
        title: 'Activité 2',
        thematic: EActivityThematic.EXPERIENCES,
        status: EDeclaredActivityStatus.COMPLETED,
        summary: 'Summary 2',
      }
    }
  ]

  const props: DeleteTraceAssociatedActivitiesModalProps = {
    show: true,
    traceId: 'trace-1',
    associations,
  }

  BddTest().when('the modal is shown', () => {
    beforeEach(() => {
      wrapper = mount(DeleteTraceAssociatedActivitiesModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the delete associations modal', () => {
      const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
      expect(confirmModal.exists()).toBe(true)
    })

    BddTest().then('it should render the compact card selector', () => {
      const selector = wrapper.findComponent(CompactCardSelectorStub)
      expect(selector.exists()).toBe(true)
    })

    BddTest().then('it should pass selectable elements derived from associations to the compact card selector', () => {
      const selector = wrapper.findComponent(CompactCardSelectorStub)
      expect(selector.props('elements')).toEqual([
        { id: 'assoc-1', title: 'Activité 1' },
        { id: 'assoc-2', title: 'Activité 2' },
      ])
    })

    BddTest().then('it should initialize selectedIds as empty', () => {
      const selector = wrapper.findComponent(CompactCardSelectorStub)
      expect(selector.props('modelValue')).toEqual([])
    })

    BddTest().and('the compact card selector emits update:modelValue', () => {
      beforeEach(() => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        selector.vm.$emit('update:modelValue', ['assoc-1', 'assoc-2'])
      })

      BddTest().then('the selectedIds should be updated accordingly', () => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        expect(selector.props('modelValue')).toEqual(['assoc-1', 'assoc-2'])
      })
    })

    BddTest().and('the delete associations modal emits cancel', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('cancel')
      })

      BddTest().then('the modal should emit cancel', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })

      BddTest().then('the selectedIds should be reset', () => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        expect(selector.props('modelValue')).toEqual([])
      })
    })

    BddTest().and('the delete associations modal emits confirmDelete', () => {
      beforeEach(() => {
        const confirmModal = wrapper.findComponent(DeleteAssociationsModalStub)
        confirmModal.vm.$emit('confirmDelete')
      })

      BddTest().then('the modal should emit deleted', () => {
        expect(wrapper.emitted('deleted')).toBeTruthy()
      })

      BddTest().then('the selectedIds should be reset', () => {
        const selector = wrapper.findComponent(CompactCardSelectorStub)
        expect(selector.props('modelValue')).toEqual([])
      })
    })
  })
})
