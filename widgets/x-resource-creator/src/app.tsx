import { useState } from "react";
import { ResourcePicker } from "./app/ResourcePicker.tsx";
import { ResourceTextEditor } from "./app/ResourceTextEditor.tsx";
import { ResourceText, Theme, Widget, WsdGroupEntry } from "@seelen-ui/lib/types";

export function App() {
  // deno-lint-ignore no-explicit-any
  const [resource, setResource] = useState<any>({});
  const displayName = resource?.metadata?.displayName;
  const description = resource?.metadata?.description;

  const onChangeResouceText = (path: string, value: ResourceText) => {
    const parts = path.split(".");
    console.log(parts, value);

    // deno-lint-ignore no-explicit-any
    setResource((currentResource: any) => {
      const newResource = JSON.parse(JSON.stringify(currentResource));
      let current = newResource;
      for (let i = 0; i < parts.length - 1; i++) {
        const part = parts[i];
        if (!current[part]) {
          current[part] = {};
        }
        current = current[part];
      }
      current[parts[parts.length - 1]] = value;
      return newResource;
    });
  };

  return (
    <>
      <h1>Resource Creator Tool</h1>
      <ResourcePicker resource={resource} onChange={setResource} />

      <ResourceTextEditor
        title="metadata.displayName"
        value={displayName}
        onChange={onChangeResouceText.bind(null, "metadata.displayName")}
      />
      <ResourceTextEditor
        title="metadata.description"
        value={description}
        onChange={onChangeResouceText.bind(null, "metadata.description")}
      />

      <Settings settings={resource.settings || []} onChange={onChangeResouceText} />
    </>
  );
}

interface SettingsProps {
  settings: Theme["settings"] | Widget["settings"];
  onChange: (path: string, value: ResourceText) => void;
}

function Settings({ settings, onChange }: SettingsProps) {
  return settings.map((setting, idx) => {
    if ("group" in setting) {
      return setting.group?.map((entry, entryIdx) => (
        <RenderEntry
          key={entry.config.key}
          item={entry}
          parentPath={`settings.${idx}.group.${entryIdx}`}
          onChange={onChange}
        />
      ));
    }

    return (
      <ResourceTextEditor
        key={idx}
        title={setting.name}
        value={setting.label}
        onChange={(value) => {
          onChange(`settings.${idx}.label`, value);
        }}
      />
    );
  });
}

interface RenderEntryProps {
  item: WsdGroupEntry;
  parentPath: string;
  onChange: (path: string, value: ResourceText) => void;
}

function RenderEntry({ item, parentPath, onChange }: RenderEntryProps) {
  return (
    <>
      <ResourceTextEditor
        title={item.config.key}
        value={item.config.label}
        onChange={(value) => {
          onChange(`${parentPath}.config.label`, value);
        }}
      />
      {item.children?.map((child, idx) => {
        return (
          <RenderEntry
            key={child.config.key}
            item={child}
            parentPath={`${parentPath}.children.${idx}`}
            onChange={onChange}
          />
        );
      })}
    </>
  );
}
