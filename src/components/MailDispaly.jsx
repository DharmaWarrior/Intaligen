import React, { useState } from 'react';
import {
  Archive,
  ArchiveX,
  Clock,
  Forward,
  CirclePlus,
  MoreVertical,
  Reply,
  ReplyAll,
  FileText,
  ClipboardCheck,
  ArrowUpFromLine,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./../../components/ui/tabs";

import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "./../../components/ui/dropdown-menu";
import { Button } from "./../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "./../../components/ui/dropdown-menu";
import { Separator } from "./../../components/ui/separator";
import { Textarea } from "./../../components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./../../components/ui/tooltip";


export function MailDisplay({ mail }) {

  const [activeTab, setActiveTab] = useState('Orders');
  const today = new Date();

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ArchiveX className="h-4 w-4" />
                <span className="sr-only">Decline Order</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Decline Order</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ClipboardCheck className="h-4 w-4" />
                <span className="sr-only">Mark As Complete</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mark As Complete</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <ArrowUpFromLine className="h-4 w-4" />
                <span className="sr-only">Push Invoice To Finance</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Push Invoice To Finance</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Delete Order</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete Order</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <FileText className="h-4 w-4" />
                <span className="sr-only">Order Sheet PDF</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Order Sheet PDF</TooltipContent>
          </Tooltip>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Separator orientation="vertical" className="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!mail}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>#</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
      </div>
      <Separator />
      {mail ? (
        <div className="flex flex-1 flex-col">
          <div className="flex items-start p-4">
            <div className="flex items-start gap-4 text-sm">
              <div className="grid gap-1">
                <div className="font-semibold text-4xl mb-2">{mail.name}</div>
                <div className="line-clamp-1 text-xl mb-2">{mail.note}</div>
                <div className="line-clamp-1 text-xs mb-2">
                  <span className="font-large">{mail.date}</span> 
                </div>
              </div>
            </div>
            {mail.status && (
              <div className="ml-auto text-xl border rounded border-black p-2 text-muted-foreground">
                {mail.status}
              </div>
            )}
          </div>
          <Separator />
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
              <div className="flex  mb-4 border-b-2 border-gray-200">
                <button
                  className={`py-2 px-4 ${activeTab === 'Orders' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('Orders')}
                >
                  Orders
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'Dispatch' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('Dispatch')}
                >
                  Dispatch
                </button>
                <button
                  className={`py-2 px-4 ${activeTab === 'Documents' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                  onClick={() => setActiveTab('Documents')}
                >
                  Documents
                </button>
              </div>

              {activeTab === 'Orders' && (
                <Table className="min-w-full bg-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Order ID</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Customer Name</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Total Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="py-2 px-4 border-b">1</TableCell>
                      <TableCell className="py-2 px-4 border-b">John Doe</TableCell>
                      <TableCell className="py-2 px-4 border-b">$99.99</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="py-2 px-4 border-b">2</TableCell>
                      <TableCell className="py-2 px-4 border-b">Jane Smith</TableCell>
                      <TableCell className="py-2 px-4 border-b">$149.99</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}

              {activeTab === 'Dispatch' && (
                <Textarea />
              )}

              {activeTab === 'Documents' && (
                <Textarea />
              )}
            
          </div>
          <Separator className="mt-auto" />
        </div>
      ) : (
        <div className="p-8 text-center text-muted-foreground">
          No message selected
        </div>
      )}
    </div>
  );
}
