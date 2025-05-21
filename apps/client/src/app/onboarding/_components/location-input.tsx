"use client";

import { useState, useCallback } from "react";
import debounce from "lodash.debounce";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Controller } from "react-hook-form";
import type { Control, FieldValues, Path } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { FormItem } from "@/components/ui/form";

interface City {
  id: string;
  city: string;
  region: string;
  country: string;
}

interface LocationInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  className?: string;
  error?: string;
}

export default function LocationInput<T extends FieldValues>({
  name,
  control,
  placeholder = "Enter city...",
  className,
  error,
}: LocationInputProps<T>): React.JSX.Element {
  const [results, setResults] = useState<City[]>([]);
  const [open, setOpen] = useState(false);

  const fetchCities = async (search: string): Promise<void> => {
    if (!search) {
      setResults([]);
      return;
    }

    const res = await fetch(
      `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?namePrefix=${search}&limit=10&sort=-population`,
      {
        headers: {
          "X-RapidAPI-Key": process.env.NEXT_PUBLIC_GEODB_API_KEY as string,
          "X-RapidAPI-Host": "wft-geo-db.p.rapidapi.com",
        },
      },
    );

    const data = await res.json();

    if (!data.data) {
      return;
    }

    const cities = data.data.map((item: any) => ({
      id: item.id,
      city: item.city,
      region: item.region,
      country: item.country,
    }));

    setResults(cities);
    setOpen(true);
  };

  const debouncedFetch = useCallback(debounce(fetchCities, 400), []);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }): React.JSX.Element => (
        <FormItem className="relative">
          <Label htmlFor="location">Location</Label>
          <Popover open={open}>
            <PopoverTrigger asChild>
              <Input
                placeholder={placeholder}
                value={value || ""}
                onChange={(e): void => {
                  onChange(e.target.value);
                  debouncedFetch(e.target.value);
                }}
                type="text"
                className={cn(
                  error && "border-red-500 focus-visible:ring-red-500",
                  className,
                )}
              />
            </PopoverTrigger>
            {results.length > 0 && (
              <PopoverContent
                className="max-h-60 w-[var(--radix-popover-trigger-width)] overflow-auto p-0"
                align="start"
                side="bottom"
                sideOffset={4}
              >
                {results.map((city) => (
                  <div
                    key={city.id}
                    onClick={(): void => {
                      const formattedValue = `${city.city}, ${city.region}, ${city.country}`;
                      onChange(formattedValue);
                      setOpen(false);
                    }}
                    onKeyDown={(): void => {
                      const formattedValue = `${city.city}, ${city.region}, ${city.country}`;
                      onChange(formattedValue);
                      setOpen(false);
                    }}
                    className={cn(
                      "cursor-pointer px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800",
                    )}
                  >
                    {city.city}, {city.region}, {city.country}
                  </div>
                ))}
              </PopoverContent>
            )}
          </Popover>
          {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
        </FormItem>
      )}
    />
  );
}
