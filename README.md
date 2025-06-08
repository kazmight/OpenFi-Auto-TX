## OpenFi Bot
A robust Node.js bot for automating interactions with the Pharos Testnet lending protocol. This bot supports multiple wallets and allows users to supply native tokens (PHRS), mint faucet ERC20 tokens, supply ERC20 tokens, borrow, and withdraw, all with customizable transaction counts and delays.

## Jangan lupa join telegram channel Dasar Pemulung untuk update seputar script/bot airdrop.
## Link telegram: https://t.me/dasarpemulung

## ✨ Features
- Multi-Wallet Support: Manage transactions across multiple private keys loaded from a .env file.
- PHRS Supply: Deposit native PHRS tokens into the lending pool.
- Faucet Token Minting: Obtain testnet ERC20 tokens (USDC, NVIDIA, USDT, GOLD, TSLA, BTC) from the faucet.
- ERC20 Token Supply: Deposit various ERC20 tokens into the lending pool. Includes automatic approval and handles nonce management for reliable transactions.
- Token Borrowing: Borrow supported tokens from the lending pool.
- Token Withdrawal: Withdraw previously supplied tokens.
- Customizable Transactions: Set the number of transactions per wallet and a fixed delay between them.
- Robust Error Handling: Implements explicit nonce management and retry mechanisms to combat common blockchain errors like TX_REPLAY_ATTACK.
- Detailed Logging: Provides clear, colored console output with transaction hashes and direct links to the Pharos Testnet explorer for easy tracking.

## 🛠️ Setup
Follow these steps to get your OpenFi Bot up and running.

## Prerequisites
Make sure you have Node.js installed on your system. You can download it from nodejs.org.

## 1. Clone Repository:
```Bash
git clone https://github.com/kazmight/OpenFi-Auto-TX.git
cd OpenFi-Auto-TX
```

## 2. Instal Dependensi:
```Bash
npm install
```

## 3. Configure Your Wallets
Opens a .env file in the root directory of your project. This file will securely store your private keys.
PRIVATE_KEY_1=0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b
PRIVATE_KEY_2=0xf1e2d3c4b5a67b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c
⚠️ Security Warning: Never share your private keys. The .env file keeps them out of your main codebase, but ensure your .env file is not committed to public repositories. Add .env to your .gitignore file if you haven't already.


🚀 Usage
Once set up, running the bot is straightforward.

## 4. Run the Bot
Execute the script using Node.js:
```Bash
node index.js
```

## 🛑Disclaimer
Bot ini disediakan hanya untuk tujuan edukasi dan pengujian di testnet. Penggunaan di mainnet atau untuk tujuan farming airdrop yang melanggar ketentuan layanan platform mana pun adalah risiko Anda sendiri. Selalu berhati-hati dan pahami risiko yang terkait dengan penggunaan alat otomatis.

## 🤝Contributing
Contributions are welcome! If you have suggestions for improvements or encounter issues, please open an issue or submit a pull request.

## 📜License
This project is licensed under the MIT License. See the LICENSE file for details.

## 🙏Credits
Kazmight - Initial development
ethers.js - For robust Ethereum interaction
dotenv - For secure environment variable loading
