import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

export default function AddItemForm({ open, handleClose, handleFormSubmit, fetchData }) {
  const initialFormData = {
    Category_Name: '',
    Category_Type: '',
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
      <DialogTitle className="text-lg font-semibold">Add New Category</DialogTitle>
      <form onSubmit={onSubmit} className="w-full max-w-lg mx-auto">
        <DialogContent className="grid grid-cols-2 gap-4">
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="text"
            name="Category_Name"
            placeholder="Category Name *"
            value={formData.Category_Name}
            onChange={handleChange}
            required
          />
          <input
            className="input-field p-2 border border-gray-300 rounded"
            type="text"
            name="Category_Type"
            placeholder="Category Type"
            value={formData.Category_Type}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}