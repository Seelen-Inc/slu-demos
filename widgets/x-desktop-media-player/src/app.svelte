<script lang="ts">
  import { players, locked, onNext, onPrevious, onPlay, fallbackImagePath } from "./state.svelte";
  import { getRandomPhrase } from "./phrases";
  import { core } from "@seelen-ui/lib/tauri";

  $: player = $players.find((p) => p.default);

  $: percent = (() => {
    const totalNs = player?.timeline.end;
    const currentNs = player?.timeline.position;
    return currentNs ? (currentNs / totalNs) * 100 : 0;
  })();

  $: phrase = getRandomPhrase();
  function refreshPhrase() {
    phrase = getRandomPhrase();
  }
</script>

<div data-tauri-drag-region={!$locked} class="player-container">
  <img
    src={core.convertFileSrc(player?.thumbnail || fallbackImagePath)}
    alt="Background"
    class="background"
  />
  <div class="player">
    <img
      data-tauri-drag-region={!$locked}
      src={core.convertFileSrc(player?.thumbnail || fallbackImagePath)}
      alt="Thumbnail"
      class="thumbnail"
    />
    <div data-tauri-drag-region={!$locked} class="info">
      {#if player}
        <h3 data-tauri-drag-region={!$locked} class="title">{player.title || "-"}</h3>
        <p data-tauri-drag-region={!$locked} class="author">{player.author || "-"}</p>
        <div class="progress">
          <div class="progress-bar" style="width: {percent}%"></div>
        </div>
        <div data-tauri-drag-region={!$locked} class="controls">
          <button on:click={() => onPrevious(player.umid)}>⏮</button>
          <button on:click={() => onPlay(player.umid)}>{player.playing ? "⏸" : "⏵"}</button>
          <button on:click={() => onNext(player.umid)}>⏭</button>
        </div>
      {:else}
        <h3 data-tauri-drag-region={!$locked} class="phrase">{phrase}</h3>
        <button on:click={refreshPhrase} class="refresh">⟳</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .player-container {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    position: relative;
    overflow: hidden;

    .background {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      object-fit: cover;
      object-position: center;
      z-index: -1;
    }

    .player {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-columns: 120px 1fr;
      align-items: center;
      backdrop-filter: blur(10px);
      background-color: #0003;
      color: #efefef;
    }

    .thumbnail {
      width: 100%;
      height: 100%;
      object-fit: contain;
      background-color: #0005;
    }

    .info {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: 10px;
      overflow: hidden;
      gap: 5px;

      .title,
      .author {
        position: relative;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }

      .progress {
        width: 100%;
        height: 3px;
        background-color: #6f6f6f;
        border-radius: 10px;

        .progress-bar {
          height: 100%;
          width: 0%;
          background-color: #efefef;
          border-radius: 10px;
          transition: width 0.2s linear;
        }
      }

      .controls {
        display: flex;
        justify-content: center;
        gap: 10px;
      }

      .refresh {
        position: absolute;
        top: 10px;
        right: 10px;
      }
    }
  }

  button {
    border: none;
    background-color: transparent;
    color: #efefef;
    font-size: 18px;
    line-height: 1em;
    border-radius: 6px;
    padding: 2px 6px;

    &:hover {
      backdrop-filter: brightness(0.5);
    }

    &:active {
      backdrop-filter: brightness(0.3);
    }
  }
</style>
