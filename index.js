const path = require('path');
const visit = require('unist-util-visit');
const fs = require('fs-extra');
const {parse} = require('node-html-parser');

module.exports = function (
  options = {
    destination: 'assets'
  }
) {
  if (Object.keys(options).length === 0 && options.constructor === Object) {
    throw new Error('invalid options');
  }

  function copy(from, to) {
    if (!fs.existsSync(to)) {
      fs.mkdirpSync(path.dirname(to));
      fs.copySync(from, to);
    }
  }

  function imagePath(options, basename, filename) {
    return `${options.destination}/${basename}/${filename}`;
  }

  function transform(tree, file) {
    const basename = path.basename(path.resolve(file.cwd, file.dirname));

    // Images in HTML
    visit(tree, ['html'], (node) => {
      const root = parse(node.value);
      root.querySelectorAll('img').forEach((imageNode) => {
        const url = imageNode.getAttribute('src');
        const from = path.resolve(file.cwd, file.dirname, url);
        const to = path.resolve(
          'public',
          imagePath(options, basename, path.basename(url))
        );
        copy(from, to);
        imageNode.setAttribute(
          'src',
          '/' + imagePath(options, basename, path.basename(url))
        );
      });
      node.value = root.toString();
    });

    // Images directly in markdown
    visit(tree, ['image'], (node) => {
      const from = path.resolve(file.cwd, file.dirname, node.url);
      const to = path.resolve(
        'public',
        imagePath(options, basename, path.basename(node.url))
      );
      copy(from, to);
      node.url = '/' + imagePath(options, basename, path.basename(node.url));
    });
  }

  return transform;
};
