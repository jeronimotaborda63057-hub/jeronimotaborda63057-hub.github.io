class GridRenderer {

    static buildingImages = {
        "R1": "../../assets/icons/House.png",
        "R2": "../../assets/icons/Apartment.png",
        "C1": "../../assets/icons/Store.png",
        "C2": "../../assets/icons/Mall.png",
        "I1": "../../assets/icons/Factory.png",
        "I2": "../../assets/icons/Farm.png",
        "S1": "../../assets/icons/Police-station.png",
        "S2": "../../assets/icons/Firefighter-station.png",
        "S3": "../../assets/icons/Hospital.png",
        "U1": "../../assets/icons/Power-plant.png",
        "U2": "../../assets/icons/Water-plant.png",
        "P1": "../../assets/icons/Park.png",
        "R": "../../assets/icons/Road.png"
    };

    static render(grid, container) {
        container.innerHTML = "";
        let html = "";

        for (let row = 0; row < grid.height; row++) {
            html += `<tr>`;
            for (let col = 0; col < grid.width; col++) {
                const cell = grid.cells[row][col];
                html += `<td class="cell" data-x="${col}" data-y="${row}">`;

                if (cell.id !== "g") {
                    const img = GridRenderer.buildingImages[cell.id];
                    if (img) {
                        const isRoad = cell.id === "R";
                        html += `<img src="${img}" class="cell-icon${isRoad ? ' road-icon' : ''}"/>`;
                    }
                }

                html += `</td>`;
            }
            html += `</tr>`;
        }

        container.innerHTML = html;
    }
}