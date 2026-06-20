import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/media/press")({
  component: PressLayout,
});

function PressLayout() {
  return <Outlet />;
}
