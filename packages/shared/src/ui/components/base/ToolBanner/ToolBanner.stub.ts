import { defineComponent } from 'vue'

export const ToolBannerStub = defineComponent({
  name: 'ToolBanner',
  props: {
    bannerId: { type: String, required: false },
  },
  template: '<div data-testid="tool-banner-stub"></div>',
})
