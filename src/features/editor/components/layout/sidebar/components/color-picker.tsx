import { ChromePicker, CirclePicker } from "react-color";
import { COLORS } from "@/features/editor/const";
import { rgbaObjectToString } from "@/features/editor/utils";
import { useClient } from "@/lib/hooks";

interface ColorPickerProps {
  value: string;
  onChange: (value: string) => void;
}

export const ColorPicker = ({ value, onChange }: ColorPickerProps) => {
  const onlyClient = useClient();

  return (
    <div className="w-full space-y-4">
      <ChromePicker
        color={value}
        onChange={(color) => {
          const formattedValue = rgbaObjectToString(color.rgb);
          onChange(formattedValue);
        }}
        className="border rounded-lg"
      />
      {
        onlyClient&&<CirclePicker
          color={value}
          colors={COLORS}
          onChangeComplete={(color) => {
            const formattedValue = rgbaObjectToString(color.rgb);
            onChange(formattedValue);
          }}
        />
      }
    </div>
  );
};
