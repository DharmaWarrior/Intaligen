import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import Search from './Search'

const AddForm = ({ open, handleClose, handleFormSubmit, formFields, title }) => {
  const initialFormData = formFields.reduce((acc, field) => {
    acc[field.name] = field.type === 'checkbox' ? false : '';
    return acc;
  }, {});

  const [formData, setFormData] = useState(initialFormData);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const onSelect = (data) => {
    console.log(data)
    setFormData((prevData) => ({
      ...prevData,
      'customer_id': data.id
    }));
  }


  const onSubmit = async (event) => {
    event.preventDefault();
    await handleFormSubmit(formData);
    setFormData(initialFormData); // Reset form data after submission
    handleClose();
  };

  const onClose = () => {
    setFormData(initialFormData); // Reset form data when dialog is closed
    handleClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
      <form onSubmit={onSubmit} className="w-full max-w-lg mx-auto">
        <DialogContent className="grid grid-cols-2 gap-4">
          {formFields.map((field) => (
            <div key={field.name} className={field.fullWidth ? 'col-span-2' : ''}>
              {field.type === 'checkbox' ? (
                <div className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name={field.name}
                    checked={formData[field.name]}
                    onChange={handleChange}
                  />
                  <label className="text-gray-700">{field.label}</label>
                </div>
              ) : field.type === 'search' ? (
                <Search label='Customer Name' onsearch='Customer' onSelect={onSelect}/>
              ) : (
                <div className="search-container">
                  <label className="text-gray-700">{field.label}</label>
                  <input
                    className="input-field p-2 border border-gray-300 rounded"
                    type={field.type}
                    name={field.name}
                    placeholder={field.label}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  />
              </div>
              )}
            </div>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Add</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddForm;
