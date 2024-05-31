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
        const response = await fetch("/api/ListItems", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify({
                "filters": [],
                "filter_type": ""
            })
        });

        if (response.ok) {
            const result = await response.json();
            setData(result.items);
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
        "edit_ids[]": [editableRowData.id],
        "edit_codes[]": [editableRowData.code],
        "edit_names[]": [editableRowData.name],
        "edit_rates[]": [editableRowData.rate],
        "edit_units[]": [editableRowData.unit],
        "edit_hsn_codes[]": [editableRowData.hsn_code],
        "edit_cost_prices[]": [editableRowData.cost_price],
        "edit_sale_prices[]": [editableRowData.sale_price],
        "edit_taxes[]": [editableRowData.tax],
        "edit_bom_flags[]": [editableRowData.bom_flag],
        "edit_min_levels[]": [editableRowData.min_level],
        "edit_max_levels[]": [editableRowData.max_level]
    };
    console.log(rowIndex);

    try {
        let token = localStorage.getItem("usersdatatoken");
        const response = await fetch(`/api/edit_items`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
            },
            body: JSON.stringify(formattedData)
        });

        if (response.message === "Item aruni ka itm Changed!") {
            fetchData();
            handleEditClick(rowIndex); // Exit edit mode
        } else {
            const errorData = await response.json();
            alert((errorData.message));
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

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(
        value =>
            value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearch = () => {
    fetchData(searchTerm);
  };

  const columns = React.useMemo(() => [
    { "Header": "Registration Date", "accessor": "regdate" },
    { "Header": "Raw Flag", "accessor": "raw_flag" },
    { "Header": "Data ID", "accessor": "data_id" },
    { "Header": "Code", "accessor": "code" },
    { "Header": "Name", "accessor": "name" },
    { "Header": "Unit", "accessor": "unit" },
    { "Header": "ID", "accessor": "id" },
    { "Header": "Rate", "accessor": "rate" },
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
              className="px-4 py-2 border rounded-lg"
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
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.regdate}
                                  onChange={(e) => handleInputChange(e, 'regdate')}
                                />
                              ) : (
                                row.regdate
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.raw_flag}
                                  onChange={(e) => handleInputChange(e, 'raw_flag')}
                                />
                              ) : (
                                row.raw_flag
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.data_id}
                                  onChange={(e) => handleInputChange(e, 'data_id')}
                                />
                              ) : (
                                row.data_id
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.code}
                                  onChange={(e) => handleInputChange(e, 'code')}
                                />
                              ) : (
                                row.code
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.name}
                                  onChange={(e) => handleInputChange(e, 'name')}
                                />
                              ) : (
                                row.name
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.unit}
                                  onChange={(e) => handleInputChange(e, 'unit')}
                                />
                              ) : (
                                row.unit
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.id}
                                  onChange={(e) => handleInputChange(e, 'id')}
                                />
                              ) : (
                                row.id
                              )}
                            </TableCell>
                            <TableCell className="font-medium w-[100px]">
                              {editModes[row.id] ? (
                                <input
                                  type="text"
                                  value={editableRowData.rate}
                                  onChange={(e) => handleInputChange(e, 'rate')}
                                />
                              ) : (
                                row.rate
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

