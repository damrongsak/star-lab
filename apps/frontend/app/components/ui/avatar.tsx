// --- app/components/ui/avatar.tsx ---
// Avatar/profile image component (basic placeholder)
import React from "react";

interface AvatarProps {
  src: string;
  alt: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, alt }) => {
  return (
    <img
      className="h-9 w-9 rounded-full object-cover border-2 border-brand-blue/50"
      src={src}
      alt={alt}
      onError={(e) => {
        (e.target as HTMLImageElement).onerror = null;
        (e.target as HTMLImageElement).src =
          "https://placehold.co/100x100/cccccc/ffffff?text=U";
      }}
    />
  );
};

export { Avatar };
