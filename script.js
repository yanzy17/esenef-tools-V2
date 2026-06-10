const form = document.querySelector("#promoForm");
const productNameInput = document.querySelector("#productName");
const formError = document.querySelector("#formError");
const loadingText = document.querySelector("#loadingText");
const emptyState = document.querySelector("#emptyState");
const outputGrid = document.querySelector("#outputGrid");
const copyAllBtn = document.querySelector("#copyAllBtn");
const styleActions = document.querySelector("#styleActions");
const toast = document.querySelector("#toast");
const historyList = document.querySelector("#historyList");
const clearHistoryBtn = document.querySelector("#clearHistoryBtn");
const showExampleBtn = document.querySelector("#showExampleBtn");

const HISTORY_KEY = "esenefPromoHistory";
let currentResult = null;
let currentVariant = 0;

const categoryData = {
  "Produk Digital": {
    targets: ["pemula jualan online", "affiliate", "reseller digital", "kreator konten", "ibu rumah tangga", "pelajar"],
    pains: ["bingung mulai jualan", "belum punya produk", "takut bikin produk dari nol", "bingung promosi", "modal terbatas", "cuma punya HP"],
    angles: ["mulai dari HP", "produk siap jual", "hemat waktu", "cocok pemula", "tinggal promosi", "bukan cepat kaya, tapi langkah awal"],
    context: "orang yang pengen mulai jualan digital tanpa ribet bikin bahan dari nol"
  },
  "Skincare": {
    targets: ["remaja", "mahasiswa", "pekerja", "orang yang punya masalah kulit"],
    pains: ["kulit kusam", "berminyak", "jerawat", "takut salah produk", "pengen hasil tapi budget terbatas"],
    angles: ["review jujur", "pemakaian harian", "before-after ringan", "harga worth it", "solusi simpel"],
    context: "orang yang pengen ngerawat kulit dengan cara yang simpel dan masuk budget"
  },
  "Fashion": {
    targets: ["mahasiswa", "pekerja muda", "hijabers", "orang yang pengen tampil rapi"],
    pains: ["bingung outfit", "pengen rapi tapi simpel", "budget terbatas", "takut salah mix and match"],
    angles: ["outfit harian", "murah tapi keliatan bagus", "mix and match", "cocok buat banyak acara"],
    context: "orang yang pengen tampil lebih rapi tanpa mikir outfit terlalu lama"
  },
  "Alat Rumah": {
    targets: ["ibu rumah tangga", "anak kos", "pekerja rantau", "keluarga muda"],
    pains: ["kerjaan rumah ribet", "pengen hemat waktu", "ruang kecil", "butuh alat praktis"],
    angles: ["hemat tenaga", "cocok rumah kecil", "bikin aktivitas lebih gampang", "praktis dipakai harian"],
    context: "orang yang pengen urusan rumah lebih praktis dan ga makan banyak tenaga"
  },
  "Makanan": {
    targets: ["anak kos", "pelajar", "pekerja", "keluarga"],
    pains: ["lapar tapi mager", "pengen praktis", "cari camilan", "pengen hemat"],
    angles: ["stok harian", "solusi cepat", "cocok buat aktivitas", "enak tanpa ribet"],
    context: "orang yang butuh makanan atau camilan praktis buat nemenin aktivitas"
  },
  "Affiliate Shopee": {
    targets: ["affiliate pemula", "pemburu barang worth it", "kreator review", "orang yang sering belanja online"],
    pains: ["bingung pilih barang yang enak direview", "takut keliatan hard selling", "konten review sepi", "ga tahu cara arahkan ke keranjang"],
    angles: ["review singkat", "problem solving", "barang worth it", "keranjang kuning", "video pendek yang jelas"],
    context: "orang yang butuh alasan jelas sebelum klik produk di keranjang kuning"
  },
  "TikTok Shop": {
    targets: ["penonton TikTok", "pembeli impulsif yang tetap butuh alasan", "kreator pemula", "orang yang cari barang praktis"],
    pains: ["scroll terus tapi belum yakin beli", "butuh bukti pemakaian", "takut barang ga sesuai", "butuh review cepat"],
    angles: ["konten review", "problem solving", "hook 3 detik", "keranjang kuning", "demo singkat"],
    context: "orang yang butuh lihat manfaat produk dalam video pendek sebelum beli"
  },
  "Lainnya": {
    targets: ["pemula yang butuh solusi praktis", "orang yang punya masalah spesifik", "pembeli yang masih ragu", "audiens yang suka rekomendasi jujur"],
    pains: ["bingung pilih produk", "takut salah beli", "butuh solusi yang gampang dipahami", "pengen yang praktis"],
    angles: ["problem solving", "review jujur", "hemat waktu", "manfaat harian", "soft selling"],
    context: "orang yang butuh produk praktis dengan alasan beli yang jelas"
  }
};

const stylePresets = {
  default: { intro: "jujur", close: "kalau kamu lagi di fase itu", tone: "natural" },
  santai: { intro: "ngomong santai aja", close: "pelan-pelan aja, yang penting mulai", tone: "santai" },
  soft: { intro: "ga perlu maksa jualan", close: "kalau cocok, baru lanjut cek detailnya", tone: "soft selling" },
  relate: { intro: "kayaknya banyak yang ngerasain ini", close: "kamu ga sendirian kok", tone: "relate" },
  singkat: { intro: "singkatnya", close: "mulai dari yang paling gampang dulu", tone: "ringkas" }
};

function getFormData() {
  return {
    product: productNameInput.value.trim(),
    type: document.querySelector("#productType").value,
    platform: document.querySelector("#platform").value,
    contentStyle: document.querySelector("#contentStyle").value,
    userLevel: document.querySelector("#userLevel").value
  };
}

function pickData(type) {
  return categoryData[type] || categoryData.Lainnya;
}

function buildResult(input, styleKey = "default") {
  const data = pickData(input.type);
  const style = stylePresets[styleKey] || stylePresets.default;
  currentVariant += 1;
  const variantLine = currentVariant % 2 === 0
    ? "Fokusnya bikin orang merasa, 'oh ini bisa aku coba', bukan merasa sedang dipaksa beli."
    : "Fokusnya bukan janji muluk, tapi bantu audiens lihat langkah kecil yang masuk akal.";
  const product = input.product;
  const platformHint = ["TikTok", "Shopee Video"].includes(input.platform)
    ? "Pakai pembuka cepat, visual jelas, dan arahkan pelan ke keranjang kuning atau link produk."
    : `Cocok dibawa ke ${input.platform} dengan gaya ngobrol yang ringan dan ga terlalu jualan.`;

  return {
    meta: input,
    styleKey,
    sections: [
      {
        key: "analysis",
        title: "Analisis Produk",
        copyLabel: "Copy Analisis",
        wide: true,
        content: `Produk ${product} paling cocok dijual ke ${data.context}. Masalah utama mereka biasanya ${data.pains.slice(0, 3).join(", ")}.\n\nAlasan orang tertarik beli: produk ini bisa terasa sebagai jalan awal yang lebih gampang, lebih hemat waktu, dan lebih jelas dibanding mikir sendiri dari nol. Angle promosi terbaiknya adalah ${data.angles.slice(0, 2).join(" + ")}.\n\n${variantLine}\n\nYang perlu dihindari: jangan pakai klaim berlebihan, jangan bikin audiens merasa telat mulai, dan jangan terlalu sering bilang produk ini “paling bagus”. Tunjukin konteks pemakaian, masalah yang dibantu, dan alasan kenapa produk ini relevan buat hari mereka.`
      },
      {
        key: "targets",
        title: "Target Audiens",
        copyLabel: "Copy Target",
        content: makeTargets(data, product)
      },
      {
        key: "angles",
        title: "Angle Konten",
        copyLabel: "Copy Angle",
        content: makeAngles(data, product, style)
      },
      {
        key: "hooks",
        title: "Hook Siap Pakai",
        copyLabel: "Copy Hook",
        wide: true,
        content: makeHooks(product, data, style)
      },
      {
        key: "captions",
        title: "Caption Siap Posting",
        copyLabel: "Copy Caption",
        wide: true,
        content: makeCaptions(product, data, input, style)
      },
      {
        key: "cta",
        title: "CTA Siap Pakai",
        copyLabel: "Copy CTA",
        content: makeCtas(input)
      },
      {
        key: "scripts",
        title: "Script Video Pendek",
        copyLabel: "Copy Script",
        wide: true,
        content: makeScripts(product, data, input, style, platformHint)
      },
      {
        key: "dm",
        title: "Balasan DM",
        copyLabel: "Copy DM",
        content: makeDmReplies(product)
      },
      {
        key: "plan",
        title: "Rencana Posting 5 Hari",
        copyLabel: "Copy Plan",
        wide: true,
        content: makePlan(product, data, input)
      }
    ]
  };
}

function makeTargets(data, product) {
  const targets = data.targets.slice(0, 3);
  return targets.map((target, index) => {
    const pain = data.pains[index] || data.pains[0];
    return `${index + 1}. ${capitalize(target)}\n- Masalah: ${pain}, tapi belum nemu cara yang simpel.\n- Cara ngomong: pakai bahasa sehari-hari, mulai dari keresahan mereka, lalu masukin ${product} sebagai opsi yang bisa dicoba tanpa drama.`;
  }).join("\n\n");
}

function makeAngles(data, product, style) {
  return data.angles.slice(0, 5).map((angle, index) => {
    const openings = [
      `kadang yang bikin susah mulai itu bukan niat, tapi kebanyakan mikir duluan.`,
      `aku suka angle ini karena orang langsung ngerti masalahnya tanpa merasa dijualin.`,
      `kalau kamu pernah bingung mulai dari mana, bagian ini bakal relate.`,
      `ini bukan soal ikut tren doang, tapi soal bikin hidup sedikit lebih gampang.`,
      `sebelum bahas produk, bahas dulu momen kecil yang sering kejadian.`
    ];
    return `${index + 1}. ${capitalize(angle)}\n- Kenapa kuat: angle ini nyambung ke kebutuhan nyata audiens dan cocok untuk gaya ${style.tone}.\n- Contoh pembuka: “${openings[index]}”\n- Arahkan ke: ${product} sebagai bantuan praktis, bukan janji instan.`;
  }).join("\n\n");
}

function makeHooks(product, data, style) {
  const pain = data.pains[0];
  const hooks = [
    `${style.intro}, banyak pemula bukan gagal karena malas. mereka cuma kebanyakan bingung duluan.`,
    `kadang yang bikin ga mulai itu bukan modal, tapi ga tahu langkah pertama harus apa.`,
    `kalau tiap mau posting malah blank, bisa jadi masalahnya bukan di niat doang.`,
    `aku baru sadar, promosi yang enak dibaca itu biasanya mulai dari masalah kecil yang relate.`,
    `sebelum mikir konten viral, coba bikin orang ngerasa “ini gue banget” dulu.`,
    `produk kayak ${product} lebih enak dijual kalau ceritanya dimulai dari keresahan audiens.`,
    `orang ga selalu butuh dibujuk. kadang mereka cuma butuh paham kenapa ini relevan buat mereka.`,
    `kalau masalahnya ${pain}, jangan langsung jualan. ajak ngobrol dulu.`,
    `jualan dari HP itu bisa lebih rapi kalau kamu punya angle yang jelas dari awal.`,
    `${style.close}, jangan mulai dari caption panjang. mulai dari satu hook yang bikin orang berhenti scroll.`
  ];
  return hooks.map((hook, index) => `${index + 1}. ${hook}`).join("\n");
}

function makeCaptions(product, data, input, style) {
  const platformNote = input.platform === "WhatsApp" ? "Bisa aku kirim detailnya lewat chat." : "Detailnya bisa kamu cek dari link yang aku taruh.";
  return `1. Versi soft selling\n${style.intro}, promosi ga harus selalu teriak jualan. Kalau kamu lagi pengen mulai tapi masih bingung arahnya, ${product} bisa bantu bikin langkah awal lebih jelas. Bukan buat janji hasil instan, tapi buat bantu kamu ga mulai dari nol terus. ${platformNote}\n\n2. Versi storytelling/relate\nPernah ga, udah niat mau posting tapi ujungnya cuma scroll-scroll doang? Biasanya bukan karena malas, tapi karena belum punya bahan dan angle yang kebayang. Makanya ${product} bisa jadi pegangan kecil biar kamu punya sesuatu yang bisa langsung dicoba. Kalau mau lihat isinya, boleh DM aku ya.\n\n3. Versi edukasi singkat\nKalau mau promosi ${product}, jangan mulai dari fitur dulu. Mulai dari masalah audiens: ${data.pains.slice(0, 2).join(" dan ")}. Setelah itu baru jelasin gimana produk ini bantu mereka lebih gampang mulai. Simpan dulu kalau kamu sering blank pas bikin konten.`;
}

function makeCtas(input) {
  const cartCta = ["TikTok", "Shopee Video"].includes(input.platform) || ["Affiliate Shopee", "TikTok Shop"].includes(input.type)
    ? "cek keranjang kuning kalau mau lihat detail produknya"
    : "cek link di bio kalau mau lihat detailnya";
  return [
    "komen ‘MAU’ nanti aku spill detailnya",
    "DM aja kalau mau lihat isi paketnya",
    cartCta,
    "simpan dulu, siapa tahu nanti kamu butuh pas mulai jualan",
    "kalau lagi bingung mulai dari mana, boleh tanya dulu di DM",
    "ga harus beli sekarang, tapi boleh cek dulu biar kebayang",
    "aku taruh detailnya biar kamu bisa nilai sendiri cocok atau engga",
    "kalau kamu tipe yang suka praktis, ini bisa kamu pertimbangin",
    "mau aku kirimin contoh pemakaiannya? komen ‘CONTOH’ ya",
    "ambil kalau memang lagi butuh, skip dulu juga gapapa"
  ].map((cta, index) => `${index + 1}. ${cta}`).join("\n");
}

function makeScripts(product, data, input, style, platformHint) {
  return `1. Script problem-aware\nOpening: “${style.intro}, yang bikin orang susah mulai biasanya bukan karena ga niat.”\nIsi: “Mereka bingung produknya buat siapa, angle-nya apa, dan harus ngomong apa. ${product} bisa bantu jadi pegangan awal biar promosi lebih rapi.”\nClosing: “Kalau kamu lagi di fase blank, cek detailnya dulu.”\nTeks layar: “Biar promosi ga mulai dari nol terus”\nIde visual: rekam layar catatan kosong berubah jadi poin target, hook, dan caption.\n\n2. Script review singkat\nOpening: “Aku suka konsep ini karena simpel.”\nIsi: “Bukan yang janji muluk, tapi bantu kamu ngerti cara ngomongin produk dengan lebih enak. Mulai dari masalah audiens, hook, sampai CTA.”\nClosing: “Cocok buat yang pengen mulai pelan-pelan tapi rapi.”\nTeks layar: “buat pemula yang sering blank konten”\nIde visual: pegang HP, tunjukkan checklist benefit, lalu close-up bagian produk.\n\n3. Script konten cepat\nOpening: “Kalau kamu jualan ${product}, jangan langsung bilang beli sekarang.”\nIsi: “Mulai dari masalah: ${data.pains.slice(0, 2).join(", ")}. Baru masukin kenapa produk ini membantu.”\nClosing: “${platformHint}”\nTeks layar: “rumus: masalah → alasan → CTA halus”\nIde visual: teks besar per scene, 2-3 detik tiap poin, ending arah ke link atau keranjang.`;
}

function makeDmReplies(product) {
  return `1. Kalau tanya “ini isinya apa?”\nIsinya aku jelasin singkat ya: ${product} dibuat biar kamu punya pegangan yang lebih praktis. Jadi kamu ga perlu nebak-nebak dari nol. Kalau mau, aku bisa kirim detail bagian-bagiannya.\n\n2. Kalau tanya “cocok buat pemula ga?”\nCocok, terutama kalau kamu masih suka bingung mulai dari mana. Bahasanya juga dibuat simpel, jadi ga harus punya pengalaman dulu buat ngerti alurnya.\n\n3. Kalau tanya “cara pakainya gimana?”\nPakai dari bagian yang paling kamu butuh dulu. Misalnya lagi blank konten, mulai dari hook/caption. Kalau lagi bingung target, baca bagian audiens dulu. Ga harus dipakai semua sekaligus.\n\n4. Kalau bilang “mahal”\nPaham kok. Kalau dibanding cuma harga, mungkin kerasa perlu dipikirin dulu. Tapi kalau kamu lagi butuh hemat waktu dan ga mau mulai dari nol terus, ini bisa bantu banget. Cek detailnya dulu aja biar kamu bisa nilai cocok atau engga.\n\n5. Kalau bilang “nanti dulu”\nAman, ga perlu buru-buru. Simpan dulu aja chat ini. Nanti kalau kamu udah siap mulai atau lagi mentok bikin konten, tinggal kabarin aku ya.`;
}

function makePlan(product, data, input) {
  return `Hari 1 — Edukasi masalah\nTema: kenapa orang sering bingung mulai promosi.\nIde posting: bahas 3 penyebab konten jualan terasa mentok.\nHook: “kalau tiap mau posting malah blank, coba cek 3 hal ini dulu.”\nCTA: “simpan dulu biar ga lupa pas bikin konten.”\n\nHari 2 — Konten relate\nTema: pengalaman blank atau takut promosi maksa.\nIde posting: cerita singkat momen buka HP tapi ga tahu mau nulis apa.\nHook: “pernah niat jualan, tapi ujungnya cuma mantengin draft kosong?”\nCTA: “komen kalau kamu pernah di fase ini.”\n\nHari 3 — Soft selling\nTema: kenalkan ${product} sebagai pegangan praktis.\nIde posting: jelasin manfaat tanpa klaim berlebihan.\nHook: “aku lebih suka promosi yang bikin orang paham, bukan merasa dikejar-kejar.”\nCTA: “kalau mau lihat detailnya, cek ${input.platform === "WhatsApp" ? "chat aku" : "link yang aku taruh"}.”\n\nHari 4 — Bukti/manfaat\nTema: tunjukkan cara pakai atau bagian paling berguna.\nIde posting: demo singkat sebelum-sesudah: dari blank jadi punya hook/caption/CTA.\nHook: “bedanya punya bahan promosi itu kerasa pas kamu lagi ga punya ide.”\nCTA: “DM ‘CONTOH’ kalau mau aku kirimin gambaran isinya.”\n\nHari 5 — Closing/CTA\nTema: ajakan halus buat yang sudah merasa butuh.\nIde posting: rangkum masalah, manfaat, dan alasan kenapa bisa mulai dari langkah kecil.\nHook: “kalau kamu nunggu sampai siap banget, biasanya malah makin lama mulai.”\nCTA: “ambil kalau lagi butuh, atau simpan dulu buat nanti.”`;
}

function renderResult(result) {
  currentResult = result;
  emptyState.classList.add("hidden");
  copyAllBtn.classList.remove("hidden");
  styleActions.classList.remove("hidden");
  outputGrid.innerHTML = result.sections.map(section => `
    <article class="output-card ${section.wide ? "wide" : ""}">
      <div class="card-head">
        <h3>${section.title}</h3>
        <button class="copy-btn" type="button" data-copy="${section.key}">${section.copyLabel}</button>
      </div>
      <div class="output-content">${escapeHtml(section.content)}</div>
    </article>
  `).join("");
  outputGrid.querySelectorAll("[data-copy]").forEach(button => {
    button.addEventListener("click", () => {
      const section = currentResult.sections.find(item => item.key === button.dataset.copy);
      copyText(`${section.title}\n\n${section.content}`);
    });
  });
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
    historyList.innerHTML = `<p class="muted">Belum ada riwayat. Generate satu paket dulu ya.</p>`;
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
      const selected = getHistory()[Number(button.dataset.index)];
      if (!selected) return;
      productNameInput.value = selected.meta.product;
      document.querySelector("#productType").value = selected.meta.type;
      document.querySelector("#platform").value = selected.meta.platform;
      document.querySelector("#contentStyle").value = selected.meta.contentStyle;
      document.querySelector("#userLevel").value = selected.meta.userLevel;
      renderResult(selected);
      document.querySelector("#output-title").scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });
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
  window.setTimeout(() => toast.classList.remove("show"), 1800);
}

function escapeHtml(value) {
  return value.replace(/[&<>"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char]));
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
  outputGrid.innerHTML = "";

  window.setTimeout(() => {
    const result = buildResult(input, "default");
    loadingText.classList.remove("show");
    renderResult(result);
    saveHistory(result);
    document.querySelector("#output-title").scrollIntoView({ behavior: "smooth", block: "start" });
  }, 650);
});

styleActions.addEventListener("click", event => {
  const button = event.target.closest("button[data-style]");
  if (!button || !currentResult) return;
  const result = buildResult(currentResult.meta, button.dataset.style);
  renderResult(result);
  saveHistory(result);
});

copyAllBtn.addEventListener("click", () => {
  if (!currentResult) return;
  const allText = currentResult.sections.map(section => `${section.title}\n\n${section.content}`).join("\n\n---\n\n");
  copyText(allText);
});

clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(HISTORY_KEY);
  renderHistory();
});

showExampleBtn.addEventListener("click", () => {
  productNameInput.value = "Paket Produk Digital Siap Jual";
  document.querySelector("#productType").value = "Produk Digital";
  document.querySelector("#platform").value = "Threads";
  form.requestSubmit();
});

renderHistory();
