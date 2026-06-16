export default {
    template: `
        <main class="page-packs">
            <h1>Packs</h1>

            <div class="packs-container" v-if="packs">
                <div class="pack-card" v-for="pack in packs">
                    <h2>{{ pack.name }}</h2>
                    <p class="pack-description">{{ pack.description }}</p>

                    <h3>Levels</h3>
                    <ul class="pack-levels">
                        <li v-for="id in pack.levels">
                            <router-link :to="'/?level=' + id">
                                <span class="type-label-sm">{{ getLevelName(id) }}</span>
                            </router-link>
                        </li>
                    </ul>
                </div>
            </div>

            <p v-else>Loading packs...</p>
        </main>
    `,

    data() {
        return {
            packs: null,
            levels: null
        };
    },

    async created() {
        const packsData = await fetch("data/packs.json").then(r => r.json());
        const levelsData = await fetch("data/levels.json").then(r => r.json());

        this.packs = packsData;
        this.levels = levelsData;
    },

    methods: {
        getLevelName(id) {
            const level = this.levels.find(l => l.id === id);
            return level ? level.name : "Unknown Level";
        }
    }
};
