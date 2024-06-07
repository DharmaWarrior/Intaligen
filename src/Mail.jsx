"use client"

import React, { useState } from "react";
import { CirclePlus } from "lucide-react"
import { Button } from "./../components/ui/button";
import {
  AlertCircle,
  Archive,
  ArchiveX,
  File,
  Inbox,
  MessagesSquare,
  Search,
  Send,
  ShoppingCart,
  Trash2,
  Users2,
} from "lucide-react";

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




export default function Mail({
  mails,
  defaultLayout = [265, 440, 655],
  ordersData,
}) {
    
    

    const [mail] = useMail();

    if(!ordersData){
        return <div>Loading...</div>
    }

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
            
            <Tabs defaultValue="pending">
            <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">SALES ORDERS</h1>
                <TabsList className="ml-auto">
                <TabsTrigger
                    value="pending"
                    className="text-zinc-600 dark:text-zinc-200"
                >
                    Pending
                </TabsTrigger>
                <TabsTrigger
                    value="active"
                    className="text-zinc-600 dark:text-zinc-200"
                >
                    Active
                </TabsTrigger>
                <TabsTrigger
                    value="dispatch"
                    className="text-zinc-600 dark:text-zinc-200"
                >
                    Dispatch
                </TabsTrigger>
                
                </TabsList>
                <Button variant="outline" size="icon" className=" ml-2  ">
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
                    <Button variant="ghost" >Search By Category</Button>
                </div>
            </div>
            
            <TabsContent value="pending" className="m-0">
                
                <div className="">
                    {ordersData["orders_data"]}
                </div>
            </TabsContent>
            <TabsContent value="active" className="m-0">
                <MailList items={mails.filter((item) => item.status === 'active')} />
            </TabsContent>
            <TabsContent value="dispatch" className="m-0">
                <MailList items={mails.filter((item) => item.status === 'dispatch')} />
            </TabsContent>
            </Tabs>
        </ResizablePanel>
        
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={defaultLayout[2]}>
            <MailDisplay
            mail={mails.find((item) => item.id === mail.selected) || null}
            />
        </ResizablePanel>
        </ResizablePanelGroup>
    </TooltipProvider>
    );
}
