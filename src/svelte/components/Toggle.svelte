<script lang="ts">
  import SegmentedControl from './SegmentedControl.svelte';
  import type { ShortcutConfig } from 'design-kit/store';
  import { formatToggleShortcut } from '../../shortcut-utils';

  let { label, checked, onChange, shortcut, shortcutActive = false } = $props<{
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    shortcut?: ShortcutConfig;
    shortcutActive?: boolean;
  }>();
</script>

<div class="design-kit-labeled-control">
  <span class="design-kit-labeled-control-label">
    {label}
    {#if shortcut}
      <span class={`design-kit-shortcut-pill${shortcutActive ? ' design-kit-shortcut-pill-active' : ''}`}>
        {formatToggleShortcut(shortcut)}
      </span>
    {/if}
  </span>
  <SegmentedControl
    options={[
      { value: 'off', label: 'Off' },
      { value: 'on', label: 'On' },
    ]}
    value={checked ? 'on' : 'off'}
    onChange={(val) => onChange(val === 'on')}
  />
</div>
