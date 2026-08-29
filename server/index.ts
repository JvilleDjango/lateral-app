import { app } from "./app.ts";

const port = Number(process.env.PORT ?? 3001);

// Exported app construction stays side-effect free; only this entry point opens a socket.
app.listen(port, () => {
  console.log(`Wayfare API listening on http://localhost:${port}`);
});
