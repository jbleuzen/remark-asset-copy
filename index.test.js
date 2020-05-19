const path = require('path');
const remark = require('remark');
const vfile = require('to-vfile');
const frontmatter = require('remark-frontmatter');
const html = require('remark-html');
const fs = require('fs-extra');

var assetCopy = require('./index');

['./fixtures/markdown-image.md', './fixtures/html-image.md'].forEach(
  (fixture) => {
    describe('FileSystem operations ' + fixture, () => {
      jest.spyOn(fs, 'existsSync');
      jest.spyOn(fs, 'mkdirpSync');
      jest.spyOn(fs, 'copySync');

      afterEach(() => {
        jest.clearAllMocks();
      });

      it('Copy image if not in public', () => {
        fs.existsSync.mockReturnValue(false);
        fs.mkdirpSync.mockReturnValue(true);
        fs.copySync.mockReturnValue(true);
        remark()
          .use(frontmatter)
          .use(html)
          .use(assetCopy)
          .process(vfile.readSync(fixture));

        expect(fs.existsSync).toHaveBeenCalledTimes(1);
        expect(fs.mkdirpSync).toHaveBeenCalledWith(
          path.resolve('./public/assets/fixtures')
        );
        expect(fs.copySync).toHaveBeenCalledWith(
          path.resolve('./fixtures/image.jpg'),
          path.resolve('./public/assets/fixtures/image.jpg')
        );
      });

      it("Don't copy image if already in public", () => {
        fs.existsSync.mockReturnValue(true);
        remark()
          .use(frontmatter)
          .use(html)
          .use(assetCopy)
          .process(vfile.readSync(fixture));

        expect(fs.existsSync).toHaveBeenCalledTimes(1);
      });
    });
  }
);

describe('options', () => {
  it('Invalid options', () => {
    expect(() => {
      remark()
        .use(frontmatter)
        .use(html)
        .use(assetCopy, {})
        .process(vfile.readSync('./fixtures/markdown-image.md'));
    }).toThrow();
  });
});
