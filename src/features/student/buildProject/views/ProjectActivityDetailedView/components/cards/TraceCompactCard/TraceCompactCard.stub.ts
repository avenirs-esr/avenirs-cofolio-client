export const TraceCompactCardStub = defineComponent({
  name: 'TraceCompactCard',
  props: ['trace'],
  template: `
    <div class="trace-compact-card-stub">
      <span>{{ trace?.title }}</span>
    </div>
  `
})
