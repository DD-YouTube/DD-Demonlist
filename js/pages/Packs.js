export default {
    template: `
        <div class="packs-page">
            <h1>Packs</h1>

            <div v-if="loading">Loading Packs…</div>
            <div v-if="error" class="error">{{ error }}</div>

            <div v-if="!loading && !error">
                <div v-for="pack in packs" :key="pack.name" class="pack">
                    <h2>{{ pack.name }}</h2>
                    <p>{{ pack.description }}</p>

                    <ul>
                        <li v-for="id in pack.levels" :key="id">
                            {{ getLevelName(id) }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    `,

    data() {
        return {
            packs: [],
            levels: [],
            loading: true,
            error: null
        };
    },

    async created() {
        try {
            const packsResponse = await fetch("/data/packs.json");
            const levelsResponse = await fetch("/data/levels.json");

            if (!packsResponse.ok) throw new Error("packs.json nicht gefunden");
            if (!levelsResponse.ok) throw new Error("levels.json nicht gefunden");

            this.packs = await packsResponse.json();
            this.levels = await levelsResponse.json();

        } catch (err) {
            console.error("Fehler beim Laden:", err);
            this.error = err.message;
        } finally {
            this.loading = false;
        }
    },

    methods: {
        getLevelName(id) {
            const level = this.levels.find(l => l.id === id);
            return level ? level.name : "Unbekanntes Level";
        }
    }
};
