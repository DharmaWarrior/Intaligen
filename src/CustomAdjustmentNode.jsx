import React, { useState, useEffect } from 'react';
import { Handle } from 'reactflow';
import { User, Cog } from 'lucide-react';
import './CustomAdjustmentNode.css';
import { Pencil, Check, X, Trash } from 'lucide-react';
import Search from './components/Search';


function CustomAdjustmentNode({ data,fetchWorkstations }) {
  const { label, userValue, gearValue, capacity, totalCapacity, MainTable = [], resourceData = [], alloted, received } = data;
  const [editableJobData, setEditableJobData] = useState(MainTable);
  const [originalJobData, setOriginalJobData] = useState(MainTable.map(job => ({ ...job })));
  const [editableResourceData, setEditableResourceData] = useState(resourceData);
  const [originalResourceData, setOriginalResourceData] = useState(resourceData.map(resource => ({ ...resource })));
  const [isEditing, setIsEditing] = useState(Array(MainTable.length + resourceData.length).fill(false));
  const [updatedUserValue, setUpdatedUserValue] = useState(userValue);
  const [showTooltip, setShowTooltip] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setEditableJobData(MainTable);
    setOriginalJobData(MainTable.map(job => ({ ...job })));
    setEditableResourceData(resourceData);
    setOriginalResourceData(resourceData.map(resource => ({ ...resource })));
    setIsEditing(Array(MainTable.length + resourceData.length).fill(false));
  }, []);

  useEffect(() => {
    setUpdatedUserValue(userValue);
  }, [userValue]);

  const handleEditToggle = (index) => {
    setIsEditing(prev => {
      const newIsEditing = [...prev];
      newIsEditing[index] = !newIsEditing[index];
      return newIsEditing;
    });
  
    // Reset the job or resource data if edit mode is turned off
    if (isEditing[index]) {
      if (index < MainTable.length) {
        setEditableJobData(prev => {
          const newJobData = [...prev];
          newJobData[index] = { ...originalJobData[index] };
          return newJobData;
        });
      } else {
        setEditableResourceData(prev => {
          const resourceIndex = index - MainTable.length;
          const newResourceData = [...prev];
          newResourceData[resourceIndex] = { ...originalResourceData[resourceIndex] };
          return newResourceData;
        });
      }
    }
  };

  const handleSaveJClick = async (index) => {
    const jobToUpdate = editableJobData[index];
    const originalJob = originalJobData[index];
    const qtyAllotDifference = jobToUpdate.allocated - originalJob.allocated;

    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/editjobtoworkstation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ ws_job_edit_id: jobToUpdate.pass_id, qty_allot: qtyAllotDifference }),
      });

      if (!response.ok) {
        throw new Error('Failed to save changes');
      }

      // Assuming successful response means the edit was saved
      const updatedJobData = [...editableJobData];
      setIsEditing(Array(MainTable.length).fill(false)); // Reset editing state
      setEditableJobData(updatedJobData); // Update state if needed based on response

      fetchWorkstations();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };

  const handleSaveRClick = async (index) => {
    const resourceIndex = index - MainTable.length;
    const resourceToUpdate = editableResourceData[resourceIndex];
    
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/editrecord", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({
          fields: { time_allot: resourceToUpdate.Time }, // Assuming the Time field needs to be updated
          id: resourceToUpdate.id,
          table_name: "ws_resources"
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to save changes');
      }
  
      // Assuming successful response means the edit was saved
      const updatedResourceData = [...editableResourceData];
      setIsEditing(Array(MainTable.length + resourceData.length).fill(false)); // Reset editing state
      setEditableResourceData(updatedResourceData); // Update state if needed based on response
  
      fetchWorkstations();
    } catch (error) {
      console.error('Error saving changes:', error);
    }
  };
  
  

  const handleDeleteJClick = async (index) => {
    const jobToDelete = editableJobData[index];

    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/deletejobtoworkstation", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ ws_job_delete_id: jobToDelete.pass_id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Assuming successful response means the delete was successful
      setEditableJobData(prev => prev.filter((_, i) => i !== index));
      setIsEditing(prev => prev.filter((_, i) => i !== index));

      fetchWorkstations();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const handleDeleteRClick = async (index) => {
    const resourceToDelete = editableResourceData[index];
    console.log('Resource to delete:', resourceToDelete);
    try {
      const token = localStorage.getItem("usersdatatoken");
      const response = await fetch("/api/deleterecord", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'authorization': 'Bearer ' + token,
        },
        body: JSON.stringify({ id: resourceToDelete.id, table_name: "ws_resources" }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete resource');
      }

      // Assuming successful response means the delete was successful
      setEditableResourceData(prev => prev.filter((_, i) => i !== index));
      setIsEditing(prev => prev.filter((_, i) => i !== index + MainTable.length));

      fetchWorkstations();
    } catch (error) {
      console.error('Error deleting resource:', error);
    }
  };

  const handleCancelClick = (index) => {
    handleEditToggle(index);
    if (index < MainTable.length) {
      // Reset the job data
      setEditableJobData(prev => {
        const newJobData = [...prev];
        newJobData[index] = { ...originalJobData[index] };
        return newJobData;
      });
    } else {
      // Reset the resource data
      const resourceIndex = index - MainTable.length;
      setEditableResourceData(prev => {
        const newResourceData = [...prev];
        newResourceData[resourceIndex] = { ...originalResourceData[resourceIndex] };
        return newResourceData;
      });
    }
  };

  const handleAddClick = async () => {
    if (!selectedItem) return;

    if (selectedItem.type === 'job') {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch("/api/addjobtoworkstation", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            workstation_id: data.workstation_id,
            item_id: selectedItem.id,
            qty_allot: selectedItem.allocated,
            date_allot: "2024-06-01",
          }),
        });

        if (response.ok) {
          setEditableJobData([...editableJobData, { ...selectedItem, received: 0 }]);
          setIsEditing([...isEditing, false]);
          setSelectedItem(null);
          fetchWorkstations();
        } else {
          throw new Error('Failed to add job');
        }
      } catch (error) {
        console.error('Error adding job:', error);
      }
    } else if (selectedItem.type === 'resource') {
      try {
        const token = localStorage.getItem("usersdatatoken");
        const response = await fetch("/api/addrecord", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'authorization': 'Bearer ' + token,
          },
          body: JSON.stringify({
            fields: {
              workstation_id: data.workstation_id,
              resource_id: selectedItem.id,
              date_allot: "2024-06-01",
              time_allot: selectedItem.time,  // Assuming 'allocated' is the time allotted here
              contract_mode: selectedItem.mode
            },
            table_name: "ws_resources"
          }),
        });

        if (response.ok) {
          setEditableResourceData([...editableResourceData, { ...selectedItem, received: 0 }]);
          setIsEditing([...isEditing, false]);
          setSelectedItem(null);
          fetchWorkstations();
        } else {
          throw new Error('Failed to add resource');
        }
      } catch (error) {
        console.error('Error adding resource:', error);
      }
    }
  };

  const handleSelectJob = (item) => {
    setSelectedItem({ ...item, allocated: 0, received: 0, type: 'job' });
    setIsEditing([...isEditing, true]);
  };
  
  const handleSelectResource = (item) => {
    console.log('Selected Resource:', item);
    setSelectedItem({ ...item, Time: 0, Mode: 'PAYROLL', type: 'resource' });
    setIsEditing([...isEditing, true]);
  };

  const handleJobChange = (index, field, value) => {
    setEditableJobData(prev => {
      const newJobData = [...prev];
      newJobData[index][field] = value;
      return newJobData;
    });
  };

  const handleResourceChange = (index, field, value) => {
    setEditableResourceData(prev => {
      const newResourceData = [...prev];
      newResourceData[index][field] = value;
      return newResourceData;
    });
  };

  const handleTooltipClick = (e) => {
    e.stopPropagation(); // Prevents the click from bubbling up to handleNodeClick
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
        <div className="tooltip" onClick={handleTooltipClick}>
          <div className="tooltip-content">
            <div className="flex flex-col">
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
                        <td>{job.name}{` (${job.unit})`}</td>
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
                            <>
                              <button onClick={() => handleSaveJClick(index)}>
                                <Check size={15}/>
                              </button>
                              <button onClick={() => handleCancelClick(index)}>
                                <X size={15}/>
                              </button>
                              <button onClick={() => handleDeleteJClick(index)}>
                                <Trash size={15}/>
                              </button>
                            </>
                          ) : (
                            <button onClick={() => handleEditToggle(index)}>
                              <Pencil size={15}/>
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <Search label='Add Jobs' onSelect={handleSelectJob} onsearch='Job'/>
              </div>
            </div>
            <div className="flex flex-col">
              <h3>Resources</h3>
              <div className="job-table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Time</th>
                      <th>Mode</th>
                      <th>Edit</th>
                    </tr>
                  </thead>
                  <tbody>
                  {editableResourceData.map((resource, index) => (
                    <tr key={index}>
                      <td>{resource.Name}</td>
                      <td>
                        {isEditing[index + MainTable.length] ? (
                          <input
                            type="number"
                            value={resource.Time}
                            onChange={(e) => handleResourceChange(index, 'Time', e.target.value)}
                          />
                        ) : (
                          resource.Time
                        )}
                      </td>
                      <td>{resource.Mode}</td>
                      <td>
                        {isEditing[index + MainTable.length] ? (
                          <>
                            <button onClick={() => handleSaveRClick(index + MainTable.length)}>
                              <Check size={15} />
                            </button>
                            <button onClick={() => handleCancelClick(index + MainTable.length)}>
                              <X size={15} />
                            </button>
                            <button onClick={() => handleDeleteRClick(index)}>
                              <Trash size={15} />
                            </button>
                          </>
                        ) : (
                          <button onClick={() => handleEditToggle(index + MainTable.length)}>
                            <Pencil size={15} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {selectedItem && selectedItem.type === 'resource' && (
                  <tr>
                    <td>{selectedItem.name}</td>
                    <td>
                      <input
                        type="number"
                        value={selectedItem.time}
                        onChange={(e) => setSelectedItem({ ...selectedItem, time: e.target.value })}
                      />
                    </td>
                    <td>
                        <select
                        className='text-black'
                        value={selectedItem.mode}
                        onChange={(e) => setSelectedItem({ ...selectedItem, mode: e.target.value })}>
                          <option value="payroll" className='text-black'>PAYROLL</option>
                          <option value="contract" className='text-black'>CONTRACT</option>
                        </select>
                    </td>
                    <td><button onClick={handleAddClick}>Add</button></td>
                  </tr>
                )}
                </tbody>
                </table>
                <Search label='Add Resources' onSelect={handleSelectResource} onsearch='Resource'/>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomAdjustmentNode;
