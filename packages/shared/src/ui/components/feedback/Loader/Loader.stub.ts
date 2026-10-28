import { defineComponent } from 'vue'

export const LoaderStub = defineComponent({
  name: 'Loader',
  props: {
    color: { type: String },
    size: { type: String },
    isLoading: { type: Boolean },
  },
  template: `
    <div v-if="isLoading" data-testid="loader-stub" v-bind="$attrs" class="loader-stub"></div>
    <template v-else>
      <slot />
    </template>
  `,
})
