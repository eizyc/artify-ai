"use client";

import { Navbar, Sidebar, Footer } from "@/features/editor/components/layout";
import { Toolbar } from "@/features/editor/components/layout/toolbar";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import debounce from "lodash.debounce";
import { ActiveTool } from "@/features/editor/types";
import {
  ShapeSidebar,
  FillColorSidebar,
  StrokeColorSidebar,
  StrokeStyleSidebar,
  OpacitySidebar,
  TextSidebar,
  FontSidebar,
  ImageSidebar,
  FilterSidebar,
  AiSidebar,
  RemoveBgSidebar,
  DrawSidebar,
  SettingsSidebar,
} from "@/features/editor/components/layout/sidebar/components";
import { ResponseType } from "@/features/projects/api/use-get-project";
import { selectionDependentTools } from "../const";
import { useUpdateProject } from "@/features/projects/api/use-update-project";

interface EditorProps {
  initialData?: ResponseType["data"];
};

export const Editor = ({ initialData }: EditorProps) => {
  const { mutate } = useUpdateProject(initialData?.id);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSave = useCallback(
    debounce(
      (values: { 
        json: string,
        height: number,
        width: number,
      }) => {
        mutate(values);
    },
    2000
  ), [mutate]);

  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");


  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);
  
  const { init, editor } = useEditor({
    defaultState: initialData?.json,
    defaultHeight: initialData?.height,
    defaultWidth: initialData?.width,
    clearSelectionCallback: onClearSelection,
    saveCallback: debouncedSave,
  });


  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === "draw") {
        editor?.enableDrawingMode();
      }
  
      if (activeTool === "draw") {
        editor?.disableDrawingMode();
      }

      if (tool === activeTool) {
        return setActiveTool("select");
      }

      setActiveTool(tool);
    },
    [activeTool, editor]
  );

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      controlsAboveOverlay: true,
      preserveObjectStacking: true,
    });

    init({
      initialCanvas: canvas,
      initialContainer: containerRef.current!,
    });

    return () => {
      canvas.dispose();
    };
  }, [init]);

  const params = {
    editor,
    activeTool,
    onChangeActiveTool
  }

  return (
    <div className="h-full flex flex-col">
      <Navbar id={initialData?.id} {...params}/>
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar {...params}/>
        <FillColorSidebar {...params}/>
        <StrokeColorSidebar {...params}/>
        <StrokeStyleSidebar {...params}/>
        <OpacitySidebar {...params}/>
        <TextSidebar {...params}/>
        <FontSidebar {...params}/>
        <ImageSidebar {...params}/>
        <FilterSidebar {...params}/>
        <AiSidebar {...params}/>
        <RemoveBgSidebar {...params}/>
        <DrawSidebar {...params}/>
        <SettingsSidebar {...params}/>

        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar {...params} />
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer editor={editor}/>
        </main>
      </div>
    </div>
  );
};

