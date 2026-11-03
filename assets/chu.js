/* Радио «Чу FM» — radio.vnurzhan.com */
(function () {
  var C = window.CHU || {}, EN = !!C.en;
  function T(r, e) { return EN ? e : r; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  // Nurzhan time is UTC+6
  function irNow() { var d = new Date(); return new Date(d.getTime() + (d.getTimezoneOffset() + 360) * 60000); }
  var now = irNow();
  var MR = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  var ME = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  var DR = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
  var DE = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var el = document.getElementById("chu-date");
  if (el) el.textContent = EN ? DE[now.getDay()] + ", " + now.getDate() + " " + ME[now.getMonth()] + " " + now.getFullYear()
                              : DR[now.getDay()] + ", " + now.getDate() + " " + MR[now.getMonth()] + " " + now.getFullYear();

  // schedule: what is on now
  var dk = now.getDay() === 6 ? "sat" : now.getDay() === 0 ? "sun" : "wd";
  var hm = pad(now.getHours()) + ":" + pad(now.getMinutes());
  var rows = (C.grid || []).filter(function (g) { return g[6] === "all" || g[6] === dk; }).sort(function (a, b) { return a[0] < b[0] ? -1 : 1; });
  var cur = 0;
  rows.forEach(function (g, i) { if (g[0] <= hm) cur = i; });
  function hostName(id) {
    if (!id) return "";
    var ids = (C.pairs && C.pairs[id]) || [id];
    return ids.map(function (x) { return C.hosts[x][EN ? 1 : 0]; }).join(EN ? " and " : " и ");
  }
  function hostFirst(id) { return id ? ((C.pairs && C.pairs[id]) || [id])[0] : null; }
  var g = rows[cur], nx = rows[(cur + 1) % rows.length];
  if (g) {
    var nm = EN ? g[3] : g[2];
    var n1 = document.getElementById("chu-now"); if (n1) n1.textContent = nm;
    var h1 = document.getElementById("chu-host"); if (h1) h1.textContent = hostName(g[4]);
    var n2 = document.getElementById("chu-next"); if (n2) n2.textContent = nx[0] + " " + (EN ? nx[3] : nx[2]);
    var oa = document.getElementById("chu-onair");
    if (oa) {
      var up = EN ? "../" : "", hf = hostFirst(g[4]);
      if (hf === "rudneva") oa.querySelector(".oa-ph").innerHTML = '<img src="' + up + 'photos/rudneva.jpg" alt="">';
      oa.querySelector("p").innerHTML = "<b>" + nm + "</b>" + g[0] + "–" + g[1] + (g[4] ? "<br>" + hostName(g[4]) : "");
    }
  }
  // highlight the running show in any schedule table for today
  document.querySelectorAll(".sched").forEach(function (t) {
    var pane = t.parentNode.getAttribute("data-pane");
    if (pane && pane !== dk) return;
    t.querySelectorAll("tr").forEach(function (r) {
      var s = r.getAttribute("data-s"), e = r.getAttribute("data-e");
      if (s <= hm && (hm < e || e === "00:00" && s !== "00:00")) r.className = "now";
    });
  });
  // schedule tabs, open today's
  var tabs = document.getElementById("chu-tabs");
  function showTab(k) {
    document.querySelectorAll("[data-tab]").forEach(function (b) { b.className = b.getAttribute("data-tab") === k ? "on" : ""; });
    document.querySelectorAll("[data-pane]").forEach(function (p) { p.hidden = p.getAttribute("data-pane") !== k; });
  }
  if (tabs) tabs.addEventListener("click", function (e) { var k = e.target.getAttribute("data-tab"); if (k) showTab(k); });
  showTab(dk);

  // the player: the stream has been "temporarily" off since March 2025
  var play = document.querySelector("[data-play]"), msg = document.getElementById("chu-msg");
  if (play) play.addEventListener("click", function () {
    play.className = "play err";
    var eq = document.querySelector(".eq");
    if (eq) eq.style.opacity = ".3";
    setTimeout(function () { if (msg) msg.hidden = false; }, 1400);
  });

  // slider
  var sl = document.getElementById("chu-slider");
  if (sl) {
    var ss = sl.querySelectorAll(".sl"), dd = sl.querySelectorAll(".dots i"), k = 0;
    setInterval(function () {
      ss[k].className = ss[k].className.replace(" on", ""); dd[k].className = "";
      k = (k + 1) % ss.length;
      ss[k].className += " on"; dd[k].className = "on";
    }, 5500);
  }

  // greetings form and the Request Desk running order: assets/zakaz.js

  // chart votes: one a day, remembered in the browser
  var vm = document.getElementById("chu-votemsg");
  document.querySelectorAll("[data-vote]").forEach(function (b) {
    b.addEventListener("click", function () {
      var day = now.getFullYear() + "-" + now.getMonth() + "-" + now.getDate(), seen = null;
      try { seen = localStorage.getItem("chu_vote"); } catch (x) {}
      if (seen === day) { if (vm) vm.innerHTML = "<b>" + T("Вы уже голосовали сегодня. Приходите завтра!", "You have already voted today. Come back tomorrow!") + "</b>"; return; }
      try { localStorage.setItem("chu_vote", day); } catch (x) {}
      b.textContent = T("Спасибо!", "Thanks!"); b.disabled = true;
      if (vm) vm.innerHTML = "<b>" + T("Ваш голос учтён. Итоги — в субботу в 12:00.", "Your vote has been counted. Results on Saturday at 12:00.") + "</b>";
    });
  });

  // rate card PDF
  var pdf = document.querySelector("[data-pdf]");
  if (pdf) pdf.addEventListener("click", function (e) { e.preventDefault(); var m = document.querySelector(".pdfmsg"); if (m) m.hidden = false; });

  // menu on phones, back to top
  var bg = document.querySelector(".burger");
  if (bg) bg.addEventListener("click", function () { var n = document.querySelector(".nav"); n.className = n.className.indexOf("open") > -1 ? "nav" : "nav open"; });
  var tt = document.querySelector(".totop");
  if (tt) window.addEventListener("scroll", function () { tt.style.display = window.scrollY > 400 ? "block" : "none"; });

  // today's numbers: Nurzhan weather
  fetch("https://iradone.com/data/today.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (d) {
    var w = (d.weather && d.weather.places || []).filter(function (p) { return p.id === "nurzhan"; })[0];
    if (!w) return;
    var t3 = w.temps_3h ? w.temps_3h[Math.min(7, Math.floor(now.getHours() / 3))] : w.high;
    function sg(n) { return (n > 0 ? "+" : n < 0 ? "−" : "") + Math.abs(n) + "°"; }
    var lab = w.label ? (EN ? w.label.en : w.label.ru) : "";
    var wx = document.getElementById("chu-wx"); if (wx) wx.textContent = T("Нуржан ", "Nurzhan ") + sg(t3);
    var box = document.getElementById("chu-wxbox");
    if (box) {
      var h = '<div class="t">' + sg(t3) + "</div>" + lab + "<br>" + T("Днём ", "High ") + sg(w.high) + ", " + T("ночью ", "low ") + sg(w.low);
      if (w.forecast) h += "<table>" + w.forecast.map(function (f) {
        var dd = new Date(f.date + "T12:00:00");
        return "<tr><td>" + (EN ? DE[dd.getDay()] : DR[dd.getDay()]) + "</td><td>" + (EN ? f.label.en : f.label.ru) + "</td><td>" + sg(f.high) + "/" + sg(f.low) + "</td></tr>";
      }).join("") + "</table>";
      box.innerHTML = h;
    }
  }).catch(function () {
    var box = document.getElementById("chu-wxbox"); if (box) box.textContent = T("Информер погоды временно недоступен.", "Weather informer temporarily unavailable.");
  });
})();
