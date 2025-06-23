// src/components/views/tasks/page.tsx
import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

// ✅ Import your local JSON file statically (since this is a server component)
import tasks from "./data/tasks.json"; // Make sure this path is correct

export default function Tasks() {
  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/tasks-light.png"
          width={1280}
          height={998}
          alt="Playground"
          className="block dark:hidden"
        />
        <Image
          src="/examples/tasks-dark.png"
          width={1280}
          height={998}
          alt="Playground"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">
            Here&apos;s a list of your tasks for this month!
          </p>
        </div>
        <DataTable data={Array.isArray(tasks) ? tasks : []} columns={columns} />
      </div>
    </>
  );
}
