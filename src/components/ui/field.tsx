import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"

function Field({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field"
      className={cn("grid w-full items-start gap-1.5", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return <Label data-slot="field-label" className={cn(className)} {...props} />
}

export { Field, FieldLabel }
