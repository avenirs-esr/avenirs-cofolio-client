import type { VueWrapper } from '@vue/test-utils'
import { EFileType, type FileDTO } from '@/api/avenir-esr'
import ActivityResourceCard from '@/common/components/cards/ActivityResourceCard/ActivityResourceCard.vue'
import { downloadBlob } from '@/common/utils/download/download'
import { MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvCardStub, AvIconStub, AvTagStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
    AvTooltip: AvTooltipStub,
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted with a link resource', () => {
    const resource = 'https://avenir-esr.fr'

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { activityId: 'activity-id', resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the tooltip', () => {
      const tooltip = wrapper.findComponent(AvTooltipStub)
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.props('content')).toBe(resource)
      expect(tooltip.props('disabled')).toBe(false)
    })

    BddTest().then('it should render a link', () => {
      const link = wrapper.find('[data-testid="activity-resource-card-link"]')
      expect(link.exists()).toBe(true)
      expect(link.element.localName).toBe('a')
      expect(link.attributes('href')).toBe(resource)
      expect(link.attributes('target')).toBe('_blank')
      expect(link.attributes('rel')).toBe('noopener noreferrer')
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.findComponent(AvCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the link icon', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(MDI_ICONS.LINK)
    })

    BddTest().then('it should render the url as title', () => {
      const url = wrapper.find('[data-testid="activity-resource-card-title"]')
      expect(url.exists()).toBe(true)
      expect(url.text()).toBe(resource)
    })

    BddTest().then('it should render the link type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)
      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('lien')
    })
  })

  BddTest().when('the component is mounted with a file resource', () => {
    const resource = new File(['content'], 'resource.pdf', { type: 'application/pdf' })

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { activityId: 'activity-id', resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the tooltip', () => {
      const tooltip = wrapper.findComponent(AvTooltipStub)
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.props('content')).toBe(resource.name)
      expect(tooltip.props('disabled')).toBe(false)
    })

    BddTest().then('it should render a button', () => {
      const button = wrapper.find('[data-testid="activity-resource-card-file"]')
      expect(button.exists()).toBe(true)
      expect(button.element.localName).toBe('button')
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.findComponent(AvCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the file icon', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(MDI_ICONS.FILE)
    })

    BddTest().then('it should render the file name as title', () => {
      const name = wrapper.find('[data-testid="activity-resource-card-title"]')
      expect(name.exists()).toBe(true)
      expect(name.text()).toBe(resource.name)
    })

    BddTest().then('it should render the file type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)
      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('fichier')
    })

    BddTest().then('it should download the pending file directly when clicked', async () => {
      await wrapper.find('[data-testid="activity-resource-card-file"]').trigger('click')
      await flushPromises()
      expect(downloadBlob).toHaveBeenCalledWith(resource, resource.name)
    })
  })

  BddTest().when('the component is mounted with a file resource', () => {
    const resource: FileDTO = {
      id: 'file-id',
      fileName: 'resource.pdf',
      fileType: EFileType.PDF,
      fileSize: 1024,
      url: 'https://avenir-esr.fr/resource.pdf',
      uploadedAt: '2026-07-05T00:00:00Z',
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { activityId: 'activity-id', resource },
        global: { stubs },
      })
    })

    BddTest().then('it should render the tooltip', () => {
      const tooltip = wrapper.findComponent(AvTooltipStub)
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.props('content')).toBe(resource.fileName)
      expect(tooltip.props('disabled')).toBe(false)
    })

    BddTest().then('it should render a button', () => {
      const button = wrapper.find('[data-testid="activity-resource-card-file"]')
      expect(button.exists()).toBe(true)
      expect(button.element.localName).toBe('button')
    })

    BddTest().then('it should render the card', () => {
      expect(wrapper.findComponent(AvCardStub).exists()).toBe(true)
    })

    BddTest().then('it should render the file icon', () => {
      const icon = wrapper.findComponent(AvIconStub)
      expect(icon.exists()).toBe(true)
      expect(icon.props('name')).toBe(MDI_ICONS.FILE)
    })

    BddTest().then('it should render the file name as title', () => {
      const name = wrapper.find('[data-testid="activity-resource-card-title"]')
      expect(name.exists()).toBe(true)
      expect(name.text()).toBe(resource.fileName)
    })

    BddTest().then('it should render the file type tag', () => {
      const tag = wrapper.findComponent(AvTagStub)
      expect(tag.exists()).toBe(true)
      expect(tag.props('label')).toBe('fichier')
    })

    BddTest().then('it should download the file when clicked', async () => {
      await wrapper.find('[data-testid="activity-resource-card-file"]').trigger('click')
      await flushPromises()
      await vi.waitFor(() => expect(downloadBlob).toHaveBeenCalledTimes(1))

      const [blob, fileName] = vi.mocked(downloadBlob).mock.calls[0]
      expect(blob).toMatchObject({ size: expect.any(Number), type: 'application/octet-stream' })
      expect(fileName).toBe(resource.fileName)
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the download fails', () => {
    const resource: FileDTO = {
      id: 'INVALID_FILE_ID',
      fileName: 'resource.pdf',
      fileType: EFileType.PDF,
      fileSize: 1024,
      url: 'https://avenir-esr.fr/resource.pdf',
      uploadedAt: '2026-07-05T00:00:00Z',
    }

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { activityId: 'activity-id', resource },
        global: { stubs },
      })
    })

    BddTest().then('it should add an error toaster message', async () => {
      await wrapper.find('[data-testid="activity-resource-card-file"]').trigger('click')
      await flushPromises()

      await vi.waitFor(() => expect(mockAddErrorMessage).toHaveBeenCalledTimes(1))
      expect(downloadBlob).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the component is mounted with disabled true', () => {
    const resource = 'https://avenir-esr.fr'

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { activityId: 'activity-id', resource, disabled: true },
        global: { stubs },
      })
    })

    BddTest().then('it should not render the tooltip', () => {
      const tooltip = wrapper.findComponent(AvTooltipStub)
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.props('disabled')).toBe(true)
    })

    BddTest().then('it should render a div', () => {
      const link = wrapper.find('[data-testid="activity-resource-card-link"]')
      expect(link.exists()).toBe(true)
      expect(link.element.localName).toBe('div')
    })
  })

  BddTest().when('the component is mounted with disabled true and tooltipVisible true', () => {
    const resource = 'https://avenir-esr.fr'

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { activityId: 'activity-id', resource, disabled: true, tooltipVisible: true },
        global: { stubs },
      })
    })

    BddTest().then('it should render the tooltip', () => {
      const tooltip = wrapper.findComponent(AvTooltipStub)
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.props('content')).toBe(resource)
      expect(tooltip.props('disabled')).toBe(false)
    })
  })

  BddTest().when('the component is mounted with disabled false and tooltipVisible false', () => {
    const resource = 'https://avenir-esr.fr'

    beforeEach(() => {
      wrapper = mountComponent(ActivityResourceCard, {
        props: { activityId: 'activity-id', resource, disabled: true, tooltipVisible: false },
        global: { stubs },
      })
    })

    BddTest().then('it should not render the tooltip', () => {
      const tooltip = wrapper.findComponent(AvTooltipStub)
      expect(tooltip.exists()).toBe(true)
      expect(tooltip.props('disabled')).toBe(true)
    })
  })
})
