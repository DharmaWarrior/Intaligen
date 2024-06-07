import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Mail from './Mail';
import { accounts, mails } from './data/mails';




export default function Orders() {

    const [ordersData, setOrdersData] = useState({});


    const fetchOrders = async () => {

    

        try {
            let token = localStorage.getItem("usersdatatoken");
            if(!token) {
              console.log("Token not found");
            }
            
            const response = await fetch("/api/getorder?show_flag=Active", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token,
              },
            });
      
            if (response.status === 200) {
            
              const result = await response.json();
              console.log('my data',result);
              setOrdersData(result);
              console.log('my orders',ordersData);
              
            } else {
              console.error('Failed to fetch data');
            }
          } catch (error) {
            console.error('Error fetching data:', error);
          }
    };
    
    useEffect(() => {  
        fetchOrders();
    }, []);

    useEffect(() => {
        console.log('Orders data updated:', ordersData);
      }, [ordersData]);


    return (
        <div className="w-full h-[90vh] flex">
            <div className="w-[20%]">
                <Sidebar />
            </div>
            <div className="w-[80%] h-[90%] overflow-y-auto flex flex-row flex-wrap  py-2">
                <Mail 
                    mails={mails} 
                    defaultLayout = {[265, 440, 655]}
                    ordersData={ordersData}   />
            </div>
        </div>
    );
}

