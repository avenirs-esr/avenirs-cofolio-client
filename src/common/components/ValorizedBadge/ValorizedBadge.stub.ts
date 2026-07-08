export const ValorizedBadgeStub = defineComponent({
  name: 'ValorizedBadge',
  props: {
    valorized: {
      type: Boolean,
      required: true,
    },
  },
  template: '<div class="valorized-badge-stub"></div>'
})
