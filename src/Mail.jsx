"use client";

import React, { useState, useEffect } from "react";
import { CirclePlus, Search } from "lucide-react";
import { Button } from "./../components/ui/button";
import { cn } from "./components/cn";
import { Input } from './../components/ui/input';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './../components/ui/resizable';
import { Separator } from './../components/ui/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../components/ui/tabs";
import { TooltipProvider } from "./../components/ui/tooltip";
import { MailDisplay } from "./components/MailDispaly";
import { MailList } from "./components/MailList";
import { useMail } from "./hooks/useMail";
import AddForm from "./components/AddForm";

export default function Mail({
  mails,
  defaultLayout = [265, 440, 655],
  ordersData,
  onStatusChange,
  currentStatus,
}) {
  const [mail, setMail] = useMail();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [dispatchedOrders, setDispatchedOrders] = useState([]);

  useEffect(() => {
    if (ordersData) {
      setActiveOrders(extractOrdersByStatus("Active"));
      setPendingOrders(extractOrdersByStatus("Pending"));
      setDispatchedOrders(extractOrdersByStatus("Dispatched"));
    }
  }, [ordersData]);

  const extractOrdersByStatus = (status) => {
    return ordersData.orders_data
      ? Object.values(ordersData.orders_data)
          .filter(orderData => orderData.order.status === status)
          .map(orderData => ({
            order: orderData.order,
            customer: orderData.customer
          }))
      : [];
  };

  const selectedOrder = mail.selected
    ? [...activeOrders, ...pendingOrders, ...dispatchedOrders].find(
        (item) => item.order.id === mail.selected
      )
    : null;

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleFormSubmit = async (formData) => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/addorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          new_order_cust_id: formData.customer_id,
          new_order_note: formData.order_note,
          new_order_desp_date: formData.dispatch_date,
        }),
      });

      if (response.ok) {
        alert('Order added successfully');
        setDialogOpen(false);
        fetchOrders(); // Fetch updated orders after adding new one
      } else {
        alert('Failed to add order');
      }
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Error adding order');
    }
  };

  const formFields = [
    { name: 'customer_id', label: 'Customer ID', type: 'text', required: true },
    { name: 'order_note', label: 'Order Note', type: 'text', required: true },
    { name: 'dispatch_date', label: 'Dispatch Date', type: 'date', required: true },
  ];

  const fetchOrders = async () => {
    // Fetch orders data here and update state accordingly
    // For example:
    const response = await fetch('/api/orders');
    const data = await response.json();
    setActiveOrders(extractOrdersByStatus("Active"));
    setPendingOrders(extractOrdersByStatus("Pending"));
    setDispatchedOrders(extractOrdersByStatus("Dispatched"));
  };

  const handleDeleteMail = async (orderId) => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/deleteorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ delete_order_id: orderId }),
      });

      if (response.status === 200) {
        alert('Order deleted');
        fetchOrders(); // Fetch updated orders after deletion
        setMail({ selected: null }); // Deselect the mail after deletion
      } else {
        alert('Failed to delete the order');
      }
    } catch (error) {
      console.error('Error deleting the order:', error);
      alert('An error occurred while deleting the order');
    }
  };

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(
            sizes
          )}`;
        }}
        className="h-full max-h-[800px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
          <Tabs defaultValue="Active" onValueChange={onStatusChange}>
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">SALES ORDERS</h1>
              <TabsList className="ml-auto">
                <TabsTrigger
                  value="Pending"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Pending
                </TabsTrigger>
                <TabsTrigger
                  value="Active"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Active
                </TabsTrigger>
                <TabsTrigger
                  value="Dispatched"
                  className="text-zinc-600 dark:text-zinc-200"
                >
                  Dispatched
                </TabsTrigger>
              </TabsList>
              <Button variant="outline" size="icon" className="ml-2" onClick={handleDialogOpen}>
                <CirclePlus className="h-4 w-4" />
              </Button>
            </div>
            <Separator />
            <div className="bg-background/95 p-4 pb-1 mb-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <form>
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Search" className="pl-8" />
                </div>
              </form>
              <div className="relative mb-3">
                <Button variant="ghost">Search By Category</Button>
              </div>
            </div>
            <TabsContent value="Pending" className="m-0">
              <MailList items={pendingOrders} onSelectMail={(mail) => setMail({ selected: mail.order.id })} selectedMail={selectedOrder} />
            </TabsContent>
            <TabsContent value="Active" className="m-0">
              <MailList items={activeOrders} onSelectMail={(mail) => setMail({ selected: mail.order.id })} selectedMail={selectedOrder} />
            </TabsContent>
            <TabsContent value="Dispatched" className="m-0">
              <MailList items={dispatchedOrders} onSelectMail={(mail) => setMail({ selected: mail.order.id })} selectedMail={selectedOrder} />
            </TabsContent>
          </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
          <MailDisplay mail={selectedOrder} onDeleteMail={handleDeleteMail} />
        </ResizablePanel>
      </ResizablePanelGroup>

      <AddForm
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleFormSubmit={handleFormSubmit}
        fetchData={fetchOrders} // Pass the fetchOrders function to refresh the list after adding order
        formFields={formFields}
        title="Add New Order"
      />
    </TooltipProvider>
  );
}