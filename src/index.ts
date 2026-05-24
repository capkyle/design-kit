// Main hook
export { useDesignKit } from './hooks/useDesignKit';
export type { UseDialOptions } from './hooks/useDesignKit';

// Root component (user mounts once)
export { DesignKitRoot } from './components/DesignKitRoot';
export type { DesignPosition, DesignMode, DesignTheme } from './components/DesignKitRoot';

// Individual components (for advanced usage)
export { Slider } from './components/Slider';
export { Toggle } from './components/Toggle';
export { Folder } from './components/Folder';
export { ButtonGroup } from './components/ButtonGroup';
export { SpringControl } from './components/SpringControl';
export { SpringVisualization } from './components/SpringVisualization';
export { TransitionControl } from './components/TransitionControl';
export { EasingVisualization } from './components/EasingVisualization';
export { TextControl } from './components/TextControl';
export { SelectControl } from './components/SelectControl';
export { ColorControl } from './components/ColorControl';
export { PresetManager } from './components/PresetManager';
export { ShortcutsMenu } from './components/ShortcutsMenu';

// Store (for advanced usage)
export { DesignKitStore } from './store/DesignKitStore';
export type {
  SpringConfig,
  EasingConfig,
  TransitionConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  ShortcutConfig,
  ShortcutMode,
  ShortcutInteraction,
  Preset,
  DesignValue,
  DesignConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from './store/DesignKitStore';

// Expose the running store on `window` for external hosts (IDE
// integrations, design tooling) that need to read/write panel values
// from outside the app's JS context. Guarded for SSR.
if (typeof window !== 'undefined') {
  // @ts-ignore — intentional global side-effect for external hosts.
  (window as any).__designKit = DesignKitStore;
}
