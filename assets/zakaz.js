/* Радио «Чу FM»: «Стол заказов». The greetings form keeps the listener's greeting in this browser only and puts it
   in tomorrow's running order; the other listeners' greetings are drawn from the date, so everyone sees the same
   list. Nothing is sent anywhere. */
(function () {
  var C = window.CHU || {}, EN = !!C.en, KEY = "chu_zakaz";
  function T(r, e) { return EN ? e : r; }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function irNow() { var d = new Date(); return new Date(d.getTime() + (d.getTimezoneOffset() + 360) * 60000); }
  function ymd(d) { return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate()); }
  var now = irNow(), TODAY = ymd(now), TOMORROW = ymd(new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1));
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  var FROM = [["Галина Петровна", "Galina Petrovna"], ["Семья Ким", "The Kim family"], ["Айгуль, «Нуржанмаш»", "Aigul, Nurzhanmash"],
    ["Смена «В», НПЗ", "Shift C, the refinery"], ["Водители маршрутки № 12", "The drivers of marshrutka No. 12"], ["Бабушка Валя", "Granny Valya"],
    ["Тимур и Света", "Timur and Sveta"], ["Коллектив школы № 48", "The staff of School 48"], ["Ряд 9, Радиобазар", "Row 9, Radiobazar"],
    ["Олег, дальнобойщик", "Oleg, long-haul driver"], ["Наталья Ивановна, Северный посёлок", "Natalya Ivanovna, the northern settlement"],
    ["Дети и внуки", "Children and grandchildren"], ["Марат С.", "Marat S."], ["Девчонки из «Жылдыз Маркета»", "The girls at Jıldız Market"],
    ["Бригада «Нуржандорстроя»", "The Nurzhandorstroy crew"], ["Лена, 11 «А»", "Lena, 11A"], ["Семья Пак", "The Pak family"],
    ["Азамат и Динара", "Azamat and Dinara"], ["Соседи, пр. Азатлык, 40", "The neighbours at 40 Azatlık Prospect"], ["Таксопарк «Чуй»", "Chuy taxi depot"],
    ["Вера Николаевна", "Vera Nikolaevna"], ["Жена и дочка", "Your wife and daughter"], ["Болельщики «Нефтчи», сектор Б", "Neftchi fans, stand B"],
    ["Медсёстры горбольницы № 2", "The nurses of City Hospital No. 2"], ["Руслан из Москвы", "Ruslan in Moscow"], ["Ваши соседи по даче", "Your dacha neighbours"]];
  // recipients with the kind of greeting that suits them (KIND lists TXT entries)
  var TO = [["маме", "Mum", "f"], ["любимой жене Наташе", "my dear wife Natasha", "f"], ["сыну Тимуру в армию", "our son Timur, in the army", "army"],
    ["всей нашей смене", "our whole shift", "shift"], ["Палычу и всем дальнобойщикам", "Palych and all the long-haul drivers", "road"], ["бабушке Вале", "Granny Valya", "f"],
    ["нашей учительнице Ольге Сергеевне", "our teacher Olga Sergeevna", "f"], ["Дане", "Dana", "f"], ["коллективу «Нуржанмаша»", "everyone at Nurzhanmash", "pl"],
    ["подруге Айгерим", "my friend Aigerim", "f"], ["дедушке Ивану Степановичу", "Grandad Ivan Stepanovich", "m"], ["молодым — Артуру и Камиле", "the newly-weds, Artur and Kamila", "newly"],
    ["брату Руслану в Москву", "my brother Ruslan, in Moscow", "far"], ["всем, кто сейчас в дороге", "everyone on the road tonight", "road"], ["нашему папе", "our dad", "m"],
    ["тёте Люде", "Auntie Lyuda", "f"], ["всему 9 «В»", "the whole of 9C", "pl"], ["соседке Розе Ахмедовне", "our neighbour Roza Akhmedovna", "f"],
    ["всем медсёстрам ночной смены", "all the nurses on the night shift", "shift"], ["Светлане Рудневой и всему «Городу»", "Svetlana Rudneva and everyone at Gorod", "pl"],
    ["молодым родителям Диме и Асель", "the new parents, Dima and Asel", "parents"], ["нашим родителям", "our parents", "couple"],
    ["другу Серёге", "my mate Seryoga", "m"], ["свату Бакыту", "Bakyt, our in-law", "m"]];
  var KIND = { f: [0, 1, 2, 5, 7, 11, 13, 14], m: [0, 2, 5, 7, 11, 13, 14], army: [5, 6, 12], shift: [5, 7, 8], road: [5, 16],
    pl: [5, 7], newly: [4, 15], far: [5, 6], parents: [9, 10], couple: [3, 15] };
  var TXT = [["С днём рождения! Здоровья, счастья и долгих лет.", "Happy birthday! Health, happiness and many years."],
    ["С днём рождения! Оставайся такой же весёлой.", "Happy birthday! Stay as cheerful as ever."],
    ["Поздравляем с днём рождения, желаем мирного неба и тёплого дома.", "Happy birthday: we wish you a peaceful sky and a warm home."],
    ["С годовщиной свадьбы! Любви вам и терпения.", "Happy wedding anniversary! Love and patience to you both."],
    ["Совет да любовь!", "Love and harmony to you both!"],
    ["Просто привет! Мы вас слышим и любим.", "Just saying hello! We hear you and love you."],
    ["Привет из Нуржана! Скучаем, ждём домой.", "Hello from Nurzhan! We miss you, come home soon."],
    ["Спасибо за всё. Пусть этот вечер будет добрым.", "Thank you for everything. Have a good evening."],
    ["Привет всем, кто на смене! Держитесь, до утра немного.", "Hello to everyone on shift! Hang on, it's not long till morning."],
    ["С рождением сына! Пусть растёт здоровым.", "Congratulations on your baby son! May he grow up healthy."],
    ["С рождением дочки! Счастья вашей семье.", "Congratulations on your baby daughter! Happiness to your family."],
    ["С выходом на пенсию! Теперь — дача и внуки.", "Happy retirement! Now it's the dacha and the grandchildren."],
    ["Служи достойно, ждём домой!", "Serve well, we're waiting for you at home!"],
    ["С новой работой! Удачи на новом месте.", "Congratulations on the new job! Good luck."],
    ["Выздоравливай скорее, мы с тобой.", "Get well soon, we're with you."],
    ["С новосельем! Пусть в новом доме всегда будет светло.", "Happy house-warming! May your new home always be bright."],
    ["Счастливой дороги и ровного асфальта!", "Safe journey and smooth roads!"]];

  function songList() { return C.songs || []; }

  function mine() {
    var a = [];
    try { a = JSON.parse(localStorage.getItem(KEY) || "[]") || []; } catch (x) {}
    return a.filter(function (g) { return g && g.d >= TODAY; });
  }
  function save(a) { try { localStorage.setItem(KEY, JSON.stringify(a.slice(-20))); } catch (x) {} }

  function pickOf(a, R) { return a[Math.floor(R() * a.length)]; }
  function dayList(d) {
    var seed = +d.replace(/-/g, ""), R = rng(seed * 7 + 1045), list = [], sl = songList();
    var n = 9 + Math.floor(R() * 4), fu = {}, tu = {}, su = {};
    for (var i = 0; i < n; i++) {
      var f, t, k = 0;
      do { f = Math.floor(R() * FROM.length); } while (fu[f] && k++ < 20);
      k = 0; do { t = Math.floor(R() * TO.length); } while (tu[t] && k++ < 20);
      fu[f] = tu[t] = 1;
      var s = null, si;
      if (R() >= 0.15 && sl.length) { k = 0; do { si = Math.floor(R() * sl.length); } while (su[si] && k++ < 20); su[si] = 1; s = sl[si]; }
      list.push({ from: FROM[f][EN ? 1 : 0], to: TO[t][EN ? 1 : 0], text: TXT[pickOf(KIND[TO[t][2]], R)][EN ? 1 : 0], song: s });
    }
    var my = mine().filter(function (g) { return g.d === d; });
    my.forEach(function (g, j) { list.splice(Math.min(list.length, 2 + Math.floor(R() * 4) + j * 2), 0, { from: g.from, to: g.to, text: g.text, song: g.song, mine: true }); });
    // times from 19:32 to about 20:57, spread over the list
    var start = 19 * 60 + 32, span = 85, step = span / list.length;
    list.forEach(function (g, i) { var m = Math.round(start + i * step + R() * Math.min(3, step / 3)); g.m = m; g.tm = pad(Math.floor(m / 60)) + ":" + pad(m % 60); });
    return list;
  }

  function render(box) {
    var which = box.getAttribute("data-show") || "today", d = which === "tomorrow" ? TOMORROW : TODAY, list = dayList(d);
    var nm = now.getHours() * 60 + now.getMinutes(), h = '<table class="sched">';
    list.forEach(function (g, i) {
      var nx = list[i + 1] ? list[i + 1].m : 21 * 60, on = d === TODAY && nm >= g.m && nm < nx;
      h += "<tr" + (on ? ' class="now"' : "") + '><td class="tm">' + g.tm + "</td><td><b>" + T("От кого: ", "From: ") + esc(g.from) + ". " + T("Кому: ", "To: ") + esc(g.to) + "</b>" +
        (g.mine ? '<span class="hn">' + T("Ваш привет", "Your greeting") + "</span>" : "") +
        "<em>" + esc(g.text) + "</em><span class=\"hn\">♪ " + (g.song ? esc(g.song) : T("песня на выбор ведущей", "song chosen by the host")) + "</span></td></tr>";
    });
    h += "</table>";
    if (d === TODAY && nm >= 21 * 60) h += '<p class="small">' + T("Эфир «Стола заказов» на сегодня завершён. До завтра, в 19:30!", "Today's Request Desk is over. Until tomorrow at 19:30!") + "</p>";
    if (d === TODAY && nm < 19 * 60 + 30) h += '<p class="small">' + T("Начало в 19:30.", "Starts at 19:30.") + "</p>";
    box.innerHTML = h;
  }
  function renderAll() { Array.prototype.forEach.call(document.querySelectorAll("#chu-zakaz"), render); }

  // tabs on the schedule page
  var tabs = document.getElementById("zk-tabs");
  if (tabs) tabs.addEventListener("click", function (e) {
    var k = e.target.getAttribute("data-zk"); if (!k) return;
    Array.prototype.forEach.call(tabs.querySelectorAll("button"), function (b) { b.className = b === e.target ? "on" : ""; });
    var box = document.getElementById("chu-zakaz"); box.setAttribute("data-show", k); render(box);
  });

  // the greetings form
  var f = document.getElementById("chu-greet");
  if (f) {
    var sel = f.querySelector("select[name=song]"), other = f.querySelector("label.other"), nolib = f.querySelector(".nolib"), ok = f.querySelector(".ok");
    var re = C.nolib ? new RegExp(C.nolib, "i") : null;
    sel.addEventListener("change", function () { other.hidden = sel.value !== "*"; if (other.hidden) nolib.hidden = true; });
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      var song = sel.value === "*" ? f.other.value.trim() : sel.value;
      if (sel.value === "*" && re && re.test(song)) { nolib.hidden = false; ok.hidden = true; return; }
      nolib.hidden = true;
      var b = f.querySelector("button"); b.disabled = true; b.textContent = T("Отправка…", "Sending…");
      var g = { d: TOMORROW, from: f.from.value.trim().slice(0, 60), to: f.to.value.trim().slice(0, 80), text: f.text.value.trim().slice(0, 300), song: song || null };
      setTimeout(function () {
        var a = mine(); a.push(g); save(a);
        ok.hidden = false; b.disabled = false; b.textContent = T("Отправить привет", "Send greeting");
        f.reset(); other.hidden = true;
        renderAll();
      }, 1400);
    });
  }
  renderAll();
})();
