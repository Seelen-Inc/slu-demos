import { Widget, Color, Settings } from "@seelen-ui/lib";

import "./index.css";

const widget = await Widget.getCurrentAsync();
const { webview } = widget;

// set as desktop background widget, (background widgets won't appear on the seelen dock)
widget.setAsDesktopWidget();

// whe using multiple intances, always will be one present as the main instance, this won't have an instanceId.
// instanceId will be only present for extra instances.
console.debug(`Hello world from instance ${widget.decoded.instanceId}`);

// playing with the DOM step.
{
  const root = document.getElementById("root")!;

  root.className = "example";

  const bg = Color.random();
  bg.inner.a = 200;

  root.style.backgroundColor = bg.toHexString();
  root.style.color = bg.calcLuminance() > 128 ? "black" : "white";
  root.style.borderColor = Color.random().toHexString();

  if (widget.decoded.instanceId) {
    root.innerHTML = `<h1>Instance ID: ${widget.decoded.instanceId}</h1>`;
  } else {
    root.innerHTML = `<h1>I'm the main instance!</h1>`;
  }

  // In case of use of settings, this are patched automatically, so users can have different settings for each instance
  const settings = await Settings.getAsync();
  const config = await settings.getCurrentWidgetConfig();
  root.innerHTML += `<p>Test Content: <b id="testContent">${config.testContent}</b></p>`;
  // remember adding a listener to Settings.onChange to get the new setting values whe user changes them
  await Settings.onChange(async (newSettings) => {
    const config = await newSettings.getCurrentWidgetConfig();
    document.getElementById("testContent")!.innerHTML = String(config.testContent);
  });
}

// restore last position and size, and store pos and size on user modification
await widget.persistPositionAndSize();
// show the widget
webview.show();
