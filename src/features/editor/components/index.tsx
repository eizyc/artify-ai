"use client";

import { Navbar, Sidebar, Footer } from "@/features/editor/components/layout";
import { Toolbar } from "@/features/editor/components/toolbar";
import { useEditor } from "@/features/editor/hooks/use-editor";
import { useCallback, useEffect, useRef, useState } from "react";
import { fabric } from "fabric";
import { ActiveTool } from "@/features/editor/types";
import {
  ShapeSidebar,
  FillColorSidebar,
  StrokeColorSidebar,
  StrokeStyleSidebar
} from "@/features/editor/components/layout/sidebar/components";
import { selectionDependentTools } from "../const";

export const Editor = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [activeTool, setActiveTool] = useState<ActiveTool>("select");


  const onClearSelection = useCallback(() => {
    if (selectionDependentTools.includes(activeTool)) {
      setActiveTool("select");
    }
  }, [activeTool]);
  
  const { init, editor } = useEditor({
    clearSelectionCallback: onClearSelection,
  });


  const onChangeActiveTool = useCallback(
    (tool: ActiveTool) => {
      if (tool === activeTool) {
        return setActiveTool("select");
      }

      setActiveTool(tool);
    },
    [activeTool]
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
      <Navbar activeTool={activeTool} onChangeActiveTool={onChangeActiveTool} />
      <div className="absolute h-[calc(100%-68px)] w-full top-[68px] flex">
        <Sidebar
          activeTool={activeTool}
          onChangeActiveTool={onChangeActiveTool}
        />
        <ShapeSidebar {...params}/>
        <FillColorSidebar {...params}/>
        <StrokeColorSidebar {...params}/>
        <StrokeStyleSidebar {...params}/>
        <main className="bg-muted flex-1 overflow-auto relative flex flex-col">
          <Toolbar {...params}/>
          <div
            className="flex-1 h-[calc(100%-124px)] bg-muted"
            ref={containerRef}
          >
            <canvas ref={canvasRef} />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
};
