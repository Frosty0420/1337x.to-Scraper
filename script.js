const { chromium } = require('playwright-chromium');
const fs = require("fs");

(async () => {
    let search = '';
    for (let i = 2; i < process.argv.length; i++) {
        search += process.argv[i] + ' ';
    }
    search = search.trim();

    let browser = await chromium.launch({ slowMo: 150 });
    let page = await browser.newPage();

    await page.goto('https://1337x.to/');
    await page.fill('[name="search"]', search);
    await page.click('text=Search');

    const totalPages = await page.$$eval('li.last a', (t) => {
        const data = [];
        t.forEach(x => {
            let link = x.href;
            data.push(link.slice(link.length - 3, link.length - 1).replace('/', ''));
        });

        return data[0];
    });

    let torrents = [];
    for (let i = 1; i <= totalPages; i++) {
        try {

            let torrentsPerPage = await page.$$eval(
                "tbody tr",
                (torrentRow) => {
                    return torrentRow.map((torrent) => {
                        const link = torrent.querySelector('td.coll-1.name > a:nth-child(2)').href;
                        const name = torrent.querySelector('td.coll-1.name > a:nth-child(2)').textContent;
                        const uploader = torrent.querySelector('td.coll-5 a').textContent;
                        if (uploader.includes('QxR')) {
                            return {
                                name,
                                link,
                            };
                        }
                    });
                }
            );

            if (i != totalPages) {
                if (totalPages <= 7) {
                    let url = page.url();
                    url = url.split('');
                    url[url.length - 2] = i + 1;
                    url = url.join('');
                    await page.goto(url);
                } else {
                    await page.click(".pagination > ul:nth-child(1) > li:nth-child(8) > a:nth-child(1)");
                }
            }

            torrentsPerPage = torrentsPerPage.filter(x => x != undefined);

            if (torrentsPerPage.length > 0) {
                torrents.push({
                    page: i,
                    torrents: torrentsPerPage,
                });
            }

        } catch (error) {
            console.log({ error });
        }
    }

    fs.writeFile('torrents.json', JSON.stringify(torrents), 'utf8', function (err) {
        if (err) throw err;
        console.log('complete');
    });

    await browser.close();
})();
