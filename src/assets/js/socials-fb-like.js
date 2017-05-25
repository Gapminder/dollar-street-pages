/* eslint-disable */    //3d party code
function fbContent() {
  (function (d, s, id) {
    var languageReplaceSchema = {
      ur_IN: "ur_PK"
    };
    var currentLanguage = window.getLanguageIso();
    if(currentLanguage in languageReplaceSchema){
      currentLanguage = languageReplaceSchema[currentLanguage];
    }    
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = '//connect.facebook.net/'+currentLanguage+'/sdk.js#xfbml=1&version=v2.8';
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));
}

document.addEventListener('DOMContentLoaded', fbContent);
