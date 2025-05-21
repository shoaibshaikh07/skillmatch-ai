import * as React from "react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Button } from "./button";
import { Eye, EyeClosed } from "lucide-react";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          data-slot="input"
          className={cn(
            "flex h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground file:text-sm placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
            className,
          )}
          {...props}
        />
        {type === "password" && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute inset-y-0 right-0 flex items-center"
            onClick={(): void => setShowPassword(!showPassword)}
          >
            <span>
              {showPassword ? (
                <EyeClosed className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </span>
          </Button>
        )}
      </div>
    </>
  );
}

export { Input };
