import React, { useEffect, useRef, useState, useMemo } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css';
import CustomNode from './CustomNode';
import CustomAdjustmentNode from './CustomAdjustmentNode';
import RightSidebar from './components/RightSidebar';

function Flow() {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);
  const [openAdjustmentNodes, setOpenAdjustmentNodes] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const nodeTypes = useMemo(() => ({
    adjustmentNode: (props) => <CustomAdjustmentNode fetchWorkstations={fetchWorkstations}   {...props} />,
    customNode: (props) => <CustomNode fetchWorkstations={fetchWorkstations} setSelectedNode={setSelectedNode} selectedNode={selectedNode} {...props} />
  }), []);
  
  
  const genJobData = (wsdetails) => {
    return Object.entries(wsdetails.totals).map(([id, allocatedValue]) => {
      const matchingJob = wsdetails.jobs.find(job => job.item_id === parseInt(id, 10));
      const itemName = matchingJob ? matchingJob.item.name : 'Unknown';
      const itemUnit = matchingJob ? matchingJob.item.unit : 'Unknown';
      const passing_id = matchingJob ? matchingJob.id : 'Unknown';
      const to_allot = matchingJob ? matchingJob.qty_allot : 0;
      const to_reject = matchingJob ? matchingJob.qty_reject : 0;
      const to_wip = matchingJob ? matchingJob.qty_wip : 0;
      
      
  
      return {
        name: itemName,
        allocated: allocatedValue,
        received: wsdetails.recv_totals[id] || 0,
        reject: wsdetails.reject_totals[id] || 0,
        wip: wsdetails.wip_totals[id] || 0,
        allotedJobRate: 0,
        receivedJobRate: 0,
        unit: itemUnit,
        pass_id: passing_id,
        ws_date: wsdetails.ws_date,
        to_allot: to_allot,
        to_reject: to_reject,
        to_wip: to_wip,
        childinfo: wsdetails.childs,
        item_id: id,
      };
    });
  };

  const genAdjJobData = (AdjDetails) => {
    return (AdjDetails).map((job) => {


      return {
        name: job.item.name,
        allocated: job.qty_allot,
        received: job.qty_recv,
        allotedJobRate: 0,
        receivedJobRate: 0,
        unit: job.item.unit,
        pass_id: job.id,
        ws_date: job.date_allot,
        to_allot: 0,
        item_id: job.item_id,
      };
    });
  };
  
  const genResourceData = (wsdetails) => {
    return (wsdetails.child_resources).map((resources) => {


      return {
        Name: resources.resource.name,
        Mode: resources.contract_mode,
        Time: resources.time_allot,
        id: resources.id,
      };
    });
  };

  const genAdjResData = (AdjDetails) => {
    return (AdjDetails).map((resources) => {


      return {
        Name: resources.resource.name,
        Mode: resources.contract_mode,
        Time: resources.time_allot,
        id: resources.id,
      };
    });
  };

  const genMaterialData = (wsdetails) => {
    return Object.entries(wsdetails.material_issue_totals).map(([id, allocatedValue]) => {
      const matchingJob = wsdetails.material_issues.find(job => job.item_id === parseInt(id, 10));

      const itemName = matchingJob ? matchingJob.item.name : 'Unknown';
      const itemUnit = matchingJob ? matchingJob.item_unit : 'Unknown';
      const wip_flag = matchingJob ? matchingJob.wip_flag : 'Unknown';
      
  
      return {
        name: itemName,
        unit: itemUnit,
        reject_totals: wsdetails.material_reject_totals[id] || 0,
        issue_totals: allocatedValue || 0,
        return_totals: wsdetails.material_return_totals[id] || 0,
        estimated_totals: wsdetails.material_estimate_totals[id] || 0,
        wip_flag: wip_flag,
      };
    });
  };
  
  const fetchWorkstations = async () => {

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
            MainTable: genJobData(jobsBreakup["1"]),
            resourceData: genResourceData(jobsBreakup["1"]),
            MaterialData: genMaterialData(jobsBreakup["1"]),
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
            MainTable: genJobData(details),
            resourceData: genResourceData(details),
            Adjustment: details.jobs,
            AdjustmentResource: details.resources,
            childData: details.childs,
            MaterialData: genMaterialData(details),
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
            MainTable: genAdjJobData(jobsBreakup["1"].jobs),
            resourceData: genAdjResData(jobsBreakup["1"].resources),
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

    if (node.id === '1') {
      setSelectedNode(node);
      setIsSidebarOpen(true);
      return;
    }

    if (node.data.label.includes('Adjustment')) {
      // setSelectedNode(node);
      // setIsSidebarOpen(true);
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
      
      const adjustmentNodeData = {
        id: adjustmentNodeId,
        data: {
          label: `Adjustment for ${node.data.label}`,
          userValue: node.data.userValue,
          gearValue: node.data.gearValue,
          capacity: node.data.capacity,
          totalCapacity: node.data.totalCapacity,
          MainTable: genAdjJobData(node.data.Adjustment), // Use the MainTable from the node directly
          resourceData: genAdjResData(node.data.AdjustmentResource), // Use the resourceData from the node directly
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
    
      const childNodes = node.data.childData ? Object.entries(node.data.childData).map(([childId, childDetails], index) => ({
        id: `${node.id}-child-${childId}`,
        
        data: {
          workstation_id: childDetails.workstation.id,
          label: childDetails.workstation.name,
          userValue: childDetails.jobs.length,
          gearValue: childDetails.resources ? childDetails.resources.length : 0,
          capacity: childDetails.job_work_totals,
          totalCapacity: childDetails.capacity_totals,
          MainTable: genJobData(childDetails),
          resourceData: genResourceData(childDetails),
          Adjustment: childDetails.jobs,
          AdjustmentResource: childDetails.resources,
          MaterialData: genMaterialData(childDetails),
          childData: childDetails.childs,
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
    <div className="w-full h-[120vh] mt-0 flex flex-col">
      <RightSidebar
        
        isOpen={isSidebarOpen}
        content={selectedNode ? selectedNode.data.label : ''}
        onClose={closeSidebar}
        planning={selectedNode ? selectedNode.data.MainTable : ''}
        resources={selectedNode ? selectedNode.data.resourceData : []}
        products={selectedNode ? selectedNode.data.AdjustmentResource : []}
        materials={selectedNode ? selectedNode.data.MaterialData : []}
        selectedNode={selectedNode}
        setSelectedNode={setSelectedNode}
      />
      <div className=" flow-container" ref={containerRef}>
        <div className="flow-container" ref={containerRef}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodeClick={handleNodeClick}
            style={{ height: '100%' , width: '100%'}}
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
