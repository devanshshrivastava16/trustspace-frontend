import * as React from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";

// Define the props for the DestinationCard component
interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag?: string;
  stats?: string;
  themeColor: string;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, imageUrl, location, flag, stats, themeColor, onClick, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          "--theme-color": themeColor,
        } as React.CSSProperties}
        className={cn("group relative cursor-pointer shrink-0", className)}
        onClick={onClick}
        {...props}
      >
        <div
          className="relative block w-full h-full rounded-2xl overflow-hidden shadow-lg 
                     transition-all duration-500 ease-in-out 
                     group-hover:scale-105 group-hover:shadow-[0_0_40px_-15px_hsl(var(--theme-color)/0.6)]"
          style={{
             boxShadow: `0 0 20px -10px hsl(var(--theme-color) / 0.5)`
          }}
        >
          {/* Background Image with Parallax Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center 
                       transition-transform duration-500 ease-in-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Themed Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 0.9), hsl(var(--theme-color) / 0.6) 40%, transparent 70%)`,
            }}
          />
          
          {/* Content */}
          <div className="relative flex flex-col justify-end h-full p-4 text-white">
            <h3 className="text-lg font-bold tracking-tight leading-tight">
              {location} {flag && <span className="text-base ml-1">{flag}</span>}
            </h3>
            {stats && <p className="text-xs text-white/80 mt-1 font-medium">{stats}</p>}

            {/* Explore Button */}
            <div className="mt-3 flex items-center justify-between bg-[hsl(var(--theme-color)/0.2)] backdrop-blur-md border border-[hsl(var(--theme-color)/0.3)]
                           rounded-lg px-2 py-1.5 transition-all duration-300
                           group-hover:bg-[hsl(var(--theme-color)/0.4)] group-hover:border-[hsl(var(--theme-color)/0.5)]">
              <span className="text-[10px] font-semibold tracking-wide">Explore</span>
              <ArrowRight className="h-2.5 w-2.5 transform transition-transform duration-300 group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };