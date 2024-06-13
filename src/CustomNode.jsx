import React, { useState, useEffect } from 'react';
import { Handle } from 'reactflow';
import { User, Cog } from 'lucide-react';
import './CustomNode.css';

function CustomNode({ data }) {
  const { label, userValue, gearValue, capacity, totalCapacity, MainTable = [], resourceData = [], received } = data;
  const [editableJobData, setEditableJobData] = useState(MainTable);
  const [isEditing, setIsEditing] = useState(Array(MainTable.length).fill(false));
  const [updatedUserValue, setUpdatedUserValue] = useState(userValue);
  const [showTooltip, setShowTooltip] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setEditableJobData(MainTable);
    setIsEditing(Array(MainTable.length).fill(false));
  }, [MainTable]);

  useEffect(() => {
    setUpdatedUserValue(userValue);
  }, [userValue]);

  const handleEditClick = (index) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = !newIsEditing[index];
    setIsEditing(newIsEditing);
  };

  const handleSaveClick = async (index) => {
    const jobToUpdate = editableJobData[index];
    console.log('Saving changes for job:', MainTable[index], index);
    
    try {
      let token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/editjobtoworkstation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          ws_job_edit_id: jobToUpdate.pass_id, // Replace with your actual ID field
          qty_allot: jobToUpdate.allocated,
          difference: jobToUpdate.allocated - oldAllocated, // Calculate difference
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
  
      // Assuming successful response means the edit was saved
      const updatedJobData = [...editableJobData];
      setIsEditing(Array(MainTable.length).fill(false)); // Reset editing state
      setEditableJobData(updatedJobData); // Update state if needed based on response
    } catch (error) {
      console.error('Error saving changes:', error);
      // Handle error scenario as needed
    }
  };
  

  const handleJobChange = (index, field, value) => {
    const newJobData = [...editableJobData];
    newJobData[index][field] = value;
    setEditableJobData(newJobData);
  };

  const capacityPercentage = (capacity / totalCapacity) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (capacityPercentage / 100) * circumference;
  const receivedOffset = circumference - (capacityPercentage / 100) * circumference;

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleTooltipClick = (e) => {
    e.stopPropagation(); // Prevents the click from bubbling up to handleNodeClick
  };

  return (
    <div className="custom-node" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Handle type="target" position="top" />

      <div className="circle-container">
        <div className="circle-content" style={{ backgroundColor: '#ffffff' }}>
          <div className="icon">
            <User />
            <span>{updatedUserValue}</span>
          </div>
          <div className="icon">
            <Cog />
            <span>{gearValue}</span>
          </div>
        </div>
        <svg className="circle-svg" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <circle
            className="circle-background"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="8"
          />
          <circle
            className="circle-background"
            cx="60"
            cy="60"
            r={radius + 10}
            strokeWidth="8"
          />
          <circle
            className="circle-progress"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset ? offset : 0}
            transform="rotate(-90 60 60)"  // Adjust rotation
          />
          <circle
            className="circle-progress-received"
            cx="60"
            cy="60"
            r={radius + 10}
            strokeWidth="4"
            strokeDasharray={circumference + 2 * Math.PI * 10} // Adjust for the new circumference
            strokeDashoffset={receivedOffset ? receivedOffset : 0}
            transform="rotate(-70 60 60)"  // Adjust rotation
          />
        </svg>
      </div>

      <div className="label">{label}</div>
      <Handle type="source" position="bottom" />

      {showTooltip && label !== 'Primary Work Station' && (
        <>
          <div className="tooltip" onClick={handleTooltipClick}>
            <div className="tooltip-content">
              <h3>Job</h3>
              <div className="job-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Allocated</th>
                      <th>Received</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editableJobData.map((job, index) => (
                      <tr key={index}>
                        <td>{job.name} ({job.unit})</td>
                        <td>
                          {isEditing[index] ? (
                            <input
                              type="number"
                              value={job.allocated}
                              onChange={(e) => handleJobChange(index, 'allocated', e.target.value)}
                            />
                          ) : (
                            job.allocated
                          )}
                        </td>
                        <td>{job.received}</td>
                        <td>
                          {isEditing[index] ? (
                            <button onClick={() => handleSaveClick(index)}>Save</button>
                          ) : (
                            <button onClick={() => handleEditClick(index)}>Edit</button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="job-actions">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button>Add</button>
              </div>
              <h3>Resources</h3>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Time</th>
                    <th>Mode</th>
                  </tr>
                </thead>
                <tbody>
                  {resourceData.map((resource, index) => (
                    <tr key={index}>
                      <td>{resource.name}</td>
                      <td>{resource.time}</td>
                      <td>{resource.mode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default CustomNode;
