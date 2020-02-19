const axios = require("axios").default;
const args = require("minimist")(process.argv.slice(2));
const fs = require("fs");
const https = require("https");
const { TOKEN, URL } = require("./config.json");
const format = args.f || args.format || "svg";
const dir = args.d || args.dir || "./";
const size = args.s || args.size || "1";
const flattenMessages = require("./flattenItem");
const main = async () => {
  const file = args["_"][0];
  if (args.h || args.help) {
    return console.log("Use node index.js <FIGMA FILE_ID>");
  }
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  parseFile(file);
};

const parseFile = async file => {
  try {
    const { data } = await axios.get(`${URL}/files/${file}`, {
      headers: { "X-FIGMA-TOKEN": TOKEN }
    });
    const pages = data.document.children;
    pages.forEach(page => {
      const frames = page.children;
      frames.forEach(frame => {
        if (frame.type === "FRAME") {
          if (frame.children.length > 0) {
            const components = frame.children;
            components.forEach(component => {
              if (
                component.type === "COMPONENT" ||
                component.type === "GROUP"
              ) {
                let deepinIdsElements = [];
                let deepinChildrenElementsName = [component.name];
                const deepinIds = flattenMessages(component);
                Object.keys(deepinIds).forEach(t => {
                  if (t.endsWith(".id")) {
                    deepinIdsElements.push(deepinIds[t]);
                  }
                  if (t.endsWith(".name")) {
                    deepinChildrenElementsName.push(deepinIds[t]);
                  }
                });
                const toFetch = [component.id, ...deepinIdsElements];
                for (index in toFetch) {
                  exportFile(
                    file,
                    toFetch[index],
                    deepinChildrenElementsName[index],
                    format
                  );
                }
              }
            });
          }
        }
      });
    });
  } catch (e) {
    console.log(e);
  }
};

const exportFile = async (file, id, name, format) => {
  try {
    const { data } = await axios.get(
      `${URL}/images/${file}?ids=${id}&format=${format}`,
      {
        headers: { "X-FIGMA-TOKEN": TOKEN }
      }
    );
    const localFile = fs.createWriteStream(`${dir}/${name}-${size}x.${format}`);
    https.get(data.images[id], response => {
      response.pipe(localFile);
    });
  } catch (e) {
    console.error(e);
  }
};

main();
