import type { AvIconProps } from '@avenirs-esr/avenirs-dsav'
import type { PropType } from 'vue'
import type { RouteLocationRaw } from 'vue-router'

export const LongIconCardStub = defineComponent({
  name: 'LongIconCard',
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: Object as PropType<Pick<AvIconProps, 'name' | 'color'>>,
      required: true
    },
    iconBackgroundColor: {
      type: String,
      required: false
    },
    to: {
      type: [String, Object] as PropType<string | RouteLocationRaw>,
      required: false
    }
  },
  template: `
    <div data-testid="long-icon-card">
      <span data-testid="long-icon-card-title">{{ title }}</span>
      <slot />
    </div>
  `
})
