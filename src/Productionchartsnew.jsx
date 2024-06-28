
import React ,{useState, useEffect} from 'react'
import Mail2 from './Mail2';

export default function Productionchartsnew() {
  const [mails, setMails] = React.useState([]);
  const [ordersData, setOrdersData] = React.useState({});
  const [loading, setLoading] = useState(true);

  const fetchCharts = async () => {
      try {
        let token = localStorage.getItem("usersdatatoken");
        if(!token) {
          console.log("Token not found");
        }
        
        const response = await fetch("/api/productionchartsnew", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token,
          },
        });
  
        if (response.ok) {
          const result = await response.json();
          setMails(result.data);
          setOrdersData(result.ORDERS);
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
      fetchCharts();
      // fetchData();
    }, []);

  return (
    <div className="flex">
      <div className=" h-[100%] w-full flex flex-row  py-2">
          <Mail2
              mails={mails}
              ordersData={ordersData}
          />
      </div>
  </div>
  )
}