import React from "react";
import Sidebar from "./Sidebar";
import Mastercard from "./Mastercard";

export default function MasterDataDashboard()  {

    return (
        <div className="flex">
            
            <div className=" h-[100%] w-full overflow-y-auto flex flex-row  py-4 px-3 justify-center">
                <Mastercard name="Items" imageSrc="items.png" route="/items" />
                <Mastercard name="Resources" imageSrc="resources.png" route="/labors" />
                <Mastercard name="Business P.." imageSrc="partners.png" route="/partners" />
                <Mastercard name="Categories" imageSrc="categories.png" route="/categories" />
            </div>
        </div>
    );
}

