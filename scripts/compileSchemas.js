const j2ts = require('json-schema-to-typescript');
const directoryTree = require('directory-tree');
const fs = require('fs');

fs.writeFileSync('src/types.ts', '/* eslint-disable */\n/** Execute `npm run compileSchema` to regenerate **/\n\n');

directoryTree('src/ocpp-1.6-schemas', { extensions: /\.json$/ }, (item, PATH) => {
  console.log(item.path);

  j2ts.compileFromFile(item.path, {
    cwd: 'src/ocpp-1.6-schemas',
    bannerComment: '// ----------------------------------------------- '
  })
    .then(ts => fs.appendFileSync('src/types.ts', ts));
});
