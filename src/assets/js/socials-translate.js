/* eslint-disable */    //3d party code

window.addEventListener('DOMContentLoaded', function () {
  var htmlElement = document.getElementsByTagName('html')[0];

  htmlElement.attributes.lang.value = window.currentLanguage;
}, true);

window.getLanguageIso = function () {
  var currentLanguage = window.currentLanguage;

  var currentIsoLanguage = currentLanguage.length === 2 ? currentLanguage + '_' + currentLanguage.toUpperCase() : currentLanguage.replace(/-/g, '_');

  return currentIsoLanguage;
};
