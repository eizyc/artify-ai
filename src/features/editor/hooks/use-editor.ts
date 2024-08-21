import { useCallback, useMemo, useRef, useState } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { EditorHookProps, BuildEditorProps, Editor } from "@/features/editor/types";
import { CIRCLE_OPTIONS, DIAMOND_OPTIONS, FILL_COLOR, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, RECTANGLE_OPTIONS, SHAPE_SIZE, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH, TEXT_OPTIONS, TRIANGLE_OPTIONS, WORKSPACE_HEIGHT, WORKSPACE_NAME, WORKSPACE_WIDTH } from "../const";
import { useCanvasEvents } from "./use-canvas-events";
import { isTextType, mixColors } from "../utils";

const buildEditor = ({
  canvas,
  fillColor,
  strokeColor,
  strokeWidth, 
  selectedObjects,
  strokeDashArray,
  fontFamily,
  setFillColor,
  setStrokeColor,
  setStrokeWidth,
  setStrokeDashArray,
  setFontFamily,

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
    canvas,
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();
      
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ stroke: value });
      });
      canvas.freeDrawingBrush.color = value;
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.freeDrawingBrush.width = value;
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      canvas.renderAll();
    },
    changeFontFamily: (value: string) => {
      setFontFamily(value);
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontFamily exists.
          object.set({ fontFamily: value });
        }
      });
      canvas.renderAll();
    },
    changeFontWeight: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontWeight exists.
          object.set({ fontWeight: value });
        }
      });
      canvas.renderAll();
    },
    changeFontSize: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontSize exists.
          object.set({ fontSize: value });
        }
      });
      canvas.renderAll();
    },
    
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
    addText: (value, options) => {
      const object = new fabric.Textbox(value, {
        ...TEXT_OPTIONS,
        ...options,
      });

      addToCanvas(object);
    },
    getActiveFillColor: () => {

      if (!selectedObjects?.length) {
        return fillColor;
      }

      const colors = selectedObjects.map((object) => object.get("fill") as string).filter(Boolean);

      const value = mixColors(colors) ?? fillColor;

      // Currently, gradients & patterns are not supported
      return value as string;
    },
    getActiveStrokeColor: () => {

      if (!selectedObjects?.length) {
        return strokeColor;
      }
      const colors = selectedObjects.map((object) => object.get("stroke") as string).filter(Boolean);
      const value = mixColors(colors) ?? strokeColor;

      return value;
    },
    getActiveStrokeWidth: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeWidth;
      }

      const value = selectedObject.get("strokeWidth") ?? strokeWidth;

      return value;
    },
    getActiveStrokeDashArray: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return strokeDashArray;
      }

      const value = selectedObject.get("strokeDashArray") ?? strokeDashArray;

      return value;
    },
    getActiveOpacity: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return 1;
      }

      const value = selectedObject.get("opacity") ?? 1;

      return value;
    },
    getActiveFontFamily: () => {

      const selectedObject = selectedObjects.filter((object) => isTextType(object.type))?.[0];

      if (!selectedObject) {
        return fontFamily;
      }

      // @ts-ignore
      // Faulty TS library, fontFamily exists.
      const value = selectedObject.get("fontFamily") ?? fontFamily;

      return value;
    },
    getActiveFontWeight: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_WEIGHT;
    }

      // @ts-ignore
      // Faulty TS library, fontWeight exists.
      const value = selectedObject.get("fontWeight") ?? FONT_WEIGHT;

      return value;
    },
    getActiveFontSize: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return FONT_SIZE;
      }

      // @ts-ignore
      // Faulty TS library, fontSize exists.
      const value = selectedObject.get("fontSize") ?? FONT_SIZE;

      return value;
    },
    selectedObjects,
  }
}
export const useEditor = (
  {
    defaultHeight,
    defaultWidth,
    clearSelectionCallback
  }: EditorHookProps
) => {
  // const initialWidth = useRef(defaultWidth);
  // const initialHeight = useRef(defaultHeight);

  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [container, setContainer] = useState<HTMLDivElement | null>(null);
  const [selectedObjects, setSelectedObjects] = useState<fabric.Object[]>([]);

  const [fillColor, setFillColor] = useState(FILL_COLOR);
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth, setStrokeWidth] = useState(STROKE_WIDTH);
  const [strokeDashArray, setStrokeDashArray] = useState<number[]>(STROKE_DASH_ARRAY);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILY);


  const editor = useMemo(() => {
      if (canvas) {
        return buildEditor({
          canvas,
          fillColor,
          strokeColor,
          strokeWidth, 
          selectedObjects,
          strokeDashArray,
          fontFamily,
          setFillColor,
          setStrokeColor,
          setStrokeWidth,
          setStrokeDashArray,
          setFontFamily,
        })
      }
      return undefined
    }, [canvas, fillColor, fontFamily, selectedObjects, strokeColor, strokeDashArray, strokeWidth]);

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  useCanvasEvents({
    canvas,
    setSelectedObjects,
    clearSelectionCallback
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
        width: WORKSPACE_WIDTH,
        height: WORKSPACE_HEIGHT,
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
