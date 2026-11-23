import type { ToolDTO } from '#shared/api/avenir-esr/index'
import type { ToolCardProps } from '#shared/ui/components/cards/ToolCard/ToolCard.vue'
import type { VueWrapper } from '@vue/test-utils'
import type { MaybeRefOrGetter } from 'vue'
import ToolCard from '#shared/ui/components/cards/ToolCard/ToolCard.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import {
  BG_COLORS,
  FloatingIconCardStub,
  ICON_COLORS,
  ICONS,
  TEXT_COLORS
} from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { computed, ref, toValue } from 'vue'

const mockIsMobile = ref(false)
const mockBannerUrl = ref<string>()

const mockUseStorageImage = vi.fn()

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()

  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: mockIsMobile })
  }
})

vi.mock('#shared/composables/use-storage-image/use-storage-image', () => ({
  useStorageImage: (fileId: MaybeRefOrGetter<string | undefined>, defaultPicture?: 'profile' | 'cover') => {
    mockUseStorageImage(toValue(fileId), defaultPicture)

    return {
      url: computed(() => mockBannerUrl.value)
    }
  }
}))

const stubs = {
  FloatingIconCard: FloatingIconCardStub,
  AvButton: AvButtonStub,
  RouterLink: RouterLinkStub
}

BddTest().given('a tool card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolCard>>

  const defaultTool = {
    id: 'tool-123',
    name: 'Test Tool',
    banner: {
      id: 'banner-123'
    },
    description: 'Test tool description',
    url: 'https://example.com'
  } as ToolDTO

  const defaultProps: ToolCardProps = {
    tool: defaultTool
  }

  const getAvButton = () => wrapper.findComponent(AvButtonStub)
  const getFloatingIconCard = () => wrapper.findComponent(FloatingIconCardStub)
  const getRouterLink = () => wrapper.findComponent(RouterLinkStub)
  const getBanner = () => wrapper.find('[data-testid="activity-banner"]')

  const mountWith = async (props?: Partial<ToolCardProps>) => {
    wrapper = mountComponent(ToolCard, {
      props: { ...defaultProps, ...props },
      global: { stubs }
    })

    await flushPromises()
  }

  beforeEach(() => {
    mockIsMobile.value = false
    mockBannerUrl.value = 'blob:http://localhost/banner'
    mockUseStorageImage.mockClear()
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
      expect(card.props('height')).toBe('23rem')
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

    BddTest().then('it should load the cover image using the banner identifier', () => {
      expect(mockUseStorageImage).toHaveBeenCalledWith('banner-123', 'cover')
    })

    BddTest().then('it should render the banner with the resolved URL and alternative text', () => {
      expect(getBanner().exists()).toBe(true)
      expect(getBanner().attributes('src')).toBe(mockBannerUrl.value)
      expect(getBanner().attributes('alt')).toBe('Image décorative de l\'outil')
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
  })

  BddTest().when('the component is mounted without a banner identifier', () => {
    beforeEach(async () => {
      await mountWith({
        tool: {
          ...defaultTool,
          banner: undefined
        } as ToolDTO
      })
    })

    BddTest().then('it should load the default cover image', () => {
      expect(mockUseStorageImage).toHaveBeenCalledWith(undefined, 'cover')
    })
  })

  BddTest().when('the banner URL is not available', () => {
    beforeEach(async () => {
      mockBannerUrl.value = undefined
      await mountWith()
    })

    BddTest().then('it should render the banner without a source', () => {
      expect(getBanner().exists()).toBe(true)
      expect(getBanner().attributes('src')).toBeUndefined()
    })
  })

  BddTest().when('the device is mobile', () => {
    beforeEach(async () => {
      mockIsMobile.value = true
      await mountWith()
    })

    BddTest().then('it should use the full available width', () => {
      expect(getFloatingIconCard().props('width')).toBe('100%')
    })
  })

  BddTest().when('the device is not mobile', () => {
    beforeEach(async () => {
      mockIsMobile.value = false
      await mountWith()
    })

    BddTest().then('it should use the desktop width', () => {
      expect(getFloatingIconCard().props('width')).toBe('27rem')
    })
  })
})
