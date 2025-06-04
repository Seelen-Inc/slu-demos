import { Widget } from "@seelen-ui/lib";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app.tsx";

import "./styles/index.css";

const widget = await Widget.getCurrentAsync();
const { webview } = widget;

const root = document.getElementById("root")!;
createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
);

webview.show();
