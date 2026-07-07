import type { MyPerspectiveCardProps } from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.vue'
import { EDeclaredActivityStatus } from '@/api/avenir-esr'
import { CardStub } from '@/common/components/cards/Card/Card.stub'
import { RichTextEditorStub } from '@/common/components/interaction/inputs/RichTextEditor/RichTextEditor.stub'
import MyPerspectiveCard from '@/features/student/buildProject/views/ProjectActivityDetailedView/components/cards/MyPerspectiveCard/MyPerspectiveCard.vue'
import { UpdateInProgressBadgeStub } from '@/features/student/global/components/badges/UpdateInProgressBadge/UpdateInProgressBadge.stub'
import { AvButtonStub, AvIconTextStub, BddTest } from '@avenirs-esr/avenirs-dsav/test-utils'
import { flushPromises, type VueWrapper } from '@vue/test-utils'
import { mountComponent } from 'tests/utils'
import { beforeEach, expect } from 'vitest'

const mockAddSuccessMessage = vi.fn()
const mockAddErrorMessage = vi.fn()

vi.mock('@/store', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store')>()
  return {
    ...actual,
    useToasterStore: () => ({
      addSuccessMessage: mockAddSuccessMessage,
      addErrorMessage: mockAddErrorMessage
    })
  }
})

BddTest().given('a my perspective card', () => {
  let wrapper: VueWrapper<InstanceType<typeof MyPerspectiveCard>>

  const stubs = {
    AvButton: AvButtonStub,
    Card: CardStub,
    AvIconText: AvIconTextStub,
    RichTextEditor: RichTextEditorStub,
    UpdateInProgressBadge: UpdateInProgressBadgeStub,
  }

  const getContent = () => wrapper.find('[data-testid="my-perspective-card-content"]')
  const getEditButton = () => wrapper.find('[data-testid="my-perspective-card-edit-button"]')
  const getSaveButton = () => wrapper.find('[data-testid="my-perspective-card-save-button"]')
  const getCancelButton = () => wrapper.find('[data-testid="my-perspective-card-cancel-button"]')

  BddTest().when('the component is mounted with a valid activityId and a perspective', () => {
    const props: MyPerspectiveCardProps = {
      activityId: 'activity-1',
      perspective: '<p>This is my perspective</p>',
      activityStatus: EDeclaredActivityStatus.IN_PROGRESS
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(MyPerspectiveCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the perspective card with collapsible', () => {
      const card = wrapper.findComponent(CardStub)
      expect(card.exists()).toBe(true)
      expect(card.props('collapsible')).toBe(true)
    })

    BddTest().then('it should render the title', () => {
      const title = wrapper.findComponent(AvIconTextStub)
      expect(title.exists()).toBe(true)
      expect(title.props('text')).toBe('Ma prise de recul')
    })

    BddTest().then('it should render the edit button', () => {
      const editButton = getEditButton()
      expect(editButton.exists()).toBe(true)
    })

    BddTest().then('it should not render the update in progress badge', () => {
      const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
      expect(badge.exists()).toBe(false)
    })

    BddTest().then('it should not render rich text editor', () => {
      const editor = wrapper.findComponent(RichTextEditorStub)
      expect(editor.exists()).toBe(false)
    })

    BddTest().then('it should render the perspective content', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.html()).toContain(props.perspective)
    })

    BddTest().then('it should not render the save button', () => {
      const saveButton = getSaveButton()
      expect(saveButton.exists()).toBe(false)
    })

    BddTest().then('it should not render the cancel button', () => {
      const cancelButton = getCancelButton()
      expect(cancelButton.exists()).toBe(false)
    })

    BddTest().and('the user clicks the edit button', () => {
      beforeEach(() => {
        const editButton = getEditButton()
        editButton.trigger('click')
      })

      BddTest().then('it should not render the edit button', () => {
        const editButton = getEditButton()
        expect(editButton.exists()).toBe(false)
      })

      BddTest().then('it should render the update in progress badge', () => {
        const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
        expect(badge.exists()).toBe(true)
        expect(badge.props('show')).toBe(true)
      })

      BddTest().then('it should render the rich text editor with the perspective content', () => {
        const editor = wrapper.findComponent(RichTextEditorStub)
        expect(editor.exists()).toBe(true)
        expect(editor.props('modelValue')).toBe(props.perspective)
      })

      BddTest().then('it should not render the save button', () => {
        const saveButton = getSaveButton()
        expect(saveButton.exists()).toBe(false)
      })

      BddTest().then('it should render the cancel button', () => {
        const cancelButton = getCancelButton()
        expect(cancelButton.exists()).toBe(true)
      })

      BddTest().and('the user clicks the cancel button', () => {
        beforeEach(() => {
          const cancelButton = getCancelButton()
          cancelButton.trigger('click')
        })

        BddTest().then('it should render the edit button', () => {
          const editButton = getEditButton()
          expect(editButton.exists()).toBe(true)
        })

        BddTest().then('it should not render the update in progress badge', () => {
          const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
          expect(badge.exists()).toBe(false)
        })

        BddTest().then('it should not render the rich text editor', () => {
          const editor = wrapper.findComponent(RichTextEditorStub)
          expect(editor.exists()).toBe(false)
        })

        BddTest().then('it should render the perspective content', () => {
          const content = getContent()
          expect(content.exists()).toBe(true)
          expect(content.html()).toContain(props.perspective)
        })

        BddTest().then('it should not render the save button', () => {
          const saveButton = getSaveButton()
          expect(saveButton.exists()).toBe(false)
        })

        BddTest().then('it should not render the cancel button', () => {
          const cancelButton = getCancelButton()
          expect(cancelButton.exists()).toBe(false)
        })
      })

      BddTest().and('the user edits the perspective content', () => {
        const newContent = '<p>This is my updated perspective</p>'

        beforeEach(() => {
          vi.useFakeTimers()
          const editor = wrapper.findComponent(RichTextEditorStub)
          editor.vm.$emit('update:modelValue', newContent)
        })

        BddTest().then('the rich text editor model should change', () => {
          const editor = wrapper.findComponent(RichTextEditorStub)
          expect(editor.props('modelValue')).toBe(newContent)
        })

        BddTest().then('it should enable the save button', () => {
          const saveButton = wrapper.findAllComponents(AvButtonStub).find(button => button.attributes('data-testid') === 'my-perspective-card-save-button')
          expect(saveButton?.exists()).toBe(true)
          expect(saveButton!.props('disabled')).toBe(false)
        })

        BddTest().and('the auto save triggers', () => {
          beforeEach(async () => {
            vi.advanceTimersByTime(15000)
            await flushPromises()
          })

          BddTest().then('it should call the addSuccessMessage function', () => {
            expect(mockAddSuccessMessage).toHaveBeenCalled()
          })

          BddTest().then('it should not call the addErrorMessage function', () => {
            expect(mockAddErrorMessage).not.toHaveBeenCalled()
          })

          BddTest().then('it should not render the perspective content', () => {
            const content = getContent()
            expect(content.exists()).toBe(false)
          })

          BddTest().then('it should not render the edit button', () => {
            const editButton = getEditButton()
            expect(editButton.exists()).toBe(false)
          })

          BddTest().then('it should render the update in progress badge', () => {
            const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
            expect(badge.exists()).toBe(true)
            expect(badge.props('show')).toBe(true)
          })

          BddTest().then('it should render the rich text editor with the updated perspective content', () => {
            const editor = wrapper.findComponent(RichTextEditorStub)
            expect(editor.exists()).toBe(true)
            expect(editor.props('modelValue')).toBe(newContent)
          })

          BddTest().then('it should render the save button', () => {
            const saveButton = getSaveButton()
            expect(saveButton.exists()).toBe(true)
          })

          BddTest().then('it should not render the cancel button', () => {
            const cancelButton = getCancelButton()
            expect(cancelButton.exists()).toBe(false)
          })
        })

        BddTest().and('the user clicks the save button', () => {
          beforeEach(async () => {
            const saveButton = getSaveButton()
            saveButton.trigger('click')
            await flushPromises()
          })

          BddTest().then('it should call the addSuccessMessage function', () => {
            expect(mockAddSuccessMessage).toHaveBeenCalled()
          })

          BddTest().then('it should not call the addErrorMessage function', () => {
            expect(mockAddErrorMessage).not.toHaveBeenCalled()
          })

          BddTest().then('it should render the perspective content', () => {
            const content = getContent()
            expect(content.exists()).toBe(true)
          })

          BddTest().then('it should render the edit button', () => {
            const editButton = getEditButton()
            expect(editButton.exists()).toBe(true)
          })

          BddTest().then('it should not render the update in progress badge', () => {
            const badge = wrapper.findComponent(UpdateInProgressBadgeStub)
            expect(badge.exists()).toBe(false)
          })

          BddTest().then('it should not render the rich text editor', () => {
            const editor = wrapper.findComponent(RichTextEditorStub)
            expect(editor.exists()).toBe(false)
          })

          BddTest().then('it should not render the save button', () => {
            const saveButton = getSaveButton()
            expect(saveButton.exists()).toBe(false)
          })

          BddTest().then('it should not render the cancel button', () => {
            const cancelButton = getCancelButton()
            expect(cancelButton.exists()).toBe(false)
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted with a valid activityId and no perspective', () => {
    const props: MyPerspectiveCardProps = {
      activityId: 'activity-1',
      activityStatus: EDeclaredActivityStatus.IN_PROGRESS
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(MyPerspectiveCard, { props, global: { stubs } })
    })

    BddTest().then('it should render an empty perspective content', () => {
      const content = getContent()
      expect(content.exists()).toBe(true)
      expect(content.text()).toBe('')
    })

    BddTest().and('the user clicks the edit button', () => {
      beforeEach(() => {
        const editButton = getEditButton()
        editButton.trigger('click')
      })

      BddTest().then('it should render the rich text editor with default content', () => {
        const editor = wrapper.findComponent(RichTextEditorStub)
        expect(editor.exists()).toBe(true)
        expect(editor.props('modelValue')).toBe('<p></p>')
      })
    })
  })

  BddTest().when('the component is mounted with an invalid activityId', () => {
    const props: MyPerspectiveCardProps = {
      activityId: 'INVALID_ACTIVITY_ID',
      perspective: '<p>This is my perspective</p>',
      activityStatus: EDeclaredActivityStatus.IN_PROGRESS
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(MyPerspectiveCard, { props, global: { stubs } })
    })

    BddTest().and('the user clicks the edit button', () => {
      beforeEach(() => {
        const editButton = getEditButton()
        editButton.trigger('click')
      })

      BddTest().and('the user edits the perspective content', () => {
        const newContent = '<p>This is my updated perspective</p>'

        beforeEach(() => {
          vi.useFakeTimers()
          const editor = wrapper.findComponent(RichTextEditorStub)
          editor.vm.$emit('update:modelValue', newContent)
        })

        BddTest().and('the auto save triggers', () => {
          beforeEach(async () => {
            vi.advanceTimersByTime(15000)
            await flushPromises()
          })

          BddTest().then('it should not call the addSuccessMessage function', () => {
            expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          })

          BddTest().then('it should call the addErrorMessage function', () => {
            expect(mockAddErrorMessage).toHaveBeenCalled()
          })

          BddTest().then('it should still render the rich text editor with the updated perspective content', () => {
            const editor = wrapper.findComponent(RichTextEditorStub)
            expect(editor.exists()).toBe(true)
            expect(editor.props('modelValue')).toBe(newContent)
          })
        })

        BddTest().and('the user clicks the save button', () => {
          beforeEach(async () => {
            const saveButton = getSaveButton()
            saveButton.trigger('click')
            await flushPromises()
          })

          BddTest().then('it should not call the addSuccessMessage function', () => {
            expect(mockAddSuccessMessage).not.toHaveBeenCalled()
          })

          BddTest().then('it should call the addErrorMessage function', () => {
            expect(mockAddErrorMessage).toHaveBeenCalled()
          })

          BddTest().then('it should still render the rich text editor with the updated perspective content', () => {
            const editor = wrapper.findComponent(RichTextEditorStub)
            expect(editor.exists()).toBe(true)
            expect(editor.props('modelValue')).toBe(newContent)
          })
        })
      })
    })
  })

  BddTest().when('the component is mounted with a submitted activity ', () => {
    const props: MyPerspectiveCardProps = {
      activityId: 'activity-1',
      perspective: '<p>This is my perspective</p>',
      activityStatus: EDeclaredActivityStatus.SUBMITTED,
    }

    beforeEach(() => {
      vi.clearAllMocks()
      wrapper = mountComponent(MyPerspectiveCard, { props, global: { stubs } })
    })

    BddTest().then('it should render the edit button as enabled', () => {
      const editButton = getEditButton()
      expect(editButton.exists()).toBe(true)
      expect(editButton.attributes('disabled')).toBeUndefined()
    })
  })
})
