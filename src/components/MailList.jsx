import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "./cn";
import { Badge } from "./../../components/ui/badge";
import { ScrollArea } from "./../../components/ui/scroll-area";
import { Separator } from "./../../components/ui/separator";
import { useMail } from "./../hooks/useMail";

export function MailList({ items, onSelectMail, selectedMail }) {
  return (
    <ScrollArea className="h-[400px]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.order.id}
              className={cn(
                'flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent',
                selectedMail && selectedMail.order.id === item.order.id && 'bg-muted'
              )}
              onClick={() => onSelectMail(item)}
            >
              <div className="flex w-full flex-col gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-lg">{item.customer.name}</div>
                  </div>
                  <div
                    className={cn(
                      'ml-auto text-xl border rounded px-2 border-black',
                      selectedMail && selectedMail.order.id === item.order.id
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    )}
                  >
                    {item.order.status}
                  </div>
                </div>
                <div className="text-xs font-medium">{item.order.note}</div>
              </div>
              {item.order.regdate && item.order.despdate && (
                <div>
                  <span className="text-blue-600 font-semibold">{item.order.regdate}</span>{' << '}
                  <span className="text-red-600 font-semibold">{item.order.despdate}</span>
                </div>
              )}
            </button>
          ))
        ) : (
          <p>No orders available</p>
        )}
      </div>
    </ScrollArea>
  );
}
