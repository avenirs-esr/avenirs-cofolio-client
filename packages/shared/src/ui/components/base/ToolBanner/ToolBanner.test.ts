import type { VueWrapper } from '@vue/test-utils'
import type { MaybeRefOrGetter } from 'vue'
import ToolBanner from '#shared/ui/components/base/ToolBanner/ToolBanner.vue'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { beforeEach, expect, vi } from 'vitest'
import { computed, ref, toValue } from 'vue'

const mockBannerUrl = ref<string>()
const mockUseStorageImage = vi.fn()

vi.mock('#shared/composables/use-storage-image/use-storage-image', () => ({
  useStorageImage: (fileId: MaybeRefOrGetter<string | undefined>, defaultPicture?: 'profile' | 'cover') => {
    mockUseStorageImage(toValue(fileId), defaultPicture)

    return { url: computed(() => mockBannerUrl.value) }
  },
}))

BddTest().given('a tool banner', () => {
  let wrapper: VueWrapper<InstanceType<typeof ToolBanner>>

  const mountWith = (bannerId?: string) => {
    wrapper = mountComponent(ToolBanner, {
      props: { bannerId },
    })
  }

  beforeEach(() => {
    mockBannerUrl.value = 'blob:http://localhost/banner'
    mockUseStorageImage.mockClear()
  })

  BddTest().when('the component is mounted with a banner identifier', () => {
    beforeEach(() => {
      mountWith('banner-123')
    })

    BddTest().then('it should load the cover image using the banner identifier', () => {
      expect(mockUseStorageImage).toHaveBeenCalledWith('banner-123', 'cover')
    })

    BddTest().then('it should render the image with its resolved URL and alternative text', () => {
      const banner = wrapper.get('[data-testid="tool-banner"]')

      expect(banner.attributes('src')).toBe('blob:http://localhost/banner')
      expect(banner.attributes('alt')).toBe('Image décorative de l\'outil')
    })
  })

  BddTest().when('the component is mounted without a banner identifier', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should load the default cover image', () => {
      expect(mockUseStorageImage).toHaveBeenCalledWith(undefined, 'cover')
    })
  })

  BddTest().when('the image URL is unavailable', () => {
    beforeEach(() => {
      mockBannerUrl.value = undefined
      mountWith('banner-123')
    })

    BddTest().then('it should render the image without a source', () => {
      expect(wrapper.get('[data-testid="tool-banner"]').attributes('src')).toBeUndefined()
    })
  })
})
