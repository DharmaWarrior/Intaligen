import React, { useState, useEffect } from "react";
import { CirclePlus } from "lucide-react";
import { Button } from "../components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '../components/ui/resizable';
import { Separator } from '../components/ui/separator';
import {
  Tabs,
  TabsContent,
} from "../components/ui/tabs";
import { TooltipProvider } from "../components/ui/tooltip";
import { ChartDisplay } from "./components/ChartDisplay";
import { Chartlist } from "./components/Chartlist";
import AddForm from "./components/AddForm";
import { Tooltip, TooltipContent, TooltipTrigger } from "../components/ui/tooltip";

export default function Chart({
    charts,
    categories,
    fetchCharts,
    defaultLayout = [65, 33, 59],
    ordersData,
}) {

    const [dialogOpen, setDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tabData, setTabData] = useState({});
    const [stockData, setStockData] = useState({});

    const fetchTabs = async () => {
        try {
            let token = localStorage.getItem("usersdatatoken");
            if(!token) {
            console.log("Token not found");
            }
            
            const response = await fetch("/api/productionsummary_api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                "K": "-1",
            }),
        });

        if (response.ok) {
            const result = await response.json();
            setTabData(result);
        } else {
            console.error('Failed to fetch data');
            setLoading(false);
        }
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
        }
    };  

    const fetchStock = async () => {
      
        const requestBody = {
          k: 15,
          is_materials: "NO",
          is_semifinished: "NO",
          is_finished: "YES",
      };
        
        try {
            let token = localStorage.getItem("usersdatatoken");
            if(!token) {
              console.log("Token not found");
            }
            
            const response = await fetch("/api/maketostock_api", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
              body: JSON.stringify(requestBody)
            });
      
            if (response.ok) {
              const result = await response.json();
              setStockData(result);
            } else {
              console.error('Failed to fetch data');
              setLoading(false);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
          }
        };

    
        useEffect(() => {
            fetchStock();
            fetchTabs();
        }, []);



    const handleDialogOpen = () => {
    setDialogOpen(true);
    };

    const handleDialogClose = () => {
    setDialogOpen(false);
    };


    const handleFormSubmit = async (formData) => {
    console.log(formData);
    try {
        let token = localStorage.getItem("usersdatatoken");
        const response = await fetch('/api/addprodchart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
            "chart_note": formData.order_note,
            "date2": formData.dispatch_date,
        }),
    });

        if (response.ok) {
            setDialogOpen(false);
            fetchCharts();
        } else {
            alert('Failed to add order');
        }
    } catch (error) {
        console.error('Error adding order:', error);
        alert('Error adding order');
    }
    };

    const formFields = [
    { name: 'order_note', label: 'Note', type: 'text', required: true },
    { name: 'dispatch_date', label: 'Date', type: 'date', required: true },
    ];





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

        <ResizablePanel defaultSize={defaultLayout[1]} minSize={32}>
            <Tabs value='Pending'>
                <div className="flex items-center px-4 py-2">
                    <h1 className="text-xl font-bold">MASTER PRODUCTION SCHEDULE</h1>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className='ml-auto' onClick={handleDialogOpen}>
                                <CirclePlus className="h-4 w-4" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Add New Chart</TooltipContent>
                    </Tooltip>
                </div>
                <Separator />
                <div className="bg-background/95 p-4 pb-1 mb-1 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="relative mb-3">
                    <Button variant="ghost">Get Chart By Date ?</Button>
                    </div>
                </div>
                <TabsContent value="Pending" className="m-0">
                    <Chartlist items={charts}/>
                </TabsContent>
            </Tabs>
        </ResizablePanel>

        <ResizableHandle withHandle className="custom-resizable-handle"/>
            <ResizablePanel defaultSize={defaultLayout[2]} minSize={59}>
                <ChartDisplay ordersData={ordersData} tabData={tabData} stockData={stockData}  categories={categories}/>
            </ResizablePanel>
        </ResizablePanelGroup>

        <AddForm
            open={dialogOpen}
            handleClose={handleDialogClose}
            handleFormSubmit={handleFormSubmit} // Pass the fetchOrders function to refresh the list after adding order
            formFields={formFields}
            title="Add New Chart"
        />
    </TooltipProvider>
    );
}
