import React, { useState } from 'react';

const Dialog = ({ isOpen, onClose, onSave, itemId, inventoryData }) => {
  const [formData, setFormData] = useState({
    hsn_code: inventoryData.consumption_mode,
    cost_price: inventoryData.consumption_mode,
    sale_price: inventoryData.consumption_mode,
    tax: inventoryData.consumption_mode
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const dataToSend = {
        "item_id":itemId,
        "hsn_code":"ABC",
        "cost_price":formData.cost_price,
        "sale_price":formData.sale_price,
        "tax":formData.tax
    };

    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/edit_finance_info', {
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
        console.error('Failed to save data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <h2 className="text-xl mb-4">Edit Finance Data</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-600">HSN Code:</label>
            <input
              type="text"
              name="hsn_code"
              value={formData.hsn_code}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-600">Cost Price:</label>
            <input
              type="text"
              name="cost_price"
              value={formData.cost_price}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-600">Sale Price:</label>
            <input
              type="text"
              name="sale_price"
              value={formData.sale_price}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-600">Tax (%):</label>
            <input
              type="text"
              name="tax"
              value={formData.tax}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
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
