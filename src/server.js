require("dotenv").config();
const app = require("./app");
const port = Number(process.env.PORT) || 3000;
app.listen(port, () => console.log(`Ride-hailing API listening on http://localhost:${port}`));
