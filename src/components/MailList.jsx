import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "./cn";
import { Badge } from "./../../components/ui/badge";
import { ScrollArea } from "./../../components/ui/scroll-area";
import { Separator } from "./../../components/ui/separator";
import { useMail } from "./../hooks/useMail";

export function MailList({ items }) {
  const [mail, setMail] = useMail();

  console.log(items);

  return (
    <ScrollArea className="h-[600px]">
      <div className="flex flex-col gap-2 p-4 pt-0">

        {items.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              mail.selected === item.id && "bg-muted"
            )}
            onClick={() =>
              setMail({
                ...mail,
                selected: item.id,
              })
            }
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <div className="font-semibold">{item.name}</div>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xl border rounded px-2 border-black",
                    mail.selected === item.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {item.status}
                </div>
              </div>
              <div className="text-xs font-medium">{item.note}</div>
            </div>
            {item.date.length ? (
              <div>
                <Badge key={item.date}>
                    {item.date}
                  </Badge>
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </ScrollArea>
  );
}
