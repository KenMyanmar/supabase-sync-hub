import { useMemo, useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
  queryOptions,
} from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import {
  listResultComments,
  postResultComment,
  likeResultComment,
  type ResultComment,
} from "@/lib/site-content.functions";
import { useLang } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type Props = { category: string };

const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-amber-500",
  "bg-emerald-500",
  "bg-sky-500",
  "bg-indigo-500",
  "bg-fuchsia-500",
  "bg-teal-500",
  "bg-orange-500",
];

function colorFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++)
    h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

function relativeTime(iso: string, lang: "en" | "mm"): string {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return "";
  const diff = Math.max(0, Date.now() - then);
  const s = Math.floor(diff / 1000);
  if (s < 60) return lang === "mm" ? "ယခုပင်" : "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString(lang === "mm" ? "my-MM" : "en-GB", {
    day: "numeric",
    month: "short",
  });
}

export function ResultsComments({ category }: Props) {
  const { lang } = useLang();
  const list = useServerFn(listResultComments);
  const post = useServerFn(postResultComment);
  const like = useServerFn(likeResultComment);
  const qc = useQueryClient();

  const q = useQuery(
    queryOptions({
      queryKey: ["result-comments", category],
      queryFn: () => list({ data: { category } }),
      refetchInterval: 15_000,
      staleTime: 5_000,
    }),
  );
  const comments = q.data ?? [];

  const { topLevel, childrenByParent, total } = useMemo(() => {
    const top: ResultComment[] = [];
    const map = new Map<string, ResultComment[]>();
    for (const c of comments) {
      if (c.parent_id) {
        const arr = map.get(c.parent_id) ?? [];
        arr.push(c);
        map.set(c.parent_id, arr);
      } else {
        top.push(c);
      }
    }
    return { topLevel: top, childrenByParent: map, total: comments.length };
  }, [comments]);

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["result-comments", category] });

  const postMut = useMutation({
    mutationFn: (vars: {
      author_name: string;
      body: string;
      parent_id?: string | null;
    }) => post({ data: { category, ...vars } }),
    onSuccess: (res) => {
      if (!res.ok) {
        toast.error(res.error ?? "Could not post comment.");
        return;
      }
      invalidate();
    },
    onError: () => toast.error("Could not post comment."),
  });

  const likeMut = useMutation({
    mutationFn: (id: string) => like({ data: { id } }),
    onSuccess: () => invalidate(),
  });

  return (
    <section
      className="rounded-lg border border-border bg-card p-4 sm:p-6"
      aria-label={lang === "mm" ? "မှတ်ချက်များ" : "Comments"}
    >
      <header className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {lang === "mm"
            ? `မှတ်ချက် ${total} ခု`
            : `${total} ${total === 1 ? "comment" : "comments"}`}
        </h2>
      </header>

      <Composer
        lang={lang}
        pending={postMut.isPending}
        onSubmit={(v) => postMut.mutate(v)}
      />

      {q.isLoading ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {lang === "mm" ? "ဖွင့်နေသည်…" : "Loading…"}
        </p>
      ) : topLevel.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">
          {lang === "mm"
            ? "ပထမဆုံးမှတ်ချက်ပေးပါ 🚴"
            : "Be the first to comment 🚴"}
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {topLevel.map((c) => (
            <CommentItem
              key={c.id}
              comment={c}
              replies={childrenByParent.get(c.id) ?? []}
              lang={lang}
              onLike={(id) => likeMut.mutate(id)}
              onReply={(vars) => postMut.mutate(vars)}
              postPending={postMut.isPending}
            />
          ))}
        </ul>
      )}
    </section>
  );
}

function Composer({
  lang,
  pending,
  onSubmit,
  compact,
  parentId,
  onCancel,
}: {
  lang: "en" | "mm";
  pending: boolean;
  onSubmit: (v: {
    author_name: string;
    body: string;
    parent_id?: string | null;
  }) => void;
  compact?: boolean;
  parentId?: string;
  onCancel?: () => void;
}) {
  const [name, setName] = useState("");
  const [body, setBody] = useState("");
  const canSubmit = name.trim().length > 0 && body.trim().length > 0;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!canSubmit || pending) return;
        onSubmit({
          author_name: name.trim(),
          body: body.trim(),
          parent_id: parentId ?? null,
        });
        setBody("");
        if (compact) onCancel?.();
      }}
      className={cn("space-y-2", compact && "mt-2")}
    >
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={lang === "mm" ? "သင်၏အမည်" : "Your name"}
        maxLength={60}
        disabled={pending}
        required
      />
      <Textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder={
          lang === "mm"
            ? compact
              ? "ပြန်စာရေးပါ…"
              : "မှတ်ချက်ရေးပါ…"
            : compact
              ? "Write a reply…"
              : "Write a comment…"
        }
        maxLength={1000}
        rows={compact ? 2 : 3}
        disabled={pending}
        required
      />
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {body.length}/1000
        </span>
        <div className="flex gap-2">
          {compact && onCancel ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={pending}
            >
              {lang === "mm" ? "ပယ်ဖျက်" : "Cancel"}
            </Button>
          ) : null}
          <Button type="submit" size="sm" disabled={!canSubmit || pending}>
            {pending
              ? lang === "mm"
                ? "တင်နေ…"
                : "Posting…"
              : compact
                ? lang === "mm"
                  ? "ပြန်တင်"
                  : "Reply"
                : lang === "mm"
                  ? "တင်ပါ"
                  : "Post"}
          </Button>
        </div>
      </div>
    </form>
  );
}

function CommentItem({
  comment,
  replies,
  lang,
  onLike,
  onReply,
  postPending,
}: {
  comment: ResultComment;
  replies: ResultComment[];
  lang: "en" | "mm";
  onLike: (id: string) => void;
  onReply: (v: {
    author_name: string;
    body: string;
    parent_id?: string | null;
  }) => void;
  postPending: boolean;
}) {
  const [replying, setReplying] = useState(false);
  return (
    <li>
      <Bubble comment={comment} lang={lang} />
      <div className="ml-12 mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <button
          type="button"
          onClick={() => onLike(comment.id)}
          className="font-medium hover:text-foreground"
        >
          👍 {lang === "mm" ? "နှစ်သက်" : "Like"}
          {comment.likes > 0 ? ` (${comment.likes})` : ""}
        </button>
        <button
          type="button"
          onClick={() => setReplying((v) => !v)}
          className="font-medium hover:text-foreground"
        >
          {lang === "mm" ? "ပြန်ဖြေ" : "Reply"}
        </button>
        <span>{relativeTime(comment.created_at, lang)}</span>
      </div>

      {replying ? (
        <div className="ml-12 mt-2">
          <Composer
            lang={lang}
            pending={postPending}
            compact
            parentId={comment.id}
            onSubmit={onReply}
            onCancel={() => setReplying(false)}
          />
        </div>
      ) : null}

      {replies.length > 0 ? (
        <ul className="ml-12 mt-3 space-y-3 border-l border-border pl-4">
          {replies.map((r) => (
            <li key={r.id}>
              <Bubble comment={r} lang={lang} small />
              <div className="ml-10 mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <button
                  type="button"
                  onClick={() => onLike(r.id)}
                  className="font-medium hover:text-foreground"
                >
                  👍 {lang === "mm" ? "နှစ်သက်" : "Like"}
                  {r.likes > 0 ? ` (${r.likes})` : ""}
                </button>
                <span>{relativeTime(r.created_at, lang)}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function Bubble({
  comment,
  lang,
  small,
}: {
  comment: ResultComment;
  lang: "en" | "mm";
  small?: boolean;
}) {
  const initial = (comment.author_name || "?").trim().charAt(0).toUpperCase();
  const color = colorFor(comment.author_name || "?");
  const size = small ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
          color,
          size,
        )}
        aria-hidden
      >
        {initial}
      </div>
      <div className="min-w-0 flex-1 rounded-2xl bg-muted px-3 py-2">
        <p className="text-sm font-semibold">{comment.author_name}</p>
        <p
          className="whitespace-pre-wrap break-words text-sm text-foreground/90"
          lang={lang === "mm" ? "my" : "en"}
        >
          {comment.body}
        </p>
      </div>
    </div>
  );
}
