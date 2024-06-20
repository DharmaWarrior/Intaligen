"use client";

import { Link } from 'react-router-dom';
import { cn } from "./cn";
import { buttonVariants } from "./../../components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './../../components/ui/tooltip';
import { Separator } from '@radix-ui/react-dropdown-menu';

function Nav({ links, isCollapsed }) {
  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      
      <nav className="grid gap-6 pr-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        
        {links.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    to={link.route}
                    className={cn(
                      buttonVariants({ variant: link.variant, size: "icon" }),
                      "h-9 w-9",
                      link.variant === "default" &&
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <link.icon className="h-4 w-4" />
                    <span className="sr-only">{link.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="flex items-center gap-4">
                  {link.title}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              to={link.route}
              className={cn(
                buttonVariants({ variant: link.variant, size: "sm" }),
                link.variant === "default" &&
                  "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                "justify-start hover:bg-black hover:text-white"
              )} 
            >
              <link.icon className="mx-2 h-4 w-4" />
              {link.title} 
            </Link>
          )
        )}
      </nav>
    </div>
  );
}

export default Nav;
