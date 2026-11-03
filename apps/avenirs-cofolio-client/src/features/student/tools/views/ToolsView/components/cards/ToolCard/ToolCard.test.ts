import type { VueWrapper } from '@vue/test-utils'
import type { MaybeRefOrGetter } from 'vue'
import type { ToolCardProps } from '@/features/student/tools/views/ToolsView/components/cards/ToolCard/ToolCard.vue'
import { AvButtonStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { FloatingIconCardStub, ICONS } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'
import { toValue } from 'vue'
import ToolCard from '@/features/student/tools/views/ToolsView/components/cards/ToolCard/ToolCard.vue'

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

vi.mock('@/common/composables/use-storage-image/use-storage-image', () => ({
  useStorageImage: (fileId: MaybeRefOrGetter<string | undefined>, defaultPicture?: 'profile' | 'cover') => {
    mockUseStorageImage(toValue(fileId), defaultPicture)

    return {
      url: computed(() => mockBannerUrl.value)
    }
  }
}))

const stubs = {
  FloatingIconCard: FloatingIconCardStub,
  AvButton: AvButtonStub
}

BddTest().given('a tool card', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolCard>>

  const defaultProps: ToolCardProps = {
    name: 'Test Tool',
    bannerId: 'banner-123',
    description: 'Test tool description',
    url: 'https://example.com'
  }

  const getAvButton = () => wrapper.findComponent(AvButtonStub)
  const getFloatingIconCard = () => wrapper.findComponent(FloatingIconCardStub)
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

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      await mountWith()
    })

    BddTest().then('it should pass the expected props to FloatingIconCard', () => {
      const card = getFloatingIconCard()

      expect(card.props('title')).toBe(defaultProps.name)
      expect(card.props('color')).toBe('var(--light-background-neutral)')
      expect(card.props('borderColor')).toBe('var(--stroke)')
      expect(card.props('titleColor')).toBe('var(--light-foreground-neutral)')
      expect(card.props('titleTypographyClasses')).toBe('b2-bold')
      expect(card.props('headerRows')).toBe(2)
      expect(card.props('borderColorOnHover')).toBe('var(--stroke)')
      expect(card.props('hoverable')).toBe(false)
      expect(card.props('height')).toBe('23rem')
      expect(card.props('width')).toBe('27rem')
      expect(card.props('radius')).toBe('var(--radius-xl)')
    })

    BddTest().then('it should pass the expected icon options to FloatingIconCard', () => {
      expect(getFloatingIconCard().props('iconOptions')).toStrictEqual({
        name: ICONS.TOOLS,
        color: 'var(--light-foreground-neutral)',
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
      expect(wrapper.text()).toContain(defaultProps.description)
    })

    BddTest().then('it should render the external link button', () => {
      const button = getAvButton()

      expect(button.exists()).toBe(true)
      expect(button.props('href')).toBe(defaultProps.url)
      expect(button.props('label')).toBeTruthy()
    })
  })

  BddTest().when('the component is mounted without a banner identifier', () => {
    beforeEach(async () => {
      await mountWith({ bannerId: undefined })
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
