import {
  createApp,
  defineComponent,
  h,
  shallowRef,
  type App,
  type ObjectDirective,
  type ShallowRef,
} from 'vue';
import { DesignKitRoot, type DesignMode, type DesignPosition } from '../components/DesignKitRoot';

export interface DesignKitDirectiveOptions {
  position?: DesignPosition;
  defaultOpen?: boolean;
  mode?: DesignMode;
}

export type DesignKitDirectiveValue = DesignMode | DesignKitDirectiveOptions | undefined;

type DirectiveState = {
  app: App;
  host: HTMLDivElement;
  props: ShallowRef<DesignKitDirectiveOptions>;
};

const states = new WeakMap<HTMLElement, DirectiveState>();

function normalizeDirectiveValue(value: DesignKitDirectiveValue): DesignKitDirectiveOptions {
  if (!value) return {};
  if (value === 'inline' || value === 'popover') {
    return { mode: value };
  }
  return value;
}

function mountDesignKitRoot(el: HTMLElement, value: DesignKitDirectiveValue) {
  if (typeof window === 'undefined') return;

  const host = document.createElement('div');
  el.appendChild(host);

  const props = shallowRef<DesignKitDirectiveOptions>(normalizeDirectiveValue(value));
  const RootHost = defineComponent({
    name: 'DesignKitDirectiveHost',
    setup() {
      return () => h(DesignKitRoot, props.value);
    },
  });

  const app = createApp(RootHost);
  app.mount(host);

  states.set(el, { app, host, props });
}

function unmountDesignKitRoot(el: HTMLElement) {
  const state = states.get(el);
  if (!state) return;

  state.app.unmount();
  state.host.remove();
  states.delete(el);
}

export const vDesignKit: ObjectDirective<HTMLElement, DesignKitDirectiveValue> = {
  mounted(el, binding) {
    mountDesignKitRoot(el, binding.value);
  },
  updated(el, binding) {
    const state = states.get(el);
    if (!state) {
      mountDesignKitRoot(el, binding.value);
      return;
    }
    state.props.value = normalizeDirectiveValue(binding.value);
  },
  beforeUnmount(el) {
    unmountDesignKitRoot(el);
  },
};
