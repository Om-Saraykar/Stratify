// src/components/views/tasks/page.tsx
import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

import tasks from "./data/tasks.json";

export default function Tasks() {
  return (
    <>
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
