const form = document.querySelector("#promoForm");
const productNameInput = document.querySelector("#productName");
const formError = document.querySelector("#formError");
const loadingText = document.querySelector("#loadingText");
const resultShell = document.querySelector("#resultShell");
const quickGrid = document.querySelector("#quickGrid");
const tabPanel = document.querySelector("#tabPanel");
const copyTabBtn = document.querySelector("#copyTabBtn");
const copyQuickBtn = document.querySelector("#copyQuickBtn");
const regenBtn = document.querySelector("#regenBtn");
const shortBtn = document.querySelector("#shortBtn");
const stickyCopyBtn = document.querySelector("#stickyCopyBtn");
const stickyRegenBtn = document.querySelector("#stickyRegenBtn");
const stickyShortBtn = document.querySelector("#stickyShortBtn");
const mobileActionBar = document.querySelector("#mobileActionBar");
const historyToggle = document.querySelector("#historyToggle");
const historyPanel = document.querySelector("#historyPanel");
const historyList = document.querySelector("#historyList");
const clearHistoryBtn = document.querySelector("#clearHistoryBtn");
const resetBtn = document.querySelector("#resetBtn");
const toast = document.querySelector("#toast");

const HISTORY_KEY = "esenefPromoHistoryV2";
let currentResult = null;
let activeTab = "strategy";
let variantIndex = 0;

const categoryData = {
  "Produk Digital": {
    targets: ["pemula jualan online", "affiliate", "reseller digital", "kreator konten", "ibu rumah tangga", "pelajar"],
    pains: ["bingung mulai jualan", "belum punya produk", "takut bikin produk dari nol", "bingung promosi", "modal terbatas", "cuma punya HP"],
    angles: ["mulai dari HP", "produk siap jual", "hemat waktu", "cocok pemula", "tinggal promosi"],
    context: "pemula yang pengen mulai jualan dari HP tanpa bikin bahan dari nol"
  },
  "Skincare": {
    targets: ["remaja", "mahasiswa", "pekerja", "orang yang punya masalah kulit"],
    pains: ["kulit kusam", "berminyak", "jerawat", "takut salah produk", "budget terbatas"],
    angles: ["review jujur", "pemakaian harian", "before-after ringan", "harga worth it", "solusi simpel"],
    context: "orang yang pengen rawat kulit dengan cara simpel dan masuk budget"
  },
  "Fashion": {
    targets: ["mahasiswa", "pekerja muda", "hijabers", "orang yang pengen tampil rapi"],
    pains: ["bingung outfit", "pengen rapi tapi simpel", "budget terbatas", "takut salah mix and match"],
    angles: ["outfit harian", "murah tapi keliatan bagus", "mix and match", "banyak acara", "rapi tanpa ribet"],
    context: "orang yang pengen tampil rapi tanpa mikir outfit terlalu lama"
  },
  "Alat Rumah": {
    targets: ["ibu rumah tangga", "anak kos", "pekerja rantau", "keluarga muda"],
    pains: ["kerjaan rumah ribet", "pengen hemat waktu", "ruang kecil", "butuh alat praktis"],
    angles: ["hemat tenaga", "cocok rumah kecil", "aktivitas lebih gampang", "praktis harian", "anti ribet"],
    context: "orang yang pengen urusan rumah lebih praktis dan hemat tenaga"
  },
  "Makanan": {
    targets: ["anak kos", "pelajar", "pekerja", "keluarga"],
    pains: ["lapar tapi mager", "pengen praktis", "cari camilan", "pengen hemat"],
    angles: ["stok harian", "solusi cepat", "teman aktivitas", "enak tanpa ribet", "hemat"],
    context: "orang yang butuh makanan atau camilan praktis buat aktivitas harian"
  },
  "Affiliate Shopee": {
    targets: ["affiliate pemula", "pemburu barang worth it", "kreator review", "orang yang sering belanja online"],
    pains: ["bingung pilih barang review", "takut hard selling", "konten review sepi", "ga tahu cara arahkan ke keranjang"],
    angles: ["review singkat", "problem solving", "barang worth it", "keranjang kuning", "demo cepat"],
    context: "orang yang butuh alasan jelas sebelum klik produk di keranjang kuning"
  },
  "TikTok Shop": {
    targets: ["penonton TikTok", "pembeli yang butuh alasan", "kreator pemula", "orang yang cari barang praktis"],
    pains: ["belum yakin beli", "butuh bukti pemakaian", "takut barang ga sesuai", "butuh review cepat"],
    angles: ["konten review", "problem solving", "hook 3 detik", "keranjang kuning", "demo singkat"],
    context: "orang yang butuh lihat manfaat produk dalam video pendek sebelum beli"
  },
  "Lainnya": {
    targets: ["pemula yang butuh solusi praktis", "pembeli yang masih ragu", "audiens yang suka rekomendasi jujur"],
    pains: ["bingung pilih produk", "takut salah beli", "butuh solusi simpel", "pengen yang praktis"],
    angles: ["problem solving", "review jujur", "hemat waktu", "manfaat harian", "soft selling"],
    context: "orang yang butuh produk praktis dengan alasan beli yang jelas"
  }
};

const stylePresets = {
  default: { lead: "jujur", tone: "natural", cta: "cek detailnya dulu aja" },
  santai: { lead: "ngomong santai aja", tone: "santai", cta: "pelan-pelan aja, cek dulu kalau butuh" },
  soft: { lead: "ga perlu maksa", tone: "soft selling", cta: "kalau cocok, baru lanjut cek detailnya" },
  relate: { lead: "kayaknya banyak yang ngerasain ini", tone: "relate", cta: "simpan dulu kalau lagi di fase ini" },
  singkat: { lead: "singkatnya", tone: "ringkas", cta: "mulai dari yang paling gampang dulu" }
};

const tabNames = {
  strategy: "Strategi",
  content: "Konten",
  video: "Video",
  dmplan: "DM & Plan"
};

function getFormData() {
  return {
    product: productNameInput.value.trim(),
    type: document.querySelector("#productType").value,
    platform: document.querySelector("#platform").value,
    contentStyle: document.querySelector("#contentStyle").value
  };
}

function buildResult(input, styleKey = "default") {
  const data = categoryData[input.type] || categoryData.Lainnya;
  const style = stylePresets[styleKey] || stylePresets.default;
  const hooks = makeHooks(input.product, data, style);
  const ctas = makeCtas(input);
  const captions = makeCaptions(input.product, data, input, style);
  const scripts = makeScripts(input.product, data, input, style);
  const dmReplies = makeDmReplies(input.product);
  const plan = makePlan(input.product, input);
  const bestAngle = data.angles[variantIndex % data.angles.length];

  return {
    meta: { ...input, styleKey },
    quick: {
      target: data.targets[0],
      angle: bestAngle,
      hook: hooks[0],
      cta: ctas[0]
    },
    strategy: {
      analysis: [
        `Cocok dijual ke ${data.context}.`,
        `Pain utama: ${data.pains.slice(0, 3).join(", ")}.`,
        `Angle paling aman: ${bestAngle}, bukan janji instan.`,
        "Hindari klaim berlebihan. Tunjukin konteks pemakaian dan alasan produk ini relevan."
      ],
      targets: data.targets.slice(0, 3).map((target, index) => ({
        title: capitalize(target),
        pain: data.pains[index] || data.pains[0],
        talk: `Mulai dari keresahan mereka, lalu masukin produk sebagai opsi praktis.`
      })),
      angles: data.angles.slice(0, 5).map((angle, index) => ({
        title: capitalize(angle),
        why: `Nyambung ke kebutuhan nyata dan cocok untuk gaya ${style.tone}.`,
        opener: [
          "kadang yang bikin susah mulai itu bukan niat, tapi kebanyakan mikir duluan.",
          "promosi yang enak dibaca biasanya mulai dari masalah kecil yang relate.",
          "kalau kamu sering blank, jangan mulai dari fitur produk dulu.",
          "orang ga selalu butuh dibujuk, kadang cuma butuh paham konteksnya.",
          "sebelum bahas produk, bahas dulu momen kecil yang sering kejadian."
        ][index]
      }))
    },
    content: { hooks, captions, ctas },
    video: { scripts },
    dmplan: { dmReplies, plan }
  };
}

function makeHooks(product, data, style) {
  const pain = data.pains[0];
  return [
    `${style.lead}, banyak pemula bukan gagal karena malas. mereka cuma kebanyakan bingung duluan.`,
    "kadang yang bikin ga mulai itu bukan modal, tapi ga tahu langkah pertama harus apa.",
    "kalau tiap mau posting malah blank, bisa jadi masalahnya bukan di niat doang.",
    `produk kayak ${product} lebih enak dijual kalau ceritanya dimulai dari keresahan audiens.`,
    `kalau masalahnya ${pain}, jangan langsung jualan. ajak ngobrol dulu.`,
    "sebelum mikir konten viral, bikin orang ngerasa ‘ini gue banget’ dulu.",
    "jualan dari HP itu lebih ringan kalau angle-nya jelas dari awal.",
    "orang ga selalu butuh dibujuk. kadang mereka cuma butuh alasan yang masuk akal.",
    "konten jualan yang halus biasanya mulai dari cerita, bukan dari diskon.",
    `${style.cta}, tapi jangan mulai dari caption panjang. mulai dari satu hook yang kuat.`
  ];
}

function makeCaptions(product, data, input, style) {
  const linkText = input.platform === "WhatsApp" ? "DM aku kalau mau lihat detailnya." : "Cek link/detail yang aku taruh kalau mau lihat isinya.";
  return [
    {
      title: "Soft",
      text: `${style.lead}, promosi ga harus teriak jualan. Kalau kamu lagi pengen mulai tapi masih bingung arahnya, ${product} bisa bantu jadi pegangan awal. Bukan janji instan, cuma bantu langkah pertama terasa lebih jelas. ${linkText}`
    },
    {
      title: "Relate",
      text: `Pernah niat posting, tapi ujungnya cuma mandangin draft kosong? Biasanya bukan malas, tapi belum punya angle yang kebayang. ${product} bisa bantu kamu punya bahan mulai, jadi ga harus nebak-nebak terus.`
    },
    {
      title: "Edukasi",
      text: `Kalau mau promosi ${product}, jangan mulai dari fitur dulu. Mulai dari masalah audiens: ${data.pains.slice(0, 2).join(" dan ")}. Setelah itu baru jelasin kenapa produk ini bisa bantu.`
    }
  ];
}

function makeCtas(input) {
  const cartCta = ["TikTok", "Shopee Video"].includes(input.platform) || ["Affiliate Shopee", "TikTok Shop"].includes(input.type)
    ? "cek keranjang kuning kalau mau lihat detail produknya"
    : "cek link di bio kalau mau lihat detailnya";
  return [
    "komen ‘MAU’ nanti aku spill detailnya",
    "DM aja kalau mau lihat isinya",
    cartCta,
    "simpan dulu, siapa tahu nanti kamu butuh",
    "ga harus beli sekarang, cek dulu biar kebayang",
    "mau aku kirimin contoh pemakaiannya? komen ‘CONTOH’ ya",
    "kalau lagi bingung mulai dari mana, boleh tanya dulu",
    "ambil kalau memang lagi butuh, skip dulu juga gapapa",
    "aku taruh detailnya biar kamu bisa nilai sendiri cocok atau engga",
    "kalau kamu tipe yang suka praktis, ini bisa kamu pertimbangin"
  ];
}

function makeScripts(product, data, input, style) {
  const platformLine = ["TikTok", "Shopee Video"].includes(input.platform)
    ? "Arahkan pelan ke keranjang kuning atau link produk."
    : `Cocok dibawa ke ${input.platform} dengan gaya ngobrol ringan.`;
  return [
    {
      title: "Script utama 20 detik",
      opening: `${style.lead}, yang bikin orang susah mulai biasanya bukan karena ga niat.`,
      body: `Mereka bingung produk ini buat siapa, angle-nya apa, dan harus ngomong apa. ${product} bisa jadi pegangan awal biar promosi lebih rapi.`,
      closing: `${platformLine}`,
      visual: "Tunjukkan layar catatan kosong → berubah jadi poin target, hook, dan CTA."
    },
    {
      title: "Script review singkat",
      opening: "Aku suka konsep ini karena simpel.",
      body: "Mulai dari masalah audiens, kasih konteks, baru arahkan ke produk tanpa maksa.",
      closing: "Cocok buat yang pengen mulai pelan-pelan tapi rapi.",
      visual: "Pegang HP, tunjukkan checklist benefit, close-up produk."
    },
    {
      title: "Script problem solving",
      opening: `Kalau masalahnya ${data.pains[0]}, jangan langsung bilang beli sekarang.`,
      body: `Tunjukin dulu situasinya, baru jelasin kenapa ${product} relevan.`,
      closing: "Akhiri dengan CTA halus.",
      visual: "Teks besar per scene, 2-3 detik tiap poin."
    }
  ];
}

function makeDmReplies(product) {
  return [
    { q: "ini isinya apa?", a: `Isinya aku jelasin singkat ya: ${product} dibuat biar kamu punya pegangan praktis, jadi ga perlu nebak-nebak dari nol.` },
    { q: "cocok buat pemula ga?", a: "Cocok, terutama kalau kamu masih suka bingung mulai dari mana. Bahasanya simpel dan bisa dipakai pelan-pelan." },
    { q: "cara pakainya gimana?", a: "Pakai dari bagian yang paling kamu butuh dulu. Lagi blank? Mulai dari hook/caption. Lagi bingung target? Baca bagian audiens dulu." },
    { q: "mahal", a: "Paham kok. Kalau dibanding cuma harga mungkin perlu dipikirin dulu, tapi kalau kamu butuh hemat waktu dan ga mulai dari nol terus, ini bisa bantu." },
    { q: "nanti dulu", a: "Aman, ga perlu buru-buru. Simpan dulu aja chat ini, nanti kalau udah siap atau lagi mentok tinggal kabarin aku ya." }
  ];
}

function makePlan(product, input) {
  return [
    { day: "Hari 1", theme: "Edukasi masalah", idea: "Bahas kenapa konten jualan sering mentok.", hook: "kalau tiap mau posting malah blank, coba cek 3 hal ini dulu.", cta: "simpan dulu biar ga lupa." },
    { day: "Hari 2", theme: "Konten relate", idea: "Cerita momen buka HP tapi ga tahu mau nulis apa.", hook: "pernah niat jualan, tapi ujungnya cuma mantengin draft kosong?", cta: "komen kalau pernah di fase ini." },
    { day: "Hari 3", theme: "Soft selling", idea: `Kenalkan ${product} sebagai pegangan praktis.`, hook: "promosi yang enak itu bikin orang paham, bukan merasa dikejar-kejar.", cta: input.platform === "WhatsApp" ? "DM kalau mau lihat detailnya." : "cek link/detail yang aku taruh." },
    { day: "Hari 4", theme: "Bukti/manfaat", idea: "Demo sebelum-sesudah dari blank jadi punya hook/caption/CTA.", hook: "bedanya punya bahan promosi itu kerasa pas lagi ga punya ide.", cta: "DM ‘CONTOH’ kalau mau gambaran isinya." },
    { day: "Hari 5", theme: "Closing/CTA", idea: "Rangkum masalah, manfaat, dan langkah kecil untuk mulai.", hook: "kalau nunggu sampai siap banget, biasanya malah makin lama mulai.", cta: "ambil kalau butuh, atau simpan dulu buat nanti." }
  ];
}

function renderResult(result) {
  currentResult = result;
  resultShell.classList.remove("hidden");
  mobileActionBar.classList.remove("hidden");
  renderQuick(result.quick);
  renderTab(activeTab);
}

function renderQuick(quick) {
  quickGrid.innerHTML = [
    ["Target utama", quick.target],
    ["Angle terbaik", quick.angle],
    ["Hook terbaik", quick.hook],
    ["CTA terbaik", quick.cta]
  ].map(([label, value]) => `
    <article class="quick-item">
      <span>${escapeHtml(label)}</span>
      <p>${escapeHtml(value)}</p>
    </article>
  `).join("");
}

function renderTab(tab) {
  if (!currentResult) return;
  activeTab = tab;
  document.querySelectorAll(".tab-btn").forEach(button => {
    const isActive = button.dataset.tab === tab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", String(isActive));
  });
  copyTabBtn.textContent = `Copy ${tabNames[tab]}`;
  tabPanel.innerHTML = getTabHtml(tab);
  bindInlineActions();
}

function getTabHtml(tab) {
  const result = currentResult;
  if (tab === "strategy") return strategyHtml(result.strategy);
  if (tab === "content") return contentHtml(result.content);
  if (tab === "video") return videoHtml(result.video);
  return dmPlanHtml(result.dmplan);
}

function strategyHtml(strategy) {
  return `
    <section class="output-block">
      <div class="item-head"><h3>Analisis ringkas</h3></div>
      <ul>${strategy.analysis.map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    </section>
    <details open>
      <summary>Target audiens</summary>
      <div class="details-body">
        <ul>${strategy.targets.map(item => `<li><strong>${escapeHtml(item.title)}</strong> — ${escapeHtml(item.pain)}. ${escapeHtml(item.talk)}</li>`).join("")}</ul>
      </div>
    </details>
    <details>
      <summary>Angle terbaik</summary>
      <div class="details-body">
        <ul>${strategy.angles.map(item => `<li><strong>${escapeHtml(item.title)}</strong><br>${escapeHtml(item.why)}<br>Hook: “${escapeHtml(item.opener)}”</li>`).join("")}</ul>
      </div>
    </details>`;
}

function contentHtml(content) {
  return `
    <section class="output-block">
      <div class="item-head">
        <h3>Hook siap pakai</h3>
        <div class="item-actions">
          <button class="mini-copy" type="button" data-copy-kind="hooks">Copy Hook</button>
          <button class="show-more-btn" type="button" data-more-target="hooks">Lihat 5 lagi</button>
        </div>
      </div>
      <ol id="hooksList">${content.hooks.slice(0, 5).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
    </section>
    <section class="output-block">
      <div class="item-head">
        <h3>Caption</h3>
        <button class="mini-copy" type="button" data-copy-kind="caption0">Copy Caption</button>
      </div>
      <p>${escapeHtml(content.captions[0].text)}</p>
    </section>
    ${content.captions.slice(1).map((caption, index) => `
      <details>
        <summary>Caption ${escapeHtml(caption.title)}</summary>
        <div class="details-body">
          <div class="item-head"><p>${escapeHtml(caption.text)}</p><button class="mini-copy" type="button" data-copy-kind="caption${index + 1}">Copy</button></div>
        </div>
      </details>`).join("")}
    <section class="output-block">
      <div class="item-head">
        <h3>CTA</h3>
        <div class="item-actions">
          <button class="mini-copy" type="button" data-copy-kind="ctas">Copy CTA</button>
          <button class="show-more-btn" type="button" data-more-target="ctas">Lihat 5 lagi</button>
        </div>
      </div>
      <ol id="ctasList">${content.ctas.slice(0, 5).map(item => `<li>${escapeHtml(item)}</li>`).join("")}</ol>
    </section>`;
}

function videoHtml(video) {
  const main = video.scripts[0];
  return `
    <section class="output-block">
      <div class="item-head"><h3>${escapeHtml(main.title)}</h3><button class="mini-copy" type="button" data-copy-kind="script0">Copy Script</button></div>
      ${scriptBody(main)}
    </section>
    ${video.scripts.slice(1).map((script, index) => `
      <details>
        <summary>${escapeHtml(script.title)}</summary>
        <div class="details-body">
          <div class="item-head"><span></span><button class="mini-copy" type="button" data-copy-kind="script${index + 1}">Copy</button></div>
          ${scriptBody(script)}
        </div>
      </details>`).join("")}`;
}

function scriptBody(script) {
  return `<ul>
    <li><strong>Opening:</strong> ${escapeHtml(script.opening)}</li>
    <li><strong>Isi:</strong> ${escapeHtml(script.body)}</li>
    <li><strong>Closing:</strong> ${escapeHtml(script.closing)}</li>
    <li><strong>Ide visual:</strong> ${escapeHtml(script.visual)}</li>
  </ul>`;
}

function dmPlanHtml(dmplan) {
  return `
    <details open>
      <summary>Balasan DM</summary>
      <div class="details-body">
        <ul>${dmplan.dmReplies.map(item => `<li><strong>${escapeHtml(item.q)}</strong><br>${escapeHtml(item.a)}</li>`).join("")}</ul>
      </div>
    </details>
    <details>
      <summary>Rencana posting 5 hari</summary>
      <div class="details-body">
        ${dmplan.plan.map(day => `
          <details>
            <summary>${escapeHtml(day.day)} — ${escapeHtml(day.theme)}</summary>
            <div class="details-body">
              <ul>
                <li><strong>Ide:</strong> ${escapeHtml(day.idea)}</li>
                <li><strong>Hook:</strong> ${escapeHtml(day.hook)}</li>
                <li><strong>CTA:</strong> ${escapeHtml(day.cta)}</li>
              </ul>
            </div>
          </details>`).join("")}
      </div>
    </details>`;
}

function bindInlineActions() {
  tabPanel.querySelectorAll("[data-copy-kind]").forEach(button => {
    button.addEventListener("click", () => copyText(getCopyByKind(button.dataset.copyKind)));
  });
  tabPanel.querySelectorAll("[data-more-target]").forEach(button => {
    button.addEventListener("click", () => showMore(button.dataset.moreTarget, button));
  });
}

function showMore(target, button) {
  const list = document.querySelector(target === "hooks" ? "#hooksList" : "#ctasList");
  const values = target === "hooks" ? currentResult.content.hooks : currentResult.content.ctas;
  list.innerHTML = values.map(item => `<li>${escapeHtml(item)}</li>`).join("");
  button.remove();
}

function getCopyByKind(kind) {
  if (kind === "hooks") return currentResult.content.hooks.join("\n");
  if (kind === "ctas") return currentResult.content.ctas.join("\n");
  if (kind.startsWith("caption")) return currentResult.content.captions[Number(kind.replace("caption", ""))].text;
  if (kind.startsWith("script")) return formatScript(currentResult.video.scripts[Number(kind.replace("script", ""))]);
  return "";
}

function formatScript(script) {
  return `${script.title}\nOpening: ${script.opening}\nIsi: ${script.body}\nClosing: ${script.closing}\nIde visual: ${script.visual}`;
}

function formatTab(tab) {
  const result = currentResult;
  if (!result) return "";
  if (tab === "strategy") {
    return [
      "Analisis", ...result.strategy.analysis,
      "\nTarget", ...result.strategy.targets.map(item => `${item.title}: ${item.pain}. ${item.talk}`),
      "\nAngle", ...result.strategy.angles.map(item => `${item.title}: ${item.why} Hook: ${item.opener}`)
    ].join("\n");
  }
  if (tab === "content") {
    return ["Hook", ...result.content.hooks, "\nCaption", ...result.content.captions.map(item => `${item.title}: ${item.text}`), "\nCTA", ...result.content.ctas].join("\n");
  }
  if (tab === "video") return result.video.scripts.map(formatScript).join("\n\n");
  return [
    "Balasan DM",
    ...result.dmplan.dmReplies.map(item => `${item.q}: ${item.a}`),
    "\nRencana Posting",
    ...result.dmplan.plan.map(item => `${item.day} - ${item.theme}: ${item.idea} | Hook: ${item.hook} | CTA: ${item.cta}`)
  ].join("\n");
}

function formatAll() {
  return ["Ringkasan", formatQuick(), "\n---\n", formatTab("strategy"), "\n---\n", formatTab("content"), "\n---\n", formatTab("video"), "\n---\n", formatTab("dmplan")].join("\n");
}

function formatQuick() {
  const q = currentResult.quick;
  return `Target utama: ${q.target}\nAngle terbaik: ${q.angle}\nHook terbaik: ${q.hook}\nCTA terbaik: ${q.cta}`;
}

function saveHistory(result) {
  const history = getHistory().filter(item => item.meta.product.toLowerCase() !== result.meta.product.toLowerCase());
  history.unshift({ ...result, savedAt: new Date().toISOString() });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 5)));
  renderHistory();
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];
  } catch (error) {
    return [];
  }
}

function renderHistory() {
  const history = getHistory();
  if (!history.length) {
    historyList.innerHTML = `<p class="empty-history">Belum ada riwayat.</p>`;
    return;
  }
  historyList.innerHTML = history.map((item, index) => `
    <button class="history-item" type="button" data-index="${index}">
      ${escapeHtml(item.meta.product)}
      <span>${escapeHtml(item.meta.type)} • ${escapeHtml(item.meta.platform)}</span>
    </button>
  `).join("");
  historyList.querySelectorAll(".history-item").forEach(button => {
    button.addEventListener("click", () => {
      const item = getHistory()[Number(button.dataset.index)];
      if (!item) return;
      productNameInput.value = item.meta.product;
      document.querySelector("#productType").value = item.meta.type;
      document.querySelector("#platform").value = item.meta.platform;
      document.querySelector("#contentStyle").value = item.meta.contentStyle;
      renderResult(item);
      resultShell.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
}

function regenerate(styleKey) {
  if (!currentResult) return;
  variantIndex += 1;
  const result = buildResult(currentResult.meta, styleKey || currentResult.meta.styleKey || "default");
  renderResult(result);
  saveHistory(result);
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(showToast).catch(() => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
    showToast();
  });
}

function showToast() {
  toast.classList.add("show");
  window.setTimeout(() => toast.classList.remove("show"), 1500);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

form.addEventListener("submit", event => {
  event.preventDefault();
  const input = getFormData();
  if (!input.product) {
    formError.textContent = "Isi nama produk dulu biar tools bisa bantu mikirin paket promosinya.";
    productNameInput.focus();
    return;
  }
  formError.textContent = "";
  loadingText.classList.add("show");

  window.setTimeout(() => {
    variantIndex += 1;
    const result = buildResult(input, "default");
    loadingText.classList.remove("show");
    renderResult(result);
    saveHistory(result);
    resultShell.scrollIntoView({ behavior: "smooth", block: "start" });
  }, 420);
});

document.querySelectorAll(".tab-btn").forEach(button => {
  button.addEventListener("click", () => renderTab(button.dataset.tab));
});

copyTabBtn.addEventListener("click", () => copyText(formatTab(activeTab)));
copyQuickBtn.addEventListener("click", () => copyText(formatQuick()));
regenBtn.addEventListener("click", () => regenerate());
shortBtn.addEventListener("click", () => regenerate("singkat"));
stickyCopyBtn.addEventListener("click", () => copyText(formatAll()));
stickyRegenBtn.addEventListener("click", () => regenerate());
stickyShortBtn.addEventListener("click", () => regenerate("singkat"));

historyToggle.addEventListener("click", () => {
  historyPanel.hidden = !historyPanel.hidden;
  if (!historyPanel.hidden) renderHistory();
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

resetBtn.addEventListener("click", () => {
  form.reset();
  formError.textContent = "";
  loadingText.classList.remove("show");
  resultShell.classList.add("hidden");
  mobileActionBar.classList.add("hidden");
  currentResult = null;
  activeTab = "strategy";
  renderTab(activeTab);
  productNameInput.focus();
});

renderHistory();
