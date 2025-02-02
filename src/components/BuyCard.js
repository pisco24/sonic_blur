import BuyItem from "./BuyItem";
import Connect from "./Connect";

export default function BuyCard() {
    return (
        <div className="z-[10] w-full lg:w-[600px] min-h-screen flex flex-col justify-center text-center">
            <Connect />
            <BuyItem className="flex flex-col justify-center" />
        </div>
    );
}