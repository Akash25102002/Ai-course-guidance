import * as Icons from "lucide-react";

interface IconProps extends Omit<React.ComponentPropsWithoutRef<"svg">, "name"> {
  name: string;
  className?: string;
  size?: number;
}

export function LucideIcon({ name, ...props }: IconProps) {
  const IconComponent = (Icons as any)[name];
  if (!IconComponent) {
    return <Icons.HelpCircle {...props} />;
  }
  return <IconComponent {...props} />;
}
export default LucideIcon;
