"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/shared/ui/form";
import { Input } from "@/src/shared/ui/input";
import { z } from "zod";

const SearchSchema = z.object({
  query: z.string().min(0),
});

type ISearchForm = z.infer<typeof SearchSchema>;

interface ExploreFormProps {
  onSearch?: (query: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

// Custom debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ExploreForm = ({
  onSearch,
  placeholder = "Search for anything...",
  debounceMs = 500,
}: ExploreFormProps) => {
  const form = useForm<ISearchForm>({
    resolver: zodResolver(SearchSchema),
    defaultValues: {
      query: "",
    },
  });

  const watchedQuery = form.watch("query");
  const debouncedQuery = useDebounce(watchedQuery, debounceMs);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedQuery);
    }
  }, [debouncedQuery, onSearch]);

  const handleClearSearch = () => {
    form.setValue("query", "");
  };

  const hasQuery = useMemo(() => watchedQuery.length > 0, [watchedQuery]);

  return (
    <section className="flex w-full flex-row items-center justify-center">
      <Form {...form}>
        <form className="relative flex w-full max-w-2xl flex-row items-center">
          <FormField
            control={form.control}
            name="query"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormControl>
                  <div className="relative flex w-full">
                    {/* Search Icon - Responsive sizing */}
                    <IconSearch
                      className="absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 transform text-neutral-500 sm:left-3 sm:h-5 sm:w-5"
                    />
                    
                    {/* Input Field - Responsive padding and font size */}
                    <Input
                      className="font-bricolage placeholder:font-bricolage !important flex h-9 w-full rounded-lg bg-neutral-100 py-2 pr-9 pl-8 text-sm text-neutral-700 placeholder:text-xs placeholder:text-neutral-600 focus-visible:shadow-none focus-visible:ring-0 sm:h-10 sm:pr-10 sm:pl-10 sm:text-base sm:placeholder:text-sm sm:placeholder:text-neutral-700"
                      placeholder={placeholder}
                      {...field}
                      autoComplete="off"
                    />
                    
                    {/* Clear Button - Responsive sizing */}
                    {hasQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute top-1/2 right-2.5 -translate-y-1/2 transform rounded-full p-1 text-neutral-500 transition-colors hover:bg-neutral-200 hover:text-neutral-700 active:bg-neutral-300 sm:right-3"
                        aria-label="Clear search"
                      >
                        <IconX className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    )}
                  </div>
                </FormControl>
                
                {/* Error Message - Responsive positioning */}
                <div className="absolute top-full left-2 sm:left-3">
                  <FormMessage className="font-bebas text-xs tracking-wide sm:text-sm sm:tracking-widest" />
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
};

export default ExploreForm;
