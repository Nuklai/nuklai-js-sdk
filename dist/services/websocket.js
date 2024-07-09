import { services, utils } from '@nuklai/hyperchain-sdk';
import { Transfer } from 'actions/transfer';
import { DECIMALS } from 'constants/nuklaivm';
import { RpcService } from './rpc';
export class WebSocketService extends services.WebSocketService {
    rpcService;
    constructor(config) {
        super(config);
        this.rpcService = new RpcService(config);
    }
    async sendTransferTransactionAndWait(to, asset, amount, memo, authFactory, hyperApiService, actionRegistry, authRegistry) {
        try {
            // Generate the from address using the private key
            const auth = authFactory.sign(new Uint8Array(0));
            const fromAddress = auth.address();
            const decimals = DECIMALS;
            const amountInUnits = utils.parseBalance(amount, decimals);
            // Fetch the balance to ensure sufficient funds
            const balanceResponse = await this.rpcService.getBalance({
                address: fromAddress.toString(),
                asset
            });
            if (utils.parseBalance(balanceResponse.amount, decimals) < amountInUnits) {
                throw new Error('Insufficient balance');
            }
            const transfer = new Transfer(to, asset, amountInUnits, memo);
            const genesisInfo = await this.rpcService.getGenesisInfo();
            let { txSigned, err } = await hyperApiService.generateTransaction(genesisInfo.genesis, actionRegistry, authRegistry, [transfer], authFactory);
            if (err) {
                throw err;
            }
            err = await this.registerTx(txSigned);
            if (err) {
                throw err;
            }
            let res;
            let resultTxID = null;
            while (!resultTxID) {
                const { txId, dErr, result, err } = await this.listenTx();
                if (dErr) {
                    throw dErr;
                }
                if (err) {
                    throw err;
                }
                if (txId.toString() === txSigned.id().toString()) {
                    resultTxID = txId;
                    res = result;
                    break;
                }
            }
            return txSigned.id().toString();
        }
        catch (error) {
            console.error('Failed to create and submit transaction for "Transfer" type', error);
            throw error;
        }
    }
}
//# sourceMappingURL=websocket.js.map