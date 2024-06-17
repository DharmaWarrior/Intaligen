import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './RightSidebar.css';
import {
  FileText,
  X,
  Cog,
  GitPullRequestCreateArrow,
  Bolt
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table"

import { Button } from "./../../components/ui/button";
import { Separator } from "./../../components/ui/separator";
import { Textarea } from "./../../components/ui/textarea";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "./../../components/ui/tooltip";

function RightSidebar({ isOpen, content, onClose, planning, resources, products, materials }) {
  const [activeTab, setActiveTab] = useState('Planning');
  const [editableJobData, setEditableJobData] = useState(Array.isArray(planning) ? planning : []);
  const [editableProductData, setEditableProductData] = useState(Array.isArray(products) ? products : []);
  const [editableResData, setEditableResData] = useState(Array.isArray(resources) ? resources : []);
  const [editableMaterialData, setEditableMaterialData] = useState(Array.isArray(materials) ? materials : []);
  const [expandedProducts, setExpandedProducts] = useState({});

  console.log("Planning", planning);
  console.log("Resources", resources);
  console.log("Products", products);
  console.log("Materials", materials);

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

  useEffect(() => {
    setEditableJobData(Array.isArray(planning) ? planning : []);
  }, [planning]);

  useEffect(() => {
    setEditableResData(Array.isArray(resources) ? resources : []);
  }, [resources]);

  useEffect(() => {
    setEditableMaterialData(Array.isArray(materials) ? materials : []);
  }, [materials]);
  useEffect(() => {
    setEditableProductData(Array.isArray(products) ? products : []);
  }, [products]);


  const toggleProductDetails = (index) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  return (
    <div className={`Rightsidebar ${isOpen ? 'open' : ''}`}>
      <div className='flex flex-row'>
        <div className="line-clamp-1 text-xl mb-2 text-center">{content}</div>
        <Button className="close-button" variant="ghost" size="icon" onClick={onClose}>
          <X />
        </Button>
      </div>
      <div className="flex h-full flex-col">
        <div className="flex items-center p-2">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Bolt className="h-4 w-4" />
                    <span className="sr-only">Configure</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Configure</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FileText className="h-4 w-4" />
                    <span className="sr-only">Material Report</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Material Report</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Cog className="h-4 w-4" />
                    <span className="sr-only">Resources Report</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Resources Report</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <GitPullRequestCreateArrow className="h-4 w-4" />
                    <span className="sr-only">Auto Allot</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Auto Allot</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <Separator />
        <div className="flex flex-col">
          <div className="flex-1 whitespace-pre-wrap p-4 text-sm">
            <div className="flex mb-4 border-b-2 border-gray-200">
              <button
                className={`py-2 px-4 ${activeTab === 'Planning' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('Planning')}
              >
                Planning
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'Resources' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('Resources')}
              >
                Resources
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'Products' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('Products')}
              >
                Products
              </button>
              <button
                className={`py-2 px-4 ${activeTab === 'Materials' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                onClick={() => setActiveTab('Materials')}
              >
                Materials
              </button>
            </div>

            {activeTab === 'Planning' && (
              <Table className="min-w-full bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Name</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Total</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Unit</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Alloted</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">To Allot</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Recvd</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableJobData.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-2 px-4 border-b">{job.name}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.allocated}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.unit}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.allocated - job.to_allot}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.to_allot}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.received}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {activeTab === 'Resources' && (
              <div>
                <h3 className="text-center">SELF RESOURCES</h3>
                <Table className="min-w-full bg-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Name</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Time</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Unit</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">WORK MODE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editableProductData.map((job, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2 px-4 border-b">{job.resource.name}</TableCell>
                        <TableCell className="py-2 px-4 border-b">{job.time_allot}</TableCell>
                        <TableCell className="py-2 px-4 border-b">Hrs</TableCell>
                        <TableCell className="py-2 px-4 border-b">{job.contract_mode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <Separator className= "mt-4"/>
                <h3 className="text-center">TOTAL RESOURCES</h3>
                <Table className="min-w-full bg-white">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Name</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Time</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">Unit</TableHead>
                      <TableHead className="py-2 px-4 bg-gray-100 border-b">WORK MODE</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {editableResData.map((job, index) => (
                      <TableRow key={index}>
                        <TableCell className="py-2 px-4 border-b">{job.Name}</TableCell>
                        <TableCell className="py-2 px-4 border-b">{job.Time}</TableCell>
                        <TableCell className="py-2 px-4 border-b">Hrs</TableCell>
                        <TableCell className="py-2 px-4 border-b">{job.Mode}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
            {activeTab === 'Products' && (
              <Table className="min-w-full bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Name</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Alloted</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Unit</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Finished</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                {editableJobData.map((job, index) => (
                  <React.Fragment key={`job-${index}`}>
                    <TableRow key={`job-row-${index}`}>
                      <TableCell
                        className="py-2 px-4 border-b cursor-pointer text-violet-800 hover:underline"
                        onClick={() => toggleProductDetails(index)}
                      >
                        {job.name}
                      </TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.allocated}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.unit}</TableCell>
                      <TableCell className="py-2 px-4 border-b">0</TableCell>
                    </TableRow>
                    {expandedProducts[index] && (
                      <TableRow key={`job-details-${index}`}>
                        <TableCell className="py-2 px-4 border-b">
                        {'>>'}{'Adjustment'}
                        </TableCell>
                        <TableCell className="py-2 px-4 border-b">
                        {job.to_allot}
                        </TableCell>
                        <TableCell className="py-2 px-4 border-b">
                        {job.unit}
                        </TableCell>
                        <TableCell className="py-2 px-4 border-b">
                        0
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
                </TableBody>
              </Table>
            )}
            {activeTab === 'Materials' && (
              <Table className="min-w-full bg-white">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Name</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">ESTIMATE</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">Unit</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">ISSUED</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">RETURN</TableHead>
                    <TableHead className="py-2 px-4 bg-gray-100 border-b">REJECT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {editableMaterialData.map((job, index) => (
                    <TableRow key={index}>
                      <TableCell className="py-2 px-4 border-b">{job.name}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.estimated_totals}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.unit}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.issue_totals}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.return_totals}</TableCell>
                      <TableCell className="py-2 px-4 border-b">{job.reject_totals}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          {/* <Separator className="mt-auto" /> */}
        </div>
      </div>
    </div>
  );
}

export default RightSidebar;
