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

const EMPTY_STATE_MESSAGE = 'Aucune alerte globale configurée.'

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
      expect(getButton().props()).toMatchObject({
        to: ROUTES.GLOBAL_ALERT.UPDATE,
        label: 'Modifier',
      })
    })

    BddTest().then('it should render QuerySuspense with the query state', () => {
      expect(getQuerySuspense().props()).toMatchObject({
        isLoading: false,
        error: null,
        isEmpty: false,
        emptyStateMessage: EMPTY_STATE_MESSAGE,
      })
    })

    BddTest().then('it should render the alert details table', () => {
      expect(getTable().exists()).toBe(true)
      expect(getTable().props('rowKey')).toBe('id')
    })

    BddTest().then('it should configure the table columns', () => {
      expect(getTable().props('columns')).toEqual([
        {
          key: 'label',
          label: 'Libellé',
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
          label: 'Message',
          value: mockedAlertConfigurationDTO.message,
        },
      ])
    })

    BddTest().then('it should render the active badge', () => {
      expect(getActiveBadge().props()).toMatchObject({
        active: mockedAlertConfigurationDTO.active,
        labelGender: 'FEMININE',
      })
    })

    BddTest().then('it should render the date period picker in read-only mode', () => {
      expect(getDatePeriodPicker().props()).toMatchObject({
        type: 'datetime-local',
        inputFormat: 'dd/MM/yyyy HH:mm',
        outputFormat: 'dd/MM/yyyy HH:mm',
        disabled: true,
        showOngoing: false,
        startDate: fromInstant(mockedAlertConfigurationDTO.startDate),
        endDate: fromInstant(mockedAlertConfigurationDTO.endDate),
      })
    })

    BddTest().then('it should render the alert message in a notice', () => {
      expect(getNotice().props()).toMatchObject({
        title: mockedAlertConfigurationDTO.message,
        type: 'alert',
      })
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
