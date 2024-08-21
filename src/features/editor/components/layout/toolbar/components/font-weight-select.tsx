import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const options: string[] = Array.from({ length: 8 }, (_, i) => String((i + 1)* 100));
interface FontWeightSelectProps {
  value: number | string;
  onChange: (value: number) => void;
};

export const FontWeightSelect = ({
  value,
  onChange,
}: FontWeightSelectProps) => {

  const handleChange = (
    value: string
  ) => {
    onChange(parseInt(value));
  };

  return (
    <Select value={String(value)}   onValueChange={(value) => { handleChange(value)}}>
      <SelectTrigger className="w-100">
        <SelectValue placeholder="Font Weight" />
      </SelectTrigger>
      <SelectContent>
        {
          options.map(item=>(
            <SelectItem value={item} key={item}>{item}</SelectItem>
          ))
        }
      </SelectContent>
    </Select>
  );
};
