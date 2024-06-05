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
  } from "./../../components/ui/table"
import { LoginContext } from './ContextProvider/Context';
import { FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import { Link } from 'react-router-dom';

  



export default function TableItemss() {

  

  const { logindata } = React.useContext(LoginContext);
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [editModes, setEditModes] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [editableRowData, setEditableRowData] = React.useState({});
  const [searchTerm, setSearchTerm] = React.useState('');

  const fetchData = async () => {
    try {
        let token = localStorage.getItem("usersdatatoken");
        const response = await fetch("/api/labors", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
        });

        if (response.ok) {
            const result = await response.json();
            setData(result.labors);
            setLoading(false);
        } else {
            alert('Failed to fetch data');
            setLoading(false);
        }
    } catch (error) {
        alert('Error fetching data: ' + error);
        setLoading(false);
    }
  };  

  React.useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (rowIndex) => {
    setEditModes(prevEditModes => ({
      ...prevEditModes,
      [rowIndex]: !prevEditModes[rowIndex]
    }));
    
    if (!editModes[rowIndex]) {
      const rowData = data.find(row => row.id === rowIndex);
      setEditableRowData(rowData);
    } else {
      setEditableRowData({});
    }
  };  

  const handleSaveClick = async (rowIndex) => {
    const formattedData = {
        "edit_ids[]": [`${editableRowData.id}`],
        "edit_names[]": [editableRowData.name],
        "edit_salaries[]": [`${editableRowData.salary}`],
        "edit_codes[]": [editableRowData.code]
    };
    console.log(formattedData);

    try {
        let token = localStorage.getItem("usersdatatoken");
        const response = await fetch(`/api/editlabor`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(formattedData)
        });

        if (response.status === 302) {
          setData((prevData) => {
            return prevData.map((item) =>
              item.id === editableRowData.id ? { ...editableRowData } : item
            );
          });
          handleEditClick(rowIndex); // Exit edit mode

        } else {
            const errorData = await response.json();
            alert("Error" + (errorData.message));
        }
    } catch (error) {
        alert('Error updating data: ' + error);
    }
  };

  const handleCancelClick = (rowIndex) => {
    handleEditClick(rowIndex); // Exit edit mode without saving
  };

  const handleInputChange = (e, key) => {
    setEditableRowData({
      ...editableRowData,
      [key]: e.target.value
    });
  };

  

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    fetchData(searchTerm);
  };

  const columns = React.useMemo(() => [
    { "Header": "Salary", "accessor": "salary" },
    { "Header": "Status", "accessor": "status" },
    { "Header": "Code", "accessor": "code" },
    { "Header": "Name", "accessor": "name" },
    { "Header": "Contract_Mode", "accessor": "contract_mode" },
    { "Header": "gender", "accessor": "gender" },
    { "Header": "regdate", "accessor": "regdate" },
    {
      "Header": "Edit",
      // "Cell": ({ row }) => (
      //   <div className="flex items-center">
      //     {editModes[row.index] ? (
      //       <>
      //         <FaCheck className="text-green-500 mr-2 cursor-pointer" onClick={() => handleEditClick(row.index)} />
      //         <FaTimes className="text-red-500 cursor-pointer" onClick={() => handleEditClick(row.index)} />
      //       </>
      //     ) : (
      //       <FaPencilAlt className="cursor-pointer" onClick={() => handleEditClick(row.index)} />
      //     )}
      //   </div>
      // )
    }
  ], [editModes]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="mt-2 flex flex-col">
        <div className="mb-4">
          <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearchInputChange}
              className="px-4 py-1.5 mr-4 border rounded-lg"
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>
          <div className="-my-2 overflow-x-auto -mx-4 sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                      <Table>
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
                            <TableCell className="font-medium w-[100px]">
                            {row.salary}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <select
                                  className="border-2 border-blue-500"
                                  value={editableRowData.status}
                                  onChange={(e) => handleInputChange(e, 'raw_flag')}
                                >
                                  <option value="Active">Active</option>
                                  <option value="Not-Active">Not-Active</option>
                                </select>
                              ) : (
                                row.status
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  className="border-2 border-blue-500 w-15"
                                  type="text"
                                  value={editableRowData.code}
                                  onChange={(e) => handleInputChange(e, 'code')}
                                />
                              ) : (
                                <Link to={`/product/${row.id}`} className="text-blue-500 hover:underline">
                                  {row.code}
                                </Link>
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  className="border-2 border-blue-500"
                                  type="text"
                                  value={editableRowData.name}
                                  onChange={(e) => handleInputChange(e, 'name')}
                                />
                              ) : (
                                <Link to={`/product/${row.id}`} className="text-blue-500 hover:underline">
                                  {row.name}
                                </Link>
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  className="border-2 border-blue-500"
                                  type="text"
                                  value={editableRowData.contract_mode}
                                  onChange={(e) => handleInputChange(e, 'contract_mode')}
                                />
                              ) : (
                                row.contract_mode
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  className="border-2 border-blue-500"
                                  type="text"
                                  value={editableRowData.gender}
                                  onChange={(e) => handleInputChange(e, 'gender')}
                                />
                              ) : (
                                row.gender
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  className="border-2 border-blue-500"
                                  type="text"
                                  value={editableRowData.regdate}
                                  onChange={(e) => handleInputChange(e, 'regdate')}
                                />
                              ) : (
                                row.regdate
                              )}
                            </TableCell>
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
                      </Table>
                  </div>
              </div>
          </div>
      </div>
      
    </>
  );
}

