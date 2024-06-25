import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "./../../components/ui/table";

const ExpandableProductTable = ({ jobData, toEdit }) => {
  const [expandedProducts, setExpandedProducts] = useState({});
  const [editedData, setEditedData] = useState(jobData);
  console.log("Mera JobData",jobData);

  const toggleProductDetails = (index) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  var level = 0;

  const toggleChildProductDetails = (parentIndex, childIndex) => {
    const key = `${parentIndex}-${childIndex}`;
    setExpandedProducts((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // const handleInputChange = (index, field, value, type, i,calltype) => {
  //   if(type === 'Parent' ) {

  //     currentElementId = `job-row-${index}-${i}-Parent-${field}`; //8
  //     old_value =document.getElementById(currentElementId).getAttribute('oldValue'); //5
      
  //     difference = value - old_value; //3

  //       var adjustmentKey = `job-row-${index}-${i}-Adjustment-${field}`;
  //       childSum = oldValue - (document.getElementById(adjustmentKey).value - difference);//4
  //       document.getElementById(currentElementId).setAttribute('oldValue') = value;

  //       if(value !== childSum + document.getElementById(adjustmentKey).value){
  //         document.getElementById(adjustmentKey).value += difference;
  //       }
        
  //       old_value2 =document.getElementById(`job-row-${index}-${i+1}-Parent-${field}`).getAttribute('oldValue');
  //       document.getElementById(`job-row-${index}-${i+1}-Parent-${field}`).value = old_value2 + difference;
        

      

  //   } else {
      
  //     currentElementId = `job-row-${index}-${i}-Adjustment-${field}`;
  //     old_value =document.getElementById(currentElementId).getAttribute('oldValue');
  //     document.getElementById(currentElementId).setAttribute('oldValue') = value;
  //     difference = value - old_value;

  //       var adjustmentKey = `job-row-${index}-${i}-Parent-${field}`;
  //       if(document.getElementById(adjustmentKey).value === value){
  //         return;
  //       }
  //       document.getElementById(adjustmentKey).value += difference;
  //       // document.getElementById(adjustmentKey).setAttribute('oldValue') += difference;
        
  //       // old_value2 = document.getElementById(`job-row-${index}-${i+1}-Parent-${field}`).getAttribute('oldValue');
  //       // document.getElementById(`job-row-${index}-${i+1}-Parent-${field}`).value = old_value2 + difference;

      
  //   }
  //   const updatedData = [...editedData];
  //   updatedData[index][field] = value;
  //   setEditedData(updatedData);
  // };

  const getQtyAllotForItemId = (jobs, itemId) => {
    const job = jobs.find(job => job.item_id === parseInt(itemId, 10));
    return job ? job.qty_allot : 0;
  };

  const getQtyRejectForItemId = (jobs, itemId) => {
    const job = jobs.find(job => job.item_id === parseInt(itemId, 10));
    return job ? job.qty_reject : 0;
  };

  const getQtyWipForItemId = (jobs, itemId) => {
    const job = jobs.find(job => job.item_id === parseInt(itemId, 10));
    return job ? job.qty_wip : 0;
  };

  const renderChildWorkstations = (children, parentIndex, item_id, unit, level,index) => {
    return Object.keys(children).map((key) => {
      
      const child = children[key];
      const childIndex = `${parentIndex}-${key}`;
      
      return (
        <React.Fragment key={`child-${childIndex}`}>
          {child.totals[item_id] && (
            <>
                <TableRow key={`job-row-${index}-${level}-Parent`} className='bg-gray-200' >
                  <TableCell
                      className="py-2 px-4 border-b cursor-pointer text-red-800 hover:underline"
                      onClick={() => toggleChildProductDetails(parentIndex, key)}
                  >
                      {'>>'}{child.workstation.name}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                      {child.totals[item_id] ? child.totals[item_id] : 0}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                      {unit}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                      {toEdit ? (
                      <input
                      id={`job-row-${index}-${level}-Parent-Finished`}
                          type="number"
                          value={child.finished ? child.finished : 0}
                          oldValue = {child.finished ? child.finished : 0}
                          onChange={(e) => handleInputChange(parentIndex, `children[${key}].finished`, e.target.value, 'Parent')}
                          className="w-full p-1 border"
                      />
                      ) : (
                      child.finished ? child.finished : 0
                      )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                  {toEdit ? (
                      <input
                      id={`job-row-${index}-${level}-Parent-Reject`}
                          type="number"
                          value={child.reject_totals[item_id] ? child.reject_totals[item_id] : 0}
                          oldValue = {child.reject_totals[item_id] ? child.reject_totals[item_id] : 0}
                          onChange={(e) => handleInputChange(parentIndex, `children[${key}].reject_totals[${item_id}]`, e.target.value, 'Parent')}
                          className="w-full p-1 border"
                      />
                      ) : (
                        child.reject_totals[item_id] ? child.reject_totals[item_id] : 0
                      )}
                  </TableCell><TableCell className="py-2 px-4 border-b">
                  {toEdit ? (
                      <input
                      id={`job-row-${index}-${level}-Parent-Wip`}
                          type="number"
                          value={child.wip_totals[item_id] ? child.wip_totals[item_id] : 0}
                          oldValue = {child.wip_totals[item_id] ? child.wip_totals[item_id] : 0}
                          onChange={(e) => handleInputChange(parentIndex, `children[${key}].wip_totals[${item_id}]`, e.target.value, 'Parent')}
                          className="w-full p-1 border"
                      />
                      ) : (
                        child.wip_totals[item_id] ? child.wip_totals[item_id] : 0
                      )}
                  </TableCell>
                </TableRow>
                {expandedProducts[childIndex] && (
                <React.Fragment>
                    <TableRow key={`job-row-${index}-${level}-Adjustment`}>
                      <TableCell className="py-2 px-4 border-b">
                          {'>>'}{'Adjustment'}
                      </TableCell>
                      <TableCell className="py-2 px-4 border-b">
                          {getQtyAllotForItemId(child.jobs, item_id)}
                      </TableCell>
                      <TableCell className="py-2 px-4 border-b">
                          {unit}
                      </TableCell>
                      <TableCell className="py-2 px-4 border-b">0</TableCell>
                      <TableCell className="py-2 px-4 border-b">
                      {toEdit ? (
                          <input
                          id={`job-row-${index}-${level}-Adjustment-Wip`}
                              type="number"
                              value={getQtyRejectForItemId(child.jobs, item_id)}
                              oldValue = {getQtyRejectForItemId(child.jobs, item_id)}
                              onChange={(e) => handleInputChange(parentIndex, `children[${key}].wip_totals[${item_id}]`, e.target.value, 'Adjustment')}
                              className="w-full p-1 border"
                          />
                        ) : (
                          getQtyWipForItemId(child.jobs, item_id)
                        )}
                      </TableCell><TableCell className="py-2 px-4 border-b">
                        {toEdit ? (
                          <input
                          id={`job-row-${index}-${level}-Adjustment-Wip`}
                              type="number"
                              value={getQtyWipForItemId(child.jobs, item_id)}
                              oldValue = {getQtyWipForItemId(child.jobs, item_id)}
                              onChange={(e) => handleInputChange(parentIndex, `children[${key}].wip_totals[${item_id}]`, e.target.value,'Adjustment')}
                              className="w-full p-1 border"
                          />
                        ) : (
                          getQtyWipForItemId(child.jobs, item_id)
                        )}
                          
                      </TableCell>
                    </TableRow>
                    {child.childs && renderChildWorkstations(child.childs, childIndex, item_id, unit, level+1,index)}
                </React.Fragment>
                )}
            </>
            )}

        </React.Fragment>
      );
    });
  };

  return (
    <Table className="min-w-full bg-white">
      <TableHeader>
        <TableRow>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Name</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Alloted</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Unit</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Finished</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">Reject</TableHead>
          <TableHead className="py-2 px-4 bg-gray-100 border-b">WIP</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {editedData.map((job, index) => (
          <React.Fragment key={`job-${index}`}>
            <TableRow key={`job-row-${index}-${level}-Parent`}>
              <TableCell
                className="py-2 px-4 border-b cursor-pointer text-violet-800 hover:underline"
                onClick={() => toggleProductDetails(index)}
              >
                {job.name}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {job.allocated}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {job.unit}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {toEdit ? (
                  <input
                    id={`job-row-${index}-${level}-Parent-Finished`}
                    type="number"
                    value={job.finished !== undefined ? job.finished : 0}
                    oldValue = {job.finished !== undefined ? job.finished : 0}
                    onChange={(e) => handleInputChange(index, 'finished', e.target.value,'Parent')}
                    className="w-full p-1 border"
                  />
                ) : (
                  job.finished !== undefined ? job.finished : 0
                )}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
              {toEdit ? (
                  <input
                  id={`job-row-${index}-${level}-Parent-Reject`}
                    type="number"
                    value={job.reject !== undefined ? job.reject : 0}
                    oldValue = {job.reject !== undefined ? job.reject : 0}
                    onChange={(e) => handleInputChange(index, 'reject', e.target.value,'Parent')}
                    className="w-full p-1 border"
                  />
                ) : (
                  job.reject !== undefined ? job.reject : 0
                )}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
              {toEdit ? (
                  <input
                  id={`job-row-${index}-${level}-Parent-Wip`}
                    type="number"
                    value={job.wip !== undefined ? job.wip : 0}
                    oldValue = {job.wip !== undefined ? job.wip : 0}
                    onChange={(e) => handleInputChange(index, 'wip', e.target.value ,'Parent')}
                    className="w-full p-1 border"
                  />
                ) : (
                  job.wip !== undefined ? job.wip : 0
                )}
              </TableCell>
            </TableRow>
            {expandedProducts[index] && (
              <React.Fragment>
                <TableRow key={`job-row-${index}-${level}-Adjustment`}>
                  <TableCell className="py-2 px-4 border-b">
                    {'>>'}{'Adjustment'}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {job.to_allot}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {job.unit}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {toEdit ? (
                      <input
                      id={`job-row-${index}-${level}-Adjustment-Finished`}
                        type="number"
                        value={job.finished !== undefined ? job.finished : 0}
                        oldValue = {job.finished !== undefined ? job.finished : 0}
                        onChange={(e) => handleInputChange(index, 'finished', e.target.value, 'Adjustment')}
                        className="w-full p-1 border"
                      />
                    ) : (
                      job.finished !== undefined ? job.finished : 0
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                  {toEdit ? (
                      <input
                      id={`job-row-${index}-${level}-Adjustment-Reject`}
                        type="number"
                        value={job.to_reject !== undefined ? job.to_reject : 0}
                        oldValue = {job.to_reject !== undefined ? job.to_reject : 0}
                        onChange={(e) => handleInputChange(index, 'to_reject', e.target.value , 'Adjustment')}
                        className="w-full p-1 border"
                      />
                    ) : (
                      job.to_reject !== undefined ? job.to_reject : 0
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                  {toEdit ? (
                      <input
                      id={`job-row-${index}-${level}-Adjustment-Wip`}
                        type="number"
                        value={job.to_wip !== undefined ? job.to_wip : 0}
                        oldValue = {job.to_wip !== undefined ? job.to_wip : 0}
                        onChange={(e) => handleInputChange(index, 'to_wip', e.target.value , 'Adjustment')}
                        className="w-full p-1 border"
                      />
                    ) : (
                      job.to_wip !== undefined ? job.to_wip : 0
                    )}
                  </TableCell>
                </TableRow>
                {job.childinfo && renderChildWorkstations(job.childinfo, index, job.item_id, job.unit, level+1,index)}
              </React.Fragment>
            )}
          </React.Fragment>
        ))}
      </TableBody>
    </Table>
  );
};

ExpandableProductTable.propTypes = {
  jobData: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    allocated: PropTypes.number.isRequired,
    unit: PropTypes.string.isRequired,
    to_allot: PropTypes.number.isRequired,
    finished: PropTypes.number, // Changed to non-required
    item_id: PropTypes.number.isRequired,
    childinfo: PropTypes.object // Assuming childinfo is an object
  })).isRequired,
  toEdit: PropTypes.bool.isRequired,
};

export default ExpandableProductTable;
