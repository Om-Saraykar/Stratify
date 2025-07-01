"use client";

import { useEffect, useMemo, useState } from "react";
import { useCalendarContext } from "./event-calendar/calendar-context";
import {
  EventCalendar,
  type CalendarEvent,
  type EventColor,
} from "./event-calendar";

type Task = {
  id: string;
  title: string;
  description: string;
  startAt?: string;
  endAt?: string;
  label: string;
};

export const etiquettes = [
  {
    id: "holidays",
    name: "Personal",
    color: "rose",
    isActive: true,
  },
  {
    id: "events-planning",
    name: "Work",
    color: "blue",
    isActive: true,
  },
  {
    id: "interviews",
    name: "Study",
    color: "violet",
    isActive: true,
  },
  {
    id: "my-events",
    name: "Health",
    color: "emerald",
    isActive: true,
  },
  {
    id: "marketing-team",
    name: "Others",
    color: "orange",
    isActive: true,
  },
];

function mapLabelToColor(label: string): EventColor {
  switch (label.toUpperCase()) {
    case "PERSONAL":
      return "rose";
    case "WORK":
      return "blue";
    case "HEALTH":
      return "emerald";
    case "STUDY":
      return "violet";
    default:
      return "orange"; // OTHER or fallback
  }
}

function mapColorToLabel(color: EventColor): string {
  switch (color) {
    case "rose":
      return "PERSONAL";
    case "blue":
      return "WORK";
    case "emerald":
      return "HEALTH";
    case "violet":
      return "STUDY";
    default:
      return "OTHER";
  }
}

export default function TaskCalendarComponent() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const { isColorVisible } = useCalendarContext();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch("/api/tasks");
        const tasks: Task[] = await res.json();

        const mappedEvents: CalendarEvent[] = tasks
          .filter((task) => task.startAt && task.endAt)
          .map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            start: new Date(task.startAt!),
            end: new Date(task.endAt!),
            label: task.label,
            color: mapLabelToColor(task.label),
          }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Failed to load tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const visibleEvents = useMemo(() => {
    return events.filter((event) => !event.color || isColorVisible(event.color));
  }, [events, isColorVisible]);

  const handleEventAdd = async (event: CalendarEvent) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: event.title,
        description: event.description || "",
        status: "TODO",
        label: event.label || mapColorToLabel(event.color || "orange"),
        priority: "MEDIUM",
        startAt: event.start,
        endAt: event.end,
      }),
    });

    const newTask: Task = await res.json();
    setEvents((prev) => [
      ...prev,
      {
        ...event,
        id: newTask.id,
        label: newTask.label,
        color: mapLabelToColor(newTask.label),
      },
    ]);
  };

  const handleEventUpdate = async (event: CalendarEvent) => {
    await fetch(`/api/tasks/${event.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: event.title,
        description: event.description,
        status: "TODO",
        label: event.label || mapColorToLabel(event.color || "orange"),
        priority: "MEDIUM",
        startAt: event.start,
        endAt: event.end,
      }),
    });

    setEvents((prev) =>
      prev.map((e) => (e.id === event.id ? event : e))
    );
  };

  const handleEventDelete = async (id: string) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <EventCalendar
      events={visibleEvents}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
      initialView="week"
    />
  );
}
