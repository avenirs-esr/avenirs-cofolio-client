import type { FileDTO } from '@/api/avenir-esr'
import { EFileType } from '@/api/avenir-esr'
import { ActivityResourceCardStub } from '@/common/components/cards/ActivityResourceCard/ActivityResourceCard.stub'
import { AddCardStub } from '@/common/components/cards/AddCard/AddCard.stub'
import { SelectorOverlayStub } from '@/common/components/overlay/SelectorOverlay/SelectorOverlay.stub'
import ActivityResourcesListEditable from '@/features/activities/components/lists/ActivityResourcesListEditable/ActivityResourcesListEditable.vue'
import { DeleteActivityResourcesConfirmationModalStub } from '@/features/activities/components/modals/DeleteActivityResourcesConfirmationModal/DeleteActivityResourcesConfirmationModal.stub'
import { ActivityResourceType } from '@/features/activities/types/resource.types'
import { AddActivityResourceModalStub } from '@/features/activities/views/EditNationalActivityView/components/AddActivityResourceModal/AddActivityResourceModal.stub'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an editable activity resources list', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityResourcesListEditable>>

  const stubs = {
    ActivityResourceCard: ActivityResourceCardStub,
    AddCard: AddCardStub,
    SelectorOverlay: SelectorOverlayStub,
    AddActivityResourceModal: AddActivityResourceModalStub,
    DeleteActivityResourcesConfirmationModal: DeleteActivityResourcesConfirmationModalStub,
    AvButton: AvButtonStub,
  }

  const fileResource: FileDTO = {
    id: 'file-1',
    fileName: 'document.pdf',
    fileType: EFileType.PDF,
    fileSize: 1024,
    url: 'https://example.com/document.pdf',
    uploadedAt: '2026-07-07T00:00:00Z',
  }

  const files = [fileResource]
  const links = ['https://example.com', 'https://avenirs.fr']

  const getAddModal = () => wrapper.findComponent(AddActivityResourceModalStub)
  const getDeleteModal = () => wrapper.findComponent(DeleteActivityResourcesConfirmationModalStub)
  const getDeleteButton = () => wrapper.findComponent(AvButtonStub)

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with files and links', () => {
    beforeEach(() => {
      wrapper = mount(ActivityResourcesListEditable, {
        props: { activityId: 'activity-id', files, links },
        global: { stubs },
      })
    })

    BddTest().then('it should render the list container', () => {
      expect(wrapper.find('[data-testid="activity-resources-list-editable"]').exists()).toBe(true)
    })

    BddTest().then('it should render one resource card per file and link', () => {
      expect(wrapper.findAllComponents(ActivityResourceCardStub)).toHaveLength(files.length + links.length)
    })

    BddTest().then('it should pass the file as resource to the first card', () => {
      expect(wrapper.findAllComponents(ActivityResourceCardStub)[0].props('resource')).toEqual(fileResource)
    })

    BddTest().then('it should pass the links as resources to the following cards', () => {
      const cards = wrapper.findAllComponents(ActivityResourceCardStub)

      expect(cards[1].props('resource')).toBe(links[0])
      expect(cards[2].props('resource')).toBe(links[1])
    })

    BddTest().then('it should render the add card', () => {
      expect(wrapper.findComponent(AddCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the add modal closed', () => {
      expect(getAddModal().props('opened')).toBe(false)
    })

    BddTest().then('it should render the delete modal closed', () => {
      expect(getDeleteModal().props('show')).toBe(false)
    })

    BddTest().then('it should disable the delete button when no resource is selected', () => {
      expect(getDeleteButton().props('disabled')).toBe(true)
    })

    BddTest().then('it should enable the delete button when a resource is selected', async () => {
      await wrapper.find('[data-testid="selector-overlay"]').trigger('click')

      expect(getDeleteButton().props('disabled')).toBe(false)
    })
  })

  BddTest().when('the add resource modal emits added with a file', () => {
    const file = new File(['content'], 'new-document.pdf', { type: 'application/pdf' })

    beforeEach(() => {
      wrapper = mount(ActivityResourcesListEditable, {
        props: { activityId: 'activity-id', files, links },
        global: { stubs },
      })

      getAddModal().vm.$emit('added', {
        resourceType: ActivityResourceType.FILE,
        file,
      })
    })

    BddTest().then('it should emit add with the file payload', () => {
      expect(wrapper.emitted('add')).toEqual([
        [{
          resourceType: ActivityResourceType.FILE,
          file,
        }],
      ])
    })

    BddTest().then('it should close the add resource modal', () => {
      expect(getAddModal().props('opened')).toBe(false)
    })
  })

  BddTest().when('the add resource modal emits added with a link', () => {
    beforeEach(() => {
      wrapper = mount(ActivityResourcesListEditable, {
        props: { activityId: 'activity-id', files, links },
        global: { stubs },
      })

      getAddModal().vm.$emit('added', {
        resourceType: ActivityResourceType.LINK,
        link: 'https://example.org',
      })
    })

    BddTest().then('it should emit add with the link payload', () => {
      expect(wrapper.emitted('add')).toEqual([
        [{
          resourceType: ActivityResourceType.LINK,
          link: 'https://example.org',
        }],
      ])
    })
  })

  BddTest().when('a resource is selected and delete is clicked', () => {
    beforeEach(async () => {
      wrapper = mount(ActivityResourcesListEditable, {
        props: { activityId: 'activity-id', files, links },
        global: { stubs },
      })

      await wrapper.find('[data-testid="selector-overlay"]').trigger('click')
      await getDeleteButton().trigger('click')
    })

    BddTest().then('it should open the delete confirmation modal', () => {
      expect(getDeleteModal().props('show')).toBe(true)
    })

    BddTest().then('it should pass selected resources to the delete modal', () => {
      expect(getDeleteModal().props('files')).toEqual([fileResource])
      expect(getDeleteModal().props('links')).toEqual([])
    })
  })

  BddTest().when('the delete confirmation modal emits confirm', () => {
    beforeEach(() => {
      wrapper = mount(ActivityResourcesListEditable, {
        props: { activityId: 'activity-id', files, links },
        global: { stubs },
      })

      getDeleteModal().vm.$emit('confirm')
    })

    BddTest().then('it should emit delete with selected resources', () => {
      expect(wrapper.emitted('delete')).toEqual([
        [[], []],
      ])
    })

    BddTest().then('it should close the delete modal', () => {
      expect(getDeleteModal().props('show')).toBe(false)
    })
  })

  BddTest().when('the component is mounted without resources', () => {
    beforeEach(() => {
      wrapper = mount(ActivityResourcesListEditable, {
        props: { activityId: 'activity-id', files: [], links: [] },
        global: { stubs },
      })
    })

    BddTest().then('it should not render any resource card', () => {
      expect(wrapper.findAllComponents(ActivityResourceCardStub)).toHaveLength(0)
    })

    BddTest().then('it should render the add card', () => {
      expect(wrapper.findComponent(AddCardStub).exists()).toBe(true)
    })

    BddTest().then('it should disable the delete button', () => {
      expect(getDeleteButton().props('disabled')).toBe(true)
    })
  })
})
