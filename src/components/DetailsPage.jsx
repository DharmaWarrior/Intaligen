// DetailsPage.jsx
import React from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import { ScrollArea } from './../../components/ui/scroll-area';
import './TreeComponent.css';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from './../../components/ui/breadcrumb';

const DetailsPage = () => {
  const location = useLocation();
  const { node } = location.state;

  return (
    <div className="w-full h-[90vh] flex">
      <div className="w-[20%]">
          <Sidebar />
      </div>
      <div className="w-[80%] h-[90%] overflow-y-auto flex flex-row flex-wrap py-2">
        <div className="details-page">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/workstation_console">Primary WorkStation</BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1>{node.name}</h1>
          <ScrollArea className="h-[600px] p-4">
            {node.children.map((child, index) => (
              <div key={index} className="card">
                <h2>{child.name}</h2>
                <div className="table">
                  <h3>JOBS</h3>
                  {/* Add table rows here */}
                </div>
                <div className="table">
                  <h3>Resources</h3>
                  {/* Add table rows here */}
                </div>
                <div className="capacity">
                  Capacity: {node.capacity}
                </div>
                {/* If further navigation is required */}
                {child.children && <button onClick={() => handleViewClick(child)}>View</button>}
              </div>
            ))}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

export default DetailsPage;