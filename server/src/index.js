const cors = require("cors");
const express = require("express");
const { getAllWeapons } = require("./valorantRepository");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/valorant/weapons", async (request, response) => {
    try {
        const weapons = await getAllWeapons();
        response.json(weapons);
    } catch (error) {
        response.status(500).json({
            error: "Failed to load Valorant weapons data",
        });
    }
});

const port = process.env.PORT || 4000;

app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Valorant backend is running on port ${port}`);
});


