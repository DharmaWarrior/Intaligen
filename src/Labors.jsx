import React, { useState, useEffect, useContext } from 'react';
import Sidebar from "./components/Sidebar";
import { LoginContext } from './components/ContextProvider/Context';
import { FaPencilAlt, FaCheck, FaTimes } from 'react-icons/fa';
import ImportIcon from '@mui/icons-material/ImportExport';
import PlusIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { toast } from 'react-toastify';
import MasterTable from './components/MasterTable';
import AddForm from './components/AddForm';

export default function Items() {
    const { logindata } = useContext(LoginContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editModes, setEditModes] = useState({});
    const [open, setOpen] = useState(false);
    const [formType, setFormType] = useState('');
  
    const fetchData = async () => {
      try {
        let token = localStorage.getItem("usersdatatoken");
        if(!token) {
          console.log("Token not found");
        }
        
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
          // console.log(data);
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
  
    const handleOpen = (type) => {
      setFormType(type);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    const handleFormSubmit = async (formData) => {
      try {
        const response = await fetch("/api/AddItem", {
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
    

    const fetchSearch = async (searchTerm) => {
      try {
        let token = localStorage.getItem("usersdatatoken");
        if(!token) {
          console.log("Token not found");
        }
        
        const response = await fetch("/api/labors/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({
            "name": `${searchTerm}`,
          })
        });
  
        if (response.status === 200) {
          const result = await response.json();
          setData(result);
          setLoading(false);
        } else {
          alert('Failed to fetch data');
          setLoading(false);
        }
      } catch (error) {
        alert('Error fetching data: ' + error);
        setLoading(false);
      }
      console.log(searchTerm);
    }

    const columns = React.useMemo(() => [
      { "Header": "Salary", "accessor": "salary" , "type": "text" , "url": "/product/" , "url_append": `id`, "editable" : "true"},
      { "Header": "Status", "accessor": "status" , "type": "text" , "url": "/product/" , "url_append": `id`, "editable" : "true"},
      { "Header": "Code", "accessor": "code" , "type": "link" , "editable" : "true"},
      { "Header": "Name", "accessor": "name" , "type": "link" , "editable" : "true"},
      { "Header": "regdate", "accessor": "contract_mode" , "type": "number" , "editable" : "true"},
      { "Header": "Contract_Mode", "accessor": "regdate" , "type": "string" , "editable" : "true"},
      { "Header": "Gender", "accessor": "raw_flag" , "type": "select", "options": [{"name": "YES", "value": "YES"}, {"name": "NO", "value": "NO"}] , "editable" : "true"},
    ], [editModes]);

    const laborFields = [
      { name: 'Labor_Name', label: 'Labor Name *', type: 'text', required: true },
      { name: 'Labor_Salary', label: 'Labor Salary', type: 'text' },
      { name: 'Labor_Code', label: 'Labor Code', type: 'text' },
      { name: 'Labor_Type', label: 'Labor Type', type: 'text' },
    ];
  
    return (
      <div className="w-full h-[90vh] mt-0 flex flex-col">
        <Sidebar />
        <div className="h-[90%] overflow-y-auto absolute right-0 w-[80%] px-10 py-10">
          <div className='flex flex-row'>
            <h1 className='text-4xl font-sans'>LIST OF LABOURS</h1>
            <div className='absolute right-10'>
              <Tooltip title="Add new item">
                <IconButton onClick={() => handleOpen('labor')}>
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
          <div className="ml-15 flex flex-col mt-5">
            <MasterTable columns={columns} data={data} setData={setData} fetchSearch={fetchSearch}/>
          </div>
        </div>
  
        {formType === 'labor' && (
        <AddForm
          open={open}
          handleClose={handleClose}
          handleFormSubmit={handleFormSubmit}
          fetchData={fetchData}
          formFields={laborFields}
          title="Add New Labor"
        />
      )}
      </div>
    );
  }