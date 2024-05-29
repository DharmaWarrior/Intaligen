import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SidebarData() {

    const navigate = useNavigate();

    return (
        <div className=''>
            <div className='text-[1rem] text-white'>Raqgen Solutions Pvt. Ltd.</div>
            <hr className='mt-5 mb-5'></hr>
            {datas.map(data => {
                return (
                    <div 
                        key={data.id} 
                        className='sidebar left-4 bottom-4 flex items-center cursor-pointer' 
                        onClick={() => navigate(data.route)}
                    >
                        <div className='mr-5 text-[1.3rem] text-brown'>{data.icon}</div>
                        <div className='text-[0.9rem] text-white whitespace-normal mr-2'>{data.text}</div>
                    </div>
                );
            })}
        </div>
    );
}