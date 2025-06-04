import { SupportedLanguages, invoke, SeelenCommand } from "@seelen-ui/lib";
import { ResourceText } from "@seelen-ui/lib/types";
import { useCallback, useEffect, useState } from "react";

interface Props {
  title: string;
  value?: ResourceText;
  onChange: (value: ResourceText) => void;
}

type TextByLang = { [key in string]?: string };
function valueFromResourceText(value?: ResourceText): TextByLang {
  return typeof value === "string"
    ? {
        en: value,
      }
    : value || {};
}

function areEqual(a: TextByLang, b: TextByLang) {
  return (
    Object.keys(a).length === Object.keys(b).length &&
    Object.keys(a).every((key) => a[key] === b[key])
  );
}

// deno-lint-ignore no-explicit-any
function debounce<F extends (...args: any[]) => void>(func: F, wait: number): F {
  let timeout: number | undefined = undefined;
  // deno-lint-ignore no-explicit-any
  const debounced = (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
  return debounced as F;
}

export function ResourceTextEditor({ title, value: propValue, onChange }: Props) {
  const [internalValue, setInternalValue] = useState(() => valueFromResourceText(propValue));
  const [loading, setLoading] = useState(false);

  // sincronize
  useEffect(() => {
    if (!areEqual(internalValue, valueFromResourceText(propValue))) {
      setInternalValue(valueFromResourceText(propValue));
    }
  }, [propValue]);

  const onExternalChange = useCallback(
    debounce((newValue: TextByLang) => {
      onChange(newValue);
    }, 300),
    []
  );

  const onTextChange = (lang: string, text: string) => {
    setInternalValue((prev) => {
      const newValue = { ...prev, [lang]: text };
      onExternalChange(newValue);
      return newValue;
    });
  };

  const translateTo = async (targetLang: string) => {
    if (!internalValue.en) return;
    const translated = await invoke(SeelenCommand.TranslateText, {
      source: internalValue.en,
      sourceLang: "en",
      targetLang,
    });
    onTextChange(targetLang, translated);
  };

  return (
    <details className="resource-text-editor">
      <summary className="resource-text-editor-summary">
        <span className="path">{title}</span>
        <div className="language">
          English
          <input
            type="text"
            value={internalValue.en || ""}
            disabled={loading}
            onKeyUp={(e) => {
              // avoid open details on space
              if (e.key === " ") e.preventDefault();
            }}
            onChange={(e) => {
              onTextChange("en", e.target.value);
            }}
          />
          <button
            type="button"
            title="Translate to all supported languages"
            disabled={loading}
            onClick={() => {
              setLoading(true);
              (async () => {
                for (const lang of SupportedLanguages) {
                  if (lang.value === "en") continue;
                  await translateTo(lang.value);
                }
              })().finally(() => setLoading(false));
            }}
          >
            🔠
          </button>
        </div>
      </summary>
      <div className="resource-text-editor-content">
        {SupportedLanguages.map((lang) => {
          if (lang.value === "en") return null;
          return (
            <div key={lang.value} className="language">
              {lang.enLabel}
              <input
                type="text"
                placeholder={internalValue.en}
                value={internalValue[lang.value] || ""}
                disabled={loading}
                onChange={(e) => {
                  onTextChange(lang.value, e.target.value);
                }}
              />
              <button
                type="button"
                title="Fill with auto translation from English"
                disabled={!internalValue.en || loading}
                onClick={() => {
                  setLoading(true);
                  translateTo(lang.value).finally(() => setLoading(false));
                }}
              >
                🔤
              </button>
            </div>
          );
        })}
      </div>
    </details>
  );
}
