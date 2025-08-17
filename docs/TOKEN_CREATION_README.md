# Token Creation Script

This script creates a new SPL Token-2022 mint on Solana devnet and mints tokens to your specified wallet address.

## Prerequisites

- Node.js installed on your system
- The project dependencies installed (`npm install`)

## How to Use

### 1. Run the Script

```bash
npm run create-token
```

Or directly with Node.js:

```bash
node create-token.js
```

### 2. Follow the Interactive Steps

The script will:

1. **Generate a mint authority keypair** - This is a new wallet that will control the mint
2. **Display the public key** - You'll need to fund this wallet
3. **Wait for you to fund the mint authority** - Use the Solana faucet to send 0.1 SOL
4. **Create the mint** - Using the Token-2022 program
5. **Create an associated token account** - For your recipient wallet
6. **Mint tokens** - 1 billion tokens will be minted to your wallet

### 3. Fund the Mint Authority

When the script prompts you, visit [Solana Faucet](https://faucet.solana.com/) and send 0.1 SOL to the displayed mint authority address.

### 4. Complete the Process

After funding, press Enter in the terminal to continue. The script will complete the token creation and minting process.

## What You'll Get

- **Mint Address**: The unique identifier for your new token
- **Token Account**: The associated token account in your wallet
- **1 Billion Tokens**: Minted to your devnet wallet (6CaVCUUAj3Y96CF14bDQpt1NnowmJjo4pwoKdXcSUcNG)

## Viewing Your Tokens

Once the script completes successfully, you can view your tokens in:

- **Phantom Wallet**: Switch to devnet and you'll see the new token
- **Solana Explorer**: Look up your wallet address on devnet
- **Solscan**: Check your wallet on devnet

## Token Details

- **Program**: Token-2022 (latest SPL token standard)
- **Network**: Solana Devnet
- **Decimals**: 9
- **Supply**: 1,000,000,000 tokens
- **Mint Authority**: The generated keypair (you control this)

## Troubleshooting

- **Insufficient SOL**: Make sure the mint authority has at least 0.1 SOL
- **Network Issues**: Ensure you're connected to devnet
- **Permission Errors**: The script needs to create accounts and mint tokens

## Security Note

The generated private key for the mint authority is displayed in the console. In a production environment, you should:
- Store this securely
- Never share it publicly
- Consider using a hardware wallet for production mints
