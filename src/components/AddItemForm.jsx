import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function AddItemForm({ open, handleClose, handleFormSubmit, fetchData }) {
  const initialFormData = {
    itemName: '',
    jobRate: '',
    code: '',
    costPrice: '',
    fundamentalUnit: '',
    salePrice: '',
    taxPercentage: '',
    hsnCode: '',
    bom: false,
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    await handleFormSubmit(formData);
    setFormData(initialFormData); // Reset form data after submission
    fetchData(); // Re-fetch the data to update the list
    handleClose();
  };

  const onClose = () => {
    setFormData(initialFormData); // Reset form data when dialog is closed
    handleClose();
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-lg font-semibold">Add New Item</DialogTitle>
      <form onSubmit={onSubmit} className="w-full max-w-lg mx-auto">
        <DialogContent className="grid grid-cols-2 gap-4">
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="text"
            name="itemName"
            placeholder="Item Name *"
            value={formData.itemName}
            onChange={handleChange}
            required
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="text"
            name="jobRate"
            placeholder="Job Rate"
            value={formData.jobRate}
            onChange={handleChange}
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="text"
            name="code"
            placeholder="Code"
            value={formData.code}
            onChange={handleChange}
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="number"
            name="costPrice"
            placeholder="Cost Price"
            value={formData.costPrice}
            onChange={handleChange}
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="text"
            name="fundamentalUnit"
            placeholder="Fundamental Unit *"
            value={formData.fundamentalUnit}
            onChange={handleChange}
            required
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="number"
            name="salePrice"
            placeholder="Sale Price"
            value={formData.salePrice}
            onChange={handleChange}
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="number"
            name="taxPercentage"
            placeholder="Tax Percentage"
            value={formData.taxPercentage}
            onChange={handleChange}
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="text"
            name="hsnCode"
            placeholder="HSN Code"
            value={formData.hsnCode}
            onChange={handleChange}
          />
          <div className="flex items-center col-span-2">
            <input
              className="mr-2"
              type="checkbox"
              name="bom"
              checked={formData.bom}
              onChange={handleChange}
            />
            <label className="text-gray-700">BOM</label>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}