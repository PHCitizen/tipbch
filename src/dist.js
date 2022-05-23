const fs = require("fs");

const files = ["index.html", "style.css"];

const pathNow = "./src/";
const distPath = "./dist/";
fs.mkdirSync(distPath + "images", { recursive: true });

const cb = (file) => (err) => {
  if (err) throw err;
  console.log(`Successfully copy - ${file}`);
};

for (const file of files) {
  fs.copyFile(`${pathNow}${file}`, `${distPath}${file}`, cb(file));
}

const images = fs.readdirSync(`${pathNow}/images`, {});

for (const file of images) {
  fs.copyFile(
    `${pathNow}images/${file}`,
    `${distPath}images/${file}`,
    cb(file)
  );
}
