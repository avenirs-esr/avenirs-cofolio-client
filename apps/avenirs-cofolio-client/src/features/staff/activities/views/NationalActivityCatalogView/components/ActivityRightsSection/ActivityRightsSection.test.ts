import type { AvAutocompleteOption } from '@avenirs-esr/avenirs-dsav'
import type { VueWrapper } from '@vue/test-utils'
import type { PagedResponseExternalUserAffiliationOverviewDTO } from '@/api/avenir-esr'
import { BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from '@avenirs-esr/shared/test-utils/unit'
import { flushPromises } from '@vue/test-utils'
import { http, HttpResponse } from 'msw'
import { beforeEach, expect, vi } from 'vitest'
import { generateExternalUserAffiliationOverviewDTOs } from '@/__mocks__/fixtures/staffs/affiliations.fixtures'
import { getAffiliationsErrorHandler } from '@/__mocks__/msw/handlers/staffs/affiliations.handlers'
import { server } from '@/__mocks__/msw/server'
import { EUserCategory, getGetAffiliationsUrl } from '@/api/avenir-esr'
import { IconTitleCardContainerStub } from '@/common/components/cards/IconTitleCardContainer/IconTitleCardContainer.stub'
import { QuerySuspenseStub } from '@/common/components/feedback/QuerySuspense/QuerySuspense.stub'
import { AutocompleteStub } from '@/common/components/interaction/selects/Autocomplete/Autocomplete.stub'
import ActivityRightsSection
  from '@/features/staff/activities/views/NationalActivityCatalogView/components/ActivityRightsSection/ActivityRightsSection.vue'
import { UserInfoStub } from '@/features/staff/admin/components/base/UserInfo/UserInfo.stub'
import { DeleteOverlayStub } from '@/features/student/global/components/interaction/DeleteOverlay/DeleteOverlay.stub'

BddTest().given('an ActivityRightsSection component', () => {
  let wrapper: VueWrapper<InstanceType<typeof ActivityRightsSection>>
  let requestedSearchParams: URLSearchParams[]

  const users = generateExternalUserAffiliationOverviewDTOs(3).map((user, index) => ({
    ...user,
    firstName: ['ALICE', 'BOB', 'CHARLIE'][index]!,
    lastName: ['DUPONT', 'MARTIN', 'DURAND'][index]!,
  }))
  const [aliceWithPicture, bobWithoutPicture] = users as [typeof users[number], typeof users[number]]

  const stubs = {
    Autocomplete: AutocompleteStub,
    DeleteOverlay: DeleteOverlayStub,
    IconTitleCardContainer: IconTitleCardContainerStub,
    QuerySuspense: QuerySuspenseStub,
    UserInfo: UserInfoStub,
  }

  const getAffiliationsSuccessHandler = http.get(`*${getGetAffiliationsUrl()}`, ({ request }) => {
    requestedSearchParams.push(new URL(request.url).searchParams)

    return HttpResponse.json<PagedResponseExternalUserAffiliationOverviewDTO>({
      data: users,
      page: { pageSize: users.length, totalElements: users.length, totalPages: 1, page: 0 },
    })
  })

  const toOption = (user: typeof users[number]): AvAutocompleteOption => ({
    value: user.id,
    label: `${user.firstName[0]}${user.firstName.slice(1).toLowerCase()} ${user.lastName[0]}${user.lastName.slice(1).toLowerCase()}`,
    description: user.email,
  })

  const getCardContainer = () => wrapper.findComponent(IconTitleCardContainerStub)
  const getQuerySuspense = () => wrapper.findComponent(QuerySuspenseStub)
  const getAutocomplete = () => wrapper.findComponent(AutocompleteStub)
  const getSelectedUsersContainer = () => wrapper.find('[data-testid="activity-rights-selected-users"]')
  const getSelectedUserInfos = () => wrapper.findAllComponents(UserInfoStub)
  const getDeleteOverlays = () => wrapper.findAllComponents(DeleteOverlayStub)

  const mountSection = async () => {
    wrapper = mountComponent(ActivityRightsSection, { global: { stubs } })
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
    server.use(getAffiliationsSuccessHandler)
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

    BddTest().then('it should request staff affiliations without keyword', () => {
      expect(requestedSearchParams[0]?.getAll('categories')).toEqual([EUserCategory.STAFF])
      expect(requestedSearchParams[0]?.has('keyword')).toBe(false)
    })

    BddTest().then('it should map the affiliations to autocomplete options', () => {
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

    BddTest().then('it should request the affiliations with the debounced keyword', async () => {
      await vi.waitFor(() => {
        expect(requestedSearchParams.at(-1)?.get('keyword')).toBe('ali')
      })
      expect(requestedSearchParams.at(-1)?.getAll('categories')).toEqual([EUserCategory.STAFF])
    })
  })

  BddTest().when('users are selected', () => {
    beforeEach(async () => {
      await mountSection()
      await selectUsers([toOption(aliceWithPicture), toOption(bobWithoutPicture)])
    })

    BddTest().then('it should render the selected users section with the selection count', () => {
      expect(getSelectedUsersContainer().exists()).toBe(true)
      expect(getSelectedUsersContainer().text()).toContain('Mes éléments sélectionnés (2)')
    })

    BddTest().then('it should render one UserInfo per selected user', () => {
      expect(getSelectedUserInfos().map(userInfo => userInfo.props('user').id)).toEqual([
        aliceWithPicture.id,
        bobWithoutPicture.id,
      ])
    })

    BddTest().then('it should pass the profile picture id of the known users to UserInfo', () => {
      const [aliceInfo, bobInfo] = getSelectedUserInfos()

      expect(aliceInfo!.props('user').profilePictureId).toBe(aliceWithPicture.profilePictureId)
      expect(bobInfo!.props('user').profilePictureId).toBeUndefined()
    })

    BddTest().then('it should render a delete overlay for each selected user', () => {
      expect(getDeleteOverlays()).toHaveLength(2)
    })

    BddTest().and('the delete button of a user is clicked', () => {
      beforeEach(async () => {
        await getDeleteOverlays()[0]!.find('button').trigger('click')
      })

      BddTest().then('it should remove only this user from the selection', () => {
        expect(getSelectedUserInfos().map(userInfo => userInfo.props('user').id)).toEqual([bobWithoutPicture.id])
      })
    })

    BddTest().and('the last selected user is removed', () => {
      beforeEach(async () => {
        await getDeleteOverlays()[0]!.find('button').trigger('click')
        await getDeleteOverlays()[0]!.find('button').trigger('click')
      })

      BddTest().then('it should hide the selected users section', () => {
        expect(getSelectedUsersContainer().exists()).toBe(false)
      })
    })
  })

  BddTest().when('a selected user is not part of the fetched affiliations anymore', () => {
    const unknownOption: AvAutocompleteOption = {
      value: 'unknown-user',
      label: 'Jane Van Doe',
      description: 'jane.doe@example.com',
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
        email: 'jane.doe@example.com',
      })
    })
  })

  BddTest().when('the affiliations request fails', () => {
    beforeEach(async () => {
      server.use(getAffiliationsErrorHandler)
      wrapper = mountComponent(ActivityRightsSection, { global: { stubs } })
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
