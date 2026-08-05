import Image from "next/image";
import { cn } from "@/lib/utils";

export function EiloLogo({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/images/logo-2.png"
        alt="Eilo"
        width={120}
        height={40}
        priority={priority}
        className={cn(
          "h-6 w-auto object-contain sm:h-7 dark:hidden",
          className,
        )}
      />
      <Image
        src="/images/logo-dark.png"
        alt="Eilo"
        width={120}
        height={40}
        priority={priority}
        className={cn(
          "hidden h-10 w-auto object-contain sm:h-8 dark:block",
          className,
        )}
      />
    </>
  );
}
