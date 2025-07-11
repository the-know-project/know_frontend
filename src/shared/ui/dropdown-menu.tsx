import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function DropdownMenu({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const options = ["Daily", "Weekly", "Monthly", "Yearly"];

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm"
      >
        {selected} <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-36 rounded-md bg-white shadow-lg dark:bg-zinc-800">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-zinc-700"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
