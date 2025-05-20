interface FilterTabsProps {
    active: string;
    setActive: (category: string) => void;
    categories: string[];
  }
  
  export default function FilterTabs({ active, setActive, categories }: FilterTabsProps) {
    return (
      <div className="flex gap-3 flex-wrap mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-1 rounded-full border ${
              active === cat
                ? "bg-black text-white"
                : "bg-white text-black border-neutral-300 hover:border-black"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    );
  }
  