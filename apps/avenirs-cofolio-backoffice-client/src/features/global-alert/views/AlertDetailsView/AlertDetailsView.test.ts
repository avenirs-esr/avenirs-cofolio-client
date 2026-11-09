import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, AvNoticeStub, AvTableStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ActiveBadgeStub, DatePeriodPickerStub, DetailPageTitleStub, fromInstant, QuerySuspenseStub } from '@avenirs-esr/shared'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { afterEach, beforeEach, expect } from 'vitest'
import { mockedAlertConfigurationDTO } from '@/__mocks__/fixtures/global-alert.fixtures'
import { getAlertConfigErrorHandler } from '@/__mocks__/msw/handlers/global-alert.handlers'
import { server } from '@/__mocks__/msw/server'
import { ROUTES } from '@/constants'
import AlertDetailsView from '@/features/global-alert/views/AlertDetailsView/AlertDetailsView.vue'

const EMPTY_STATE_MESSAGE = 'Aucune alerte globale n\'est configurée.'

BddTest().given('an AlertDetailsView view', () => {
  let wrapper: VueWrapper<InstanceType<typeof AlertDetailsView>>

  const stubs = {
    AvButton: AvButtonStub,
    AvNotice: AvNoticeStub,
    AvTable: AvTableStub,
    ActiveBadge: ActiveBadgeStub,
    DatePeriodPicker: DatePeriodPickerStub,
    DetailPageTitle: DetailPageTitleStub,
    QuerySuspense: QuerySuspenseStub,
  }

  const getPageTitle = () => wrapper.findComponent(DetailPageTitleStub)
  const getButton = () => wrapper.findComponent(AvButtonStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getTable = () => wrapper.findComponent(AvTableStub)
  const getActiveBadge = () => wrapper.findComponent(ActiveBadgeStub)
  const getDatePeriodPicker = () => wrapper.findComponent(DatePeriodPickerStub)
  const getNotice = () => wrapper.findComponent(AvNoticeStub)

  const mountView = async () => {
    wrapper = mountComponent(AlertDetailsView, {
      global: { stubs },
    })

    await vi.waitFor(() => {
      expect(getQuerySuspense().props('isLoading')).toBe(false)
    })
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    wrapper?.unmount()
  })

  BddTest().when('the view is mounted', () => {
    beforeEach(async () => {
      await mountView()
    })

    BddTest().then('it should render the page title', () => {
      expect(getPageTitle().props('title')).toBe('Alerte globale')
    })

    BddTest().then('it should render the update button', () => {
      expect(getButton().exists()).toBe(true)
      expect(getButton().props('to')).toBe(ROUTES.GLOBAL_ALERT.UPDATE)
      expect(getButton().props('label')).toBe('Modifier')
    })

    BddTest().then('it should render QuerySuspense with the query state', () => {
      expect(getQuerySuspense().exists()).toBe(true)
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('error')).toBe(null)
      expect(getQuerySuspense().props('isEmpty')).toBe(false)
      expect(getQuerySuspense().props('emptyStateMessage')).toBe(EMPTY_STATE_MESSAGE)
    })

    BddTest().then('it should render the alert details table', () => {
      expect(getTable().exists()).toBe(true)
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should configure the table columns', () => {
      expect(getTable().props('columns')).toEqual([
        {
          key: 'label',
          label: 'Propriété',
          width: '10%',
        },
        {
          key: 'value',
          label: 'Valeur',
          width: '90%',
        },
      ])
    })

    BddTest().then('it should display the alert details in the table rows', () => {
      expect(getTable().props('rows')).toEqual([
        {
          id: 'active',
          label: 'Statut',
          value: String(mockedAlertConfigurationDTO.active ?? false),
        },
        {
          id: 'period',
          label: 'Période',
          value: `${fromInstant(mockedAlertConfigurationDTO.startDate)} - ${fromInstant(mockedAlertConfigurationDTO.endDate)}`,
        },
        {
          id: 'render',
          label: 'Rendu',
          value: mockedAlertConfigurationDTO.message,
        },
      ])
    })

    BddTest().then('it should render the active badge', () => {
      expect(getActiveBadge().exists()).toBe(true)
      expect(getActiveBadge().props('active')).toBe(!!mockedAlertConfigurationDTO.active)
      expect(getActiveBadge().props('labelGender')).toBe('FEMININE')
    })

    BddTest().then('it should render the date period picker in read-only mode', () => {
      expect(getDatePeriodPicker().exists()).toBe(true)
      expect(getDatePeriodPicker().props('type')).toBe('datetime-local')
      expect(getDatePeriodPicker().props('inputFormat')).toBe('dd/MM/yyyy HH:mm')
      expect(getDatePeriodPicker().props('outputFormat')).toBe('dd/MM/yyyy HH:mm')
      expect(getDatePeriodPicker().props('disabled')).toBe(true)
      expect(getDatePeriodPicker().props('showOngoing')).toBe(false)
      expect(getDatePeriodPicker().props('startDate')).toBe(fromInstant(mockedAlertConfigurationDTO.startDate) ?? '')
      expect(getDatePeriodPicker().props('endDate')).toBe(fromInstant(mockedAlertConfigurationDTO.endDate))
    })

    BddTest().then('it should render the alert message in a notice', () => {
      expect(getNotice().exists()).toBe(true)
      expect(getNotice().props('text')).toBe(mockedAlertConfigurationDTO.message)
      expect(getNotice().props('type')).toBe('alert')
    })
  })

  BddTest().when('the alert query fails', () => {
    beforeEach(async () => {
      server.use(getAlertConfigErrorHandler)
      await mountView()
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('error')).toBeTruthy()
    })

    BddTest().then('it should not render the alert details table', () => {
      expect(getTable().exists()).toBe(false)
    })
  })
})
