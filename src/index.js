const { formatsByCoinType } = require("@bchdomains/address-encoder");
const {
  TYPES_NEED,
  CONVERT_NEED_ID,
  ID_TO_NAME,
  CONTRACT,
  OPTIONS,
  GRAPH_URL,
  RAW_GRAPHQL_REQ,
  APP,
  NAME,
} = require("./config");

async function appendQr(id, address) {
  OPTIONS.data = address;
  const qrCode = new QRCodeStyling(OPTIONS);
  const blob = await qrCode.getRawData();
  document.querySelector(`div#card-${id} > [data-qr]`).src =
    URL.createObjectURL(blob);
}

function hexToAddr(coinType, hex) {
  return formatsByCoinType[coinType].encoder(Buffer.from(hex.slice(2), "hex"));
}

function formatAddress(address) {
  if (!address.includes(":"))
    return address.substring(0, 8) + "..." + address.substr(address.length - 8);

  const splited = address.split(":");
  return (
    splited[0] + // prefix ex: `bitcoincash:`
    ":" +
    splited[1].substring(0, 8) + // first 8 letters after prefix
    "..." +
    splited[1].substr(splited.length - 8) // last 8 letters after prefix
  );
}

function appendToDom({ type, shortenAddress, address }) {
  APP.innerHTML += `
      <div class="card" data-card id="card-${type}">
        <h2 class="address-name" data-address-name>${ID_TO_NAME[type]}</h2>
        <img class="qr" data-qr />
        <div class="address" data-address>
          <span> ${shortenAddress} </span>
          <button class="copy-btn" 
                  data-copy-btn="${address}" 
                  onclick="
                    navigator.clipboard.writeText(this.getAttribute('data-copy-btn'))
                        .then(() => alert('Copied to clipboard'))
                  "
          >
            <img src="./images/copy.svg" width="15" />
          </button>
        </div>
      </div>`;
}

async function main() {
  const queryName = window.location.hash.substring(1);
  const query = RAW_GRAPHQL_REQ.replace("$name", queryName);
  const res = await fetch(GRAPH_URL, {
    body: JSON.stringify({ query }),
    method: "POST",
  });
  const { data } = await res.json();

  const id = data.domains[0].id;
  const name = data.domains[0].name;
  const types = data.domains[0].resolver.coinTypes;

  NAME.innerText = name;

  for (const type of types) {
    if (!TYPES_NEED.includes(type)) continue;

    let address = await CONTRACT.addr(id, type);
    if (CONVERT_NEED_ID.includes(type)) address = hexToAddr(type, address);

    const shortenAddress = formatAddress(address);
    appendToDom({ type, shortenAddress, address });
    appendQr(type, address);

    // IF bch address
    // make another card for slp
    if (type === "145") {
      const slp_address = bchaddr.toSlpAddress(address);
      const shortenAddress = formatAddress(slp_address);
      appendToDom({
        type: `${type}-SLP`,
        shortenAddress,
        address: slp_address,
      });
      appendQr(`${type}-SLP`, slp_address);
    }
  }
}

main();
