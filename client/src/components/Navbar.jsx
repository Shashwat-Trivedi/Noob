import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { createThirdwebClient } from "thirdweb";

import { useStateContext } from '../context';
import { CustomButton } from './';
import { logo, menu, search, thirdweb } from '../assets';
import { navlinks } from '../constants';
import Connectbutton from './Connectbutton';

const client = createThirdwebClient({ clientId : "07baf930ed674143787a0996a7bd15d7"});

const Navbar = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState('dashboard');
  const [toggleDrawer, setToggleDrawer] = useState(false);

  // 🔹 Added search state
  const [searchQuery, setSearchQuery] = useState("");

  // 🔹 Using context
  const { address, connectWallet, campaigns, setFilteredCampaigns } = useStateContext();

  const handleConnect = async () => {
    try {
      await connectWallet("injected");
      console.log("Wallet connected:", address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  // 🔹 Live Search Handler
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredCampaigns(campaigns); // reset if empty
      return;
    }
    const filtered = campaigns.filter((c) =>
      c.title.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCampaigns(filtered);
    navigate("/"); // redirect to dashboard
  };

  return (
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
      {/* 🔹 Search Box */}
      <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)} // 🔹 Live Search
          placeholder="Search for campaigns" 
          className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none" 
        />
        
        <div 
          className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer"
          onClick={() => handleSearch(searchQuery)} // 🔹 Optional button click
        >
          <img src={search} alt="search" className="w-[15px] h-[15px] object-contain"/>
        </div>
      </div>

      {/* <Connectbutton /> */}

      <div className="sm:flex hidden flex-row justify-end gap-4">
        {address?
        <CustomButton 
          btnType="button"
          title={address ? 'Create a charity' : 'Connect'}
          styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
          handleClick={() => {
            if(address) navigate('create-campaign')
            else handleConnect()
          }}
        />:<Connectbutton />}

        <Link to="/profile">
          <div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={thirdweb} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>
        </Link>
      </div>

      {/* Small screen navigation */}
      <div className="sm:hidden flex justify-between items-center relative">
        <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img src={logo} alt="user" className="w-[60%] h-[60%] object-contain" />
          </div>

          <img 
            src={menu}
            alt="menu"
            className="w-[34px] h-[34px] object-contain cursor-pointer"
            onClick={() => setToggleDrawer((prev) => !prev)}
          />

          <div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
            <ul className="mb-4">
              {navlinks.map((link) => (
                <li
                  key={link.name}
                  className={`flex p-4 ${isActive === link.name && 'bg-[#3a3a43]'}`}
                  onClick={() => {
                    setIsActive(link.name);
                    setToggleDrawer(false);
                    navigate(link.link);
                  }}
                >
                  <img 
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-[24px] h-[24px] object-contain ${isActive === link.name ? 'grayscale-0' : 'grayscale'}`}
                  />
                  <p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${isActive === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
                    {link.name}
                  </p>
                </li>
              ))}
            </ul>

            <div className="flex mx-4">
              <CustomButton 
                btnType="button"
                title={address ? 'Create a campaign' : 'Connect'}
                styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
                handleClick={() => {
                  if(address) navigate('create-campaign')
                  else handleConnect()
                }}
              />
            </div>
          </div>
        </div>
    </div>
  )
}

export default Navbar
