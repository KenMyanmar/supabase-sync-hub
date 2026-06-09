import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { uploadRegistrationsCsv } from "@/lib/registrations.functions";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · Registrations" }] }),
  component: AdminPage,
});

function AdminPage() {
  const upload = useServerFn(uploadRegistrationsCsv);
  const [password, setPassword] = useState("");
  const [format, setFormat] = useState<"csv" | "tsv">("tsv");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<string>("");

  async function onFile(f: File | null) {
    if (!f) return;
    setFormat(f.name.toLowerCase().endsWith(".tsv") ? "tsv" : "csv");
    setContent(await f.text());
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setResult("");
    try {
      const r = await upload({ data: { password, format, content } });
      setResult(
        `Inserted/updated: ${r.inserted}` +
          (r.errors.length ? `\nErrors:\n${r.errors.join("\n")}` : ""),
      );
    } catch (err: any) {
      setResult(`Failed: ${err?.message ?? String(err)}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">Admin · CSV/TSV Upload</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Fallback importer for registrations. Header columns (case-insensitive):{" "}
          <code>registration_no, name, english_name, team_club, events, status, admin_remark, phone</code>.
          Existing rows with the same <code>registration_no</code> are updated.
        </p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Admin password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">File (.csv or .tsv)</label>
            <input
              type="file"
              accept=".csv,.tsv,text/csv,text/tab-separated-values"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              className="text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Or paste content ({format.toUpperCase()})
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-xs"
              placeholder="registration_no\tname\tenglish_name\tteam_club\tevents\tstatus\tadmin_remark\tphone"
            />
            <div className="mt-2 flex gap-3 text-xs">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={format === "tsv"}
                  onChange={() => setFormat("tsv")}
                />{" "}
                TSV (tab-separated, safer for Myanmar text)
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  checked={format === "csv"}
                  onChange={() => setFormat("csv")}
                />{" "}
                CSV
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={busy || !content || !password}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Uploading…" : "Upload"}
          </button>
        </form>

        {result && (
          <pre className="mt-6 whitespace-pre-wrap rounded-md border border-border bg-muted/30 p-3 text-xs">
            {result}
          </pre>
        )}
      </div>
    </main>
  );
}
