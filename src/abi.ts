import  { VMABI } from 'hypersdk-client/dist/Marshaler'

export const NuklaiABI: VMABI = {
    actions: [
        { id: 1, name: "CreateAssetFT" },
        { id: 2, name: "CreateAssetNFT" },
        { id: 3, name: "BurnAssetFT" },
        { id: 4, name: "BurnAssetNFT" },
        { id: 5, name: "MintAssetFT" },
        { id: 6, name: "MintAssetNFT" },
        { id: 7, name: "Transfer" },
        { id: 8, name: "CreateDataset" },
        { id: 9, name: "UpdateAsset" },
        { id: 10, name: "UpdateDataset" },
        { id: 11, name: "InitiateContributeDataset" },
        { id: 12, name: "CompleteContributeDataset" },
        { id: 13, name: "PublishDatasetMarketplace" },
        { id: 14, name: "SubscribeDatasetMarketplace" },
        { id: 15, name: "ClaimMarketplacePayment" }
    ],
    types: [
        {
            name: "CreateAssetFT",
            fields: [
                {name: "assetType", type: "uint8"},
                {name: "name", type: "string"},
                {name: "symbol", type: "string"},
                {name: "decimals", type: "uint8"},
                {name: "metadata", type: "string"},
                {name: "maxSupply", type: "uint64"},
                {name: "mintAdmin", type: "address"},
                {name: "pauseUnpauseAdmin", type: "address"},
                {name: "freezeUnfreezeAdmin", type: "address"},
                {name: "enableDisableKYCAccountAdmin", type: "address"},
            ]
        },
        {
            name: "CreateAssetNFT",
            fields: [
                {name: "assetType", type: "uint8"},
                {name: "name", type: "string"},
                {name: "symbol", type: "string"},
                {name: "metadata", type: "string"},
                {name: "maxSupply", type: "uint64"},
                {name: "mintAdmin", type: "address"},
                {name: "pauseUnpauseAdmin", type: "address"},
                {name: "freezeUnfreezeAdmin", type: "address"},
                {name: "enableDisableKYCAccountAdmin", type: "address"},
            ]
        },
    ],
    outputs: [
        { id: 1, name: "CreateAssetFTOutput"},
        {id: 2, name: "CreateAssetNFTOutput"},
    ]
}