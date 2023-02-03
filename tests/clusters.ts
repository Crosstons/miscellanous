import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Clusters } from "../target/types/clusters";
import * as web3 from "@solana/web3.js";
import { TOKEN_PROGRAM_ID } from "@project-serum/anchor/dist/cjs/utils/token";
import { mintTo, createMint, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

describe("clusters", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();

  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Clusters as Program<Clusters>;

  const w1 = new Uint8Array([224,222,63,13,227,80,229,133,149,188,2,167,165,235,64,52,197,91,115,246,255,244,43,191,49,41,18,24,59,92,227,134,19,59,131,170,35,235,171,147,225,24,33,233,203,70,197,232,82,19,126,105,56,125,99,95,76,40,72,56,143,26,100,76]);
  let sign = web3.Keypair.fromSecretKey(w1);
  const cluster_program = anchor.web3.Keypair.generate();

  let [tokenPubKey, tokenBump] =
    anchor.web3.PublicKey.findProgramAddressSync(
    [cluster_program.publicKey.toBuffer()],
    program.programId
  );

  it("Basic Tests", async () => {
  const t1key = await createMint(provider.connection, sign, sign.publicKey, null, 1);
  const t2key = await createMint(provider.connection, sign, sign.publicKey, null, 1);
  const t3key = await createMint(provider.connection, sign, sign.publicKey, null, 1);

  console.log("-----------------Creating a Cluster-----------------");
  console.log();
    const tx = await program.methods.createCluster("Test", "TST", t1key, t2key, t3key)
    .accounts({
      cluster : cluster_program.publicKey,
      signer : sign.publicKey,
      clusterMint : tokenPubKey,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId,
    })
    .signers([cluster_program, sign])
    .rpc();  //.rpc();
    console.log("Cluster Created!", tx);
    console.log();

    const issuerOne = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t1key,sign.publicKey);
    const issuerTwo = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t2key,sign.publicKey);
    const issuerThree = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t3key,sign.publicKey);

    const testOne = await getOrCreateAssociatedTokenAccount(provider.connection,sign,t1key,cluster_program.publicKey);


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

    console.log("-----------------Initializing the Cluster-----------------");
    console.log();
try{
    const initTx = await program.methods.initCluster()
    .accounts({
      cluster : cluster_program.publicKey,
      signer : sign.publicKey,
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
    .signers([sign])
    .rpc();
    console.log("Cluster Inited", initTx);
  }
  catch(error){
    console.log(error);
  }
    console.log();

    const temp = await getOrCreateAssociatedTokenAccount(provider.connection, sign, tokenPubKey, sign.publicKey);
    console.log("-----------------Issuing a Cluster Token-----------------");
    console.log();
    await mintTo(provider.connection, sign, t1key, issuerOne.address, sign, 100000);
    await mintTo(provider.connection, sign, t2key, issuerTwo.address, sign, 100000);
    await mintTo(provider.connection, sign, t3key, issuerThree.address, sign, 100000);
try{    
    const tx2 = await program.methods.issueCluster(new anchor.BN(2), tokenBump)
    .accounts({
      cluster : cluster_program.publicKey,
      signer : sign.publicKey,
      issuerOne : issuerOne.address,
      issuerTwo : issuerTwo.address,
      issuerThree : issuerThree.address,
      clusterOne : mintOneAcc,
      clusterTwo : mintTwoAcc,
      clusterThree : mintThreeAcc,
      mintOne : t1key,
      mintTwo : t2key,
      mintThree : t3key,
      clusterToken : tokenPubKey,
      clusterTokenAccount : temp.address,
      tokenProgram : TOKEN_PROGRAM_ID,
      systemProgram : anchor.web3.SystemProgram.programId,
    })
    .signers([sign])
    .rpc();  //.rpc();
    console.log("Cluster Issued!", tx2);
    console.log();}
    catch(error){
      console.log(error);
    }
    
    console.log("-----------------Redeeming a Cluster Token-----------------");
    console.log();
    try{    
      const tx3 = await program.methods.redeemCluster(new anchor.BN(1), mintOneAccBump, mintTwoAccBump, mintThreeAccBump)
      .accounts({
        cluster : cluster_program.publicKey,
        signer : sign.publicKey,
        redeemerOne : issuerOne.address,
        redeemerTwo : issuerTwo.address,
        redeemerThree : issuerThree.address,
        clusterOne : mintOneAcc,
        clusterTwo : mintTwoAcc,
        clusterThree : mintThreeAcc,
        mintOne : t1key,
        mintTwo : t2key,
        mintThree : t3key,
        clusterToken : tokenPubKey,
        clusterTokenAccount : temp.address,
        tokenProgram : TOKEN_PROGRAM_ID,
        systemProgram : anchor.web3.SystemProgram.programId,
      })
      .signers([sign])
      .rpc();  //.rpc();
      console.log("Cluster Redeemed!", tx3);
      console.log();}
      catch(error){
        console.log(error);
      }
  });
});
