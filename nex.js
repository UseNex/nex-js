(() => {
    const PRIMARY_CDN_URL = "https://nex-assets.pages.dev/";
    const FALLBACK_CDN_URL = "https://cdn.jsdelivr.net/gh/UseNex/assets/";

    window.nex = new Proxy({}, {
        get(registryMap, gameIdentifier) {
            if (!registryMap[gameIdentifier]) {
                registryMap[gameIdentifier] = {
                    _earlyListeners: {},
                    _element: null,
                    _earlyStartRequested: false,
                    on(eventName, eventCallback) {
                        if (this._element) {
                            this._element._registerListener(eventName, eventCallback);
                        } else {
                            if (!this._earlyListeners[eventName]) {
                                this._earlyListeners[eventName] = [];
                            }
                            this._earlyListeners[eventName].push(eventCallback);
                        }
                    },
                    start() {
                        if (this._element) {
                            this._element.start();
                        } else {
                            this._earlyStartRequested = true;
                        }
                    }
                };
            }
            return registryMap[gameIdentifier];
        }
    });

    class NexGame extends HTMLElement {
        static get observedAttributes() { return ["alias", "gid"]; }
        
        constructor() {
            super();
            this._gameHtmlContent = "";
            this._registeredListeners = {};
            this._isComponentValid = true;
            this._executionPending = false;
            this.attachShadow({ mode: "open" });
        }

        get alias() { return this.getAttribute("alias"); }
        get gid() { return this.getAttribute("gid"); }

        connectedCallback() {
            this.shadowRoot.innerHTML = `<style>:host{display:block;width:100%;height:100%;background:#000;position:relative}iframe{width:100%;height:100%;border:0;display:block}</style>`;
            
            if (!this.gid) return;

            const gameRegistry = window.nex[this.gid];

            if (gameRegistry._element) {
                this._isComponentValid = false;
                console.error(`[NEX ERROR] gID "${this.gid}" already in use.`);
                this.shadowRoot.innerHTML = `<style>:host{display:block;background:#300;color:#fff;padding:10px}</style><div>[NEX ERROR] Duplicate gID: ${this.gid}</div>`;
                return;
            }

            gameRegistry._element = this;

            if (gameRegistry._earlyStartRequested) {
                this._executionPending = true;
                delete gameRegistry._earlyStartRequested;
            }

            if (gameRegistry._earlyListeners) {
                for (const eventName in gameRegistry._earlyListeners) {
                    gameRegistry._earlyListeners[eventName].forEach(eventCallback => {
                        this._registerListener(eventName, eventCallback);
                    });
                }
                delete gameRegistry._earlyListeners;
            }

            if (this.alias) {
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", () => this.initializeGameFetch());
                } else {
                    setTimeout(() => this.initializeGameFetch(), 0);
                }
            }
        }

        disconnectedCallback() {
            if (this._isComponentValid && this.gid && window.nex[this.gid]) {
                delete window.nex[this.gid];
            }
        }

        _registerListener(eventName, eventCallback) {
            if (!this._registeredListeners[eventName]) {
                this._registeredListeners[eventName] = [];
            }
            this._registeredListeners[eventName].push(eventCallback);
        }

        _dispatchInternalEvent(eventName, eventData = {}) {
            if (!this._isComponentValid) return;
            if (this._registeredListeners[eventName]) {
                this._registeredListeners[eventName].forEach(eventCallback => eventCallback(eventData));
            }
        }

        async _raceFetch(primaryPath, fallbackPath, validatorFn) {
            const controller = new AbortController();
            const { signal } = controller;

            const makeRequest = async (baseUrl, path) => {
                const res = await fetch(baseUrl + path, { signal });
                if (!res.ok) throw new Error();
                const data = await (validatorFn.type === "json" ? res.json() : res.text());
                if (validatorFn && !validatorFn(data)) throw new Error();
                controller.abort();
                return { data, baseUrl };
            };

            return Promise.any([
                makeRequest(PRIMARY_CDN_URL, primaryPath),
                makeRequest(FALLBACK_CDN_URL, fallbackPath)
            ]);
        }

        async initializeGameFetch() {
            if (!this._isComponentValid) return;
            try {
                this._dispatchInternalEvent("progress", { progress: 5 });

                const manifestValidator = (data) => Array.isArray(data);
                manifestValidator.type = "json";

                const fastManifest = await this._raceFetch("game_list.json", "game_list.json", manifestValidator);
                let activeCdnUrl = fastManifest.baseUrl;
                const manifestData = fastManifest.data;
                
                const chunkedAssets = manifestData[0] || [];
                const streamedAssets = manifestData[1] || [];

                if (streamedAssets.includes(this.alias)) {
                    this._dispatchInternalEvent("progress", { progress: 30 });
                    const standaloneResponse = await fetch(`${activeCdnUrl}external/${this.alias}.html`);
                    this._gameHtmlContent = await standaloneResponse.text();
                } 
                else if (chunkedAssets.includes(this.alias)) {
                    const nrValidator = (data) => {
                        const txt = data.trim();
                        return txt.length > 0 && txt.length <= 10 && !isNaN(txt);
                    };
                    nrValidator.type = "text";

                    const fastNr = await this._raceFetch(`${this.alias}/nr.txt`, `${this.alias}/nr.txt`, nrValidator);
                    activeCdnUrl = fastNr.baseUrl;
                    const totalChunksCount = parseInt(fastNr.data.trim(), 10);

                    const chunkPromises = [];
                    for (let i = 1; i <= totalChunksCount; i++) {
                        chunkPromises.push(
                            fetch(`${activeCdnUrl}${this.alias}/src.part${i}.html`).then(r => r.text())
                        );
                    }

                    const chunksData = await Promise.all(chunkPromises);
                    this._gameHtmlContent = chunksData.join("");
                    this._dispatchInternalEvent("progress", { progress: 95 });
                } else {
                    throw new Error("Game not found in manifest");
                }

                this._dispatchInternalEvent("progress", { progress: 100 });
                this._dispatchInternalEvent("ready");

                if (this._executionPending) {
                    this.start();
                }
            } catch (fetchError) {
                this._dispatchInternalEvent("error", { message: fetchError.message });
            }
        }

        start() {
            if (!this._isComponentValid) return;
            if (this.shadowRoot.querySelector("iframe")) return;

            if (!this._gameHtmlContent) {
                this._executionPending = true;
                return;
            }

            const gameViewportFrame = document.createElement("iframe");
            gameViewportFrame.sandbox = "allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-pointer-lock allow-downloads";
            gameViewportFrame.allow = "autoplay; fullscreen; gamepad; pointer-lock";
            
            this.shadowRoot.appendChild(gameViewportFrame);

            const frameDocument = gameViewportFrame.contentDocument || gameViewportFrame.contentWindow.document;
            frameDocument.open();
            frameDocument.write(this._gameHtmlContent);
            frameDocument.close();
        }
    }

    customElements.define("nex-game", NexGame);
})();
