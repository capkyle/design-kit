import { Fragment, defineComponent, h, onMounted, onUnmounted, ref, type PropType } from 'vue';
import { AnimatePresence, motion } from 'motion-v';
import { ICON_ADD_PRESET, ICON_CHECK, ICON_CLIPBOARD } from '../../icons';
import { DesignKitStore } from '../../store/DesignKitStore';
import type { ControlMeta, DesignValue, PanelConfig, SpringConfig, TransitionConfig } from '../../store/DesignKitStore';
import { Folder } from './Folder';
import { Slider } from './Slider';
import { Toggle } from './Toggle';
import { SpringControl } from './SpringControl';
import { TransitionControl } from './TransitionControl';
import { TextControl } from './TextControl';
import { SelectControl } from './SelectControl';
import { ColorControl } from './ColorControl';
import { PresetManager } from './PresetManager';
import { useShortcutContext } from './ShortcutListener';
import { ShortcutsMenu } from './ShortcutsMenu';

export const Panel = defineComponent({
  name: 'DesignKitPanel',
  props: {
    panel: {
      type: Object as PropType<PanelConfig>,
      required: true,
    },
    defaultOpen: {
      type: Boolean,
      default: true,
    },
    inline: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const shortcutCtx = useShortcutContext();
    const values = ref<Record<string, DesignValue>>(DesignKitStore.getValues(props.panel.id));
    const presets = ref(DesignKitStore.getPresets(props.panel.id));
    const activePresetId = ref<string | null>(DesignKitStore.getActivePresetId(props.panel.id));
    const copied = ref(false);
    const hasShortcuts = () => Object.keys(DesignKitStore.getPanel(props.panel.id)?.shortcuts ?? {}).length > 0;

    let unsubscribe: (() => void) | undefined;
    let copiedTimeout: ReturnType<typeof window.setTimeout> | null = null;

    onMounted(() => {
      unsubscribe = DesignKitStore.subscribe(props.panel.id, () => {
        values.value = DesignKitStore.getValues(props.panel.id);
        presets.value = DesignKitStore.getPresets(props.panel.id);
        activePresetId.value = DesignKitStore.getActivePresetId(props.panel.id);
      });
    });

    onUnmounted(() => {
      unsubscribe?.();
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
    });

    const handleAddPreset = () => {
      const nextNum = presets.value.length + 2;
      DesignKitStore.savePreset(props.panel.id, `Version ${nextNum}`);
    };

    const handleCopy = () => {
      const json = JSON.stringify(values.value, null, 2);
      const instruction = `Update the useDesignKit configuration for "${props.panel.name}" with these values:\n\n\`\`\`json\n${json}\n\`\`\`\n\nApply these values as the new defaults in the useDesignKit call.`;

      try {
        if (navigator.clipboard?.writeText) {
          void navigator.clipboard.writeText(instruction).catch(() => undefined);
        }
      } catch {
        // Ignore clipboard errors; the UI confirmation should still run.
      }

      copied.value = true;
      if (copiedTimeout) {
        window.clearTimeout(copiedTimeout);
      }
      copiedTimeout = window.setTimeout(() => {
        copied.value = false;
      }, 1500);
    };

    const renderControl = (control: ControlMeta) => {
      const value = values.value[control.path];

      switch (control.type) {
        case 'slider':
          return h(Slider, {
            key: control.path,
            label: control.label,
            value: value as number,
            min: control.min,
            max: control.max,
            step: control.step,
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId.value === props.panel.id && shortcutCtx.activePath.value === control.path,
            onChange: (next: number) => DesignKitStore.updateValue(props.panel.id, control.path, next),
          });
        case 'toggle':
          return h(Toggle, {
            key: control.path,
            label: control.label,
            checked: value as boolean,
            shortcut: control.shortcut,
            shortcutActive: shortcutCtx.activePanelId.value === props.panel.id && shortcutCtx.activePath.value === control.path,
            onChange: (next: boolean) => DesignKitStore.updateValue(props.panel.id, control.path, next),
          });
        case 'spring':
          return h(SpringControl, {
            key: control.path,
            panelId: props.panel.id,
            path: control.path,
            label: control.label,
            spring: value as SpringConfig,
            onChange: (next: SpringConfig) => DesignKitStore.updateValue(props.panel.id, control.path, next),
          });
        case 'transition':
          return h(TransitionControl, {
            key: control.path,
            panelId: props.panel.id,
            path: control.path,
            label: control.label,
            value: value as TransitionConfig,
            onChange: (next: TransitionConfig) => DesignKitStore.updateValue(props.panel.id, control.path, next),
          });
        case 'folder':
          return h(Folder, {
            key: control.path,
            title: control.label,
            defaultOpen: control.defaultOpen ?? true,
          }, {
            default: () => (control.children ?? []).map(renderControl),
          });
        case 'text':
          return h(TextControl, {
            key: control.path,
            label: control.label,
            value: value as string,
            placeholder: control.placeholder,
            onChange: (next: string) => DesignKitStore.updateValue(props.panel.id, control.path, next),
          });
        case 'select':
          return h(SelectControl, {
            key: control.path,
            label: control.label,
            value: value as string,
            options: control.options ?? [],
            onChange: (next: string) => DesignKitStore.updateValue(props.panel.id, control.path, next),
          });
        case 'color':
          return h(ColorControl, {
            key: control.path,
            label: control.label,
            value: value as string,
            onChange: (next: string) => DesignKitStore.updateValue(props.panel.id, control.path, next),
          });
        case 'action':
          return h('button', {
            key: control.path,
            class: 'design-kit-button',
            onClick: () => DesignKitStore.triggerAction(props.panel.id, control.path),
          }, control.label);
        default:
          return null;
      }
    };

    return () => {
      const toolbarNode = h(Fragment, null, [
        h(motion.button, {
          class: 'design-kit-toolbar-add',
          onClick: handleAddPreset,
          title: 'Add preset',
          whilePress: { scale: 0.9 },
          transition: { type: 'spring', visualDuration: 0.15, bounce: 0.3 },
        }, [
          h('svg', {
            viewBox: '0 0 24 24',
            fill: 'none',
            stroke: 'currentColor',
            'stroke-width': '2.5',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
          }, ICON_ADD_PRESET.map((d) => h('path', { d }))),
        ]),
        h(PresetManager, {
          panelId: props.panel.id,
          presets: presets.value,
          activePresetId: activePresetId.value,
        }),
        h(motion.button, {
          class: 'design-kit-toolbar-copy',
          onClick: handleCopy,
          title: 'Copy parameters',
          whilePress: { scale: 0.95 },
          transition: { type: 'spring', visualDuration: 0.15, bounce: 0.3 },
        }, [
          h('span', { class: 'design-kit-toolbar-copy-icon-wrap' }, [
            h('span', {
              class: 'design-kit-toolbar-copy-icon',
              style: { opacity: copied.value ? 0 : 1, transition: 'opacity 120ms ease' },
            }, [
              h('svg', {
                viewBox: '0 0 24 24',
                fill: 'none',
                width: 16,
                height: 16,
              }, [
                h('path', {
                  d: ICON_CLIPBOARD.board,
                  stroke: 'currentColor',
                  'stroke-width': 2,
                  'stroke-linejoin': 'round',
                }),
                h('path', {
                  d: ICON_CLIPBOARD.sparkle,
                  fill: 'currentColor',
                }),
                h('path', {
                  d: ICON_CLIPBOARD.body,
                  stroke: 'currentColor',
                  'stroke-width': 2,
                  'stroke-linecap': 'round',
                  'stroke-linejoin': 'round',
                }),
              ]),
            ]),
            h(AnimatePresence, { initial: false, mode: 'popLayout' }, {
              default: () => copied.value
                ? [h(motion.span, {
                  key: 'check',
                  class: 'design-kit-toolbar-copy-icon',
                  initial: { scale: 0.5, opacity: 0 },
                  animate: { scale: 1, opacity: 1 },
                  exit: { scale: 0.5, opacity: 0 },
                  transition: { type: 'spring', visualDuration: 0.3, bounce: 0.2 },
                }, [
                  h('svg', {
                    viewBox: '0 0 24 24',
                    fill: 'none',
                    stroke: 'currentColor',
                    'stroke-width': 2,
                    'stroke-linecap': 'round',
                    'stroke-linejoin': 'round',
                    width: 16,
                    height: 16,
                  }, [h('path', { d: ICON_CHECK })]),
                ])]
                : [],
            }),
          ]),
          'Copy',
        ]),
      ]);

      return h('div', { class: 'design-kit-panel-wrapper' }, [
        h(Folder, {
          title: props.panel.name,
          defaultOpen: props.defaultOpen,
          isRoot: true,
          inline: props.inline,
          toolbar: () => toolbarNode,
        }, {
          default: () => props.panel.controls.map(renderControl),
        }),
      ]);
    };
  },
});
