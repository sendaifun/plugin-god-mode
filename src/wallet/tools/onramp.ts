import { SolanaAgentKit } from "solana-agent-kit";
import crypto from 'crypto';

export default function onramp(agent: SolanaAgentKit, amount?: number): string {

    const publicKey = agent.config.OTHER_API_KEYS?.MOONPAY_PUBLIC_KEY!
    const secretKey = agent.config.OTHER_API_KEYS?.MOONPAY_API_KEY!

    const originalUrl = `https://buy.moonpay.com/?apiKey=${publicKey}&defaultCurrencyCode=usdc_sol&walletAddress=${agent.wallet.publicKey.toBase58()}`

    const signature = crypto
    .createHmac('sha256', secretKey)  // Use your secret key
    .update(new URL(originalUrl).search)  // Use the query string part of the URL
    .digest('base64');  // Convert the result to a base64 string
  
    const urlWithSignature = `${originalUrl}&signature=${encodeURIComponent(signature)}`;  // Add the signature to the URL

    return urlWithSignature;
}
