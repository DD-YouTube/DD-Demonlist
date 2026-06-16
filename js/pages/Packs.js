export default {
    template: `
        <div class="packs-page">
            <h1>Packs</h1>

            <div v-if="loading">Loading Packs…</div>
            <div v-if="error" class="error">{{ error }}</div>

            <div v-if="!loading && !error">
                <div v-for="pack in packs" :key="pack.name" class="pack">
                    <h2 @click="togglePack(pack)" class="pack-title">
                        {{ pack.name }}
                    </h2>
                    <p>{{ pack.description }}</p>

                    <transition name="fade">
                        <ul v-if="pack.open" class="level-list">
                            <li v-for="level in pack.loadedLevels" :key="level.id">
                                #{{ level.placement }} — {{ level.name }}
                            </li>
                        </ul>
                    </transition>
                </div>
            </div>
        </div>
    `,

    data() {
        return {
            packs: [],
            list: [],
            loading: true,
            error: null
        };
    },

    async created() {
        try {
            const packsResponse = await fetch("/data/packs.json");
            if (!packsResponse.ok) throw new Error("packs.json nicht gefunden");
            this.packs = await packsResponse.json();

            const listResponse = await fetch("/data/_list.json");
            if (!listResponse.ok) throw new Error("_list.json nicht gefunden");
            this.list = await listResponse.json();

            for (const pack of this.packs) {
                pack.loadedLevels = [];
                pack.open = false; // Anfangszustand: geschlossen

                for (const levelName of pack.levels) {
                    const levelResponse = await fetch(`/data/${levelName}.json`);
                    if (!levelResponse.ok) continue;

                    const levelData = await levelResponse.json();
                    const placementIndex = this.list.indexOf(levelName);
                    levelData.placement = placementIndex >= 0 ? placementIndex + 1 : "?";
                    pack.loadedLevels.push(levelData);
                }
            }

        } catch (err) {
            console.error("Fehler beim Laden:", err);
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    },

    methods: {
        togglePack(pack) {
            pack.open = !pack.open;
        }
    }
};
