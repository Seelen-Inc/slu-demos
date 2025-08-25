import { mount } from "svelte";
import { Widget } from "@seelen-ui/lib";
import { LogicalSize } from "@seelen-ui/lib/tauri";

import App from "./App.svelte";

import "./styles.css";

mount(App, {
  target: document.getElementById("root")!,
});

const widget = Widget.getCurrent();
const { webview } = widget;

await widget.setAsDesktopWidget();

await webview.setSize(new LogicalSize(400, 120)); // set the widget initial size
await webview.setMinSize(new LogicalSize(400, 120));

await widget.persistPositionAndSize();
await webview.show();
