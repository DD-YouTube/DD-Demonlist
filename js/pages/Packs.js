export default {
    template: `
        <div class="packs-page">
            <h1 class="list-title">Packs</h1>

            <div v-if="loading">Loading Packs…</div>
            <div v-if="error" class="error">{{ error }}</div>

            <div v-if="!loading && !error">
                <div 
                    v-for="pack in packs" 
                    :key="pack.name" 
                    class="list-entry"
                    :class="{ open: pack.open }"
                >
                    <div class="list-entry-header" @click="togglePack(pack)">
                        <div class="list-entry-title">{{ pack.name }}</div>
                        <div class="list-entry-subtitle">{{ pack.description }}</div>
                    </div>

                    <div class="list-entry-content" v-if="pack.open">
                        <div 
                            v-for="level in pack.loadedLevels" 
                            :key="level.id"
                            class="list-item"
                        >
                            <div class="placement">#{{ level.placement }}</div>

                            <div class="level-info">
                                <div class="level-name">{{ level.name }}</div>
                                <div class="level-author">{{ level.creator }}</div>
                            </div>
                        </div>
                    </div>
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
            this.packs = await packsResponse.json();

            const listResponse = await fetch("/data/_list.json");
            this.list = await listResponse.json();

            for (const pack of this.packs) {
                pack.loadedLevels = [];
                pack.open = false;

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
