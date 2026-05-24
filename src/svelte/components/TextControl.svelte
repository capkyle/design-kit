<script lang="ts">
  let { label, value, onChange, placeholder } = $props<{
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
  }>();
</script>

<div class="design-kit-text-control">
  <label class="design-kit-text-label">{label}</label>
  <input
    type="text"
    class="design-kit-text-input"
    value={value}
    placeholder={placeholder}
    oninput={(e) => onChange((e.currentTarget as HTMLInputElement).value)}
  />
</div>
