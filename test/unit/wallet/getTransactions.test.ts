import getTransactionHistory from "../../../src/wallet/tools/getTransactionHistory";
import { SolanaAgentKit, KeypairWallet } from "solana-agent-kit";
import { Keypair, Connection } from "@solana/web3.js";
import dotenv from "dotenv";

dotenv.config();

// Mock fetch globally
global.fetch = jest.fn();

describe("getTransactionHistory", () => {
    let agent: SolanaAgentKit;
    let mockFetch: jest.MockedFunction<typeof fetch>;

    beforeEach(() => {
        // Reset mocks
        mockFetch = fetch as jest.MockedFunction<typeof fetch>;
        mockFetch.mockClear();

        // Create test agent
        const rpcUrl = "https://api.mainnet-beta.solana.com";
        const keypair = Keypair.generate();
        const wallet = new KeypairWallet(keypair, rpcUrl);
        const connection = new Connection(rpcUrl, "confirmed");

        agent = new SolanaAgentKit(wallet, rpcUrl, {
            OTHER_API_KEYS: {
                HELIUS_API_KEY: "test-api-key",
            },
        });
        agent.connection = connection;
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should successfully fetch and parse transaction history", async () => {
        const mockHeliusResponse = [
            {
                description: "Test Token Transfer",
                type: "TRANSFER",
                source: "JUPITER",
                fee: 5000,
                feePayer: "TestFeePayer123",
                signature: "TestSignature123",
                slot: 123456,
                timestamp: 1643723400,
                tokenTransfers: [
                    {
                        fromTokenAccount: "FromAccount123",
                        toTokenAccount: "ToAccount123",
                        fromUserAccount: "FromUser123",
                        toUserAccount: "ToUser123",
                        tokenAmount: 1000000,
                        mint: "TestMint123",
                        tokenStandard: "spl-token",
                    },
                ],
                nativeTransfers: [],
                accountData: [],
                transactionError: null,
                instructions: [],
                events: null,
            },
            {
                description: "SOL Transfer",
                type: "TRANSFER",
                source: "SYSTEM_PROGRAM",
                fee: 5000,
                feePayer: "TestFeePayer456",
                signature: "TestSignature456",
                slot: 123457,
                timestamp: 1643723500,
                tokenTransfers: [],
                nativeTransfers: [
                    {
                        fromUserAccount: "FromUser456",
                        toUserAccount: "ToUser456",
                        amount: 1000000000, // 1 SOL in lamports
                    },
                ],
                accountData: [],
                transactionError: null,
                instructions: [],
                events: null,
            },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockHeliusResponse,
        } as Response);

        const result = await getTransactionHistory(agent);

        expect(result).toHaveLength(2);

        // Check first transaction (token transfer)
        expect(result[0]).toEqual({
            signature: "TestSignature123",
            timestamp: 1643723400,
            slot: 123456,
            type: "TRANSFER",
            status: "success",
            fee: 0.000005,
            amount: 1000000,
            tokenMint: "TestMint123",
            from: "FromUser123",
            to: "ToUser123",
            description: "Test Token Transfer",
            source: "JUPITER",
        });

        // Check second transaction (SOL transfer)
        expect(result[1]).toEqual({
            signature: "TestSignature456",
            timestamp: 1643723500,
            slot: 123457,
            type: "TRANSFER",
            status: "success",
            fee: 0.000005,
            amount: 1,
            tokenSymbol: "SOL",
            from: "FromUser456",
            to: "ToUser456",
            description: "SOL Transfer",
            source: "SYSTEM_PROGRAM",
        });
    });

    it("should handle failed transactions", async () => {
        const mockHeliusResponse = [
            {
                description: "Failed Transfer",
                type: "TRANSFER",
                source: "JUPITER",
                fee: 5000,
                feePayer: "TestFeePayer123",
                signature: "FailedSignature123",
                slot: 123456,
                timestamp: 1643723400,
                tokenTransfers: [],
                nativeTransfers: [],
                accountData: [],
                transactionError: { error: "Insufficient funds" },
                instructions: [],
                events: null,
            },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockHeliusResponse,
        } as Response);

        const result = await getTransactionHistory(agent);

        expect(result).toHaveLength(1);
        expect(result[0].status).toBe("failed");
    });

    it("should filter out dust transactions", async () => {
        const mockHeliusResponse = [
            {
                description: "Dust Transfer",
                type: "TRANSFER",
                source: "SYSTEM_PROGRAM",
                fee: 5000,
                feePayer: "TestFeePayer123",
                signature: "DustSignature123",
                slot: 123456,
                timestamp: 1643723400,
                tokenTransfers: [],
                nativeTransfers: [
                    {
                        fromUserAccount: "FromUser123",
                        toUserAccount: "ToUser123",
                        amount: 500, // Less than 1000 lamports (dust)
                    },
                ],
                accountData: [],
                transactionError: null,
                instructions: [],
                events: null,
            },
        ];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockHeliusResponse,
        } as Response);

        const result = await getTransactionHistory(agent);

        expect(result).toHaveLength(0); // Dust transaction should be filtered out
    });
});
