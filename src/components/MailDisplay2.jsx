import React, { useState, useEffect } from 'react';
import { Checkbox } from "./../../components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./../../components/ui/dropdown-menu"
import { Button } from "./../../components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "./../../components/ui/tooltip";
import { DataTable } from './DataTable';
import { ArrowUpDown, FileUp, MoreHorizontal, Search,FolderPlus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../../components/ui/tabs";



export function MailDisplay2({ ordersData, tabData, stockData }) {
  
    const [activeTab, setActiveTab] = useState('finished');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [finishedTabData, setFinishedTabData] = useState(tabData);
    const [semiFinishedTabData, setSemiFinishedTabData] = useState(tabData);


    const fetchProductionSummary = async (orderId) => {
      const requestBodyFinished = {
          k: 15,
          is_materials: "NO",
          is_semifinished: "NO",
          is_finished: "YES",
          order_filter: "yes",
          order_id: orderId
      };

      const requestBodySemiFinished = {
          k: 15,
          is_materials: "NO",
          is_semifinished: "YES",
          is_finished: "NO",
          order_filter: "yes",
          order_id: orderId
      };

      try {
          let token = localStorage.getItem("usersdatatoken");
          const [responseFinished, responseSemiFinished] = await Promise.all([
          fetch('/api/productionsummary_api', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify(requestBodyFinished)
          }),
          fetch('/api/productionsummary_api', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': 'Bearer ' + token
              },
              body: JSON.stringify(requestBodySemiFinished)
          })
      ]);

        if (responseFinished.ok) {
          const dataFinished = await responseFinished.json();
          setFinishedTabData(dataFinished);
        } else {
            console.error("Failed to fetch finished production summary");
        }
        if (responseSemiFinished.ok) {
          const dataSemiFinished = await responseSemiFinished.json();
          setSemiFinishedTabData(dataSemiFinished);
        } else {
            console.error("Failed to fetch semi-finished production summary");
        }

      } catch (error) {
          console.error("Error fetching production summary:", error);
      }
  };

  useEffect(() => {
      if (selectedOrder && selectedOrder !== 'All Orders') {
          fetchProductionSummary(selectedOrder);
      } else {
          setFinishedTabData(tabData);
          setSemiFinishedTabData(tabData);
      }
  }, [selectedOrder]);

  const handleOrderChange = (event) => {
    setSelectedOrder(event.target.value);
};
    

    const columnOrder = [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: "Item Name",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Item Name")}</div>,
        },
        {
          accessorKey: "Item Unit",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Unit <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Item Unit")}</div>,
        },
        {
          accessorKey: "Order_Quantity",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Demand <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Order_Quantity")}</div>,
        },
        {
          accessorKey: "Stock_Quantity",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Stock <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Stock_Quantity")}</div>,
        },
        {
          accessorKey: "Alloted_Quantity",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Alloted <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Alloted_Quantity")}</div>,
        },
        {
          accessorKey: "Progress_Quantity",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Progress <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Progress_Quantity")}</div>,
        },
        {
          accessorKey: "Max Possible",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Max PSBL <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Max Possible")}</div>,
        },
        {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
            const item = row.original;
      
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View item details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ];

    const columnStock = [
        {
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        },
        {
          accessorKey: "Item Name",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Name <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Item Name")}</div>,
        },
        {
          accessorKey: "Item Unit",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Unit <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Item Unit")}</div>,
        },
        {
          accessorKey: "demand",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Demand <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("demand")}</div>,
        },
        {
          accessorKey: "Stock_Quantity",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Stock <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Stock_Quantity")}</div>,
        },
        {
          accessorKey: "Alloted_Quantity",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Alloted <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Alloted_Quantity")}</div>,
        },
        {
          accessorKey: "Progress_Quantity",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Progress <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Progress_Quantity")}</div>,
        },
        {
          accessorKey: "Max Possible",
          header: ({ column }) => (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              Max PSBL <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          ),
          cell: ({ row }) => <div>{row.getValue("Max Possible")}</div>,
        },
        {
          id: "actions",
          enableHiding: false,
          cell: ({ row }) => {
            const item = row.original;
      
            return (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View item details</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          },
        },
      ];
    
    
    
    return (
    <div className="flex h-full flex-col">
        <div className="flex items-center px-4 py-2">
            <h1 className="text-xl font-bold">PRODUCTION PLANNING</h1>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button variant="default"className='ml-auto' >
                      <FolderPlus className="h-4 w-4" />
                      <span className="sr-only">ADD SELECTION</span>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>ADD SELECTION</TooltipContent>
            </Tooltip>
        </div>
        <Tabs defaultValue="mk_to_order" >
            <div className=" items-center pt-4 ">
                <TabsList className="ml-auto">
                    <TabsTrigger
                        value="mk_to_order"
                        className="text-zinc-600 dark:text-zinc-200"
                    >
                        MAKE TO ORDER
                    </TabsTrigger>
                    <TabsTrigger
                        value="mk_to_stock"
                        className="text-zinc-600 dark:text-zinc-200"
                    >
                        MAKE TO STOCK
                    </TabsTrigger>
                </TabsList>
            </div>
            <TabsContent value="mk_to_order" className="ml-1 mt-0 border border-x-y-emerald-50 card custom-scroll">
                <div className='flex flex-col gap-4'>
                  <select className='border-2 border-gray-500 rounded-lg py-1' onChange={handleOrderChange}>
                      <option>All Orders</option>
                    {Array.isArray(ordersData) && ordersData.length > 0 ? (
                      ordersData.map((order) => (
                        <option key={order.id} value={order.id}>{order.note}</option>
                      ))
                    ) : (
                      <option value=''>No Orders</option>
                    )}
                  </select>
                    <div className="flex-1 whitespace-pre-wrap text-sm">
                        <div className="flex border-b-2 border-gray-200 items-center justify-between pb-2">
                            <div>
                                <button
                                className={`py-2 px-4 ${activeTab === 'finished' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('finished')}
                                >
                                Finished
                                </button>
                                
                                <button
                                className={`py-2 px-4 ${activeTab === 'semi-finished' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('semi-finished')}
                                >
                                Semi-Finished
                                </button>
                                <button
                                className={`py-2 px-4 ${activeTab === 'by-category' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('by-category')}
                                >
                                By Category
                                </button>
                            </div>
                            {(activeTab === 'finished' || activeTab === 'semi-finished') && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" >
                                      <FileUp className="h-5 w-5" />
                                      <span className="sr-only">EXPORT</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>EXPORT</TooltipContent>
                                </Tooltip>
                            )}
                            {activeTab === 'by-category' && (
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button variant="ghost" size="icon" >
                                      <Search className="h-5 w-5" />
                                      <span className="sr-only">Search By Category</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Search By Category</TooltipContent>
                                </Tooltip>
                            )}
                        </div>
                        {activeTab === 'finished' && (
                            <DataTable data={finishedTabData} columns={columnOrder}/>
                        )}
                        {activeTab === 'semi-finished' && (
                            <DataTable data={semiFinishedTabData} columns={columnOrder}/>
                        )}
                    </div>
                </div>
                
            </TabsContent>
            <TabsContent value="mk_to_stock" className="ml-1 mt-0 border border-x-y-emerald-50 card custom-scroll">
                <div className='flex flex-col gap-4'>
                    <div className="flex-1 whitespace-pre-wrap text-sm">
                        <div className="flex border-b-2 border-gray-200 items-center justify-between pb-2">
                            <div>
                                <button
                                className={`py-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('products')}
                                >
                                Products
                                </button>
                                <button
                                className={`py-2 px-4 ${activeTab === 'by-category' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                                onClick={() => setActiveTab('by-category')}
                                >
                                By Category
                                </button>
                            </div>
                            {activeTab === 'products'&& (
                                <Button variant="ghost">
                                    EXPORT
                                </Button>
                            )}
                            {activeTab === 'by-category' && (
                                <Button variant="ghost">Search By Category</Button>
                            )}
                        </div>
                        {activeTab === 'products' && (
                            <DataTable data={stockData} columns={columnStock}/>
                        )}
                    </div>
                </div>
            </TabsContent>
        </Tabs>
    </div>
    );
}