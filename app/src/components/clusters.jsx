import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { useState, useEffect, Suspense } from "react";
import {useParams} from "react-router-dom";
import { getClusters } from "./funcs";
import { initCluster } from "./funcs";
import { lazy } from "react";
import Home from "./home";
const TokensList = lazy(() => import("./TokenList"));

let ListAddresses = [];

const Cluster = () => {
    const wallet = useAnchorWallet();

    const {address} = useParams();
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(1);
    const [clustorStatus, setClustorStatus] = useState(false);
    const [clustorName, setClustorName] = useState("");
    const [clustorSupply, setClustorSupply] = useState(0);
    const [tokenKeyOne, setTokenKeyOne] = useState(null);
    const [tokenKeyTwo, setTokenKeyTwo] = useState(null);
    const [tokenKeyThree, setTokenKeyThree] = useState(null);
    const [tokenOneAmt, setTokenOneAmt] = useState(0);
    const [tokenTwoAmt, setTokenTwoAmt] = useState(0);
    const [tokenThreeAmt, setTokenThreeAmt] = useState(0);

    useEffect(() => {
      (async () => {
        setLoading(true);
        const i = await getClusters(wallet);
        let x = i.find(el => el.publicKey.toBase58() === address);
        console.log(x);
        setClustorStatus(x.account.inited);
        setClustorName(x.account.clusterName);
        setClustorSupply(x.account.clusterSupply.toNumber());
        setTokenKeyOne(x.account.tokenOne.toBase58());
        setTokenKeyTwo(x.account.tokenTwo.toBase58());
        setTokenKeyThree(x.account.tokenThree.toBase58());
        setTokenOneAmt(x.account.t1Amt.toNumber());
        setTokenTwoAmt(x.account.t2Amt.toNumber());
        setTokenThreeAmt(x.account.t3Amt.toNumber());
        if(tokenKeyOne !== null && tokenKeyTwo !== null && tokenKeyThree !== null && tokenOneAmt !== 0 && tokenTwoAmt !== 0 && tokenThreeAmt !== 0 && ListAddresses.length === 0){
        ListAddresses.push({address : tokenKeyOne, value : tokenOneAmt}, {address : tokenKeyTwo, value : tokenTwoAmt}, {address : tokenKeyThree, value : tokenThreeAmt});
        }
        setLoading(false);
      })();
    }, [wallet, address, tokenKeyOne, tokenKeyTwo, tokenKeyThree, tokenOneAmt, tokenTwoAmt, tokenThreeAmt]);

    const initialize = async() => {
      setLoading(true);
      try{
      await initCluster(wallet, address, tokenKeyOne, tokenKeyTwo, tokenKeyThree);
        alert("Transaction succesful!");
      } catch(error) {
        alert(error);
      }
      setLoading(false);
    }

    return (
        <div className="">
           <h1 className="mb-4 text-4xl flex justify-center align-middle font-bold text-[#374151] md:text-2xl lg:text-4xl ">{clustorName}</h1>
          {clustorStatus ?
            <div className="wrapper">
            <h3 className="mb-4 text-lg flex justify-center align-middle font-semibold text-[#374151] md:text-xl lg:text-xl">{"Clustor Supply : " + clustorSupply}</h3>
            <span className="mb-2 cursor-text text-sm flex justify-center align-middle font-normal text-[#4b5563] lg:text-m sm:px-16 xl:px-48 dark:text-[#4b5563]">{}</span>
            <span className="mb-2 text-sm flex justify-center align-middle font-normal text-[#4b5563] lg:text-m sm:px-16 xl:px-48 dark:text-[#4b5563]">Please consider respective decimals for the amounts below</span>
          </div>
          :
            <button className="py-2.5 px-5 mr-2 text-sm font-medium text-gray-900 bg-[#ffffff] rounded-lg border border-[#e2e8f0] hover:bg-[#f1f5f9] hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-[#4b5563] dark:hover:text-[#ffffff] dark:hover:bg-[#374151] inline-flex items-center" onClick={initialize}>{loading ? "Loading...":"Initialize"}
            </button>
          }
        
          <div className="flex flex-row justify-center align-middle">

            <div className="w-5/12">
              <h3 className="mb-4 flex justify-center align-middle text-2xl font-bold tracking-tight leading-none text-[#374151] md:text-xl lg:text-2xl">Token List</h3>
              <Suspense fallback={<Home />}>
              <TokensList addresses={ListAddresses} />
              </Suspense>
              <div className="flex justify-center align-middle">
              <div className="flex justify-center align-middle sm:w-80 h-0.5 w-96 m-4 bg-cex rounded"></div>
              </div>
                <div className="list-form  flex justify-center align-middle">
                  <input className="w-24 bg-[#f1f5f9] bg-opacity-50 rounded border border-[#cbd5e1] focus:border-blue-200 focus:ring-2 focus:ring-blue-100 text-base outline-none text-[#374151] py-1 px-4  leading-8 transition-colors duration-200 ease-in-out" type="number" min="1" value={amount} name="input-amount" id="input-amount" onChange={(e) => setAmount(e.target.value)} />
                </div>
<div className="grid grid-rows-1 grid-flow-col gap-1">
<div className="inline-flex rounded-md shadow-sm  justify-center align-middle">
  <button type="button" className="inline-flex items-center py-2 px-4 text-sm font-medium  rounded-l-lg text-[#ffffff] bg-cex focus:outline-none hover:bg-rex">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 m-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75" />
</svg>{loading ? "Loading.." : "Approve"}
  </button>
  <button type="button" className="inline-flex items-center py-2 px-4 text-sm font-medium text-[#ffffff] bg-cex focus:outline-none hover:bg-rex" id="b1">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 m-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
</svg>{loading ? "Loading.." : "Issue"}
  </button>
  <button type="button" className="inline-flex items-center py-2 px-4 text-sm font-medium text-[#ffffff] bg-cex focus:outline-none hover:bg-rex" id="b1">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 m-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
</svg>{loading ? "Loading.." : "Lock"}
  </button>
  <button type="button" className="inline-flex items-center py-2 px-4 text-sm font-medium text-[#ffffff] bg-cex focus:outline-none hover:bg-rex" id="b1">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 m-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 119 0v3.75M3.75 21.75h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H3.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
</svg>{loading ? "Loading.." : "Unlock"}
  </button>
  <button type="button" className="inline-flex items-center py-2 px-4 text-sm font-medium rounded-r-md   text-[#ffffff] bg-cex focus:outline-none hover:bg-rex" id="b2">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6 m-1">
  <path stroke-linecap="round" stroke-linejoin="round" d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185zM9.75 9h.008v.008H9.75V9zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm4.125 4.5h.008v.008h-.008V13.5zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
</svg>{loading ? "Loading.." : "Redeem"}
  </button>
    </div>
   </div>
  </div>
 </div>
</div>

        // Alert Message ka css hai dekh lena alert 2 error ka hai alert 3 txn succesful ka hai
/* 
<div id="alert-2" className="flex p-4 mb-4 bg-red-100 rounded-lg dark:bg-red-200" role="alert">
<svg aria-hidden="true" className="flex-shrink-0 w-5 h-5 text-red-700 dark:text-red-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
<span className="sr-only">Info</span>
<div className="ml-3 text-sm font-medium text-red-700 dark:text-red-800">
  A simple info alert with an <a href="#" className="font-semibold underline hover:text-red-800 dark:hover:text-red-900">example link</a>. Give it a click if you like.
</div>
<button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-red-100 text-red-500 rounded-lg focus:ring-2 focus:ring-red-400 p-1.5 hover:bg-red-200 inline-flex h-8 w-8 dark:bg-red-200 dark:text-red-600 dark:hover:bg-red-300" data-dismiss-target="#alert-2" aria-label="Close">
  <span className="sr-only">Close</span>
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
</button>
</div>
<div id="alert-3" className="flex p-4 mb-4 bg-green-100 rounded-lg dark:bg-green-200" role="alert">
<svg aria-hidden="true" className="flex-shrink-0 w-5 h-5 text-green-700 dark:text-green-800" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
<span className="sr-only">Info</span>
<div className="ml-3 text-sm font-medium text-green-700 dark:text-green-800">
  A simple info alert with an <a href="#" className="font-semibold underline hover:text-green-800 dark:hover:text-green-900">example link</a>. Give it a click if you like.
</div>
<button type="button" className="ml-auto -mx-1.5 -my-1.5 bg-green-100 text-green-500 rounded-lg focus:ring-2 focus:ring-green-400 p-1.5 hover:bg-green-200 inline-flex h-8 w-8 dark:bg-green-200 dark:text-green-600 dark:hover:bg-green-300" data-dismiss-target="#alert-3" aria-label="Close">
  <span className="sr-only">Close</span>
  <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
</button>
</div> */

    );
};

export default Cluster;
