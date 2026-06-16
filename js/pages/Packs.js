export default {
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
            // WICHTIG: absoluter Pfad, sonst 404
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
