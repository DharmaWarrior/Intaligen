import React, { useState } from "react";
import { Button } from "./../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./../../components/ui/dialog";
import { Label } from "./../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../../components/ui/tabs";
import { ScrollArea } from "./../../components/ui/scroll-area";

export function DetailsDialog({ item_id, Heading, value }) {
    const [tableDataActivity, setTableDataActivity] = useState(null);
    const [tableDataReject, setTableDataReject] = useState(null);
    const [tableDataWip, setTableDataWip] = useState(null);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [stockValue, setStockValue] = useState(0);
    const [selectedTab, setSelectedTab] = useState("recent_activity");

    
    const fetchRejectData = async (id) => {
        setLoading(true);
        try {
            let token = localStorage.getItem("usersdatatoken");
            if (!token) {
                console.log("Token not found");
            }

            const response = await fetch("/api/inventory_ledger", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    k: -1,
                    item_id: id,
                    data_type: "REJECT"
                })
            });

            if (response.ok) {
                const data = await response.json();
                setTableDataReject(data);
                
            } else {
                console.error("Failed to fetch data");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchActivityData = async (id) => {
        setLoading(true);
        try {
            let token = localStorage.getItem("usersdatatoken");
            if (!token) {
                console.log("Token not found");
            }

            const response = await fetch("/api/inventory_ledger", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    k: -1,
                    item_id: id,
                    data_type: "ACTIVE"
                })
            });

            if (response.ok) {
                const data = await response.json();
                setTableDataActivity(data);
                
            } else {
                console.error("Failed to fetch data");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchWIPData = async (id) => {
        setLoading(true);
        try {
            let token = localStorage.getItem("usersdatatoken");
            if (!token) {
                console.log("Token not found");
            }

            const response = await fetch("/api/inventory_ledger", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    k: -1,
                    item_id: id,
                    data_type: "WIP"
                })
            });

            if (response.ok) {
                const data = await response.json();
                setTableDataWip(data);
                
            } else {
                console.error("Failed to fetch data");
                setLoading(false);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchValueData = async (id) => {
        setLoading(true);
        try {
                let token = localStorage.getItem("usersdatatoken");
                if(!token) {
                console.log("Token not found");
                }
                
                const response = await fetch("/api/inventory_lookup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
                body: JSON.stringify({
                    "k": -1,
                    "data_type": "ACTIVE",
                    "item_id": id,
                })
            });

        if (response.ok) {
            const result = await response.json();
            setStockValue(result[0]);
        } else {
            console.error('Failed to fetch data');
            setLoading(false);
        }
        } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
        }
    };

    const handleOpen = () => {
        setOpen(true);
        fetchActivityData(item_id);
        fetchRejectData(item_id);
        fetchWIPData(item_id);
        fetchValueData(item_id);
    };

    const handleTabChange = (value) => {
        setSelectedTab(value);
    };

    const getItemStockValue = () => {
        switch (selectedTab) {
            case "recent_activity":
                return stockValue.total_stock;
            case "reject":
                return stockValue.total_reject_stock;
            case "wip":
                return stockValue.total_wip_stock;
            default:
                return value.active;
        }
    };

    return (
        <Dialog open={open}>
            <Button variant="outline" onClick={handleOpen}>View Details</Button>
            <DialogContent style={{ maxWidth: "90vw", width: "50vw" }}>
                <DialogHeader>
                    <DialogTitle>{Heading ? Heading : "New"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {loading ? (
                        <div>Data Loading...</div>
                    ) : (
                        <>
                            <Tabs defaultValue="recent_activity" onValueChange={handleTabChange}>
                                <div className="items-center pt-4">
                                    <TabsList className="ml-auto">
                                        <TabsTrigger value="recent_activity" className="text-zinc-600 dark:text-zinc-200">
                                            RECENT ACTIVITY
                                        </TabsTrigger>
                                        <TabsTrigger value="reject" className="text-zinc-600 dark:text-zinc-200">
                                            REJECT
                                        </TabsTrigger>
                                        <TabsTrigger value="wip" className="text-zinc-600 dark:text-zinc-200">
                                            WIP
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                                <TabsContent value="recent_activity" className="m-0 border border-x-y-emerald-50 card custom-scroll">
                                    <ScrollArea className="h-[55vh] w-full">
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-left">ITEM</TableHead>
                                                    <TableHead className="text-left">QTY</TableHead>
                                                    <TableHead className="text-left">UNIT</TableHead>
                                                    <TableHead className="text-left">DATE/TIME</TableHead>
                                                    <TableHead className="text-left">NOTE</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tableDataActivity ? (
                                                    tableDataActivity.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell>{item.qty}</TableCell>
                                                            <TableCell>{item.item_unit}</TableCell>
                                                            <TableCell>{item.regdate}</TableCell>
                                                            <TableCell>{item.note}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="5">No data available</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="reject" className="m-0 border border-x-y-emerald-50 card custom-scroll">
                                    <ScrollArea className="h-[55vh] w-full">
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-left">ITEM</TableHead>
                                                    <TableHead className="text-left">QTY</TableHead>
                                                    <TableHead className="text-left">UNIT</TableHead>
                                                    <TableHead className="text-left">DATE/TIME</TableHead>
                                                    <TableHead className="text-left">NOTE</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tableDataReject ? (
                                                    tableDataReject.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell>{item.qty}</TableCell>
                                                            <TableCell>{item.item_unit}</TableCell>
                                                            <TableCell>{item.regdate}</TableCell>
                                                            <TableCell>{item.note}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="5">No data available</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </TabsContent>
                                <TabsContent value="wip" className="m-0 border border-x-y-emerald-50 card custom-scroll">
                                    <ScrollArea className="h-[55vh] w-full">
                                        <Table className="w-full">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="text-left">ITEM</TableHead>
                                                    <TableHead className="text-left">QTY</TableHead>
                                                    <TableHead className="text-left">UNIT</TableHead>
                                                    <TableHead className="text-left">DATE/TIME</TableHead>
                                                    <TableHead className="text-left">NOTE</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {tableDataWip ? (
                                                    tableDataWip.map((item, index) => (
                                                        <TableRow key={index}>
                                                            <TableCell>{item.name}</TableCell>
                                                            <TableCell>{item.qty}</TableCell>
                                                            <TableCell>{item.item_unit}</TableCell>
                                                            <TableCell>{item.regdate}</TableCell>
                                                            <TableCell>{item.note}</TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan="5">No data available</TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>
                                        </Table>
                                    </ScrollArea>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                    <div className="flex items-center gap-4">
                        <Label htmlFor="item-stock" className="text-right">
                            Item Stock:
                        </Label>
                        <span>{getItemStockValue()}</span>
                    </div>
                </div>
                <DialogFooter>
                    <Button type="button" variant="default" onClick={() => { setOpen(false); }}>
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
