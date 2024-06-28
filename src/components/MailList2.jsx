import React, { useState } from "react";
import { CirclePlus } from 'lucide-react';
import { cn } from "./cn";
import { Badge } from "./../../components/ui/badge";
import { ScrollArea } from "./../../components/ui/scroll-area";
import { Separator } from "./../../components/ui/separator";
import { Button } from "./../../components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "./../../components/ui/table";
import { useNavigate } from 'react-router-dom';
import EditChartDialog from './../cards/EditChartDialog';

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
}

export function MailList2({ items, handleSelectMail, onSelectMail, selectedMail, onStatusChange, fetchOrders }) {
    const navigate = useNavigate();
    const [isDialogOpen, setDialogOpen] = useState(false);
    const [selectedOrderData, setSelectedOrderData] = useState(null);

    const handleWorkstationClick = (date) => {
        navigate('/workstation_console', { state: { isDateSelected: formatDate(date) } });
    };

    const handleEditChartClick = (orderData) => {
        setSelectedOrderData(orderData);
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedOrderData(null);
    };

    const handleSaveChanges = (updatedOrderData) => {
        console.log("Saved Order Data:", updatedOrderData);
        // Update your state or perform other actions with updatedOrderData
        setDialogOpen(false);
    };

    return (
        <ScrollArea className="h-[565px]">
            <div className="flex flex-col p-4 gap-2 pt-0">
                {Object.values(items).map((item, index) => (
                    <div key={index} className='flex flex-col items-start gap-2 rounded-lg border border-1 border-solid border-gray-200 p-3 text-left text-sm transition-all '>
                        <div className="flex w-full gap-4">
                            <div className="flex flex-col items-left gap-3">
                                <div className="font-semibold text-lg">
                                    {formatDate(item.date)}
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.note}
                                </div>
                                <Button 
                                    variant="secondary" 
                                    className="rounded-md" 
                                    onClick={() => handleWorkstationClick(item.date)}
                                >
                                    WORKSTATION
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    className="rounded-md"
                                    onClick={() => handleEditChartClick(item)}
                                >
                                    EDIT CHART
                                </Button>
                            </div>
                            <div>
                                <Table className="border border-gray-200 rounded-lg">
                                    <TableHeader className="bg-gray-100 rounded-t-lg">
                                        <TableRow>
                                            <TableHead className="p-2">Name</TableHead>
                                            <TableHead className="p-2">Qty</TableHead>
                                            <TableHead className="p-2">Unit</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {item.chart_items.map((chartItem, chartIndex) => (
                                            <TableRow key={chartIndex} className="border-b border-gray-200">
                                                <TableCell className="p-2">{chartItem[1]}</TableCell>
                                                <TableCell className="p-2">{chartItem[2]}</TableCell>
                                                <TableCell className="p-2">{chartItem[3]}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <EditChartDialog 
                isOpen={isDialogOpen} 
                handleClose={handleCloseDialog} 
                orderData={selectedOrderData} 
                handleSave={handleSaveChanges} 
            />
        </ScrollArea>
    );
}
