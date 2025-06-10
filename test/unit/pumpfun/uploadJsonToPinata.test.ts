import { PinataSDK } from "pinata";

export async function uploadJsonToPinata(json) {
    const pinata = new PinataSDK({
        pinataJwt: process.env.PINATA_JWT,
        pinataGateway: "ipfs.sendai.fun",
    });

    try {
        const upload = await pinata.upload.public.json(json);
        // Return the IPFS link using the returned cid
        return `https://ipfs.io/ipfs/${upload.cid}`;
    } catch (error) {
        console.error("Error uploading to Pinata:", error);
        throw error;
    }
}

describe("uploadJsonToPinata - Integration Tests", () => {

    it("should successfully upload JSON and return IPFS URL", async () => {
        const testJson = {
            name: "test-upload",
            description: "Integration test upload",
            image: "https://ipfs.io/ipfs/QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG",
            timestamp: Date.now(), // Add unique timestamp to avoid conflicts
        };

        const result = await uploadJsonToPinata(testJson);

        // Verify the result is a valid IPFS URL
        expect(result).toMatch(/^https:\/\/ipfs\.io\/ipfs\/Qm[a-zA-Z0-9]{44}$/);
        expect(typeof result).toBe("string");
        expect(result.startsWith("https://ipfs.io/ipfs/")).toBe(true);
        
        console.log("Successfully uploaded JSON to:", result);
    });
});
