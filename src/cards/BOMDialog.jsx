import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from './../../components/ui/table';
import { FaTimes } from 'react-icons/fa';
import Search from './../components/Search';

const Dialog = ({ isOpen, onClose, onSave, product,setProduct ,fetchProduct }) => {
  const [formData, setFormData] = useState({
    hsn_code: '',
    cost_price: '',
    sale_price: '',
    process_name: product.ITEM.boms[0].bom_name,
    search: '',
  });
  const [bomData, setBomData] = useState(product.BOM_DATA);
  const [searchResults, setSearchResults] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'search') {
      handleSearch(value);
    }
  };

  const handleDelete = (id) => {
    setBomData(bomData.filter((item) => item.id !== id));
  };

  const handleSearch = async (query) => {
    if (query.length < 1) {
      setSearchResults([]);
      return;
    }

    try {
      let token = localStorage.getItem("usersdatatoken");
      const url = `/api/searchitem`;
      console.log('Searching:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify({ "name" : query }),
      });

      if (response.status === 200) {
        const data = await response.json();
        setSearchResults(data);
      } else {
        console.error('Failed to fetch search results', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSelectItem = (item) => {
    setSearchResults([]);
    const newItem = {
      id: item.id,
      child_item: { name: item.name, unit: item.unit },
      child_item_qty: item.qty,
      margin: item.margin,
    };
    setBomData((prev) => [...prev, newItem]);
  };

  const handleBomDataChange = (id, field, value) => {
    setBomData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleSubmit = async () => {
    
    console.log('Saving data:', bomData);
    const dataToSend = {
      "chart_id": product.ITEM.id,
      "add_items_check": "YES",
      "bom_name": formData.process_name,
      "items_ids[]": bomData.map((item) => item.id.toString()),
      "items_qtys[]": bomData.map((item) => item.child_item_qty.toString()),
      "item_units[]": bomData.map((item) => item.child_item.unit),
      "item_margins[]": bomData.map((item) => item.margin.toString()),
    };

    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/add_bom_items', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.status === 200) {
        // onSave(formData);
        setProduct({ ...product, BOM_DATA: bomData });
        onClose();
      } else {
        console.error('Failed to save data', response.status);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Edit BOM for {product.ITEM.name}</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-600">Process Name:</label>
            <input
              type="text"
              name="hsn_code"
              value={formData.process_name}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 py-1 px-2 rounded">
                <TableHead className="text-gray-600">Name</TableHead>
                <TableHead className="text-gray-600">QTY</TableHead>
                <TableHead className="text-gray-600">UNIT</TableHead>
                <TableHead className="text-gray-600">% Margin</TableHead>
                <TableHead className="text-gray-600">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bomData.map((item) => (
                <TableRow key={item.id} className="bg-white py-1 px-2 rounded">
                  <TableCell>
                  {item.child_item.name}
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={item.child_item_qty}
                      onChange={(e) =>
                        handleBomDataChange(item.id, 'child_item_qty', e.target.value)
                      }
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      value={item.child_item.unit}
                      onChange={(e) =>
                        handleBomDataChange(item.id, 'child_item.unit', e.target.value)
                      }
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="number"
                      value={item.margin}
                      onChange={(e) =>
                        handleBomDataChange(item.id, 'margin', e.target.value)
                      }
                      className="border border-gray-300 p-1 rounded w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <FaTimes
                      className="text-red-500 cursor-pointer"
                      onClick={() => handleDelete(item.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Search label='Search Items:' onSelect={handleSelectItem} onsearch = 'Job'/>
        </div>
        <div className="flex justify-end space-x-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-500 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Dialog;
