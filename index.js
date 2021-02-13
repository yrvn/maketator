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
    "Gasta 1 (w) y 1 (b) para ganar 2 (p). Además si sigo (ge) escribiendo me voy a pasar para la 2da linea ",
  buildingbonus: "",
  deal: "Worker",
  quantity: "1",
  set: "51st State",
};

const width = 744;
const height = 446;
const initTextWidth = 180;

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
    initTextSize = writeText(initText, initTextWidth, initTextHeight);

    initTextHeight += wrapText(
      ctx,
      data.production,
      initTextWidth + initTextSize,
      135,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
  }
  if (data.openprod) {
    initText = "Producción Abierta: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);
    ctx.font = "20pt Myriad Pro Cond";
    initTextHeight += wrapText(
      ctx,
      data.openprod,
      initTextWidth + initTextSize,
      135,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
  }
  if (data.feature) {
    initText = "Apoyo: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);
    initTextHeight += wrapText(
      ctx,
      data.feature,
      initTextWidth + initTextSize,
      135,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
  }

  if (data.action) {
    initText = "Acción: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);
    console.log(initTextSize);
    console.log(initTextHeight);

    initTextHeight += wrapText(
      ctx,
      data.action,
      initTextWidth + initTextSize,
      initTextHeight,
      450 - initTextSize,
      lineHeight,
      initTextSize
    );
    console.log(initTextHeight);
  }

  if (data.buildingbonus) {
    initText = "Bonus de Construcción: ".toUpperCase();
    initTextSize = writeText(initText, initTextWidth, initTextHeight);
    ctx.font = "20pt Myriad Pro Cond";
    initTextHeight += wrapText(
      ctx,
      data.buildingbonus,
      initTextWidth + initTextSize,
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
  fs.writeFileSync("./test2.png", buffer);
};

const getIcon = (icon) => {
  return images[icon];
};

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

const getTextLine = (context, text, maxWidth, tabSize) => {
  let words = text.split(" ");
  let line = "";
  let lines = [];
  let maxWidthTest = maxWidth;
  for (let n = 0; n < words.length; n++) {
    if (lines.length == 0) {
      maxWidthTest = maxWidth;
    } else {
      //maxWidthTest = maxWidth - tabSize;
    }
    const word = words[n];
    let testLine = line + word + " ";
    let metrics = context.measureText(testLine);
    let testWidth = metrics.width;
    if (testWidth > maxWidthTest && n > 0) {
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

const wrapText = (context, text, x, y, maxWidth, lineHeight, tabSize) => {
  context.font = "20pt Myriad Pro Cond";
  let replaced = text.replace(/\(([^)]+)\)/g, "---");
  //const matches = text.matchAll(/\(([^)]+)\)/g);
  const matches = [...text.matchAll(/\(([^)]+)\)/g)];
  //console.log(matches);
  var words = replaced.split(" ");
  var line = "";
  var firstLine = true;
  var lines = 1;
  let initTextHeight = 135;
  let initImgPositionX = 180;
  let currentImgPositionX = 0;
  let first = true;
  let i = 0;
  let j = 0;

  let textLines = getTextLine(context, text, maxWidth, tabSize);

  textLines.forEach((line) => {
    const matches = [...line.matchAll(/\(([^)]+)\)/g)];
    currentImgPositionX = 0;
    matches.forEach((icon) => {
      let image = getIcon(icon[1]);
      let { index, input } = icon;
      let testLine = input.substring(0, index);
      console.log(testLine);
      let metrics = context.measureText(testLine.replace(/\(([^)]+)\)/g, ""));
      if (j == 0) currentImgPositionX = tabSize + metrics.width;
      else currentImgPositionX = metrics.width - tabSize;

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
  console.log("Text", textLines);
  /*matches.forEach((icon) => {
    console.log(icon);
    let image = getIcon(icon[1]);
    let { index, input } = icon;

    let testLine = input.substring(0, index);
    console.log(testLine);
    let metrics = context.measureText(testLine.replace(/\(([^)]+)\)/g, ""));
    currentImgPositionX = tabSize + metrics.width;
    //if (currentImgPositionX > maxWidth) {
     // initTextHeight += lineHeight * j;
      //j++;
      //currentImgPositionX = 0;
    //}
    console.log(
      "LOG",
      textLines.find((el) => el.includes(testLine))
    );

    if (!first) currentImgPositionX += 27 * i;
    first = false;
    i++;
    console.log(initTextHeight);
    context.drawImage(
      image,
      initImgPositionX + currentImgPositionX,
      initTextHeight,
      30,
      30
    );
  });*/

  /*for (var n = 0; n < words.length; n++) {
    if (words[n] === "---") {
      words[n] = "       ";
    }
    if (words[n] === "---.") {
      words[n] = "       .";
    }
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
  }*/
  for (let i = 0; i < textLines.length; i++) {
    let line = textLines[i];
    line = line.replace(/\(([^)]+)\)/g, "       ");
    if (i == 1) {
      x = x - tabSize;
    }
    context.fillText(line, x, y - lineHeight + lineHeight * (i + 1));
  }

  return lineHeight * lines;
};

drawBackground(card);
drawTitle(card);
drawCardText(card);
drawDeal(card);

saveCard();
