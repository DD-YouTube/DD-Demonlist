export default {
    template: `
        <main class="page-list">
            <div class="list-container">
                <h1 class="list-title">GLCL</h1>

                <table class="list">
                    <tbody>
                        <tr 
                            v-for="level in levels" 
                            :key="level.name"
                            class="level"
                        >
                            <td class="rank">#{{ level.placement }}</td>

                            <td class="level">
                                <button @click="openLevel(level)">
                                    {{ level.name }} — {{ level.creator }}
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </main>
    `,

    data() {
        return {
            levels: []
        };
    },

    async created() {
        // 1. Reihenfolge laden
        const orderResponse = await fetch("/data/GLCL/_list.json");
        const order = await orderResponse.json();

        // 2. Placements laden
        const placementResponse = await fetch("/data/GLCL/_placements.json");
        const placements = await placementResponse.json();

        const loaded = [];

        // 3. Leveldaten laden
        for (const levelName of order) {
            const response = await fetch(`/data/GLCL/${levelName}.json`);
            if (!response.ok) continue;

            const data = await response.json();

            // ⭐ Placement aus _placements.json
            data.placement = placements[levelName] ?? "?";

            loaded.push(data);
        }

        this.levels = loaded;
    },

    methods: {
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
