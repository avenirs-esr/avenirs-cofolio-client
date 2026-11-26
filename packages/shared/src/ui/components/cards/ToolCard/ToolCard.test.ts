import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { ToolCardProps } from '#shared/ui/components/cards/ToolCard/ToolCard.vue'
import type { VueWrapper } from '@vue/test-utils'
import { EFileType, EToolType } from '#shared/api/avenir-esr/index'
import { BG_COLORS, ICON_COLORS, TEXT_COLORS } from '#shared/constants/colors'
import { ICONS } from '#shared/constants/icons'
import { ToolBannerStub } from '#shared/ui/components/base/ToolBanner/ToolBanner.stub'
import { ToolInstitutionStub } from '#shared/ui/components/base/ToolInstitution/ToolInstitution.stub'
import { FloatingIconCardStub } from '#shared/ui/components/cards/FloatingIconCard/FloatingIconCard.stub'
import ToolCard from '#shared/ui/components/cards/ToolCard/ToolCard.vue'
import { AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { ref } from 'vue'

const mockIsMobile = ref(false)
const mockIsTruncated = ref(false)

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: mockIsMobile }),
    useTextTruncation: () => ({ isTruncated: mockIsTruncated })
  }
})

const stubs = {
  FloatingIconCard: FloatingIconCardStub,
  AvButton: AvButtonStub,
  RouterLink: RouterLinkStub,
  AvTooltip: AvTooltipStub,
  ToolBanner: ToolBannerStub,
  ToolInstitution: ToolInstitutionStub
}

BddTest().given('a tool card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolCard>>

  const defaultTool: ToolDTO = {
    id: 'tool-123',
    name: 'Test Tool',
    banner: {
      id: 'banner-123',
      fileName: 'banner.jpg',
      fileSize: 12345,
      fileType: EFileType.JPEG,
      url: 'http://localhost/banner',
      uploadedAt: (new Date()).toISOString()
    },
    description: 'Test tool description',
    url: 'https://example.com',
    type: EToolType.NATIONAL
  }

  const defaultProps: ToolCardProps = {
    tool: defaultTool
  }

  const defaultInstitution = {
    id: 'institution-123',
    name: 'Test institution'
  }

  const getAvButton = () => wrapper.findComponent(AvButtonStub)
  const getToolInstitution = () => wrapper.findComponent(ToolInstitutionStub)
  const getAvTooltip = () => wrapper.findComponent(AvTooltipStub)
  const getFloatingIconCard = () => wrapper.findComponent(FloatingIconCardStub)
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getBanner = () => wrapper.findComponent(ToolBannerStub)
  const getUrl = () => wrapper.find('.url')

  const mountWith = async (props?: Partial<ToolCardProps>) => {
    wrapper = mountComponent(ToolCard, {
      props: { ...defaultProps, ...props },
      global: { stubs }
    })

    await flushPromises()
  }

  beforeEach(() => {
    mockIsMobile.value = false
    mockIsTruncated.value = false
  })

  BddTest().when('the component is mounted without a base route name', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should render the card inside a div', () => {
      expect(wrapper.element.tagName).toBe('DIV')
      expect(getFloatingIconCard().exists()).toBe(true)
    })

    BddTest().then('it should not render a router link', () => {
      expect(getRouterLink().exists()).toBe(false)
    })

    BddTest().then('it should pass the expected props to FloatingIconCard', () => {
      const card = getFloatingIconCard()

      expect(card.props('title')).toBe(defaultTool.name)
      expect(card.props('color')).toBe(BG_COLORS.TOOLS)
      expect(card.props('borderColor')).toBe('var(--other-border-skill-card)')
      expect(card.props('titleColor')).toBe(TEXT_COLORS.TOOLS)
      expect(card.props('titleTypographyClasses')).toBe('b2-bold')
      expect(card.props('headerRows')).toBe(2)
      expect(card.props('borderColorOnHover')).toBe('var(--dark-background-primary1)')
      expect(card.props('hoverable')).toBe(false)
      expect(card.props('height')).toBe('26rem')
      expect(card.props('width')).toBe('27rem')
      expect(card.props('radius')).toBe('var(--radius-xl)')
    })

    BddTest().then('it should pass the expected icon options to FloatingIconCard', () => {
      expect(getFloatingIconCard().props('iconOptions')).toStrictEqual({
        name: ICONS.TOOLS,
        color: ICON_COLORS.TOOLS,
        borderColor: 'var(--stroke)',
        bottom: 'var(--spacing-xl-neg)'
      })
    })

    BddTest().then('it should render the banner with its identifier', () => {
      expect(getBanner().exists()).toBe(true)
      expect(getBanner().props('bannerId')).toBe(defaultTool.banner?.id)
    })

    BddTest().then('it should render the description', () => {
      expect(wrapper.text()).toContain(defaultTool.description)
    })

    BddTest().then('it should render the external link button', () => {
      const button = getAvButton()

      expect(button.exists()).toBe(true)
      expect(button.props('href')).toBe(defaultTool.url)
      expect(button.props('label')).toBeTruthy()
    })

    BddTest().then('it should render the tool institution component', () => {
      expect(getToolInstitution().exists()).toBe(true)
      expect(getToolInstitution().props('tool')).toEqual(defaultTool)
    })

    BddTest().then('it should not render the URL tooltip', () => {
      expect(getAvTooltip().exists()).toBe(false)
    })
  })

  BddTest().when('the component is mounted with a national tool', () => {
    beforeEach(async () => {
      await mountWith({
        tool: {
          ...defaultTool,
          type: EToolType.NATIONAL,
          institution: defaultInstitution
        }
      })
    })

    BddTest().then('it should render the tool institution component with the tool data', () => {
      expect(getToolInstitution().exists()).toBe(true)
      expect(getToolInstitution().props('tool')).toEqual(expect.objectContaining({
        type: EToolType.NATIONAL,
        institution: defaultInstitution
      }))
    })
  })

  BddTest().when('the component is mounted with a regional tool', () => {
    beforeEach(async () => {
      await mountWith({
        tool: {
          ...defaultTool,
          type: EToolType.REGIONAL,
          institution: defaultInstitution
        }
      })
    })

    BddTest().then('it should render the tool institution component with the tool data', () => {
      expect(getToolInstitution().exists()).toBe(true)
      expect(getToolInstitution().props('tool')).toEqual(expect.objectContaining({
        type: EToolType.REGIONAL,
        institution: defaultInstitution
      }))
    })
  })

  BddTest().when('the component is mounted with a local tool', () => {
    beforeEach(async () => {
      await mountWith({
        tool: {
          ...defaultTool,
          type: EToolType.LOCAL,
          institution: defaultInstitution
        }
      })
    })

    BddTest().then('it should render the tool institution component with the tool data', () => {
      expect(getToolInstitution().exists()).toBe(true)
      expect(getToolInstitution().props('tool')).toEqual(expect.objectContaining({
        type: EToolType.LOCAL,
        institution: defaultInstitution
      }))
    })
  })

  BddTest().when('the component is mounted with a tool without an institution name', () => {
    beforeEach(async () => {
      await mountWith({
        tool: {
          ...defaultTool,
          type: EToolType.LOCAL,
          institution: {
            ...defaultInstitution,
            name: ''
          }
        }
      })
    })

    BddTest().then('it should still render the tool institution component (which handles the display logic)', () => {
      expect(getToolInstitution().exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a tool without a type', () => {
    beforeEach(async () => {
      await mountWith({
        tool: {
          ...defaultTool,
          institution: defaultInstitution
        }
      })
    })

    BddTest().then('it should still render the tool institution component (which handles the display logic)', () => {
      expect(getToolInstitution().exists()).toBe(true)
    })
  })

  BddTest().when('the component is mounted with a base route name', () => {
    beforeEach(async () => {
      await mountWith({ baseRouteName: 'staff-admin-tool' })
    })

    BddTest().then('it should render a router link to the tool details', () => {
      expect(getRouterLink().exists()).toBe(true)
      expect(getRouterLink().props('to')).toStrictEqual({
        name: 'staff-admin-tool',
        params: { id: defaultTool.id }
      })
    })

    BddTest().then('it should make the card hoverable', () => {
      expect(getFloatingIconCard().props('hoverable')).toBe(true)
    })

    BddTest().then('it should not render the external link button', () => {
      expect(getAvButton().exists()).toBe(false)
    })

    BddTest().then('it should display the tool URL as text', () => {
      expect(getUrl().text()).toBe(defaultTool.url)
    })

    BddTest().then('it should render a tooltip disabled when the URL is not truncated', () => {
      expect(getAvTooltip().exists()).toBe(true)
      expect(getAvTooltip().props('content')).toBe(defaultTool.url)
      expect(getAvTooltip().props('disabled')).toBe(true)
      expect(getAvTooltip().props('forceFocusable')).toBe(true)
    })

    BddTest().then('it should initialize text truncation tracking', () => {
      expect(getAvTooltip().props('content')).toBe(defaultTool.url)
    })
  })

  BddTest().when('the URL is truncated', () => {
    beforeEach(async () => {
      mockIsTruncated.value = true
      await mountWith({ baseRouteName: 'staff-admin-tool' })
    })

    BddTest().then('it should enable the tooltip', () => {
      expect(getAvTooltip().props('disabled')).toBe(false)
    })
  })

  BddTest().when('the component is mounted without a banner', () => {
    beforeEach(async () => {
      await mountWith({
        tool: {
          ...defaultTool,
          banner: undefined
        }
      })
    })

    BddTest().then('it should render the banner without an identifier', () => {
      expect(getBanner().exists()).toBe(true)
      expect(getBanner().props('bannerId')).toBeUndefined()
    })
  })

  BddTest().when('the device is mobile', () => {
    beforeEach(async () => {
      mockIsMobile.value = true
      await mountWith()
    })

    BddTest().then('it should use the full available width and fit-content height', () => {
      expect(getFloatingIconCard().props('width')).toBe('100%')
      expect(getFloatingIconCard().props('height')).toBe('fit-content')
    })
  })

  BddTest().when('the device is not mobile', () => {
    beforeEach(async () => {
      mockIsMobile.value = false
      await mountWith()
    })

    BddTest().then('it should use the desktop dimensions', () => {
      expect(getFloatingIconCard().props('width')).toBe('27rem')
      expect(getFloatingIconCard().props('height')).toBe('26rem')
    })
  })
})
