import {
  ThemeConfigDefinition,
  ThemeConfigGroup,
  ThemeVariableDefinition,
} from "@seelen-ui/lib/types";
import { ResourceTextEditor } from "./ResourceTextEditor.tsx";

interface Props<T> {
  def: T;
  onChange: (value: T) => void;
}

export function ThemeSettingsEditor({ def, onChange }: Props<ThemeConfigDefinition>) {
  if ("group" in def) {
    return (
      <ThemeSettingsGroupEditor
        def={def.group}
        onChange={(v) => {
          onChange({ ...def, group: v });
        }}
      />
    );
  }
  return <ThemeSettingsVariableEditor def={def} onChange={onChange} />;
}

export function ThemeSettingsGroupEditor({ def, onChange }: Props<ThemeConfigGroup>) {
  return (
    <>
      <ResourceTextEditor
        title="Theme Group Header"
        value={def.header}
        onChange={(header) => {
          onChange({ ...def, header });
        }}
      />
      {def.items.map((item, idx) => (
        <ThemeSettingsEditor
          key={idx}
          def={item}
          onChange={(v) => {
            const newItems = [...def.items];
            newItems[idx] = v;
            onChange({ ...def, items: newItems });
          }}
        />
      ))}
    </>
  );
}

export function ThemeSettingsVariableEditor({ def, onChange }: Props<ThemeVariableDefinition>) {
  return (
    <>
      <ResourceTextEditor
        title={`Theme Variable (${def.name}) Label`}
        value={def.label}
        onChange={(label) => {
          onChange({ ...def, label });
        }}
      />
      {def.description !== null && (
        <ResourceTextEditor
          title={`Theme Variable (${def.name}) Description`}
          value={def.description}
          onChange={(description) => {
            onChange({ ...def, description });
          }}
        />
      )}
    </>
  );
}
