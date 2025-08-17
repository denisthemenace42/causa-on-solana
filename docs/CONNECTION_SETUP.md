# Solana Connection Setup

This project uses a centralized Solana connection configuration that reads from environment variables.

## Configuration

### Environment Variables
The RPC URL is configured in `app.json` under the `extra` section:

```json
{
  "expo": {
    "extra": {
      "rpcUrl": "https://devnet.helius-rpc.com/?api-key=YOUR_API_KEY"
    }
  }
}
```

### Configuration File
The centralized configuration is in `src/config/env.ts`:

```typescript
import Constants from 'expo-constants';

export const config = {
  rpcUrl: Constants.expoConfig?.extra?.rpcUrl || 'https://api.devnet.solana.com',
  commitment: 'confirmed' as const,
} as const;
```

## Usage

### Using the Connection
All components that need a Solana connection should use the `useConnection` hook:

```typescript
import { useConnection } from '../utils/ConnectionProvider';

export function MyComponent() {
  const { connection } = useConnection();
  
  // Use connection.getBalance(), connection.getAccountInfo(), etc.
  const balance = await connection.getBalance(publicKey);
}
```

### Connection Provider
The `ConnectionProvider` wraps your app and provides a centralized connection instance:

```typescript
import { ConnectionProvider } from './src/utils/ConnectionProvider';

export default function App() {
  return (
    <ConnectionProvider>
      {/* Your app components */}
    </ConnectionProvider>
  );
}
```

## Benefits

1. **Centralized Configuration**: All RPC endpoints are configured in one place
2. **Environment Flexibility**: Easy to switch between devnet, testnet, and mainnet
3. **Consistent Connection**: All components use the same connection instance
4. **Easy Debugging**: Console logging shows which endpoint is being used
5. **Fallback Support**: Automatic fallback to default endpoints if configuration is missing

## Switching Networks

To switch networks, update the `rpcUrl` in `app.json`:

- **Devnet**: `https://api.devnet.solana.com`
- **Testnet**: `https://api.testnet.solana.com`
- **Mainnet**: `https://api.mainnet-beta.solana.com`
- **Custom**: Your Helius or other RPC endpoint

## Debugging

The connection provider logs connection details to the console:
```
🔗 Solana Connection created with: {
  rpcUrl: "https://devnet.helius-rpc.com/?api-key=...",
  commitment: "confirmed",
  endpoint: "https://devnet.helius-rpc.com/?api-key=..."
}
```

## Security Notes

- Never commit API keys to version control
- Use environment-specific configuration files
- Consider using Expo's secure store for sensitive configuration
- Rotate API keys regularly
