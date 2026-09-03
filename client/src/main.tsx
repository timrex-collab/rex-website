import { createRoot } from "react-dom/client";
import App from "./App";
import { installChunkRecovery } from "./lib/chunkRecovery";
import "./index.css";

installChunkRecovery();

createRoot(document.getElementById("root")!).render(<App />);
