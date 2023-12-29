import { useContext, useState } from "react";
import InitialContents from "../components/market/InitialContents";
import MonthSelection from "../components/market/MonthSelection";
import DepositContent from "../components/market/DepositContent";
import DepositAmountContent from "../components/market/DepositAmountContent";
import AssetProcotolTopContent from "../components/market/AssetProcotolTopContent";
import Navbar from "../components/primary/Navbar";
import { ScrollRestoration } from "react-router-dom";
import { useAccount, useBalance, useContractWrite, useNetwork, usePublicClient } from "wagmi";
import IERC20Permit from "../abi/IERC20Permit.json";
import ILilaPoolsProvider from "../abi/ILilaPoolsProvider.json";
import { parseUnits } from "viem";
import { signTypedData } from '@wagmi/core'
import { MarketDataContext, POOL_ADDRESS } from "../constants/MarketDataProvider";

const Market = () => {
  const [initialContent, setInitialContent] = useState(true);
  const publicClient = usePublicClient();
  const { address: userAddress } = useAccount();
  const { chain } = useNetwork();

  // Month selection state
  const [monthSelection, setMonthSelection] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(-1);

  const { marketContents } = useContext(MarketDataContext);
  let globitem = selectedAsset == -1 ? undefined : marketContents.filter(item => item.id == selectedAsset);

  const setSelectedAssetM = (ni) => {
    setSelectedAsset(ni);
    setMonthSelection(ni != -1);
    if (ni == -1) setMakeDeposit(false);
    if (ni == -1) setEnterDeposit(false);
  };

  // Deposit content
  const [makeDeposit, setMakeDeposit] = useState(false);
  const [enterDeposit, setEnterDeposit] = useState(false);
  const [deposit, setDeposit] = useState(false);
  const [finalize, setFinalize] = useState(false);
  const [amount, setAmount] = useState("");
  const [depositArgs, setDepositArgs] = useState([]);

  const { data, isError, isLoading } = useBalance({
    address: userAddress,
    token: globitem ? globitem[0].asset : ""
  })

  const showAmountScreen = () => {
    setEnterDeposit(true);
    setMonthSelection(false);
  };
  const showDepositScreen = () => {
    setEnterDeposit(false);
    setMakeDeposit(true);
  };
  const showDepositValue = async () => {
    const decimals = data.decimals;
    const depositValue = parseUnits(amount, decimals);
    // depositString
    const poolAddress = POOL_ADDRESS;
    const tokenAddress = globitem[0].asset;
    const expiry = Math.trunc((Date.now() + 300 * 1000) / 1000)
    const nonce = (await publicClient.readContract({
      address: tokenAddress,
      abi: IERC20Permit.abi,
      functionName: "nonces",
      args: [userAddress],
    })).toString();


    const message = {
      owner: userAddress,
      spender: poolAddress,
      value: depositValue,
      nonce: nonce,
      deadline: expiry
    };
    const types = {
      EIP712Domain: [
        {
          name: "name",
          type: "string",
        },
        {
          name: "version",
          type: "string",
        },
        {
          name: "chainId",
          type: "uint256",
        },
        {
          name: "verifyingContract",
          type: "address",
        },
      ],
      Permit: [
        { //Permit(address owner,address spender,uint256 value,uint256 nonce,uint256 deadline
          name: "owner",
          type: "address",
        },
        {
          name: "spender",
          type: "address",
        },
        {
          name: "value",
          type: "uint256",
        },
        {
          name: "nonce",
          type: "uint256",
        },
        {
          name: "deadline",
          type: "uint256",
        }
      ],
    };
    const domain = {
      name: globitem[0].symbol,
      version: "1",
      chainId: chain.id,
      verifyingContract: tokenAddress,
    };
    const signature = await signTypedData({
      domain,
      message,
      primaryType: 'Permit',
      types,
    });

    const r = signature.substring(0, 66);
    const s = "0x" + signature.substring(66, 130);
    const v = Number("0x" + signature.substring(130, 132));

    const value = [depositValue, globitem[0].id, expiry, v, r, s];
    setDepositArgs(value);
    setDeposit(true);
  };

  const {
    data : depositResult,
    write: depositFunc,
    isSuccess: isSuccessDeposit,
    } = useContractWrite({
        address: POOL_ADDRESS,
        abi: ILilaPoolsProvider.abi,
        functionName: "deposit",
        args: depositArgs,
    });

  const showFinalizedScreen = () => {
    if(depositArgs != []) {
      setDeposit(false);
      depositFunc();
      setFinalize(true);
    }
    
  };


  return (
    <div className="w-full pb-10">
      <ScrollRestoration />
      <Navbar />

      <div className="w-full 2xl:max-w-7xl 3xl:max-w-[1400px] mx-auto px-4 md:px-10 lg:px-16 xl:px-24">
        {/* INitial Content */}
        {<AssetProcotolTopContent boolean={[monthSelection, enterDeposit, makeDeposit, deposit, finalize]}></AssetProcotolTopContent>}

        {<InitialContents selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM} />}

        {/* MonthContents */}
        {monthSelection && <MonthSelection selectedAsset={selectedAsset} toggleDeposit={showAmountScreen} setSelectedAsset={setSelectedAssetM} />}

        {/* DepositContent */}
        {enterDeposit && <DepositAmountContent toggleDeposit={showDepositScreen} selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM} amount={amount} onChange={setAmount} balance={data}/>}

        {/* DepositContent */}
        {makeDeposit && <DepositContent selectedAsset={selectedAsset} setSelectedAsset={setSelectedAssetM} deposit={deposit} finalize={finalize} setDeposit={showDepositValue} setFinalize={showFinalizedScreen} />}
      </div>
    </div>
  );
};

export default Market;
