export const handleSetN8nLanguage = (lang) => {
  switch(lang) {
    case 'de-DE':
      return 'deu';
    case 'en-US':
      return 'eng';
    case 'es-ES':
      return 'spa';
    case 'vi-VN':
      return 'vie';
    case 'fr-FR':
      return 'fra';
    case 'it-IT':
      return 'ita';
    case 'zh-CN':
      return 'zho';
    case 'ko-KR':
      return 'kor';
    case 'th-TH':
      return 'tha';
    default:
      break;
  }
}