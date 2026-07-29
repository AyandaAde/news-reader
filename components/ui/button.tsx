import * as React from "react"
import { Slot, Slottable } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { px } from "../utils"

const buttonVariants = cva(
  "inline-flex relative uppercase border font-mono cursor-pointer items-center justify-center gap-2 whitespace-nowrap font-medium tracking-[0.08em] ease-out transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-[3px] focus-visible:ring-[#EBB800]/40 [clip-path:polygon(var(--poly-roundness)_0,calc(100%_-_var(--poly-roundness))_0,100%_0,100%_calc(100%_-_var(--poly-roundness)),calc(100%_-_var(--poly-roundness))_100%,0_100%,0_calc(100%_-_var(--poly-roundness)),0_var(--poly-roundness))]",
  {
    variants: {
      variant: {
        default:
          "bg-[#f5e6a8] border-[#8a6a00] text-[#2a2208] [&>[data-border]]:bg-[#8a6a00] [box-shadow:inset_0_0_54px_0px_var(--tw-shadow-color)] shadow-[#EBB800]/50 hover:shadow-[#EBB800]/70 dark:border-[#EBB800] dark:bg-[#2a2208] dark:text-white dark:[&>[data-border]]:bg-[#EBB800] dark:shadow-[#EBB800] dark:hover:shadow-[#EBB800]/80",
      },
      size: {
        default: "h-14 px-8 text-sm sm:h-16 sm:px-10 sm:text-base",
        sm: "h-12 px-6 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const polyRoundness = 16
  const hypotenuse = polyRoundness * 2
  const hypotenuseHalf = polyRoundness / 2 - 1.5

  return (
    <Comp
      style={
        {
          "--poly-roundness": px(polyRoundness),
        } as React.CSSProperties
      }
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      <span
        data-border="top-left"
        style={
          {
            "--h": px(hypotenuse),
            "--hh": px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className="absolute inline-block w-[var(--h)] top-[var(--hh)] left-[var(--hh)] h-[2px] -rotate-45 origin-top -translate-x-1/2"
      />
      <span
        data-border="bottom-right"
        style={
          {
            "--h": px(hypotenuse),
            "--hh": px(hypotenuseHalf),
          } as React.CSSProperties
        }
        className="absolute w-[var(--h)] bottom-[var(--hh)] right-[var(--hh)] h-[2px] -rotate-45 translate-x-1/2"
      />

      <Slottable>{children}</Slottable>
    </Comp>
  )
}

export { Button, buttonVariants }
