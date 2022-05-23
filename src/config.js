const RPC = ["https://smartbch.fountainhead.cash/mainnet"];

const LNS_RESOLVER = "0x1Ba19b976feFC1C9c684F2B821E494A380f45A0f";
const LNS_ADDRESS = "0xCfb86556760d03942EBf1ba88a9870e67D77b627";
const TYPES_NEED = ["2147493648", "145"];
const CONVERT_NEED_ID = ["145"];
const ID_TO_NAME = {
  2147493648: "SMART BCH",
  145: "BCH",
  "145-SLP": "BCH - SLP",
};

const PROVIDER = new ethers.providers.JsonRpcProvider(RPC[0], {
  chainId: 10000,
  ensAddress: LNS_ADDRESS,
});
const ABI = [
  "function addr(bytes32 node, uint coinType) external view returns(bytes memory)",
];
const CONTRACT = new ethers.Contract(LNS_RESOLVER, ABI, PROVIDER);
const OPTIONS = {
  width: 250,
  height: 250,
  type: "svg",
  image: "./images/BCH.svg",
  qrOptions: {
    typeNumber: "0",
    mode: "Byte",
    errorCorrectionLevel: "Q",
  },
  dotsOptions: {
    color: "#38a211",
    type: "extra-rounded",
  },
  backgroundOptions: {
    color: "#fff",
  },
  imageOptions: {
    crossOrigin: "anonymous",
    margin: 5,
  },
  cornersSquareOptions: {
    type: "extra-rounded",
    color: "#147621",
    gradient: null,
  },
  cornersDotOptions: {
    type: "",
    color: "#0f5717",
  },
};

const GRAPH_URL = "https://graph.bch.domains/subgraphs/name/graphprotocol/ens";
const RAW_GRAPHQL_REQ = `{
    domains(where: {name: "$name"}) {
      id
      name
      resolver {
        texts
        coinTypes
      }
    }
  }`;

const APP = document.getElementById("app");
const NAME = document.getElementById("name");

module.exports = {
  TYPES_NEED,
  CONVERT_NEED_ID,
  ID_TO_NAME,
  CONTRACT,
  OPTIONS,
  GRAPH_URL,
  RAW_GRAPHQL_REQ,
  APP,
  NAME,
};
