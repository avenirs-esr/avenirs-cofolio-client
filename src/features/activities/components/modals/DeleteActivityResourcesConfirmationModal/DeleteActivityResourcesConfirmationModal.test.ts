import type { VueWrapper } from '@vue/test-utils'
import { ConfirmationModalStub } from '@/common/components/ConfirmationModal/ConfirmationModal.stub'
import { ActivityResourcesListStub } from '@/features/activities/components/lists/ActivityResourcesList/ActivityResourcesList.stub'
import DeleteActivityResourcesConfirmationModal from '@/features/activities/components/modals/DeleteActivityResourcesConfirmationModal/DeleteActivityResourcesConfirmationModal.vue'
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

  BddTest().when('mounted with show=true, a single file and no link', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { show: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: false },
        global: { stubs },
      })
    })

    BddTest().then('it should pass show=true to ConfirmationModal', () => {
      expect(getModal().props('show')).toBe(true)
    })

    BddTest().then('it should pass isLoading=false to ConfirmationModal', () => {
      expect(getModal().vm.$attrs['is-loading']).toBe(false)
    })

    BddTest().then('it should display the singular title', () => {
      expect(getTitle().text()).toBe('Êtes-vous certain(e) de vouloir supprimer la ressource selectionnée ?')
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
        props: { show: true, activityId: 'activity-id', files: [mockFile], links: [mockLink], isUpdating: false },
        global: { stubs },
      })
    })

    BddTest().then('it should display the plural title', () => {
      expect(getTitle().text()).toBe('Êtes-vous certain(e) de vouloir supprimer les ressources selectionnées ?')
    })

    BddTest().then('it should pass files and links to ActivityResourcesList', () => {
      expect(getList().props('files')).toEqual([mockFile])
      expect(getList().props('links')).toEqual([mockLink])
    })
  })

  BddTest().when('mounted with show=false', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { show: false, activityId: 'activity-id', files: [], links: [], isUpdating: false },
        global: { stubs },
      })
    })

    BddTest().then('it should pass show=false to ConfirmationModal', () => {
      expect(getModal().props('show')).toBe(false)
    })
  })

  BddTest().when('mounted with isUpdating=true', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { show: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: true },
        global: { stubs },
      })
    })

    BddTest().then('it should pass isLoading=true to ConfirmationModal', () => {
      expect(getModal().vm.$attrs['is-loading']).toBe(true)
    })
  })

  BddTest().when('the modal emits confirm', () => {
    beforeEach(() => {
      wrapper = mountComponent(DeleteActivityResourcesConfirmationModal, {
        props: { show: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: false },
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
        props: { show: true, activityId: 'activity-id', files: [mockFile], links: [], isUpdating: false },
        global: { stubs },
      })
      getModal().vm.$emit('close')
    })

    BddTest().then('it should emit cancel', () => {
      expect(wrapper.emitted('cancel')).toBeTruthy()
    })
  })
})
