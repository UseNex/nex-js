(() => {
    const XOR_KEY_BASE64 = "TkVYIFBMQVRGT1JN";
    const NEX_CACHE_STORE = "np-cache-1";
    const NEX_NODES = [
        "https://gcore.jsdelivr.net/gh/UseNex/g-assets-enc@ce0db52727710424eb1d334f8ce7de707759a42a/",
        "https://testingcf.jsdelivr.net/gh/UseNex/g-assets-enc@ce0db52727710424eb1d334f8ce7de707759a42a/",
        "https://quantil.jsdelivr.net/gh/UseNex/g-assets-enc@ce0db52727710424eb1d334f8ce7de707759a42a/",
        "https://fastly.jsdelivr.net/gh/UseNex/g-assets-enc@ce0db52727710424eb1d334f8ce7de707759a42a/",
        "https://jsdelivr.b-cdn.net/gh/UseNex/g-assets-enc@ce0db52727710424eb1d334f8ce7de707759a42a/",
        "https://cdn.jsdelivr.net/gh/UseNex/g-assets-enc@ce0db52727710424eb1d334f8ce7de707759a42a/"
    ];

    const GAME_DATA = {
  "2048": {
    "name": "2048",
    "category": "Puzzle",
    "description": "Merge identical numbers to reach the legendary 2048 tile."
  },
  "1-on-1-soccer": {
    "name": "1 on 1 Soccer",
    "category": "Sports",
    "description": "Defeat your opponent in a fast-paced, head-to-head soccer match."
  },
  "1-on-1-tennis": {
    "name": "1 on 1 Tennis",
    "category": "Sports",
    "description": "Smash the ball and outsmart your rival on the tennis court."
  },
  "10-minutes-till-dawn": {
    "name": "10 Minutes Till Dawn",
    "category": "Action",
    "description": "Survive the onslaught of lovecraftian monsters for 10 intense minutes."
  },
  "12-minibattles": {
    "name": "12 MiniBattles",
    "category": "Action",
    "description": "Compete against a friend in a collection of 12 random mini-games."
  },
  "2048-cupcakes": {
    "name": "2048 Cupcakes",
    "category": "Puzzle",
    "description": "Slide matching cupcakes together to discover the ultimate sweet treat."
  },
  "3d-flight-simulator": {
    "name": "3D Flight Simulator",
    "category": "Skill",
    "description": "Take control of an airplane and master the art of flying in 3D."
  },
  "8-ball-classic": {
    "name": "8 Ball Classic",
    "category": "Sports",
    "description": "Line up your shots and clear the table in this classic pool game."
  },
  "agar.io-lite": {
    "name": "Agar.io Lite",
    "category": "Action",
    "description": "Consume smaller cells and grow into the biggest blob in the arena."
  },
  "age-of-war-2": {
    "name": "Age of War 2",
    "category": "Strategy",
    "description": "Evolve through the ages and destroy your enemy's base with advanced units."
  },
  "age-of-war": {
    "name": "Age of War",
    "category": "Strategy",
    "description": "Defend your base and wage war across historical eras to defeat the enemy."
  },
  "ages-of-conflict": {
    "name": "Ages of Conflict",
    "category": "Strategy",
    "description": "Spawn custom nations and watch them battle it out in a world simulation."
  },
  "angry-birds-showdown": {
    "name": "Angry Birds Showdown",
    "category": "Puzzle",
    "description": "Launch birds to crash through structures and defeat the pigs."
  },
  "angry-birds-space": {
    "name": "Angry Birds Space",
    "category": "Puzzle",
    "description": "Use zero-gravity and planetary orbits to sling your birds at target pigs."
  },
  "angry-birds": {
    "name": "Angry Birds",
    "category": "Puzzle",
    "description": "Launch furious birds with unique powers to demolish the pig defenses."
  },
  "awesome-tanks-2": {
    "name": "Awesome Tanks 2",
    "category": "Action",
    "description": "Upgrade your tank and blast through enemy lines in explosive battlefields."
  },
  "awesome-tanks": {
    "name": "Awesome Tanks",
    "category": "Action",
    "description": "Navigate hostile arenas, collect gold, and blow up enemy armored tanks."
  },
  "backrooms": {
    "name": "Backrooms",
    "category": "Horror",
    "description": "Explore endless liminal hallways while avoiding the terrifying monsters lurking within."
  },
  "bacon-may-die": {
    "name": "Bacon May Die",
    "category": "Action",
    "description": "Fight off waves of enemies using crazy kung-fu moves and heavy weapons."
  },
  "bad-ice-cream-2": {
    "name": "Bad Ice Cream 2",
    "category": "Puzzle",
    "description": "Collect delicious fruits and build defensive ice walls to trap monsters."
  },
  "bad-ice-cream-3": {
    "name": "Bad Ice Cream 3",
    "category": "Puzzle",
    "description": "Navigate freezing mazes, grab treats, and dodge aggressive creatures."
  },
  "bad-ice-cream": {
    "name": "Bad Ice Cream",
    "category": "Puzzle",
    "description": "Break ice blocks, gather tasty fruits, and escape the pursuing guards."
  },
  "bad-piggies": {
    "name": "Bad Piggies",
    "category": "Puzzle",
    "description": "Build custom vehicles out of scrap parts to guide the pigs safely to the finish line."
  },
  "baldis-basics": {
    "name": "Baldi's Basics",
    "category": "Horror",
    "description": "Collect notebooks while solving bizarre math puzzles to escape a creepy school."
  },
  "baseball-bros": {
    "name": "Baseball Bros",
    "category": "Sports",
    "description": "Hit home runs and make spectacular pitches in this fast arcade baseball game."
  },
  "basket-bros": {
    "name": "Basket Bros",
    "category": "Sports",
    "description": "Dunk on your friends in intense, high-flying multiplayer basketball duels."
  },
  "basket-random": {
    "name": "Basket Random",
    "category": "Sports",
    "description": "Score baskets with unpredictable controls and hilarious ragdoll physics."
  },
  "basketball-legends": {
    "name": "Basketball Legends",
    "category": "Sports",
    "description": "Play as world-famous basketball stars using epic super-shots to win matches."
  },
  "basketball-stars": {
    "name": "Basketball Stars",
    "category": "Sports",
    "description": "Show off your skills with precise shots and defensive steals on the court."
  },
  "bit-planes": {
    "name": "Bit Planes",
    "category": "Skill",
    "description": "Fly through narrow pixel gaps and maintain absolute control over your plane."
  },
  "bitlife": {
    "name": "BitLife",
    "category": "Simulation",
    "description": "Make crucial choices to live a successful or reckless virtual life simulator."
  },
  "blocky-snakes": {
    "name": "Blocky Snakes",
    "category": "Skill",
    "description": "Slither around a 3D pixel world consuming food to grow your snake."
  },
  "bloons-td-2": {
    "name": "Bloons TD 2",
    "category": "Strategy",
    "description": "Place dart-throwing monkey towers to pop waves of colorful balloons."
  },
  "bloons-td-3": {
    "name": "Bloons TD 3",
    "category": "Strategy",
    "description": "Stop balloons from escaping with new monkey towers and upgraded tracks."
  },
  "bloons-td-4": {
    "name": "Bloons TD 4",
    "category": "Strategy",
    "description": "Unlock powerful airplanes and mortar monkeys to blast incoming balloon swarms."
  },
  "bloons-td-5": {
    "name": "Bloons TD 5",
    "category": "Strategy",
    "description": "Build specialized monkey towers to pop massive zeppelins in this strategy game."
  },
  "bloons-td": {
    "name": "Bloons TD",
    "category": "Strategy",
    "description": "The classic tower defense game where monkeys pop invading balloons."
  },
  "bloxorz": {
    "name": "Bloxorz",
    "category": "Puzzle",
    "description": "Roll a rectangular block through tricky platforms into a square hole."
  },
  "blumgi-racers": {
    "name": "Blumgi Racers",
    "category": "Racing",
    "description": "Drive, flip, and utilize rocket boosts to conquer challenging arcade tracks."
  },
  "blumgi-rocket": {
    "name": "Blumgi Rocket",
    "category": "Racing",
    "description": "Blast your car into the sky with rocket boosts to cross the finish line."
  },
  "bob-the-robber-2": {
    "name": "Bob the Robber 2",
    "category": "Puzzle",
    "description": "Sneak past security guards and cameras to pull off the ultimate heist."
  },
  "bob-the-robber-5": {
    "name": "Bob the Robber 5",
    "category": "Puzzle",
    "description": "Infiltrate highly secure international targets without setting off temple alarms."
  },
  "bob-the-robber": {
    "name": "Bob the Robber",
    "category": "Puzzle",
    "description": "Steal loot from heavily guarded buildings by hiding in shadows and lockpicking."
  },
  "bouncy-motors": {
    "name": "Bouncy Motors",
    "category": "Driving",
    "description": "Drive a jelly-like bouncy car over dangerous, physics-based platforms."
  },
  "bow-masters": {
    "name": "Bow Masters",
    "category": "Action",
    "description": "Aim your bow carefully to defeat rivals in turn-based projectile combat."
  },
  "boxing-random": {
    "name": "Boxing Random",
    "category": "Sports",
    "description": "Land crazy punches with completely erratic physics-based ragdoll boxers."
  },
  "breaking-the-bank": {
    "name": "Breaking the Bank",
    "category": "Puzzle",
    "description": "Help Henry Stickmin choose bizarre tools to break into a high-security vault."
  },
  "bubble-shooter": {
    "name": "Bubble Shooter",
    "category": "Puzzle",
    "description": "Match three or more colorful bubbles to clear the screen and score points."
  },
  "candy-crush": {
    "name": "Candy Crush",
    "category": "Puzzle",
    "description": "Swap and match delicious candies to complete addictive puzzle levels."
  },
  "capybara-clicker": {
    "name": "Capybara Clicker",
    "category": "Clicker",
    "description": "Tap the giant capybara to multiply your population and unlock cool upgrades."
  },
  "car-drawing": {
    "name": "Car Drawing",
    "category": "Puzzle",
    "description": "Draw custom wheels and car frames to help your vehicle overcome tough terrain."
  },
  "chess": {
    "name": "Chess",
    "category": "Strategy",
    "description": "Outmaneuver your opponent's king in this timeless game of tactical skill."
  },
  "choppy-orc": {
    "name": "Choppy Orc",
    "category": "Puzzle",
    "description": "Throw your magical axe to create custom platform steps and rescue chests."
  },
  "circloo-2": {
    "name": "Circloo 2",
    "category": "Puzzle",
    "description": "Roll a ball inside growing circular mazes using momentum to reach circles."
  },
  "circloo": {
    "name": "Circloo",
    "category": "Puzzle",
    "description": "Control a ball in a physics-based puzzle world that expands with every level."
  },
  "clash-of-vikings": {
    "name": "Clash of Vikings",
    "category": "Strategy",
    "description": "Deploy cards and battle units to destroy the enemy king's defensive towers."
  },
  "cleanup.io": {
    "name": "Cleanup.io",
    "category": "Action",
    "description": "Drive a giant vacuum cleaner to swallow cities and grow larger than everyone."
  },
  "cluster-rush": {
    "name": "Cluster Rush",
    "category": "Skill",
    "description": "Jump across a chaotic convoy of moving trucks without falling off."
  },
  "cookie-clicker": {
    "name": "Cookie Clicker",
    "category": "Clicker",
    "description": "Click the giant cookie, hire grandmas, and optimize production pipelines."
  },
  "crazy-cars": {
    "name": "Crazy Cars",
    "category": "Racing",
    "description": "Speed through stunt tracks, fly off ramps, and gather coins at high speeds."
  },
  "crazy-cattle-3d": {
    "name": "Crazy Cattle 3D",
    "category": "Action",
    "description": "Control a mad bull rampaging through town, breaking everything in sight."
  },
  "crazy-crash-landing": {
    "name": "Crazy Crash Landing",
    "category": "Skill",
    "description": "Steer aircraft safely onto tough terrain using precise timing."
  },
  "crazy-motorcycle": {
    "name": "Crazy Motorcycle",
    "category": "Racing",
    "description": "Perform insane backflips and frontflips on dangerous dirt bike tracks."
  },
  "crossy-road": {
    "name": "Crossy Road",
    "category": "Skill",
    "description": "Hop across endless busy roads, rushing rivers, and train tracks safely."
  },
  "cut-the-rope": {
    "name": "Cut the Rope",
    "category": "Puzzle",
    "description": "Slice ropes skillfully to feed delicious candy to the cute monster Om Nom."
  },
  "dadish-2": {
    "name": "Dadish 2",
    "category": "Skill",
    "description": "Help a radish dad conquer corporate offices and swamps to rescue his kids."
  },
  "dadish-3": {
    "name": "Dadish 3",
    "category": "Skill",
    "description": "Ride a giant tomato and search through dangerous sewers for lost radish kids."
  },
  "death-chase": {
    "name": "Death Chase",
    "category": "Racing",
    "description": "Race heavily armed cars through lethal tracks full of loops and traps."
  },
  "death-run-3d": {
    "name": "Death Run 3D",
    "category": "Skill",
    "description": "Speed through a neon tunnel dodging blocks that suddenly shift positions."
  },
  "demolition-derby-crash-racing": {
    "name": "Demolition Derby Crash Racing",
    "category": "Driving",
    "description": "Smash your vehicle into rival drivers to be the last car running."
  },
  "doodle-jump": {
    "name": "Doodle Jump",
    "category": "Skill",
    "description": "Bounce up platforms endlessly while dodging black holes and shooting monsters."
  },
  "draw-climber": {
    "name": "Draw Climber",
    "category": "Puzzle",
    "description": "Draw custom legs for your cube so it can climb over obstacle blocks."
  },
  "dreadhead-parkour": {
    "name": "Dreadhead Parkour",
    "category": "Skill",
    "description": "Slide, backflip, and vault over spikes in this fast-paced parkour game."
  },
  "drift-boss": {
    "name": "Drift Boss",
    "category": "Racing",
    "description": "Drift down a tricky, endless platform track with one-button controls."
  },
  "drive-mad": {
    "name": "Drive Mad",
    "category": "Driving",
    "description": "Steer massive trucks through physics challenges without flipping upside down."
  },
  "duck-life-2": {
    "name": "Duck Life 2",
    "category": "Simulation",
    "description": "Train your duck's flying, running, and swimming stats to win the global cup."
  },
  "duck-life-3": {
    "name": "Duck Life 3",
    "category": "Simulation",
    "description": "Choose specific duck evolutions with unique strengths to dominate race leagues."
  },
  "duck-life-4": {
    "name": "Duck Life 4",
    "category": "Simulation",
    "description": "Manage a whole team of racing ducks and conquer active volcano championships."
  },
  "duck-life-5": {
    "name": "Duck Life 5",
    "category": "Simulation",
    "description": "Explore dangerous treasure caves to fund your ultimate duck racing training."
  },
  "duck-life": {
    "name": "Duck Life",
    "category": "Simulation",
    "description": "Train a baby duckling to become a legendary master racer through mini-games."
  },
  "ducklings.io": {
    "name": "Ducklings.io",
    "category": "Action",
    "description": "Swim around gathering lost ducklings and bring them safely to your nest."
  },
  "eagle-ride": {
    "name": "Eagle Ride",
    "category": "Skill",
    "description": "Soar at extreme speeds through dense forests while dodging huge trees."
  },
  "eaglercraft-1.12": {
    "name": "Eaglercraft 1.12",
    "category": "Sandbox",
    "description": "Mine, craft, and build in this classic version of Minecraft."
  },
  "eaglercraft-1.5": {
    "name": "Eaglercraft 1.5",
    "category": "Sandbox",
    "description": "Explore random retro worlds and craft tools in this early sandbox engine."
  },
  "eaglercraft-1.8": {
    "name": "Eaglercraft 1.8",
    "category": "Sandbox",
    "description": "Enjoy full multiplayer servers and creative mode blocks straight in your tab."
  },
  "earn-to-die-2": {
    "name": "Earn to Die 2",
    "category": "Driving",
    "description": "Drive armored cars through zombie hordes and upgrade parts to survive."
  },
  "earn-to-die": {
    "name": "Earn to Die",
    "category": "Driving",
    "description": "Smash through apocalyptic obstacles to reach the evacuation helicopter."
  },
  "eggy-car": {
    "name": "Eggy Car",
    "category": "Driving",
    "description": "Drive over steep hills carefully to keep the egg from falling out."
  },
  "elastic-face": {
    "name": "Elastic Face",
    "category": "Skill",
    "description": "Stretch and pull funny faces around with silly interactive physics."
  },
  "fnaf": {
    "name": "Five Nights at Freddy's",
    "category": "Horror",
    "description": "Manage security room power and doors to survive creepy animatronic robots."
  },
  "race-survival-arena-king-full": {
    "name": "Race Survival: Arena King",
    "category": "Driving",
    "description": "Ram enemy vehicles off the arena platform to claim the demolition crown."
  },
  "rooftop-snipers-2": {
    "name": "Rooftop Snipers 2",
    "category": "Action",
    "description": "Shoot opponents off various rooftops in chaotic two-player sniper physics battles."
  },
  "snow-rider-3d": {
    "name": "Snow Rider 3D",
    "category": "Driving",
    "description": "Sled down snowy slopes at high speeds while dodging massive rock hazards."
  },
  "escaping-the-prison": {
    "name": "Escaping the Prison",
    "category": "Puzzle",
    "description": "Help Henry Stickmin bust out of jail using teleporters or files."
  },
  "escape-road": {
    "name": "Escape Road",
    "category": "Driving",
    "description": "Flee from a massive police chase weaving through chaotic city traffic."
  },
  "escape-road-2": {
    "name": "Escape Road 2",
    "category": "Driving",
    "description": "Outrun advanced police vehicles with new drift mechanics and faster cars."
  },
  "the-fancy-pants-adventures-world-1": {
    "name": "The Fancy Pants Adventures: World 1",
    "category": "Skill",
    "description": "Run fast, flip, and slide through hand-drawn canvas parkour tracks."
  },
  "the-fancy-pants-adventures-world-2": {
    "name": "The Fancy Pants Adventures: World 2",
    "category": "Skill",
    "description": "Explore secret areas and bounce off angry spiders in fancy pants."
  },
  "fireboy-and-watergirl": {
    "name": "Fireboy and Watergirl: The Forest Temple",
    "category": "Puzzle",
    "description": "Solve cooperative elemental puzzles by controlling fire and water together."
  },
  "fireboy-and-watergirl-2": {
    "name": "Fireboy and Watergirl 2: The Light Temple",
    "category": "Puzzle",
    "description": "Direct light beams into target sensors to unlock ancient temple doors."
  },
  "fireboy-and-watergirl-3": {
    "name": "Fireboy and Watergirl 3: The Ice Temple",
    "category": "Puzzle",
    "description": "Freeze or melt temple paths to guide both heroes safely home."
  },
  "fireboy-and-watergirl-4": {
    "name": "Fireboy and Watergirl 4: The Crystal Temple",
    "category": "Puzzle",
    "description": "Teleport across platforms using crystal portals to clear clever maze challenges."
  },
  "evil-glitch": {
    "name": "Evil Glitch",
    "category": "Action",
    "description": "Shoot invading digital bugs before they corrupt your local retro grid."
  },
  "fruit-ninja": {
    "name": "Fruit Ninja",
    "category": "Skill",
    "description": "Slice flying fruit with swift mouse strokes while avoiding active bombs."
  },
  "football-bros": {
    "name": "Football Bros",
    "category": "Sports",
    "description": "Pass, intercept, and score touchdowns in stylized arcade football matches."
  },
  "football-legends": {
    "name": "Football Legends",
    "category": "Sports",
    "description": "Execute powerful trick-shots to win tournament cups against star players."
  },
  "fnaf-4": {
    "name": "Five Nights at Freddy's 4",
    "category": "Horror",
    "description": "Flash your flashlight and monitor dark bedroom doors against nightmare bots."
  },
  "fnaf-3": {
    "name": "Five Nights at Freddy's 3",
    "category": "Horror",
    "description": "Reboot failing system monitors to keep Springtrap away from your office."
  },
  "fnaf-2": {
    "name": "Five Nights at Freddy's 2",
    "category": "Horror",
    "description": "Wind up the music box and use a mask to fool incoming animatronics."
  },
  "the-flood-runner-4": {
    "name": "The Flood Runner 4",
    "category": "Skill",
    "description": "Sprint away from a massive tidal wave, jumping and gliding over obstacles."
  },
  "the-flood-runner-3": {
    "name": "The Flood Runner 3",
    "category": "Skill",
    "description": "Outrun apocalyptic floods while fighting off flying dragons along the path."
  },
  "the-flood-runner-2": {
    "name": "The Flood Runner 2",
    "category": "Skill",
    "description": "Sprint up branches and bounce high to escape rising ocean waves."
  },
  "flappy-bird": {
    "name": "Flappy Bird",
    "category": "Skill",
    "description": "Tap rhythmically to guide a clumsy bird through a maze of green pipes."
  },
  "a-dark-room": {
    "name": "A Dark Room",
    "category": "Strategy",
    "description": "Stoke a fading fire to embark on a deep text-based survival adventure."
  },
  "slope": {
    "name": "Slope",
    "category": "Skill",
    "description": "Control a bowling ball down an endless, steep neon city obstacle slope."
  },
  "volley-random": {
    "name": "Volley Random",
    "category": "Sports",
    "description": "Hit volleyballs over the net using goofy one-button physics controls."
  },
  "polytrack": {
    "name": "PolyTrack",
    "category": "Racing",
    "description": "Race against time loops on loops in a high-speed minimalist racer."
  },
  "space-waves": {
    "name": "Space Waves",
    "category": "Skill",
    "description": "Navigate a flying wave icon through narrow tunnels filled with spike walls."
  },
  "granny": {
    "name": "Granny",
    "category": "Horror",
    "description": "Sneak past a ruthless granny while searching for escape items in a creaky, trap-filled house."
  },
  "granny-2": {
    "name": "Granny 2",
    "category": "Horror",
    "description": "Sneak past Granny and Grandpa to find escape items in a creepy house."
  },
  "zrist": {
    "name": "Zrist",
    "category": "Skill",
    "description": "Dodge red blocks and tricky hazards to master every rule."
  },
  "motherload": {
    "name": "MotherLoad",
    "category": "Strategy",
    "description": "Mine rare minerals and upgrade your pod to survive Mars."
  },
  "funny-battle": {
    "name": "Funny Battle",
    "category": "Strategy",
    "description": "Deploy crazy ragdoll armies and build hilarious strategies to crush enemies."
  },
  "funny-battle-2": {
    "name": "Funny Battle 2",
    "category": "Strategy",
    "description": "Create chaotic ragdoll armies and control custom units to dominate hilarious battlefields."
  },
  "funny-mad-racing": {
    "name": "Funny Mad Racing",
    "category": "Driving",
    "description": "Drive bouncy pixel cars over crazy obstacles without flipping or crashing."
  },
  "kittytoy": {
    "name": "KittyToy",
    "category": "Sandbox",
    "description": "Attract cute stray cats and build the ultimate kitty paradise!"
  },
  "funny-shooter-2": {
    "name": "Funny Shooter 2",
    "category": "Action",
    "description": "Grab your gun, dodge bullets, and take down waves of hilarious foes!"
  },
  "geometry-dash": {
    "name": "Geometry Dash (Scratch)",
    "category": "Skill",
    "description": "Jump, fly, and flip your way through rhythm-based action-platforming."
  },
  "geometry-dash-lite": {
    "name": "Geometry Dash Lite",
    "category": "Skill",
    "description": "Tap to the beat, dodge obstacles, and master the free introductory levels of Geometry Dash!"
  }
};

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

    // Metadata API helper
    function getGameMetadata(alias) {
        const game = GAME_DATA[alias];
        if (!game) return null;
        
        return {
            alias: alias,
            name: game.name || alias,
            category: game.category || "Unknown",
            description: game.description || "",
            img: `https://cdn.jsdelivr.net/gh/UseNex/thumbnails@main/${alias}.webp`
        };
    }

    function getAllAliases() {
        return Object.keys(GAME_DATA);
    }

    function getAllMetadata() {
        const result = {};
        for (const alias of Object.keys(GAME_DATA)) {
            result[alias] = getGameMetadata(alias);
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

    // Metadata API op window.nex
    window.nex.metadata = {
        getAllAliases: getAllAliases,
        getAllMetadata: getAllMetadata,
        get: getGameMetadata,
        getAlias: (alias) => getGameMetadata(alias)
    };

    // Proxy voor nex.metadata.alias.(naam)
    window.nex.metadata.alias = new Proxy({}, {
        get(target, alias) {
            return getGameMetadata(alias);
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
                if (nexCachedResponse && nexCachedResponse.ok) {
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

            if (nexCache) {
                for (const nexNode of NEX_NODES) {
                    const nexUrl = nexNode + nexPath;
                    try {
                        const nexCachedResponse = await nexCache.match(nexUrl);
                        if (nexCachedResponse && nexCachedResponse.ok) {
                            let nexRawData;
                            if (nexValidatorFn && nexValidatorFn.type === "json") {
                                nexRawData = await nexCachedResponse.json();
                            } else {
                                nexRawData = await nexCachedResponse.text();
                            }
                            if (!nexValidatorFn || nexValidatorFn(nexRawData)) {
                                return { nexRawData, nexBaseUrl: nexNode };
                            }
                        }
                    } catch (err) {
                        continue;
                    }
                }
            }

            const fetchWithTimeout = (url, timeout = 15000) => {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);
                return fetch(url, { signal: controller.signal })
                    .then(response => {
                        clearTimeout(timeoutId);
                        return response;
                    })
                    .catch(err => {
                        clearTimeout(timeoutId);
                        throw err;
                    });
            };

            const promises = NEX_NODES.map(async (nexNode) => {
                const nexUrl = nexNode + nexPath;
                const response = await fetchWithTimeout(nexUrl);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                let nexRawData;
                if (nexValidatorFn && nexValidatorFn.type === "json") {
                    nexRawData = await response.json();
                } else {
                    nexRawData = await response.text();
                }
                if (nexValidatorFn && !nexValidatorFn(nexRawData)) throw new Error("Validation failed");
                if (nexCache) {
                    try {
                        const nexResClone = response.clone();
                        const nexHeaders = new Headers(nexResClone.headers);
                        nexHeaders.set("sw-cache-timestamp", Date.now().toString());
                        const nexNewResponse = new Response(nexResClone.body, {
                            status: nexResClone.status,
                            statusText: nexResClone.statusText,
                            headers: nexHeaders
                        });
                        await nexCache.put(nexUrl, nexNewResponse);
                    } catch (e) {}
                }
                return { nexRawData, nexBaseUrl: nexNode };
            });

            try {
                return await Promise.any(promises);
            } catch (e) {
                throw new Error("All CDN nodes failed");
            }
        }

        async nexInitializeFetchPipeline() {
            if (!this._nexComponentValid) return;

            try {
                await this._nexClearOldCache();
                this._nexDispatchInternalEvent("progress", { progress: 5 });

                // Gebruik ingebouwde GAME_DATA ipv externe JSON
                this._nexGameData = GAME_DATA;

                this._nexDispatchInternalEvent("progress", { progress: 20 });

                const gameKeys = Object.keys(this._nexGameData);
                const aliasFound = gameKeys.includes(this.alias);

                if (!aliasFound) {
                    throw new Error(`Game alias "${this.alias}" not found in GAME_DATA`);
                }

                const gameEntry = this._nexGameData[this.alias];
                const gameName = gameEntry.name || this.alias;

                // Gebruik eerste CDN node als base
                const activeCdnUrl = NEX_NODES[0];

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
