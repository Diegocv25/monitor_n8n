import express from "express";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
);

app.get("/api/executions", async (req, res) => {
    const { data, error } = await supabase
        .from("n8n_execution_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100);
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

app.get("/api/executions/stats", async (req, res) => {
    const { data, error } = await supabase
        .from("n8n_execution_logs")
        .select("status, duration_ms");
    if (error) return res.status(500).json({ error: error.message });
    const total = data.length;
    const successful = data.filter(e => e.status === "success").length;
    const failed = data.filter(e => e.status === "error").length;
    const avgDuration = total > 0 ? data.reduce((a, b) => a + (b.duration_ms || 0), 0) / total : 0;
    res.json({ total, successful, failed, avgDuration });
});

app.get("/api/executions/daily", async (req, res) => {
    const { data, error } = await supabase
        .from("n8n_execution_logs")
        .select("status, started_at")
        .order("started_at", { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
});

export default app;