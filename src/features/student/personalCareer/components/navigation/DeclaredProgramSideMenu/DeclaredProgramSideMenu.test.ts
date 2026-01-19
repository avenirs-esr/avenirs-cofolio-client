import type { DeclaredProgramViewDTO } from '@/api/avenir-esr'
import { FloatingIconCardStub } from '@/features/student/global/components/cards/FloatingIconCard/FloatingIconCard.stub'
import { DeclaredProgramCompactCardStub } from '@/features/student/personalCareer/components/cards/DeclaredProgramCompactCard/DeclaredProgramCompactCard.stub'
import DeclaredProgramSideMenu, {
  type DeclaredProgramSideMenuProps
} from '@/features/student/personalCareer/components/navigation/DeclaredProgramSideMenu/DeclaredProgramSideMenu.vue'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { mount, type VueWrapper } from '@vue/test-utils'
import { beforeEach, expect } from 'vitest'

const AvSideMenuStub = defineComponent({
  name: 'AvSideMenu',
  props: ['collapsed', 'collapsedWidth'],
  emits: ['update:collapsed'],
  template: '<div class="av-side-menu-stub"><slot /></div>'
})

BddTest().given('a DeclaredProgramSideMenu component', () => {
  let wrapper: VueWrapper<InstanceType<typeof DeclaredProgramSideMenu>>

  const dummyPrograms: DeclaredProgramViewDTO[] = [
    {
      id: 'declared-program-1',
      title: 'Master en Informatique',
      organization: 'Université de Paris',
      status: 'COMPLETED' as any
    },
    {
      id: 'declared-program-2',
      title: 'Licence Pro Développement Web',
      organization: 'IUT de Lyon',
      status: 'IN_PROGRESS' as any
    },
    {
      id: 'declared-program-3',
      title: 'BTS SIO',
      organization: 'Lycée Technique de Marseille',
      status: 'COMPLETED' as any
    }
  ]

  const props: DeclaredProgramSideMenuProps = {
    programs: dummyPrograms,
    selectedProgramId: 'declared-program-2',
    countPrograms: 5
  }

  const stubs = {
    AvSideMenu: AvSideMenuStub,
    AvIconText: AvIconTextStub,
    AvButton: AvButtonStub,
    FloatingIconCard: FloatingIconCardStub,
    DeclaredProgramCompactCard: DeclaredProgramCompactCardStub
  }

  BddTest().when('the component is mounted', () => {
    beforeEach(() => {
      wrapper = mount(DeclaredProgramSideMenu, { props, global: { stubs } })
    })

    BddTest().then('it should render the side menu with the correct number of programs', () => {
      const sideMenu = wrapper.findComponent(AvSideMenuStub)
      expect(sideMenu.exists()).toBe(true)

      const programItems = sideMenu.findAllComponents(DeclaredProgramCompactCardStub)
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
        wrapper.findComponent(AvSideMenuStub).vm.$emit('update:collapsed', true)
        await wrapper.vm.$nextTick()
      })

      BddTest().then('it should update the collapsed state', () => {
        const sideMenu = wrapper.findComponent(AvSideMenuStub)
        expect(sideMenu.props('collapsed')).toBe(true)
      })

      BddTest().then('it should render the AvIconText', () => {
        const iconText = wrapper.findComponent(AvIconTextStub)
        expect(iconText.exists()).toBe(true)
      })

      BddTest().then('it should highlight the selected program with AvButton variant OUTLINED', () => {
        const selectedItem = wrapper.findAllComponents(AvButtonStub).find(item =>
          item.props('label') === 'Licence Pro Développement Web'
        )
        expect(selectedItem?.props('variant')).toBe('OUTLINED')
      })

      BddTest().and('a program is clicked', () => {
        beforeEach(async () => {
          const programItems = wrapper.findAllComponents(AvButtonStub)
          await programItems[0].trigger('click')
        })

        BddTest().then('it should emit selectProgram event', () => {
          expect(wrapper.emitted('selectProgram')).toBeTruthy()
          expect(wrapper.emitted('selectProgram')?.[0]).toEqual(['declared-program-1'])
        })
      })
    })
  })
})
