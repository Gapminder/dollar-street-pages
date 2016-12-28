/* eslint-disable */

var fontsSchema = [
  {name: 'arabic-script', codes: ['ar']},
  {name: 'cyrillic-script', codes: ['ru']},
  {name: 'latin-script', codes: ['en', 'es-ES', 'de', 'pt-BR', 'sv-SE']},
  {name: 'bosnian-cyrillic', codes: []},
  {name: 'devanagari', codes: []},
  {name: 'greek-script', codes: []},
  {name: 'tamil-script', codes: []},
  {name: 'chinese-characters', codes: ['zh-CN']},
  {name: 'telugu-script', codes: []},
  {name: 'thai-script', codes: []}
];

function detectFont(currentLang) {
  var style = document.createElement('link');
  style.rel = 'stylesheet';
  style.type = 'text/css';

  var head = document.getElementsByTagName('head')[0];

  var styleDetected = null;

  fontsSchema.forEach(function (font) {
      if (font.codes.indexOf(currentLang) === -1) {
        return;
      }

      styleDetected = '/assets/css/' + font.name + '.css';
    }
  );

  style.href = styleDetected ? styleDetected : '/assets/css/default-fonts.css';

  head.appendChild(style);
}

/* eslint-enable */
