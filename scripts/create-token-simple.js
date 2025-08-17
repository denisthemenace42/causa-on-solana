const { 
  Connection, 
  Keypair, 
  PublicKey, 
  clusterApiUrl
} = require('@solana/web3.js');
const { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo, 
  TOKEN_2022_PROGRAM_ID
} = require('@solana/spl-token');

async function createTokenAndMint() {
  try {
    // Connect to Solana devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Your devnet wallet address
    const recipientWallet = new PublicKey('6CaVCUUAj3Y96CF14bDQpt1NnowmJjo4pwoKdXcSUcNG');
    
    // Use the previously generated mint authority (replace with your private key)
    // You can get this from the previous script run
    const mintAuthorityPrivateKey = process.env.MINT_AUTHORITY_PRIVATE_KEY;
    
    if (!mintAuthorityPrivateKey) {
      console.log('❌ Please set MINT_AUTHORITY_PRIVATE_KEY environment variable');
      console.log('Example: export MINT_AUTHORITY_PRIVATE_KEY="your_base64_private_key"');
      return;
    }
    
    const mintAuthority = Keypair.fromSecretKey(
      Buffer.from(mintAuthorityPrivateKey, 'base64')
    );
    
    console.log('🔑 Using mint authority:', mintAuthority.publicKey.toString());
    
    // Check balance
    const balance = await connection.getBalance(mintAuthority.publicKey);
    console.log('💰 Current balance:', (balance / 1e9).toFixed(4), 'SOL');
    
    if (balance < 0.05e9) {
      console.log('❌ Insufficient balance. Please fund the account first.');
      return;
    }
    
    // Create the mint using Token-2022 program
    console.log('\n🪙 Creating mint with Token-2022 program...');
    const mint = await createMint(
      connection,
      mintAuthority,
      mintAuthority.publicKey,
      mintAuthority.publicKey,
      9, // Decimals
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    
    console.log('✅ Mint created successfully!');
    console.log('Mint Address:', mint.toString());
    
    // Get or create the associated token account for the recipient
    console.log('\n🏦 Creating associated token account...');
    const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
      connection,
      mintAuthority,
      mint,
      recipientWallet,
      undefined,
      undefined,
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    
    console.log('✅ Associated token account created:');
    console.log('Token Account:', recipientTokenAccount.address.toString());
    
    // Mint tokens to the recipient
    console.log('\n🪙 Minting tokens...');
    const mintAmount = 1000000000; // 1 billion tokens (with 9 decimals)
    
    const signature = await mintTo(
      connection,
      mintAuthority,
      mint,
      recipientTokenAccount.address,
      mintAuthority,
      mintAmount,
      [],
      undefined,
      TOKEN_2022_PROGRAM_ID
    );
    
    console.log('✅ Tokens minted successfully!');
    console.log('Transaction signature:', signature);
    console.log('\n🎉 Summary:');
    console.log('Mint Address:', mint.toString());
    console.log('Recipient Wallet:', recipientWallet.toString());
    console.log('Token Account:', recipientTokenAccount.address.toString());
    console.log('Amount Minted:', mintAmount / Math.pow(10, 9), 'tokens');
    console.log('\n🔍 You can now view these tokens in Phantom wallet!');
    console.log('📱 Make sure Phantom is set to devnet network');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the script
createTokenAndMint();
