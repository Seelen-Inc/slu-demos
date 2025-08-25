import { useState } from "react";
import { ResourcePicker } from "./app/ResourcePicker.tsx";
import { ResourceTextEditor } from "./app/ResourceTextEditor.tsx";
import { ResourceKind, Theme, Widget } from "@seelen-ui/lib/types";
import { ThemeSettingsEditor } from "./app/ThemeSettings.tsx";
import { WidgetSettingsGroupEditor } from "./app/WidgetSettings.tsx";

export function App() {
  const [kind, setKind] = useState<ResourceKind>("Theme");
  // deno-lint-ignore no-explicit-any
  const [resource, setResource] = useState<any>({});
  const displayName = resource?.metadata?.displayName;
  const description = resource?.metadata?.description;

  return (
    <>
      <h1>Resource Creator Tool</h1>
      <ResourcePicker
        resource={resource}
        onChangeResource={setResource}
        kind={kind}
        onChangeKind={(kind) => {
          setKind(kind);
          setResource({});
        }}
      />

      <ResourceTextEditor
        title="metadata.displayName"
        value={displayName}
        onChange={(v) => {
          setResource((currentResource: unknown) => {
            const newResource = JSON.parse(JSON.stringify(currentResource));
            newResource.metadata.displayName = v;
            return newResource;
          });
        }}
      />
      <ResourceTextEditor
        title="metadata.description"
        value={description}
        onChange={(v) => {
          setResource((currentResource: unknown) => {
            const newResource = JSON.parse(JSON.stringify(currentResource));
            newResource.metadata.description = v;
            return newResource;
          });
        }}
      />

      {kind === "Theme" &&
        (resource as Theme).settings.map((setting, idx) => (
          <ThemeSettingsEditor
            key={idx}
            def={setting}
            onChange={(entry) => {
              setResource((currentResource: Theme) => {
                const newResource: Theme = JSON.parse(JSON.stringify(currentResource));
                newResource.settings[idx] = entry;
                return newResource;
              });
            }}
          />
        ))}

      {kind === "Widget" &&
        (resource as Widget).settings.map((setting, idx) => (
          <WidgetSettingsGroupEditor
            key={idx}
            def={setting}
            onChange={(entry) => {
              setResource((currentResource: Widget) => {
                const newResource: Widget = JSON.parse(JSON.stringify(currentResource));
                newResource.settings[idx] = entry;
                return newResource;
              });
            }}
          />
        ))}
    </>
  );
}
