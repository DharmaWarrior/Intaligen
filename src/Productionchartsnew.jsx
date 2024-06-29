
import React ,{useState, useEffect} from 'react'
import Chart from './Chart';

export default function Productionchartsnew() {
  const [charts, setCharts] = React.useState([]);
  const [ordersData, setOrdersData] = React.useState({});
  const [loading, setLoading] = useState(true);
  const [categories , setCategories] = useState([]);

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
          setCharts(result.data);
          setOrdersData(result.ORDERS);
          setCategories(result.categories);
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
    }, []);

  return (
    <div className="flex">
      <div className=" h-[100%] w-full flex flex-row  py-2">
          <Chart
              charts={charts}
              ordersData={ordersData}
              categories={categories}
          />
      </div>
  </div>
  )
}