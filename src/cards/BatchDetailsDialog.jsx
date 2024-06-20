import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../../components/ui/table';
import { Button } from './../../components/ui/button';
import { X } from 'lucide-react';

const BatchDetailsDialog = ({ isOpen, onClose, batch, mail }) => {
  const [dispatchQuantities, setDispatchQuantities] = useState(() => {
    // Initialize dispatch quantities with default values from the batch if available
    const initialQuantities = {};
    mail.DATA.order_items.forEach(item => {
      initialQuantities[item.item_id] = item.dispatch_qty || 0;
    });
    return initialQuantities;
  });

  const [dispatchDate, setDispatchDate] = useState('');

  const handleQuantityChange = (itemId, value) => {
    setDispatchQuantities({
      ...dispatchQuantities,
      [itemId]: value,
    });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('usersdatatoken');
      const response = await fetch('/api/savedispatchitems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          batch_id: batch.batch_id,
          dispatch_date: dispatchDate,
          dispatch_quantities: dispatchQuantities,
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
            <Button onClick={onClose} className="close-button" variant='ghost'>
              <X />
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-3">
          <div className='mt-3 text-blue-500'>Dispatch Date</div>
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type='date'
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
                <TableHead className="py-2 px-4 bg-gray-100 border-b">DISPATCH QTY</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mail.DATA.order_items.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="py-2 px-4 border-b">{mail.INVENTORY_DATA[item.item_id]["Item Name"]}</TableCell>
                  <TableCell className="py-2 px-4 border-b">{item.order_qty}</TableCell>
                  <TableCell className="py-2 px-4 border-b">{item.item_unit}</TableCell>
                  <TableCell className="py-2 px-4 border-b">{mail.INVENTORY_DATA[item.item_id].total_stock}</TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    <input
                      type="number"
                      className="input-field p-2 border border-gray-300 rounded"
                      value={dispatchQuantities[item.item_id]}
                      onChange={(e) => handleQuantityChange(item.item_id, e.target.value)}
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
            <Button variant="secondary" size="sm">
              Move Batch From Inventory
            </Button>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default BatchDetailsDialog;
