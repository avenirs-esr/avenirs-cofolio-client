import { type DeclaredProgramViewDTO, EProgramStatus } from '@/api/avenir-esr'
import { ValorizedBadgeStub } from '@/common/components/badges/ValorizedBadge/ValorizedBadge.stub'
import { SideMenuStub } from '@/common/components/navigation/SideMenu/SideMenu.stub'
import { CompactCardStub } from '@/features/global/components/cards/CompactCard/CompactCard.stub'
import DeclaredProgramSideMenu, {
  type DeclaredProgramSideMenuProps
} from '@/features/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

BddTest().given('a DeclaredProgramSideMenu component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramSideMenu>>

  const dummyPrograms: DeclaredProgramViewDTO[] = [
    {
      id: 'declared-program-1',
      title: 'Master en Informatique',
      organization: 'Université de Paris',
      status: EProgramStatus.COMPLETED,
      valorized: true
    },
    {
      id: 'declared-program-2',
      title: 'Licence Pro Développement Web',
      organization: 'IUT de Lyon',
      status: EProgramStatus.IN_PROGRESS,
      valorized: false
    },
    {
      id: 'declared-program-3',
      title: 'BTS SIO',
      organization: 'Lycée Technique de Marseille',
      status: EProgramStatus.COMPLETED,
      valorized: false
    }
  ]

  const props: DeclaredProgramSideMenuProps = {
    programs: dummyPrograms,
    selectedProgramId: 'declared-program-2',
    countPrograms: 5
  }

  const stubs = {
    SideMenu: SideMenuStub,
    AvIconText: AvIconTextStub,
    AvButton: AvButtonStub,
    CompactCard: CompactCardStub,
    ValorizedBadge: ValorizedBadgeStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramSideMenu, { props, global: { stubs } })
    })

    BddTest().then('it should render the side menu with the correct number of programs', () => {
      const sideMenu = wrapper.findComponent(SideMenuStub)
      expect(sideMenu.exists()).toBe(true)

      const programItems = sideMenu.findAllComponents(CompactCardStub)
      expect(programItems.length).toBe(dummyPrograms.length)
    })

    BddTest().then('it should render the title with count when not collapsed', () => {
      const title = wrapper.find('span.s2-bold')
      expect(title.exists()).toBe(true)
      expect(title.text()).toContain('Toutes mes formations déclarées')
      expect(title.text()).toContain('(5)')
    })

    BddTest().then('it should not render the AvIconText', () => {
      const iconText = wrapper.findComponent(AvIconTextStub)
      expect(iconText.exists()).toBe(false)
    })

    BddTest().then('it should render the ValorizedBadge only for valorized programs', () => {
      const programItems = wrapper.findAllComponents(CompactCardStub)

      expect(programItems[0].findComponent(ValorizedBadgeStub).exists()).toBe(true)
      expect(programItems[0].findComponent(ValorizedBadgeStub).props('valorized')).toBe(true)

      expect(programItems[1].findComponent(ValorizedBadgeStub).exists()).toBe(false)
      expect(programItems[2].findComponent(ValorizedBadgeStub).exists()).toBe(false)
    })

    BddTest().then('it should highlight the selected program', () => {
      const selectedItem = wrapper.find('a[role="button"][aria-pressed="true"]')
      expect(selectedItem.exists()).toBe(true)
      expect(selectedItem.classes()).toContain('declared-program-side-menu__program--selected')
    })

    BddTest().and('a program is clicked', () => {
      beforeEach(async () => {
        const programItems = wrapper.findAll('a[role="button"]')
        await programItems[0].trigger('click')
      })

      BddTest().then('it should emit selectProgram event', () => {
        expect(wrapper.emitted('selectProgram')).toBeTruthy()
        expect(wrapper.emitted('selectProgram')?.[0]).toEqual(['declared-program-1'])
      })
    })

    BddTest().and('a keyboard enter is pressed on a program', () => {
      beforeEach(async () => {
        const programItems = wrapper.findAll('a[role="button"]')
        await programItems[2].trigger('keydown.enter')
      })

      BddTest().then('it should emit selectProgram event', () => {
        expect(wrapper.emitted('selectProgram')).toBeTruthy()
        expect(wrapper.emitted('selectProgram')?.[0]).toEqual(['declared-program-3'])
      })
    })

    BddTest().and('a keyboard space is pressed on a program', () => {
      beforeEach(async () => {
        const programItems = wrapper.findAll('a[role="button"]')
        await programItems[2].trigger('keydown.space')
      })

      BddTest().then('it should emit selectProgram event', () => {
        expect(wrapper.emitted('selectProgram')).toBeTruthy()
        expect(wrapper.emitted('selectProgram')?.[0]).toEqual(['declared-program-3'])
      })
    })

    BddTest().and('the side menu is collapsed', () => {
      beforeEach(async () => {
        wrapper.findComponent(SideMenuStub).vm.$emit('update:collapsed', true)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the collapsed state', () => {
        const sideMenu = wrapper.findComponent(SideMenuStub)
        expect(sideMenu.props('collapsed')).toBe(true)
      })
    })
  })
})
