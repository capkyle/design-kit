import { For } from 'solid-js';

interface ButtonGroupProps {
  buttons: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export function ButtonGroup(props: ButtonGroupProps) {
  return (
    <div class="design-kit-button-group">
      <For each={props.buttons}>
        {(button) => (
          <button class="design-kit-button" onClick={button.onClick}>
            {button.label}
          </button>
        )}
      </For>
    </div>
  );
}
