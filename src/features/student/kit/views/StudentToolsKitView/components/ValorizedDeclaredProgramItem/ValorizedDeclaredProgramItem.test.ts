import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { EProgramStatus } from '@/api/avenir-esr'
import { ValorizedItemType } from '@/features/student/kit/types/valorized.types'
import ValorizedDeclaredProgramItem from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedDeclaredProgramItem/ValorizedDeclaredProgramItem.vue'
import { ValorizedItemStub } from '@/features/student/kit/views/StudentToolsKitView/components/ValorizedItem/ValorizedItem.stub'
import {
  DeclaredProgramOrganizationBadge,
  DeclaredProgramResultBadge
} from '@/features/student/personalCareer'
import { DeclaredProgramOrganizationBadgeStub } from '@/features/student/personalCareer/components/badges/DeclaredProgramOrganizationBadge/DeclaredProgramOrganizationBadge.stub'
import { DeclaredProgramResultBadgeStub } from '@/features/student/personalCareer/components/badges/DeclaredProgramResultBadge/DeclaredProgramResultBadge.stub'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
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
  ValorizedItem: ValorizedItemStub,
  DeclaredProgramOrganizationBadge: DeclaredProgramOrganizationBadgeStub,
  DeclaredProgramResultBadge: DeclaredProgramResultBadgeStub
}

function mountValorizedDeclaredProgramItem (declaredProgram: DeclaredProgramViewDTO) {
  return mountComponent(ValorizedDeclaredProgramItem, {
    props: { declaredProgram },
    global: { stubs }
  })
}

BddTest().given('a valorized declared program item', () => {
  let wrapper: VueWrapper<InstanceType<typeof ValorizedDeclaredProgramItem>>

  const getValorizedItem = () => wrapper.findComponent(ValorizedItemStub)
  const getOrganizationBadge = () => wrapper.findComponent(DeclaredProgramOrganizationBadge)
  const getResultBadge = () => wrapper.findComponent(DeclaredProgramResultBadge)

  BddTest().when('the component is mounted', () => {
    beforeEach(async () => {
      wrapper = mountValorizedDeclaredProgramItem(BASE_DECLARED_PROGRAM)
      await flushPromises()
    })

    BddTest().then('it should render the ValorizedItem with the program information', () => {
      const valorizedItem = getValorizedItem()

      expect(valorizedItem.exists()).toBe(true)
      expect(valorizedItem.props('title')).toBe(BASE_DECLARED_PROGRAM.title)
      expect(valorizedItem.props('itemId')).toBe(BASE_DECLARED_PROGRAM.id)
      expect(valorizedItem.props('type')).toBe(ValorizedItemType.DECLARED_PROGRAM)
    })

    BddTest().then('it should render the organization badge with the period', () => {
      const organizationBadge = getOrganizationBadge()

      expect(organizationBadge.props('organization')).toBe(
        BASE_DECLARED_PROGRAM.organization
      )
      expect(organizationBadge.props('period')).toBe('2025 - 2027')
    })

    BddTest().then('it should render the result badge', () => {
      const resultBadge = getResultBadge()

      expect(resultBadge.exists()).toBe(true)
      expect(resultBadge.props('result')).toBe(BASE_DECLARED_PROGRAM.result)
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
      expect(getResultBadge().exists()).toBe(false)
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
      const organizationBadge = getOrganizationBadge()

      expect(organizationBadge.props('organization')).toBe(
        BASE_DECLARED_PROGRAM.organization
      )
      expect(organizationBadge.props('period')).toBeUndefined()
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
      const organizationBadge = getOrganizationBadge()

      expect(organizationBadge.props('organization')).toBe(
        BASE_DECLARED_PROGRAM.organization
      )
      expect(organizationBadge.props('period')).toBe('2025 - En cours')
    })
  })
})
