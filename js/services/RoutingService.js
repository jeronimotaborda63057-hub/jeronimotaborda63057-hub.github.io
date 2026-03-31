class RoutingService {

    // URL del backend del profe
    static BACKEND_URL = "http://localhost:5000/api/calculate-route";

    /**
     * Construye la matriz 0/1 que el backend de Dijkstra espera.
     * - 1  →  vía (Road, _id === "R")
     * - 0  →  todo lo demás (edificio, pasto vacío)
     */
    static buildMap(grid) {
        const map = [];
        for (let row = 0; row < grid.height; row++) {
            map[row] = [];
            for (let col = 0; col < grid.width; col++) {
                map[row][col] = grid.cells[row][col]._id === "R" ? 1 : 0;
            }
        }
        return map;
    }

    /**
     * Llama al backend con la matriz, origen y destino.
     * Devuelve un array de coordenadas [[row,col], ...] o null si no hay ruta.
     *
     * @param {Grid}   grid    - El grid actual de la ciudad
     * @param {number} startX  - Columna (x) del edificio origen
     * @param {number} startY  - Fila    (y) del edificio origen
     * @param {number} endX    - Columna (x) del edificio destino
     * @param {number} endY    - Fila    (y) del edificio destino
     */
    static async calculateRoute(grid, startX, startY, endX, endY) {
        const map = RoutingService.buildMap(grid);

        // El backend espera [fila, columna] → [y, x]
        const body = {
            map:   map,
            start: [startY, startX],
            end:   [endY,   endX]
        };

        try {
            const response = await fetch(RoutingService.BACKEND_URL, {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(body)
            });

            const data = await response.json();

            if (!response.ok) {
                // El backend devolvió 400 o 404 con un mensaje de error
                alert(`⚠️ ${data.error}`);
                return null;
            }

            return data.route; // [[row,col], [row,col], ...]

        } catch (error) {
            alert("No se pudo conectar con el servidor de rutas. ¿Está corriendo el backend?");
            console.error("Error al calcular ruta:", error);
            return null;
        }
    }

    /**
     * Resalta visualmente la ruta en el grid del DOM.
     * Añade la clase CSS "route-highlight" a cada celda del camino.
     *
     * @param {Array} route - Array de [row, col] devuelto por el backend
     */
    static highlightRoute(route) {
        // Limpia resaltados anteriores
        RoutingService.clearRoute();

        route.forEach(([row, col]) => {
            // Selecciona la celda por sus data attributes (data-x=col, data-y=row)
            const cell = document.querySelector(`.cell[data-x="${col}"][data-y="${row}"]`);
            if (cell) cell.classList.add("route-highlight");
        });
    }

    /**
     * Limpia todos los resaltados de ruta del DOM.
     */
    static clearRoute() {
        document.querySelectorAll(".route-highlight").forEach(cell => {
            cell.classList.remove("route-highlight");
        });
    }
}