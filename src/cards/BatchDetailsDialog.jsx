import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../../components/ui/table';
import { Button } from './../../components/ui/button';
import { X } from 'lucide-react';

const BatchDetailsDialog = ({ isOpen, onClose, id, batch, mail, batchdetails }) => {
  
  if (batchdetails === undefined) {
    return null;
  }

  const [dispatchQuantities, setDispatchQuantities] = useState(() => {
    console.log(batchdetails ? batchdetails : 'No batch details found');

    // Initialize dispatch quantities based on batchdetails
    const initialQuantities = {};
    batchdetails.forEach(item => {
      initialQuantities[item.id] = item.dispatch_qty;
    });

    return initialQuantities;
  });

  const [dispatchDate, setDispatchDate] = useState('');

  // useEffect to update dispatchQuantities when batchdetails changes
  useEffect(() => {
    const updatedQuantities = {};
    batchdetails.forEach(item => {
      updatedQuantities[item.id] = item.dispatch_qty;
    });
    setDispatchQuantities(updatedQuantities);
  }, [batchdetails]);

  const handleQuantityChange = (itemId, value) => {
    const parsedValue = parseFloat(value);
    if (!isNaN(parsedValue)) {
      setDispatchQuantities(prevQuantities => ({
        ...prevQuantities,
        [itemId]: parsedValue,
      }));
    } else {
      setDispatchQuantities(prevQuantities => ({
        ...prevQuantities,
        [itemId]: '',
      }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('usersdatatoken');

      // Extract units based on batchdetails
      const dispatchUnits = batchdetails.map(item => {
        const orderItem = mail.orders_data[id].items.find(items => items.order_item_id === item.order_item_id);
        return orderItem ? orderItem.unit : '';
      });

      const response = await fetch('/api/dispatchchallan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          order_id: id,
          dispatch_flag: 'YES',
          dispatch_order_id: id,
          action: 'save',
          delivery_batch_id: batch,
          actual_desp_date: dispatchDate,
          'desp_qtys[]': Object.values(dispatchQuantities),
          'order_item_ids[]': Object.keys(dispatchQuantities),
          'desp_units[]': dispatchUnits,
        }),
      });

      if (response.status === 302) {
        console.log('Dispatch items saved successfully');
        onClose();
      } else {
        console.error('Failed to save dispatch items');
      }
    } catch (error) {
      console.error('Error saving dispatch items:', error);
    }
  };

  const handleMoveBatch = async () => {
    try {
      const token = localStorage.getItem('usersdatatoken');

      // Extract units based on batchdetails
      const dispatchUnits = batchdetails.map(item => {
        const orderItem = mail.orders_data[id].items.find(items => items.order_item_id === item.order_item_id);
        return orderItem ? orderItem.unit : '';
      });

      const response = await fetch('/api/dispatchchallan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          order_id: id,
          dispatch_flag: 'YES',
          dispatch_order_id: id,
          action: 'dispatch',
          delivery_batch_id: batch,
          actual_desp_date: dispatchDate,
          'desp_qtys[]': Object.values(dispatchQuantities),
          'order_item_ids[]': Object.keys(dispatchQuantities),
          'desp_units[]': dispatchUnits,
        }),
      });

      if (response.ok) {
        console.log('Dispatch items saved successfully');
        onClose();
      } else {
        console.error('Failed to save dispatch items');
      }
    } catch (error) {
      console.error('Error saving dispatch items:', error);
    }
  };

  if (!isOpen || !batch) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg max-w-3xl w-full">
        <div className="flex flex-row">
          <h2 className="text-xl mb-4">{batch.batch_name} Item Details</h2>
          <div className="flex justify-end space-x-3 ml-auto">
            <Button onClick={onClose} className="close-button" variant="ghost">
              <X />
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <div className="mt-3 text-blue-500">Dispatch Date</div>
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="date"
            value={dispatchDate}
            onChange={(e) => setDispatchDate(e.target.value)}
          />
          <Table className="min-w-full bg-white">
            <TableHeader>
              <TableRow>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">ITEM NAME</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">ORDER QTY</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">UNIT</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">STOCK</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">BALANCE</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">DISPATCH QTY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batchdetails.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-2 px-4 border-b">{mail.orders_data[id].items.find((items) => items.order_item_id == item.order_item_id).item_name}</TableCell>
                  <TableCell className="py-2 px-4 border-b">{mail.orders_data[id].items.find((items) => items.order_item_id == item.order_item_id).order_qty}</TableCell>
                  <TableCell className="py-2 px-4 border-b">{mail.orders_data[id].items.find((items) => items.order_item_id == item.order_item_id).unit}</TableCell>
                  <TableCell className="py-2 px-4 border-b">{mail.INVENTORY_DATA[mail.orders_data[id].items.find((items) => items.order_item_id == item.order_item_id).item_id].total_stock}</TableCell>
                  <TableCell className="py-2 px-4 border-b">{mail.orders_data[id].items.find((items) => items.order_item_id == item.order_item_id).balance_qty}</TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    <input
                      type="number"
                      className="input-field p-2 border border-gray-300 rounded"
                      value={dispatchQuantities[item.id] !== undefined ? dispatchQuantities[item.id] : ''} // default to empty string if undefined
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="secondary" size="sm" onClick={handleSave}>
              Save
            </Button>
            <Button variant="secondary" size="sm" onClick={handleMoveBatch}>
              Move Batch From Inventory
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsDialog;
