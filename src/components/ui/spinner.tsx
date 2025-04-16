import React from "react"
import { LoaderCircle } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva("", {
  variants: {
    size: {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-12 h-12",
      xl: "w-16 h-16",
      "2xl": "w-20 h-20",
    },
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
})

function Spinner ({
  className,
  children,
  size = "md",
  orientation = "horizontal",
  ...props
} : React.ComponentProps<"div"> & VariantProps<typeof spinnerVariants>) {
  return (
    <div 
      className= {cn(spinnerVariants({ orientation }), "mx-auto w-full flex items-center justify-center gap-2 text-muted-foreground", className)} 
      {...props}
    >
      <LoaderCircle className= {cn(spinnerVariants({ size }), "animate-spin transition-transform")}/>
      {children}
    </div>
  )
}

export { Spinner };