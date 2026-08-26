import Image from "next/image";
import { cn } from "@/lib/utils";

function EiloLogoWordmark({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/images/logo.png"
        alt="Eilo"
        width={668}
        height={315}
        priority={priority}
        className={cn(
          "h-6 w-auto max-w-none object-contain dark:hidden",
          className,
        )}
      />
      <Image
        src="/images/logo-dark.png"
        alt="Eilo"
        width={671}
        height={446}
        priority={priority}
        className={cn(
          "hidden h-6 w-auto max-w-none object-contain dark:block",
          className,
        )}
      />
    </>
  );
}

function EiloLogoFull({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <>
      <Image
        src="/images/logo.png"
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

export function EiloLogo({
  className,
  priority = false,
  variant = "full",
}: {
  className?: string;
  priority?: boolean;
  variant?: "full" | "wordmark";
}) {
  if (variant === "wordmark") {
    return (
      <EiloLogoWordmark className={className} priority={priority} />
    );
  }

  return <EiloLogoFull className={className} priority={priority} />;
}
