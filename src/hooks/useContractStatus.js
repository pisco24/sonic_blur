import { useEffect, useState } from "react";
import MulticallABI from "../assets/abi/multicall.json"
import TokenABI from "../assets/abi/token.json"
import { useAccount, useConfig } from "wagmi";
import { multicall } from '@wagmi/core'
import { global } from "../config/global";
import { formatUnits } from "viem";

export function useContractStatus(refresh) {
    const [data, setData] = useState({
        ethBalance: 0,
        blurBalance: 0,
        blurAllowance: 0,
        wsBalance: 0,
        wsAllowance: 0,
        usdtBalance: 0,
        usdtAllowance: 0,
        usdcBalance: 0,
        usdcAllowance: 0,
        anonBalance: 0,
        anonAllowance: 0,
        derpBalance: 0,
        derpAllowance: 0,
        goglzBalance: 0,
        goglzAllowance: 0,
        indiBalance: 0,
        indiAllowance: 0,
        whaleBalance: 0,
        whaleAllowance: 0,
    })
    const { address } = useAccount();
    const config = useConfig()

    const [refetch, setRefetch] = useState(false)

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
                if (address) {
                    const contract = global.CONTRACT;

                    const contracts = []

                    contracts.push({
                        address: global.MULTICALL,
                        abi: MulticallABI,
                        functionName: 'getEthBalance',
                        args: [address],
                    })
                    contracts.push({
                        address: global.TOKEN.address,
                        abi: TokenABI,
                        functionName: 'balanceOf',
                        args: [address],
                    })
                    contracts.push({
                        address: global.TOKEN.address,
                        abi: TokenABI,
                        functionName: 'allowance',
                        args: [address, contract],
                    })
                    const tokens = global.TOKENS.filter(item => !item.isNative)
                    tokens.map((value, key) => {
                        if (!value.isNative) {
                            contracts.push({
                                address: value.address,
                                abi: TokenABI,
                                functionName: 'balanceOf',
                                args: [address],
                            })
                            contracts.push({
                                address: value.address,
                                abi: TokenABI,
                                functionName: 'allowance',
                                args: [address, contract],
                            })
                        }
                        return contracts
                    })
                    const d = await multicall(config, {
                        contracts
                    })

                    setData({
                        ethBalance: d[0].status === "success" ? parseFloat(formatUnits(d[0].result, config.chains[0].nativeCurrency.decimals)) : 0,
                        blurBalance: d[1].status === "success" ? parseFloat(formatUnits(d[1].result, global.TOKEN.decimals)) : 0,
                        blurAllowance: d[2].status === "success" ? parseFloat(formatUnits(d[2].result, global.TOKEN.decimals)) : 0,
                        wsBalance: d[3].status === "success" ? parseFloat(formatUnits(d[3].result, tokens[0].decimals)) : 0,
                        wsAllowance: d[4].status === "success" ? parseFloat(formatUnits(d[4].result, tokens[0].decimals)) : 0,
                        usdtBalance: d[5].status === "success" ? parseFloat(formatUnits(d[5].result, tokens[1].decimals)) : 0,
                        usdtAllowance: d[6].status === "success" ? parseFloat(formatUnits(d[6].result, tokens[1].decimals)) : 0,
                        usdcBalance: d[7].status === "success" ? parseFloat(formatUnits(d[7].result, tokens[2].decimals)) : 0,
                        usdcAllowance: d[8].status === "success" ? parseFloat(formatUnits(d[8].result, tokens[2].decimals)) : 0,
                        anonBalance: d[9].status === "success" ? parseFloat(formatUnits(d[9].result, tokens[3].decimals)) : 0,
                        anonAllowance: d[10].status === "success" ? parseFloat(formatUnits(d[10].result, tokens[3].decimals)) : 0,
                        derpBalance: d[11].status === "success" ? parseFloat(formatUnits(d[11].result, tokens[4].decimals)) : 0,
                        derpAllowance: d[12].status === "success" ? parseFloat(formatUnits(d[12].result, tokens[4].decimals)) : 0,
                        goglzBalance: d[13].status === "success" ? parseFloat(formatUnits(d[13].result, tokens[5].decimals)) : 0,
                        goglzAllowance: d[14].status === "success" ? parseFloat(formatUnits(d[14].result, tokens[5].decimals)) : 0,
                        indiBalance: d[15].status === "success" ? parseFloat(formatUnits(d[15].result, tokens[6].decimals)) : 0,
                        indiAllowance: d[16].status === "success" ? parseFloat(formatUnits(d[16].result, tokens[6].decimals)) : 0,
                        whaleBalance: d[17].status === "success" ? parseFloat(formatUnits(d[17].result, tokens[7].decimals)) : 0,
                        whaleAllowance: d[18].status === "success" ? parseFloat(formatUnits(d[18].result, tokens[7].decimals)) : 0,
                    })
                }
            } catch (error) {
                console.log('useContractStatus err', error)
            }
        };
        fetchData();
    }, [address, config, refetch, refresh])

    return data
}