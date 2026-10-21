export const HandlesStub = defineComponent({
  name: 'Handles',
  props: {
    data: { type: Object, required: true },
  },
  template: '<div class="handles"><div class="top" /><div class="right" /><div class="bottom" /><div class="left" /></div>',
})
