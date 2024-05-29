import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "./components/Sidebar";

import { LoginContext } from './components/ContextProvider/Context';
import { FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import ImportIcon from '@mui/icons-material/ImportExport';
import PlusIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import AddItemForm from './components/AddItemForm';
import { toast } from 'react-toastify';

export default function Items() {
    const { logindata } = useContext(LoginContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModes, setEditModes] = useState({});
    const [open, setOpen] = useState(false);
  
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("usersdatatoken");
        console.log(token);
        const response = await fetch("/ListItems", {
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
          console.error('Failed to fetch data');
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const handleEditClick = (rowIndex) => {
      setEditModes(prevEditModes => ({
        ...prevEditModes,
        [rowIndex]: !prevEditModes[rowIndex]
      }));
    };
  
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleFormSubmit = async (formData) => {
      try {
        const response = await fetch("/AddItem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("usersdatatoken"),
          },
          body: JSON.stringify({
            "p_code": formData.code,
            "p_name": formData.itemName,
            "p_rate": formData.jobRate,
            "p_unit": formData.fundamentalUnit,
            "p_flag": formData.bom ? "YES" : "NO",
            "pf_cost_price": formData.costPrice,
            "pf_sale_price": formData.salePrice,
            "pf_tax": formData.taxPercentage,
            "pf_hsn": formData.hsnCode
          })
        });
        const res = await response.json();
        if (res.message === "iteminfo") {
          toast.success("Item added.", { position: "top-center" });
          fetchData(); // Re-fetch the data to update the list
        } else {
          toast.info(res.message, { position: "top-center" });
        }
      } catch (error) {
        toast.error("Error!!", { position: "top-center" });
      }
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
        "Cell": ({ row }) => (
          <div className="flex items-center">
            {editModes[row.index] ? (
              <>
                <FaCheck className="text-green-500 mr-2 cursor-pointer" onClick={() => handleEditClick(row.index)} />
                <FaTimes className="text-red-500 cursor-pointer" onClick={() => handleEditClick(row.index)} />
              </>
            ) : (
              <FaPencilAlt className="cursor-pointer" onClick={() => handleEditClick(row.index)} />
            )}
          </div>
        )
      }
    ], [editModes]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="w-full h-[90vh] mt-0 flex flex-col">
        <Sidebar />
        <div className="h-[90%] overflow-y-auto absolute right-0 w-[80%] px-10 py-10">
          <div className='flex flex-row'>
            <h1 className='text-4xl font-sans'>LIST OF ITEMS</h1>
            <div className='absolute right-10'>
              <Tooltip title="Add new item">
                <IconButton onClick={handleClickOpen}>
                  <PlusIcon className='text-custom-green' fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add new item">
                <IconButton>
                  <ImportIcon className='text-custom-green' fontSize="large" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Add new item">
                <IconButton>
                  <ImportIcon className='text-custom-green' fontSize="large" />
                </IconButton>
              </Tooltip>
            </div>
          </div>
          {/* <div className="ml-15 flex flex-col mt-5">
            <Tableitems columns={columns} data={data} />
          </div> */}
        </div>
  
        <AddItemForm open={open} handleClose={handleClose} handleFormSubmit={handleFormSubmit} fetchData={fetchData} />
      </div>
    );
  }