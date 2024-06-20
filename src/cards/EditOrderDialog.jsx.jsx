import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableRow } from './../../components/ui/table';
import { Button } from './../../components/ui/button';
import { Textarea } from './../../components/ui/textarea';
import Search from './../components/Search';
import { ScrollArea } from './../../components/ui/scroll-area';

const EditOrderDialog = ({ isOpen, handleClose, orderData, handleSave }) => {
  const [selectedItems, setSelectedItems] = useState(orderData ? [...orderData.order_data_df] : []);
  const [despDate, setDespDate] = useState(orderData ? orderData.DATA.order_info.despdate : '');
  const [note, setNote] = useState(orderData ? orderData.DATA.order_info.note : '');

  useEffect(() => {
    setSelectedItems([...orderData.order_data_df]);
    setDespDate(orderData.DATA.order_info.despdate);
    setNote(orderData.DATA.order_info.note);
  }, [orderData]);

  const handleDeleteRow = (index) => {
    const updatedItems = [...selectedItems];
    updatedItems.splice(index, 1);
    setSelectedItems(updatedItems);
  };

  const handleSaveChanges = () => {
    // Implement logic to save changes
    // Prepare data to be saved, including quantity changes, despdate, and note
    const updatedOrderData = {
      order_data_df: selectedItems,
      order_info: {
        despdate: despDate,
        note: note,
      },
    };
    handleSave(updatedOrderData); // Example: Pass updatedOrderData to handleSave
    console.log(updatedOrderData)
  };

  const handleQuantityChange = (index, value) => {
    const updatedItems = [...selectedItems];
    updatedItems[index].order_qty = parseInt(value); // Assuming input value is always a number
    setSelectedItems(updatedItems);
  };

  const handleAddItemToOrder = (selectedItem) => {
    const newItem = {
      item_name: selectedItem.name,
      order_qty: 1, // You can set default quantity as needed
      item_unit: selectedItem.unit,
      id: selectedItem.id,
    };
    
    setSelectedItems([...selectedItems, newItem]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-4 rounded-lg w-[80%] max-w-screen-md">
        <h2 className="text-lg font-semibold mb-4">Edit Order</h2>
        <Textarea
          placeholder="Add Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="mb-4 border p-2 rounded w-full"
        />
        <input
          type="date"
          value={despDate}
          onChange={(e) => setDespDate(e.target.value)}
          className="border p-2 mb-4 rounded w-full"
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
                    <TableCell className="py-2 px-4 border-b">{item.item_name}</TableCell>
                    <TableCell className="py-2 px-4 border-b">
                      <input
                        type="number"
                        value={item.order_qty}
                        onChange={(e) => handleQuantityChange(index, e.target.value)}
                        className="border p-2 w-20"
                      />
                    </TableCell>
                    <TableCell className="py-2 px-4 border-b">{item.item_unit}</TableCell>
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
        <div className="mt-4 flex justify-end">
          <Button onClick={handleSaveChanges}>Save</Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EditOrderDialog;
