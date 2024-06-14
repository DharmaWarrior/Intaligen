import React, { useState, useEffect } from 'react';
import { Handle } from 'reactflow';
import { User, Cog } from 'lucide-react';
import './CustomNode.css';
import { Button } from './../components/ui/button';
import Search from './components/Search';

function CustomNode({ id, data, ws_date }) {
  const { label, userValue, gearValue, capacity, totalCapacity, MainTable = [], resourceData = [] } = data;
  const [editableJobData, setEditableJobData] = useState(MainTable);
  const [isEditing, setIsEditing] = useState(Array(MainTable.length).fill(false));
  const [updatedUserValue, setUpdatedUserValue] = useState(userValue);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setEditableJobData(MainTable);
    setIsEditing(Array(MainTable.length).fill(false));
  }, [MainTable]);

  useEffect(() => {
    setUpdatedUserValue(userValue);
  }, [userValue]);

  const handleEditToggle = (index) => {
    setIsEditing(prev => {
      const newIsEditing = [...prev];
      newIsEditing[index] = !newIsEditing[index];
      return newIsEditing;
    });
  };

  const handleSaveClick = async (index) => {
    const { pass_id, allocated } = editableJobData[index];
    const originalAllocated = MainTable[index].allocated;
    const qtyAllotDifference = allocated - originalAllocated;

    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/editjobtoworkstation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ ws_job_edit_id: pass_id, qty_allot: qtyAllotDifference }),
      });

      if (response.ok) {
        setIsEditing(Array(MainTable.length).fill(false));
      } else {
        throw new Error('Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleAddClick = async () => {
    if (!selectedItem) return;

    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/addjobtoworkstation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          workstation_id: id,
          item_id: selectedItem.id,
          qty_allot: selectedItem.allocated,
          date_allot: "2024-06-01",
        }),
      });

      if (response.ok) {
        setEditableJobData([...editableJobData, { ...selectedItem, received: 0 }]);
        setIsEditing([...isEditing, false]);
        setSelectedItem(null);
      } else {
        throw new Error('Failed to add job');
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleSelect = (item) => {
    setSelectedItem({ ...item, allocated: 0, received: 0 });
    setIsEditing([...isEditing, true]);
  };

  const handleJobChange = (index, field, value) => {
    setEditableJobData(prev => {
      const newJobData = [...prev];
      newJobData[index][field] = value;
      return newJobData;
    });
  };

  const capacityPercentage = (capacity / totalCapacity) * 100;
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (capacityPercentage / 100) * circumference;
  const receivedOffset = circumference - (capacityPercentage / 100) * circumference;

  return (
    <div className="custom-node" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
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
          <circle className="circle-background" cx="60" cy="60" r={radius} strokeWidth="8" />
          <circle className="circle-background" cx="60" cy="60" r={radius + 10} strokeWidth="8" />
          <circle
            className="circle-progress"
            cx="60"
            cy="60"
            r={radius}
            strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset || 0}
            transform="rotate(-90 60 60)"
          />
          <circle
            className="circle-progress-received"
            cx="60"
            cy="60"
            r={radius + 10}
            strokeWidth="4"
            strokeDasharray={circumference + 2 * Math.PI * 10}
            strokeDashoffset={receivedOffset || 0}
            transform="rotate(-70 60 60)"
          />
        </svg>
      </div>
      <div className="label">{label}</div>
      <Handle type="source" position="bottom" />

      {showTooltip && label !== 'Primary Work Station' && (
        <div className="tooltip">
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
                          <button onClick={() => handleEditToggle(index)}>Edit</button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {selectedItem && (
                    <tr>
                      <td>{selectedItem.name} ({selectedItem.unit})</td>
                      <td>
                        <input
                          type="number"
                          value={selectedItem.allocated}
                          onChange={(e) => setSelectedItem({ ...selectedItem, allocated: e.target.value })}
                        />
                      </td>
                      <td>0</td>
                      <td><button onClick={handleAddClick}>Add</button></td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <Search onSelect={handleSelect} />
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
      )}
    </div>
  );
}

export default CustomNode;
