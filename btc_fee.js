const urlMempool = "https://mempool.space/api/v1/fees/recommended";
const urlCoinbase = "https://api.coinbase.com/v2/prices/BTC-EUR/buy";
// Average transaction size in bytes according to mempool.space
const vbyte = 140;
let usdFees = [];

main();

let widget = new ListWidget();
// RBG 29 31 48 = #1D1F30
//set widget background color to #1D1F30 with 10% opacity
widget.backgroundColor = new Color("#1D1F30", 0.9);

async function main(){
  Promise.all([getMempool(), getCoinbase()]).then(([fees, btcUsdRate]) => {
    feesUsd = calculateFees(fees, btcUsdRate);

    

    //create a variable for the text sizes
    let textSize = 14;
    let titleSize = 20;

    //create a title for the widget
    let titleStack = widget.addStack();
    titleStack.layoutHorizontally();
    titleStack.centerAlignContent();
    titleStack.setPadding(0, 0, 10, 0);
    titleStack.spacing = 5;

    //set san francisco bitcoin logo next to bitcoin title
    let logo = SFSymbol.named("bitcoinsign.circle");
    let logoImage = titleStack.addImage(logo.image);
    logoImage.imageSize = new Size(20, 20);
    logoImage.tintColor = Color.white();

    //set the title
    let titleText = titleStack.addText("Bitcoin Fees");
    titleText.font = Font.boldSystemFont(titleSize);
    titleText.textColor = Color.white();
    titleText.centerAlignText();

    //add a spacer to the right of the title
    titleStack.addSpacer(50);

    //get current time in format hh:mm
    let currentTime = new Date();
    let hours = currentTime.getHours();
    let minutes = currentTime.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;

    }
    let time = hours + ":" + minutes;

    //add the time to the widget on the right side of title
    let timeText = titleStack.addText("updated " + time);
    timeText.font = Font.boldSystemFont(textSize);
    timeText.textColor = new Color("#99989E");
    timeText.rightAlignText();


    //put all the fees in the widget horizontally
    let stack = widget.addStack();
    stack.layoutHorizontally();
    stack.centerAlignContent();
    stack.setPadding(0, 0, 0, 0);
    stack.spacing = 10;


    //add the fastest fee
    let fastestFeeStack = stack.addStack();
    fastestFeeStack.layoutVertically();
    fastestFeeStack.centerAlignContent();
    fastestFeeStack.setPadding(0, 0, 0, 0);
    fastestFeeStack.spacing = 0;
    // RGB 153 152 158 = #99989E
    let fastestFeeText = fastestFeeStack.addText("High Priority");
    fastestFeeText.font = Font.boldSystemFont(textSize);
    fastestFeeText.textColor = Color.white();
    fastestFeeText.centerAlignText();

    let fastestFeeValue = fastestFeeStack.addText("$" + feesUsd[0]);
    fastestFeeValue.textColor = new Color("#99989E");

    let fastestFeeSat = fastestFeeStack.addText(fees[0] + " sat/vB");
    fastestFeeSat.textColor = new Color("#99989E");
    

    //add the half hour fee
    let halfHourFeeStack = stack.addStack();
    halfHourFeeStack.layoutVertically();
    halfHourFeeStack.centerAlignContent();
    halfHourFeeStack.setPadding(0, 0, 0, 0);
    halfHourFeeStack.spacing = 0;

    let halfHourFeeText = halfHourFeeStack.addText("Medium Priority");
    halfHourFeeText.font = Font.boldSystemFont(textSize);
    halfHourFeeText.textColor = Color.white();
    halfHourFeeText.centerAlignText();

    let halfHourFeeValue = halfHourFeeStack.addText("$" + feesUsd[2]);
    halfHourFeeValue.textColor = new Color("#99989E");

    let halfHourFeeSat = halfHourFeeStack.addText(fees[2] + " sat/vB");
    halfHourFeeSat.textColor = new Color("#99989E");


    //add the hour fee
    let hourFeeStack = stack.addStack();
    hourFeeStack.layoutVertically();
    hourFeeStack.centerAlignContent();
    hourFeeStack.setPadding(0, 0, 0, 0);
    hourFeeStack.spacing = 0;

    let hourFeeText = hourFeeStack.addText("Low Priority");
    hourFeeText.font = Font.boldSystemFont(textSize);
    hourFeeText.textColor = Color.white();
    hourFeeText.centerAlignText();

    let hourFeeValue = hourFeeStack.addText("$"+ feesUsd[1]);
    hourFeeValue.textColor = new Color("#99989E");

    let hourFeeSat = hourFeeStack.addText(fees[1] + " sat/vB");
    hourFeeSat.textColor = new Color("#99989E");

    Script.setWidget(widget);
    Script.complete();
    widget.presentMedium();
  });

}

async function getMempool() {
  let requestMempool = new Request(urlMempool);
  let responseMempool = await requestMempool.loadJSON();
  
  fastestFee = parseInt(responseMempool.fastestFee);
  hourFee = parseInt(responseMempool.hourFee);
  halfHourFee = parseInt(responseMempool.halfHourFee);

  fees = [fastestFee, hourFee, halfHourFee];
  return fees;
}

async function getCoinbase() {
  let requestCoinbase = new Request(urlCoinbase);
  let responseCoinbase = await requestCoinbase.loadJSON();

  btcUsdRate = parseFloat(responseCoinbase.data.amount);
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
  return usdFees;  
}

