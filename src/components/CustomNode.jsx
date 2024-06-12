// CustomNode.js
import React from 'react';

const CustomNode = ({ data }) => {
  return (
    <div style={{ padding: 10, border: '1px solid #ddd', borderRadius: 5 }}>
      <div>{data.label}</div>
      <div>Custom Data: {data.customData}</div>
    </div>
  );
};

export default CustomNode;
