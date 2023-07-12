// Load our .env file
import "dotenv/config";

// Load app
import app from "./server.js";

// Set the port
const port = process.env.PORT || 4000;
// Start our API server
app.get("/", (req, res) => {
  res.json({ message: "BookStat server is good to go" });
});

app.listen(port, () => {
    console.log(`\n Server is running on http://localhost:${port}\n`);
});
