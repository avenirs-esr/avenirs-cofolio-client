export const ThematicSelectStub = defineComponent({
  name: 'ThematicSelect',
  props: ['modelValue', 'errorMessage',],
  emits: ['update:modelValue', 'blur',],
  template: `
    <div data-testid="thematic-select-stub">
      <select
        :value="modelValue?.itemId"
        @change="$emit('update:modelValue',{ itemId: $event.target.value })"
        @blur="$emit('blur')"
      >
        <option value="">Select</option>
        <option value="SELF_KNOWLEDGE">Me connaître</option>
        <option value="FUTURE_PLANS">Explorer mes futurs</option>
        <option value="PROGRAMS">Mes formations</option>
        <option value="EXPERIENCES">Mes expériences</option>
        <option value="TRAJECTORIES">Mes trajectoires</option>
        <option value="RESUMES">CV</option>
        <option value="TRANSVERSAL">Transverses</option>
      </select>
    </div>
  `,
})
