import type { EActivityThematic, EDeclaredActivityStatus, FileDTO } from '@/api/avenir-esr'
import type { PropType } from 'vue'

export const ActivityCatalogHeaderStub = defineComponent({
  name: 'ActivityCatalogHeader',
  template: '<div data-testid="activity-catalog-banner-stub"></div>',
  props: {
    title: {
      type: String,
      required: true,
    },
    thematic: {
      type: String as PropType<EActivityThematic>,
      required: true,
    },
    banner: {
      type: Object as PropType<FileDTO>,
    },
    declaredActivityStatus: {
      type: String as PropType<EDeclaredActivityStatus>,
    },
  },
})
