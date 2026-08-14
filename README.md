# Video Player

Simple wrapper over native HTML5 video element.


## HTML

Player element (`<video-player>`) have some standart attributes and properties from HTMLVideoElement (`src`, `controls`, etc.) but not all of them (yet). The aim is to fully mimic standart `<video>` element.


## Scripting

Reference to the underlying `HTMLVideoElement` can be obtained via [shadow DOM's root](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#element.shadowroot_and_the_mode_option).

Player allows custom controls to be displayed on top of the video (see [`canvas` property](./src/lib/components/video-player.ts#VideoPlayerCanvas)). The custom controls themselves can be just plain `HTMLElement`s.


## Styling

Video player color theme can be customized via CSS custom properties (aka variables).

> Note, that this CSS variables must be placed somewhere where they can be seen by custom element.

Available properties to edit:
- `--video-player-bg` — background color.
- `--video-player-bg-hover` — background color for hovered elements.
- `--video-player-border` — border color.
- `--video-player-color` — color of the text/icons.
- `--video-player-accent-color` — accent color.


## Important notes

`<source />` elements are not supported, only `src` attribute on the player itself.
