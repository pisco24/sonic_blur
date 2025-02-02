import { useEffect, useState } from "react";
import ContractABI from "../assets/abi/market.json"
import { useConfig } from "wagmi";
import { multicall } from '@wagmi/core'
import { global } from "../config/global";
import { formatUnits, parseUnits } from "viem";

export function useAmount(token, inAmount, isBuy) {
    const [outAmount, setOutAmount] = useState('')

    const [refetch, setRefetch] = useState(false)

    const config = useConfig()

    useEffect(() => {
        const timerID = setInterval(() => {
            setRefetch((prevData) => {
                return !prevData;
            })
        }, global.REFETCH_INTERVAL);

        return () => {
            clearInterval(timerID);
        };
        // eslint-disable-next-line
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const contract = global.CONTRACT;

                const inDecimals = !isBuy ? global.TOKEN.decimals : token.decimals
                const outDecimals = isBuy ? global.TOKEN.decimals : token.decimals

                const contracts = []

                if (inAmount && token) {
                    const _inAmount = parseFloat(inAmount).toFixed(inDecimals)
                    if (isBuy) {
                        contracts.push({
                            address: contract,
                            abi: ContractABI,
                            functionName: 'getAmountBlur',
                            args: [parseUnits(_inAmount, inDecimals), token.address],
                        })
                    } else {
                        contracts.push({
                            address: contract,
                            abi: ContractABI,
                            functionName: 'getAmountToken',
                            args: [parseUnits(_inAmount, inDecimals), token.address],
                        })
                    }
                    const d = await multicall(config, {
                        contracts
                    })

                    const _outAmount = d[0].status === "success" ? parseFloat(formatUnits(d[0].result, outDecimals)) : 0;
                    setOutAmount(_outAmount > 1 ? _outAmount.toFixed(2) : _outAmount.toFixed(outDecimals > 6 ? 6 : outDecimals))
                }
            } catch (error) {
                console.log('useAmount err', error)
            }
        };
        fetchData();
    }, [config, refetch, token, inAmount, isBuy])

    return { outAmount }
}