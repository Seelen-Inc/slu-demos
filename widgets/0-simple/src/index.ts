import { Settings, Widget } from "@seelen-ui/lib";

// we can use any css, inclusively css modules, but we highly recommend use of plain css to allow
// easy modification of styles by the users via themes.
import "./index.css";

// get the current widget instance
const widget = Widget.getCurrent();
const { webview } = widget;

// this will be printed and saved on seelen ui logs.
console.info(`Hello world!`);

// we can play with the DOM to render whatever we want, here we can use react, svelte, vanilla js, etc.
// you choose what you want, at the end all will be bundled into a single file
const root = document.getElementById("root")!;
root.className = "example";
root.innerHTML = "<h1>Hello world!</h1>";

// we can get all the seelen ui settings here.
const settings = await Settings.getAsync();
// in this case we are only interested in the current widget settings
const config = await settings.getCurrentWidgetConfig();
// testContent variable was defined in the metadata.yml, and we expect it to be a string
root.innerHTML += `<p>Test Content: <b id="testContent">${config.testContent}</b></p>`;

// at this step, the input was rendered but we want it to update on settings change, let's do it:
const _unsubscribe = await Settings.onChange(async (newSettings) => {
  const config = await newSettings.getCurrentWidgetConfig();
  console.log(config);
  document.getElementById("testContent")!.innerHTML = String(config.testContent);
});

// ok all done, let's show the widget.
// Remember that this step is important to start showing the widget.
// Call it after finishing rendering the initial view to avoid flickering on the UI.
webview.show();
