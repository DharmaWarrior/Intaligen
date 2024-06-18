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

  const toggleProductDetails = (index) => {
    setExpandedProducts((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const toggleChildProductDetails = (parentIndex, childIndex) => {
    const key = `${parentIndex}-${childIndex}`;
    setExpandedProducts((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (index, field, value) => {
    const updatedData = [...editedData];
    updatedData[index][field] = value;
    setEditedData(updatedData);
  };

  const getQtyAllotForItemId = (jobs, itemId) => {
    const job = jobs.find(job => job.item_id === parseInt(itemId, 10));
    return job ? job.qty_allot : 0;
  };

  const renderChildWorkstations = (children, parentIndex, item_id, unit) => {
    console.log(children);
    return Object.keys(children).map((key) => {
      const child = children[key];
      const childIndex = `${parentIndex}-${key}`;
      return (
        <React.Fragment key={`child-${childIndex}`}>
          {child.totals[item_id] && (
            <>
                <TableRow key={`child-row-${childIndex}`} className='bg-gray-200'>
                <TableCell
                    className="py-2 px-4 border-b cursor-pointer text-red-800 hover:underline"
                    onClick={() => toggleChildProductDetails(parentIndex, key)}
                >
                    {'>>'}{child.workstation.name}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                    {toEdit ? (
                    <input
                        type="number"
                        value={child.totals[item_id] ? child.totals[item_id] : 0}
                        onChange={(e) => handleInputChange(parentIndex, `children[${key}].allocated`, e.target.value)}
                        className="w-full p-1 border"
                    />
                    ) : (
                    child.totals[item_id] ? child.totals[item_id] : 0
                    )}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">
                    {toEdit ? (
                    <input
                        type="text"
                        value={unit}
                        onChange={(e) => handleInputChange(parentIndex, `children[${key}].unit`, e.target.value)}
                        className="w-full p-1 border"
                    />
                    ) : (
                    unit
                    )}
                </TableCell>
                <TableCell className="py-2 px-4 border-b">0</TableCell>
                </TableRow>
                {expandedProducts[childIndex] && (
                <React.Fragment>
                    <TableRow key={`child-details-${childIndex}`}>
                    <TableCell className="py-2 px-4 border-b">
                        {'>>'}{'Adjustment'}
                    </TableCell>
                    <TableCell className="py-2 px-4 border-b">
                        {toEdit ? (
                        <input
                            type="number"
                            value={getQtyAllotForItemId(child.jobs, item_id)}
                            onChange={(e) => handleInputChange(parentIndex, `children[${key}].to_allot`, e.target.value)}
                            className="w-full p-1 border"
                        />
                        ) : (
                        getQtyAllotForItemId(child.jobs, item_id)
                        )}
                    </TableCell>
                    <TableCell className="py-2 px-4 border-b">
                        {toEdit ? (
                        <input
                            type="text"
                            value={unit}
                            onChange={(e) => handleInputChange(parentIndex, `children[${key}].unit`, e.target.value)}
                            className="w-full p-1 border"
                        />
                        ) : (
                        unit
                        )}
                    </TableCell>
                    <TableCell className="py-2 px-4 border-b">0</TableCell>
                    </TableRow>
                    {child.childs && renderChildWorkstations(child.childs, childIndex, item_id, unit)}
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {editedData.map((job, index) => (
          <React.Fragment key={`job-${index}`}>
            <TableRow key={`job-row-${index}`}>
              <TableCell
                className="py-2 px-4 border-b cursor-pointer text-violet-800 hover:underline"
                onClick={() => toggleProductDetails(index)}
              >
                {job.name}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {toEdit ? (
                  <input
                    type="number"
                    value={job.allocated}
                    onChange={(e) => handleInputChange(index, 'allocated', e.target.value)}
                    className="w-full p-1 border"
                  />
                ) : (
                  job.allocated
                )}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">
                {toEdit ? (
                  <input
                    type="text"
                    value={job.unit}
                    onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                    className="w-full p-1 border"
                  />
                ) : (
                  job.unit
                )}
              </TableCell>
              <TableCell className="py-2 px-4 border-b">0</TableCell>
            </TableRow>
            {expandedProducts[index] && (
              <React.Fragment>
                <TableRow key={`job-details-${index}`}>
                  <TableCell className="py-2 px-4 border-b">
                    {'>>'}{'Adjustment'}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {toEdit ? (
                      <input
                        type="number"
                        value={job.to_allot}
                        onChange={(e) => handleInputChange(index, 'to_allot', e.target.value)}
                        className="w-full p-1 border"
                      />
                    ) : (
                      job.to_allot
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">
                    {toEdit ? (
                      <input
                        type="text"
                        value={job.unit}
                        onChange={(e) => handleInputChange(index, 'unit', e.target.value)}
                        className="w-full p-1 border"
                      />
                    ) : (
                      job.unit
                    )}
                  </TableCell>
                  <TableCell className="py-2 px-4 border-b">0</TableCell>
                </TableRow>
                {job.childinfo && renderChildWorkstations(job.childinfo, index,job.item_id,job.unit)}
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
    childs: PropTypes.objectOf(PropTypes.shape({
      workstation: PropTypes.shape({
        name: PropTypes.string.isRequired
      }).isRequired,
      allocated: PropTypes.number,
      unit: PropTypes.string,
      to_allot: PropTypes.number,
      childs: PropTypes.object,
    }))
  })).isRequired,
  toEdit: PropTypes.bool,
};

ExpandableProductTable.defaultProps = {
  toEdit: false,
};

export default ExpandableProductTable;
