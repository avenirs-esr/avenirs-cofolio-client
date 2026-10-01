import type { VueWrapper } from '@vue/test-utils'
import { server } from '@/__mocks__/msw/server'
import { EFileType, type FileDTO, getDownloadActivityFileUrl, getDownloadDraftFileUrl } from '@/api/avenir-esr'
import ActivityResourceCard, { type ActivityResourceCardComponentProps } from '@/common/components/cards/ActivityResourceCard/ActivityResourceCard.vue'
import { downloadBlob } from '@/common/utils/download/download'
import { type AvTooltipProps, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'
import { AvCardStub, AvIconStub, AvTagStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mockAddErrorMessage } from 'tests/mocks'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'

const DOWNLOAD_FILE_TOOLTIP = 'Télécharger le document'
const TAG_LINK_LABEL = 'lien'
const TAG_FILE_LABEL = 'fichier'

const linkResource = 'https://avenir-esr.fr'
const fileResource = new File(['content'], 'resource.pdf', { type: 'application/pdf' })
const fileDtoResource: FileDTO = {
  id: 'file-id',
  fileName: 'resource.pdf',
  fileType: EFileType.PDF,
  fileSize: 1024,
  url: 'https://avenir-esr.fr/resource.pdf',
  uploadedAt: '2026-07-05T00:00:00Z',
}
const invalidFileDtoResource: FileDTO = {
  ...fileDtoResource,
  id: 'INVALID_FILE_ID',
}

const defaultProps: ActivityResourceCardComponentProps = {
  activityId: 'activity-id',
  resource: linkResource,
}

const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useTextTruncation: () => ({ isTruncated: mockIsTruncated }),
  }
})

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

  const mountWith = (props: Partial<ActivityResourceCardComponentProps> = {}, isTruncated: boolean = false) => {
    vi.clearAllMocks()
    mockIsTruncated.value = isTruncated

    wrapper = mountComponent(ActivityResourceCard, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: { stubs },
    })
  }

  const getCard = () => wrapper.findComponent(AvCardStub)
  const getDownloadTooltip = () => wrapper.findComponent('[data-testid="activity-resource-card-tooltip"]') as VueWrapper<InstanceType<typeof AvTooltipStub>>
  const getIcon = () => wrapper.findComponent(AvIconStub)
  const getTag = () => wrapper.findComponent(AvTagStub)
  const getTitleTooltip = () => wrapper.findComponent('[data-testid="activity-resource-card-title-tooltip"]') as VueWrapper<InstanceType<typeof AvTooltipStub>>

  const getFile = () => wrapper.find('[data-testid="activity-resource-card-file"]')
  const getLink = () => wrapper.find('[data-testid="activity-resource-card-link"]')
  const getTitle = () => wrapper.find('[data-testid="activity-resource-card-title"]')

  const expectTooltip = (tooltip: VueWrapper<InstanceType<typeof AvTooltipStub>>, props: Partial<AvTooltipProps> = {}) => {
    expect(tooltip.exists()).toBe(true)
    Object.entries(props)
      .filter(([, value]) => value !== undefined)
      .forEach(([prop, value]) => {
        expect(tooltip.props(prop as keyof AvTooltipProps)).toBe(value)
      })
  }

  const expectFileDownloadTooltip = (disabled: boolean) => {
    expectTooltip(getDownloadTooltip(), {
      content: DOWNLOAD_FILE_TOOLTIP,
      disabled,
    })
  }

  const expectTitleTooltip = (disabled: boolean, content: string) => {
    expectTooltip(getTitleTooltip(), {
      content,
      disabled,
    })
  }

  const expectCard = () => {
    expect(getCard().exists()).toBe(true)
  }

  const expectIcon = (name: string) => {
    const icon = getIcon()
    expect(icon.exists()).toBe(true)
    expect(icon.props('name')).toBe(name)
  }

  const expectTag = (label: string) => {
    const tag = getTag()
    expect(tag.exists()).toBe(true)
    expect(tag.props('label')).toBe(label)
  }

  const expectTitle = (content: string) => {
    const title = getTitle()
    expect(title.exists()).toBe(true)
    expect(title.text()).toBe(content)
  }

  const expectLink = (href: string) => {
    const link = getLink()
    expect(link.exists()).toBe(true)
    expect(link.element.localName).toBe('a')
    expect(link.attributes('href')).toBe(href)
    expect(link.attributes('target')).toBe('_blank')
    expect(link.attributes('rel')).toBe('noopener noreferrer')
  }

  const expectFile = () => {
    const file = getFile()
    expect(file.exists()).toBe(true)
    expect(file.element.localName).toBe('button')
  }

  const expectFileDownload = async (activityId: string, file: FileDTO, isDraft: boolean) => {
    const requestedUrls: string[] = []

    const onRequest = ({ request }: { request: Request }) => {
      requestedUrls.push(new URL(request.url).pathname)
    }

    server.events.on('request:start', onRequest)

    try {
      await getFile().trigger('click')
      await flushPromises()

      await vi.waitFor(() => {
        expect(downloadBlob).toHaveBeenCalledTimes(1)
      })
    }
    finally {
      server.events.removeListener('request:start', onRequest)
    }

    expect(
      requestedUrls.some(url =>
        url.endsWith(getDownloadActivityFileUrl(activityId, file.id)),
      ),
    ).toBe(!isDraft)

    expect(
      requestedUrls.some(url =>
        url.endsWith(getDownloadDraftFileUrl(activityId, file.id)),
      ),
    ).toBe(isDraft)

    expect(mockAddErrorMessage).not.toHaveBeenCalled()

    const [blob, downloadedFileName] = vi.mocked(downloadBlob).mock.calls[0]

    expect(blob).toMatchObject({
      size: expect.any(Number),
      type: 'application/octet-stream',
    })
    expect(downloadedFileName).toBe(file.fileName)
  }

  BddTest().when('the component is mounted with a link resource', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should disable the download tooltip', () => {
      expectFileDownloadTooltip(true)
    })

    BddTest().then('it should disable the title tooltip when the title is not truncated', () => {
      expectTitleTooltip(true, linkResource)
    })

    BddTest().then('it should render a link', () => {
      expectLink(linkResource)
    })

    BddTest().then('it should render the card', () => {
      expectCard()
    })

    BddTest().then('it should render the link icon', () => {
      expectIcon(MDI_ICONS.LINK)
    })

    BddTest().then('it should render the url as title', () => {
      expectTitle(linkResource)
    })

    BddTest().then('it should render the link type tag', () => {
      expectTag(TAG_LINK_LABEL)
    })
  })

  BddTest().when('the component is mounted with a pending file resource', () => {
    beforeEach(() => {
      mountWith({ resource: fileResource })
    })

    BddTest().then('it should enable the download tooltip', () => {
      expectFileDownloadTooltip(false)
    })

    BddTest().then('it should disable the title tooltip when the title is not truncated', () => {
      expectTitleTooltip(true, fileResource.name)
    })

    BddTest().then('it should render a button', () => {
      expectFile()
    })

    BddTest().then('it should render the card', () => {
      expectCard()
    })

    BddTest().then('it should render the file icon', () => {
      expectIcon(MDI_ICONS.FILE)
    })

    BddTest().then('it should render the file name as title', () => {
      expectTitle(fileResource.name)
    })

    BddTest().then('it should render the file type tag', () => {
      expectTag(TAG_FILE_LABEL)
    })

    BddTest().then('it should download the pending file directly when clicked', async () => {
      await getFile().trigger('click')
      await flushPromises()

      expect(downloadBlob).toHaveBeenCalledWith(fileResource, fileResource.name)
    })
  })

  BddTest().when('the component is mounted with a file dto resource', () => {
    beforeEach(() => {
      mountWith({ resource: fileDtoResource })
    })

    BddTest().then('it should enable the download tooltip', () => {
      expectFileDownloadTooltip(false)
    })

    BddTest().then('it should disable the title tooltip when the title is not truncated', () => {
      expectTitleTooltip(true, fileDtoResource.fileName)
    })

    BddTest().then('it should render a button', () => {
      expectFile()
    })

    BddTest().then('it should render the card', () => {
      expectCard()
    })

    BddTest().then('it should render the file icon', () => {
      expectIcon(MDI_ICONS.FILE)
    })

    BddTest().then('it should render the file name as title', () => {
      expectTitle(fileDtoResource.fileName)
    })

    BddTest().then('it should render the file type tag', () => {
      expectTag(TAG_FILE_LABEL)
    })

    BddTest().then('it should download the file through the activity file endpoint when clicked', async () => {
      await expectFileDownload(defaultProps.activityId, fileDtoResource, false)
    })
  })

  BddTest().when('the component is mounted with a file dto resource of a draft activity', () => {
    beforeEach(() => {
      mountWith({ resource: fileDtoResource, isDraft: true })
    })

    BddTest().then('it should download the file through the draft file endpoint when clicked', async () => {
      await expectFileDownload(defaultProps.activityId, fileDtoResource, true)
    })
  })

  BddTest().when('the download fails', () => {
    beforeEach(() => {
      mountWith({ resource: invalidFileDtoResource })
    })

    BddTest().then('it should add an error toaster message', async () => {
      await getFile().trigger('click')
      await flushPromises()

      await vi.waitFor(() => {
        expect(mockAddErrorMessage).toHaveBeenCalledTimes(1)
      })

      expect(downloadBlob).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the component is mounted with a disabled link resource', () => {
    beforeEach(() => {
      mountWith({ disabled: true })
    })

    BddTest().then('it should disable the download tooltip', () => {
      expectFileDownloadTooltip(true)
    })

    BddTest().then('it should disable the title tooltip', () => {
      expectTitleTooltip(true, linkResource)
    })

    BddTest().then('it should render a div instead of a link', () => {
      const link = getLink()
      expect(link.exists()).toBe(true)
      expect(link.element.localName).toBe('div')
    })
  })

  BddTest().when('the title tooltip is explicitly enabled on a disabled resource', () => {
    beforeEach(() => {
      mountWith({ disabled: true, tooltipVisible: true }, true)
    })

    BddTest().then('it should keep the download tooltip disabled', () => {
      expectFileDownloadTooltip(true)
    })

    BddTest().then('it should enable the title tooltip', () => {
      expectTitleTooltip(false, linkResource)
    })
  })

  BddTest().when('the title tooltip visibility is explicitly disabled on a truncated title', () => {
    beforeEach(() => {
      mountWith({ resource: fileResource, disabled: false, tooltipVisible: false }, true)
    })

    BddTest().then('it should enable the download tooltip', () => {
      expectFileDownloadTooltip(false)
    })

    BddTest().then('it should enable the title tooltip for the truncated title', () => {
      expectTitleTooltip(false, fileResource.name)
    })
  })

  BddTest().when('the title tooltip visibility is explicitly enabled', () => {
    beforeEach(() => {
      mountWith({ resource: fileResource, disabled: false, tooltipVisible: true }, true)
    })

    BddTest().then('it should enable the download tooltip', () => {
      expectFileDownloadTooltip(false)
    })

    BddTest().then('it should enable the title tooltip', () => {
      expectTitleTooltip(false, fileResource.name)
    })
  })

  BddTest().when('the title is truncated and tooltip visibility is not specified on an enabled resource', () => {
    beforeEach(() => {
      mountWith({ disabled: false, tooltipVisible: undefined }, true)
    })

    BddTest().then('it should enable the title tooltip for the truncated title', () => {
      expectTitleTooltip(false, linkResource)
    })
  })

  BddTest().when('the title is truncated on a disabled resource', () => {
    beforeEach(() => {
      mountWith({ disabled: true, tooltipVisible: undefined }, true)
    })

    BddTest().then('it should enable the title tooltip for the truncated title', () => {
      expectTitleTooltip(false, linkResource)
    })
  })
})
