const { registerTransforms } = require('@tokens-studio/sd-transforms');
const StyleDictionary = require('style-dictionary');
const config = require('./config');
const https = require('https');
const fs = require('fs');

const links = process.env['LINKS'].split(',');

registerTransforms(StyleDictionary, {
  expand: {
    composition: false,
    typography: config.typographyOptions,
    border: false,
    shadow: false,
  },
  excludeParentKeys: false,
});
links.map((link) => {
  https.get(link, res => {
    let data = "";
    const fileName = link.split('/').pop()
    res.on("data", chunk => {
      data += chunk;
    });

    res.on("end", () => {
      if (!fs.existsSync(__dirname + '/themes/')) {
        fs.mkdirSync(__dirname + '/themes/', { recursive: true});
      }
      fs.writeFile(__dirname + '/themes/' + fileName, data,'utf-8', (err, ) => {
        if(err) {
          console.log('Error write json file', err)
          return
        }
        console.log('File created')
        parseFile(fileName)
      })
    });
  })
})

function parseFile(token) {
      const fileName = token.split('.')[1];
      const sd = StyleDictionary.extend(config.parserConfig(token, fileName));
      sd.cleanAllPlatforms();
      sd.buildAllPlatforms();
}
