import { SolanaAgentKit } from "solana-agent-kit";
import { MoonPay } from '@moonpay/moonpay-node';

export default function onramp(agent: SolanaAgentKit, amount?: number): string {

    const moonpay = new MoonPay(
        agent.config.OTHER_API_KEYS?.MOONPAY_API_KEY!
    );

    const url =  moonpay.url.generate({
        flow: 'buy',
        params : {
            apiKey: agent.config.OTHER_API_KEYS?.MOONPAY_PUBLIC_KEY!,
            walletAddress: agent.wallet.publicKey.toBase58(),
            baseCurrencyAmount: amount ? amount.toString() : undefined,
            baseCurrencyCode: 'sol',
            theme: 'dark',
        }
    })

    return url;
}
