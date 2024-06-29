import Header from "./components/Header";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { React, useEffect, useContext, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";
import Login from "./components/Login";
import Register from "./components/Register";
import Labors from "./Labors";
import Dashboard from "./components/Dashboard";
import MasterDataDashboard from "./components/MasterDataDashboard";
import Items from "./Items";
import ProductInfo from "./ProductInfo";
import Categories from "./Categories";
import Productionchartsnew from "./Productionchartsnew";
import Partners from "./Partners";
import Materialplanning from "./Materialplanning";
import Purchases from "./Purchases";
import Admin from "./Admin";
import Orders from "./Orders";
import Flow from "./ProductionDept";
import DetailsPage from "./components/DetailsPage";
import { TooltipProvider } from "./../components/ui/tooltip";
import Sidebar from "./components/Sidebar";
import { AuthProvider } from "./components/ContextProvider/Authcontext";
import PrivateRoute from './components/PrivateRoute';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from './../components/ui/resizable';
import Cookies from "js-cookie"; // Import js-cookie
import Inventory from "./Inventory";

export default function App() {

  const [data, setData] = useState(false);
  const location = useLocation(); // Get the current location

  // Retrieve layout and collapsed state from cookies
  const layout = Cookies.get("react-resizable-panels:layout");
  const collapsed = Cookies.get("react-resizable-panels:collapsed");
  
  const defaultLayout = layout ? (JSON.parse(layout) || undefined) : undefined;
  const defaultCollapsed = collapsed ? JSON.parse(collapsed) : undefined;

  useEffect(() => {
    setTimeout(() => {
      setData(true);
    }, 100);
  }, []);

  return (
    <div className="flex h-screen">
      <AuthProvider>
      <TooltipProvider>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes) => {
            Cookies.set("react-resizable-panels:layout", JSON.stringify(sizes));
          }}
          className="h-full max-h-[800px] items-stretch"
        >
          {location.pathname !== '/' && location.pathname !== '/register' && (
            <>
              <Sidebar
                defaultLayout={defaultLayout}
                defaultCollapsed={defaultCollapsed}
                navCollapsedSize={4}
              />
              <ResizableHandle withHandle className="custom-resizable-handle"/>
            </>
          )}
          <ResizablePanel>
            <div className="flex flex-col flex-grow">
              {data ? (
                
                  <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<PrivateRoute />}>
                      <Route path="/labors" element={<Labors />} />
                      <Route path="/dash" element={<Dashboard />} />
                      <Route path="/masterDataDashboard" element={<MasterDataDashboard />} />
                      <Route path="*" element={<Error />} />
                      <Route path="/items" element={<Items />} />
                      <Route path="/product/:id" element={<ProductInfo />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/partners" element={<Partners />} />
                      <Route path="/orders" element={<Orders />} />
                      <Route path="/workstation_console" element={<Flow />} />
                      <Route path="/details" element={<DetailsPage />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/productionchartsnew" element={<Productionchartsnew />} />
                      <Route path="/material-planning" element={<Materialplanning />} />
                      <Route path="/purchases" element={<Purchases />} />
                      <Route path="/admin" element={<Admin />} />
                    </Route>
                  </Routes>
                
              ) : (
                <div className="flex justify-center items-center flex-col flex-grow">
                  Loading...
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-900"></div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
      </AuthProvider>
    </div>
  );
}
