import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaTelegramPlane } from "react-icons/fa";

const Footer = () => {
    return <div className="relative w-full py-5 bg-[#1a6aff] md:min-h-[182.5px] flex flex-col gap-5 items-center " >
        <div className="flex gap-5 w-[150px] " >
            <a className="flex items-center justify-center min-w-[40px] h-[40px] bg-white rounded-[70px] "
                href="https://x.com/sonic101" rel="noreferrer"
            >
                <FaXTwitter className="text-[#1a6aff] w-[30px] h-[30px] " />
            </a>
            <a className="flex items-center justify-center min-w-[40px] h-[40px] bg-white rounded-[50px] "
                href="https://www.instagram.com/blur101" rel="noreferrer"
            >
                <FaInstagram className="text-[#1a6aff] w-[30px] h-[30px] " />
            </a>
            <a className="flex items-center justify-center min-w-[40px] h-[40px] bg-white rounded-[50px] "
                href="https://t.me/blur101" rel="noreferrer"
            >
                <FaTelegramPlane className="text-[#1a6aff] w-[30px] h-[30px] " />
            </a>
        </div>
        <div className="text-white text-center w-full px-2 md:px-0 md:w-[800px] font-namecat " >
        <p>Disclaimer-ish:</p>
        <p>$BLUR is the meme coin you didn’t know you needed, powered by unstoppable AI energy and a love for all things chaotic, fun, and fast. This isn’t your grandma’s retirement plan—$BLUR is for the bold, the curious, and the meme-obsessed who want to be part of something bigger, faster, blurrier.</p>
        </div>
    </div>
}

export default Footer;