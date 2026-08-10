# Video Player

Simple wrapper over native HTML5 video element.


## HTML

Player element (`<video-player></video-player>`) have some standart properties from HTMLVideoElement (`src`, `controls`, etc. — see [`VideoPlayerProperties`](./src/types/global.d.ts#VideoPlayerProperties)) but not all of them (yet).


## Scripting

Reference to the underlying `HTMLVideoElement` can be obtained via [shadow DOM's root](https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM#element.shadowroot_and_the_mode_option).

Player allows custom controls to be displayed on top of the video (see [`VideoPlayerMethods`](./src/types/global.d.ts#VideoPlayerMethods)). The custom controls themselves can be just plain `HTMLElement`s.


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

Video player can have child `<source />` elements, but only if they appended *before* `DOMContentLoaded` event was fired. Setting `src` attribute on player itself though will work as expected.
