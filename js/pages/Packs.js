export default {
    template: `
        <div class="packs-page">

            <!-- Linke Sidebar -->
            <div class="packs-sidebar">
                <button 
                    v-for="pack in packs" 
                    :key="pack.name"
                    class="pack-button"
                    @click="selectPack(pack)"
                    :class="{ active: selectedPack && selectedPack.name === pack.name }"
                >
                    {{ pack.name }}
                </button>
            </div>

            <!-- Rechte Seite -->
            <div class="packs-content" v-if="selectedPack">
                <h1 class="pack-title">{{ selectedPack.name }}</h1>

                <div 
                    v-for="level in selectedPack.loadedLevels" 
                    :key="level.id"
                    class="list-item"
                    @click="openLevel(level)"
                >
                    <div class="placement">#{{ level.placement }}</div>

                    <div class="level-info">
                        <div class="level-name">{{ level.name }}</div>
                        <div class="level-author">{{ level.creator }}</div>

                        <!-- ⭐ Beschreibung -->
                        <div 
                            v-if="level.description"
                            class="level-description"
                        >
                            {{ level.description }}
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
            selectedPack: null,
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

                for (const levelName of pack.levels) {
                    const levelResponse = await fetch(`/data/${levelName}.json`);
                    if (!levelResponse.ok) continue;

                    const levelData = await levelResponse.json();
                    const placementIndex = this.list.indexOf(levelName);
                    levelData.placement = placementIndex >= 0 ? placementIndex + 1 : "?";

                    pack.loadedLevels.push(levelData);
                }
            }

            this.selectedPack = this.packs[0];

        } catch (err) {
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    },

    methods: {
        selectPack(pack) {
            this.selectedPack = pack;
        },

        // ⭐ Öffnet Verification-Link in neuem Tab
        openLevel(level) {
            const url = level.verification || level.video || level.link;

            if (url) {
                window.open(url, "_blank");
            } else {
                console.warn("Kein Verification-Link für Level:", level.name);
            }
        }
    }
};
