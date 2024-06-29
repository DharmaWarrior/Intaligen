import React, { useState, useEffect } from "react";
import { CirclePlus, Search } from "lucide-react";
import { Button } from "./../components/ui/button";
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
import AddForm from "./components/AddForm";

export default function Mail({
  fetchOrders,
  defaultLayout = [18, 32, 50], // Adjusted sizes to ensure default size is not less than min size
  defaultCollapsed = false,
  ordersData,
  onStatusChange,
  currentStatus,
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeOrders, setActiveOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [dispatchedOrders, setDispatchedOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentTab, setCurrentTab] = useState(currentStatus);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (ordersData) {
      setActiveOrders(extractOrdersByStatus("Active"));
      setPendingOrders(extractOrdersByStatus("Pending"));
      setDispatchedOrders(extractOrdersByStatus("Dispatched"));
    }
  }, [ordersData]);

  useEffect(() => {
    onStatusChange(currentTab);
  }, [currentTab, onStatusChange]);

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

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSelectMail = async (id) => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/order_info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ order_id: id }),
      });

      if (response.status === 302) {
        const data = await response.json();
        setSelectedOrder({ ...data, orderId: id }); 
      } else {
        alert('Failed to fetch order info');
      }
    } catch (error) {
      console.error('Error fetching order info:', error);
      alert('Error fetching order info');
    }
  };

  const handleFormSubmit = async (formData) => {
    console.log(formData);
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
        setDialogOpen(false);
        setCurrentTab("Pending");
        fetchOrders("Pending");
      } else {
        alert('Failed to add order');
      }
    } catch (error) {
      console.error('Error adding order:', error);
      alert('Error adding order');
    }
  };

  const formFields = [
    { name: 'customer_id', label: 'Customer Name', type: 'search', required: true },
    { name: 'order_note', label: 'Order Note', type: 'text', required: true },
    { name: 'dispatch_date', label: 'Dispatch Date', type: 'date', required: true },
  ];

  const handleDeleteMail = async (orderId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this order?");
    if (confirmDelete) {
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
          setSelectedOrder(null);
          fetchOrders("Pending");
        } else {
          alert('Failed to delete the order');
        }
      } catch (error) {
        console.error('Error deleting the order:', error);
        alert('An error occurred while deleting the order');
      }
    }
  };

  const changeOrderStatus = async (orderId, newStatus) => {
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/ordervalidation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ 
          order_id: orderId,
          approval: newStatus,
        }),
      });

      if (response.status === 200) {
        setSelectedOrder(null);
        fetchOrders(newStatus);
        setCurrentTab(newStatus);
        handleSelectMail(orderId);
      } else {
        alert(`Failed to mark the order as ${newStatus.toLowerCase()}`);
      }
    } catch (error) {
      console.error(`Error marking the order as ${newStatus.toLowerCase()}:`, error);
      alert(`An error occurred while marking the order as ${newStatus.toLowerCase()}`);
    }
  };

  const filteredOrders = (orders) => orders.filter(order =>
    order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <TooltipProvider delayDuration={0}>
      <ResizablePanelGroup
        direction="horizontal"
        onLayout={(sizes) => {
          document.cookie = `react-resizable-panels:layout=${JSON.stringify(sizes)}`;
        }}
        className="h-full max-h-[1000px] items-stretch"
      >
        <ResizablePanel defaultSize={defaultLayout[1]} minSize={32} id='2' order='2'>
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <div className="flex items-center px-4 py-2">
              <h1 className="text-xl font-bold">SALES ORDERS</h1>
              <TabsList className="ml-auto">
                <TabsTrigger value="Pending" className="text-zinc-600 dark:text-zinc-200">
                  Pending
                </TabsTrigger>
                <TabsTrigger value="Active" className="text-zinc-600 dark:text-zinc-200">
                  Active
                </TabsTrigger>
                <TabsTrigger value="Dispatched" className="text-zinc-600 dark:text-zinc-200">
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
                  <Input 
                    placeholder="Search" 
                    className="pl-8" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                  />
                </div>
              </form>
              <div className="relative mb-3">
                <Button variant="ghost">Search By Category</Button>
              </div>
            </div>
            <TabsContent value="Pending" className="m-0">
              <MailList 
                items={filteredOrders(pendingOrders)} 
                handleSelectMail={handleSelectMail} 
                onSelectMail={setSelectedOrder} 
                selectedMail={selectedOrder} 
                onStatusChange={onStatusChange} 
                fetchOrders={fetchOrders}
              />
            </TabsContent>
            <TabsContent value="Active" className="m-0">
              <MailList 
                items={filteredOrders(activeOrders)} 
                handleSelectMail={handleSelectMail} 
                onSelectMail={setSelectedOrder} 
                selectedMail={selectedOrder} 
                onStatusChange={onStatusChange} 
                fetchOrders={fetchOrders}
              />
            </TabsContent>
            <TabsContent value="Dispatched" className="m-0">
              <MailList 
                items={filteredOrders(dispatchedOrders)} 
                handleSelectMail={handleSelectMail} 
                onSelectMail={setSelectedOrder} 
                selectedMail={selectedOrder} 
                onStatusChange={onStatusChange} 
                fetchOrders={fetchOrders}
              />
            </TabsContent>
          </Tabs>
        </ResizablePanel>
        <ResizableHandle withHandle className="custom-resizable-handle"/>
        <ResizablePanel defaultSize={defaultLayout[2]} minSize={50} id='3' order='3'>
          <MailDisplay 
            mail={selectedOrder} 
            onDeleteMail={handleDeleteMail} 
            handleSelectMail={handleSelectMail} 
            ApproveToDisp={() => changeOrderStatus(selectedOrder.orderId, "COMPLETED")}
            setCurrentTab={setCurrentTab} 
            fetchOrders={fetchOrders} 
            currentStatus={currentStatus} 
            ApproveToActive={() => changeOrderStatus(selectedOrder.orderId, "ACTIVE")}
            ApproveToPending={() => changeOrderStatus(selectedOrder.orderId, "PENDING")}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
      <AddForm
        open={dialogOpen}
        handleClose={handleDialogClose}
        handleFormSubmit={handleFormSubmit}
        fetchData={fetchOrders}
        formFields={formFields}
        title="Add New Order"
      />
    </TooltipProvider>
  );
}
