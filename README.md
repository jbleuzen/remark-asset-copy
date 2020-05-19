# remark-asset-copy

Copy assets from markdown to a folder inside `public`.

I created this because there was no easy way to have this type of file structure with [next.js]() without using `require()`.

```text
/
|- content
|   |-post-slug
|   |   |- index.md
|   |   |- image.jpg
```

## How to use

Basic example :

``` js
import remark from 'remark';
import vfile from 'vfile';
import frontmatter from 'remark-frontmatter';
import assetCopy from 'remark-asset-copy';

const processedContent = await remark()
  .use(frontmatter)
  .use(html)
  .use(copy, {
    destination: "public/assets",
  })
  .process(vfile.readSync(fullPath));
const contentHtml = processedContent.toString();
```

## Tests

Basic testing is implemented but a deeper tests must be written
