import { Widget, Settings } from "@seelen-ui/lib";
import {window as TauriWindow, LogicalSize } from "@seelen-ui/lib/tauri"
import "./index.css";
const widget = await Widget.getCurrentAsync();
const { webview } = widget;

const settings = await Settings.getAsync();


let config = await settings.getCurrentWidgetConfig();

await TauriWindow.getCurrentWindow().setResizable(!config.locked);


updateVariables();


await Settings.onChange(async (newSettings) => {
  config = await newSettings.getCurrentWidgetConfig();
  updateVariables();
  updateClock();
  await TauriWindow.getCurrentWindow().setResizable(!config.locked);
});




function updateVariables() {
  document.documentElement.style.setProperty(
    '--date-opacity', 
    config.showDate ? '1' : '0'
  );
  document.documentElement.style.setProperty(
  '--font-family', 
  String(config.fontFamily ?? "'Roboto', sans-serif")
);

document.documentElement.style.setProperty(
  '--font-scale',
  String((config.scale ?? 2)) 
);


document.documentElement.style.setProperty(
  '--align-widget',
  String((config.align ?? "center"))
);


if (typeof config.widgetColor === 'string') {
  document.documentElement.style.setProperty(
    '--widget-color', 
    config.widgetColor
  );
}
const clock = document.querySelector(".clock");
if (clock) {
  clock.setAttribute("data-tauri-drag-region", String(!config.locked));
  clock.setAttribute("data-align", String(config.align));
  clock.setAttribute("data-bold", String(config.bolded));

  }
}

// Создаем DOM
const root = document.getElementById("root")!;
root.innerHTML = `
  <div class="clock" data-tauri-drag-region="${!config.locked}" data-align="${!config.align}">
    <div id="date" data-bold="${!config.bolded}">Date</div>
    <div id="date2">Date</div>
    <div id="time">00:00</div>
  </div>
`;

const timeEl = document.getElementById("time")!;
const dateEl = document.getElementById("date")!;
const dateEl2 = document.getElementById("date2")!;

//update date
function updateClock() {
  const now = new Date();
  
  const timeStr = now.toLocaleTimeString('en-EN', {
    hour: '2-digit',
    minute: '2-digit'
  });

  dateEl.textContent = now.toLocaleDateString('en-EN', {
    weekday: 'long',
  });
  dateEl2.textContent = now.toLocaleDateString('en-EN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  timeEl.textContent = `- ${timeStr} -`;
}

// init
updateClock();
setInterval(updateClock, 1000);
widget.setAsDesktopWidget(); 

await webview.setSize(new LogicalSize(620, 300)); // set the widget initial size
await webview.setMinSize(new LogicalSize(620, 300));
await webview.setMaxSize(new LogicalSize(620, 300));


await widget.persistPositionAndSize();
await webview.show();