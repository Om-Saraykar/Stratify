import { useEffect, useState } from "react";
import { z } from "zod";

import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";  
import { taskSchema } from "./data/schema";
import tasksJson from "./data/tasks.json";

type Task = z.infer<typeof taskSchema>;

const TaskPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const parsed = z.array(taskSchema).safeParse(tasksJson);

    if (parsed.success) {
      setTasks(parsed.data);
    } else {
      // eslint-disable-next-line no-console
      console.error("Invalid task data", parsed.error);
    }
  }, []);

  return (
    <div className="h-full flex-1 flex flex-col gap-4 p-4 md:flex">
      <div className="flex flex-col justify-between gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Your Todo List</h2>
        <p className="text-muted-foreground">
          Here&apos;s a list of your tasks for this month!
        </p>
      </div>
      <hr className="my-4 border-t border-gray-200 dark:border-gray-700" />
      <div className="h-full w-full overflow-y-auto">
        <DataTable columns={columns} data={tasks} />  
      </div>
    </div>
  );
};

export default TaskPage;
