"use client"

import { AspectRatio as AspectRatioPrimitive } from "radix-ui"

import * as React from "react"

const AspectRatio = React.forwardRef<
  React.ElementRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>(({ ...props }, ref) => (
  <AspectRatioPrimitive.Root ref={ref} data-slot="aspect-ratio" {...props} />
))
AspectRatio.displayName = AspectRatioPrimitive.Root.displayName

export { AspectRatio }
