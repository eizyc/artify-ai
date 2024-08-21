import { useEffect, useMemo, useState } from "react";
import { 
  ActiveTool, 
  Editor, 
} from "@/features/editor/types";

import { cn } from "@/lib/utils";
import { Hint } from "@/components/hint";
import { Button } from "@/components/ui/button";
import { BsBorderWidth } from "react-icons/bs";
import { RxTransparencyGrid } from "react-icons/rx";
import { ArrowDown, ArrowUp, ChevronDown } from "lucide-react";
import { FontSizeInput, FontWeightSelect } from "./components";
import { isTextType } from "../../../utils";
import { FILL_COLOR, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, STROKE_COLOR } from "@/features/editor/const";

interface ToolbarProps {
  editor: Editor | undefined;
  activeTool: ActiveTool;
  onChangeActiveTool: (tool: ActiveTool) => void;
};

const side = 'top';
const sideOffset = 5;
export const Toolbar = ({
  editor,
  activeTool,
  onChangeActiveTool,
}: ToolbarProps) => {
  const initialFillColor = editor?.getActiveFillColor() ?? FILL_COLOR;
  const initialStrokeColor = editor?.getActiveStrokeColor() ?? STROKE_COLOR;
  const initialFontFamily = editor?.getActiveFontFamily() ?? FONT_FAMILY;
  const initialFontWeight = editor?.getActiveFontWeight() ?? FONT_WEIGHT;
  const initialFontSize = editor?.getActiveFontSize() ?? FONT_SIZE;

  const [properties, setProperties] = useState({
    fillColor: initialFillColor,
    strokeColor: initialStrokeColor,
    fontFamily: initialFontFamily,
    fontWeight: initialFontWeight,
    fontSize: initialFontSize,
  });

  const selectedObjects = useMemo(() => editor?.selectedObjects, [editor]);

  const [includeText] = useMemo(() => {
    const includeText = selectedObjects?.some((object) => isTextType(object.type));
    return [includeText]
  }, [selectedObjects])

  useEffect(() => {
    if (!editor)  return
    setProperties((current) => ({
      ...current,
      fillColor: editor?.getActiveFillColor() ?? FILL_COLOR,
      strokeColor: editor?.getActiveStrokeColor() ?? STROKE_COLOR,
      fontFamily: editor?.getActiveFontFamily() ?? FONT_FAMILY,
      fontWeight: editor?.getActiveFontWeight() ?? FONT_WEIGHT,
      fontSize: editor?.getActiveFontSize() ?? FONT_SIZE,
    }));
    },[editor])



  const onChangeFontSize = (value: number) => {
    if (!selectedObjects) {
      return;
    }

    editor?.changeFontSize(value);
    setProperties((current) => ({
      ...current,
      fontSize: value,
    }));
  };

  const onChangeFontWeight = (value: number) => {
    if (!selectedObjects) {
      return;
    }

    editor?.changeFontWeight(value);
    setProperties((current) => ({
      ...current,
      fontWeight: value,
    }));
  };

  if (editor?.selectedObjects.length === 0) {
    return (
      <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2" />
    );
  }

  return (
    <div className="shrink-0 h-[56px] border-b bg-white w-full flex items-center overflow-x-auto z-[49] p-2 gap-x-2">
      <div className="flex items-center h-full justify-center">
        <Hint label="Color" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => onChangeActiveTool("fill")}
            size="icon"
            variant="ghost"
            className={cn(
              activeTool === "fill" && "bg-gray-100"
            )}
          >
            <div
              className="rounded-sm size-4 border"
              style={{ backgroundColor: properties.fillColor }}
            />
          </Button>
        </Hint>
      </div>
      
      <div className="flex items-center h-full justify-center">
        <Hint label="Stroke color" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => onChangeActiveTool("stroke-color")}
            size="icon"
            variant="ghost"
            className={cn(
              activeTool === "stroke-color" && "bg-gray-100"
            )}
          >
            <div
              className="rounded-sm size-4 border-2 bg-white"
              style={{ borderColor: properties.strokeColor }}
            />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Stroke Style" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => onChangeActiveTool("stroke-style")}
            size="icon"
            variant="ghost"
            className={cn(
              activeTool === "stroke-style" && "bg-gray-100"
            )}
          >
            <BsBorderWidth className="size-4" />
          </Button>
        </Hint>
      </div>
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font" side={side} sideOffset={sideOffset}>
            <Button
              onClick={() => onChangeActiveTool("font")}
              size="icon"
              variant="ghost"
              className={cn(
                "w-auto px-2 text-sm",
                activeTool === "font" && "bg-gray-100"
              )}
            >
              <div className="max-w-[100px] truncate">
                {properties.fontFamily}
              </div>
              <ChevronDown className="size-4 ml-2 shrink-0" />
            </Button>
          </Hint>
        </div>
      )}
      <div className="flex items-center h-full justify-center">
        <Hint label="Bring forward" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => editor?.bringForward()}
            size="icon"
            variant="ghost"
          >
            <ArrowUp className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Send backwards" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => editor?.sendBackwards()}
            size="icon"
            variant="ghost"
          >
            <ArrowDown className="size-4" />
          </Button>
        </Hint>
      </div>
      <div className="flex items-center h-full justify-center">
        <Hint label="Opacity" side={side} sideOffset={sideOffset}>
          <Button
            onClick={() => onChangeActiveTool("opacity")}
            size="icon"
            variant="ghost"
            className={cn(activeTool === "opacity" && "bg-gray-100")}
          >
            <RxTransparencyGrid className="size-4" />
          </Button>
        </Hint>
      </div>
      {includeText && (
        <div className="flex items-center h-full justify-center">
          <Hint label="Font Weight" side="top" sideOffset={sideOffset}>
            <div>
              <FontWeightSelect
                value={properties.fontWeight}
                onChange={(value) => { onChangeFontWeight (value) }}
              />
            </div>
          </Hint>
        </div>
      )}
      {includeText && (
        <div className="flex items-center h-full justify-center">
        <Hint label="Font Size" side={side} sideOffset={sideOffset}>
          <div className="flex items-center justify-center">
            <FontSizeInput
              value={properties.fontSize}
              onChange={(value) => { onChangeFontSize (value) }}
            />
          </div>
         </Hint>
        </div>
      )}
    </div>
  );
};
