import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { ActivityResourcesListStub } from '@/common/components/lists/ActivityResourcesList/ActivityResourcesList.stub'
import DeleteActivityResourcesConfirmationModal from '@/features/staff/activities/components/modals/DeleteActivityResourcesConfirmationModal/DeleteActivityResourcesConfirmationModal.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const mockFile = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
const mockLink = 'https://example.com/resource'

BddTest().given('a DeleteActivityResourcesConfirmationModal component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeleteActivityResourcesConfirmationModal>>

  const stubs = {
    ConfirmationModal: ConfirmationModalStub,
    ActivityResourcesList: ActivityResourcesListStub,
  }

  const getModal = () => wrapper.findComponent(ConfirmationModalStub)
  const getTitle = () => wrapper.find('[data-testid="delete-activity-resources-confirmation-modal-title"]')
  const getList = () => wrapper.findComponent(ActivityResourcesListStub)

  BddTest().when('mounted with opened=true, a single file and no link', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { opened: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: false },
        global: { stubs },
      })
    })

    BddTest().then('it should pass opened=true to ConfirmationModal', () => {
      expect(getModal().props('opened')).toBe(true)
    })

    BddTest().then('it should pass isLoading=false to ConfirmationModal', () => {
      expect(getModal().props('isLoading')).toBe(false)
    })

    BddTest().then('it should display the singular title', () => {
      expect(getTitle().text()).toBe('Êtes-vous certain(e) de vouloir supprimer la ressource selectionnée\u00A0?')
    })

    BddTest().then('it should pass files and links to ActivityResourcesList', () => {
      expect(getList().props('files')).toEqual([mockFile])
      expect(getList().props('links')).toEqual([])
    })

    BddTest().then('it should pass readonly=true to ActivityResourcesList', () => {
      expect(getList().props('readonly')).toBe(true)
    })
  })

  BddTest().when('mounted with several resources (a file and a link)', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { opened: true, activityId: 'activity-id', files: [mockFile], links: [mockLink], isUpdating: false },
        global: { stubs },
      })
    })

    BddTest().then('it should display the plural title', () => {
      expect(getTitle().text()).toBe('Êtes-vous certain(e) de vouloir supprimer les ressources selectionnées\u00A0?')
    })

    BddTest().then('it should pass files and links to ActivityResourcesList', () => {
      expect(getList().props('files')).toEqual([mockFile])
      expect(getList().props('links')).toEqual([mockLink])
    })
  })

  BddTest().when('mounted with opened=false', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { opened: false, activityId: 'activity-id', files: [], links: [], isUpdating: false },
        global: { stubs },
      })
    })

    BddTest().then('it should pass opened=false to ConfirmationModal', () => {
      expect(getModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('mounted with isUpdating=true', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { opened: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: true },
        global: { stubs },
      })
    })

    BddTest().then('it should pass isLoading=true to ConfirmationModal', () => {
      expect(getModal().props('isLoading')).toBe(true)
    })
  })

  BddTest().when('the modal emits confirm', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { opened: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: false },
        global: { stubs },
      })
      getModal().vm.$emit('confirm')
    })

    BddTest().then('it should emit confirm', () => {
      expect(wrapper.emitted('confirm')).toBeTruthy()
    })
  })

  BddTest().when('the modal emits close', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { opened: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: false },
        global: { stubs },
      })
      getModal().vm.$emit('close')
    })

    BddTest().then('it should emit cancel', () => {
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })
})
