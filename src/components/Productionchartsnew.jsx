import React from "react";
import Sidebar from "./Sidebar";
import Mastercard from "./Mastercard";

export default function Productionchartsnew()  {

    return (
        <div className="w-full h-[90vh] flex">
            <div className="w-[20%]">
                <Sidebar />
            </div>
            <div className="w-[80%] h-[90%] overflow-y-auto flex flex-row flex-wrap px-10 py-10">
                <Mastercard name="Items" imageSrc="items.png" route="/items" />
                <Mastercard name="Resources" imageSrc="resources.png" route="/labors" />
                <Mastercard name="Business P.." imageSrc="partners.png" route="/partners" />
                <Mastercard name="Categories" imageSrc="categories.png" route="/categories" />
            </div>
        </div>
    );
}

