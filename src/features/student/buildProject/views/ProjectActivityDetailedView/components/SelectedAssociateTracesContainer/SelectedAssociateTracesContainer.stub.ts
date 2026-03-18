export const SelectedAssociateTracesContainerStub = defineComponent({
  name: 'SelectedAssociateTracesContainer',
  props: ['traces'],
  emits: ['delete'],
  template: `
    <div class="selected-associate-traces-container-stub">
      <div
        v-for="trace in traces"
        :key="trace.id"
        class="selected-associate-traces-container-stub__item"
      >
        {{ trace.title }}
      </div>
    </div>
  `
})
