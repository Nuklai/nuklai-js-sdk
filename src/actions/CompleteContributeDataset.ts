import { actions, consts, codec, utils } from '@nuklai/hyperchain-sdk'
import { Id } from '@avalabs/avalanchejs';
import {
    COMPLETE_CONTRIBUTE_DATASET_COMPUTE_UNITS,
    COMPLETE_CONTRIBUTE_DATASET_ID,
    STORAGE_ASSET_CHUNKS,
    STORAGE_ASSET_NFT_CHUNKS,
    STORAGE_DATASET_CHUNKS,
    STORAGE_BALANCE_CHUNKS
} from '../constants'

export class CompleteContributeDataset implements actions.Action {
    public datasetID: Id
    public contributor: utils.Address
    public uniqueNFTIDForContributor: bigint

    constructor(
        datasetID: string,
        contributor: string,
        uniqueNFTIDForContributor: bigint
    ) {
        this.datasetID = utils.toAssetID(datasetID)
        this.contributor = utils.Address.fromString(contributor)
        this.uniqueNFTIDForContributor = uniqueNFTIDForContributor
    }

    getTypeId(): number {
        return COMPLETE_CONTRIBUTE_DATASET_ID
    }

    size(): number {
        return consts.ID_LEN + consts.ADDRESS_LEN + consts.UINT64_LEN
    }

    computeUnits(): number {
        return COMPLETE_CONTRIBUTE_DATASET_COMPUTE_UNITS
    }

    stateKeysMaxChunks(): number[] {
        return [
            STORAGE_ASSET_CHUNKS,
            STORAGE_ASSET_NFT_CHUNKS,
            STORAGE_DATASET_CHUNKS,
            STORAGE_BALANCE_CHUNKS,
            STORAGE_BALANCE_CHUNKS,
            STORAGE_BALANCE_CHUNKS
        ]
    }

    toJSON(): object {
        return {
            datasetID: this.datasetID.toString(),
            contributor: this.contributor.toString(),
            uniqueNFTIDForContributor: this.uniqueNFTIDForContributor.toString()
        }
    }

    toString(): string {
        return JSON.stringify(this.toJSON())
    }

    toBytes(): Uint8Array {
        const codec = utils.Codec.newWriter(this.size(), this.size())
        codec.packID(this.datasetID)
        codec.packAddress(this.contributor)
        codec.packUint64(this.uniqueNFTIDForContributor)
        return codec.toBytes()
    }

    static fromBytesCodec(codec: utils.Codec): [CompleteContributeDataset, utils.Codec] {
        const datasetID = codec.unpackID(true)
        const contributor = codec.unpackAddress()
        const uniqueNFTIDForContributor = codec.unpackUint64(true)

        const action = new CompleteContributeDataset(
            datasetID.toString(),
            contributor.toString(),
            uniqueNFTIDForContributor
        )
        return [action, codec]
    }
}