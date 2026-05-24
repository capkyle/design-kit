import { defineComponent, h, ref } from 'vue';

let textControlInstance = 0;

export const TextControl = defineComponent({
  name: 'DesignKitTextControl',
  props: {
    label: { type: String, required: true },
    value: { type: String, required: true },
    placeholder: { type: String, required: false },
  },
  emits: ['change'],
  setup(props, { emit }) {
    const inputId = ref(`design-kit-text-${++textControlInstance}`);

    return () => h('div', { class: 'design-kit-text-control' }, [
      h('label', { class: 'design-kit-text-label', for: inputId.value }, props.label),
      h('input', {
        id: inputId.value,
        type: 'text',
        class: 'design-kit-text-input',
        value: props.value,
        placeholder: props.placeholder,
        onInput: (event: Event) => emit('change', (event.target as HTMLInputElement).value),
      }),
    ]);
  },
});
