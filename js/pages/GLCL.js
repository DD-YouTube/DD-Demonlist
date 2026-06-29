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
        // Placements + Reihenfolge laden
        const placementResponse = await fetch("/data/GLCL/_placements.json");
        const placementList = await placementResponse.json();

        const loaded = [];

        for (const entry of placementList) {
            const response = await fetch(`/data/GLCL/${entry.name}.json`);
            if (!response.ok) continue;

            const data = await response.json();

            data.placement = entry.placement;

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
