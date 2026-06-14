import { createFileRoute } from "@tanstack/react-router";
import { EMPTY } from "@/lib/strings";
import { NoResultsYet } from "@/components/NoResultsYet";

export const Route = createFileRoute("/media/gallery")({
  head: () => ({
    meta: [{ title: "Gallery — MCF National Cycling Event 2026" }],
  }),
  component: () => <NoResultsYet message={EMPTY.noGallery} />,
});
