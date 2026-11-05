import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { PagedResponseStaffCandidateDTO, StaffCandidateDTO } from '@avenirs-esr/shared/api/avenir-esr'
import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, AvIconStub, AvSelectStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { ConfirmationModalStub, ErrorCodes, FormCancelConfirmButtonsStub, HttpStatusCode, QuerySuspenseStub } from '@avenirs-esr/shared'
import { EActivityRight, EActivityStatus, EAuthorization } from '@avenirs-esr/shared/api/avenir-esr'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { ACTIVITY_WITH_AUTHORIZATIONS_ID, mockedActivityAuthorizations } from '@/__mocks__/fixtures/staffs/activities.fixtures'
import { server } from '@/__mocks__/msw/server'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { AutocompleteStub } from '@/common/components/interaction/selects/Autocomplete/Autocomplete.stub'
import ActivityRightsSection
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityRightsSection/ActivityRightsSection.vue'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import { AuthorizationTypeBadgeStub } from '@/features/staff/admin/views/InstitutionUserDetailedView/components/badges/AuthorizationTypeBadge/AuthorizationTypeBadge.stub'
import { DeleteOverlayStub } from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.stub'

const mockIsMobile = ref(false)
const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async () => {
  const actual = await vi.importActual<typeof import('@/store')>('@/store')
  return {
    ...actual,
    useToasterStore: vi.fn(() => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage,
    })),
  }
})

vi.mock('@avenirs-esr/avenirs-dsav', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@avenirs-esr/avenirs-dsav')>()
  return {
    ...actual,
    useAvBreakpoints: () => ({ isMobile: mockIsMobile }),
  }
})

BddTest().given('an ActivityRightsSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityRightsSection>>
  let requestedSearchParams: URLSearchParams[]

  beforeEach(() => {
    mockIsMobile.value = false
  })

  const users: StaffCandidateDTO[] = [
    { id: 'app-user-0', firstName: 'Alice', lastName: 'Dupont', email: 'alice.dupont@test.fr' },
    { id: 'app-user-1', firstName: 'Bob', lastName: 'Martin', email: 'bob.martin@test.fr' },
    { id: 'app-user-2', firstName: 'Charlie', lastName: 'Durand', email: 'charlie.durand@test.fr' },
  ]
  const [alice, bob] = users as [typeof users[number], typeof users[number]]

  const stubs = {
    AvButton: AvButtonStub,
    AvIcon: AvIconStub,
    AvSelect: AvSelectStub,
    AuthorizationTypeBadge: AuthorizationTypeBadgeStub,
    ConfirmationModal: ConfirmationModalStub,
    DeleteOverlay: DeleteOverlayStub,
    FormCancelConfirmButtons: FormCancelConfirmButtonsStub,
    Autocomplete: AutocompleteStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    QuerySuspense: QuerySuspenseStub,
    UserInfo: UserInfoStub,
  }

  const defaultProps = { activityId: 'activity-1', status: EActivityStatus.PUBLISHED, canEdit: true }

  const candidatesUrl = '*/me/activities/:activityStatus/:activityId/authorizations/candidates'

  const getCandidatesSuccessHandler = http.get(candidatesUrl, ({ request }) => {
    requestedSearchParams.push(new URL(request.url).searchParams)

    return HttpResponse.json<PagedResponseStaffCandidateDTO>({
      data: users,
      page: { pageSize: users.length, totalElements: users.length, totalPages: 1, page: 0 },
    })
  })

  const getCandidatesErrorHandler = http.get(candidatesUrl, () => HttpResponse.json(
    { message: 'Erreur interne du serveur', code: ErrorCodes.UNEXPECTED_ERROR },
    { status: HttpStatusCode.INTERNAL_SERVER_ERROR },
  ))

  const toOption = (user: typeof users[number]): AvAutocompleteOption => ({
    value: user.id,
    label: `${user.firstName} ${user.lastName}`,
    description: user.email,
  })

  const getCardContainer = () => wrapper.findComponent(IconTitleCardContainerStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getAutocomplete = () => wrapper.findComponent(AutocompleteStub)
  const getScrollableList = () => wrapper.find('.activity-rights-section__list--scrollable')
  const getSelectedUsersContainer = () => wrapper.find('[data-testid="activity-rights-selected-users"]')
  const getSelectedUserInfos = () => wrapper.findAllComponents(UserInfoStub)
  const getRemoveButtons = () => wrapper.findAll('[data-testid="delete-overlay-stub"] > button')
  const getEditButton = () => wrapper.find('[data-testid="activity-rights-edit-button"]')
  const getFormButtons = () => wrapper.findComponent(FormCancelConfirmButtonsStub)
  const getReadOnlyRows = () => wrapper.findAll('[data-testid="activity-rights-readonly-row"]')
  const getAuthorizationSelects = () => wrapper.findAllComponents(AvSelectStub)
  const getSelectedAuthorizationIcons = () => wrapper.findAllComponents(AvIconStub)

  const mountReadOnlySection = async (props: Partial<typeof defaultProps> = {}) => {
    wrapper = mountComponent(ActivityRightsSection, { props: { ...defaultProps, ...props }, global: { stubs } })
    await flushPromises()
    await vi.waitFor(() => expect(getQuerySuspense().props('isLoading')).toBe(false))
  }

  const mountSection = async (props: Partial<typeof defaultProps> = {}) => {
    await mountReadOnlySection(props)
    await getEditButton().trigger('click')
    await flushPromises()
    await vi.waitFor(() => expect(getAutocomplete().props('options')).toHaveLength(users.length))
  }

  const selectUsers = async (options: AvAutocompleteOption[]) => {
    getAutocomplete().vm.$emit('update:modelValue', options)
    await flushPromises()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    requestedSearchParams = []
    server.use(getCandidatesSuccessHandler)
  })

  BddTest().when('mounted in read-only mode', () => {
    BddTest().then('it should list the users having rights with their authorization badges and no form', async () => {
      await mountReadOnlySection({ activityId: ACTIVITY_WITH_AUTHORIZATIONS_ID })
      expect(getReadOnlyRows()).toHaveLength(mockedActivityAuthorizations.length)
      expect(wrapper.findAllComponents(UserInfoStub)[0]!.props('user')).toMatchObject({ id: mockedActivityAuthorizations[0]!.staff.id })
      expect(wrapper.findAllComponents(AuthorizationTypeBadgeStub)).toHaveLength(mockedActivityAuthorizations[0]!.rights.length)
      expect(getAutocomplete().exists()).toBe(false)
      expect(getFormButtons().exists()).toBe(false)
    })

    BddTest().then('it should display the empty state when nobody has rights', async () => {
      await mountReadOnlySection()
      expect(getQuerySuspense().props('isEmpty')).toBe(true)
      expect(getQuerySuspense().props('emptyStateMessage')).toBe('Aucune personne n\'a de droits sur cette activité.')
    })

    BddTest().then('it should display the edit button when canEdit is true', async () => {
      await mountReadOnlySection()
      expect(getEditButton().exists()).toBe(true)
    })

    BddTest().then('it should disable the edit button when canEdit is false', async () => {
      await mountReadOnlySection({ canEdit: false })
      expect(getEditButton().exists()).toBe(true)
      expect(getEditButton().attributes('disabled')).toBeDefined()
    })

    BddTest().then('it should not fetch affiliations until the edit mode is opened', async () => {
      await mountReadOnlySection()
      expect(requestedSearchParams).toHaveLength(0)
    })
  })

  BddTest().when('the edit mode is opened without any change', () => {
    BddTest().then('it should disable the save', async () => {
      await mountSection({ activityId: ACTIVITY_WITH_AUTHORIZATIONS_ID })
      expect(getFormButtons().props('isFormValid')).toBe(false)
    })
  })

  BddTest().when('a user is added in the edit mode', () => {
    BddTest().then('it should enable the save and report the pending changes', async () => {
      await mountSection({ activityId: ACTIVITY_WITH_AUTHORIZATIONS_ID })
      await selectUsers([...getAutocomplete().props('modelValue') as AvAutocompleteOption[], toOption(alice)])
      expect(getFormButtons().props('isFormValid')).toBe(true)
      expect(wrapper.emitted('dirtyChange')?.at(-1)).toEqual([true])
    })

    BddTest().then('it should ask for confirmation before cancelling and keep editing when refused', async () => {
      await mountSection({ activityId: ACTIVITY_WITH_AUTHORIZATIONS_ID })
      await selectUsers([...getAutocomplete().props('modelValue') as AvAutocompleteOption[], toOption(alice)])
      getFormButtons().vm.$emit('cancel')
      await flushPromises()
      const modal = wrapper.findComponent(ConfirmationModalStub)
      expect(modal.props('opened')).toBe(true)
      modal.vm.$emit('close')
      await flushPromises()
      expect(getAutocomplete().exists()).toBe(true)
    })

    BddTest().then('it should leave the edit mode when the cancellation is confirmed', async () => {
      await mountSection({ activityId: ACTIVITY_WITH_AUTHORIZATIONS_ID })
      await selectUsers([...getAutocomplete().props('modelValue') as AvAutocompleteOption[], toOption(alice)])
      getFormButtons().vm.$emit('cancel')
      await flushPromises()
      wrapper.findComponent(ConfirmationModalStub).vm.$emit('confirm')
      await flushPromises()
      expect(getAutocomplete().exists()).toBe(false)
    })
  })

  BddTest().when('the edit button is clicked then cancelled', () => {
    BddTest().then('it should come back to the read-only mode and discard the changes', async () => {
      await mountSection({ activityId: ACTIVITY_WITH_AUTHORIZATIONS_ID })
      getFormButtons().vm.$emit('cancel')
      await flushPromises()
      expect(getAutocomplete().exists()).toBe(false)
      expect(getReadOnlyRows()).toHaveLength(mockedActivityAuthorizations.length)
      expect(getEditButton().exists()).toBe(true)
    })
  })

  BddTest().when('mounted', () => {
    beforeEach(async () => {
      await mountSection()
    })

    BddTest().then('it should render the section card with the expected title', () => {
      expect(wrapper.find('[data-testid="activity-rights-section"]').exists()).toBe(true)
      expect(getCardContainer().props('title')).toBe('Gestion des droits')
    })

    BddTest().then('it should render QuerySuspense without error and keeping its content while fetching', () => {
      expect(getQuerySuspense().props('error')).toBeNull()
      expect(getQuerySuspense().props('isLoading')).toBe(false)
      expect(getQuerySuspense().props('preserveContent')).toBe(true)
      expect(getQuerySuspense().props('errorTitle')).toBe('Impossible de rechercher les utilisateurs')
    })

    BddTest().then('it should configure the autocomplete as a server side filtered multi select', () => {
      const autocomplete = getAutocomplete()

      expect(autocomplete.props('multiSelect')).toBe(true)
      expect(autocomplete.props('serverSideFiltering')).toBe(true)
      expect(autocomplete.props('showSelectedSection')).toBe(false)
      expect(autocomplete.props('displaySelectionInInput')).toBe(false)
      expect(autocomplete.props('inputOptions')).toEqual({
        label: 'Chercher un utilisateur',
        placeholder: 'Rechercher par nom ou email',
      })
    })

    BddTest().then('it should request the authorization candidates without keyword', () => {
      expect(requestedSearchParams[0]?.has('keyword')).toBe(false)
    })

    BddTest().then('it should map the candidates to autocomplete options', () => {
      expect(getAutocomplete().props('options')).toEqual(users.map(toOption))
    })

    BddTest().then('it should not render the selected users section', () => {
      expect(getSelectedUsersContainer().exists()).toBe(false)
    })
  })

  BddTest().when('the user types in the search input', () => {
    beforeEach(async () => {
      await mountSection()
      requestedSearchParams = []
      getAutocomplete().vm.$emit('update:search', 'ali')
      await flushPromises()
    })

    BddTest().then('it should request the candidates with the debounced keyword', async () => {
      await vi.waitFor(() => {
        expect(requestedSearchParams.at(-1)?.get('keyword')).toBe('ali')
      })
    })
  })

  BddTest().when('users are selected', () => {
    beforeEach(async () => {
      await mountSection()
      await selectUsers([toOption(alice), toOption(bob)])
    })

    BddTest().then('it should render the selected users section with the selection count', () => {
      expect(getSelectedUsersContainer().exists()).toBe(true)
      expect(getSelectedUsersContainer().text()).toContain('Mes éléments sélectionnés (2)')
    })

    BddTest().then('it should render one UserInfo per selected user', () => {
      expect(getSelectedUserInfos().map(userInfo => userInfo.props('user').id)).toEqual([
        alice.id,
        bob.id,
      ])
    })

    BddTest().then('it should render a remove button and an authorizations select for each selected user', () => {
      expect(getRemoveButtons()).toHaveLength(2)
      expect(getAuthorizationSelects()).toHaveLength(2)
    })

    BddTest().and('the delete button of a user is clicked', () => {
      beforeEach(async () => {
        await getRemoveButtons()[0]!.trigger('click')
      })

      BddTest().then('it should remove only this user from the selection', () => {
        expect(getSelectedUserInfos().map(userInfo => userInfo.props('user').id)).toEqual([bob.id])
      })
    })

    BddTest().and('the last selected user is removed', () => {
      beforeEach(async () => {
        await getRemoveButtons()[0]!.trigger('click')
        await getRemoveButtons()[0]!.trigger('click')
      })

      BddTest().then('it should hide the selected users section', () => {
        expect(getSelectedUsersContainer().exists()).toBe(false)
      })
    })
  })

  BddTest().when('users are selected on a mobile viewport', () => {
    beforeEach(async () => {
      mockIsMobile.value = true
      await mountSection()
      await selectUsers([toOption(alice)])
    })

    BddTest().then('it should not cap the list height', () => {
      expect(getScrollableList().exists()).toBe(false)
    })
  })

  BddTest().when('users are selected on a desktop viewport', () => {
    beforeEach(async () => {
      await mountSection()
      await selectUsers([toOption(alice)])
    })

    BddTest().then('it should render a scrollable list', () => {
      expect(getScrollableList().exists()).toBe(true)
    })
  })

  BddTest().when('the activity already has authorizations', () => {
    beforeEach(async () => {
      await mountSection({ activityId: ACTIVITY_WITH_AUTHORIZATIONS_ID })
      await vi.waitFor(() => expect(getSelectedUserInfos()).toHaveLength(mockedActivityAuthorizations.length))
    })

    BddTest().then('it should prefill the selected users', () => {
      expect(getSelectedUserInfos().map(userInfo => userInfo.props('user').id)).toEqual(
        mockedActivityAuthorizations.map(({ staff }) => staff.id),
      )
    })

    BddTest().then('it should prefill the authorizations select with the existing rights', () => {
      expect(getAuthorizationSelects()[0]!.props('modelValue')).toEqual([
        expect.objectContaining({ value: EAuthorization.EDIT }),
        expect.objectContaining({ value: EAuthorization.EVALUATION }),
      ])
    })

    BddTest().then('it should display one icon per existing right', () => {
      expect(getSelectedAuthorizationIcons()).toHaveLength(2)
    })
  })

  BddTest().when('authorizations are selected for a user', () => {
    beforeEach(async () => {
      await mountSection()
      await selectUsers([toOption(alice)])
    })

    BddTest().then('it should not display any icon while nothing is selected', () => {
      expect(getSelectedAuthorizationIcons()).toHaveLength(0)
    })

    BddTest().and('an authorization is picked in the select', () => {
      beforeEach(async () => {
        getAuthorizationSelects()[0]!.vm.$emit('update:modelValue', [{ value: EAuthorization.EDIT, label: 'Éditeur' }])
        await flushPromises()
      })

      BddTest().then('it should display the matching authorization icon in blue', () => {
        expect(getSelectedAuthorizationIcons()).toHaveLength(1)
        expect(getSelectedAuthorizationIcons()[0]!.props('color')).toBe('var(--dark-background-primary1)')
      })

      BddTest().then('it should pass the selected count to the select', () => {
        expect(getAuthorizationSelects()[0]!.props('selectedText')).toBe('1 autorisation sélectionnée')
      })
    })
  })

  BddTest().when('the save button is clicked', () => {
    let savedBody: unknown

    const captureSavedBody = async ({ request }: { request: Request }) => {
      if (request.method === 'PUT') {
        savedBody = await request.clone().json()
      }
    }

    beforeEach(async () => {
      savedBody = undefined
      server.events.on('request:start', captureSavedBody)
      await mountSection()
      await selectUsers([toOption(alice)])
      getAuthorizationSelects()[0]!.vm.$emit('update:modelValue', [{ value: EAuthorization.EDIT, label: 'Éditeur' }])
      await flushPromises()
      getFormButtons().vm.$emit('submit')
      await flushPromises()
      await vi.waitFor(() => expect(savedBody).toBeDefined())
      await flushPromises()
    })

    afterEach(() => {
      server.events.removeListener('request:start', captureSavedBody)
    })

    BddTest().then('it should go back to the read-only mode', () => {
      expect(getFormButtons().exists()).toBe(false)
      expect(getAutocomplete().exists()).toBe(false)
    })

    BddTest().then('it should send the staff rights to the API', () => {
      expect(savedBody).toEqual({ authorizations: [{ staffId: alice.id, rights: [EActivityRight.EDIT] }] })
    })

    BddTest().then('it should call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).toHaveBeenCalledWith('Autorisations enregistrées')
      expect(mockAddErrorMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('the save request fails', () => {
    beforeEach(async () => {
      await mountSection({ activityId: 'INVALID_ID' })
      await selectUsers([toOption(alice)])
      getFormButtons().vm.$emit('submit')
      await flushPromises()
      await flushPromises()
    })

    BddTest().then('it should call addErrorMessage with the correct title', () => {
      expect(mockAddErrorMessage).toHaveBeenCalledWith(
        expect.objectContaining({ title: 'Impossible d\'enregistrer les autorisations' }),
      )
    })

    BddTest().then('it should not call addSuccessMessage', () => {
      expect(mockAddSuccessMessage).not.toHaveBeenCalled()
    })
  })

  BddTest().when('a selected user is not part of the fetched candidates anymore', () => {
    const unknownOption: AvAutocompleteOption = {
      value: 'unknown-user',
      label: 'Jane Van Doe',
    }

    beforeEach(async () => {
      await mountSection()
      await selectUsers([unknownOption])
    })

    BddTest().then('it should fallback to the autocomplete option to build the user', () => {
      expect(getSelectedUserInfos()[0]!.props('user')).toEqual({
        id: 'unknown-user',
        firstName: 'Jane',
        lastName: 'Van Doe',
        email: '',
      })
    })
  })

  BddTest().when('the candidates request fails', () => {
    beforeEach(async () => {
      server.use(getCandidatesErrorHandler)
      wrapper = mountComponent(ActivityRightsSection, { props: defaultProps, global: { stubs } })
      await flushPromises()
      await vi.waitFor(() => expect(getQuerySuspense().props('isLoading')).toBe(false))
      await getEditButton().trigger('click')
      await flushPromises()
      await vi.waitFor(() => expect(getQuerySuspense().props('error')).toBeTruthy())
    })

    BddTest().then('it should pass the error to QuerySuspense', () => {
      expect(getQuerySuspense().props('errorTitle')).toBe('Impossible de rechercher les utilisateurs')
    })

    BddTest().then('it should not render the autocomplete', () => {
      expect(getAutocomplete().exists()).toBe(false)
    })
  })
})
