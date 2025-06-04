import yaml from "js-yaml";

declare global {
  interface Window {
    // deno-lint-ignore no-explicit-any
    showSaveFilePicker(opt: any): Promise<FileSystemFileHandle>;
  }
}

interface Props {
  resource: object | null;
  onChange: (resource: object | null) => void;
}

export function ResourcePicker({ resource, onChange }: Props) {
  return (
    <div className="resource-picker">
      <label>
        <b>Resource Kind: </b>
        <select>
          <option>theme</option>
          <option>widget</option>
        </select>
      </label>

      <input
        type="file"
        accept=".yml"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              const yamlString = reader.result as string;
              const yamlData = yaml.load(yamlString);
              onChange(yamlData);
            };
            reader.readAsText(file);
          }
        }}
      />

      <button
        type="button"
        onClick={async () => {
          // this works only on chrome based browsers
          try {
            const yamlString = yaml.dump(resource);

            const fileHandle: FileSystemFileHandle = await globalThis.window.showSaveFilePicker({
              suggestedName: "resource.yml",
              types: [
                {
                  description: "YAML File",
                  accept: { "text/yaml": [".yml", ".yaml"] },
                },
              ],
            });

            const writableStream = await fileHandle.createWritable();
            await writableStream.write(yamlString);
            await writableStream.close();
          } catch (err) {
            console.error(err);
          }
        }}
      >
        Save Resource
      </button>

      <details>
        <summary>
          <b>Raw view:</b>
        </summary>
        <pre>{JSON.stringify(resource, null, 2)}</pre>
      </details>
    </div>
  );
}
