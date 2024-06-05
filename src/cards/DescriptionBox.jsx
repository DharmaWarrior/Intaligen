import React, { useState } from 'react';
import { CheckIcon, PencilIcon } from '@heroicons/react/solid';

const DescriptionBox = ({ Dproduct, handleSave }) => {
  const [isEditable, setIsEditable] = useState(false);
  const [formData, setFormData] = useState({
    id: Dproduct.ITEM.id,
    name: Dproduct.ITEM.name,
    raw_flag: (Dproduct.ITEM.raw_flag === 'YES' )  ? 'YES' : 'NO',
    code: Dproduct.ITEM.code,
    unit: Dproduct.ITEM.unit,
    rate: Dproduct.ITEM.rate,
  });

  const handleEdit = () => {
    if (isEditable) {
      saveInfo();
    }
    setIsEditable(!isEditable);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? (checked ? 'NO' : 'YES') : value,
    });
  };

  const saveInfo = async () => {
    const formattedData = {
      "edit_ids[]": [formData.id],
      "edit_names[]": [formData.name],
      "edit_bom_flags[]": [formData.raw_flag],
      "edit_codes[]": [formData.code],
      "edit_units[]": [formData.unit],
      "edit_rates[]": [formData.rate],
    };

    try {
        let token = localStorage.getItem("usersdatatoken");
        console.log('Sending data to API:', formattedData); // Debugging log
        const response = await fetch('/api/edit_items', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
        },
        body: JSON.stringify(formattedData),
        });

        if (response.status === 302) {
        const updatedProduct = {
            ...Dproduct,
            ITEM: {
            ...formData,
            raw_flag: formData.raw_flag
            }
        };
        handleSave(updatedProduct);
        } else {
        console.error('Failed to save data, status:', response.status); // Debugging log
        }
        } catch (error) {
        console.error('Error saving info:', error); // Debugging log
        }
  };

  return (
    <div className="hero bg-white p-10 shadow-lg rounded-xl border border-gray-200 pt-5">
      <div className="hero-content">
        <div className="space-y-5 mt-1">
          <div className="flex items-center space-x-2">
            <div className="w-100">
              <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">ITEM NAME:</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="block w-80 rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="flex mt-7">
              <label htmlFor="bom" className="text-25 font-medium leading-6 text-gray-900 mr-2">BOM:</label>
              <input
                type="checkbox"
                id="bom"
                name="raw_flag"
                checked={formData.raw_flag === 'NO'}
                onChange={handleChange}
                className="w-6 h-6 mr-4 bg-gray-400 rounded focus:ring-2 ring-blue-500"
                disabled={!isEditable}
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-full">
              <label htmlFor="code" className="block text-sm font-medium leading-6 text-gray-900">CODE:</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="text"
                  name="code"
                  id="code"
                  className="block w-full rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.code}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="unit" className="block text-sm font-medium leading-6 text-gray-900">STANDARD UNIT OF MEASUREMENT:</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="text"
                  name="unit"
                  id="unit"
                  className="block w-full rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.unit}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
            <div className="w-full">
              <label htmlFor="rate" className="block text-sm font-medium leading-6 text-gray-900">JOB RATE / COST OF UNIT ITEM:</label>
              <div className="relative mt-2 rounded-md shadow-sm">
                <input
                  type="text"
                  name="rate"
                  id="rate"
                  className="block w-full rounded-md border-0 py-1.5 pl-1 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={formData.rate}
                  onChange={handleChange}
                  disabled={!isEditable}
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleEdit}
            className={`mt-4 py-2 px-4 rounded-lg transition duration-300 ${
              isEditable ? 'bg-teal-500 hover:bg-teal-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
            }`}
          >
            {isEditable ? (
              <>
                <CheckIcon className="h-6 w-6 inline-block mr-2" />
                Save
              </>
            ) : (
              <>
                <PencilIcon className="h-6 w-6 inline-block mr-2" />
                Edit
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescriptionBox;
