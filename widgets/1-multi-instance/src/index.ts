import { Widget, Color } from "@seelen-ui/lib";

import "./index.css";

const widget = await Widget.getCurrentAsync();
const { webview } = widget;

// configure the webview window
webview.setDecorations(false);
webview.setShadow(false);

// set as desktop background widget, (background widgets won't appear on the seelen dock)
webview.setAlwaysOnBottom(true);

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
    root.innerHTML = `Instance ID: ${widget.decoded.instanceId}`;
  } else {
    root.innerHTML = `I'm the main instance!`;
  }
}

// show the widget
webview.show();
