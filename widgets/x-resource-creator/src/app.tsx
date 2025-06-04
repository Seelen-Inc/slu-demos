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
        path="metadata.displayName"
        value={displayName}
        onChange={onChangeResouceText.bind(null, "metadata.displayName")}
      />
      <ResourceTextEditor
        path="metadata.description"
        value={description}
        onChange={onChangeResouceText.bind(null, "metadata.description")}
      />

      <Settings settings={resource.settings || []} />
    </>
  );
}

function Settings({ settings }: { settings: Theme["settings"] | Widget["settings"] }) {
  return settings.map((setting, idx) => {
    if ("group" in setting) {
      return setting.group?.map((entry) => <RenderEntry key={entry.config.key} {...entry} />);
    }

    return (
      <ResourceTextEditor
        key={idx}
        path={`settings.${idx}.label`}
        value={setting.label}
        onChange={() => {}}
      />
    );
  });
}

function RenderEntry(item: WsdGroupEntry) {
  return (
    <>
      <ResourceTextEditor path={item.config.key} value={item.config.label} onChange={() => {}} />
      {item.children?.map((child) => {
        return <RenderEntry key={child.config.key} {...child} />;
      })}
    </>
  );
}
