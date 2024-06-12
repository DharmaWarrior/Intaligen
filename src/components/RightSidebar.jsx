import React, { useEffect, useState } from 'react';
import './RightSidebar.css';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './../../components/ui/table';
import { Textarea } from './../../components/ui/textarea';
function RightSidebar({ isOpen, content, onClose }) {
  const [activeTab, setActiveTab] = useState('Planning');

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <div className={`Rightsidebar ${isOpen ? 'open' : ''}`}>
      <button className="close-button" onClick={onClose}>X</button>
      <h1>{content}</h1>
      <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
        <div className="flex mb-4 border-b-2 border-black-200">
          <button
            className={`py-2 px-4 ${activeTab === 'Orders' ? 'border-b-5 border-black-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Planning')}
          >
            PLANNING
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'Dispatch' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Resources')}
          >
            RESOURCES
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'Documents' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Products')}
          >
            PRODUCTS
          </button>
          <button
            className={`py-2 px-4 ${activeTab === 'Documents' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
            onClick={() => setActiveTab('Materials')}
          >
            MATERIALS
          </button>
        </div>

        {activeTab === 'Planning' && (
          <Table className="min-w-full bg-white">
            <TableHeader >
              <TableRow>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">Order ID</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">Customer Name</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">Total Amount</TableHead>
                <TableHead className="py-2 px-4 bg-gray-100 border-b">Total Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="py-2 px-4 border-b">1</TableCell>
                <TableCell className="py-2 px-4 border-b">John Doe</TableCell>
                <TableCell className="py-2 px-4 border-b">$99.99</TableCell>
                <TableCell className="py-2 px-4 border-b">$99.99</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="py-2 px-4 border-b">2</TableCell>
                <TableCell className="py-2 px-4 border-b">Jane Smith</TableCell>
                <TableCell className="py-2 px-4 border-b">$149.99</TableCell>
                <TableCell className="py-2 px-4 border-b">$149.99</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        {activeTab === 'Resources' && <Textarea />}
        {activeTab === 'Products' && <Textarea />}
        {activeTab === 'Materials' && <Textarea />}
      </div>
    </div>
  );
}

export default RightSidebar;
