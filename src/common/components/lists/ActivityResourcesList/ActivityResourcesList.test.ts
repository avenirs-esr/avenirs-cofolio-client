import type { FileDTO } from '@/api/avenir-esr'
import { EFileType } from '@/api/avenir-esr'
import { ActivityResourceCardStub } from '@/common/components/cards/ActivityResourceCard/ActivityResourceCard.stub'
import { AddCardStub } from '@/common/components/cards/AddCard/AddCard.stub'
import ActivityResourcesList from '@/common/components/lists/ActivityResourcesList/ActivityResourcesList.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

BddTest().given('an activity resources list', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityResourcesList>>

  const stubs = {
    ActivityResourceCard: ActivityResourceCardStub,
    AddCard: AddCardStub
  }

  const fileResource: FileDTO = {
    id: 'file-1',
    fileName: 'document.pdf',
    fileType: EFileType.PDF,
    fileSize: 1024,
    url: 'https://example.com/document.pdf',
    uploadedAt: '2026-07-07T00:00:00Z'
  }
  const files = [fileResource]
  const links = ['https://example.com', 'https://avenirs.fr']

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with files and links', () => {
    beforeEach(() => {
      wrapper = mount(ActivityResourcesList, {
        props: { activityId: 'activity-id', files, links },
        global: { stubs }
      })
    })

    BddTest().then('it should render the list container', () => {
      expect(wrapper.find('[data-testid="activity-resources-list"]').exists()).toBe(true)
    })

    BddTest().then('it should render one resource card per file and link', () => {
      const cards = wrapper.findAllComponents(ActivityResourceCardStub)
      expect(cards).toHaveLength(files.length + links.length)
    })

    BddTest().then('it should pass the file as resource to the first card', () => {
      const cards = wrapper.findAllComponents(ActivityResourceCardStub)
      expect(cards[0].props('resource')).toStrictEqual(fileResource)
    })

    BddTest().then('it should pass the link as resource to the following cards', () => {
      const cards = wrapper.findAllComponents(ActivityResourceCardStub)
      expect(cards[1].props('resource')).toBe(links[0])
      expect(cards[2].props('resource')).toBe(links[1])
    })
  })

  BddTest().when('the component is mounted as read only', () => {
    beforeEach(() => {
      wrapper = mount(ActivityResourcesList, {
        props: { activityId: 'activity-id', files, links, readonly: true },
        global: { stubs }
      })
    })

    BddTest().then('it should render one disabled resource card per file and link', () => {
      const cards = wrapper.findAllComponents(ActivityResourceCardStub)
      expect(cards).toHaveLength(files.length + links.length)
      cards.forEach((card) => {
        expect(card.props('disabled')).toBe(true)
      })
    })
  })

  BddTest().when('the component is mounted without resources', () => {
    beforeEach(() => {
      wrapper = mount(ActivityResourcesList, {
        props: { activityId: 'activity-id', files: [], links: [] },
        global: { stubs }
      })
    })

    BddTest().then('it should not render any resource card', () => {
      expect(wrapper.findAllComponents(ActivityResourceCardStub)).toHaveLength(0)
    })
  })
})
