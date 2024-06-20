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

    const EditdataApi = async (editableRowData) => {
      
      const formattedData = {
          "edit_ids[]": [`${editableRowData.id}`],
          "edit_codes[]": [`${editableRowData.code}`],
          "edit_names[]": [editableRowData.name],
          "edit_rates[]": [`${editableRowData.rate}`],
          "edit_units[]": [editableRowData.unit],
          "edit_hsn_codes[]": ["xya"],
          "edit_cost_prices[]": ["506"],
          "edit_sale_prices[]": ["58"],
          "edit_taxes[]": ["11"],
          "edit_bom_flags[]": ["NO"],
          "edit_min_levels[]": ["0"],
          "edit_max_levels[]": ["0"]
      };
      console.log(formattedData);
  
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
  
          if (response.status === 302) {
            setData((prevData) => {
              return prevData.map((item) =>
                item.id === editableRowData.id ? { ...editableRowData } : item
              );
            });
            // handleEditClick(rowIndex); // Exit edit mode
  
          } else {
              const errorData = await response.json();
              alert("Error" + (errorData.message));
          }
      } catch (error) {
          alert('Error updating data: ' + error);
      }
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
        
        const response = await fetch("/api/searchitem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
          body: JSON.stringify({
            "name": `${searchTerm}`
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
    }

    const columns = React.useMemo(() => [
      { "Header": "Code", "accessor": "code" , "type": "link" , "url": "/product/" , "url_append": `id`, "editable" : "true"},
      { "Header": "Name", "accessor": "name" , "type": "link" , "url": "/product/" , "url_append": `id`, "editable" : "true"},
      { "Header": "Unit", "accessor": "unit" , "type": "text" , "editable" : "true"},
      { "Header": "Rate", "accessor": "rate" , "type": "number" , "editable" : "true"},
      { "Header": "Registration Date", "accessor": "regdate" , "type": "string" , "editable" : "false"},
      { "Header": "Raw Flag", "accessor": "raw_flag" , "type": "select", "options": [{"name": "YES", "value": "YES"}, {"name": "NO", "value": "NO"}] , "editable" : "true"},
    ], [editModes]);

    const itemFields = [
      { name: 'itemName', label: 'Item Name *', type: 'text', required: true },
      { name: 'jobRate', label: 'Job Rate', type: 'text' },
      { name: 'code', label: 'Code', type: 'text' },
      { name: 'costPrice', label: 'Cost Price', type: 'number' },
      { name: 'fundamentalUnit', label: 'Fundamental Unit *', type: 'text', required: true },
      { name: 'salePrice', label: 'Sale Price', type: 'number' },
      { name: 'taxPercentage', label: 'Tax Percentage', type: 'number' },
      { name: 'hsnCode', label: 'HSN Code', type: 'text' },
      { name: 'bom', label: 'BOM', type: 'checkbox', fullWidth: true },
    ];
  
    return (
      <div className="w-full h-[90vh] mt-0 flex flex-col">
        <div className="h-[90%] overflow-y-auto absolute right-0 w-[80%] px-10 py-10">
          <div className='flex flex-row'>
            <h1 className='text-4xl font-sans'>LIST OF ITEMS</h1>
            <div className='absolute right-10'>
              <Tooltip title="Add new item">
                <IconButton onClick={() => handleOpen('item')}>
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
            <MasterTable columns={columns} data={data} setData={setData} fetchSearch={fetchSearch} EditdataApi={EditdataApi}/>
          </div>
        </div>
  
        {formType === 'item' && (
        <AddForm
          open={open}
          handleClose={handleClose}
          handleFormSubmit={handleFormSubmit}
          fetchData={fetchData}
          formFields={itemFields}
          title="Add New Item"
        />
      )}
      </div>
    );
  }