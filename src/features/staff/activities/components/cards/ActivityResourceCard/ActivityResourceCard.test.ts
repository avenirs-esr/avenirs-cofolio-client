import type { VueWrapper } from '@vue/test-utils'
import { EFileType, type FileDTO } from '@/api/avenir-esr'
import { downloadBlob } from '@/common/utils/download/download'
import ActivityResourceCard from '@/features/staff/activities/components/cards/ActivityResourceCard/ActivityResourceCard.vue'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvCardStub, AvIconStub, AvTagStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()

  return {
    ...actual,
    useToasterStore: () => ({
      addErrorMessage: mockAddErrorMessage,
    }),
  }
})

vi.mock('@/common/utils/download/download', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/common/utils/download/download')>()

  return {
    ...actual,
    downloadBlob: vi.fn(),
  }
})

BddTest().given('an activity resource card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityResourceCard>>

  const stubs = {
    AvCard: AvCardStub,
    AvIcon: AvIconStub,
    AvTag: AvTagStub,
  }

  const resource: FileDTO = {
    id: 'file-id',
    fileName: 'resource.pdf',
    fileType: EFileType.PDF,
    fileSize: 1024,
    version: 1,
    url: 'https://avenir-esr.fr/resource.pdf',
    uploadedAt: '2026-07-05T00:00:00Z',
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a link resource', () => {
    const resource = 'https://avenir-esr.fr'

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="activity-resource-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the link icon', () => {
      const activityIcon = wrapper.findComponent(AvIconStub)

      expect(activityIcon.exists()).toBe(true)
      expect(activityIcon.props('name')).toBe(MDI_ICONS.LINK)
    })

    BddTest().then('it should render the url as title', () => {
      expect(wrapper.find('[data-testid="activity-resource-card-title"]').text()).toBe(resource)
    })

    BddTest().then('it should render the link type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)

      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('lien')
    })

    BddTest().then('it should render an anchor', () => {
      const anchor = wrapper.find('a')

      expect(anchor.exists()).toBe(true)
      expect(anchor.attributes('href')).toBe(resource)
      expect(anchor.attributes('target')).toBe('_blank')
      expect(anchor.attributes('rel')).toBe('noopener noreferrer')
    })
  })

  BddTest().when('the component is mounted with a pending file resource', () => {
    const resource = new File(['content'], 'resource.pdf', { type: 'application/pdf' })

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="activity-resource-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the file icon', () => {
      const activityIcon = wrapper.findComponent(AvIconStub)

      expect(activityIcon.exists()).toBe(true)
      expect(activityIcon.props('name')).toBe(MDI_ICONS.FILE)
    })

    BddTest().then('it should render the file name as title', () => {
      expect(wrapper.find('[data-testid="activity-resource-card-title"]').text()).toBe(resource.name)
    })

    BddTest().then('it should render the file type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)

      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('fichier')
    })

    BddTest().then('it should not render an anchor', () => {
      expect(wrapper.find('a').exists()).toBe(false)
    })

    BddTest().then('it should download the pending file directly when clicked', async () => {
      await wrapper.find('[data-testid="activity-resource-card"]').trigger('click')
      await flushPromises()

      expect(downloadBlob).toHaveBeenCalledWith(resource, resource.name)
    })
  })

  BddTest().when('the component is mounted with a saved file resource', () => {
    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.find('[data-testid="activity-resource-card"]').exists()).toBe(true)
    })

    BddTest().then('it should render the file icon', () => {
      const activityIcon = wrapper.findComponent(AvIconStub)

      expect(activityIcon.exists()).toBe(true)
      expect(activityIcon.props('name')).toBe(MDI_ICONS.FILE)
    })

    BddTest().then('it should render the file name as title', () => {
      expect(wrapper.find('[data-testid="activity-resource-card-title"]').text()).toBe(resource.fileName)
    })

    BddTest().then('it should render the file type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)

      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('fichier')
    })

    BddTest().then('it should not render an anchor', () => {
      expect(wrapper.find('a').exists()).toBe(false)
    })

    BddTest().then('it should download the file when clicked', async () => {
      await wrapper.find('[data-testid="activity-resource-card"]').trigger('click')

      await vi.waitFor(() => expect(downloadBlob).toHaveBeenCalledTimes(1))

      const [blob, fileName] = vi.mocked(downloadBlob).mock.calls[0]
      expect(blob).toMatchObject({ size: expect.any(Number), type: 'application/octet-stream' })
      expect(fileName).toBe(resource.fileName)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the saved file download fails', () => {
    beforeEach(() => {
      const invalidResourceFile: FileDTO = {
        ...resource,
        id: 'INVALID_FILE_ID'
      }
      wrapper = mountComponent(ActivityResourceCard, {
        props: { resource: invalidResourceFile },
        global: { stubs },
      })
    })

    BddTest().then('it should add an error toaster message', async () => {
      await wrapper.find('[data-testid="activity-resource-card"]').trigger('click')

      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalledTimes(1))
      expect(downloadBlob).not.toHaveBeenCalled()
    })
  })
})
