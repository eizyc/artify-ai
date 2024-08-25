import { useCallback, useMemo, useRef, useState } from "react";
import { fabric } from "fabric";
import { useAutoResize } from "@/features/editor/hooks/use-auto-resize";
import { EditorHookProps, BuildEditorProps, Editor } from "@/features/editor/types";
import { CIRCLE_OPTIONS, DIAMOND_OPTIONS, FILL_COLOR, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, JSON_KEYS, RECTANGLE_OPTIONS, SHAPE_SIZE, STROKE_COLOR, STROKE_DASH_ARRAY, STROKE_WIDTH, TEXT_OPTIONS, TRIANGLE_OPTIONS, WORKSPACE_HEIGHT, WORKSPACE_NAME, WORKSPACE_WIDTH } from "../const";
import { useCanvasEvents } from "./use-canvas-events";
import { isTextType, mixColors, createFilter } from "../utils";
import { useHotkeys } from "./use-hotkeys";
import { useClipboard } from "./use-clipboard";
import { useHistory } from "./use-history";

const buildEditor = ({
  undo,
  redo,
  canRedo,
  canUndo,
  autoZoom,
  copy,
  paste,
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

  const trigeerModifyEvents = () => {
    canvas.fire("object:modified", { target: canvas.getActiveObject() });
  }

  return {
    canUndo,
    canRedo,
    autoZoom,
    getWorkspace,
    zoomIn: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio += 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio
      );
    },
    zoomOut: () => {
      let zoomRatio = canvas.getZoom();
      zoomRatio -= 0.05;
      const center = canvas.getCenter();
      canvas.zoomToPoint(
        new fabric.Point(center.left, center.top),
        zoomRatio < 0.2 ? 0.2 : zoomRatio,
      );
    },
    changeBackground: (value: string) => {
      const workspace = getWorkspace();
      workspace?.set({ fill: value });
      canvas.renderAll();
      trigeerModifyEvents();
    },
    changeSize: (value: { width: number; height: number }) => {
      const workspace = getWorkspace();

      workspace?.set(value);
      autoZoom();
      trigeerModifyEvents();
    },
    enableDrawingMode: () => {
      canvas.discardActiveObject();
      canvas.renderAll();
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.width = strokeWidth;
      canvas.freeDrawingBrush.color = strokeColor;
    },
    disableDrawingMode: () => {
      canvas.isDrawingMode = false;
    },
    onCopy: () => copy(),
    onPaste: () => paste(),
    onUndo: () => undo(),
    onRedo: () => redo(),
    canvas,
    delete: () => {
      canvas.getActiveObjects().forEach((object) => canvas.remove(object));
      canvas.discardActiveObject();
      canvas.renderAll();
    },
    bringForward: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.bringForward(object);
      });

      canvas.renderAll();
      
      const workspace = getWorkspace();
      workspace?.sendToBack();
      trigeerModifyEvents();
    },
    sendBackwards: () => {
      canvas.getActiveObjects().forEach((object) => {
        canvas.sendBackwards(object);
      });

      canvas.renderAll();
      const workspace = getWorkspace();
      workspace?.sendToBack();
      trigeerModifyEvents();
    },
    changeFillColor: (value: string) => {
      setFillColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ fill: value });
      });
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeStrokeColor: (value: string) => {
      setStrokeColor(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ stroke: value });
      });
      canvas.freeDrawingBrush.color = value;
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeStrokeWidth: (value: number) => {
      setStrokeWidth(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeWidth: value });
      });
      canvas.freeDrawingBrush.width = value;
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeStrokeDashArray: (value: number[]) => {
      setStrokeDashArray(value);
      canvas.getActiveObjects().forEach((object) => {
        object.set({ strokeDashArray: value });
      });
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeOpacity: (value: number) => {
      canvas.getActiveObjects().forEach((object) => {
        object.set({ opacity: value });
      });
      trigeerModifyEvents();
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
      trigeerModifyEvents();
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
      trigeerModifyEvents();
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
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeFontStyle: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, fontStyle exists.
          object.set({ fontStyle: value });
        }
      });
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeFontLinethrough: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, linethrough exists.
          object.set({ linethrough: value });
        }
      });
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeFontUnderline: (value: boolean) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, underline exists.
          object.set({ underline: value });
        }
      });
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeTextAlign: (value: string) => {
      canvas.getActiveObjects().forEach((object) => {
        if (isTextType(object.type)) {
          // @ts-ignore
          // Faulty TS library, textAlign exists.
          object.set({ textAlign: value });
        }
      });
      trigeerModifyEvents();
      canvas.renderAll();
    },
    changeImageFilter: (value: string) => {
      const objects = canvas.getActiveObjects();
      objects.forEach((object) => {
        if (object.type === "image") {
          const imageObject = object as fabric.Image;

          const effect = createFilter(value);

          imageObject.filters = effect ? [effect] : [];
          imageObject.applyFilters();
          canvas.renderAll();
        }
      });
      trigeerModifyEvents();
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
    addImage: (value)=> {
      fabric.Image.fromURL(
        value,
        (image) => {
          const workspace = getWorkspace();

          image.scaleToWidth(workspace?.width || 0);
          image.scaleToHeight(workspace?.height || 0);

          addToCanvas(image);
        },
        {
          crossOrigin: "anonymous",
        },
      );
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
    getActiveFontStyle: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "normal";
      }

      // @ts-ignore
      // Faulty TS library, fontStyle exists.
      const value = selectedObject.get("fontStyle") || "normal";

      return value;
    },
    getActiveFontLinethrough: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      // Faulty TS library, linethrough exists.
      const value = selectedObject.get("linethrough") || false;

      return value;
    },
    getActiveFontUnderline: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return false;
      }

      // @ts-ignore
      // Faulty TS library, underline exists.
      const value = selectedObject.get("underline") || false;

      return value;
    },
    getActiveTextAlign: () => {
      const selectedObject = selectedObjects[0];

      if (!selectedObject) {
        return "left";
      }

      // @ts-ignore
      // Faulty TS library, textAlign exists.
      const value = selectedObject.get("textAlign") || "left";

      return value;
    },
    getActiveImageFilter: () => {
      let objects = canvas.getActiveObjects();
      objects = objects.filter((object) => object.type === "image");
      const selectedObject = selectedObjects?.[0] as (fabric.Image & { filters: { name: string }[] } | undefined);
      return selectedObject?.filters?.[0]?.name ?? 'none';
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

  const { autoZoom } = useAutoResize({
    canvas,
    container,
  });

  const { 
    save, 
    canRedo, 
    canUndo, 
    undo, 
    redo,
    canvasHistory,
    setHistoryIndex,
  } = useHistory({ 
    canvas,
    autoZoom
  });

  useCanvasEvents({
    save,
    canvas,
    setSelectedObjects,
    clearSelectionCallback
  });

  const { copy, paste } = useClipboard({ canvas });
  
  useHotkeys({
    undo,
    redo,
    copy,
    paste,
    save,
    canvas,
  });

  const editor = useMemo(() => {
      if (canvas) {
        return buildEditor({
          undo,
          redo,
          canUndo,
          canRedo,
          autoZoom,
          copy,
          paste,  
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
    }, [autoZoom, canRedo, canUndo, canvas, copy, fillColor, fontFamily, paste, redo, selectedObjects, strokeColor, strokeDashArray, strokeWidth, undo]);
  
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

      const currentState = JSON.stringify(
        initialCanvas.toJSON(JSON_KEYS)
      );

      canvasHistory.current = [currentState];
      setHistoryIndex(0);

    }), [canvasHistory, setHistoryIndex])

  return {
    init,
    editor
  };
}
