interface TextControlProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function TextControl({ label, value, onChange, placeholder }: TextControlProps) {
  return (
    <div className="design-kit-text-control">
      <label className="design-kit-text-label">{label}</label>
      <input
        type="text"
        className="design-kit-text-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
