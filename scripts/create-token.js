const { 
  Connection, 
  Keypair, 
  PublicKey, 
  sendAndConfirmTransaction,
  Transaction,
  clusterApiUrl
} = require('@solana/web3.js');
const { 
  createMint, 
  getOrCreateAssociatedTokenAccount, 
  mintTo, 
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID
} = require('@solana/spl-token');
const readline = require('readline');

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Helper function to wait for user input
function waitForUserInput(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, () => {
      resolve();
    });
  });
}

// Helper function to check account balance
async function checkBalance(connection, publicKey) {
  try {
    const balance = await connection.getBalance(publicKey);
    return balance / 1e9; // Convert lamports to SOL
  } catch (error) {
    return 0;
  }
}

async function createTokenAndMint() {
  try {
    // Connect to Solana devnet
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');
    
    // Your devnet wallet address
    const recipientWallet = new PublicKey('6CaVCUUAj3Y96CF14bDQpt1NnowmJjo4pwoKdXcSUcNG');
    
    // Generate a new keypair for the mint authority (you'll need to fund this)
    const mintAuthority = Keypair.generate();
    
    console.log('🔑 Generated mint authority keypair:');
    console.log('Public Key:', mintAuthority.publicKey.toString());
    console.log('Private Key:', Buffer.from(mintAuthority.secretKey).toString('base64'));
    
    // Fund the mint authority with some SOL (you'll need to do this manually)
    console.log('\n💰 Please fund the mint authority with some SOL from a faucet:');
    console.log('🌐 Visit: https://faucet.solana.com/');
    console.log('📍 Address:', mintAuthority.publicKey.toString());
    console.log('💎 Amount: 0.1 SOL should be sufficient');
    
    // Wait for user to fund the account and check balance
    let balance = 0;
    while (balance < 0.05) { // Wait until we have at least 0.05 SOL
      console.log('\n⏳ Waiting for funding... Current balance:', balance.toFixed(4), 'SOL');
      console.log('Press Enter to check balance again, or wait a moment...');
      await waitForUserInput('');
      
      balance = await checkBalance(connection, mintAuthority.publicKey);
      
      if (balance < 0.05) {
        console.log('❌ Insufficient balance. Please fund the account and try again.');
      }
    }
    
    console.log('✅ Sufficient balance detected:', balance.toFixed(4), 'SOL');
    
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
  } finally {
    rl.close();
  }
}

// Run the script
createTokenAndMint();
