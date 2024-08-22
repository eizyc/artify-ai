import { 
  ActiveTool, 
  Editor
} from "@/features/editor/types";
import { ToolSidebarClose } from "./tool-sidebar-close";
import { ToolSidebarHeader } from "./tool-sidebar-header";

import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { FILTER, FILTERS } from "@/features/editor/const";
import { useEffect, useState } from "react";

interface FilterSidebarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

export const FilterSidebar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: FilterSidebarProps) => {
  const initialFilter = editor?.getActiveImageFilter()??FILTER;

  const [filter, setFilter]  = useState(initialFilter);

  useEffect(() => {
    setFilter(editor?.getActiveImageFilter()??FILTER);
  }, [editor]);

  const onClose = () => {
    onChangeActiveTool("select");
  };

  const changeFilter = (value: string) => {
   editor?.changeImageFilter(value)
   setFilter(value)
  }

  

  return (
    <aside
      className={cn(
        "bg-white relative border-r z-[40] w-[360px] h-full flex flex-col",
        activeTool === "filter" ? "visible" : "hidden",
      )}
    >
      <ToolSidebarHeader
        title="Filters"
        description="Apply a filter to selected image"
      />
      <ScrollArea>
        <div className="p-4 space-y-1 border-b">
          {FILTERS.map((value) => (
            <Button
              key={value}
              variant="secondary"
              size="lg"
              className={cn(
                "w-full h-16 justify-start text-left",
                value === filter && "border-2 border-blue-500",
              )}
              onClick={()=>changeFilter(value)}
            >
              {value}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <ToolSidebarClose onClick={onClose} />
    </aside>
  );
};
