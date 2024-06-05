import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from './../../components/ui/table';
import { FaTimes } from 'react-icons/fa';

const Dialog = ({ isOpen, onClose, onSave, itemId, product }) => {
  const [formData, setFormData] = useState({
    hsn_code: '',
    cost_price: '',
    sale_price: '',
    tax: '',
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
    console.log('Selected item:', item);
  };

  const handleSubmit = async () => {
    const dataToSend = {
      "item_id": itemId,
      "hsn_code": formData.hsn_code,
      "cost_price": formData.cost_price,
      "sale_price": formData.sale_price,
      "tax": formData.tax,
    };

    try {
      let token = localStorage.getItem("usersdatatoken");
      const url = '/api/edit_finance_info';
      console.log('Saving data to:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.status === 200) {
        onSave(formData);
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
              value={formData.hsn_code}
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
                  <TableCell>{item.child_item.name}</TableCell>
                  <TableCell>{item.child_item_qty}</TableCell>
                  <TableCell>{item.child_item.unit}</TableCell>
                  <TableCell>{item.margin}</TableCell>
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
          <div>
            <label className="block text-gray-600">Search:</label>
            <input
              type="text"
              name="search"
              value={formData.search}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
            {searchResults.length > 0 && (
              <div className="border border-gray-300 rounded mt-2 max-h-48 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelectItem(item)}
                    className="p-2 hover:bg-gray-200 cursor-pointer"
                  >
                    {item.name}
                  </div>
                ))}
              </div>
            )}
          </div>
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
