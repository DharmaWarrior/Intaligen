import React from 'react';
import { Button } from './../../components/ui/button';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "./../../components/ui/table";
import { LoginContext } from './ContextProvider/Context';
import { FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { ScrollArea } from './../../components/ui/scroll-area';
import Filter from './Filter';

export default function TableItemss({ columns, data, setData, fetchSearch, EditdataApi, addbutton }) {
  const { logindata } = React.useContext(LoginContext);
  const [loading, setLoading] = React.useState(true);
  const [editModes, setEditModes] = React.useState({});
  const [editableRowData, setEditableRowData] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleEditClick = (rowIndex) => {
    setEditModes(prevEditModes => ({
      ...prevEditModes,
      [rowIndex]: !prevEditModes[rowIndex]
    }));

    if (!editModes[rowIndex]) {
      const rowData = data.find(row => row.id === rowIndex);
      setEditableRowData(prevEditableRowData => ({
        ...prevEditableRowData,
        [rowIndex]: rowData
      }));
    } else {
      setEditableRowData(prevEditableRowData => {
        const newEditableRowData = { ...prevEditableRowData };
        delete newEditableRowData[rowIndex];
        return newEditableRowData;
      });
    }
  };

  const handleSaveClick = async (rowIndex) => {
    EditdataApi(editableRowData[rowIndex]);
    handleEditClick(rowIndex); // Exit edit mode after saving
  };

  const handleCancelClick = (rowIndex) => {
    handleEditClick(rowIndex); // Exit edit mode without saving
  };

  const handleInputChange = (e, rowIndex, key) => {
    setEditableRowData(prevEditableRowData => ({
      ...prevEditableRowData,
      [rowIndex]: {
        ...prevEditableRowData[rowIndex],
        [key]: e.target.value
      }
    }));
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    fetchSearch(searchTerm);
  };

  return (
    <>
      <div className="mt-2 flex flex-col">
        <div className="mb-4 flex gap-2">
          <Filter />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            className="px-4 py-1.5 border rounded-lg"
          />
          <Button onClick={handleSearch} variant="ghost">Search</Button>
          
          {addbutton ? (addbutton.map((button) => (
            <Button key={button.Header}>{button.Header}</Button>
          ))) : (null)}
        </div>
        <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <Table>
                <ScrollArea className="h-[72vh]">
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead className="w-[100px]" key={column.Header}>{column.Header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={row.id}>
                        {columns.map((column) => (
                          <TableCell className="font-medium w-[100px]" key={column.header}>
                            {editModes[row.id] ? (
                              column.type === "select" ? (
                                <select
                                  className={` w-15 ${column.editable === "false" ? '' : 'border-2 border-blue-500'}`}
                                  value={editableRowData[row.id][column.accessor]}
                                  onChange={(e) => handleInputChange(e, row.id, column.accessor)}
                                >
                                  {column.options.map((option) => (
                                    <option key={option.name} value={option.value}>
                                      {option.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  disabled={column.editable === "false"}
                                  className={` w-15 ${column.editable === "false" ? '' : 'border-2 border-blue-500'}`}
                                  type={column.type}
                                  value={editableRowData[row.id][column.accessor]}
                                  onChange={(e) => handleInputChange(e, row.id, column.accessor)}
                                />
                              )
                            ) : (
                              column.type === "link" ? (
                                <Link to={`${column.url}${row[column.url_append]}`} className="text-blue-500 hover:underline">
                                  {row[column.accessor]}
                                </Link>
                              ) : (
                                row[column.accessor] || row[column.accessor] === 0 ? row[column.accessor] : "NA"
                              )
                            )}
                          </TableCell>
                        ))}
                        <TableCell className="font-medium w-[100px]">
                          <div className="flex items-center">
                            {editModes[row.id] ? (
                              <>
                                <FaCheck
                                  className="text-green-500 mr-2 cursor-pointer"
                                  onClick={() => handleSaveClick(row.id)}
                                />
                                <FaTimes
                                  className="text-red-500 cursor-pointer"
                                  onClick={() => handleCancelClick(row.id)}
                                />
                              </>
                            ) : (
                              <FaPencilAlt
                                className="cursor-pointer"
                                onClick={() => handleEditClick(row.id)}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ScrollArea>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
