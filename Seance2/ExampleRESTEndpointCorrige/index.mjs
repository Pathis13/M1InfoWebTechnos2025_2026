import { app } from "./src/app.mjs";
// use cors to allow requests
import cors from "cors";
app.use(cors()); // i still have the error with this line
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 API Presets (corrigé) http://localhost:${PORT}`));
