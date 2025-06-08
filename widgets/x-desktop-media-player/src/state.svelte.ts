import { invoke, SeelenCommand, SeelenEvent, Settings, subscribe } from "@seelen-ui/lib";
import { Writable, writable } from "svelte/store";
import { MediaPlayer } from "@seelen-ui/lib/types";
import { path, window as TauriWindow } from "@seelen-ui/lib/tauri";

const players: Writable<MediaPlayer[]> = writable(await invoke(SeelenCommand.GetMediaSessions));

await subscribe(SeelenEvent.MediaSessions, (event) => {
  console.log(event);
  players.set(event.payload);
});

function onNext(playerId: string) {
  invoke(SeelenCommand.MediaNext, { id: playerId });
}

function onPrevious(playerId: string) {
  invoke(SeelenCommand.MediaPrev, { id: playerId });
}

function onPlay(playerId: string) {
  invoke(SeelenCommand.MediaTogglePlayPause, { id: playerId });
}

const settings = await Settings.getAsync();
const config = await settings.getCurrentWidgetConfig();
TauriWindow.getCurrentWindow().setResizable(!config.locked);

const locked: Writable<boolean> = writable(!!config.locked);
await Settings.onChange(async (newSettings) => {
  const config = await newSettings.getCurrentWidgetConfig();
  TauriWindow.getCurrentWindow().setResizable(!config.locked);
  locked.set(!!config.locked);
});

const fallbackImagePath = await path.resolveResource('static/icons/music_thumbnail.jpg');

export { players, locked, onNext, onPrevious, onPlay, fallbackImagePath };
