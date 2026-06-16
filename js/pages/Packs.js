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
                        <li v-for="level in pack.loadedLevels" :key="level.id">
                            #{{ level.placement }} — {{ level.name }}
                        </li>
                    </ul>
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
            // Packs laden
            const packsResponse = await fetch("/data/packs.json");
            if (!packsResponse.ok) throw new Error("packs.json nicht gefunden");
            this.packs = await packsResponse.json();

            // Platzierungen laden
            const listResponse = await fetch("/data/_list.json");
            if (!listResponse.ok) throw new Error("_list.json nicht gefunden");
            this.list = await listResponse.json();

            // Für jedes Pack Level-Dateien laden
            for (const pack of this.packs) {
                pack.loadedLevels = [];

                for (const levelName of pack.levels) {
                    const levelResponse = await fetch(`/data/${levelName}.json`);

                    if (!levelResponse.ok) {
                        console.warn(`Level-Datei fehlt: ${levelName}.json`);
                        continue;
                    }

                    const levelData = await levelResponse.json();

                    // Platzierung bestimmen
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
    }
};
