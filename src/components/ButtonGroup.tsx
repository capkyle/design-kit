interface ButtonGroupProps {
  buttons: Array<{
    label: string;
    onClick: () => void;
  }>;
}

export function ButtonGroup({ buttons }: ButtonGroupProps) {
  return (
    <div className="design-kit-button-group">
      {buttons.map((button, index) => (
        <button
          key={index}
          className="design-kit-button"
          onClick={button.onClick}
        >
          {button.label}
        </button>
      ))}
    </div>
  );
}
