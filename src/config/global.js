import { sonic, sonicTestnet } from "wagmi/chains";
import blur_ic from "../assets/img/blur.png";
import sonic_ic from "../assets/img/sonic.webp";
import usdt_ic from "../assets/img/usdt.svg";
import anon_ic from "../assets/img/anon.webp";
import derp_ic from "../assets/img/derp.webp";
import goglz_ic from "../assets/img/goglz.webp";
import indi_ic from "../assets/img/indi.webp";
import usdc_ic from "../assets/img/usdc.webp";
import whale_ic from "../assets/img/whale.webp";
import ws_ic from "../assets/img/ws.webp";

const IS_PRODUCT_MODE = true

const ADMIN = '0xf441753ca970A4703b2a6485505984286Be5E190'
const PROJECT = 'sonicblur'
const PROJECT_ID = 'dd3af9f8fb0f9af8e86e953907f7b8b8'

const contract = IS_PRODUCT_MODE ? '0x77CD4f1D0DcdDbb79dEd7Ca613708c380A7dF2db' : "0x656B9EbE76b641457678c0A3F2Bf2d2798386766"
const multicall_contract = IS_PRODUCT_MODE ? '0x6396dBFC6699ACdBaEbF56D47EBD5d0F15AF3e53' : "0x6396dBFC6699ACdBaEbF56D47EBD5d0F15AF3e53"

const token = {
    name: 'BLUR',
    address: IS_PRODUCT_MODE ? '0x9c1380658fE2fDa22A574B269b71E7e066562821' : '0x9c1380658fE2fDa22A574B269b71E7e066562821',
    decimals: 18,
    logo: blur_ic,
    isNative: false
}

const tokens = [
    {
        name: 'S',
        address: IS_PRODUCT_MODE ? '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE' : '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
        decimals: 18,
        logo: sonic_ic,
        isNative: true
    },
    {
        name: 'wS',
        address: IS_PRODUCT_MODE ? '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38' : '0x039e2fB66102314Ce7b64Ce5Ce3E5183bc94aD38',
        decimals: 18,
        logo: ws_ic,
        isNative: false
    },
    {
        name: 'USDT',
        address: IS_PRODUCT_MODE ? '0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE' : '0xd3DCe716f3eF535C5Ff8d041c1A41C3bd89b97aE',
        decimals: 6,
        logo: usdt_ic,
        isNative: false
    },
    {
        name: 'USDC',
        address: IS_PRODUCT_MODE ? '0x29219dd400f2Bf60E5a23d13Be72B486D4038894' : '0x29219dd400f2Bf60E5a23d13Be72B486D4038894',
        decimals: 6,
        logo: usdc_ic,
        isNative: false
    },
    {
        name: 'Anon',
        address: IS_PRODUCT_MODE ? '0x79bbF4508B1391af3A0F4B30bb5FC4aa9ab0E07C' : '0x79bbF4508B1391af3A0F4B30bb5FC4aa9ab0E07C',
        decimals: 18,
        logo: anon_ic,
        isNative: false
    },
    {
        name: 'DERP',
        address: IS_PRODUCT_MODE ? '0xe920d1DA9A4D59126dC35996Ea242d60EFca1304' : '0xe920d1DA9A4D59126dC35996Ea242d60EFca1304',
        decimals: 18,
        logo: derp_ic,
        isNative: false
    },
    {
        name: 'GOGLZ',
        address: IS_PRODUCT_MODE ? '0x9fDbC3f8Abc05Fa8f3Ad3C17D2F806c1230c4564' : '0x9fDbC3f8Abc05Fa8f3Ad3C17D2F806c1230c4564',
        decimals: 18,
        logo: goglz_ic,
        isNative: false
    },
    {
        name: 'INDI',
        address: IS_PRODUCT_MODE ? '0x4EEC869d847A6d13b0F6D1733C5DEC0d1E741B4f' : '0x4EEC869d847A6d13b0F6D1733C5DEC0d1E741B4f',
        decimals: 18,
        logo: indi_ic,
        isNative: false
    },
    {
        name: 'WHALE',
        address: IS_PRODUCT_MODE ? '0x068e9e009fDa970fA953E1f6a43D982cA991F4bA' : '0x068e9e009fDa970fA953E1f6a43D982cA991F4bA',
        decimals: 18,
        logo: whale_ic,
        isNative: false
    },
]

export const global = {
    PROJECT: PROJECT,
    PROJECT_ID: PROJECT_ID,
    CONTRACT: contract,
    MULTICALL: multicall_contract,
    TOKENS: tokens,
    TOKEN: token,
    chain: IS_PRODUCT_MODE ? sonic : sonicTestnet,
    defaultGas: IS_PRODUCT_MODE ? 0.005 : 0.005,
    REFETCH_INTERVAL: 30000,
    SLIPPAGE: 3, // 3%
    SLIPPAGE_DENOM: 100,
    admin: ADMIN,
    maxint: '115792089237316195423570985008687907853269984665640564039457584007913129639935',
}