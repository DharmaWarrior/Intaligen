import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

import ExpandableProductTable from './../components/ExpandableProductTable';

const EditDialog = ({ isOpen, onClose, jobData }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="edit-dialog-title"
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <DialogTitle id="edit-dialog-title" className="text-lg font-medium text-gray-800">
        Edit Products
      </DialogTitle>
      <DialogContent>
        <div className="mt-2">
          <ExpandableProductTable jobData={jobData} toEdit={true} />
        </div>
      </DialogContent>
      <DialogActions>
        <button
          className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          onClick={onClose}
        >
          Close
        </button>
        <button
          className="py-2 px-4 bg-green-500 text-white rounded hover:bg-blue-600 focus:outline-none"
          onClick={onClose}
        >
          Save
        </button>
      </DialogActions>
    </Dialog>
  );
};

EditDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  jobData: PropTypes.array.isRequired,
};

export default EditDialog;
