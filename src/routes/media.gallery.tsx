import { createFileRoute } from "@tanstack/react-router";
import { Image as ImageIcon } from "lucide-react";
import { useState } from "react";
import { useLang, t } from "@/lib/i18n";
import { listGalleryGroups, type GalleryGroup } from "@/lib/site-content.functions";

export const Route = createFileRoute("/media/gallery")({
  head: () => ({
    meta: [{ title: "Gallery — MCF National Cycling Event 2026" }],
  }),
  loader: () => listGalleryGroups(),
  component: GalleryPage,
  errorComponent: ({ error }) => (
    <div role="alert" className="rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
      {error.message}
    </div>
  ),
});

function titleCase(s: string): string {
  return s
    .replace(/[_-]+/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

function GalleryPage() {
  const { lang } = useLang();
  const groups = Route.useLoaderData() as GalleryGroup[];
  const [active, setActive] = useState<string>(groups[0]?.category ?? "");

  if (groups.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-dashed border-border bg-muted/20 p-6 text-sm text-muted-foreground">
        <ImageIcon className="h-5 w-5 shrink-0" />
        <span>
          {lang === "mm"
            ? "ဓာတ်ပုံများကို ပြိုင်ပွဲပြီးနောက် တင်ပါမည်။"
            : "Photos will be uploaded after race day."}
        </span>
      </div>
    );
  }

  const current = groups.find((g) => g.category === active) ?? groups[0];

  return (
    <div className="space-y-6">
      {groups.length > 1 ? (
        <div className="flex flex-wrap gap-2 border-b border-border pb-2">
          {groups.map((g) => {
            const isActive = g.category === current.category;
            return (
              <button
                key={g.category}
                type="button"
                onClick={() => setActive(g.category)}
                className={
                  "rounded-md px-3 py-1.5 text-sm transition-colors " +
                  (isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/40 text-muted-foreground hover:bg-muted")
                }
              >
                <span className="font-medium">{titleCase(g.category)}</span>
                <span className="ml-2 font-mono text-xs opacity-70">· {g.count}</span>
              </button>
            );
          })}
        </div>
      ) : (
        <h2 className="text-lg font-semibold text-foreground">
          {titleCase(current.category)}{" "}
          <span className="ml-1 font-mono text-xs text-muted-foreground">· {current.count}</span>
        </h2>
      )}

      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {current.images.map((img) => (
          <li
            key={img.url}
            className="overflow-hidden rounded-md border border-border"
          >
            <a
              href={img.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <img
                src={img.thumbUrl}
                alt={img.name}
                loading="lazy"
                className="aspect-square w-full object-cover transition-transform hover:scale-[1.02]"
              />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
