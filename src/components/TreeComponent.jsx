// TreeComponent.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { data } from './../data/data'; // Adjust the import path if needed
import './TreeComponent.css';
import  {ScrollArea} from './../../components/ui/scroll-area'
import { Button } from './../../components/ui/button';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./../../components/ui/breadcrumb"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table"


const TreeComponent = () => {
  const [treeData] = useState(data);
  const navigate = useNavigate();

  const handleViewClick = (node) => {
    // Navigate to a different page and pass the node data
    navigate('/details', { state: { node } });
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/workstation_console">Primary WorkStation</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="p-20px">
        <h1>{treeData.name}</h1>
        <ScrollArea className="h-[600px] p-4" >
          {treeData.children.map((child, index) => (
            <div key={index} className="card">
              <h1 className='text-2xl'>{child.name}</h1>
                
                <div className='flex flex-row'>
                  <div className="capacity">
                    Capacity: {child.capacity}
                  </div>
                  <div className='flex flex-col'>
                    <h2 className='text-center'> Jobs </h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Name</TableHead>
                          <TableHead>Alotted</TableHead>
                          <TableHead className="text-right">Unit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">INV001</TableCell>
                          <TableCell>Paid</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                    <h2 className='text-center'> Resources </h2>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">Name</TableHead>
                          <TableHead>Time</TableHead>
                          <TableHead>Unit</TableHead>
                          <TableHead className="text-right">Mode</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">INV001</TableCell>
                          <TableCell>Paid</TableCell>
                          <TableCell>Unidi</TableCell>
                          <TableCell className="text-right">$250.00</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>
                

              
              <Button onClick={() => handleViewClick(child)}>View</Button>
            </div>
          ))}
        </ScrollArea>
      </div>
    </div>
    
  );
};

export default TreeComponent;
