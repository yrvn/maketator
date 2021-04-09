const fs = require("fs");
const { Image, createCanvas, loadImage, registerFont } = require("canvas");

const csv = require("csv-parser");
let img = 1;
const width = 296;
const height = 437;
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
  let background = images["back"];
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(background, 0, 0);
};

const drawTitle = (data) => {
  ctx.font = "bold 24pt Pirata One";
  ctx.textBaseline = "top";
  ctx.fillStyle = "#232320";
  ctx.textAlign = "center";
  ctx.fillText(capitalize(data.Name), width / 2, 95);
};

const drawCardText = (data) => {
  ctx.font = "14pt High Tower Text";
  ctx.fillStyle = "#232320";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let text = data.Desc,
    maxWidth = 150;
  let temp = "",
    row = [];

  let words = text.split(" "),
    line = "",
    i,
    test,
    metrics;

  for (i = 0; i < words.length; i++) {
    test = words[i];
    metrics = ctx.measureText(test);
    while (metrics.width > maxWidth) {
      test = test.substring(0, test.length - 1);
      metrics = ctx.measureText(test);
    }
    if (words[i] != test) {
      words.splice(i + 1, 0, words[i].substr(test.length));
      words[i] = test;
    }

    test = line + words[i] + " ";
    metrics = ctx.measureText(test);

    if (metrics.width > maxWidth && i > 0) {
      row.push(line);
      line = words[i] + " ";
    } else {
      line = test;
    }
  }
  row.push(line);

  for (let b = 0; b < row.length; b++) {
    ctx.fillText(
      row[b],
      width / 2,
      height / 2 + (b - row.length / 2) * 20,
      maxWidth
    );
  }
};

const saveCard = () => {
  const buffer = canvas.toBuffer("image/png");
  fs.writeFileSync(`./out/img-${img}.png`, buffer);
  img++;
};

const capitalize = (s) => {
  if (typeof s !== "string") return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
};

fs.createReadStream("data.csv")
  .pipe(csv())
  .on("data", (row) => {
    console.log(`Processing ${row.Name}`);
    drawBackground(row);
    drawTitle(row);
    drawCardText(row);
    saveCard();
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
  });
