import { Show } from 'solid-js';
import { SegmentedControl } from './SegmentedControl';
import type { ShortcutConfig } from '../../store/DesignKitStore';
import { formatToggleShortcut } from '../../shortcut-utils';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  shortcut?: ShortcutConfig;
  shortcutActive?: boolean;
}

export function Toggle(props: ToggleProps) {
  return (
    <div class="design-kit-labeled-control">
      <span class="design-kit-labeled-control-label">
        {props.label}
        <Show when={props.shortcut}>
          <span class={`design-kit-shortcut-pill${props.shortcutActive ? ' design-kit-shortcut-pill-active' : ''}`}>
            {formatToggleShortcut(props.shortcut!)}
          </span>
        </Show>
      </span>
      <SegmentedControl
        options={[
          { value: 'off' as const, label: 'Off' },
          { value: 'on' as const, label: 'On' },
        ]}
        value={props.checked ? 'on' : 'off'}
        onChange={(val) => props.onChange(val === 'on')}
      />
    </div>
  );
}
