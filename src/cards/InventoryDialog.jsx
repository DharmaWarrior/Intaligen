import React, { useState } from 'react';

const InventoryDialog = ({ isOpen, onClose, onSave, itemId, inventoryData }) => {
  const [formData, setFormData] = useState({
    consumption_mode: inventoryData.consumption_mode,
    min_level: inventoryData.min_level,
    max_level: inventoryData.max_level,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const dataToSend = {

        "item_id":`${itemId}`,
        "consumption_mode":`${formData.consumption_mode}`,
        "edit_inventory_level_min":`${formData.min_level}`,
        "edit_inventory_level_max":`${formData.max_level}`
    };

    console.log('Data to send:', dataToSend);

    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch('/api/edit_inventory_levels', {
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
        <h2 className="text-xl mb-4">Edit Inventory</h2>
        <div className="space-y-3">
          <div>
            <label className="block text-gray-600">Consumption Mode:</label>
            {/* <select
              type="text"
              name="consumption_mode"
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            /> */}
            <select
              name="consumption_mode"
              onChange={handleChange}
              value={formData.consumption_mode}
              className="border border-gray-300 p-2 rounded w-full"
              
            >  
            <option value={"AUTO"} >AUTO</option>
            <option value={"MANUAL"} >MANUAL</option>
            </select>
          </div>
          <div>
            <label className="block text-gray-600">Minimum Level:</label>
            <input
              type="number"
              name="min_level"
              value={formData.min_level}
              onChange={handleChange}
              className="border border-gray-300 p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block text-gray-600">Maximum Level:</label>
            <input
              type="number"
              name="max_level"
              value={formData.max_level}
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

export default InventoryDialog;
