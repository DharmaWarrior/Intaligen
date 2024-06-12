import React, { useState, useEffect } from 'react';
import { Handle } from 'reactflow';
import { User, Cog } from 'lucide-react';
import './CustomNode.css';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./../components/ui/tooltip";


function CustomNode({ data }) {
  const { label, userValue, gearValue, capacity, totalCapacity, jobData = [], resourceData = [], alloted, received } = data;
  const [editableJobData, setEditableJobData] = useState(jobData);
  const [isEditing, setIsEditing] = useState(Array(jobData.length).fill(false));
  const [updatedUserValue, setUpdatedUserValue] = useState(userValue);
  const [updatedReceivedValue, setUpdatedReceivedValue] = useState(received);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    setEditableJobData(jobData);
    setIsEditing(Array(jobData.length).fill(false));
  }, [jobData]);

  useEffect(() => {
    setUpdatedUserValue(userValue);
    setUpdatedReceivedValue(received);
  }, [userValue, received]);

  const handleEditClick = (index) => {
    const newIsEditing = [...isEditing];
    newIsEditing[index] = !newIsEditing[index];
    setIsEditing(newIsEditing);
  };

  const handleJobChange = (index, field, value) => {
    const newJobData = [...editableJobData];
    newJobData[index][field] = value;
    setEditableJobData(newJobData);
  };

  const JobRate_alloted = jobData.reduce((sum, job) => sum + job.allotedJobRate, 0);
  const JobRate_received = jobData.reduce((sum, job) => sum + job.receivedJobRate, 0);
  const ResourceCost_alloted = resourceData.reduce((sum, job) => sum + job.allotedResourceCost, 0);

  const capacityPercentage = (JobRate_alloted / ResourceCost_alloted) * 100;
  const receivedCapacityPercentage = (JobRate_received / ResourceCost_alloted) * 100;

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (capacityPercentage / 100) * circumference;
  const receivedOffset = circumference - (receivedCapacityPercentage / 100) * circumference;

  const handleMouseEnter = () => {
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div className="custom-node" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleMouseEnter}>
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
            strokeDashoffset={offset}
            transform="rotate(-90 60 60)"  // Adjust rotation
          />
          <circle
            className="circle-progress-received"
            cx="60"
            cy="60"
            r={radius + 10}
            strokeWidth="4"
            strokeDasharray={circumference + 2 * Math.PI * 10} // Adjust for the new circumference
            strokeDashoffset={receivedOffset}
            transform="rotate(-70 60 60)"  // Adjust rotation
          />
        </svg>
      </div>

      <div className="label">{label}</div>
      <Handle type="source" position="bottom" />

      {showTooltip && label !== 'Primary Work Station' && (
        <>
          <div className="tooltip">
            <div className="tooltip-content">
              <h3>Job</h3>
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
                      <td>{job.name}{' (KGS)'}</td>
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
                      <td>
                        {isEditing[index] ? (
                          <input
                            type="number"
                            value={job.received}
                            onChange={(e) => handleJobChange(index, 'received', e.target.value)}
                          />
                        ) : (
                          job.received
                        )}
                      </td>
                      <td>
                        <button onClick={() => handleEditClick(index)}>
                          {isEditing[index] ? 'Save' : 'Edit'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
