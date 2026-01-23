import { createFileRoute } from "@tanstack/react-router";
import { ModuleEmbed } from "@/components/module-embed";

export const Route = createFileRoute("/projects")({
  component: () => (
    <div className="h-full">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-gray-600 text-sm mt-1">
          Manage your projects, tasks, and team collaboration
        </p>
      </div>
      <ModuleEmbed module="projects" mode="iframe" height="calc(100vh - 200px)" />
    </div>
  ),
});
