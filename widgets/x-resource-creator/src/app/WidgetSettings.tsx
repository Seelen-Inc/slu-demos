import { WsdGroup, WsdGroupEntry, WsdItem } from "@seelen-ui/lib/types";
import { ResourceTextEditor } from "./ResourceTextEditor.tsx";

interface Props<T> {
  def: T;
  onChange: (value: T) => void;
}

export function WidgetSettingsGroupEditor({ def, onChange }: Props<WsdGroup>) {
  return def.group.map((entry, idx) => (
    <WidgetSettingsGroupEntryEditor
      key={idx}
      def={entry}
      onChange={(v) => {
        const newGroup = [...def.group];
        newGroup[idx] = v;
        onChange({ ...def, group: newGroup });
      }}
    />
  ));
}

export function WidgetSettingsGroupEntryEditor({ def, onChange }: Props<WsdGroupEntry>) {
  return (
    <>
      <WidgetSettingsItemEditor
        def={def.config}
        onChange={(v) => {
          onChange({ ...def, config: v });
        }}
      />
      {def.children.map((entry, idx) => (
        <WidgetSettingsGroupEntryEditor
          def={entry}
          onChange={(v) => {
            const newChildren = [...def.children];
            newChildren[idx] = v;
            onChange({ ...def, children: newChildren });
          }}
        />
      ))}
    </>
  );
}

export function WidgetSettingsItemEditor({ def, onChange }: Props<WsdItem>) {
  return (
    <>
      <ResourceTextEditor
        title="Widget Config Label"
        value={def.label}
        onChange={(label) => {
          onChange({ ...def, label });
        }}
      />
    </>
  );
}
