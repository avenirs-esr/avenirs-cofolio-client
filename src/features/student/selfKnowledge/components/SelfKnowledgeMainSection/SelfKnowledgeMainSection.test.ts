import type { VueWrapper } from '@vue/test-utils'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect, vi } from 'vitest'
import { mockedProfileOverview } from '@/__mocks__/fixtures/student/overviews.fixtures'
import { mockedSelfKnowledgeCategories } from '@/__mocks__/fixtures/student/self-knowledge.fixtures'
import { selfKnowledgeCategoriesErrorHandler } from '@/__mocks__/msw/handlers/student/self-knowledge.handlers'
import { server } from '@/__mocks__/msw/server'
import { ProfileCardStub } from '@/common/components/cards/ProfileCard/ProfileCard.stub'
import { ManageEntityDropdownStub } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.stub'
import { Action } from '@/common/components/interaction/dropdowns/ManageEntityDropdown/ManageEntityDropdown.types'
import { UpdateProfileDrawerStub } from '@/common/components/overlay/drawers/UpdateProfileDrawer/UpdateProfileDrawer.stub'
import { ICONS } from '@/common/constants'
import { SelfKnowledgeCategoryElementsPaginatorCardStub } from '@/features/student/selfKnowledge/components/cards/SelfKnowledgeCategoryElementsPaginatorCard/SelfKnowledgeCategoryElementsPaginatorCard.stub'
import { AddSelfKnowledgeCategoriesModalStub } from '@/features/student/selfKnowledge/components/modals/AddSelfKnowledgeCategoriesModal/AddSelfKnowledgeCategoriesModal.stub'
import { DeleteSelfKnowledgeCategoriesModalStub } from '@/features/student/selfKnowledge/components/modals/DeleteSelfKnowledgeCategoriesModal/DeleteSelfKnowledgeCategoriesModal.stub'
import SelfKnowledgeMainSection from '@/features/student/selfKnowledge/components/SelfKnowledgeMainSection/SelfKnowledgeMainSection.vue'

const TITLE = 'Me connaître'

const mockProfile = ref(mockedProfileOverview)
const mockIsProfileLoading = ref(false)

vi.mock('@/features/auth/global/composables/use-current-user/use-current-user', () => ({
  useCurrentUser: () => ({
    profile: {
      isLoading: mockIsProfileLoading,
      data: mockProfile
    }
  })
}))

BddTest().given('a self knowledge section component', () => {
  let wrapper: VueWrapper<InstanceType<typeof SelfKnowledgeMainSection>>

  const stubs = {
    AvButton: AvButtonStub,
    AvIconText: AvIconTextStub,
    AddSelfKnowledgeCategoriesModal: AddSelfKnowledgeCategoriesModalStub,
    DeleteSelfKnowledgeCategoriesModal: DeleteSelfKnowledgeCategoriesModalStub,
    ManageEntityDropdown: ManageEntityDropdownStub,
    ProfileCard: ProfileCardStub,
    SelfKnowledgeCategoryElementsPaginatorCard: SelfKnowledgeCategoryElementsPaginatorCardStub,
    UpdateProfileDrawer: UpdateProfileDrawerStub,
  }

  const mountWith = ({ isProfileLoading = false }: { isProfileLoading?: boolean } = {}) => {
    mockIsProfileLoading.value = isProfileLoading

    wrapper = mountComponent(SelfKnowledgeMainSection, { global: { stubs } })
  }

  const getAddModal = () => wrapper.findComponent(AddSelfKnowledgeCategoriesModalStub)
  const getAvIconText = () => wrapper.findComponent(AvIconTextStub)
  const getCategoryCards = () => wrapper.findAllComponents(SelfKnowledgeCategoryElementsPaginatorCardStub)
  const getDropdown = () => wrapper.findComponent(ManageEntityDropdownStub)
  const getProfileCard = () => wrapper.findComponent(ProfileCardStub)
  const getUpdateProfileButton = () => wrapper.find('[data-testid="display-update-profile-drawer-button"]')
  const getUpdateProfileDrawer = () => wrapper.findComponent(UpdateProfileDrawerStub)
  const emitDropdownAdd = () => getDropdown().vm.$emit('actionSelected', Action.ADD)

  BddTest().when('the self knowledge section is mounted', () => {
    beforeEach(() => {
      mountWith()
    })

    BddTest().then('it should render no category cards initially', () => {
      expect(getCategoryCards()).toHaveLength(0)
    })

    BddTest().then('it should render category cards after loading', async () => {
      await vi.waitFor(() => {
        expect(getCategoryCards().length).toBeGreaterThan(0)
      })

      expect(getCategoryCards()).toHaveLength(mockedSelfKnowledgeCategories.length)
    })

    BddTest().then('it should pass correct category props to each card', async () => {
      await vi.waitFor(() => {
        expect(getCategoryCards().length).toBe(mockedSelfKnowledgeCategories.length)
      })

      getCategoryCards().forEach((card, index) => {
        expect(card.props('category')).toEqual(mockedSelfKnowledgeCategories[index])
      })
    })

    BddTest().then('it should render the self knowledge title', () => {
      const avIconText = getAvIconText()

      expect(avIconText.exists()).toBe(true)
      expect(avIconText.props('text')).toBe(TITLE)
      expect(avIconText.props('icon')).toBe(ICONS.SELF_KNOWLEDGE)
    })

    BddTest().then('it should render the profile card', () => {
      expect(getProfileCard().exists()).toBe(true)
    })

    BddTest().then('it should pass correct props to ProfileCard', () => {
      const profileCard = getProfileCard()

      expect(profileCard.props('firstName')).toBe(mockedProfileOverview.firstname)
      expect(profileCard.props('lastName')).toBe(mockedProfileOverview.lastname)
      expect(profileCard.props('profilePictureUrl')).toBe(mockedProfileOverview.profilePicture.url)
      expect(profileCard.props('coverPictureUrl')).toBe(mockedProfileOverview.coverPicture.url)
      expect(profileCard.props('bio')).toBe(mockedProfileOverview.bio)
    })

    BddTest().then('it should render the display update profile drawer button', () => {
      expect(getUpdateProfileButton().exists()).toBe(true)
    })

    BddTest().and('the display update profile drawer button is clicked', () => {
      beforeEach(async () => {
        await getUpdateProfileButton().trigger('click')
      })

      BddTest().then('it should display the update profile drawer', () => {
        const drawer = getUpdateProfileDrawer()

        expect(drawer.exists()).toBe(true)
        expect(drawer.props('show')).toBe(true)
      })
    })

    BddTest().then('it should render the manage categories dropdown', () => {
      expect(getDropdown().exists()).toBe(true)
    })

    BddTest().then('it should render the add self knowledge categories modal in closed state', () => {
      const addModal = getAddModal()

      expect(addModal.exists()).toBe(true)
      expect(addModal.props('opened')).toBe(false)
    })

    BddTest().and('the add button is clicked', () => {
      beforeEach(() => {
        emitDropdownAdd()
      })

      BddTest().then('it should open the add self knowledge categories modal', () => {
        expect(getAddModal().props('opened')).toBe(true)
      })

      BddTest().and('the add self knowledge categories modal emits a cancel event', () => {
        beforeEach(() => {
          getAddModal().vm.$emit('cancel')
        })

        BddTest().then('it should close the add self knowledge categories modal', () => {
          expect(getAddModal().props('opened')).toBe(false)
        })
      })

      BddTest().and('the add self knowledge categories modal emits a confirm event', () => {
        beforeEach(() => {
          getAddModal().vm.$emit('confirm')
        })

        BddTest().then('it should close the add self knowledge categories modal', () => {
          expect(getAddModal().props('opened')).toBe(false)
        })
      })
    })
  })

  BddTest().when('the self knowledge section is mounted while the profile is still loading', () => {
    beforeEach(() => {
      mountWith({ isProfileLoading: true })
    })

    BddTest().then('it should not render the profile card', () => {
      expect(getProfileCard().exists()).toBe(false)
    })

    BddTest().then('it should not render the display update profile drawer button', () => {
      expect(getUpdateProfileButton().exists()).toBe(false)
    })

    BddTest().then('it should still render the title and category cards', async () => {
      expect(getAvIconText().exists()).toBe(true)

      await vi.waitFor(() => {
        expect(getCategoryCards()).toHaveLength(mockedSelfKnowledgeCategories.length)
      })
    })
  })

  BddTest().when('the categories query fails', () => {
    beforeEach(() => {
      server.use(selfKnowledgeCategoriesErrorHandler)
      mountWith()
    })

    BddTest().then('it should not render any category cards', async () => {
      await wrapper.vm.$nextTick()

      expect(getCategoryCards()).toHaveLength(0)
    })

    BddTest().then('it should still render the title and the dropdown', () => {
      expect(getAvIconText().exists()).toBe(true)
    })
  })
})
