import { useCallback, useMemo, useRef, useState } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { EditorHookProps, BuildEditorProps, Editor } from "@/features/editor/types";
import { CIRCLE_OPTIONS, DIAMOND_OPTIONS, RECTANGLE_OPTIONS, SHAPE_SIZE, TRIANGLE_OPTIONS, WORKSPACE_NAME } from "../const";

const buildEditor = ({
  canvas
}:BuildEditorProps): Editor => {
  const getWorkspace = () => {
    return canvas
    .getObjects()
    .find((object) => object.name === WORKSPACE_NAME);
  };

  const workspaceWidth = getWorkspace()?.width??SHAPE_SIZE;
  const workspaceHeight = getWorkspace()?.height??SHAPE_SIZE;
  const size = Math.min(workspaceWidth, workspaceHeight)/2;
  const shape = {
    width: size,
    height: size,
  }

  const addToCanvas = (object: fabric.Object) => {
    canvas.viewportCenterObject(object);
    canvas.add(object);
    canvas.setActiveObject(object);
  };


  return {
    addCircle: () => {
      const object = new fabric.Circle({
        ...CIRCLE_OPTIONS,
        radius: size/2
      });

      addToCanvas(object);
    },
    addSoftRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        ...shape,
        rx: size/10,
        ry: size/10,
      });

      addToCanvas(object);
    },
    addRectangle: () => {
      const object = new fabric.Rect({
        ...RECTANGLE_OPTIONS,
        ...shape,
      });

      addToCanvas(object);
    },
    addTriangle: () => {
      const object = new fabric.Triangle({
        ...TRIANGLE_OPTIONS,
        ...shape,
      });

      addToCanvas(object);
    },
    addInverseTriangle: () => {
      const {width: WIDTH, height: HEIGHT} = shape

      const object = new fabric.Polygon(
        [
          { x: 0, y: 0 },
          { x: WIDTH, y: 0 },
          { x: WIDTH / 2, y: HEIGHT },
        ],
        {
          ...TRIANGLE_OPTIONS,
          ...shape,
        }
      );

      addToCanvas(object);
    },
    addDiamond: () => {
      const {width: WIDTH, height: HEIGHT} = shape

      const object = new fabric.Polygon(
        [
          { x: WIDTH / 2, y: 0 },
          { x: WIDTH, y: HEIGHT / 2 },
          { x: WIDTH / 2, y: HEIGHT },
          { x: 0, y: HEIGHT / 2 },
        ],
        {
          ...DIAMOND_OPTIONS,
          ...shape,
        }
      );
      addToCanvas(object);
    },
  }
}
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

  const editor = useMemo(() => {
      if (canvas) {
        return buildEditor({canvas})
      }
      return undefined
    }, [canvas]);

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
        name: WORKSPACE_NAME,
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
    init,
    editor
  };
}
