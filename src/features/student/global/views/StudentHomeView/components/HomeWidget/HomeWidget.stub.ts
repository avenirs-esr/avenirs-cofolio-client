export const HomeWidgetStub = defineComponent({
  name: 'HomeWidget',
  props: {
    title: { type: String, required: true },
    titleIcon: { type: String, required: true },
    seeAllLabel: { type: String, required: true },
    type: { type: String, required: true },
    displayWidget: { type: Boolean, required: false },
  },
  template: `
    <div v-if="displayWidget" :class="\`home-\${type}-widget\`">
      <slot />
      <button :label="seeAllLabel" class="see-all-button" @click="$emit('seeAllClick')" />
    </div>
  `
})
