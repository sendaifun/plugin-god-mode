import { encode, decode } from '@msgpack/msgpack';
import { 
  PublicKey, 
  TransactionMessage, 
  VersionedTransaction,
  TransactionInstruction,
  AddressLookupTableAccount,
  ComputeBudgetProgram
} from '@solana/web3.js';
import { 
  TitanSwapQuotes, 
  TitanQuoteResult, 
  TitanSwapRequest, 
  TitanSwapResult,
  TitanSwapRoute 
} from './types';
import { 
  DEFAULT_TITAN_ENDPOINT, 
  TITAN_PROTOCOL, 
  TITAN_TIMEOUTS,
  DEFAULT_TITAN_SLIPPAGE_BPS 
} from './constants';

// Universal WebSocket type that works in both Node.js and browser/worker environments
type UniversalWebSocket = WebSocket | import('ws');

// Check if we're in a browser/worker environment or Node.js
const isNodeEnvironment = typeof window === 'undefined' && typeof WorkerGlobalScope === 'undefined';

// Dynamic WebSocket constructor
const getWebSocketConstructor = (): typeof WebSocket => {
  if (!isNodeEnvironment) {
    // Browser or Worker environment - use native WebSocket
    return WebSocket;
  } else {
    // Node.js environment - try to import ws
    try {
      const WS = require('ws');
      return WS;
    } catch (error) {
      throw new Error('WebSocket is not available. Install "ws" package for Node.js or use in a browser/worker environment.');
    }
  }
};

/**
 * Helper function to convert base58 string to Uint8Array
 */
function base58ToUint8Array(base58: string): Uint8Array {
  try {
    const pubkey = new PublicKey(base58);
    return pubkey.toBytes();
  } catch (error) {
    throw new Error(`Invalid base58 public key: ${base58}`);
  }
}

/**
 * Build a VersionedTransaction from Titan's instructions and address lookup tables
 */
function buildTransactionFromInstructions(
  instructions: any[],
  addressLookupTables: Uint8Array[],
  userPublicKey: string,
  computeUnits?: number
): Uint8Array {
  console.log(`🔨 Building transaction from ${instructions.length} instructions`);
  
  try {
    const payer = new PublicKey(userPublicKey);
    const txInstructions: TransactionInstruction[] = [];
    
    // Add compute budget instruction if specified
    if (computeUnits && computeUnits > 0) {
      console.log(`⚡ Setting compute budget: ${computeUnits} units`);
      txInstructions.push(
        ComputeBudgetProgram.setComputeUnitLimit({
          units: computeUnits
        })
      );
    }
    
    // Convert Titan instructions to Solana TransactionInstructions
    for (let i = 0; i < instructions.length; i++) {
      const titanInstruction = instructions[i];
      console.log(`🔧 Processing instruction ${i + 1}/${instructions.length}`);
      // Only log the first instruction structure to avoid spam
      if (i === 0) {
        console.log(`📋 Sample instruction structure:`, JSON.stringify(titanInstruction, null, 2));
      }
      
      // Check different possible field names for Titan instructions
      let programId = titanInstruction.programId || titanInstruction.p || titanInstruction.program_id;
      let accounts = titanInstruction.accounts || titanInstruction.a || titanInstruction.keys;
      let data = titanInstruction.data || titanInstruction.d || titanInstruction.instruction_data;
      
      // Convert indexed objects to proper arrays if needed
      if (programId && typeof programId === 'object' && !Array.isArray(programId) && !(programId instanceof Uint8Array)) {
        // Convert indexed object like {"0": 181, "1": 227, ...} to array
        const keys = Object.keys(programId).map(Number).sort((a, b) => a - b);
        programId = new Uint8Array(keys.map(k => programId[k]));
        if (i === 0) console.log(`🔄 Converted programId from indexed object to Uint8Array`);
      }
      
      if (accounts && Array.isArray(accounts)) {
        accounts = accounts.map((acc: any) => {
          let pubkey = acc.pubkey || acc.p || acc.address || acc.key;
          
          // Convert indexed object to Uint8Array if needed
          if (pubkey && typeof pubkey === 'object' && !Array.isArray(pubkey) && !(pubkey instanceof Uint8Array)) {
            const keys = Object.keys(pubkey).map(Number).sort((a, b) => a - b);
            pubkey = new Uint8Array(keys.map(k => pubkey[k]));
          }
          
          return {
            pubkey,
            isSigner: acc.isSigner || acc.s || acc.is_signer || false,
            isWritable: acc.isWritable || acc.w || acc.is_writable || false
          };
        });
        if (i === 0) console.log(`🔄 Processed ${accounts.length} accounts`);
      }
      
      if (data && typeof data === 'object' && !Array.isArray(data) && !(data instanceof Uint8Array)) {
        // Convert indexed object to Uint8Array
        const keys = Object.keys(data).map(Number).sort((a, b) => a - b);
        data = new Uint8Array(keys.map(k => data[k]));
        if (i === 0) console.log(`🔄 Converted data from indexed object to Uint8Array (${data.length} bytes)`);
      }
      
      if (!programId || !accounts || data === undefined) {
        console.log(`⚠️ Invalid instruction structure at index ${i}:`);
        console.log(`   programId: ${!!programId}`);
        console.log(`   accounts: ${!!accounts}`);
        console.log(`   data: ${data !== undefined}`);
        console.log(`   Available keys:`, Object.keys(titanInstruction));
        continue;
      }
      
      // Convert program ID
      const programIdKey = new PublicKey(programId);
      
      // Convert accounts - they should already be processed above
      const accountKeys = accounts.map((acc: any) => ({
        pubkey: new PublicKey(acc.pubkey),
        isSigner: acc.isSigner,
        isWritable: acc.isWritable
      }));
      
      // Convert data (should now be Uint8Array after processing above)
      let instructionData: Buffer;
      if (data instanceof Uint8Array) {
        instructionData = Buffer.from(data);
      } else if (Array.isArray(data)) {
        instructionData = Buffer.from(data);
      } else if (typeof data === 'string') {
        // Try base64 first, then hex
        try {
          instructionData = Buffer.from(data, 'base64');
        } catch {
          try {
            instructionData = Buffer.from(data, 'hex');
          } catch {
            console.log(`⚠️ Failed to parse data string for instruction ${i}:`, data);
            continue;
          }
        }
      } else {
        console.log(`⚠️ Unsupported data format for instruction ${i}:`, typeof data);
        continue;
      }
      
      const instruction = new TransactionInstruction({
        programId: programIdKey,
        keys: accountKeys,
        data: instructionData
      });
      
      txInstructions.push(instruction);
    }
    
    console.log(`✅ Converted ${txInstructions.length} instructions successfully`);
    
    // Handle address lookup tables
    const lookupTableAccounts: AddressLookupTableAccount[] = [];
    if (addressLookupTables && addressLookupTables.length > 0) {
      console.log(`🗂️ Processing ${addressLookupTables.length} address lookup tables`);
      console.log(`🔍 ALT types:`, addressLookupTables.map(alt => typeof alt));
      
      // Skip ALTs for now as they require network calls to fetch and can cause serialization issues
      console.log(`⚠️ Skipping address lookup tables - they require network fetching`);
      console.log(`💡 Transaction will use legacy format without ALTs`);
      
      // Note: To properly support ALTs, you would need to:
      // 1. Convert Uint8Array to PublicKey
      // 2. Fetch the ALT data from the Solana network
      // 3. Create proper AddressLookupTableAccount objects
      // For now, we'll skip them to avoid serialization errors
    }
    
    // Create the transaction message with a valid dummy blockhash
    // This will be replaced by the wallet with the actual recent blockhash
    // Use a valid base58 encoded string that represents 32 bytes of zeros
    const dummyBlockhash = '11111111111111111111111111111112'; // Valid base58 for 32 zero bytes
    const messageV0 = new TransactionMessage({
      payerKey: payer,
      recentBlockhash: dummyBlockhash,
      instructions: txInstructions
    });
    
    // Compile to versioned transaction
    const compiledMessage = messageV0.compileToV0Message(lookupTableAccounts);
    const versionedTx = new VersionedTransaction(compiledMessage);
    
    console.log(`🎯 Built versioned transaction with ${txInstructions.length} instructions`);
    
    // Serialize to bytes
    const serialized = versionedTx.serialize();
    console.log(`📦 Serialized transaction: ${serialized.length} bytes`);
    
    return serialized;
    
  } catch (error) {
    console.log(`❌ Failed to build transaction:`, error);
    throw error;
  }
}

/**
 * Create a WebSocket connection to Titan API
 */
async function createTitanConnection(apiEndpoint: string, apiToken: string): Promise<UniversalWebSocket> {
  console.log(`🔌 Connecting to Titan API: ${apiEndpoint}`);
  console.log(`📱 Environment: ${isNodeEnvironment ? 'Node.js' : 'Browser/Worker'}`);
  
  return new Promise((resolve, reject) => {
    const WebSocketConstructor = getWebSocketConstructor();
    
    let ws: UniversalWebSocket;
    
    if (isNodeEnvironment) {
      // Node.js environment with ws package
      console.log(`🔧 Using Node.js ws package with headers`);
      ws = new (WebSocketConstructor as any)(apiEndpoint, [TITAN_PROTOCOL], {
        headers: {
          'Authorization': `Bearer ${apiToken}`,
          'Sec-WebSocket-Protocol': TITAN_PROTOCOL
        }
      });
    } else {
      // Browser/Worker environment
      console.log(`🌐 Using native WebSocket API`);
      ws = new WebSocketConstructor(apiEndpoint, [TITAN_PROTOCOL]) as WebSocket;
    }

    // Set binary type for both environments
    if ('binaryType' in ws) {
      ws.binaryType = 'arraybuffer';
      console.log(`✅ Set binary type to arraybuffer`);
    }

    const timeout = setTimeout(() => {
      console.log(`⏰ Connection timeout after ${TITAN_TIMEOUTS.CONNECTION}ms`);
      ws.close();
      reject(new Error('Titan connection timeout'));
    }, TITAN_TIMEOUTS.CONNECTION);

    const onOpen = () => {
      console.log(`✅ Titan WebSocket connected successfully`);
      clearTimeout(timeout);
      resolve(ws);
    };

    const onError = (error: any) => {
      console.log(`❌ Titan WebSocket connection error:`, error);
      clearTimeout(timeout);
      reject(error);
    };

    // Handle different event listener APIs
    if ('on' in ws) {
      // Node.js ws package
      (ws as any).on('open', onOpen);
      (ws as any).on('error', onError);
    } else {
      // Native WebSocket API
      (ws as WebSocket).onopen = onOpen;
      (ws as WebSocket).onerror = onError;
    }
  });
}

/**
 * Wait for a specific response from WebSocket
 */
async function waitForResponse(ws: UniversalWebSocket, requestId: number, timeoutMs: number = TITAN_TIMEOUTS.RESPONSE): Promise<any> {
  console.log(`⏳ Waiting for response to request ${requestId} (timeout: ${timeoutMs}ms)`);
  
  return new Promise((resolve, reject) => {
    let resolved = false;
    
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log(`⏰ Request ${requestId} timeout after ${timeoutMs}ms`);
        reject(new Error('Titan request timeout'));
      }
    }, timeoutMs);

    const messageHandler = (event: any) => {
      try {
        // Handle both Node.js ws and native WebSocket message formats
        const data = event.data ? event.data : event; // Native WebSocket vs ws package
        const arrayBuffer = data instanceof ArrayBuffer ? data : 
                           data.buffer ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data;
        
        const message: any = decode(new Uint8Array(arrayBuffer));
        console.log(`📨 Received message:`, { 
          type: Object.keys(message)[0],
          requestId: message.Response?.requestId || message.Error?.requestId || 'unknown'
        });
        
        if (message.Response && message.Response.requestId === requestId) {
          if (!resolved) {
            resolved = true;
            console.log(`✅ Received response for request ${requestId}`);
            clearTimeout(timeout);
            removeListeners();
            resolve(message.Response);
          }
        } else if (message.Error && message.Error.requestId === requestId) {
          if (!resolved) {
            resolved = true;
            console.log(`❌ Received error for request ${requestId}:`, message.Error);
            clearTimeout(timeout);
            removeListeners();
            reject(new Error(`Titan API Error: ${message.Error.message} (Code: ${message.Error.code})`));
          }
        }
      } catch (error) {
        if (!resolved) {
          resolved = true;
          console.log(`❌ Error processing message for request ${requestId}:`, error);
          clearTimeout(timeout);
          removeListeners();
          reject(error);
        }
      }
    };

    const closeHandler = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(new Error('Titan connection closed unexpectedly'));
      }
    };

    const errorHandler = (error: any) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(error);
      }
    };

    const removeListeners = () => {
      if ('removeListener' in ws) {
        // Node.js ws package
        (ws as any).removeListener('message', messageHandler);
        (ws as any).removeListener('close', closeHandler);
        (ws as any).removeListener('error', errorHandler);
      } else {
        // Native WebSocket API
        (ws as WebSocket).onmessage = null;
        (ws as WebSocket).onclose = null;
        (ws as WebSocket).onerror = null;
      }
    };

    // Add event listeners based on the WebSocket type
    if ('on' in ws) {
      // Node.js ws package
      (ws as any).on('message', messageHandler);
      (ws as any).on('close', closeHandler);
      (ws as any).on('error', errorHandler);
    } else {
      // Native WebSocket API
      (ws as WebSocket).onmessage = messageHandler;
      (ws as WebSocket).onclose = closeHandler;
      (ws as WebSocket).onerror = errorHandler;
    }
  });
}

/**
 * Wait for stream data (first quote)
 */
async function waitForFirstQuote(ws: UniversalWebSocket, streamId: number, timeoutMs: number = TITAN_TIMEOUTS.QUOTE): Promise<TitanSwapQuotes> {
  console.log(`📊 Waiting for quotes from stream ${streamId} (timeout: ${timeoutMs}ms)`);
  
  return new Promise((resolve, reject) => {
    let resolved = false;
    
    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        console.log(`⏰ Quote timeout for stream ${streamId} after ${timeoutMs}ms`);
        reject(new Error('Titan quote timeout - no quotes received'));
      }
    }, timeoutMs);

    const messageHandler = (event: any) => {
      try {
        // Handle both Node.js ws and native WebSocket message formats
        const data = event.data ? event.data : event;
        const arrayBuffer = data instanceof ArrayBuffer ? data : 
                           data.buffer ? data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength) : data;
        
        const message: any = decode(new Uint8Array(arrayBuffer));
        
        if (message.StreamData && message.StreamData.id === streamId) {
          console.log(`📈 Received stream data for stream ${streamId}`);
          if (message.StreamData.payload?.SwapQuotes) {
            const quotes = message.StreamData.payload.SwapQuotes;
            const quotesCount = Object.keys(quotes.quotes || {}).length;
            console.log(`💰 Received ${quotesCount} swap quotes from Titan`);
            
            if (!resolved) {
              resolved = true;
              clearTimeout(timeout);
              removeListeners();
              resolve(quotes);
            }
          }
        } else if (message.StreamEnd && message.StreamEnd.id === streamId) {
          console.log(`🔚 Stream ${streamId} ended`);
          if (!resolved) {
            resolved = true;
            clearTimeout(timeout);
            removeListeners();
            if (message.StreamEnd.errorCode) {
              console.log(`❌ Stream error: ${message.StreamEnd.errorMessage} (Code: ${message.StreamEnd.errorCode})`);
              reject(new Error(`Titan stream error: ${message.StreamEnd.errorMessage} (Code: ${message.StreamEnd.errorCode})`));
            } else {
              console.log(`❌ Stream ended without providing quotes`);
              reject(new Error('Titan stream ended without providing quotes'));
            }
          }
        }
      } catch (error) {
        if (!resolved) {
          resolved = true;
          console.log(`❌ Error processing stream message for stream ${streamId}:`, error);
          clearTimeout(timeout);
          removeListeners();
          reject(error);
        }
      }
    };

    const closeHandler = () => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(new Error('Titan connection closed while waiting for quotes'));
      }
    };

    const errorHandler = (error: any) => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        reject(error);
      }
    };

    const removeListeners = () => {
      if ('removeListener' in ws) {
        // Node.js ws package
        (ws as any).removeListener('message', messageHandler);
        (ws as any).removeListener('close', closeHandler);
        (ws as any).removeListener('error', errorHandler);
      } else {
        // Native WebSocket API
        (ws as WebSocket).onmessage = null;
        (ws as WebSocket).onclose = null;
        (ws as WebSocket).onerror = null;
      }
    };

    // Add event listeners based on the WebSocket type
    if ('on' in ws) {
      // Node.js ws package
      (ws as any).on('message', messageHandler);
      (ws as any).on('close', closeHandler);
      (ws as any).on('error', errorHandler);
    } else {
      // Native WebSocket API
      (ws as WebSocket).onmessage = messageHandler;
      (ws as WebSocket).onclose = closeHandler;
      (ws as WebSocket).onerror = errorHandler;
    }
  });
}

/**
 * Get a swap quote from Titan API
 */
export async function getTitanSwapQuote(request: TitanSwapRequest, apiToken: string): Promise<TitanQuoteResult> {
  console.log(`🚀 Starting Titan swap quote request`);
  console.log(`💱 ${request.inputMint} -> ${request.outputMint}`);
  console.log(`💰 Amount: ${request.amount} (${request.amount / 1e9} tokens)`);
  console.log(`📊 Slippage: ${request.slippageBps || DEFAULT_TITAN_SLIPPAGE_BPS} bps`);
  
  if (!apiToken) {
    console.log(`❌ Titan API token not provided`);
    return { success: false, error: 'Titan API token not provided' };
  }

  let ws: UniversalWebSocket | null = null;
  const startTime = Date.now();

  try {
    // For browser/worker environments, append auth token as query param since headers aren't supported
    let endpoint = DEFAULT_TITAN_ENDPOINT;
    if (!isNodeEnvironment) {
      endpoint += `?auth=${encodeURIComponent(apiToken)}`;
      console.log(`🔑 Using query param auth for browser/worker environment`);
    }

    // Connect to Titan API
    ws = await createTitanConnection(endpoint, apiToken);
    console.log(`⚡ Connection established in ${Date.now() - startTime}ms`);
    
    // Prepare request
    const requestId = Math.floor(Math.random() * 1000000);
    console.log(`📝 Preparing swap quote request ${requestId}`);
    
    const swapQuoteRequest = {
      id: requestId,
      data: {
        NewSwapQuoteStream: {
          swap: {
            inputMint: base58ToUint8Array(request.inputMint),
            outputMint: base58ToUint8Array(request.outputMint),
            amount: request.amount,
            swapMode: 'ExactIn',
            slippageBps: request.slippageBps || DEFAULT_TITAN_SLIPPAGE_BPS,
            onlyDirectRoutes: false,
            addSizeConstraint: true,
            ...(request.preferredProvider && { providers: [request.preferredProvider] })
          },
          transaction: {
            userPublicKey: base58ToUint8Array(request.userPublicKey),
            closeInputTokenAccount: false,
            createOutputTokenAccount: true
          },
          update: {
            numQuotes: 5
          }
        }
      }
    };

    // Send request
    const encodedRequest = encode(swapQuoteRequest);
    console.log(`📤 Sending quote request (${encodedRequest.length} bytes)`);
    
    // Handle different send methods
    if ('send' in ws && typeof ws.send === 'function') {
      ws.send(encodedRequest);
      console.log(`✅ Quote request sent successfully`);
    } else {
      throw new Error('WebSocket send method not available');
    }

    // Wait for response (stream start)
    const response = await waitForResponse(ws, requestId);
    console.log(`📥 Stream response received in ${Date.now() - startTime}ms`);
    
    if (!response.stream) {
      throw new Error('No stream started in response');
    }

    const streamId = response.stream.id;
    console.log(`🌊 Stream ${streamId} started successfully`);

    // Wait for first quote
    const quotes = await waitForFirstQuote(ws, streamId);
    console.log(`💎 Quotes received in ${Date.now() - startTime}ms`);
    
    // Find best quote (highest output amount)
    let bestQuote: { provider: string; route: TitanSwapRoute } | undefined;
    let bestOutput = 0;

    Object.entries(quotes.quotes).forEach(([provider, route]) => {
      console.log(`📊 ${provider}: ${route.inAmount} -> ${route.outAmount} (${route.slippageBps} bps slippage)`);
      console.log(`   📦 Has transaction: ${!!route.transaction}`);
      console.log(`   🔧 Has instructions: ${!!route.instructions} (count: ${route.instructions?.length || 0})`);
      console.log(`   🗂️ Address lookup tables: ${route.addressLookupTables?.length || 0}`);
      if (route.outAmount > bestOutput) {
        bestOutput = route.outAmount;
        bestQuote = { provider, route };
      }
    });

    if (bestQuote) {
      console.log(`🏆 Best quote: ${bestQuote.provider} - ${bestQuote.route.outAmount} output`);
      console.log(`📊 Has transaction: ${!!bestQuote.route.transaction}`);
    }

    console.log(`✅ Titan quote completed in ${Date.now() - startTime}ms`);

    return {
      success: true,
      quotes,
      ...(bestQuote && { bestQuote })
    };

  } catch (error) {
    console.log(`❌ Titan quote failed in ${Date.now() - startTime}ms:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Titan error'
    };
  } finally {
    if (ws && 'close' in ws) {
      console.log(`🔌 Closing Titan WebSocket connection`);
      ws.close();
    }
  }
}

/**
 * Execute instant swap via Titan - gets quote and returns transaction to sign
 */
export async function executeTitanSwap(request: TitanSwapRequest, apiToken: string): Promise<TitanSwapResult> {
  const startTime = Date.now();
  console.log(`🔄 Executing Titan swap...`);
  
  try {
    // Get quote first
    const quoteResult = await getTitanSwapQuote(request, apiToken);
    
    if (!quoteResult.success || !quoteResult.bestQuote) {
      console.log(`❌ Titan swap failed: ${quoteResult.error || 'No quotes available'}`);
      return {
        success: false,
        error: quoteResult.error || 'No Titan quotes available'
      };
    }

    const { provider, route } = quoteResult.bestQuote;

    let transaction: Uint8Array;

    if (route.transaction) {
      // Use pre-built transaction if available
      console.log(`📦 Using pre-built transaction (${route.transaction.length} bytes)`);
      transaction = route.transaction;
    } else if (route.instructions && route.instructions.length > 0) {
      // Build transaction from instructions
      console.log(`🔧 Building transaction from ${route.instructions.length} instructions`);
      console.log(`🗂️ Address lookup tables: ${route.addressLookupTables?.length || 0}`);
      
      try {
        transaction = buildTransactionFromInstructions(
          route.instructions,
          route.addressLookupTables || [],
          request.userPublicKey,
          route.computeUnitsSafe || route.computeUnits
        );
        console.log(`✅ Successfully built transaction from instructions`);
      } catch (error) {
        console.log(`❌ Failed to build transaction from instructions:`, error);
        return {
          success: false,
          error: `Failed to build transaction from Titan instructions: ${error instanceof Error ? error.message : 'Unknown error'}`
        };
      }
    } else {
      console.log(`❌ Titan swap failed: No transaction or instructions provided by ${provider}`);
      return {
        success: false,
        error: 'No transaction or instructions provided by Titan quote provider'
      };
    }

    console.log(`✅ Titan swap prepared in ${Date.now() - startTime}ms`);
    console.log(`🎯 Provider: ${provider}`);
    console.log(`💰 Quote: ${route.inAmount} -> ${route.outAmount}`);
    console.log(`📦 Transaction size: ${transaction.length} bytes`);

    return {
      success: true,
      transaction,
      quote: {
        provider,
        inputAmount: route.inAmount,
        outputAmount: route.outAmount,
        slippageBps: route.slippageBps
      }
    };

  } catch (error) {
    console.log(`❌ Titan swap error in ${Date.now() - startTime}ms:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown Titan swap error'
    };
  }
}
