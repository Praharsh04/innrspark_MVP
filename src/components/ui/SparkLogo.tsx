import Image from "next/image";

type SparkLogoProps = {
  small?: boolean;
  hero?: boolean;
  className?: string;
};

export function SparkLogo({
  small = false,
  hero = false,
  className = "",
}: SparkLogoProps) {
  const size = small ? 72 : hero ? 300 : 180;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/assets/onboarding/slide1_logo.png"
        alt="Innrspark"
        width={size}
        height={size}
        priority
        className="h-auto w-full object-contain"
      />
    </div>
  );
}
