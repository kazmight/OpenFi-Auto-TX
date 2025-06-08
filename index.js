const { ethers } = require('ethers');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
require('dotenv').config();

const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    white: "\x1b[37m",
    bold: "\x1b[1m"
};

const logger = {
    info: (msg) => console.log(`${colors.green}[📣] ${msg}${colors.reset}`),
    warn: (msg) => console.log(`${colors.yellow}[⛔] ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}[❎] ${msg}${colors.reset}`),
    success: (msg) => console.log(`${colors.green}[✅] ${msg}${colors.reset}`),
    loading: (msg) => console.log(`${colors.cyan}[⌛] ${msg}${colors.reset}`),
    step: (msg) => console.log(`${colors.white}[🔄] ${msg}${colors.reset}`),
    userInfo: (msg) => console.log(`${colors.white}[📌] ${msg}${colors.reset}`),
    banner: () => {
        console.log(`${colors.cyan}${colors.bold}`);
        console.log('░█████╗░██████╗░███████╗███╗░░██╗███████╗██╗');
        console.log('██╔══██╗██╔══██╗██╔════╝████╗░██║██╔════╝██║');
        console.log('██║░░██║██████╔╝█████╗░░██╔██╗██║█████╗░░██║');
        console.log('██║░░██║██╔═══╝░██╔══╝░░██║╚████║██╔══╝░░██║');
        console.log('╚█████╔╝██║░░░░░███████╗██║░╚███║██║░░░░░██║');
        console.log('░╚════╝░╚═╝░░░░░╚══════╝╚═╝░░╚══╝╚═╝░░░░░╚═╝');
        console.log('\nby Kazmight');
        console.log(`${colors.reset}\n`);
    }
};

const NETWORK_CONFIG = {
    rpc: 'https://testnet.dplabs-internal.com',
    chainId: 688688,
    symbol: 'PHRS',
    explorer: 'https://pharos-testnet.socialscan.io/'
};

const CONTRACTS = {
    LENDING_POOL: '0xa8e550710bf113db6a1b38472118b8d6d5176d12', // Used for depositETH
    FAUCET: '0x2e9d89d372837f71cb529e5ba85bfbc1785c69cd', // Faucet for testnet tokens
    SUPPLY_CONTRACT: '0xad3b4e20412a097f87cd8e8d84fbbe17ac7c89e9', // Main lending pool for ERC20
    TOKENS: {
        NVIDIA: '0x3299cc551b2a39926bf14144e65630e533df6944',
        USDT: '0x0b00fb1f513e02399667fba50772b21f34c1b5d9',
        USDC: '0x48249feeb47a8453023f702f15cf00206eebdf08',
        GOLD: '0x77f532df5f46ddff1c97cdae3115271a523fa0f4',
        TSLA: '0xcda3df4aab8a571688fe493eb1bdc1ad210c09e4',
        BTC: '0xa4a967fc7cf0e9815bf5c2700a055813628b65be'
    }
};

const ERC20_ABI = [
    "function approve(address spender, uint256 amount) external returns (bool)",
    "function balanceOf(address account) external view returns (uint256)",
    "function decimals() external view returns (uint8)"
];

const FAUCET_ABI = [
    "function mint(address _asset, address _account, uint256 _amount) external"
];

const LENDING_POOL_ABI = [
    "function depositETH(address lendingPool, address onBehalfOf, uint16 referralCode) external payable",
    "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external",
    "function withdraw(address asset, uint256 amount, address to) external"
];

class PharosBot {
    constructor() {
        this.wallets = [];
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async initialize() {
        logger.banner();
        await this.loadWallets();
        logger.success(`Initialized with ${this.wallets.length} wallets`);
    }

    async loadWallets() {
        const privateKeys = [];
        let i = 1;

        while (process.env[`PRIVATE_KEY_${i}`]) {
            privateKeys.push(process.env[`PRIVATE_KEY_${i}`]);
            i++;
        }

        if (privateKeys.length === 0) {
            logger.error('No private keys found in .env file. Please add PRIVATE_KEY_1, PRIVATE_KEY_2, etc.');
            process.exit(1);
        }

        for (let j = 0; j < privateKeys.length; j++) {
            const provider = new ethers.JsonRpcProvider(NETWORK_CONFIG.rpc, {
                chainId: NETWORK_CONFIG.chainId,
                name: 'pharos-testnet'
            });
            const wallet = new ethers.Wallet(privateKeys[j], provider);
            this.wallets.push(wallet);
            logger.info(`Wallet ${j + 1}: ${wallet.address}`);
        }
    }

    async getUserInput(question) {
        return new Promise((resolve) => {
            this.rl.question(question, (answer) => {
                resolve(answer.trim());
            });
        });
    }

    async getRandomDelay(minSeconds, maxSeconds) {
        const delayMs = (Math.random() * (maxSeconds - minSeconds) + minSeconds) * 1000;
        logger.loading(`Delaying for ${delayMs / 1000} seconds...`);
        return new Promise(resolve => setTimeout(resolve, delayMs));
    }

    async showMenu() {
        console.log(`\n${colors.cyan}${colors.bold}---🚨OPENFI BOT MENU🚨---${colors.reset}`);
        console.log(`${colors.green}${colors.bold} Join Telegram Channel Dasar Pemulung${colors.reset}`);
        console.log(`${colors.white}1. Supply PHRS${colors.reset}`);
        console.log(`${colors.white}2. Mint Faucet Tokens${colors.reset}`);
        console.log(`${colors.white}3. Supply ERC20 Tokens${colors.reset}`);
        console.log(`${colors.white}4. Borrow Tokens${colors.reset}`);
        console.log(`${colors.white}5. Withdraw Tokens${colors.reset}`);
        console.log(`${colors.white}6. Exit${colors.reset}`);
        console.log(`${colors.cyan}------------------------------${colors.reset}\n`);

        const choice = await this.getUserInput('Select an option (1-6): ');
        return choice;
    }

    async promptTransactionDetails() {
        const transactions = await this.getUserInput('Enter number of transactions per wallet (e.g., 1-10): ');
        const minDelay = await this.getUserInput('Enter minimum delay between transactions in seconds (e.g., 10): ');
        const maxDelay = await this.getUserInput('Enter maximum delay between transactions in seconds (e.g., 30): ');

        const txCount = parseInt(transactions);
        const parsedMinDelay = parseFloat(minDelay);
        const parsedMaxDelay = parseFloat(maxDelay);

        if (isNaN(txCount) || txCount <= 0 || isNaN(parsedMinDelay) || parsedMinDelay < 0 || isNaN(parsedMaxDelay) || parsedMaxDelay < parsedMinDelay) {
            logger.error('Invalid input for transaction count or delay. Please enter valid numbers.');
            return null;
        }
        return { txCount, minDelay: parsedMinDelay, maxDelay: parsedMaxDelay };
    }

    async supplyPHRS() {
        logger.step('Starting PHRS Supply Process');

        const amount = await this.getUserInput('Enter amount of PHRS to supply: ');
        const details = await this.promptTransactionDetails();
        if (!details) return;
        const { txCount, minDelay, maxDelay } = details;

        const amountWei = ethers.parseEther(amount);

        for (let i = 0; i < this.wallets.length; i++) {
            const wallet = this.wallets[i];
            logger.loading(`Processing wallet ${i + 1}: ${wallet.address}`);

            try {
                const balance = await wallet.provider.getBalance(wallet.address);
                logger.info(`Wallet balance: ${ethers.formatEther(balance)} PHRS`);

                if (balance < amountWei * BigInt(txCount)) {
                    logger.warn(`Insufficient balance for wallet ${i + 1}. Skipping.`);
                    continue;
                }

                const lendingContract = new ethers.Contract(
                    CONTRACTS.LENDING_POOL,
                    LENDING_POOL_ABI,
                    wallet
                );

                for (let j = 0; j < txCount; j++) {
                    try {
                        logger.loading(`Transaction ${j + 1}/${txCount} for wallet ${i + 1}`);

                        const tx = await lendingContract.depositETH(
                            '0x0000000000000000000000000000000000000000', // ETH_ADDRESS for native currency
                            wallet.address,
                            0, // referralCode
                            { value: amountWei }
                        );

                        logger.success(`TX Hash: ${tx.hash}`);
                        await tx.wait();
                        logger.success(`Transaction ${j + 1} confirmed`);

                        if (j < txCount - 1) {
                            await this.getRandomDelay(minDelay, maxDelay);
                        }
                    } catch (error) {
                        logger.error(`Transaction ${j + 1} failed for wallet ${i + 1}: ${error.message}`);
                    }
                }
            } catch (error) {
                logger.error(`Error processing wallet ${i + 1}: ${error.message}`);
            }

            if (i < this.wallets.length - 1) {
                await this.getRandomDelay(minDelay, maxDelay); // Delay between wallets
            }
        }
        logger.success('PHRS Supply Process Completed.');
    }

    async mintFaucetTokens() {
        logger.step('Starting Faucet Token Minting');

        console.log('\nAvailable tokens for minting:');
        const tokenNames = Object.keys(CONTRACTS.TOKENS);
        tokenNames.forEach((token, index) => {
            console.log(`${index + 1}. ${token}`);
        });

        const tokenChoice = await this.getUserInput('Select token to mint (1-6): ');
        const tokenIndex = parseInt(tokenChoice) - 1;

        if (tokenIndex < 0 || tokenIndex >= tokenNames.length) {
            logger.error('Invalid token selection');
            return;
        }

        const selectedToken = tokenNames[tokenIndex];
        const tokenAddress = CONTRACTS.TOKENS[selectedToken];

        const amount = await this.getUserInput(`Enter amount of ${selectedToken} to mint: `);
        const details = await this.promptTransactionDetails();
        if (!details) return;
        const { txCount, minDelay, maxDelay } = details;

        const decimals = (selectedToken === 'USDT' || selectedToken === 'USDC' || selectedToken === 'BTC') ? 6 : 18;
        const amountWei = ethers.parseUnits(amount, decimals);

        for (let i = 0; i < this.wallets.length; i++) {
            const wallet = this.wallets[i];
            logger.loading(`Processing wallet ${i + 1}: ${wallet.address}`);

            try {
                const faucetContract = new ethers.Contract(
                    CONTRACTS.FAUCET,
                    FAUCET_ABI,
                    wallet
                );

                for (let j = 0; j < txCount; j++) {
                    try {
                        logger.loading(`Minting ${selectedToken} - Transaction ${j + 1}/${txCount} for wallet ${i + 1}`);

                        const tx = await faucetContract.mint(
                            tokenAddress,
                            wallet.address,
                            amountWei
                        );

                        logger.success(`TX Hash: ${tx.hash}`);
                        await tx.wait();
                        logger.success(`Mint transaction ${j + 1} confirmed`);

                        if (j < txCount - 1) {
                            await this.getRandomDelay(minDelay, maxDelay);
                        }
                    } catch (error) {
                        logger.error(`Mint transaction ${j + 1} failed for wallet ${i + 1}: ${error.message}`);
                    }
                }
            } catch (error) {
                logger.error(`Error processing wallet ${i + 1}: ${error.message}`);
            }

            if (i < this.wallets.length - 1) {
                await this.getRandomDelay(minDelay, maxDelay); // Delay between wallets
            }
        }
        logger.success('Faucet Token Minting Process Completed.');
    }

    async supplyERC20Tokens() {
        logger.step('Starting ERC20 Token Supply');

        console.log('\nAvailable tokens for supply:');
        const tokenNames = Object.keys(CONTRACTS.TOKENS);
        tokenNames.forEach((token, index) => {
            console.log(`${index + 1}. ${token}`);
        });

        const tokenChoice = await this.getUserInput('Select token to supply (1-6): ');
        const tokenIndex = parseInt(tokenChoice) - 1;

        if (tokenIndex < 0 || tokenIndex >= tokenNames.length) {
            logger.error('Invalid token selection');
            return;
        }

        const selectedToken = tokenNames[tokenIndex];
        const tokenAddress = CONTRACTS.TOKENS[selectedToken];

        const amount = await this.getUserInput(`Enter amount of ${selectedToken} to supply: `);
        const details = await this.promptTransactionDetails();
        if (!details) return;
        const { txCount, minDelay, maxDelay } = details;

        const decimals = (selectedToken === 'USDT' || selectedToken === 'USDC' || selectedToken === 'BTC') ? 6 : 18;
        const amountWei = ethers.parseUnits(amount, decimals);

        for (let i = 0; i < this.wallets.length; i++) {
            const wallet = this.wallets[i];
            logger.loading(`Processing wallet ${i + 1}: ${wallet.address}`);

            try {
                const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, wallet);

                for (let j = 0; j < txCount; j++) {
                    try {
                        logger.loading(`Approving ${selectedToken} - Transaction ${j + 1}/${txCount} for wallet ${i + 1}`);

                        const approveTx = await tokenContract.approve(
                            CONTRACTS.SUPPLY_CONTRACT,
                            ethers.MaxUint256 // Approve for maximum amount
                        );

                        logger.info(`Approve TX Hash: ${approveTx.hash}`);
                        await approveTx.wait();
                        logger.success(`Approve transaction ${j + 1} confirmed`);

                        logger.loading(`Supplying ${selectedToken} - Transaction ${j + 1}/${txCount} for wallet ${i + 1}`);

                        // Encode the supply function data
                        const iface = new ethers.Interface([
                            "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode)"
                        ]);

                        const supplyData = iface.encodeFunctionData("supply", [
                            tokenAddress,
                            amountWei,
                            wallet.address,
                            0 // referralCode
                        ]);

                        const supplyTx = await wallet.sendTransaction({
                            to: CONTRACTS.SUPPLY_CONTRACT,
                            data: supplyData,
                            gasLimit: 500000 // Adjust gas limit if needed
                        });

                        logger.success(`Supply TX Hash: ${supplyTx.hash}`);
                        await supplyTx.wait();
                        logger.success(`Supply transaction ${j + 1} confirmed`);

                        if (j < txCount - 1) {
                            await this.getRandomDelay(minDelay, maxDelay);
                        }
                    } catch (error) {
                        logger.error(`Supply transaction ${j + 1} failed for wallet ${i + 1}: ${error.message}`);
                    }
                }
            } catch (error) {
                logger.error(`Error processing wallet ${i + 1}: ${error.message}`);
            }

            if (i < this.wallets.length - 1) {
                await this.getRandomDelay(minDelay, maxDelay); // Delay between wallets
            }
        }
        logger.success('ERC20 Token Supply Process Completed.');
    }

    async borrowTokens() {
        logger.step('Starting Token Borrow Process');

        console.log('\nAvailable tokens for borrowing:');
        const tokenNames = Object.keys(CONTRACTS.TOKENS);
        tokenNames.forEach((token, index) => {
            console.log(`${index + 1}. ${token}`);
        });

        const tokenChoice = await this.getUserInput('Select token to borrow (1-6): ');
        const tokenIndex = parseInt(tokenChoice) - 1;

        if (tokenIndex < 0 || tokenIndex >= tokenNames.length) {
            logger.error('Invalid token selection');
            return;
        }

        const selectedToken = tokenNames[tokenIndex];
        const tokenAddress = CONTRACTS.TOKENS[selectedToken];

        const amount = await this.getUserInput(`Enter amount of ${selectedToken} to borrow: `);
        const details = await this.promptTransactionDetails();
        if (!details) return;
        const { txCount, minDelay, maxDelay } = details;

        const decimals = (selectedToken === 'USDT' || selectedToken === 'USDC' || selectedToken === 'BTC') ? 6 : 18;
        const amountWei = ethers.parseUnits(amount, decimals);

        for (let i = 0; i < this.wallets.length; i++) {
            const wallet = this.wallets[i];
            logger.loading(`Processing wallet ${i + 1}: ${wallet.address}`);

            try {
                for (let j = 0; j < txCount; j++) {
                    try {
                        logger.loading(`Borrowing ${selectedToken} - Transaction ${j + 1}/${txCount} for wallet ${i + 1}`);

                        const iface = new ethers.Interface([
                            "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf)"
                        ]);

                        const borrowData = iface.encodeFunctionData("borrow", [
                            tokenAddress,
                            amountWei,
                            2, // interestRateMode: 1 for stable, 2 for variable
                            0, // referralCode
                            wallet.address
                        ]);

                        const tx = await wallet.sendTransaction({
                            to: CONTRACTS.SUPPLY_CONTRACT,
                            data: borrowData,
                            gasLimit: 500000 // Adjust gas limit if needed
                        });

                        logger.success(`Borrow TX Hash: ${tx.hash}`);
                        await tx.wait();
                        logger.success(`Borrow transaction ${j + 1} confirmed`);

                        if (j < txCount - 1) {
                            await this.getRandomDelay(minDelay, maxDelay);
                        }
                    } catch (error) {
                        logger.error(`Borrow transaction ${j + 1} failed for wallet ${i + 1}: ${error.message}`);
                    }
                }
            } catch (error) {
                logger.error(`Error processing wallet ${i + 1}: ${error.message}`);
            }

            if (i < this.wallets.length - 1) {
                await this.getRandomDelay(minDelay, maxDelay); // Delay between wallets
            }
        }
        logger.success('Token Borrow Process Completed.');
    }

    async withdrawTokens() {
        logger.step('Starting Token Withdraw Process');

        console.log('\nAvailable tokens for withdrawal:');
        const tokenNames = Object.keys(CONTRACTS.TOKENS);
        tokenNames.forEach((token, index) => {
            console.log(`${index + 1}. ${token}`);
        });

        const tokenChoice = await this.getUserInput('Select token to withdraw (1-6): ');
        const tokenIndex = parseInt(tokenChoice) - 1;

        if (tokenIndex < 0 || tokenIndex >= tokenNames.length) {
            logger.error('Invalid token selection');
            return;
        }

        const selectedToken = tokenNames[tokenIndex];
        const tokenAddress = CONTRACTS.TOKENS[selectedToken];

        const amount = await this.getUserInput(`Enter amount of ${selectedToken} to withdraw: `);
        const details = await this.promptTransactionDetails();
        if (!details) return;
        const { txCount, minDelay, maxDelay } = details;

        const decimals = (selectedToken === 'USDT' || selectedToken === 'USDC' || selectedToken === 'BTC') ? 6 : 18;
        const amountWei = ethers.parseUnits(amount, decimals);

        for (let i = 0; i < this.wallets.length; i++) {
            const wallet = this.wallets[i];
            logger.loading(`Processing wallet ${i + 1}: ${wallet.address}`);

            try {
                for (let j = 0; j < txCount; j++) {
                    try {
                        logger.loading(`Withdrawing ${selectedToken} - Transaction ${j + 1}/${txCount} for wallet ${i + 1}`);

                        const iface = new ethers.Interface([
                            "function withdraw(address asset, uint256 amount, address to)"
                        ]);

                        const withdrawData = iface.encodeFunctionData("withdraw", [
                            tokenAddress,
                            amountWei,
                            wallet.address
                        ]);

                        const tx = await wallet.sendTransaction({
                            to: CONTRACTS.SUPPLY_CONTRACT,
                            data: withdrawData,
                            gasLimit: 500000 // Adjust gas limit if needed
                        });

                        logger.success(`Withdraw TX Hash: ${tx.hash}`);
                        await tx.wait();
                        logger.success(`Withdraw transaction ${j + 1} confirmed`);

                        if (j < txCount - 1) {
                            await this.getRandomDelay(minDelay, maxDelay);
                        }
                    } catch (error) {
                        logger.error(`Withdraw transaction ${j + 1} failed for wallet ${i + 1}: ${error.message}`);
                    }
                }
            } catch (error) {
                logger.error(`Error processing wallet ${i + 1}: ${error.message}`);
            }

            if (i < this.wallets.length - 1) {
                await this.getRandomDelay(minDelay, maxDelay); // Delay between wallets
            }
        }
        logger.success('Token Withdraw Process Completed.');
    }

    async run() {
        try {
            await this.initialize();

            while (true) {
                const choice = await this.showMenu();

                switch (choice) {
                    case '1':
                        await this.supplyPHRS();
                        break;
                    case '2':
                        await this.mintFaucetTokens();
                        break;
                    case '3':
                        await this.supplyERC20Tokens();
                        break;
                    case '4':
                        await this.borrowTokens();
                        break;
                    case '5':
                        await this.withdrawTokens();
                        break;
                    case '6':
                        logger.success('Exiting bot...');
                        this.rl.close();
                        process.exit(0);
                        break;
                    default:
                        logger.error('Invalid choice. Please select 1-6.');
                }

                await this.getUserInput('\nPress Enter to continue...');
            }
        } catch (error) {
            logger.error(`Fatal error: ${error.message}`);
            this.rl.close();
            process.exit(1);
        }
    }
}

const bot = new PharosBot();
bot.run().catch(console.error);
