import { useCallback, useRef, useState } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { EditorHookProps } from "@/features/editor/types";

export const useEditor = (
  // {
  //   defaultHeight,
  //   defaultWidth,
  // }: EditorHookProps
) => {
  // const initialWidth = useRef(defaultWidth);
  // const initialHeight = useRef(defaultHeight);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });
  
  const init = useCallback((
    ({
      initialCanvas,
      initialContainer,
    }: {
      initialCanvas: fabric.Canvas;
      initialContainer: HTMLDivElement;
    }) => {
      initialCanvas.setWidth(initialContainer.offsetWidth);
      initialCanvas.setHeight(initialContainer.offsetHeight);

      fabric.Object.prototype.set({
        cornerColor: "#FFF",
        cornerStyle: "circle",
        borderColor: "#3b82f6",
        borderScaleFactor: 1.5,
        transparentCorners: false,
        borderOpacityWhenMoving: 1,
        cornerStrokeColor: "#3b82f6",
      });

      const initialWorkspace = new fabric.Rect({
        width: 200,
        height: 300,
        name: "clip",
        fill: "white",
        selectable: false,
        hasControls: false,
        shadow: new fabric.Shadow({
          color: "rgba(0,0,0,0.8)",
          blur: 5,
        }),
      });

      initialCanvas.add(initialWorkspace);
      initialCanvas.centerObject(initialWorkspace);
      initialCanvas.clipPath = initialWorkspace;

      setCanvas(initialCanvas);
      setContainer(initialContainer);


    }), [])

  return {
    init
  };
}
