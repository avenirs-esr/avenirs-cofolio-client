export const TraceFilterContainerStub = defineComponent({
  name: 'TraceFilterContainer',
  props: ['isAssociated'],
  template: `
      <div class="trace-filter-container-stub">
        <button
          class="emit-update-filters"
          @click="$emit('update:filters', {
            keyword: 'example',
            fromDate: '2025-10-10',
            skillIds: ['skill-1', 'skill-2']
          })"
        >
          Update filters
        </button>
        <slot />
      </div>
    `
})
