# custom-emoji-json

custom-emoji-json is a web UI that allows you to select emojis and categorize them for the purpose of dowloading as a json.
It allows you to later import your json for further editing.

![Alt text](/customEmojiPic.png?raw=true "Screen Shot")

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Bower](https://bower.io/)
* [Ember CLI](https://ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* `cd custom-emoji-json`
* `npm install`
* `bower install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

### Building

* `ember build` (development)
* `ember build --environment production` (production)

* `npm run start` to run on local server

## Further Reading / Useful Links

* [ember.js](http://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

## Thanks to [emoji.json](https://github.com/amio/emoji.json/tree/d7d6adc5fe441d2c0df59b42caeadb8ad4eacade) package
for the following script that gets the source emoji json needed from [Full Emoji List](http://unicode.org/emoji/charts/full-emoji-list.html) 

```javascript
{
  const { $$, copy } = window // Chrome Console API
  const ids = $$('td.rchars')
  const trs = ids.map(e => e.parentElement).filter(x => x.children.length === 15)
  const db = trs.map(tr => {
    const tds = tr.children
    return {
      no: parseInt(tds[0].innerText),
      code: tds[1].innerText.replace(/U\+/g, ''),
      char: tds[2].innerText,
      name: tds[14].innerText
    }
  })
  copy(JSON.stringify(db, null, 2))
}
```
