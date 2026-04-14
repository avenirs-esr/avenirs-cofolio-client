import TraceTypeSelect from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/TraceTypeSelect/TraceTypeSelect.vue'
import { TraceType } from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/types'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a trace type select ', () => {
  let wrapper: VueWrapper<InstanceType<typeof TraceTypeSelect>>

  beforeEach(() => {
    wrapper = mount(TraceTypeSelect, {
      global: {
        stubs: {
          AvSelect: AvSelectStub
        }
      }
    })
  })

  BddTest().when('the component is mounted', () => {
    BddTest().then('it should render a trace type select', () => {
      const container = wrapper.find('[data-testid="trace-type-select"]')
      expect(container.exists()).toBe(true)
    })

    BddTest().then('it should render an AvSelect component', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.exists()).toBe(true)
    })

    BddTest().then('the AvSelect should have correct props', () => {
      const select = wrapper.findComponent({ name: 'AvSelect' })
      expect(select.props('placeholder')).toBe('')
      expect(select.props('dense')).toBe(true)
    })

    BddTest().then('the select should have default value as file', () => {
      const select = wrapper.find('select')
      expect(select.element.value).toBe(TraceType.FILE)
    })

    BddTest().then('the select should render all trace type options with French translations', () => {
      const select = wrapper.find('select')
      const options = select.findAll('option')
      expect(options).toHaveLength(3)
      expect(options[0].text()).toBe('')
      expect(options[1].text()).toBe('Une trace de type fichier')
      expect(options[1].attributes('value')).toBe(TraceType.FILE)
      expect(options[2].text()).toBe('Une trace de type lien')
      expect(options[2].attributes('value')).toBe(TraceType.LINK)
    })
  })

  BddTest().when('the trace type value changes', () => {
    BddTest().then('it should update the selected option', async () => {
      await wrapper.setProps({ traceType: { itemId: TraceType.LINK } })
      const select = wrapper.find('select')
      expect(select.element.value).toBe(TraceType.LINK)
    })
  })
})
