import React, { useEffect, useRef, useState } from 'react';
import ReactFlow, { Controls, Background } from 'reactflow';
import 'reactflow/dist/style.css';
import './Flow.css';
import CustomNode from './CustomNode';
import CustomAdjustmentNode from './CustomAdjustmentNode';
import Sidebar from './components/Sidebar';
import RightSidebar from './components/RightSidebar';

const nodeTypes = {
  customNode: CustomNode,
  adjustmentNode: CustomAdjustmentNode, // New adjustment node component
};

const initialEdges = [
  { id: '1-2', source: '1', target: '2', type: 'smoothstep' },
  { id: '1-3', source: '1', target: '3', type: 'smoothstep' },
  { id: '1-4', source: '1', target: '4', type: 'smoothstep' },
];

const childNodesData = [
  { id: '2', label: 'Packaging', userValue: 3, gearValue: 2, capacity: 50, totalCapacity: 100, alloted: 2, received: 3 },
  { id: '3', label: 'Bathi', userValue: 3, gearValue: 2, capacity: 70, totalCapacity: 100, alloted: 5, received: 6 },
  { id: '4', label: 'Dipping', userValue: 3, gearValue: 2, capacity: 90, totalCapacity: 100, alloted: 7, received: 8 },
];

const adjustmentNodesData = [
  { id: '5', label: 'Adjustment 1', userValue: 1, gearValue: 0, capacity: 90, totalCapacity: 100, alloted: 7, received: 8 },
  { id: '6', label: 'Adjustment 2', userValue: 2, gearValue: 0, capacity: 90, totalCapacity: 100, alloted: 7, received: 8 },
  { id: '7', label: 'Adjustment 3', userValue: 4, gearValue: 0, capacity: 90, totalCapacity: 100, alloted: 7, received: 8 },
  { id: '8', label: 'Parent Adjustment', userValue: 5, gearValue: 1, capacity: 95, totalCapacity: 100, alloted: 10, received: 10 },
];

const computeTotalValues = (children) => {
  return children.reduce(
    (totals, child) => {
      totals.userValue += child.userValue;
      totals.gearValue += child.gearValue;
      return totals;
    },
    { userValue: 0, gearValue: 0 }
  );
};

const { userValue: totalUserValue, gearValue: totalGearValue } = computeTotalValues(childNodesData);

const resourceData = [
  { name: 'Resource 1', time: '10 mins', mode: 'Auto', allotedResourceCost: 50 },
  { name: 'Resource 2', time: '20 mins', mode: 'Manual', allotedResourceCost: 50 },
];

const generateJobData = (userValue) => [
  { name: 'Job 1', allocated: Math.floor(userValue * 0.4), received: Math.floor(userValue * 0.4), allotedJobRate: 10, receivedJobRate: 35 },
  { name: 'Job 2', allocated: Math.floor(userValue * 0.3), received: Math.floor(userValue * 0.3), allotedJobRate: 20, receivedJobRate: 10 },
  { name: 'Job 3', allocated: Math.floor(userValue * 0.3), received: Math.floor(userValue * 0.3), allotedJobRate: 20, receivedJobRate: 30 },
];

const initialNodes = [
  {
    id: '1',
    data: { label: 'Primary Work Station', userValue: totalUserValue, gearValue: totalGearValue, capacity: 80, totalCapacity: 100, jobData: generateJobData(totalUserValue), resourceData },
    position: { x: 250, y: 5 },
    type: 'customNode',
  },
  ...childNodesData.map((data, index) => ({
    id: data.id,
    data: { ...data, jobData: generateJobData(data.userValue), resourceData },
    position: { x: 125 * (index + 1), y: 220 },
    type: 'customNode',
  })),
  {
    id: '8',
    data: { ...adjustmentNodesData[3], jobData: generateJobData(adjustmentNodesData[3].userValue), resourceData },
    position: { x: 550, y: 5 }, // Adjusted position for the parent adjustment node
    type: 'adjustmentNode', // Using the new adjustment node component
  },
];

const initialAdjustmentEdges = [
  { id: '1-8', source: '1', target: '8', type: 'smoothstep' },
];

function Flow() {
  const containerRef = useRef(null);
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState([...initialEdges, ...initialAdjustmentEdges]);
  const [openAdjustmentNodes, setOpenAdjustmentNodes] = useState(['8']);
  const [selectedNode, setSelectedNode] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleNodeClick = (event, node) => {
    if (node.type === 'customNode' && childNodesData.some(childNode => childNode.id === node.id)) {
      const childNodeIndex = childNodesData.findIndex(childNode => childNode.id === node.id);
      const adjustmentNodeData = adjustmentNodesData[childNodeIndex];
      const adjustmentNodeId = adjustmentNodeData.id;
      const adjustmentNode = {
        id: adjustmentNodeId,
        data: { ...adjustmentNodeData, jobData: generateJobData(adjustmentNodeData.userValue), resourceData },
        position: { x: node.position.x, y: node.position.y + 220 },
        type: 'adjustmentNode',
      };

      const adjustmentEdge = {
        id: `${node.id}-${adjustmentNodeId}`,
        source: node.id,
        target: adjustmentNodeId,
        type: 'smoothstep',
      };

      if (openAdjustmentNodes.includes(adjustmentNodeId)) {
        setNodes(prevNodes => prevNodes.filter(n => n.id !== adjustmentNodeId));
        setEdges(prevEdges => prevEdges.filter(e => e.target !== adjustmentNodeId));
        setOpenAdjustmentNodes(prevOpen => prevOpen.filter(id => id !== adjustmentNodeId));
      } else {
        setNodes(prevNodes => [...prevNodes, adjustmentNode]);
        setEdges(prevEdges => [...prevEdges, adjustmentEdge]);
        setOpenAdjustmentNodes(prevOpen => [...prevOpen, adjustmentNodeId]);
      }

      // Update the sidebar state
      setSelectedNode(node);
      setIsSidebarOpen(true);
    }
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
        onClose={closeSidebar}
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
