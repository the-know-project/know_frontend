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
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative w-full">
                    <IconSearch
                      width={20}
                      height={20}
                      className="absolute top-1/2 left-3 -translate-y-1/2 transform text-neutral-500"
                    />
                    <Input
                      className="font-bricolage placeholder:font-bricolage !important flex w-full rounded-lg bg-neutral-100 pr-10 pl-10 text-neutral-700 placeholder:text-sm placeholder:text-neutral-700 focus-visible:shadow-none focus-visible:ring-0"
                      placeholder={placeholder}
                      {...field}
                    />
                    {hasQuery && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute top-1/2 right-3 -translate-y-1/2 transform text-neutral-500 transition-colors hover:text-neutral-700"
                      >
                        <IconX width={16} height={16} />
                      </button>
                    )}
                  </div>
                </FormControl>
                <div className="absolute top-full left-3">
                  <FormMessage className="font-bebas tracking-widest" />
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
