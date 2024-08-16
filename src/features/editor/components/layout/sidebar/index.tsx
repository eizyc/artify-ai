"use client";

import {
  LayoutTemplate,
  ImageIcon,
  Pencil,
  Settings,
  Shapes,
  Sparkles,
  Type,
  LucideIcon,
} from "lucide-react";
import { ActiveTool } from "@/features/editor/types";
import { SidebarItem } from "./components/sidebar-item";

interface SidebarProps {
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
}

export const Sidebar = ({ activeTool, onChangeActiveTool }: SidebarProps) => {
  const menu: Array<{
    label: string;
    value: ActiveTool;
    icon: LucideIcon;
  }> = [
    {
      label: "Design",
      value: "templates",
      icon: LayoutTemplate,
    },
    {
      label: "Image",
      value: "images",
      icon: ImageIcon,
    },
    {
      label: "Text",
      value: "text",
      icon: Type,
    },
    {
      label: "Shapes",
      value: "shapes",
      icon: Shapes,
    },
    {
      label: "Draw",
      value: "draw",
      icon: Pencil,
    },
    {
      label: "AI",
      value: "ai",
      icon: Sparkles,
    },
    {
      label: "Settings",
      value: "settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="bg-white flex flex-col w-[100px] h-full border-r overflow-y-auto">
      <ul className="flex flex-col">
        {menu.map((item) => (
          <SidebarItem
            key={item.value}
            label={item.label}
            icon={item.icon}
            isActive={activeTool === item.value}
            onClick={() => {
              onChangeActiveTool(item.value);
            }}
          />
        ))}
      </ul>
    </aside>
  );
};
