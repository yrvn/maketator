const fs = require("fs");
const { Image, createCanvas, loadImage, registerFont } = require("canvas");

const csv = require("csv-parser");

/*fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    console.log(row);
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });*/

const card = {
  Nombre: "Clay Pit",
  name: "Pozo de arcilla",
  production: "",
  openprod: "",
  feature: "",
  action:
    "Gasta 1 (w) y 1 (b) para ganar 2 (p) y si se hace largo seguroa adsad fasd fasdsdaf asd fasd fads  asfd fasd fdasf asd fads fadsdddadf asdf ads fasd f me va a andar mal esto claramente no? Que te parece?",
  buildingbonus: "La lal lal al a",
  deal: "Worker",
  quantity: "1",
  set: "51st State",
};

//registerFont('fonts/DIRTYEGO.TTF', { family: 'Dirty Ego' })

const width = 744;
const height = 446;

const canvas = createCanvas(width, height);
const ctx = canvas.getContext("2d");

const imageFolders = "./img/";

const imageURL = [];
fs.readdirSync(imageFolders).forEach((file) => {
  if (file.endsWith(".png")) {
    imageURL.push(file.split(".png")[0]);
  }
});

const images = [];

imageURL.forEach((src) => {
  const image = new Image();
  image.src = `img/${src}.png`;
  images[src] = image;
});

const drawBackground = (data) => {
  let background = "";
  switch (data.set) {
    case "51st State":
      background = images["base-51"];
      break;
    case "Winter":
      background = images["base-winter"];
      break;
    case "New Era":
      background = images["base-newera"];
      break;
    default:
      break;
  }
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(background, 0, 0);
};

const drawTitle = (data) => {
  ctx.font = "bold 42pt Dirty Ego";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#232320";
  ctx.textAlign = "center";
  ctx.save();
  ctx.rotate((Math.PI / 180) * -0.9);
  ctx.fillText(data.name, 430, 27);
  ctx.restore();
};
/*
const card = {
  Nombre: "Clay Pit",
  name: "Pozo de arcilla",
  production: "1 (b)",
  openprod: " 1 (d)",
  feature: "-",
  action: "Gasta 1 (w) y 1 (b) para ganar 2 (p)",
  buildingbonus: "La lal lal al a",
  deal: "Brick",
  quantity: "1",
  set: "51st State",
};
 */
const drawCardText = (data) => {
  console.log(
    data.production,
    data.openprod,
    data.feature,
    data.action,
    data.buildingbonus
  );

  let initText = "";
  let initTextHeight = 135;
  let initTextSize = 0;
  const lineHeight = 35;
  if (data.production) {
    initText = "Producción: ".toUpperCase();
    initTextSize = writeText(initText, 180, initTextHeight);

    initTextHeight += wrapText(
      ctx,
      data.production,
      180 + initTextSize,
      135,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
  }
  if (data.openprod) {
    initText = "Producción Abierta: ".toUpperCase();
    initTextSize = writeText(initText, 180, initTextHeight);
    ctx.font = "20pt Myriad Pro Cond";
    initTextHeight += wrapText(
      ctx,
      data.openprod,
      180 + initTextSize,
      135,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
  }
  if (data.feature) {
    initText = "Apoyo: ".toUpperCase();
    initTextSize = writeText(initText, 180, initTextHeight);
    initTextHeight += wrapText(
      ctx,
      data.feature,
      180 + initTextSize,
      135,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
  }

  if (data.action) {
    initText = "Acción: ".toUpperCase();
    initTextSize = writeText(initText, 180, initTextHeight);
    console.log(initTextSize);
    console.log(initTextHeight);

    initTextHeight += wrapText(
      ctx,
      data.action,
      180 + initTextSize,
      initTextHeight,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
    console.log(initTextHeight);
  }

  if (data.buildingbonus) {
    initText = "Bonus de Construcción: ".toUpperCase();
    initTextSize = writeText(initText, 180, initTextHeight);
    ctx.font = "20pt Myriad Pro Cond";
    initTextHeight += wrapText(
      ctx,
      data.buildingbonus,
      180 + initTextSize,
      initTextHeight,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
  }
};

const writeText = (text, x, y, weight) => {
  ctx.font = "bold 20pt Myriad Pro Cond";
  ctx.fillStyle = "#232320";
  ctx.textAlign = "left";
  ctx.fillText(text, x, y);

  const textMetrics = ctx.measureText(text);
  const initTextSize =
    Math.abs(textMetrics.actualBoundingBoxLeft) +
    Math.abs(textMetrics.actualBoundingBoxRight);
  return initTextSize;
};

const drawDeal = (data) => {
  console.log(data);
  const dealWidth = width / 2 - 25;
  const dealHeight = 345;
  let dealImage = null;
  switch (data.deal) {
    case "Brick":
      dealImage = images["b"];
      break;
    case "Blue Arrow":
      dealImage = images["ba"];
      break;
    case "Fuel":
      dealImage = images["f"];
      break;
    case "Star":
      dealImage = images["p"];
      break;
    case "Card":
      dealImage = images["c"];
      break;
    case "Wild Arrow":
      dealImage = images["aw"];
      break;
    case "Gun":
      dealImage = images["g"];
      break;
    case "Red Arrow":
      dealImage = images["b"];
      break;
    case "Worker":
      dealImage = images["w"];
      break;
  }
  ctx.drawImage(dealImage, dealWidth, dealHeight, 60, 60);
};

const saveCard = () => {
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync("./test2.png", buffer);
};

const getIcon = (icon) => {
  return images[icon];
};

/*ctx.strokeStyle = "red";
ctx.moveTo(425, 20);
ctx.lineTo(425, 170);
ctx.stroke();*/

//ctx.fillStyle = "#3574d4";
//const textWidth = ctx.measureText(text).width;
//ctx.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120);

//ctx.save();
//ctx.translate(375 * 2, 375 * 2);
//ctx.translate(375, 375);
//ctx.rotate((Math.PI / 180) * 0.2);

drawBackground(card);
drawTitle(card);
drawDeal(card);
drawCardText(card);
saveCard();

//ctx.translate(-375 * 2, -375 * 2);
//ctx.translate(-375, -375);

/*ctx.fillStyle = "#000";
ctx.fillRect(0, 0, width, height);

ctx.font = "bold 70pt";
ctx.textAlign = "center";
ctx.textBaseline = "top";
ctx.fillStyle = "#3574d4";

const text = "Hello, World!";

const textWidth = ctx.measureText(text).width;
ctx.fillRect(600 - textWidth / 2 - 10, 170 - 5, textWidth + 20, 120);
ctx.fillStyle = "#fff";
ctx.fillText(text, 600, 170);

ctx.fillStyle = "#fff";
ctx.font = "bold 30pt";
ctx.fillText("flaviocopes.com", 600, 530);
*/
/*loadImage("./logo.png").then((image) => {
  ctx.drawImage(image, 340, 515, 70, 70);

});*/

function wrapText(context, text, x, y, maxWidth, lineHeight, tabSize) {
  //console.log(lineHeight);
  context.font = "20pt Myriad Pro Cond";
  var words = text.split(" ");
  var line = "";
  var firstLine = true;
  var lines = 1;

  for (var n = 0; n < words.length; n++) {
    var testLine = line + words[n] + " ";
    var metrics = context.measureText(testLine);
    var testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;

      maxWidth = maxWidth + tabSize;
      if (firstLine) {
        x = x - tabSize;
        firstLine = false;
      }
      lines++;
    } else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
  //  console.log("Y: ", y, "lineheight: ", lineHeight);
  return lineHeight * lines;
}
