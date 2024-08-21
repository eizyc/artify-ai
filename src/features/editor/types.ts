import { ITextboxOptions } from "fabric/fabric-impl";
export interface EditorHookProps {
  defaultWidth?: number;
  defaultHeight?: number;
  clearSelectionCallback?: () => void;
};

export type ActiveTool =
  | "select"
  | "shapes"
  | "text"
  | "images"
  | "draw"
  | "fill"
  | "stroke-color"
  | "stroke-style"
  | "font"
  | "opacity"
  | "filter"
  | "settings"
  | "ai"
  | "remove-bg"
  | "templates";



  export type BuildEditorProps = {
    canvas: fabric.Canvas;
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;
    selectedObjects: fabric.Object[];
    strokeDashArray: number[];
    fontFamily: string;
    setStrokeDashArray: (value: number[]) => void;
    setFillColor: (value: string) => void;
    setStrokeColor: (value: string) => void;
    setStrokeWidth: (value: number) => void;
    setFontFamily: (value: string) => void;
  };
  
  export interface Editor {
    canvas: fabric.Canvas;
    addCircle: () => void;
    addSoftRectangle: () => void;
    addRectangle: () => void;
    addTriangle: () => void;
    addInverseTriangle: () => void;
    addDiamond: () => void;
    addText: (value: string, options?: ITextboxOptions) => void;
    bringForward: () => void;
    sendBackwards: () => void;
    changeStrokeWidth: (value: number) => void;
    changeFillColor: (value: string) => void;
    changeStrokeColor: (value: string) => void;
    changeStrokeDashArray: (value: number[]) => void;
    changeOpacity: (value: number) => void;
    changeFontFamily: (value: string) => void;
    changeFontWeight: (value: number) => void;
    changeFontSize: (value: number) => void;
    changeFontStyle: (value: string) => void;
    changeFontLinethrough: (value: boolean) => void;
    changeFontUnderline: (value: boolean) => void;
    changeTextAlign: (value: string) => void;
    getActiveFillColor: () => string;
    getActiveStrokeColor: () => string;
    getActiveStrokeWidth: () => number;
    getActiveStrokeDashArray: () => number[];
    getActiveOpacity: () => number;
    getActiveFontFamily: () => string;
    getActiveFontWeight: () => string;
    getActiveFontSize: () => number;
    getActiveFontStyle: () => string;
    getActiveFontLinethrough: () => boolean;
    getActiveFontUnderline: () => boolean;
    getActiveTextAlign: () => string;
    selectedObjects: fabric.Object[];
  };
  