import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './../../components/ui/table';
import { Button } from './../../components/ui/button';
import { Textarea } from './../../components/ui/textarea';
import Search from './../components/Search';
import { ScrollArea } from './../../components/ui/scroll-area';

const EditChartDialog = ({ isOpen, handleClose, orderData, handleSave }) => {
    const [selectedItems, setSelectedItems] = useState(orderData ? [...orderData.chart_items] : []);
    const [note, setNote] = useState(orderData ? orderData.note : '');

    useEffect(() => {
        if (orderData) {
        setSelectedItems([...orderData.chart_items]);
        setNote(orderData.note);
        }
    }, [orderData]);

    const handleDeleteRow = (index) => {
        const updatedItems = [...selectedItems];
        updatedItems.splice(index, 1);
        setSelectedItems(updatedItems);
    };

    const handleSaveChanges = () => {
        const updatedOrderData = {
        chart_items: selectedItems,
        date: despDate,
        note: note,
        };
        handleSave(updatedOrderData);
    };

    const handleQuantityChange = (index, value) => {
        const updatedItems = [...selectedItems];
        updatedItems[index][2] = parseInt(value); // Update quantity (assuming it's at index 2)
        setSelectedItems(updatedItems);
    };

    const handleAddItemToOrder = (selectedItem) => {
        const newItem = [selectedItem.id, selectedItem.name, 1, selectedItem.unit]; // Matching the expected structure
        setSelectedItems([...selectedItems, newItem]);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
        <div className="bg-white p-4 rounded-lg w-[80%] max-w-screen-md">
            <h2 className="text-lg font-semibold mb-4">Edit Chart</h2>
            <Textarea
            placeholder="Add Note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mb-4 border p-2 rounded w-full"
            />
            <div className="max-h-[400px]">
            <ScrollArea className="h-[300px]">
                <Table className="min-w-full bg-white">
                <TableHeader>
                    <TableRow>
                    <TableCell className="py-2 px-4 bg-gray-100 border-b">ITEM NAME</TableCell>
                    <TableCell className="py-2 px-4 bg-gray-100 border-b">QUANTITY</TableCell>
                    <TableCell className="py-2 px-4 bg-gray-100 border-b">UNIT</TableCell>
                    <TableCell className="py-2 px-4 bg-gray-100 border-b">ACTION</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {selectedItems.map((item, index) => (
                    <TableRow key={index}>
                        <TableCell className="py-2 px-4 border-b">{item[1]}</TableCell>
                        <TableCell className="py-2 px-4 border-b">
                        <input
                            type="number"
                            value={item[2]}
                            onChange={(e) => handleQuantityChange(index, e.target.value)}
                            className="border p-2 w-20"
                        />
                        </TableCell>
                        <TableCell className="py-2 px-4 border-b">{item[3]}</TableCell>
                        <TableCell className="py-2 px-4 border-b">
                        <Button variant="ghost" size="icon" onClick={() => handleDeleteRow(index)}>
                            X
                        </Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </ScrollArea>
            </div>
            <div className="mt-4">
            <Search label="Choose Items :" onsearch='Job' onSelect={handleAddItemToOrder} />
            </div>
            <div className="mt-4 flex justify-end gap-3">
            <Button onClick={handleSaveChanges}>Save</Button>
            <Button variant="secondary" onClick={handleClose}>
                Cancel
            </Button>
            </div>
        </div>
        </div>
    );
};

export default EditChartDialog;
