class RoutingService {

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

    static hasRoadAccess(map, position) {
        const [row, col] = position;
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];

        return directions.some(([dr, dc]) => {
            const nextRow = row + dr;
            const nextCol = col + dc;
            return map[nextRow] && map[nextRow][nextCol] === 1;
        });
    }

    static findRoute(map, start, end) {
        const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
        const queue = [start];
        const visited = new Set([start.join(",")]);
        const previous = new Map();

        while (queue.length > 0) {
            const [row, col] = queue.shift();

            if (row === end[0] && col === end[1]) {
                break;
            }

            directions.forEach(([dr, dc]) => {
                const nextRow = row + dr;
                const nextCol = col + dc;
                const key = `${nextRow},${nextCol}`;
                const canWalk = map[nextRow] && (map[nextRow][nextCol] === 1 || (nextRow === end[0] && nextCol === end[1]));

                if (canWalk && !visited.has(key)) {
                    visited.add(key);
                    previous.set(key, [row, col]);
                    queue.push([nextRow, nextCol]);
                }
            });
        }

        const endKey = end.join(",");
        if (!previous.has(endKey)) {
            return null;
        }

        const path = [];
        let current = end;

        while (current) {
            path.unshift(current);
            if (current[0] === start[0] && current[1] === start[1]) {
                break;
            }
            current = previous.get(current.join(","));
        }

        return path;
    }

    static async calculateRoute(grid, startX, startY, endX, endY) {
        const map = RoutingService.buildMap(grid);
        const start = [startY, startX];
        const end = [endY, endX];

        if (!RoutingService.hasRoadAccess(map, start) || !RoutingService.hasRoadAccess(map, end)) {
            alert("Edificios no conectados por vias: imposible calcular");
            return null;
        }

        const route = RoutingService.findRoute(map, start, end);
        if (!route) {
            alert("Sin ruta disponible: no existe conexion entre las vias");
            return null;
        }

        return route;
    }

    static highlightRoute(route) {
        RoutingService.clearRoute();

        route.forEach(([row, col]) => {
            const cell = document.querySelector(`.cell[data-x="${col}"][data-y="${row}"]`);
            if (cell) cell.classList.add("route-highlight");
        });
    }

    static clearRoute() {
        document.querySelectorAll(".route-highlight").forEach(cell => {
            cell.classList.remove("route-highlight");
        });
    }
}
