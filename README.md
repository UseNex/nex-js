# NexGame Component Documentation
```html
<script src="https://cdn.jsdelivr.net/gh/UseNex/nex-js@8ec0d5475baacc373a43c7afcc04442075b67f87/nex.min.js"></script>
```

## Overview

`NexGame` is a lightweight, performance-optimized custom HTML5 element (`<nex-game>`) designed to fetch, cache, and securely execute web games. It utilizes a race-fetch strategy across multiple CDN nodes, aggregates chunked assets, implements robust Cache Storage caching to minimize cellular data usage, and executes payloads within an isolated, high-permission sandbox iframe.

---

## Component Attributes

| Attribute | Type | Description |
| --- | --- | --- |
| `alias` | `string` | The unique identifier name of the target game (e.g., `"fnaf"`). |
| `gid` | `string` | A unique session identifier used to map events and prevent instance duplication. |

---

## Global API (`window.nex`)

The component exposes a reactive registry proxy attached to `window.nex[gid]`.

### Methods

#### `on(eventName, callback)`

Registers an event listener for a specific lifecycle phase. Can be declared before the DOM element is instantiated.

* **`eventName`**: `"progress"` | `"ready"` | `"error"`
* **`callback`**: `(data: Object) => void`

#### `start()`

Triggers the execution and rendering of the game inside the shadow DOM sandbox. If the assets are still downloading, execution remains pending until the `"ready"` event fires.

---

## Lifecycle Events

### `progress`

Fired continuously during the manifest lookup and chunk download phases.

* **Payload**: `{ progress: number }`

### `ready`

Fired when the entire HTML payload has been successfully fetched, validated, merged, and cached. The game is now primed for execution.

* **Payload**: `void`

### `error`

Fired when a network failure occurs, the validator rejects a payload, or the alias does not exist.

* **Payload**: `{ message: string }`

---

## Technical Architecture Features

* **Array-Driven Race Fetch:** Queries all CDN endpoints simultaneously. The fastest successful response resolves the request, while slower pending requests are instantly aborted via `AbortController`.
* **Aggressive Cache-First Strategy:** All network requests check the `nex-core-cache-v1` Cache Storage API before hitting the network, eliminating repetitive data consumption over mobile/4G networks.
* **Self-Healing Runtime:** Listens to live attribute alterations (`alias`, `gid`) via `attributeChangedCallback`, gracefully terminating active streams, clearing event registries, and hot-reloading new game pipelines without layout shifting.
* **Unrestricted Sandbox Iframe:** Injects the game into an isolated Shadow DOM container with maximized permissions allowed for feature policy capabilities (pointer-lock, local storage, audio autoplay, gamepad API).
