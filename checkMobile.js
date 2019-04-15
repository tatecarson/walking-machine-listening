const md = new MobileDetect(window.navigator.userAgent);

if (md.mobile()) {
  document.getElementById('recorded-walk').style.display = 'none';
}

console.log(md.mobile()); // 'Sony'
console.log(md.phone()); // 'Sony'
console.log(md.tablet()); // null
console.log(md.userAgent()); // 'Safari'
console.log(md.os()); // 'AndroidOS'
console.log(md.is('iPhone')); // false
console.log(md.is('bot')); // false
console.log(md.version('Webkit')); // 534.3
console.log(md.versionStr('Build')); // '4.1.A.0.562'
console.log(md.match('playstation|xbox')); // false
