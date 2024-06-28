import React, { useState, useEffect } from "react";
import { Button } from "./../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogClose,
    DialogTitle,
    DialogTrigger,
} from "./../../components/ui/dialog";
import { Label } from "./../../components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./../../components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./../../components/ui/tabs";
import { ScrollArea } from "./../../components/ui/scroll-area";

export function DetailsDialog({ item_id, Heading, value, openDialog, setOpenDialog }) {
    const [tableData, setTableData] = useState(null);
    const [tableDataReject, setTableDataReject] = useState(null);
    const [loading, setLoading] = useState(true);
    // const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        if (item_id) {
            fetchActivityData(item_id);
            fetchRejectData(item_id);
        }
    }, [item_id]);

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
                    data_type: "ACTIVE"
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
                setTableData(data);

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

    return (
        <Dialog >
            <DialogTrigger asChild>
                <Button variant="outline">View Details</Button>
            </DialogTrigger>
            <DialogContent style={{ maxWidth: "90vw", width: "50vw" }}>
                <DialogHeader>
                    <DialogTitle>{Heading ? Heading : "New"}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    {loading ? (
                        <div>Data Loading...</div>
                    ) : (
                        <>
                            <Tabs defaultValue="recent_activity">
                                <div className="items-center pt-4">
                                    <TabsList className="ml-auto">
                                        <TabsTrigger value="recent_activity" className="text-zinc-600 dark:text-zinc-200">
                                            ITEM LOOKUP
                                        </TabsTrigger>
                                        <TabsTrigger value="reject" className="text-zinc-600 dark:text-zinc-200">
                                            RECENT ACTIVITY
                                        </TabsTrigger>
                                        <TabsTrigger value="wip" className="text-zinc-600 dark:text-zinc-200">
                                            PHYSICAL RECONCILATION
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
                                                {tableData ? (
                                                    tableData.map((item, index) => (
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
                                    <h1>WIP</h1>
                                </TabsContent>
                            </Tabs>
                        </>
                    )}
                    <div className="flex items-center gap-4">
                        <Label htmlFor="username" className="text-right">
                            Item Stock:
                        </Label>
                        <span>{value.active}</span>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="default" onclick={() => setOpenDialog(false)}>
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
