(() => {
    const CDN_NODES = [
        "https://gcore.jsdelivr.net/gh/UseNex/g-assets@8ca88bc4c4ef11d0f916b42f92acc2932a20aaf5/",
        "https://testingcf.jsdelivr.net/gh/UseNex/g-assets@8ca88bc4c4ef11d0f916b42f92acc2932a20aaf5/",
        "https://quantil.jsdelivr.net/gh/UseNex/g-assets@8ca88bc4c4ef11d0f916b42f92acc2932a20aaf5/",
        "https://fastly.jsdelivr.net/gh/UseNex/g-assets@8ca88bc4c4ef11d0f916b42f92acc2932a20aaf5/",
        "https://jsdelivr.b-cdn.net/gh/UseNex/g-assets@8ca88bc4c4ef11d0f916b42f92acc2932a20aaf5/",
        "https://cdn.jsdelivr.net/gh/UseNex/g-assets@8ca88bc4c4ef11d0f916b42f92acc2932a20aaf5/",
        "https://nex-assets.pages.dev/"
    ];
    const CACHE_NAME = "nex-cache-v2";
    const MEMORY_CACHE = new Map();

    window.nex = new Proxy({}, {
        get(target, id) {
            if (!target[id]) {
                target[id] = {
                    _listeners: {},
                    _element: null,
                    _pendingStart: false,
                    on(event, callback) {
                        if (this._element) {
                            this._element._addListener(event, callback);
                        } else {
                            this._listeners[event] = this._listeners[event] || [];
                            this._listeners[event].push(callback);
                        }
                    },
                    start() {
                        if (this._element) {
                            this._element._startGame();
                        } else {
                            this._pendingStart = true;
                        }
                    }
                };
            }
            return target[id];
        }
    });

    class NexGameElement extends HTMLElement {
        static get observedAttributes() { return ["alias", "gid"]; }
        
        constructor() {
            super();
            this._htmlContent = "";
            this._listeners = {};
            this._valid = true;
            this._pending = false;
            this._controller = null;
            this._useCache = true;
            this.attachShadow({ mode: "open" });
        }

        get alias() { return this.getAttribute("alias"); }
        get gid() { return this.getAttribute("gid"); }

        attributeChangedCallback(name, oldVal, newVal) {
            if (oldVal && oldVal !== newVal && this._valid) {
                this._reset();
            }
        }

        connectedCallback() {
            this._init();
        }

        _init() {
            this.shadowRoot.innerHTML = `<style>:host{display:block;width:100%;height:100%;background:#000;position:relative}iframe{width:100%;height:100%;border:0;display:block}</style>`;
            
            if (!this.gid) return;

            const registry = window.nex[this.gid];

            if (registry._element && registry._element !== this) {
                this._valid = false;
                this.shadowRoot.innerHTML = `<style>:host{display:block;background:#300;color:#fff;padding:10px}</style><div>Duplicate gID: ${this.gid}</div>`;
                return;
            }

            registry._element = this;

            if (registry._pendingStart) {
                this._pending = true;
                delete registry._pendingStart;
            }

            if (registry._listeners) {
                Object.entries(registry._listeners).forEach(([event, callbacks]) => {
                    callbacks.forEach(cb => this._addListener(event, cb));
                });
                delete registry._listeners;
            }

            if (this.alias) {
                if (document.readyState === "loading") {
                    document.addEventListener("DOMContentLoaded", () => this._fetch());
                } else {
                    setTimeout(() => this._fetch(), 0);
                }
            }
        }

        disconnectedCallback() {
            this._cleanup();
        }

        _reset() {
            this._cleanup();
            this._htmlContent = "";
            this._pending = false;
            this._valid = true;
            this._init();
        }

        _cleanup() {
            if (this._controller) {
                this._controller.abort();
                this._controller = null;
            }
            if (this._valid && this.gid && window.nex[this.gid]) {
                delete window.nex[this.gid];
            }
            const iframe = this.shadowRoot.querySelector("iframe");
            if (iframe) iframe.remove();
            this._listeners = {};
        }

        _addListener(event, callback) {
            this._listeners[event] = this._listeners[event] || [];
            this._listeners[event].push(callback);
        }

        _emit(event, data = {}) {
            if (!this._valid) return;
            if (this._listeners[event]) {
                this._listeners[event].forEach(cb => cb(data));
            }
        }

        async _fetchWithFallback(url, options = {}, retries = 2) {
            if (MEMORY_CACHE.has(url)) {
                return MEMORY_CACHE.get(url);
            }

            for (let i = 0; i <= retries; i++) {
                try {
                    let response;
                    
                    if (this._useCache) {
                        const cache = await caches.open(CACHE_NAME).catch(() => null);
                        if (cache) {
                            response = await cache.match(url);
                            if (response) {
                                const cloned = response.clone();
                                const data = await (options.json ? cloned.json() : cloned.text());
                                MEMORY_CACHE.set(url, data);
                                return data;
                            }
                        }
                    }

                    response = await fetch(url, { ...options, signal: this._controller?.signal });
                    
                    if (!response.ok) throw new Error(`HTTP ${response.status}`);
                    
                    const data = await (options.json ? response.json() : response.text());
                    
                    if (this._useCache) {
                        const cache = await caches.open(CACHE_NAME).catch(() => null);
                        if (cache) {
                            await cache.put(url, response.clone());
                        }
                    }
                    
                    MEMORY_CACHE.set(url, data);
                    return data;
                    
                } catch (err) {
                    if (i === retries) throw err;
                    await new Promise(r => setTimeout(r, 100 * Math.pow(2, i)));
                }
            }
            throw new Error("Fetch failed after retries");
        }

        async _raceFetch(path, validator = null) {
            const cache = await caches.open(CACHE_NAME).catch(() => null);
            const cachedResults = [];

            for (const node of CDN_NODES) {
                const url = node + path;
                
                if (MEMORY_CACHE.has(url)) {
                    const data = MEMORY_CACHE.get(url);
                    if (!validator || validator(data)) {
                        return { data, baseUrl: node };
                    }
                }

                if (cache) {
                    try {
                        const response = await cache.match(url);
                        if (response) {
                            const data = validator?.type === "json" ? await response.json() : await response.text();
                            if (!validator || validator(data)) {
                                cachedResults.push({ data, baseUrl: node, url });
                            }
                        }
                    } catch (err) {
                        continue;
                    }
                }
            }

            if (cachedResults.length > 0) {
                const best = cachedResults[0];
                MEMORY_CACHE.set(best.url, best.data);
                return best;
            }

            this._controller = new AbortController();
            const { signal } = this._controller;

            const fetchFromNode = async (baseUrl) => {
                const url = baseUrl + path;
                const response = await fetch(url, { signal });
                if (!response.ok) throw new Error();
                const data = validator?.type === "json" ? await response.json() : await response.text();
                if (validator && !validator(data)) throw new Error();
                
                if (cache) {
                    try {
                        await cache.put(url, response.clone());
                    } catch (err) {}
                }
                
                MEMORY_CACHE.set(url, data);
                this._controller.abort();
                return { data, baseUrl };
            };

            return Promise.any(CDN_NODES.map(node => fetchFromNode(node)));
        }

        async _fetch() {
            if (!this._valid) return;
            
            try {
                this._emit("progress", { progress: 5 });

                const manifestValidator = (data) => Array.isArray(data) && data.length >= 2;
                manifestValidator.type = "json";

                const manifestResult = await this._raceFetch("game_list.json", manifestValidator);
                let activeCdn = manifestResult.baseUrl;
                const manifest = manifestResult.data;
                
                const chunkedGames = manifest[0] || [];
                const streamedGames = manifest[1] || [];

                if (streamedGames.includes(this.alias)) {
                    this._emit("progress", { progress: 30 });
                    const url = `${activeCdn}external/${this.alias}.html`;
                    this._htmlContent = await this._fetchWithFallback(url, { json: false });
                } 
                else if (chunkedGames.includes(this.alias)) {
                    const chunkValidator = (data) => {
                        const trimmed = data.trim();
                        return trimmed.length > 0 && trimmed.length <= 10 && !isNaN(trimmed);
                    };
                    chunkValidator.type = "text";

                    const nrResult = await this._raceFetch(`${this.alias}/nr.txt`, chunkValidator);
                    activeCdn = nrResult.baseUrl;
                    const totalChunks = parseInt(nrResult.data.trim(), 10);

                    const chunkPromises = [];
                    for (let i = 1; i <= totalChunks; i++) {
                        const url = `${activeCdn}${this.alias}/src.part${i}.html`;
                        chunkPromises.push(this._fetchWithFallback(url, { json: false }));
                    }

                    const chunks = await Promise.all(chunkPromises);
                    this._htmlContent = chunks.join("");
                    this._emit("progress", { progress: 95 });
                } else {
                    throw new Error("Game not found in manifest");
                }

                this._emit("progress", { progress: 100 });
                this._emit("ready");

                if (this._pending) {
                    this._startGame();
                }
            } catch (err) {
                if (err.name !== "AbortError") {
                    this._emit("error", { message: err.message });
                    console.error("[NEX] Load error:", err);
                }
            }
        }

        _startGame() {
            if (!this._valid) return;
            if (this.shadowRoot.querySelector("iframe")) return;

            if (!this._htmlContent) {
                this._pending = true;
                return;
            }

            const iframe = document.createElement("iframe");
            iframe.sandbox = "allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-pointer-lock allow-downloads allow-presentation allow-top-navigation-by-user-activation";
            iframe.allow = "autoplay; fullscreen; gamepad; pointer-lock; xr-spatial-tracking; clipboard-write";
            
            this.shadowRoot.appendChild(iframe);

            const doc = iframe.contentDocument || iframe.contentWindow.document;
            doc.open();
            doc.write(this._htmlContent);
            doc.close();
        }
    }

    customElements.define("nex-game", NexGameElement);
})();
