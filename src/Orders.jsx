import React, { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Mail from './Mail';
import { accounts, mails } from './data/mails';

export default function Orders() {
    const [ordersData, setOrdersData] = useState({});
    const [currentStatus, setCurrentStatus] = useState("Active");

    const fetchOrders = async (status) => {
        try {
            let token = localStorage.getItem("usersdatatoken");
            if(!token) {
                console.log("Token not found");
                return;
            }

            const response = await fetch(`/api/getorder?show_flag=${status}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token,
                },
            });

            if (response.status === 200) {
                const result = await response.json();
                console.log('Fetched data:', result);
                setOrdersData(result);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchOrders(currentStatus);
    }, [currentStatus]);

    const handleStatusChange = (status) => {
        setCurrentStatus(status);
    };

    return (
        <div className="w-full h-[90vh] flex">
            <div className="w-[20%]">
                <Sidebar />
            </div>
            <div className="w-[80%] h-[90%] overflow-y-auto flex flex-row flex-wrap py-2">
                <Mail
                    mails={mails}
                    defaultLayout={[265, 440, 655]}
                    ordersData={ordersData}
                    onStatusChange={handleStatusChange}
                    currentStatus={currentStatus}
                />
            </div>
        </div>
    );
}
