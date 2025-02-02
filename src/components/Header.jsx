import Connect from "./Connect";

const Header = () => 
{
    return <div className="relative pt-2 pb-2 sm:pb-5 bg-[#95b9ff] font-namecat  w-full h-[110px]">
        
            <div className="flex flex-row items-center lg:justify-between gap-3">
                
                    <img alt="img"
                        src={"https://static.wixstatic.com/media/d6cb87_2855467547dd4dbfafcc88f70e8b6e09~mv2.png/v1/fill/w_109,h_93,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/getimg_ai_ino%20backng.png"}
                        className="lg:max-w-lg w-[100px]"
                    />
       
                <div className="mr-10 flex items-center" >
                <Connect />
                </div>
            </div>
       
    </div>
}

export default Header;