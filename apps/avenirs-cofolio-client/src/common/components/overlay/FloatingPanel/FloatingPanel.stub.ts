export const FloatingPanelStub = defineComponent({
  name: 'FloatingPanel',
  props: {
    title: { type: String, required: true },
    subtitle: { type: String },
    icon: { type: String },
  },
  setup (_, { expose }) {
    const collapsed = ref(true)

    function togglePanel () {
      collapsed.value = !collapsed.value
    }

    expose({ togglePanel })

    return {
      collapsed,
    }
  },
  template: `
    <div
      :data-collapsed="collapsed"
      data-testid="floating-panel-stub"
    >
      <slot />
    </div>
  `,
})
