/* eslint-disable */    //3d party code

var fontsSchema = [
    {name: "arabic-script", langs: ["ar"]},
    {name: "cyrillic-script", langs: ["ru"]},
    {name: "latin-script", langs: ["en", "es-ES", "de", "pt-BR", "sv-SE"]},
    {name: "bosnian-cyrillic", langs: []},
    {name: "devanagari", langs: []},
    {name: "greek-script", langs: []},
    {name: "tamil-script", langs: []},
    {name: "chinese-characters", langs: ["zh-CN"]},
    {name: "telugu-script", langs: []},
    {name: "thai-script", langs: []}
];

function detectFont(ln) {
    var style = document.createElement('link');
    style.rel = "stylesheet";
    style.type = "text/css";

    var head = document.getElementsByTagName('head')[0];

    var styleDetected = undefined;

    for(var i = 0; i < fontsSchema.length; i++) {
        var fontSchema = fontsSchema[i];
        var fontLangs = fontSchema['langs'];

        for(var a = 0; a < fontLangs.length; a++) {
            if(ln === fontLangs[a]){                
                styleDetected = '/assets/css/' + fontSchema['name'] + '.css';
                break;
            }
        }
    }

    style.href = styleDetected ? styleDetected : "/assets/css/default-fonts.css";

    head.appendChild(style);
}