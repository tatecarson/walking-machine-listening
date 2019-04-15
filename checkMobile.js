// TODO: check on androids

const md = new MobileDetect(window.navigator.userAgent);

// only add test file if on desktop
if (md.mobile() !== 'null') {
  document.getElementById('recorded-walk').innerHTML = `
    <source src="myExample.mp3" type="audio/mp3">
    <source src="myExample.wav" type="audio/wav">
    <p>Browser too old to support HTML5 audio? How depressing!</p>
  `;
} else {
  console.log(`you're on mobile`);
}

// force safari, microphone doesn't work in chrome
if (md.mobile() === 'iPhone' && md.userAgent() !== 'Safari') {
  document.body.innerHTML = `
      <section class="hero is-primary is-medium">
      <div class="hero-body">
        <div class="container">
          <h1 class="title">
            Walking
          </h1>
          <h2 class="subtitle">
            It looks like you are using ${md.userAgent()}.
            Please use Safari for this app to work.
          </h2>
        </div>
      </div>
    </section>
  `;
}

// console.log(md.mobile()); // 'Sony'
// console.log(md.phone()); // 'Sony'
// console.log(md.tablet()); // null
// console.log(md.userAgent()); // 'Safari'
// console.log(md.os()); // 'AndroidOS'
// console.log(md.is('iPhone')); // false
// console.log(md.is('bot')); // false
// console.log(md.version('Webkit')); // 534.3
// console.log(md.versionStr('Build')); // '4.1.A.0.562'
// console.log(md.match('playstation|xbox')); // false
