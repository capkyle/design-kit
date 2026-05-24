import { defineComponent, h, onMounted, onUnmounted, ref, Teleport } from 'vue';
import { DesignKitStore } from '../../store/DesignKitStore';
import type { PanelConfig } from '../../store/DesignKitStore';
import { Panel } from './Panel';
import { ShortcutListener } from './ShortcutListener';

export type DesignPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
export type DesignMode = 'popover' | 'inline';
export type DesignTheme = 'light' | 'dark' | 'system';

declare const process: { env?: { NODE_ENV?: string } } | undefined;

const isDevDefault = typeof process !== 'undefined' && process?.env?.NODE_ENV
  ? process.env.NODE_ENV !== 'production'
  : typeof import.meta !== 'undefined' && (import.meta as any).env?.MODE
    ? (import.meta as any).env.MODE !== 'production'
    : true;

export const DesignKitRoot = defineComponent({
  name: 'DesignKitDesignKitRoot',
  props: {
    position: {
      type: String as () => DesignPosition,
      default: 'top-right',
    },
    defaultOpen: {
      type: Boolean,
      default: true,
    },
    mode: {
      type: String as () => DesignMode,
      default: 'popover',
    },
    theme: {
      type: String as () => DesignTheme,
      default: 'system',
    },
    productionEnabled: {
      type: Boolean,
      default: isDevDefault,
    },
  },
  setup(props) {
    const panels = ref<PanelConfig[]>([]);
    const mounted = ref(false);
    let unsubscribe: (() => void) | undefined;

    onMounted(() => {
      mounted.value = true;
      panels.value = DesignKitStore.getPanels();
      unsubscribe = DesignKitStore.subscribeGlobal(() => {
        panels.value = DesignKitStore.getPanels();
      });
    });

    onUnmounted(() => {
      unsubscribe?.();
    });

    const renderContent = () => h(ShortcutListener, null, {
      default: () => h('div', { class: 'design-kit-root', 'data-mode': props.mode, 'data-theme': props.theme }, [
        h('div', {
          class: 'design-kit-panel',
          'data-position': props.mode === 'inline' ? undefined : props.position,
          'data-mode': props.mode,
        }, panels.value.map((panel) => h(Panel, {
          key: panel.id,
          panel,
          defaultOpen: props.mode === 'inline' || props.defaultOpen,
          inline: props.mode === 'inline',
        }))),
      ]),
    });

    return () => {
      if (!props.productionEnabled || !mounted.value || typeof window === 'undefined' || panels.value.length === 0) {
        return null;
      }

      if (props.mode === 'inline') {
        return renderContent();
      }

      return h(Teleport, { to: 'body' }, renderContent());
    };
  },
});
