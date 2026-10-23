import type { NodeDragEvent, NodeMouseEvent, NodeProps } from '@vue-flow/core'

export const HandleStub = defineComponent({
  name: 'Handle',
  props: {
    id: { type: String, required: false },
    position: { type: String, required: true },
    connectable: { type: Boolean, required: true },
  },
  template: '<div class="handle-stub"></div>',
})

function createEventHookMock<T> () {
  let handler: ((event: T) => void) | null = null

  const on = (fn: (event: T) => void) => {
    handler = (event: T) => fn(event)

    return {
      off: () => {
        handler = null
      },
    }
  }

  const trigger = (event: T) => {
    handler?.(event)
  }

  return { on, trigger }
}

export const mandatoryNodeProps: NodeProps = {
  id: 'node-id',
  type: 'custom-type',
  position: { x: 0, y: 0 },
  dimensions: { width: 150, height: 50 },
  dragging: false,
  resizing: false,
  zIndex: 0,
  data: {},
  selected: false,
  connectable: true,
  events: {
    doubleClick: createEventHookMock<NodeMouseEvent>().on,
    click: createEventHookMock<NodeMouseEvent>().on,
    mouseEnter: createEventHookMock<NodeMouseEvent>().on,
    mouseMove: createEventHookMock<NodeMouseEvent>().on,
    mouseLeave: createEventHookMock<NodeMouseEvent>().on,
    contextMenu: createEventHookMock<NodeMouseEvent>().on,
    dragStart: createEventHookMock<NodeDragEvent>().on,
    drag: createEventHookMock<NodeDragEvent>().on,
    dragStop: createEventHookMock<NodeDragEvent>().on
  }
}

export const mandatoryNodeTemplateProps = {
  ...mandatoryNodeProps,
  flowId: 'test-flow'
}

export const mandatoryNodeButtonTemplateProps = {
  ...mandatoryNodeTemplateProps,
  label: 'Button Label',
}
