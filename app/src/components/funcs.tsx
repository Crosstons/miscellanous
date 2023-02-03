import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import idl from './idl.json';
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { getAssociatedTokenAddressSync, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";

// const w1 = new Uint8Array([224,222,63,13,227,80,229,133,149,188,2,167,165,235,64,52,197,91,115,246,255,244,43,191,49,41,18,24,59,92,227,134,19,59,131,170,35,235,171,147,225,24,33,233,203,70,197,232,82,19,126,105,56,125,99,95,76,40,72,56,143,26,100,76]);
let sign = Keypair.fromSecretKey(bs58.decode("5VkzGkU6FDr1HKhs5Z3o7SoD66KJHPcbUik9KcWAH1KXUqpxWJhJyZhVxXfLqQAkB8mFyfN4Y8ZD9p7fxPkZVTQo"));

export const getProvider = (wallet : any) => {

    if(!wallet) {
        return null;
    }
    const network = "https://api.devnet.solana.com";
    const connection = new Connection(network, "processed");

    const provider = new anchor.AnchorProvider(
        connection, wallet, {"preflightCommitment" : "processed"},
    )
    return provider;
}

export const createCluster = async (wallet : any, clusterName : String, clusterSymbol : String, keyOne : PublicKey, keyTwo : PublicKey, keyThree : PublicKey) => {
    const provider = getProvider(wallet);
    if(!provider) {
        throw("Provider is null");
    }
    const cluster_program = anchor.web3.Keypair.generate();
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);
    let [tokenPubKey, tokenBump] =
        anchor.web3.PublicKey.findProgramAddressSync(
        [cluster_program.publicKey.toBuffer()],
        program.programId
    );
    try{
        await program.methods.createCluster(clusterName, clusterSymbol, keyOne, keyTwo, keyThree)
        .accounts({
          cluster : cluster_program.publicKey,
          signer : provider.wallet.publicKey,
          clusterMint : tokenPubKey,
          tokenProgram : TOKEN_PROGRAM_ID,
          systemProgram : anchor.web3.SystemProgram.programId,
        })
        .signers([cluster_program])
        .rpc();
        console.log("Tx Successful");
    } catch(error){
        console.log(error);
    }
}

export const initCluster = async (wallet : any, cluster_program : PublicKey, t1key : PublicKey, t2key : PublicKey, t3key : PublicKey) => {
    const provider = getProvider(wallet);
    if(!provider) {
        throw("Provider is null");
    }
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);

    const [mintOneAcc, mintOneAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t1key.toBuffer()],
        program.programId
      );
  
      const [mintTwoAcc, mintTwoAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t2key.toBuffer()],
        program.programId
      );
  
      const [mintThreeAcc, mintThreeAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t3key.toBuffer()],
        program.programId
      );
//    const clusterAccounts = await program.account.cluster.all();
//    console.log(clusterAccounts);
    try{
        await program.methods.initCluster()
        .accounts({
        cluster : cluster_program,
        signer : provider.wallet.publicKey,
        mintOne : t1key,
        mintTwo : t2key,
        mintThree : t3key,
        mintOneAccount : mintOneAcc,
        mintTwoAccount : mintTwoAcc,
        mintThreeAccount : mintThreeAcc,
        tokenProgram : TOKEN_PROGRAM_ID,
        systemProgram : anchor.web3.SystemProgram.programId,
        rent : anchor.web3.SYSVAR_RENT_PUBKEY,
        })
        .signers([])
        .rpc();
            console.log("Tx Successful");
        } catch(error) {
            console.log(error);
        }
} 

export const issueCluster = async (wallet : any, cluster_program : PublicKey, amount : any, t1key : PublicKey, t2key : PublicKey, t3key : PublicKey) => {
    const provider = getProvider(wallet);
    if(!provider) {
        throw("Provider is null");
    }
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);

    const [mintOneAcc, mintOneAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t1key.toBuffer()],
        program.programId
      );
  
    const [mintTwoAcc, mintTwoAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t2key.toBuffer()],
        program.programId
      );
  
    const [mintThreeAcc, mintThreeAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t3key.toBuffer()],
        program.programId
      );

    let [tokenPubKey, tokenBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
      [cluster_program.toBuffer()],
      program.programId
    );

    const issuerOne = getAssociatedTokenAddressSync(t1key, provider.wallet.publicKey);
    const issuerTwo = getAssociatedTokenAddressSync(t2key, provider.wallet.publicKey);
    const issuerThree = getAssociatedTokenAddressSync(t3key, provider.wallet.publicKey);
    const clustTokAcc = getAssociatedTokenAddressSync(tokenPubKey, provider.wallet.publicKey);

    try{
        await program.methods.issueCluster(new anchor.BN(amount), tokenBump)
        .accounts({
        cluster : cluster_program,
        signer : provider.wallet.publicKey,
        issuerOne : issuerOne,
        issuerTwo : issuerTwo,
        issuerThree : issuerThree,
        clusterOne : mintOneAcc,
        clusterTwo : mintTwoAcc,
        clusterThree : mintThreeAcc,
        mintOne : t1key,
        mintTwo : t2key,
        mintThree : t3key,
        clusterToken : tokenPubKey,
        clusterTokenAccount : clustTokAcc,
        tokenProgram : TOKEN_PROGRAM_ID,
        systemProgram : anchor.web3.SystemProgram.programId,
        })
        .signers([])
        .rpc();
            console.log("Tx Successful");
        } catch(error){
            console.log(error);
        }
}

export const redeemCluster = async (wallet : any, cluster_program : PublicKey, amount : any, t1key : PublicKey, t2key : PublicKey, t3key : PublicKey) => {
    const provider = getProvider(wallet);
    if(!provider) {
        throw("Provider is null");
    }
    const temp = JSON.parse(JSON.stringify(idl));
    const program = new anchor.Program(temp, temp.metadata.address, provider);

    const [mintOneAcc, mintOneAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t1key.toBuffer()],
        program.programId
      );
  
    const [mintTwoAcc, mintTwoAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t2key.toBuffer()],
        program.programId
      );
  
    const [mintThreeAcc, mintThreeAccBump] = anchor.web3.PublicKey.findProgramAddressSync(
        [t3key.toBuffer()],
        program.programId
      );

    let [tokenPubKey, tokenBump] =
      anchor.web3.PublicKey.findProgramAddressSync(
      [cluster_program.toBuffer()],
      program.programId
    );

    const redeemerOne = getAssociatedTokenAddressSync(t1key, provider.wallet.publicKey);
    const redeemerTwo = getAssociatedTokenAddressSync(t2key, provider.wallet.publicKey);
    const redeemerThree = getAssociatedTokenAddressSync(t3key, provider.wallet.publicKey);
    const clustTokAcc = getAssociatedTokenAddressSync(tokenPubKey, provider.wallet.publicKey);
    try{
    await program.methods.redeemCluster(new anchor.BN(1), mintOneAccBump, mintTwoAccBump, mintThreeAccBump)
    .accounts({
      cluster : cluster_program,
      signer : provider.wallet.publicKey,
      redeemerOne : redeemerOne,
      redeemerTwo : redeemerTwo,
      redeemerThree : redeemerThree,
      clusterOne : mintOneAcc,
      clusterTwo : mintTwoAcc,
      clusterThree : mintThreeAcc,
      mintOne : t1key,
      mintTwo : t2key,
      mintThree : t3key,
      clusterToken : tokenPubKey,
      clusterTokenAccount : clustTokAcc,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId,
    })
    .signers([])
    .rpc(); 
        console.log("Tx Successful");
    } catch(error){
        console.log(error);
    }
}


//// Create A Functionality inside the Solana Program to initialize token accounts individually for each mint in Future ////////////

export const createTokenAccounts = async (wallet : any, cluster_program : PublicKey, t1key : PublicKey, t2key : PublicKey, t3key : PublicKey) => {
  const provider = getProvider(wallet);
  if(!provider) {
      throw("Provider is null");
  }
  const network = "https://api.devnet.solana.com";
  const connection = new Connection(network, "processed");
  const temp = JSON.parse(JSON.stringify(idl));
  const program = new anchor.Program(temp, temp.metadata.address, provider);
  let [tokenPubKey, tokenBump] =
  anchor.web3.PublicKey.findProgramAddressSync(
  [cluster_program.toBuffer()],
  program.programId
  );
  try{
    await connection.requestAirdrop(sign.publicKey, 2e9);
    const temp = await getOrCreateAssociatedTokenAccount(provider.connection, sign, tokenPubKey, provider.wallet.publicKey);
    const issuerOne = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t1key,provider.wallet.publicKey);
    const issuerTwo = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t2key,provider.wallet.publicKey);
    const issuerThree = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t3key,provider.wallet.publicKey);
    console.log("Done");
  } catch(error) {
    console.log(error);
  }
}

export const faucetTestTokens = async (wallet : any, t1key : PublicKey, t2key : PublicKey, t3key : PublicKey) => {
  const provider = getProvider(wallet);
  if(!provider) {
      throw("Provider is null");
  }
  try{
    const issuerOne = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t1key,provider.wallet.publicKey);
    const issuerTwo = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t2key,provider.wallet.publicKey);
    const issuerThree = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t3key,provider.wallet.publicKey);
    await mintTo(provider.connection, sign, t1key, issuerOne.address, provider.wallet.publicKey, 100000);
    await mintTo(provider.connection, sign, t2key, issuerTwo.address, provider.wallet.publicKey, 100000);
    await mintTo(provider.connection, sign, t3key, issuerThree.address, provider.wallet.publicKey, 100000);
    console.log("Done")
  } catch(error){
    console.log(error);
  }
}

export const getClusters = async (wallet : any) => {
  const provider = getProvider(wallet);
  if(!provider) {
    throw("Provider is null");
}
const temp = JSON.parse(JSON.stringify(idl));
const program = new anchor.Program(temp, temp.metadata.address, provider);
  const clusterAccounts = await program.account.cluster.all();
//  for(const i of clusterAccounts){
//    console.log(i.publicKey.toBase58());
//+  }
  return clusterAccounts;
}