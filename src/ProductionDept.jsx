import React, { useEffect, useRef, useState, useMemo } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css';
import CustomNode from './CustomNode';
import CustomAdjustmentNode from './CustomAdjustmentNode';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';

// const nodeTypes = {
//   // customNode: CustomNode,
//   adjustmentNode: CustomAdjustmentNode,
//   customNode: (props) => <CustomNode fetchWorkstations={fetchWorkstations} setNodes={setNodes} setEdges {...props} />
// };

// const resourceData = [
//   { name: 'Resource 1', time: '10 mins', mode: 'Auto', allotedResourceCost: 50 },
//   { name: 'Resource 2', time: '20 mins', mode: 'Manual', allotedResourceCost: 50 },
// ];

// const generateJobData = (wsdetails) => {
//   return Object.entries(wsdetails.totals).map(([id, allocatedValue]) => {
//     const matchingJob = wsdetails.jobs.find(job => job.item_id === parseInt(id, 10));
//     const itemName = matchingJob ? matchingJob.item.name : 'Unknown';
//     const itemUnit = matchingJob ? matchingJob.item.unit : 'Unknown';
//     const passing_id = matchingJob ? matchingJob.id : 'Unknown';

//     return {
//       name: itemName,
//       allocated: allocatedValue,
//       received: wsdetails.recv_totals[id] || 0,
//       allotedJobRate: 0,
//       receivedJobRate: 0,
//       unit: itemUnit,
//       pass_id: passing_id,
//       ws_date: wsdetails.ws_date,
//     };
//   });
// };

// const generateResourceData = (wsdetails) => {
//   return (wsdetails.child_resources).map((resource) => {

//     return {
//       Name: resource.id,
//       Mode: resource.contract_mode,
//       Time: resource.time_allot,
//     };
//   });
// };

// const fetchWorkstations = async (setNodes, setEdges) => {

//   console.log("fetching data");

//   try {
//     let token = localStorage.getItem("usersdatatoken");
//     const response = await fetch("/api/workstation/1/2024-06-01", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         "Authorization": "Bearer " + token,
//       },
//     });

//     if (response.ok) {
//       const data = await response.json();
//       const jobsBreakup = data.jobs_breakup;

//       const parentNode = {
//         id: '1',
//         data: {
//           label: jobsBreakup["1"].workstation.database.name,
//           userValue: jobsBreakup["1"].jobs.length,
//           gearValue: jobsBreakup["1"].resources ? jobsBreakup["1"].resources.length : 0,
//           capacity: jobsBreakup["1"].job_work_totals,
//           totalCapacity: jobsBreakup["1"].capacity_totals,
//           MainTable: generateJobData(jobsBreakup["1"]),
//           resourceData: generateResourceData(jobsBreakup["1"]),
//           fetchWorkstations : {fetchWorkstations},
//         },
        
//         position: { x: 250, y: 5 },
//         type: 'customNode',
//       };

//       const childNodes = Object.entries(jobsBreakup["1"].childs).map(([id, details], index) => ({
//         id: id,
//         data: {
//           label: details.workstation.name,
//           userValue: details.jobs.length,
//           gearValue: details.resources ? details.resources.length : 0,
//           capacity: details.job_work_totals,
//           totalCapacity: details.capacity_totals,
//           MainTable: generateJobData(details),
//           resourceData: generateResourceData(details),
//           Adjustment: details.jobs,
//           AdjustmentResource: details.resources,
//           childData: details.childs,
//           fetchWorkstations : {fetchWorkstations},
//         },
        
//         position: { x: 225 * (index + 1), y: 420 },
//         type: 'customNode',
//         ws_date: details.ws_date,
//       }));

//       const adjustmentNode = {
//         id: `adj-1`,
//         data: {
//           label: 'Parent Adjustment',
//           userValue: data.workstation_jobs.length,
//           gearValue: data.workstation_resources ? data.workstation_resources.length : 0,
//           capacity: 90,
//           totalCapacity: 100,
//           MainTable: jobsBreakup["1"].jobs,
//           resourceData: jobsBreakup["1"].resources,
//         },
//         position: { x: 650, y: 5 },
//         type: 'adjustmentNode',
//       };

      
//       setNodes([parentNode, adjustmentNode, ...childNodes]);
//       setEdges([
//         { id: '1-10', source: '1', target: `adj-1`, type: 'simplebezier', animated: true, arrowHeadType: 'arrowclosed', style: { stroke: 'red' }, sourcePosition: 'right', targetPosition: 'left' },
//         ...childNodes.map((node, index) => ({
//           id: `1-${node.id}`,
//           source: '1',
//           target: node.id,
//           type: 'simplebezier',
//           animated: true,
//           arrowHeadType: 'arrowclosed',
//           style: { stroke: 'black' }
//         }))
//       ]);
//     } else {
//       console.error('Error fetching workstation data:', response.status);
//     }
//   } catch (error) {
//     console.error('Error fetching workstation data:', error);
//   }
// };



function Flow() {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [openAdjustmentNodes, setOpenAdjustmentNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const nodeTypes = useMemo(() => ({
    adjustmentNode: CustomAdjustmentNode,
    customNode: (props) => <CustomNode fetchWorkstations={fetchWorkstations}  {...props} />
  }), []);
  
  
  const generateJobData = (wsdetails) => {
    return Object.entries(wsdetails.totals).map(([id, allocatedValue]) => {
      const matchingJob = wsdetails.jobs.find(job => job.item_id === parseInt(id, 10));
      const itemName = matchingJob ? matchingJob.item.name : 'Unknown';
      const itemUnit = matchingJob ? matchingJob.item.unit : 'Unknown';
      const passing_id = matchingJob ? matchingJob.id : 'Unknown';
      const to_allot = matchingJob ? matchingJob.qty_allot : 0;
      
  
      return {
        name: itemName,
        allocated: allocatedValue,
        received: wsdetails.recv_totals[id] || 0,
        allotedJobRate: 0,
        receivedJobRate: 0,
        unit: itemUnit,
        pass_id: passing_id,
        ws_date: wsdetails.ws_date,
        to_allot: to_allot,
        childinfo: wsdetails.childs,
      };
    });
  };
  
  const generateResourceData = (wsdetails) => {
    return (wsdetails.child_resources).map((resources) => {


      return {
        Name: resources.resource.name,
        Mode: resources.contract_mode,
        Time: resources.time_allot,
        id: resources.id,
      };
    });
  };

  const generatematerialsData = (wsdetails) => {
    return Object.entries(wsdetails.material_issue_totals).map(([id, allocatedValue]) => {
      const matchingJob = wsdetails.material_issues.find(job => job.item_id === parseInt(id, 10));

      const itemName = matchingJob ? matchingJob.item.name : 'Unknown';
      const itemUnit = matchingJob ? matchingJob.item_unit : 'Unknown';
      
  
      return {
        name: itemName,
        unit: itemUnit,
        reject_totals: wsdetails.material_reject_totals[id] || 0,
        issue_totals: allocatedValue || 0,
        return_totals: wsdetails.material_return_totals[id] || 0,
        estimated_totals: wsdetails.material_estimate_totals[id] || 0,
      };
    });
  };
  
  const fetchWorkstations = async () => {
  
    console.log("fetching data");
  
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/workstation/1/2024-06-01", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token,
        },
      });
  
      if (response.ok) {
        const data = await response.json();
        const jobsBreakup = data.jobs_breakup;
  
        const parentNode = {
          id: '1',
          data: {
            label: jobsBreakup["1"].workstation.database.name,
            userValue: jobsBreakup["1"].jobs.length,
            gearValue: jobsBreakup["1"].resources ? jobsBreakup["1"].resources.length : 0,
            capacity: jobsBreakup["1"].job_work_totals,
            totalCapacity: jobsBreakup["1"].capacity_totals,
            MainTable: generateJobData(jobsBreakup["1"]),
            resourceData: generateResourceData(jobsBreakup["1"]),
            MaterialData: generatematerialsData(jobsBreakup["1"]),
            fetchWorkstations : {fetchWorkstations},
          },
          
          position: { x: 250, y: 5 },
          type: 'customNode',
        };
  
        const childNodes = Object.entries(jobsBreakup["1"].childs).map(([id, details], index) => ({
          id: id,
          data: {
            workstation_id: details.workstation.id,
            label: details.workstation.name,
            userValue: details.jobs.length,
            gearValue: details.resources ? details.resources.length : 0,
            capacity: details.job_work_totals,
            totalCapacity: details.capacity_totals,
            MainTable: generateJobData(details),
            resourceData: generateResourceData(details),
            Adjustment: details.jobs,
            AdjustmentResource: details.resources,
            childData: details.childs,
            MaterialData: generatematerialsData(details),
            fetchWorkstations : {fetchWorkstations},
          },
          
          position: { x: 225 * (index + 1), y: 420 },
          type: 'customNode',
          ws_date: details.ws_date,
        }));
  
        const adjustmentNode = {
          id: `adj-1`,
          data: {
            label: 'Parent Adjustment',
            userValue: data.workstation_jobs.length,
            gearValue: data.workstation_resources ? data.workstation_resources.length : 0,
            capacity: 90,
            totalCapacity: 100,
            MainTable: jobsBreakup["1"].jobs,
            resourceData: jobsBreakup["1"].resources,
          },
          position: { x: 650, y: 5 },
          type: 'adjustmentNode',
        };
  
        
        setNodes([parentNode, adjustmentNode, ...childNodes]);
        setEdges([
          { id: '1-10', source: '1', target: `adj-1`, type: 'simplebezier', animated: true, arrowHeadType: 'arrowclosed', style: { stroke: 'red' }, sourcePosition: 'right', targetPosition: 'left' },
          ...childNodes.map((node, index) => ({
            id: `1-${node.id}`,
            source: '1',
            target: node.id,
            type: 'simplebezier',
            animated: true,
            arrowHeadType: 'arrowclosed',
            style: { stroke: 'black' }
          }))
        ]);
      } else {
        console.error('Error fetching workstation data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching workstation data:', error);
    }
  };

  useEffect(() => {
    fetchWorkstations();
  }, []);

  const handleNodeClick = (event, node) => {

    console.log('Node Data on Click:', node.data);
    if (node.id === '1') {
      setSelectedNode(node);
      setIsSidebarOpen(true);
      return;
    }

    const isAdjustmentNodeOpen = openAdjustmentNodes.includes(node.id);
    const adjustmentNodeId = `adj-${node.id}`;
    
    if (isAdjustmentNodeOpen) {
      // Close the adjustment node and child nodes if they are already open
      setNodes(prevNodes => prevNodes.filter(n => n.id !== adjustmentNodeId && !n.id.startsWith(`${node.id}-child-`)));
      setEdges(prevEdges => prevEdges.filter(e => e.target !== adjustmentNodeId && !e.id.startsWith(`${node.id}-child-`)));
      setOpenAdjustmentNodes(prevOpen => prevOpen.filter(id => id !== node.id));
    } else {
      // Open the adjustment node if it is not open
      
      const adjustmentNodeData = {
        id: adjustmentNodeId,
        data: {
          label: `Adjustment for ${node.data.label}`,
          userValue: node.data.userValue,
          gearValue: node.data.gearValue,
          capacity: node.data.capacity,
          totalCapacity: node.data.totalCapacity,
          MainTable: node.data.Adjustment, // Use the MainTable from the node directly
          resourceData: node.data.AdjustmentResource, // Use the resourceData from the node directly
        },
        position: { x: node.position.x, y: node.position.y + 220 },
        type: 'adjustmentNode',
      };
  
      const adjustmentEdge = {
        id: `${node.id}-${adjustmentNodeId}`,
        source: node.id,
        target: adjustmentNodeId,
        type: 'simplebezier',
        animated: true,
        arrowHeadType: 'arrowclosed',
        style: { stroke: 'red' }
      };
  
      // Add child nodes if they exist
      const childNodes = node.data.childData ? Object.entries(node.data.childData).map(([childId, childDetails], index) => ({
        id: `${node.id}-child-${childId}`,
        
        data: {
          workstation_id: childDetails.workstation.id,
          label: childDetails.workstation.name,
          userValue: childDetails.jobs.length,
          gearValue: childDetails.resources ? childDetails.resources.length : 0,
          capacity: childDetails.job_work_totals,
          totalCapacity: childDetails.capacity_totals,
          MainTable: generateJobData(childDetails),
          resourceData: generateResourceData(childDetails),
          Adjustment: childDetails.jobs,
          AdjustmentResource: childDetails.resources,
          MaterialData: generatematerialsData(childDetails),
          childData: childDetails.childs,
          fetchWorkstations : {fetchWorkstations},
        },
        position: { x: node.position.x + 125 * (index + 1), y: node.position.y + 220 },
        type: 'customNode',
        ws_date: childDetails.ws_date,
      })) : [];
  
      const childEdges = childNodes.map(childNode => ({
        id: `${node.id}-child-${childNode.id}`,
        source: node.id,
        target: childNode.id,
        type: 'simplebezier',
        animated: true,
        arrowHeadType: 'arrowclosed',
        style: { stroke: 'black' }
      }));
      
      
      setNodes(prevNodes => [...prevNodes, adjustmentNodeData, ...childNodes]);
      setEdges(prevEdges => [...prevEdges, adjustmentEdge, ...childEdges]);
      setOpenAdjustmentNodes(prevOpen => [...prevOpen, node.id]);
    }
  
    setIsSidebarOpen(true);
    setSelectedNode(node);
    
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
    setSelectedNode(null);
  };

  return (
    <div className="w-full h-[90vh] mt-0 flex flex-col">
      <Sidebar />
      <RightSidebar
        isOpen={isSidebarOpen}
        content={selectedNode ? selectedNode.data.label : ''}
        onClose={ closeSidebar}
        planning={selectedNode ? selectedNode.data.MainTable : ''}
        resources={selectedNode ? selectedNode.data.resourceData : []}
        products={selectedNode ? selectedNode.data.AdjustmentResource : []}
        materials={selectedNode ? selectedNode.data.MaterialData : []}
        

      />
      <div className="h-[90%] overflow-y-auto absolute right-0 w-[80%] px-10 flow-container" ref={containerRef}>
        <div className="flow-container" ref={containerRef}>
        <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            style={{ height: '100%', width: '80%' }}

          >
            <Background />
            <Controls position="top-left" />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}

export default Flow;
