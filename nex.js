(() => {
    const NEX_NODES = [
        "https://nex-assets.pages.dev/",
        "https://cdn.jsdelivr.net/gh/UseNex/g-assets/"
    ];
    const NEX_CACHE_STORE = "nex-core-cache-v1";

    window.nex = new Proxy({}, {
        get(nexRegistry, nexIdentifier) {
            if (!nexRegistry[nexIdentifier]) {
                nexRegistry[nexIdentifier] = {
                    _nexEarlyListeners: {},
                    _nexElement: null,
                    _nexEarlyStartRequested: false,
                    on(nexEventName, nexEventCallback) {
                        if (this._nexElement) {
                            this._nexElement._nexRegisterListener(nexEventName, nexEventCallback);
                        } else {
                            if (!this._nexEarlyListeners[nexEventName]) {
                                this._nexEarlyListeners[nexEventName] = [];
                            }
                            this._nexEarlyListeners[nexEventName].push(nexEventCallback);
                        }
                    },
                    start() {
                        if (this._nexElement) {
                            this._nexElement.start();
                        } else {
                            this._nexEarlyStartRequested = true;
                        }
                    }
                };
            }
            return nexRegistry[nexIdentifier];
        }
    });

    class NexGame extends HTMLElement {
        static get observedAttributes() { return ["alias", "gid"]; }
        
        constructor() {
            super();
            this._nexHtmlPayload = "";
            this._nexRegisteredListeners = {};
            this._nexComponentValid = true;
            this._nexExecutionPending = false;
            this._nexAbortController = null;
            this.attachShadow({ mode: "open" });
        }

        get alias() { return this.getAttribute("alias"); }
        get gid() { return this.getAttribute("gid"); }

        attributeChangedCallback(nexAttrName, nexOldVal, nexNewVal) {
            if (nexOldVal && nexOldVal !== nexNewVal && this._nexComponentValid) {
                this._nexResetAndReload();
            }
        }

        connectedCallback() {
            this._nexSetupBaseStorage();
        }

        _nexSetupBaseStorage() {
            this.shadowRoot.innerHTML = `<style>:host{display:block;width:100%;height:100%;background:#000;position:relative}iframe{width:100%;height:100%;border:0;display:block}</style>`;
            
            if (!this.gid) return;

            const nexGameRegistry = window.nex[this.gid];

            if (nexGameRegistry._nexElement && nexGameRegistry._nexElement !== this) {
                this._nexComponentValid = false;
                console.error(`[NEX ERROR] gID "${this.gid}" already in use.`);
                this.shadowRoot.innerHTML = `<style>:host{display:block;background:#300;color:#fff;padding:10px}</style><div>[NEX ERROR] Duplicate gID: ${this.gid}</div>`;
                return;
            }

            nexGameRegistry._nexElement = this;

            if (nexGameRegistry._nexEarlyStartRequested) {
                this._nexExecutionPending = true;
                delete nexGameRegistry._nexEarlyStartRequested;
            }

            if (nexGameRegistry._nexEarlyListeners) {
                for (const nexEventName in nexGameRegistry._nexEarlyListeners) {
                    nexGameRegistry._nexEarlyListeners[nexEventName].forEach(nexEventCallback => {
                        this._nexRegisterListener(nexEventName, nexEventCallback);
                    });
                }
                delete nexGameRegistry._nexEarlyListeners;
            }

            if (this.alias) {
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", () => this.nexInitializeFetchPipeline());
                } else {
                    setTimeout(() => this.nexInitializeFetchPipeline(), 0);
                }
            }
        }

        disconnectedCallback() {
            this._nexCleanup();
        }

        _nexResetAndReload() {
            this._nexCleanup();
            this._nexHtmlPayload = "";
            this._nexExecutionPending = false;
            this._nexComponentValid = true;
            this._nexSetupBaseStorage();
        }

        _nexCleanup() {
            if (this._nexAbortController) {
                this._nexAbortController.abort();
            }
            if (this._nexComponentValid && this.gid && window.nex[this.gid]) {
                delete window.nex[this.gid];
            }
            const nexTargetIframe = this.shadowRoot.querySelector("iframe");
            if (nexTargetIframe) nexTargetIframe.remove();
            this._nexRegisteredListeners = {};
        }

        _nexRegisterListener(nexEventName, nexEventCallback) {
            if (!this._nexRegisteredListeners[nexEventName]) {
                this._nexRegisteredListeners[nexEventName] = [];
            }
            this._nexRegisteredListeners[nexEventName].push(nexEventCallback);
        }

        _nexDispatchInternalEvent(nexEventName, nexEventData = {}) {
            if (!this._nexComponentValid) return;
            if (this._nexRegisteredListeners[nexEventName]) {
                this._nexRegisteredListeners[nexEventName].forEach(nexEventCallback => nexEventCallback(nexEventData));
            }
        }

        async _nexFetchWithCache(nexFullUrl, nexOptions = {}) {
            try {
                const nexCache = await caches.open(NEX_CACHE_STORE);
                const nexCachedResponse = await nexCache.match(nexFullUrl);
                if (nexCachedResponse) {
                    return nexCachedResponse;
                }
                const nexNetworkResponse = await fetch(nexFullUrl, nexOptions);
                if (nexNetworkResponse.ok) {
                    await nexCache.put(nexFullUrl, nexNetworkResponse.clone());
                }
                return nexNetworkResponse;
            } catch (nexCacheError) {
                return fetch(nexFullUrl, nexOptions);
            }
        }

        async _nexRaceFetch(nexPath, nexValidatorFn) {
            const nexCache = await caches.open(NEX_CACHE_STORE);
            
            for (const nexNode of NEX_NODES) {
                const nexUrl = nexNode + nexPath;
                const nexCachedResponse = await nexCache.match(nexUrl);
                if (nexCachedResponse) {
                    const nexRawData = await (nexValidatorFn.type === "json" ? nexCachedResponse.json() : nexCachedResponse.text());
                    if (!nexValidatorFn || nexValidatorFn(nexRawData)) {
                        return { nexRawData, nexBaseUrl: nexNode };
                    }
                }
            }

            this._nexAbortController = new AbortController();
            const { signal } = this._nexAbortController;

            const nexExecuteRequest = async (nexBaseUrl) => {
                const nexUrl = nexBaseUrl + nexPath;
                const nexRes = await fetch(nexUrl, { signal });
                if (!nexRes.ok) throw new Error();
                const nexRawData = await (nexValidatorFn.type === "json" ? nexRes.json() : nexRes.text());
                if (nexValidatorFn && !nexValidatorFn(nexRawData)) throw new Error();
                
                try {
                    await nexCache.put(nexUrl, nexRes.clone());
                } catch (e) {}

                this._nexAbortController.abort(); 
                return { nexRawData, nexBaseUrl };
            };

            return Promise.any(NEX_NODES.map(nexNode => nexExecuteRequest(nexNode)));
        }

        async nexInitializeFetchPipeline() {
            if (!this._nexComponentValid) return;
            try {
                this._nexDispatchInternalEvent("progress", { progress: 5 });

                const nexManifestValidator = (nexData) => Array.isArray(nexData) && nexData.length >= 2;
                nexManifestValidator.type = "json";

                const nexFastManifest = await this._nexRaceFetch("game_list.json", nexManifestValidator);
                let nexActiveCdnUrl = nexFastManifest.nexBaseUrl;
                const nexManifestData = nexFastManifest.nexRawData;
                
                const nexChunkedAssets = nexManifestData[0] || [];
                const nexStreamedAssets = nexManifestData[1] || [];

                if (nexStreamedAssets.includes(this.alias)) {
                    this._nexDispatchInternalEvent("progress", { progress: 30 });
                    const nexStandaloneUrl = `${nexActiveCdnUrl}external/${this.alias}.html`;
                    const nexStandaloneResponse = await this._nexFetchWithCache(nexStandaloneUrl);
                    if (!nexStandaloneResponse.ok) throw new Error("Streamed file payload invalid");
                    this._nexHtmlPayload = await nexStandaloneResponse.text();
                } 
                else if (nexChunkedAssets.includes(this.alias)) {
                    const nexNrValidator = (nexData) => {
                        const nexTxt = nexData.trim();
                        return nexTxt.length > 0 && nexTxt.length <= 10 && !isNaN(nexTxt);
                    };
                    nexNrValidator.type = "text";

                    const nexFastNr = await this._nexRaceFetch(`${this.alias}/nr.txt`, nexNrValidator);
                    nexActiveCdnUrl = nexFastNr.nexBaseUrl;
                    const nexTotalChunksCount = parseInt(nexFastNr.nexRawData.trim(), 10);

                    const nexChunkPromises = [];
                    for (let nexIndex = 1; nexIndex <= nexTotalChunksCount; nexIndex++) {
                        const nexChunkUrl = `${nexActiveCdnUrl}${this.alias}/src.part${nexIndex}.html`;
                        nexChunkPromises.push(
                            this._nexFetchWithCache(nexChunkUrl).then(nexResult => {
                                if (!nexResult.ok) throw new Error(`Chunk ${nexIndex} fetch failed`);
                                return nexResult.text();
                            })
                        );
                    }

                    const nexChunksData = await Promise.all(nexChunkPromises);
                    this._nexHtmlPayload = nexChunksData.join("");
                    this._nexDispatchInternalEvent("progress", { progress: 95 });
                } else {
                    throw new Error("Game not found in manifest");
                }

                this._nexDispatchInternalEvent("progress", { progress: 100 });
                this._nexDispatchInternalEvent("ready");

                if (this._nexExecutionPending) {
                    this.start();
                }
            } catch (nexFetchError) {
                if (nexFetchError.name !== "AbortError") {
                    this._nexDispatchInternalEvent("error", { message: nexFetchError.message });
                }
            }
        }

        start() {
            if (!this._nexComponentValid) return;
            if (this.shadowRoot.querySelector("iframe")) return;

            if (!this._nexHtmlPayload) {
                this._nexExecutionPending = true;
                return;
            }

            const nexGameViewportFrame = document.createElement("iframe");
            
            nexGameViewportFrame.sandbox = "allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-pointer-lock allow-downloads allow-presentation allow-top-navigation-by-user-activation";
            nexGameViewportFrame.allow = "autoplay; fullscreen; gamepad; pointer-lock; xr-spatial-tracking; clipboard-write";
            
            this.shadowRoot.appendChild(nexGameViewportFrame);

            const nexFrameDocument = nexGameViewportFrame.contentDocument || nexGameViewportFrame.contentWindow.document;
            nexFrameDocument.open();
            nexFrameDocument.write(this._nexHtmlPayload);
            nexFrameDocument.close();
        }
    }

    customElements.define("nex-game", NexGame);
})();
