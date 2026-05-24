<script lang="ts">
  export type ButtonAction = {
    label: string;
    onClick: () => void;
  };

  let { buttons } = $props<{ buttons: ButtonAction[] }>();
</script>

<div class="design-kit-button-group">
  {#each buttons as button (button.label)}
    <button class="design-kit-button" onclick={button.onClick}>
      {button.label}
    </button>
  {/each}
</div>
