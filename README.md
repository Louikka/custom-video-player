# Video Player

Simple wrapper over native HTML5 video element.


## HTML

Player element (`<video-player></video-player>`) have some standart properties from HTMLVideoElement (`src`, `controls`, etc.).

On top of that, it also accepts next custom properties:
- `hide-progress` — hides progress bar and disables related key bindings.


## Scripting

Value of playback jumping via key bindings (LeftArrow/RightArrow) can be set with [`setJumpValue`](./src/lib/shared.svelte.ts#setJumpValue).

Player allows custom controls to be displayed on top of the video. Use exported functions (like [`addElementToCanvas`](./src/lib/shared.svelte.ts#addElementToCanvas) or [`clearCanvas`](./src/lib/shared.svelte.ts#clearCanvas)) to manage custom controls lifecycle. The custom controls themselves are just plain `HTMLElement`s that must be passed to the add function.


## Styling

Video player color theme can be customized via CSS custom properties (aka variables).

> Note, that this CSS variables must be placed somewhere where they can be seen by custom element.

Available properties to edit:
- `--video-player-bg` — background color.
- `--video-player-bg-hover` — background color for hovered elements.
- `--video-player-border` — border color.
- `--video-player-color` — color of the text/icons.
- `--video-player-accent-color` — accent color.
