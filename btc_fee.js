const urlMempool = "https://mempool.space/api/v1/fees/recommended";
const urlCoinbase = "https://api.coinbase.com/v2/prices/BTC-EUR/buy";
// Average transaction size in bytes according to mempool.space
const vbyte = 140;


fees = getMempool();
btcUsdRate = getCoinbase();

/*Promise.all([getMempool(), getCoinbase()]).then(([fees, btcUsdRate]) => {
  console.log(calculateFees(fees, btcUsdRate));
});*/

let [fees, btcUsdRate] = await Promise.all([getMempool(), getCoinbase()]);
let usdFees = calculateFees(fees, btcUsdRate);
let header = widget.addText("Bitcoin Fees");
header.textColor = Color.white();
header.font = Font.semiboldSystemFont(18);

for (i = 0; i < 3; i++) {
  let feeText = widget.addText(`${usdFees[i]} USD for ${["Fastest", "Hour", "Half-hour"][i]} confirmation`);
  feeText.textColor = Color.white();
  feeText.font = Font.systemFont(14);
}

if (config.runsInWidget) {
  Script.setWidget(widget)
} else {
  widget.presentSmall()
}

async function getMempool() {
  let requestMempool = new Request(urlMempool);
  let responseMempool = await requestMempool.loadJSON();
  console.log(responseMempool);
  
  fastestFee = parseInt(responseMempool.fastestFee);
  hourFee = parseInt(responseMempool.hourFee);
  halfHourFee = parseInt(responseMempool.halfHourFee);

  fees = [fastestFee, hourFee, halfHourFee];
  console.log(fees);

  return fees;
}

async function getCoinbase() {
  let requestCoinbase = new Request(urlCoinbase);
  let responseCoinbase = await requestCoinbase.loadJSON();
  console.log(responseCoinbase);

  btcUsdRate = parseFloat(responseCoinbase.data.amount);
  console.log(btcUsdRate);
  return btcUsdRate;
}

function calculateFees(fees, btcUsdRate) {
  usdFees = [];
  for (i = 0; i < 3; i++) {
    sats = vbyte * fees[i];
    //calculate the fee in USD
    usd = (sats * btcUsdRate) / 100000000;
    //round to 2 decimals
    usd = usd.toFixed(2);
    usdFees[i] = usd;
  }
  console.log(usdFees);
  return usdFees;
}
