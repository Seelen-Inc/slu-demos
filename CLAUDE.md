# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This repository contains demonstration plugins, themes, and widgets for Seelen UI. The primary purpose is to serve as examples for users creating their own Seelen UI extensions.

## Architecture

### Project Structure

The repository uses Deno workspace with three main categories:

- **widgets/**: Interactive UI components that run in Seelen UI
- **plugins/**: Extensions for the Seelen UI toolbar (YAML-based declarative plugins)
- **themes/**: Customization files that define CSS variables and settings

### Widget System

Widgets are the core extension type in this repository. All widgets follow a consistent architecture:

**Common Structure:**
```
widget-name/
├── src/
│   ├── index.ts        # Entry point with Widget.getCurrent()
│   ├── index.css       # Styles (prefer plain CSS for user themability)
│   ├── index.html      # HTML template
│   └── metadata.yml    # Widget configuration (schema-validated)
├── dist/               # Build output (bundled files)
├── build.ts            # esbuild configuration (for vanilla/React widgets)
├── vite.config.ts      # Vite configuration (for Svelte widgets)
└── deno.json           # Deno tasks and dependencies
```

**Widget Lifecycle:**
1. Initialize with `Widget.getCurrent()` to get the current instance
2. Access settings via `Settings.getAsync()` and `getCurrentWidgetConfig()`
3. Set up reactive subscriptions with `Settings.onChange()` for dynamic updates
4. Render UI using any framework (vanilla JS, React, Svelte)
5. Call `webview.show()` after initial rendering to prevent flickering

**Widget Instance Types (defined in metadata.yml):**
- `Single` (default): One instance per system
- `Multiple`: User can create multiple instances manually
- `ReplicaByMonitor`: Automatically creates one instance per monitor

**Widget Presets (defined in metadata.yml):**
- `Desktop`: Background widget (doesn't appear in Seelen dock)
- `Overlay`: Overlay widget (doesn't appear in Seelen dock)
- Default: Standard widget (appears in dock)

### Essential Library

All widgets must depend on `@seelen-ui/lib` which provides:
- `Widget` class for instance management
- `Settings` class for configuration and reactivity
- Wrapper functions to avoid direct background API interaction
- Type definitions for widget development

## Development Commands

### Root Level (Workspace)
The root `deno.json` defines the workspace structure and common imports. Individual widgets are developed independently.

### Widget Development (in any `widgets/*/` directory)

**For esbuild-based widgets (0-simple, 1-multi-instance, 2-instance-by-monitor):**
```bash
deno task build          # Production build (minified, no sourcemap)
deno task build --dev    # Development build (sourcemap, not minified)
deno task load           # Load widget into Seelen UI
deno task unload         # Unload widget from Seelen UI
deno task dev            # Full dev cycle: unload → build → load
```

**For Vite-based widgets (x-desktop-media-player, Svelte widgets):**
```bash
deno task build          # Production build via Vite
deno task build -- --dev # Development build via Vite
deno task bundle         # Bundle widget for distribution
deno task load           # Load widget into Seelen UI
deno task unload         # Unload widget from Seelen UI
deno task dev            # Full dev cycle: unload → build → load
```

**Seelen UI CLI Integration:**
The `seelen-ui` CLI tool is used for resource management:
- `seelen-ui resource load widget ./dist` - Hot-load widget for testing
- `seelen-ui resource unload widget ./dist` - Remove loaded widget
- `seelen-ui resource bundle widget ./dist` - Package widget for distribution

### Build System Notes

- **esbuild**: Used for simpler widgets (vanilla JS, JSX/React). Configuration in `build.ts`
- **Vite**: Used for framework-heavy widgets (Svelte). Configuration in `vite.config.ts`
- Both support `--dev` flag for development builds with sourcemaps
- Production builds are minified and target ESNext
- All builds output to `./dist/` directory

## Widget Metadata Schema

The `metadata.yml` file is schema-validated against:
`https://raw.githubusercontent.com/Seelen-Inc/slu-lib/refs/heads/master/gen/schemas/widget.schema.json`

**Key fields:**
- `id`: Unique identifier (format: `@username/widget-name`)
- `icon`: Icon name (e.g., `GiDiceSixFacesOne`, `GrMultiple`)
- `metadata.displayName`: Human-readable name
- `metadata.description`: Brief description
- `instances`: `Single` | `Multiple` | `ReplicaByMonitor`
- `preset`: `Desktop` | `Overlay` | (default)
- `settings`: Array of configuration groups with typed inputs

## Plugin System

Plugins are declarative YAML files that extend the Seelen UI toolbar. They use a template system with JavaScript expressions.

**Example structure (toolbar_media_player.yml):**
- `id`: Unique identifier
- `icon`: Icon name
- `target`: Target component (e.g., `@seelen/fancy-toolbar`)
- `plugin.type`: Plugin type (e.g., `media`)
- `plugin.template`: JavaScript template string returning UI components
- `plugin.tooltip`: JavaScript expression for tooltip content
- `plugin.style`: CSS-in-JS style object

**Available template helpers:**
- `icon()`: Render icon component
- `AppIcon()`: Render app icon from UMID
- `Button()`: Render button with onClick handlers
- `Image()`: Render image component
- `invoke()`: Call Seelen commands (e.g., `SeelenCommand.MediaPrev`)

## Theme System

Themes are YAML files defining CSS custom properties with UI-configurable values.

**Schema:** `https://raw.githubusercontent.com/Seelen-Inc/slu-lib/refs/heads/master/gen/schemas/theme.schema.json`

**Setting types (syntax field):**
- `<color>`: Color picker
- `<length>`: Numeric input with units (px, rem, etc.)
- `<number>`: Numeric input without units
- `<string>`: Text input
- `<url>`: URL input

**Settings can be nested in groups** with `header` and `items` fields for UI organization.

## Important Patterns

### Settings Reactivity
Always subscribe to settings changes for dynamic widgets:
```typescript
const _unsubscribe = await Settings.onChange(async (newSettings) => {
  const config = await newSettings.getCurrentWidgetConfig();
  // Update UI with new config
});
```

### Preventing Flickering
Always call `webview.show()` AFTER initial rendering is complete, not before.

### CSS Best Practices
Use plain CSS instead of CSS modules to allow easy theme customization by users.

### Logging
Use `console.info()`, `console.log()`, `console.error()` - all output is saved to Seelen UI logs.

## Framework Support

This repository demonstrates multiple approaches:
- **Vanilla JS/TypeScript**: widgets/0-simple, 1-multi-instance, 2-instance-by-monitor
- **React/JSX**: Supported via esbuild with `jsx: "automatic"`
- **Svelte**: widgets/x-desktop-media-player (uses Vite + @sveltejs/vite-plugin-svelte)

All frameworks are bundled to ESM format targeting ESNext.