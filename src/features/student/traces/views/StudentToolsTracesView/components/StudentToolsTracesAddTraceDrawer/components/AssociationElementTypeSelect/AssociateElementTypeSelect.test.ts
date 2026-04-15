import type { AssociateElementTypeConfig } from '@/features/student/traces/types/traces.types'
import type { VueWrapper } from '@vue/test-utils'
import AssociateElementTypeSelect from '@/features/student/traces/views/StudentToolsTracesView/components/StudentToolsTracesAddTraceDrawer/components/AssociationElementTypeSelect/AssociateElementTypeSelect.vue'
import { AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount } from '@vue/test-utils'
import { beforeEach, expect, vi } from 'vitest'

const typeConfigs: AssociateElementTypeConfig[] = [
  { key: 'declaredSkills', label: 'Compétences déclarées', searchPlaceholder: 'Rechercher une compétence...' },
  { key: 'activities', label: 'Activités', searchPlaceholder: 'Rechercher une activité...' }
]

BddTest().given('an associate element type select', () => {
  let wrapper: VueWrapper<InstanceType<typeof AssociateElementTypeSelect>>

  const stubs = {
    AvSelect: AvSelectStub
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(AssociateElementTypeSelect, {
        props: { typeConfigs },
        global: { stubs }
      })
    })

    BddTest().then('it should render the select', () => {
      expect(wrapper.findComponent(AvSelectStub).exists()).toBe(true)
    })

    BddTest().then('it should pass mapped options to the select', () => {
      const options = wrapper.findComponent(AvSelectStub).props('options')

      expect(options).toEqual([
        { id: 'declaredSkills', label: 'Compétences déclarées' },
        { id: 'activities', label: 'Activités' }
      ])
    })

    BddTest().then('it should initialize with the first type selected', () => {
      expect(wrapper.findComponent(AvSelectStub).props('selectedItem')).toEqual({
        itemId: 'declaredSkills'
      })
    })
  })

  BddTest().when('the user selects a different type', () => {
    beforeEach(async () => {
      wrapper = mount(AssociateElementTypeSelect, {
        props: { typeConfigs },
        global: { stubs }
      })

      await wrapper.findComponent(AvSelectStub).vm.$emit('update:selectedItem', { itemId: 'activities' })
      await wrapper.vm.$nextTick()
    })

    BddTest().then('it should emit typeChange with the selected type key', () => {
      expect(wrapper.emitted('typeChange')).toBeTruthy()
      expect(wrapper.emitted('typeChange')?.[0]).toEqual(['activities'])
    })
  })
})
