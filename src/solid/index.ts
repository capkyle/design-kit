// Core API
export { createDesignKit } from './createDesignKit';
export type { CreateDialOptions } from './createDesignKit';

// Root component
export { DesignKitRoot } from './components/DesignKitRoot';
export type { DesignPosition, DesignMode, DesignTheme } from './components/DesignKitRoot';

// Component exports
export { Slider } from './components/Slider';
export { Toggle } from './components/Toggle';
export { Folder } from './components/Folder';
export { ButtonGroup } from './components/ButtonGroup';
export { SpringControl } from './components/SpringControl';
export { SpringVisualization } from './components/SpringVisualization';
export { TextControl } from './components/TextControl';
export { SelectControl } from './components/SelectControl';
export { ColorControl } from './components/ColorControl';
export { PresetManager } from './components/PresetManager';

// Store exports
export { DesignKitStore } from '../store/DesignKitStore';
export type {
  SpringConfig,
  ActionConfig,
  SelectConfig,
  ColorConfig,
  TextConfig,
  ShortcutConfig,
  Preset,
  DesignValue,
  DesignConfig,
  ResolvedValues,
  ControlMeta,
  PanelConfig,
} from '../store/DesignKitStore';
