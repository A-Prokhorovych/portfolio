# Archiving Commercial Projects

Special-project pages can disappear from the original website. Keep two independent archive formats.

## Recommended workflow

1. Open the project page and wait until images, animations, and fonts have loaded.
2. Save the page with the SingleFile browser extension as one self-contained HTML file.
3. Record the page with ArchiveWeb.page and export a WACZ file.
4. Keep a 1920x1080 cover screenshot in `public/projects/covers/` for the portfolio.
5. Store archived HTML and WACZ files locally and in a second private backup location.

## Suggested local structure

```text
project-archive/
  2019-petruhamaster/
    2019-petruhamaster.html
    2019-petruhamaster.wacz
    source-url.txt
```

Use the same slug as the cover filename. Put the original URL and capture date in `source-url.txt`.

## Tools

- SingleFile: saves a complete page as a self-contained HTML file.
  https://github.com/gildas-lormeau/SingleFile
- ArchiveWeb.page: records browsed pages and exports WACZ/WARC archives.
  https://webrecorder.net/archivewebpage/
- ReplayWeb.page: opens WACZ archives.
  https://replayweb.page/

## GitHub guidance

Keep portfolio covers in this public repository. Do not use GitHub Pages as the primary storage for complete mirrored commercial pages: archives can be large, may depend on scripts, and can contain third-party copyrighted assets.

For complete archives, prefer:

- a local external drive;
- encrypted cloud storage;
- a private Git repository with Git LFS for large archive files.

Always keep at least two copies in different locations.
