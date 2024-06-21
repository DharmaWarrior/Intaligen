import React from "react";
import formatDistanceToNow from "date-fns/formatDistanceToNow";

import { cn } from "./cn";
import { Badge } from "./../../components/ui/badge";

import { ScrollArea } from "./../../components/ui/scroll-area";
import { Separator } from "./../../components/ui/separator";

export function MailList({ items, handleSelectMail, onSelectMail, selectedMail, onStatusChange, fetchOrders }) {
  
  // const handleSelectMail = async (item) => {
  //   try {
  //     let token = localStorage.getItem("usersdatatoken");
  //     const response = await fetch('/api/order_info', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': 'Bearer ' + token,
  //       },
  //       body: JSON.stringify({ order_id: item.order.id }),
  //     });

  //     if (response.status === 302) {
  //       const data = await response.json();
  //       onSelectMail({ ...data, orderId: item.order.id }); 
        
  //     } else {
  //       alert('Failed to fetch order info');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching order info:', error);
  //     alert('Error fetching order info');
  //   }
  // };

  return (
    <ScrollArea className="h-[500px]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.length > 0 ? (
          items.map((item) => (
            <button
              key={item.order.id}
              className=
                'flex flex-col items-start gap-2 rounded-lg border border-1 border-solid border-gray-200 p-3 text-left text-sm transition-all hover:bg-accent'
              
              onClick={() => handleSelectMail(item.order.id)}
            >
              <div className="flex w-full flex-col  gap-1">
                <div className="flex items-center">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-lg">{item.customer.name}</div>
                  </div>
                  <div
                    className={cn(
                      'ml-auto text-xl border rounded px-2 border-black'
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
