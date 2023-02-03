import { lazy, FC, Suspense } from "react";
import { useState, useEffect } from "react";
import { useAnchorWallet } from "@solana/wallet-adapter-react";
import { getClusters } from "./funcs";
import Home from "./home";
const List = lazy(() => import("../components/List")); 

let ListTitles : any = [];

const Browse : FC = () => {
    const wallet = useAnchorWallet();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const clustorList : any = await getClusters(wallet);
            for (const i in clustorList){
                console.log(clustorList[i].publicKey.toBase58());
                ListTitles.push({address: clustorList[i].publicKey.toBase58(), cname: clustorList[i]["account"].clusterName});            
            }
            setLoading(false);                  
        })(); 
        
        return () => {
            setLoading(true);
            ListTitles = [];
        }
       
    }, []); 
  return(
   <section className="m-auto p-auto h-max">
    <Suspense fallback={<Home />}> 
    <List listTitles={ListTitles}/>
    </Suspense>    
   </section>  
  );
};
 
export default Browse;
