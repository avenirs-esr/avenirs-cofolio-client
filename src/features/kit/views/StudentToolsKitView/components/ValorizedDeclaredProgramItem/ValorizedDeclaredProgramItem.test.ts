import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EProgramStatus } from '@/api/avenir-esr'
import { ROUTES } from '@/common/constants'
import ValorizedDeclaredProgramItem from '@/features/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramItem/ValorizedDeclaredProgramItem.vue'
import { AvBadgeStub, AvButtonStub, AvTooltipStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'

const BASE_DECLARED_PROGRAM: DeclaredProgramViewDTO = {
  id: 'c1e6a6f0-1c2d-4f3e-9a1b-3f2b1c0d4e5f',
  title: 'Master en Informatique',
  organization: 'Université Paris-Saclay',
  description: 'Formation approfondie en développement logiciel et intelligence artificielle',
  status: EProgramStatus.IN_PROGRESS,
  result: 'Mention Très Bien',
  startDate: '2025-09-01',
  endDate: '2027-06-01',
  valorized: true
}

const stubs = {
  AvButton: AvButtonStub,
  AvTooltip: AvTooltipStub,
  AvBadge: AvBadgeStub
}

function mountValorizedDeclaredProgramItem (declaredProgram: DeclaredProgramViewDTO) {
  return mountComponent(ValorizedDeclaredProgramItem, {
    props: { declaredProgram },
    global: { stubs }
  })
}

BddTest().given('a valorized declared program item', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredProgramItem>>

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredProgramItem(BASE_DECLARED_PROGRAM)
      await flushPromises()
    })

    BddTest().then('it should render the wrapped ValorizedItem with the program title', () => {
      expect(wrapper.find('[data-testid="valorized-item"]').exists()).toBe(true)
      expect(wrapper.find('.title').text()).toBe(BASE_DECLARED_PROGRAM.title)
    })

    BddTest().then('it should render the access button pointing to the declared program route', () => {
      const button = wrapper.findComponent(AvButtonStub)
      expect(button.props('to')).toEqual({
        name: ROUTES.STUDENT.PERSONAL_CAREER_DECLARED_PROGRAM_DETAILED.name,
        params: { id: BASE_DECLARED_PROGRAM.id }
      })
    })

    BddTest().then('it should render the organization badge combined with the period', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain(`${BASE_DECLARED_PROGRAM.organization} • 2025 - 2027`)
    })

    BddTest().then('it should render the description', () => {
      expect(wrapper.text()).toContain(BASE_DECLARED_PROGRAM.description)
    })

    BddTest().then('it should render the status badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain('En cours')
    })

    BddTest().then('it should render the result badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain(BASE_DECLARED_PROGRAM.result)
    })
  })

  BddTest().when('the program has no description', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredProgramItem({
        ...BASE_DECLARED_PROGRAM,
        description: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should not render a description', () => {
      expect(wrapper.text()).not.toContain(BASE_DECLARED_PROGRAM.description)
    })
  })

  BddTest().when('the program has no status', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredProgramItem({
        ...BASE_DECLARED_PROGRAM,
        status: undefined
      } as unknown as DeclaredProgramViewDTO)
      await flushPromises()
    })

    BddTest().then('it should not render the status badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).not.toContain('En cours')
    })
  })

  BddTest().when('the program has no result', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredProgramItem({
        ...BASE_DECLARED_PROGRAM,
        result: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should not render the result badge', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).not.toContain(BASE_DECLARED_PROGRAM.result)
    })
  })

  BddTest().when('the program has no start date', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredProgramItem({
        ...BASE_DECLARED_PROGRAM,
        startDate: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should render the organization badge without a period', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain(BASE_DECLARED_PROGRAM.organization)
    })
  })

  BddTest().when('the program has a start date but no end date', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredProgramItem({
        ...BASE_DECLARED_PROGRAM,
        endDate: undefined
      })
      await flushPromises()
    })

    BddTest().then('it should render the period as ongoing', () => {
      const labels = wrapper.findAllComponents(AvBadgeStub).map(badge => badge.props('label'))
      expect(labels).toContain(`${BASE_DECLARED_PROGRAM.organization} • 2025 - En cours`)
    })
  })
})
