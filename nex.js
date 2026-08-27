(() => {
    const XOR_KEY_BASE64 = "TkVYIFBMQVRGT1JN";
    const NEX_CACHE_STORE = "np-cache-1";
    const NEX_NODES = [
        "https://gcore.jsdelivr.net/gh/UseNex/g-assets-enc@06f7eb91be5e701521fcd2bff2298819c8f20dbd/",
        "https://testingcf.jsdelivr.net/gh/UseNex/g-assets-enc@06f7eb91be5e701521fcd2bff2298819c8f20dbd/",
        "https://quantil.jsdelivr.net/gh/UseNex/g-assets-enc@06f7eb91be5e701521fcd2bff2298819c8f20dbd/",
        "https://fastly.jsdelivr.net/gh/UseNex/g-assets-enc@06f7eb91be5e701521fcd2bff2298819c8f20dbd/",
        "https://jsdelivr.b-cdn.net/gh/UseNex/g-assets-enc@06f7eb91be5e701521fcd2bff2298819c8f20dbd/",
        "https://cdn.jsdelivr.net/gh/UseNex/g-assets-enc@06f7eb91be5e701521fcd2bff2298819c8f20dbd/"
    ];

    function xorDecrypt(data, keyBase64) {
        const keyText = atob(keyBase64);
        const keyBytes = new TextEncoder().encode(keyText);
        const result = new Uint8Array(data.length);
        const keyLen = keyBytes.length;
        for (let i = 0; i < data.length; i++) {
            result[i] = data[i] ^ keyBytes[i % keyLen];
        }
        return result;
    }

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
        static get observedAttributes() {
            return ["alias", "gid"];
        }

        constructor() {
            super();
            this._nexHtmlPayload = "";
            this._nexRegisteredListeners = {};
            this._nexComponentValid = true;
            this._nexExecutionPending = false;
            this._nexAbortController = null;
            this._nexIframe = null;
            this._nexGameData = null;
            this.attachShadow({ mode: "open" });
        }

        get alias() {
            return this.getAttribute("alias");
        }

        get gid() {
            return this.getAttribute("gid");
        }

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
            this._nexIframe = null;
            this._nexGameData = null;
            this._nexSetupBaseStorage();
        }

        _nexCleanup() {
            if (this._nexAbortController) {
                this._nexAbortController.abort();
                this._nexAbortController = null;
            }

            if (this._nexIframe) {
                try {
                    if (this._nexIframe.contentWindow) {
                        this._nexIframe.contentWindow.stop();
                        this._nexIframe.src = "about:blank";
                    }
                    this._nexIframe.remove();
                } catch (e) {
                    console.warn("[NEX] Iframe cleanup warning:", e);
                }
                this._nexIframe = null;
            }

            this.shadowRoot.querySelectorAll("iframe").forEach(iframe => {
                try {
                    iframe.src = "about:blank";
                    iframe.remove();
                } catch (e) {}
            });

            if (this._nexComponentValid && this.gid && window.nex[this.gid]) {
                delete window.nex[this.gid];
            }

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
                this._nexRegisteredListeners[nexEventName].forEach(nexEventCallback => {
                    try {
                        nexEventCallback(nexEventData);
                    } catch (e) {
                        console.error("[NEX] Event callback error:", e);
                    }
                });
            }
        }

        async _nexClearOldCache() {
            try {
                const cacheKeys = await caches.keys();
                for (const key of cacheKeys) {
                    if (key.startsWith("nex-core-cache") && key !== NEX_CACHE_STORE) {
                        await caches.delete(key);
                        console.log("[NEX] Cleared old cache:", key);
                    }
                }
            } catch (e) {
                console.warn("[NEX] Could not clear old cache:", e);
            }
        }

        async _nexFetchWithCache(nexFullUrl, nexOptions = {}) {
            try {
                const nexCache = await caches.open(NEX_CACHE_STORE);
                const nexCachedResponse = await nexCache.match(nexFullUrl);
                if (nexCachedResponse) {
                    const nexCachedTime = nexCachedResponse.headers.get("sw-cache-timestamp");
                    if (!nexCachedTime || (Date.now() - parseInt(nexCachedTime)) < 86400000) {
                        return nexCachedResponse;
                    }
                }
                const nexNetworkResponse = await fetch(nexFullUrl, nexOptions);
                if (nexNetworkResponse.ok) {
                    const nexResponseClone = nexNetworkResponse.clone();
                    const nexHeaders = new Headers(nexResponseClone.headers);
                    nexHeaders.set("sw-cache-timestamp", Date.now().toString());
                    const nexNewResponse = new Response(nexResponseClone.body, {
                        status: nexResponseClone.status,
                        statusText: nexResponseClone.statusText,
                        headers: nexHeaders
                    });
                    await nexCache.put(nexFullUrl, nexNewResponse);
                }
                return nexNetworkResponse;
            } catch (nexCacheError) {
                console.warn("[NEX] Cache fetch failed, using network:", nexCacheError);
                return fetch(nexFullUrl, nexOptions);
            }
        }

        async _nexRaceFetch(nexPath, nexValidatorFn) {
            let nexCache = null;
            try {
                nexCache = await caches.open(NEX_CACHE_STORE);
            } catch (e) {}

            for (const nexNode of NEX_NODES) {
                const nexUrl = nexNode + nexPath;
                if (nexCache) {
                    try {
                        const nexCachedResponse = await nexCache.match(nexUrl);
                        if (nexCachedResponse) {
                            const nexRawData = await (nexValidatorFn.type === "json" ? nexCachedResponse.json() : nexCachedResponse.text());
                            if (!nexValidatorFn || nexValidatorFn(nexRawData)) {
                                return { nexRawData, nexBaseUrl: nexNode };
                            }
                        }
                    } catch (err) {
                        continue;
                    }
                }
            }

            this._nexAbortController = new AbortController();
            const { signal } = this._nexAbortController;

            const nexExecuteRequest = async (nexBaseUrl) => {
                const nexUrl = nexBaseUrl + nexPath;
                const nexRes = await fetch(nexUrl, { signal });
                if (!nexRes.ok) throw new Error(`HTTP ${nexRes.status}`);
                const nexRawData = await (nexValidatorFn.type === "json" ? nexRes.json() : nexRes.text());
                if (nexValidatorFn && !nexValidatorFn(nexRawData)) throw new Error("Validation failed");

                if (nexCache) {
                    try {
                        await nexCache.put(nexUrl, nexRes.clone());
                    } catch (e) {}
                }

                if (this._nexAbortController) {
                    this._nexAbortController.abort();
                    this._nexAbortController = null;
                }
                return { nexRawData, nexBaseUrl };
            };

            try {
                return await Promise.any(NEX_NODES.map(nexNode => nexExecuteRequest(nexNode)));
            } catch (e) {
                throw new Error("All CDN nodes failed");
            }
        }

        async nexInitializeFetchPipeline() {
            if (!this._nexComponentValid) return;

            try {
                await this._nexClearOldCache();
                this._nexDispatchInternalEvent("progress", { progress: 5 });

                const gameDataValidator = (data) => {
                    return data && typeof data === "object" && !Array.isArray(data);
                };
                gameDataValidator.type = "json";

                const gameDataResult = await this._nexRaceFetch("game_data.json", gameDataValidator);
                const activeCdnUrl = gameDataResult.nexBaseUrl;
                this._nexGameData = gameDataResult.nexRawData;

                this._nexDispatchInternalEvent("progress", { progress: 20 });

                const gameKeys = Object.keys(this._nexGameData);
                const aliasFound = gameKeys.includes(this.alias);

                if (!aliasFound) {
                    throw new Error(`Game alias "${this.alias}" not found in game_data.json`);
                }

                const gameEntry = this._nexGameData[this.alias];
                const gameName = gameEntry.name || this.alias;

                const nrValidator = (data) => {
                    const trimmed = data.trim();
                    return trimmed.length > 0 && trimmed.length <= 10 && !isNaN(trimmed);
                };
                nrValidator.type = "text";

                const nrResult = await this._nexRaceFetch(`${this.alias}/nr.txt`, nrValidator);
                const totalChunks = parseInt(nrResult.nexRawData.trim(), 10);

                this._nexDispatchInternalEvent("progress", { progress: 30 });

                const chunkPromises = [];
                for (let i = 1; i <= totalChunks; i++) {
                    const chunkUrl = `${activeCdnUrl}${this.alias}/src.part${i}.txt`;
                    chunkPromises.push(
                        this._nexFetchWithCache(chunkUrl).then(async response => {
                            if (!response.ok) throw new Error(`Chunk ${i} fetch failed`);
                            const encryptedBytes = new Uint8Array(await response.arrayBuffer());
                            const decryptedBytes = xorDecrypt(encryptedBytes, XOR_KEY_BASE64);
                            return new TextDecoder("utf-8").decode(decryptedBytes);
                        })
                    );

                    const progress = 30 + ((i / totalChunks) * 65);
                    this._nexDispatchInternalEvent("progress", { progress: Math.min(progress, 95) });
                }

                const chunksData = await Promise.all(chunkPromises);
                this._nexHtmlPayload = chunksData.join("");

                this._nexDispatchInternalEvent("progress", { progress: 100 });
                this._nexDispatchInternalEvent("ready", { gameName, alias: this.alias });

                if (this._nexExecutionPending) {
                    this.start();
                }

            } catch (fetchError) {
                if (fetchError.name !== "AbortError") {
                    console.error("[NEX] Load error:", fetchError);
                    this._nexDispatchInternalEvent("error", {
                        message: fetchError.message || "Failed to load game",
                        alias: this.alias
                    });
                }
            }
        }

        start() {
            if (!this._nexComponentValid) return;

            if (this._nexIframe) {
                try {
                    if (this._nexIframe.contentWindow) {
                        this._nexIframe.contentWindow.stop();
                    }
                    this._nexIframe.src = "about:blank";
                    this._nexIframe.remove();
                } catch (e) {
                    console.warn("[NEX] Iframe cleanup before start:", e);
                }
                this._nexIframe = null;
            }

            this.shadowRoot.querySelectorAll("iframe").forEach(iframe => {
                try {
                    iframe.src = "about:blank";
                    iframe.remove();
                } catch (e) {}
            });

            if (!this._nexHtmlPayload) {
                this._nexExecutionPending = true;
                return;
            }

            const iframe = document.createElement("iframe");
            this._nexIframe = iframe;

            iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-pointer-lock allow-downloads allow-presentation allow-top-navigation-by-user-activation";
            iframe.allow = "autoplay; fullscreen; gamepad; pointer-lock; xr-spatial-tracking; clipboard-write";

            this.shadowRoot.appendChild(iframe);

            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(this._nexHtmlPayload);
            iframeDoc.close();
        }
    }

    customElements.define("nex-game", NexGame);
})();
