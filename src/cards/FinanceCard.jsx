import React, { useState } from 'react';
import { PencilIcon } from '@heroicons/react/solid';
import Dialog from './Dialog';

const FinanceCard = ({ heading, inventoryData, itemId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleEdit = () => {
    setIsDialogOpen(true);
  };

  const handleSave = (newData) => {
    setFinanceData(newData);
    // Perform additional actions if necessary, like updating state in a parent component
  };

  return (
    <div className="hero bg-white p-5 shadow-lg rounded-xl border border-gray-200 pt-2">
      <div className="hero-content">
        <div className="space-y-auto mt-1">
          <div className="flex flex-row justify-between items-center">
            <Heading text={heading} />
            <CallToAction onEdit={handleEdit} />
          </div>
          <Content
            inventoryData = {inventoryData}
          />
        </div>
      </div>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSave={handleSave}
        itemId={itemId}
        inventoryData={inventoryData}
      />
    </div>
  );
};

const Heading = ({ text }) => {
  return <h1 className="text-3xl font-small text-gray-800">{text}</h1>;
};

const CallToAction = ({ onEdit }) => {
  return (
    <button
      className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-md p-2 ml-2"
      onClick={onEdit}
    >
      <PencilIcon className="h-6 w-6" />
    </button>
  );
};

const Content = ({ inventoryData }) => {
  return (
    <div className="space-y-1 mt-5">
      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
        <p className="text-gray-600">HSN:</p>
        <p className="text-gray-800">{inventoryData.consumption_mode || 'NA'}</p>
      </div>
      <div className="flex justify-between bg-white py-2 px-4 rounded">
        <p className="text-gray-600">Cost Price:</p>
        <p className="text-gray-800">{inventoryData.consumption_mode || 'NA'}</p>
      </div>
      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
        <p className="text-gray-600">Sale Price:</p>
        <p className="text-gray-800">{inventoryData.consumption_mode || 'NA'}</p>
      </div>
      <div className="flex justify-between bg-gray-100 py-2 px-4 rounded">
        <p className="text-gray-600">Tax (%):</p>
        <p className="text-gray-800">{inventoryData.consumption_mode || 'NA'}</p>
      </div>
    </div>
  );
};

export default FinanceCard;
