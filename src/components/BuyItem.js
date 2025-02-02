import { useEffect, useState } from "react";
import { useAccount, useConfig } from "wagmi";
import { estimateGas, writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { formatNumber, getDefaultGas, getMaxValue } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsUpDown, faChevronDown, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { encodeFunctionData, parseUnits } from "viem";
import { global } from "../config/global";
import contractABI from '../assets/abi/market.json';
import erc20ABI from '../assets/abi/token.json';
import TokenSelectModal from "./TokenSelectModal";
import { useAmount } from "../hooks/useAmount";
import { useContractStatus } from "../hooks/useContractStatus";

export default function BuyItem() {
    const account = useAccount();
    const config = useConfig();

    const [refresh, setRefresh] = useState(false);
    const contractStatus = useContractStatus(refresh);

    const [openTokenModal, setOpenTokenModal] = useState(false);

    const [isBuy, setIsBuy] = useState(true);
    const [inAmount, setInAmount] = useState('');
    const [token, setToken] = useState(global.TOKENS[0]);
    const { outAmount } = useAmount(token, inAmount, isBuy);

    const [btnMsg, setBtnMsg] = useState("BUY NOW");
    const [pending, setPending] = useState(false);
    const [errMsg, setErrMsg] = useState(false);

    useEffect(() => {
        if (pending) {
            setBtnMsg("PENDING");
            setErrMsg("Please wait! Pending...");
            return;
        }

        if (!account.address) {
            setBtnMsg("No Connection");
            setErrMsg("Please connect wallet!");
            return;
        }

        if (account.chainId !== global.chain.id) {
            setBtnMsg("Wrong Network");
            setErrMsg(`Please connect wallet to ${global.chain.name}!`);
            return;
        }

        if (contractStatus.ethBalance < getDefaultGas()) {
            setBtnMsg(`Insufficient ${global.chain.nativeCurrency.name}`);
            setErrMsg(`Insufficient ${global.chain.nativeCurrency.name}! Please buy more ${global.chain.nativeCurrency.name}!`);
            return;
        }

        const inToken = !isBuy ? global.TOKEN : token;
        if (!inAmount) {
            setBtnMsg("Enter amount");
            setErrMsg(`Please enter valid ${inToken.name} amount!`);
        }

        const _inAmount = parseFloat(inAmount).toFixed(inToken.decimals);
        if (!_inAmount || _inAmount <= 0) {
            setBtnMsg("Enter amount");
            setErrMsg(`Please enter valid ${inToken.name} amount!`);
            return;
        }

        const _maxValue = getMaxValue(isBuy ? token.isNative ? contractStatus.ethBalance : contractStatus[`${token.name.toLowerCase()}Balance`] : contractStatus.blurBalance, isBuy ? token.isNative : false);
        if (_inAmount > _maxValue) {
            setBtnMsg(`Insufficient ${inToken.name}`);
            setErrMsg(`Insufficient ${inToken.name}! Please buy more ${inToken.name}!`);
            return;
        }

        const _allowance = isBuy ? inToken.isNative ? -1 : contractStatus[`${token.name.toLowerCase()}Allowance`] : contractStatus.blurAllowance;
        if (!inToken.isNative && _allowance < _inAmount + 1000000) {
            setBtnMsg('ENABLE');
            setErrMsg(``);
            return;
        }

        if (isBuy) {
            setBtnMsg('BUY NOW');
        } else {
            setBtnMsg('SELL NOW');
        }
    }, [account, pending, token, inAmount, contractStatus, isBuy]);

    const handleBtn = async () => {
        if (btnMsg === 'ENABLE' || btnMsg === 'BUY NOW' || btnMsg === 'SELL NOW') {
            setPending(true);
            try {
                let data = {};
                const inToken = !isBuy ? global.TOKEN : token;
                const outToken = isBuy ? global.TOKEN : token;
                const _inAmount = parseFloat(inAmount).toFixed(inToken.decimals);
                const _nOutAmount = parseFloat(outAmount) * (global.SLIPPAGE_DENOM - global.SLIPPAGE) / global.SLIPPAGE_DENOM; // slippage
                const _outAmount = _nOutAmount > 1 ? _nOutAmount.toFixed(2) : _nOutAmount.toFixed(outToken.decimals > 6 ? 6 : outToken.decimals);

                if (btnMsg === 'ENABLE') {
                    data = {
                        address: inToken.address,
                        abi: erc20ABI,
                        functionName: 'approve',
                        args: [global.CONTRACT, global.maxint],
                    };
                    const encodedData = encodeFunctionData(data);
                    await estimateGas(config, {
                        ...account,
                        data: encodedData,
                        to: data.address,
                    });
                } else if (btnMsg === 'BUY NOW') {
                    if (inToken.isNative) {
                        data = {
                            address: global.CONTRACT,
                            abi: contractABI,
                            functionName: 'buyBlurWithSonic',
                            args: [
                                parseUnits(_outAmount, outToken.decimals),
                                Math.floor(Date.now() / 1000) + 1200, // deadline: 20 mins
                            ],
                            value: parseUnits(_inAmount, inToken.decimals)
                        };
                    } else {
                        data = {
                            address: global.CONTRACT,
                            abi: contractABI,
                            functionName: 'buyBlur',
                            args: [
                                parseUnits(_inAmount, inToken.decimals),
                                inToken.address,
                                parseUnits(_outAmount, outToken.decimals),
                                Math.floor(Date.now() / 1000) + 1200, // deadline: 20 mins
                            ],
                        };
                    }
                    const encodedData = encodeFunctionData(data);
                    await estimateGas(config, {
                        ...account,
                        data: encodedData,
                        to: data.address,
                        value: inToken.isNative ? parseUnits(_inAmount, inToken.decimals).toString() : '0'
                    });
                } else {
                    if (outToken.isNative) {
                        data = {
                            address: global.CONTRACT,
                            abi: contractABI,
                            functionName: 'sellBlurForSonic',
                            args: [
                                parseUnits(_inAmount, inToken.decimals),
                                parseUnits(_outAmount, outToken.decimals),
                                Math.floor(Date.now() / 1000) + 1200, // deadline: 20 mins
                            ],
                        };
                    } else {
                        data = {
                            address: global.CONTRACT,
                            abi: contractABI,
                            functionName: 'sellBlur',
                            args: [
                                parseUnits(_inAmount, inToken.decimals),
                                outToken.address,
                                parseUnits(_outAmount, outToken.decimals),
                                Math.floor(Date.now() / 1000) + 1200, // deadline: 20 mins
                            ],
                        };
                    }
                    const encodedData = encodeFunctionData(data);
                    await estimateGas(config, {
                        ...account,
                        data: encodedData,
                        to: data.address,
                    });
                }
                const txHash = await writeContract(config, {
                    ...account,
                    ...data,
                });
                const txPendingData = waitForTransactionReceipt(config, {
                    hash: txHash
                });
                toast.promise(txPendingData, {
                    pending: "Waiting for pending... 👌",
                });

                const txData = await txPendingData;
                if (txData && txData.status === "success") {
                    if (btnMsg === 'ENABLE') {
                        toast.success(`Successfully enabled to buy! 👌`);
                    } else if (btnMsg === 'BUY NOW') {
                        toast.success(`Successfully purchased ${outToken.name}! 👍`);
                    } else {
                        toast.success(`Successfully sold ${inToken.name}! 👍`);
                    }
                } else {
                    toast.error("Error! Transaction is failed.");
                }
            } catch (error) {
                console.log(error);
                try {
                    if (error?.shortMessage) {
                        toast.error(error?.shortMessage);
                    } else {
                        toast.error("Unknown Error! Something went wrong.");
                    }
                } catch (error) {
                    toast.error("Error! Something went wrong.");
                }
            }
            try {
                setRefresh(!refresh);
            } catch (error) { }
            setPending(false);
            return;
        }

        toast.warn(errMsg);
    };

    return (
        <>
            <div className="font- w-full lg:w-11/12 py-2 bg-[#95b9ff]/[0.7] h-[380px] flex flex-col justify-center items-center text-center px-2 my-3
                rounded-[20px] box-shadow border-blue-600 font-namecat 
            ">
                <div className="w-full lg:w-5/6 px-3 flex flex-row items-center justify-between text-lg text-center">
                    <label className="">Input</label>
                </div>
                <div className="w-full lg:w-5/6 px-3 py-1 bg-gray-200/[0.1] flex flex-row items-center justify-between text-2xl text-center gap-2">
                    <input
                        className={`w-2/5 lg:w-3/5 bg-transparent border-0 focus:border-0 active:border-0 focus:outline-0 ${pending ? `text-gray-800` : `text-[#1a6aff]`}`}
                        placeholder="0"
                        value={inAmount}
                        disabled={pending}
                        onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                                setInAmount(e.target.value);
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="border-2 border-gray-200/[0.1] hover:border-[#eab950] w-[140px] bg-gray-200/[0.1] gap-1 px-2 py-1 flex flex-row justify-center text-center items-center"
                        disabled={pending}
                        onClick={(e) => {
                            if (isBuy) {
                                setOpenTokenModal(true);
                            }
                        }}
                    >
                        <img src={isBuy ? token.logo : global.TOKEN.logo} width={35} height={35} alt='in' />
                        <label>{isBuy ? token.name : global.TOKEN.name}</label>
                        {isBuy ? <FontAwesomeIcon icon={faChevronDown} size="sm" /> : <></>}
                    </button>
                </div>
                <div className="w-full lg:w-5/6 px-3 flex flex-row items-center justify-start text-sm text-center">
                    <div className="flex flex-row items-center justify-end gap-2 text-center">
                        <label>{`Balance: ${formatNumber(isBuy ? token.isNative ? contractStatus.ethBalance : contractStatus[`${token.name.toLowerCase()}Balance`] : contractStatus.blurBalance)}`}</label>
                        <button
                            className={`hover:text-[#eab950] ${pending ? `text-yellow-800` : `text-yellow-400`}`}
                            disabled={pending}
                            onClick={(e) => {
                                const maxValue = getMaxValue(isBuy ? token.isNative ? contractStatus.ethBalance : contractStatus[`${token.name.toLowerCase()}Balance`] : contractStatus.blurBalance, isBuy ? token.isNative : false);
                                if (maxValue >= 0) {
                                    setInAmount(maxValue.toFixed(3));
                                }
                            }}
                        >Max</button>
                    </div>
                </div>
                <div className="hover:cursor-pointer my-0 rounded-full border-white border-2 px-[7px] py-[2px]" onClick={(e) => { setIsBuy(!isBuy); }}>
                    <FontAwesomeIcon icon={faArrowsUpDown} size="xl" />
                </div>
                <div className="w-full lg:w-5/6 px-3 flex flex-row items-center justify-between text-lg text-center">
                    <label className="">Output</label>
                </div>
                <div className="w-full lg:w-5/6 px-3 py-1 bg-gray-200/[0.1] flex flex-row items-center justify-between text-2xl text-center gap-2">
                    <input
                        className={`w-2/5 lg:w-3/5 bg-transparent border-0 focus:border-0 active:border-0 focus:outline-0 ${pending ? `text-gray-800` : `text-[#1a6aff]`}`}
                        placeholder="0"
                        value={outAmount}
                        disabled
                    />
                    <button
                        disabled={pending}
                        className="border-2 border-gray-200/[0.1] hover:border-[#eab950]  w-[140px] bg-gray-200/[0.1] gap-1 px-2 py-1 flex flex-row justify-center text-center items-center"
                        type="button"
                        onClick={(e) => {
                            if (!isBuy) {
                                setOpenTokenModal(true);
                            }
                        }}
                    >
                        <img src={!isBuy ? token.logo : global.TOKEN.logo} width={35} height={35} alt='out' />
                        <label>{!isBuy ? token.name : global.TOKEN.name}</label>
                        {!isBuy ? <FontAwesomeIcon icon={faChevronDown} size="sm" /> : <></>}
                    </button>
                </div>
                <div className="w-full lg:w-5/6 px-3 flex flex-row items-center justify-start text-sm text-center">
                    <div className="flex flex-row items-center justify-end gap-2 text-center">
                        <label>{`Balance: ${formatNumber(!isBuy ? token.isNative ? contractStatus.ethBalance : contractStatus[`${token.name.toLowerCase()}Balance`] : contractStatus.blurBalance)}`}</label>
                    </div>
                </div>
                <button
                    className={`hover:border-2 hover:border-[#eab950] bg-[#1a6aff] flex flex-row items-center justify-center gap-2 mt-10 w-1/2 h-[50px]  text-xl border-1 rounded-[10px] ${pending ? `bg-gray-200/[0.5] border-yellow-700 text-gray-800` : `border-yellow-500 text-white`}`}
                    disabled={pending}
                    onClick={handleBtn}
                >
                    <div>
                        {btnMsg}
                    </div>
                    <div>
                        {pending ? <FontAwesomeIcon icon={faSpinner} size="sm" className="animate-spin" /> : <></>}
                    </div>
                </button>
                <TokenSelectModal
                    ethBalance={contractStatus.ethBalance}
                    tokenBalances={contractStatus}
                    openTokenModal={openTokenModal}
                    setOpenTokenModal={setOpenTokenModal}
                    setToken={setToken} />
            </div>
        </>
    );
}