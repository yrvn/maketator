const fs = require("fs");
const { Image, createCanvas, loadImage, registerFont } = require("canvas");

const csv = require("csv-parser");
let img = 1;
const width = 744;
const height = 446;
const initTextWidth = 180;
let initTextHeight = 135;
const initMaxWidth = 470;

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
    case "Scavengers":
      background = images["base-scavengers"];
      break;
    case "Promo Set":
      background = images["base-promoset"];
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

let amount = 0;
const drawCardText = (data) => {
  amount = 0;
  let initText = "";
  initTextHeight = 135;
  let initTextSize = 0;
  const lineHeight = 35;

  if (data.production) {
    amount++;
    initText = "Producción: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);

    initTextHeight += wrapText(
      ctx,
      data.production,
      initTextWidth + initTextSize,
      135,
      initMaxWidth - initTextSize,
      lineHeight,
      initTextSize
    );
  }
  if (data.openprod) {
    amount++;
    initText = "Producción Abierta: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);

    ctx.font = "20pt Myriad Pro Cond";
    initTextHeight += wrapText(
      ctx,
      data.openprod,
      initTextWidth + initTextSize,
      135,
      initMaxWidth - initTextSize,
      lineHeight,
      initTextSize
    );
  }
  if (data.feature) {
    amount++;
    initText = "Apoyo: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);
    initTextHeight += wrapText(
      ctx,
      data.feature,
      initTextWidth + initTextSize,
      135,
      initMaxWidth - initTextSize,
      lineHeight,
      initTextSize
    );
  }

  if (data.action) {
    amount++;
    initText = "Acción: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);

    initTextHeight += wrapText(
      ctx,
      data.action,
      initTextWidth + initTextSize,
      initTextHeight,
      initMaxWidth - initTextSize,
      lineHeight,
      initTextSize
    );
  }

  if (data.buildingbonus) {
    amount++;
    initText = "Bonus de Construcción: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);
    ctx.font = "20pt Myriad Pro Cond";
    initTextHeight += wrapText(
      ctx,
      data.buildingbonus,
      initTextWidth + initTextSize,
      initTextHeight,
      initMaxWidth - initTextSize,
      lineHeight,
      initTextSize
    );
  }

  if (data.shield) {
    let shield = images["shield"];
    ctx.drawImage(shield, 744 - 104, -59.5, 116, 119);
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
  const dealWidth = width / 2 - 25;
  const dealHeight = 345;
  let dealImage = null;
  switch (data.deal) {
    case "Ammo":
      dealImage = images["a"];
      break;
    case "Brick":
      dealImage = images["b"];
      break;
    case "Blue Arrow":
      dealImage = images["ab"];
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
      dealImage = images["ar"];
      break;
    case "Worker":
      dealImage = images["w"];
      break;
    case "Gear":
      dealImage = images["ge"];
      break;
    case "Develop":
      dealImage = images["d"];
      break;
    case "Grey Arrow":
      dealImage = images["ag"];
      break;
    case "Shield":
      dealImage = images["s"];
      break;
    case "Ruins":
      dealImage = images["r"];
      break;
  }

  const centerX = dealWidth + 30;
  const centerY = dealHeight + 30;

  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate((Math.PI / 180) * 180);
  ctx.drawImage(dealImage, -30, -30, 60, 60);
  ctx.translate(-centerX, -centerY);
  ctx.restore();
};

const saveCard = () => {
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`./out/img-${img}.png`, buffer);
  img++;
};

const getIcon = (icon) => {
  return images[icon];
};

const getTextLine = (context, text, maxWidth, tabSize) => {
  let words = text.split(" ");
  let line = "";
  let lines = [];
  let maxWidthTest = maxWidth;
  for (let n = 0; n < words.length; n++) {
    if (lines.length == 0) {
      maxWidthTest = maxWidth;
    } else {
      maxWidthTest = maxWidth + tabSize;
    }
    const word = words[n];
    let testLine = line;
    if (word != "\\n") {
      testLine += word + " ";
    }
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (word == "\\n") {
      testWidth = 1000;
    }

    if (testWidth > maxWidthTest && n > 0 && testLine.length > 0) {
      lines.push(testLine);
      line = "";
    } else {
      line = testLine;
      if (words.length == n + 1) {
        lines.push(testLine);
      }
    }
  }
  return lines;
};

let firstAction = true;

const wrapText = (context, text, x, y, maxWidth, lineHeight, tabSize) => {
  context.font = "20pt Myriad Pro Cond";
  let replaced = text.replace(/\(([^)]+)\)/g, "---");
  const matches = [...text.matchAll(/\(([^)]+)\)/g)];
  var words = replaced.split(" ");
  var line = "";
  var firstLine = true;
  var lines = 1;

  let initImgPositionX = 180;
  let currentImgPositionX = 0;
  let first = true;
  let i = 0;
  let j = 0;

  let textLines = getTextLine(context, text, maxWidth, tabSize);

  for (let i = 0; i < textLines.length; i++) {
    let line = textLines[i];
    line = line.replace(/\(([^)]+)\)/g, "       ");
    if (i == 1) {
      x = x - tabSize;
    }
    context.fillText(line, x, y - lineHeight + lineHeight * (i + 1));
    lines = i + 1;
  }

  textLines.forEach((line) => {
    const matches = [...line.matchAll(/\(([^)]+)\)/g)];
    currentImgPositionX = 0;
    first = true;
    matches.forEach((icon) => {
      let image = getIcon(icon[1]);
      let { index, input } = icon;
      let testLine = input.substring(0, index);
      let metrics = context.measureText(testLine.replace(/\(([^)]+)\)/g, ""));

      if (j == 0) currentImgPositionX = tabSize + metrics.width;
      else currentImgPositionX = metrics.width;

      if (!first) currentImgPositionX += 27 * i;
      first = false;
      i++;

      context.drawImage(
        image,
        initImgPositionX + currentImgPositionX,
        initTextHeight + lineHeight * j,
        30,
        30
      );
    });
    j++;
  });
  return lineHeight * lines;
};

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    console.log(`Processing ${row.name}`);
    for (let i = 1; i <= row.quantity; i++) {
      drawBackground(row);
      drawTitle(row);
      drawCardText(row);
      drawDeal(row);
      saveCard();
    }
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
