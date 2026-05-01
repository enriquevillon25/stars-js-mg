const path = require("path");
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3100;
const HOST = process.env.HOST || "127.0.0.1";

app.use(express.static(path.join(__dirname, "public")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Constelacion de amor corriendo en http://${HOST}:${PORT}`);
});
