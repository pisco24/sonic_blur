import React from "react";
import BuyCard from "../../components/BuyCard";
import "./swap.css";

export default function SwapPage() {
    return (
        <div className="mainarea md:min-h-[620px] relative w-full mx-auto mt-0 flex flex-col justify-center items-center relative">
            <img
                className="absolute w-full h-full object-cover opacity-10"
                src="https://static.wixstatic.com/media/d6cb87_efc014c45af44e38abc5986376fce136~mv2.jpeg/v1/fill/w_1024,h_405,al_c,q_85,enc_avif,quality_auto/d6cb87_efc014c45af44e38abc5986376fce136~mv2.jpeg"
            />
            <div className="absolute w-full h-full bg-[#1a6aff]/[0.5] z-[1] " />
            <BuyCard />
        </div>
    );
}