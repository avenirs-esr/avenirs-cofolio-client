import type { VueWrapper } from '@vue/test-utils'
import { activityNavigationQueryError } from '@/__mocks__/msw/handlers/student/activities.handlers'
import { server } from '@/__mocks__/msw/server'
import { UnsubscribeActivitiesConfirmModalStub } from '@/features/student/buildProject/components/modals/UnsubscribeActivitiesConfirmModal/UnsubscribeActivitiesConfirmModal.stub'
import { ActivitiesSelectorStub } from '@/features/student/buildProject/views/ProjectActivitiesView/components/overlays/ActivitiesSelector/ActivitiesSelector.stub'
import UnsubscribeActivitiesModal, { type UnsubscribeActivitiesModalProps } from '@/features/student/buildProject/views/ProjectActivitiesView/components/overlays/UnsubscribeActivitiesModal/UnsubscribeActivitiesModal.vue'
import { AvModalStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mockAddErrorMessage, mockAddSuccessMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('an unsubscribe activities modal', () => {
  let wrapper: VueWrapper<InstanceType<typeof UnsubscribeActivitiesModal>>

  const stubs = {
    AvModal: AvModalStub,
    ActivitiesSelector: ActivitiesSelectorStub,
    UnsubscribeActivitiesConfirmModal: UnsubscribeActivitiesConfirmModalStub,
  }

  BddTest().and('no activities to delete are provided', () => {
    const props: UnsubscribeActivitiesModalProps = {
      show: true,
    }

    BddTest().when('the modal is rendered', () => {
      beforeEach(async () => {
        server.use(activityNavigationQueryError)

        wrapper = mountComponent(UnsubscribeActivitiesModal, { props, global: { stubs } })
        await vi.waitFor(() => {
          expect(wrapper.exists()).toBe(true)
        })
      })

      BddTest().then('it should display the correct title for zero elements', async () => {
        await vi.waitFor(() => {
          const header = wrapper.find('[data-testid="header"]')
          expect(header.text()).toContain('Aucune activité à laquelle se désinscrire')
        })
      })
    })
  })

  BddTest().and('many activities to delete are provided', () => {
    const props: UnsubscribeActivitiesModalProps = {
      show: true,
    }

    BddTest().when('the modal is rendered with the provided elements', () => {
      beforeEach(async () => {
        wrapper = mountComponent(UnsubscribeActivitiesModal, { props, global: { stubs } })
        await vi.waitFor(() => {
          const selector = wrapper.findComponent(ActivitiesSelectorStub)
          expect(selector.exists()).toBe(true)
        })
      })

      BddTest().then('it should display the correct title with element count', () => {
        const header = wrapper.find('[data-testid="header"]')
        expect(header.text()).toContain('De quelles activités souhaitez-vous vous désinscrire ?')
      })

      BddTest().and('many activities are selected', () => {
        beforeEach(async () => {
          const selector = wrapper.findComponent(ActivitiesSelectorStub)
          await selector.vm.$emit('update:modelValue', ['activity-1', 'activity-2', 'activity-3'])
          await wrapper.vm.$nextTick()
        })

        BddTest().then('the selectedActivityIds should be updated accordingly', () => {
          const selector = wrapper.findComponent(ActivitiesSelectorStub)
          expect(selector.props('modelValue')).toEqual(['activity-1', 'activity-2', 'activity-3'])
        })

        BddTest().and('the modal is closed by close event and reopened', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            await modal.vm.$emit('close')

            await wrapper.setProps({ show: true })
          })

          BddTest().then('the selectedActivityIds should be reset', () => {
            const selector = wrapper.findComponent(ActivitiesSelectorStub)
            expect(selector.props('modelValue')).toEqual([])
          })
        })

        BddTest().and('the modal emits confirm event', () => {
          beforeEach(async () => {
            const modal = wrapper.findComponent(AvModalStub)
            modal.vm.$emit('confirm')
          })

          BddTest().then('the confirm unsubscribe modal should be shown', () => {
            const confirmModal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
            expect(confirmModal.props('show')).toBe(true)
          })

          BddTest().and('the confirm unsubscribe modal emits unsubscribed event', () => {
            beforeEach(async () => {
              const confirmModal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
              confirmModal.vm.$emit('unsubscribed')
            })

            BddTest().then('the unsubscribe activities modal should emit unsubscribed event', async () => {
              await vi.waitFor(() => expect(wrapper.emitted()).toHaveProperty('unsubscribed'))
            })

            BddTest().then('the confirm unsubscribe modal should be hidden', async () => {
              await vi.waitFor(() => {
                const confirmModal = wrapper.findComponent(UnsubscribeActivitiesConfirmModalStub)
                expect(confirmModal.props('show')).toBe(false)
              })
            })
          })
        })
      })
    })
  })
})
