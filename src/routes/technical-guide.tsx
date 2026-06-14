import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/technical-guide")({
  beforeLoad: () => {
    throw redirect({ to: "/guide" });
  },
});
