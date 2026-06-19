import {Separator as SeparatorPrimitive} from "radix-ui"
import type { ComponentPropsWithoutRef } from 'react'

import {cn} from "@/lib/utils"

type SeparatorProps = ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> & {
    decorative?: boolean
}

function Separator({ className = "", decorative = true, orientation = "horizontal", ...props }: SeparatorProps) {
    return (
        <SeparatorPrimitive.Root
            data-slot="separator"
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
                className
            )}
            {...props} />
    );
}

export {Separator}
