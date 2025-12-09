const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbFilePath = path.resolve(
    __dirname,
    "../../public/valorant_assets/valorant_weapons.db"
);

function openDatabase() {
    return new sqlite3.Database(dbFilePath);
}

function mapRowToWeapon(row) {
    const rawId = row.wp_id;
    const [category, ...rest] = rawId.split("_");
    const imageSlug = rest.join("_");
    return {
        id: rawId,
        name: row.wp_name,
        rarity: row.rarity,
        category,
        imageSlug,
    };
}

function getAllWeapons() {
    return new Promise((resolve, reject) => {
        const db = openDatabase();
        const query =
            "SELECT wp_id, wp_name, rarity FROM valorant_weapons";
        db.all(query, [], (error, rows) => {
            db.close();
            if (error) {
                reject(error);
                return;
            }
            const weapons = rows.map(mapRowToWeapon);
            resolve(weapons);
        });
    });
}

module.exports = {
    getAllWeapons,
};


