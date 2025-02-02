import React from "react";

import { ConnectWallet } from "./ConnectWallet";

export const Connect = function (props) {
  return (
    <React.Fragment>
      <div className="w-full flex absolute top-2 left-1 md:top-10 md:left-10" >
        <div
          className="hover:border-2 hover:border-[#eab950] bg-[#1a6aff] font-namecat text-[24px] text-center rounded-[10px] px-2 mx-auto lg:mx-0 max-w-[300px] max-h-[200px] py-2 text-white items-center"
        >
          <ConnectWallet />
        </div>
      </div>
    </React.Fragment>
  );
};

export default Connect;