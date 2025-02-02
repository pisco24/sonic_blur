import { global } from "../config/global";
import { formatNumber } from "../utils/utils";

export default function TokenSelectModal(props) {
    if (!props?.openTokenModal) return null;

    return (
        <div
            id="default-modal"
            tabIndex="-1"
            aria-hidden="true"
            className="fixed z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full"
        >
            <div className="relative w-full max-w-md max-h-full mx-auto mt-[300px]">
                <div className="relative bg-[#2e2f35] border-[#eab950] border-2">
                    <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                        <h3 className="text-xl font-semibold text-white dark:text-white">
                            Select a Token
                        </h3>
                        <button
                            type="button"
                            className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            data-modal-hide="default-modal"
                            onClick={(e) => props?.setOpenTokenModal(false)}
                        >
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                            </svg>
                        </button>
                    </div>
                    <div className="p-2 space-y-2">
                        <div className="w-full bg-gray-300/[0.2] gap-2 flex flex-col">
                            {
                                props && global.TOKENS.map((item, index) => {
                                    return (
                                        <button
                                            key={index}
                                            data-modal-hide="default-modal"
                                            className="border-2 border-gray-200/[0.1] hover:border-[#eab950] w-full bg-gray-200/[0.1] gap-1 px-2 py-1 flex flex-row justify-between text-center items-center"
                                            type="button"
                                            onClick={() => {
                                                props?.setToken(item);
                                                props?.setOpenTokenModal(false);
                                            }}
                                        >
                                            <div className="w-full gap-1 px-2 py-1 flex flex-row justify-start text-center items-center" type="button">
                                                <img src={item.logo} width={35} height={35} alt='token' />
                                                <label className="">{item.name}</label>
                                            </div>
                                            <label className="">
                                                {formatNumber(item.isNative ? props?.ethBalance : props?.tokenBalances[`${item.name.toLowerCase()}Balance`])}
                                            </label>
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}