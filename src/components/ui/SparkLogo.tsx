import Image from "next/image";

export function SparkLogo({ small = false }: { small?: boolean }) {
  return (
    <div className="relative flex items-center justify-center">
      <Image
        src="/assets/onboarding/slide_1_logo.png"
        alt="Innrspark"
        width={small ? 82 : 205}
        height={small ? 92 : 228}
        priority
        className="object-contain"
      />
    </div>
  );
}
