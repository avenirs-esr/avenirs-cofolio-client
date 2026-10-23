import type { PropType } from 'vue'
import type { IconOptions } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.vue'

export const FloatingIconCardStub = defineComponent({
  name: 'FloatingIconCard',
  template: `
    <div class="floating-icon-card">
      <div class="card-title">{{ title }}</div>
      <div class="card-icon">{{ iconOptions?.name }}</div>
      <div class="card-body"><slot name="body" /></div>
      <div class="card-footer"><slot name="footer" /></div>
    </div>
  `,
  props: {
    title: { type: String, required: true },
    titleColor: { type: String, required: false },
    iconOptions: { type: Object as PropType<IconOptions>, required: true },
    borderColor: { type: String, required: false },
    borderColorOnHover: { type: String, required: false },
    color: { type: String, required: false },
    customTitleHeight: { type: String, required: false },
    headerRows: { type: Number as PropType<1 | 2 | 3>, required: false },
    height: { type: String, required: false },
    titleTypographyClasses: { type: String, required: false },
    radius: { type: String, required: false }
  }
})
