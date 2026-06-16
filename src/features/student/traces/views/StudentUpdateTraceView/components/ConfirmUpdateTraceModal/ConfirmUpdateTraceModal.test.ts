import { EDeclaredActivityStatus, type TraceDeclaredActivityDTO } from '@/api/avenir-esr'
import { DeclaredActivityStatusBadgeStub } from '@/common/activities/badges/DeclaredActivityStatusBadge/DeclaredActivityStatusBadge.stub'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import ConfirmUpdateTraceModal, { type ConfirmUpdateTraceModalProps } from '@/features/student/traces/views/StudentUpdateTraceView/components/ConfirmUpdateTraceModal/ConfirmUpdateTraceModal.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvIconStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'

const mockedLockedDeclaredActivities: TraceDeclaredActivityDTO = {
  activityId: 'declared-activity-1',
  activityTitle: 'Activité "Connaissance de soi" : Définir ses valeurs',
  activityStatus: EDeclaredActivityStatus.SUBMITTED,
}

BddTest().given('a ConfirmUpdateTraceModal', () => {
  let wrapper: VueWrapper<InstanceType<typeof ConfirmUpdateTraceModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
    DeclaredActivityStatusBadge: DeclaredActivityStatusBadgeStub,
    AvIcon: AvIconStub
  }

  const props: ConfirmUpdateTraceModalProps = {
    show: true,
    lockedDeclaredActivities: [mockedLockedDeclaredActivities]
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(ConfirmUpdateTraceModal, { props, global: { stubs } })
    })

    BddTest().then('it should render the confirmation modal', () => {
      const confirmationModal = wrapper.findComponent(ConfirmationModalStub)

      expect(confirmationModal.exists()).toBe(true)
      expect(confirmationModal.props('show')).toBe(true)
      expect(confirmationModal.props('confirmButtonLabel')).toBe('Modifier Ma Trace')
    })

    BddTest().then('it should render the title and subtitle', () => {
      const title = wrapper.find('[data-testid="confirm-update-trace-modal-title"]')
      const subtitle = wrapper.find('[data-testid="confirm-update-trace-modal-subtitle"]')

      expect(title.exists()).toBe(true)
      expect(title.text()).toBe('Vous êtes sur le point de modifier votre trace.')
      expect(subtitle.exists()).toBe(true)
      expect(subtitle.text()).toBe('Attention, les modifications ne pourront pas être appliqués dans ces contextes d\'association car ils font partis d\'un travail en cours d\'examen ou terminé :')
    })

    BddTest().then('it should render non editable associations', () => {
      const icons = wrapper.findAllComponents(AvIconStub)
      const badges = wrapper.findAllComponents(DeclaredActivityStatusBadgeStub)
      expect(icons.length).toBe(1)
      expect(icons[0].props('name')).toBe(MDI_ICONS.CLOSE_CIRCLE_OUTLINE)
      expect(badges.length).toBe(1)
      expect(badges[0].props('status')).toBe(mockedLockedDeclaredActivities.activityStatus)
    })

    BddTest().and('the user cancels the action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('close')
      })

      BddTest().then('it should emit the cancel event', () => {
        expect(wrapper.emitted('cancel')).toBeTruthy()
      })
    })

    BddTest().and('the user confirms the action', () => {
      beforeEach(() => {
        const confirmationModal = wrapper.findComponent(ConfirmationModalStub)
        confirmationModal.vm.$emit('confirm')
      })

      BddTest().then('it should emit the confirm event', () => {
        expect(wrapper.emitted('confirm')).toBeTruthy()
      })
    })
  })
})
