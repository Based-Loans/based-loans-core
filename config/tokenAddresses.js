const tokens = {
  USDC: {
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    symbol: "USDC",
    symbolHash: "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa"
  },
  USDT: {
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    symbol: "USDT",
    symbolHash: "0x8b1a1d9c2b109e527c9134b25b1a1833b16b6594f92daa9f6d9b7a6024bce9d0"
  },
  DAI: {
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    symbol: "DAI",
    symbolHash: "0xa5e92f3efb6826155f1f728e162af9d7cda33a574a1153b58f03ea01cc37e568"
  },
  WBTC: {
    address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    decimals: 8,
    symbol: "WBTC",
    symbolHash: "0x98da2c5e4c6b1db946694570273b859a6e4083ccc8faa155edfc4c54eb3cfd73"
  },
  DPI: {
    address: "0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b",
    decimals: 18,
    symbol: "DPI",
    symbolHash: "0x1a9e9982fcd295313fa8ea740fa7033aa110518733442e38c1d8a9d0e18ce77a"
  },
  SHIBA: {
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    decimals: 18,
    symbol: "SHIB",
    symbolHash: "0xefa585451ff82e7559b7e4aa3c7d26b394fd121301bbf6f1da4ef6d29210466e"
  },
  KISHU: {
    address: "0xA2b4C0Af19cC16a6CfAcCe81F192B024d625817D",
    decimals: 9,
    symbol: "KISHU",
    symbolHash: "0x39094970400fc75d1ae18272c5d173b18e9df8e6cf84ff41bbf983f78ebdd603"
  },
  ELON: {
    address: "0x761d38e5ddf6ccf6cf7c55759d5210750b5d60f3",
    decimals: 18,
    symbol: "ELON",
    symbolHash: "0xa1e3c714d551534dab975a829a86d8cd25bf244ce5d1a21a9a06d87a45a2ce5c"
  },
  AKITA: {
    address: "0x3301ee63fb29f863f2333bd4466acb46cd8323e6",
    decimals: 18,
    symbol: "AKITA",
    symbolHash: "0x1c47244f6ad70d041c1ed2253fa1f242f6de9e912db99ab20e181943e4e7db83"
  },
  CORE: {
    address: "0x62359Ed7505Efc61FF1D56fEF82158CcaffA23D7",
    decimals: 18,
    symbol: "CORE",
    symbolHash: "0x907208bc2088fa777f18b43edd8b766e7243504cf8497f7ed936c65c7a446bbc"
  },
  FARM: {
    address: "0xa0246c9032bC3A600820415aE600c6388619A14D",
    decimals: 18,
    symbol: "FARM",
    symbolHash: "0x15e7d524175663fc8929751799c4e1a8d04fec20bebd7ac2f10532927c1b5c0d"
  },
  ESD: {
    address: "0x36F3FD68E7325a35EB768F1AedaAe9EA0689d723",
    decimals: 18,
    symbol: "ESD",
    symbolHash: "0x8a3851ce730c91bc71ece366d769595216a6b165e38cacf0069b5f5b45f9bdaf"
  },
  RSR: {
    address: "0x8762db106B2c2A0bccB3A80d1Ed41273552616E8",
    decimals: 18,
    symbol: "RSR",
    symbolHash: "0xebd4ed3a71f1f2a9aa07e27f5a7193a8d0aa9de85f0f3eb8d6ed20420d70f126"
  },
  PICKLE: {
    address: "0x429881672B9AE42b8EbA0E26cD9C73711b891Ca5",
    decimals: 18,
    symbol: "PICKLE",
    symbolHash: "0x2a79f612db8970325b555935bab14defa07a4e9b391bf1c0b0cc3892f5580bc9"
  },
  HEX: {
    address: "0x2b591e99afE9f32eAA6214f7B7629768c40Eeb39",
    decimals: 8,
    symbol: "HEX",
    symbolHash: "0xf314b2d462c8333499457d10df434abb517d3d467c228a47132364104b468960"
  },
  CVP: {
    address: "0x38e4adB44ef08F22F5B5b76A8f0c2d0dCbE7DcA1",
    decimals: 18,
    symbol: "CVP",
    symbolHash: "0x86124892ab41173705cd24e05606f34d3d7ae66c6c2c17d4edf2a8f04424ce12"
  },
  AUDIO: {
    address: "0x18aAA7115705e8be94bfFEBDE57Af9BFc265B998",
    decimals: 18,
    symbol: "AUDIO",
    symbolHash: "0x714fe6c18bc96354c1c1bf6b950c471b3fe2bbf5c46b0c08173501788ef77bdd"
  },
  HEGIC: {
    address: "0x584bC13c7D411c00c01A62e8019472dE68768430",
    decimals: 18,
    symbol: "HEGIC",
    symbolHash: "0xaf2b54e89bf212bedf3c8e2b60feb886ac16856b042ff0b62cd1297a20ebbd68"
  },
  DHT: {
    address: "0xca1207647Ff814039530D7d35df0e1Dd2e91Fa84",
    decimals: 18,
    symbol: "DHT",
    symbolHash: "0x4d635fd0ecbd654be6cbc468633ec11381a53c451b746a87418ecc588c3288a3"
  },
  BAC: {
    address: "0x3449FC1Cd036255BA1EB19d65fF4BA2b8903A69a",
    decimals: 18,
    symbol: "BAC",
    symbolHash: "0xa445a035dba25d8a141a41de6cf7fe9d862622e55c2ea98b66fac0b31d9f6125"
  },
  BAS: {
    address: "0xa7ED29B253D8B4E3109ce07c80fc570f81B63696",
    decimals: 18,
    symbol: "BAS",
    symbolHash: "0x8cfcee55ccd2fd16f92981c12cd89f017951b215f9bc050f8e57d4c03f13c0cd"
  },
  FRAX: {
    address: "0x853d955aCEf822Db058eb8505911ED77F175b99e",
    decimals: 18,
    symbol: "FRAX",
    symbolHash: "0x9171c8ee5d053a5cb4f89f254214c629dd22087419ac71a852ac36b733813444"
  },
  MATIC__matic: {
    address: "0x0000000000000000000000000000000000001010",
    decimals: 18,
    symbol: "MATIC",
    symbolHash: "0xa6a7de01e8b7ba6a4a61c782a73188d808fc1f3cf5743fadb68a02ed884b594f"
  },
  USDC__matic: {
    address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
    decimals: 6,
    symbol: "USDC",
    symbolHash: "0xd6aca1be9729c13d677335161321649cccae6a591554772516700f986f942eaa"
  }
}

module.exports = tokens;
