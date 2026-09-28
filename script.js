/* ===========================================================
   LANE — vanilla HTML/JS build, prices in INR (₹)
   Storage: window.storage, shared=true (demo — no real auth)
     key "fleet"    -> array of car objects
     key "bookings" -> array of booking objects
=========================================================== */

var INDIA_CITIES = [
  "Mumbai, Maharashtra", "Pune, Maharashtra", "Nagpur, Maharashtra", "Nashik, Maharashtra", "Aurangabad, Maharashtra",
  "New Delhi, Delhi", "Delhi, Delhi",
  "Bengaluru, Karnataka", "Mysuru, Karnataka", "Mangaluru, Karnataka", "Hubballi, Karnataka",
  "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu", "Tiruchirappalli, Tamil Nadu",
  "Hyderabad, Telangana", "Warangal, Telangana",
  "Kolkata, West Bengal", "Howrah, West Bengal", "Siliguri, West Bengal", "Durgapur, West Bengal",
  "Ahmedabad, Gujarat", "Surat, Gujarat", "Vadodara, Gujarat", "Rajkot, Gujarat", "Gandhinagar, Gujarat",
  "Jaipur, Rajasthan", "Jodhpur, Rajasthan", "Udaipur, Rajasthan", "Kota, Rajasthan",
  "Lucknow, Uttar Pradesh", "Kanpur, Uttar Pradesh", "Agra, Uttar Pradesh", "Varanasi, Uttar Pradesh",
  "Noida, Uttar Pradesh", "Ghaziabad, Uttar Pradesh", "Prayagraj, Uttar Pradesh",
  "Gurugram, Haryana", "Faridabad, Haryana", "Panipat, Haryana",
  "Chandigarh, Chandigarh",
  "Bhopal, Madhya Pradesh", "Indore, Madhya Pradesh", "Gwalior, Madhya Pradesh", "Jabalpur, Madhya Pradesh",
  "Kochi, Kerala", "Thiruvananthapuram, Kerala", "Kozhikode, Kerala", "Kollam, Kerala",
  "Patna, Bihar", "Gaya, Bihar", "Muzaffarpur, Bihar",
  "Bhubaneswar, Odisha", "Cuttack, Odisha", "Puri, Odisha",
  "Guwahati, Assam", "Dibrugarh, Assam",
  "Raipur, Chhattisgarh", "Bilaspur, Chhattisgarh",
  "Ranchi, Jharkhand", "Jamshedpur, Jharkhand", "Dhanbad, Jharkhand",
  "Amritsar, Punjab", "Ludhiana, Punjab", "Jalandhar, Punjab",
  "Dehradun, Uttarakhand", "Haridwar, Uttarakhand", "Nainital, Uttarakhand",
  "Shimla, Himachal Pradesh", "Manali, Himachal Pradesh",
  "Panaji, Goa", "Margao, Goa",
  "Visakhapatnam, Andhra Pradesh", "Vijayawada, Andhra Pradesh", "Guntur, Andhra Pradesh", "Tirupati, Andhra Pradesh",
  "Jammu, Jammu and Kashmir", "Srinagar, Jammu and Kashmir", "Leh, Ladakh",
  "Puducherry, Puducherry",
  "Port Blair, Andaman and Nicobar Islands",
  "Itanagar, Arunachal Pradesh", "Imphal, Manipur", "Shillong, Meghalaya", "Aizawl, Mizoram",
  "Kohima, Nagaland", "Agartala, Tripura", "Gangtok, Sikkim"
];
var TAMIL_NADU_CITIES = [
  "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", "Madurai, Tamil Nadu", "Tiruchirappalli, Tamil Nadu",
  "Salem, Tamil Nadu", "Tirunelveli, Tamil Nadu", "Tiruppur, Tamil Nadu", "Erode, Tamil Nadu",
  "Vellore, Tamil Nadu", "Thoothukudi, Tamil Nadu", "Dindigul, Tamil Nadu", "Thanjavur, Tamil Nadu",
  "Ranipet, Tamil Nadu", "Sivakasi, Tamil Nadu", "Karur, Tamil Nadu", "Udhagamandalam (Ooty), Tamil Nadu",
  "Kanchipuram, Tamil Nadu", "Cuddalore, Tamil Nadu", "Kumbakonam, Tamil Nadu", "Nagercoil, Tamil Nadu",
  "Hosur, Tamil Nadu", "Pollachi, Tamil Nadu", "Rajapalayam, Tamil Nadu", "Pudukkottai, Tamil Nadu",
  "Sivaganga, Tamil Nadu", "Namakkal, Tamil Nadu", "Krishnagiri, Tamil Nadu", "Dharmapuri, Tamil Nadu",
  "Ramanathapuram, Tamil Nadu", "Nagapattinam, Tamil Nadu", "Ariyalur, Tamil Nadu", "Perambalur, Tamil Nadu",
  "Theni, Tamil Nadu", "Virudhunagar, Tamil Nadu", "Tenkasi, Tamil Nadu", "Villupuram, Tamil Nadu",
  "Tiruvannamalai, Tamil Nadu", "Tirupathur, Tamil Nadu", "Mayiladuthurai, Tamil Nadu",
  "Chengalpattu, Tamil Nadu", "Kanyakumari, Tamil Nadu"
];
var DEFAULT_LOCATIONS = TAMIL_NADU_CITIES.concat(
  INDIA_CITIES.filter(function (c) { return TAMIL_NADU_CITIES.indexOf(c) === -1; })
);

var DEFAULT_TERMS = [
  "A valid driving licence and a government-issued photo ID are mandatory at the time of vehicle pickup.",
  "The renter is responsible for all traffic fines, tolls, and challans incurred during the rental period.",
  "The vehicle must be returned with the same fuel level as at pickup, or refuelling charges will apply.",
  "Any damage beyond normal wear and tear will be charged as per assessment, unless covered by the Full Protection Cover add-on.",
  "Late returns are billed at a pro-rated daily rate for each additional day or part thereof.",
  "The vehicle must not be used for commercial passenger transport, off-roading, or taken outside the agreed operating region without prior written consent.",
  "Any security deposit collected will be refunded within 7 working days of check-in, subject to deductions for damage, fines, or fuel shortfall.",
  "Cancellations made less than 24 hours before the scheduled pickup time may be subject to a cancellation fee."
];
var DEFAULT_ADDONS = [
  { id: "insurance", title: "Full protection cover", sub: "Waives your deductible entirely", price: 650 },
  { id: "chauffeur", title: "Chauffeur service", sub: "Licensed driver for the full rental", price: 2200 },
  { id: "delivery", title: "Doorstep delivery & pickup", sub: "We bring it to you, and collect it after", price: 800 },
  { id: "childseat", title: "Child seat", sub: "Rear-facing, ages 0–4", price: 300 }
];
var DEFAULT_SETTINGS = { siteName: "Lane", logo: null, terms: DEFAULT_TERMS, addons: DEFAULT_ADDONS, depositAmount: 3000, lateFeePerDay: 500 };

var DEFAULT_USERS = [
  { id: "u1", username: "admin", password: "lane123", role: "Admin", createdAt: new Date().toISOString() }
];var DEFAULT_FLEET = [
  { id: "c1", name: "Maruti Suzuki Swift", vehicleNumber: "TN 37 AB 1001", category: "Hatchback", kind: "hatchback", pricePerDay: 999, seats: 5, transmission: "Manual", available: true, description: "Light, easy to park, and the cheapest way to get around the city.", photo: null },
  { id: "c2", name: "Maruti Suzuki Alto K10", vehicleNumber: "TN 37 AB 1002", category: "Hatchback", kind: "hatchback", pricePerDay: 849, seats: 5, transmission: "Manual", available: true, description: "The most economical option in the fleet, ideal for short city hops.", photo: null },
  { id: "c3", name: "Hyundai Grand i10 Nios", vehicleNumber: "TN 37 AB 1003", category: "Hatchback", kind: "hatchback", pricePerDay: 1099, seats: 5, transmission: "Automatic", available: true, description: "A comfortable, well-equipped hatchback for daily city driving.", photo: null },
  { id: "c4", name: "Maruti Suzuki Dzire", vehicleNumber: "TN 37 AC 2001", category: "Sedan", kind: "sedan", pricePerDay: 1399, seats: 5, transmission: "Manual", available: true, description: "A dependable compact sedan — the everyday city and highway choice.", photo: null },
  { id: "c5", name: "Honda City", vehicleNumber: "TN 37 AC 2002", category: "Sedan", kind: "sedan", pricePerDay: 1899, seats: 5, transmission: "Automatic", available: true, description: "Refined ride and a roomy back seat, good for client pickups.", photo: null },
  { id: "c6", name: "Hyundai Verna", vehicleNumber: "TN 37 AC 2003", category: "Sedan", kind: "sedan", pricePerDay: 1999, seats: 5, transmission: "Automatic", available: true, description: "Sharp styling and a composed highway ride.", photo: null },
  { id: "c7", name: "Tata Nexon", vehicleNumber: "TN 37 AD 3001", category: "SUV", kind: "suv", pricePerDay: 2199, seats: 5, transmission: "Automatic", available: true, description: "Compact SUV with a high safety rating, well suited to city and ghat roads.", photo: null },
  { id: "c8", name: "Hyundai Creta", vehicleNumber: "TN 37 AD 3002", category: "SUV", kind: "suv", pricePerDay: 2599, seats: 5, transmission: "Automatic", available: true, description: "India's favourite mid-size SUV — comfortable on long highway runs.", photo: null },
  { id: "c9", name: "Mahindra Scorpio-N", vehicleNumber: "TN 37 AD 3003", category: "SUV", kind: "suv", pricePerDay: 2999, seats: 7, transmission: "Automatic", available: true, description: "A commanding presence with plenty of room for the whole family.", photo: null },
  { id: "c10", name: "Mahindra XUV700", vehicleNumber: "TN 37 AD 3004", category: "SUV", kind: "suv", pricePerDay: 3299, seats: 7, transmission: "Automatic", available: true, description: "A commanding 7-seater for family trips and longer group travel.", photo: null },
  { id: "c11", name: "Toyota Innova Crysta", vehicleNumber: "TN 37 AE 4001", category: "MUV", kind: "muv", pricePerDay: 3499, seats: 7, transmission: "Manual", available: true, description: "The standard choice for outstation trips — spacious and reliable.", photo: null },
  { id: "c12", name: "Maruti Suzuki Ertiga", vehicleNumber: "TN 37 AE 4002", category: "MUV", kind: "muv", pricePerDay: 2199, seats: 7, transmission: "Manual", available: true, description: "A practical 7-seater for family outings without the premium price.", photo: null },
  { id: "c13", name: "Toyota Fortuner", vehicleNumber: "TN 37 AF 5001", category: "Luxury", kind: "suv_large", pricePerDay: 6499, seats: 7, transmission: "Automatic", available: true, description: "Full-size body-on-frame SUV for a commanding, premium presence.", photo: null },
  { id: "c14", name: "Mercedes-Benz E-Class", vehicleNumber: "TN 37 AF 5002", category: "Luxury", kind: "sedan", pricePerDay: 12999, seats: 5, transmission: "Automatic", available: true, description: "Executive comfort and presence for special occasions and client transfers.", photo: null },
  { id: "c15", name: "BMW 5 Series", vehicleNumber: "TN 37 AF 5003", category: "Luxury", kind: "sedan", pricePerDay: 13999, seats: 5, transmission: "Automatic", available: true, description: "A driver-focused executive sedan with a commanding cabin.", photo: null },
  { id: "c16", name: "Tata Nexon EV", vehicleNumber: "TN 37 AG 6001", category: "Electric", kind: "electric", pricePerDay: 2799, seats: 5, transmission: "Automatic", available: true, description: "Zero tailpipe emissions and low running cost around town.", photo: null },
  { id: "c17", name: "MG ZS EV", vehicleNumber: "TN 37 AG 6002", category: "Electric", kind: "electric", pricePerDay: 3199, seats: 5, transmission: "Automatic", available: true, description: "Long range and a spacious, tech-forward cabin.", photo: null },
  { id: "c18", name: "Tata Tiago EV", vehicleNumber: "TN 37 AG 6003", category: "Electric", kind: "electric", pricePerDay: 1899, seats: 5, transmission: "Automatic", available: false, description: "Our newest electric hatchback — currently being serviced.", photo: null }
];

var APP = {
  loading: true,
  view: "home",
  fleet: [],
  bookings: [],
  locations: [],
  settings: { siteName: "Lane", logo: null },
  tripInfo: { pickupLocation: "Downtown Depot", pickupDate: "", pickupTime: "10:00", dropLocation: "Downtown Depot", dropDate: "", dropTime: "10:00" },
  lookupTemp: { code: "", email: "" },
  driverTemp: { name: "", email: "", phone: "" },
  bookingCar: null,
  bookingStep: 1,
  bookingAddons: [],
  lastTicket: null,
  lookupResult: undefined,
  adminAuthed: false,
  currentUser: null,
  users: [],
  editingUser: null,
  showAddUser: false,
  passError: false,
  editingCar: null,
  showAddCar: false,
  handoverModal: null,     // { booking, mode: 'out' | 'in' | 'view' }
  handoverPhotos: [],
  handoverDocs: { license: null, aadhar: null },
  carFormPhoto: null,
  billModal: null,
  calendarOpen: null,
  calendarView: { pickup: null, drop: null },
  agreedToTerms: false
};

/* ---------- helpers ---------- */
function fmt(n) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
  });
}
function daysBetween(a, b) {
  if (!a || !b) return 0;
  var d = (new Date(b) - new Date(a)) / 86400000;
  return d > 0 ? Math.ceil(d) : 0;
}
function pad2(n) { return n < 10 ? "0" + n : "" + n; }
function todayStr() {
  var d = new Date();
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}
function nowTimeStr() {
  var d = new Date();
  return pad2(d.getHours()) + ":" + pad2(d.getMinutes());
}
function formatDisplayDate(dateStr) {
  if (!dateStr) return "";
  var parts = dateStr.split("-");
  var d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
function genCode() {
  var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", s = "";
  for (var i = 0; i < 6; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return "AU-" + s;
}
function fileToCompressedBase64(file, maxWidth, quality) {
  maxWidth = maxWidth || 900; quality = quality || 0.6;
  return new Promise(function (resolve, reject) {
    var reader = new FileReader();
    reader.onerror = function () { reject(new Error("Could not read file")); };
    reader.onload = function () {
      var img = new Image();
      img.onerror = function () { reject(new Error("Could not decode image")); };
      img.onload = function () {
        var scale = Math.min(1, maxWidth / img.width);
        var canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
function showToast(msg) {
  var el = document.getElementById("toast-el");
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(function () { el.style.display = "none"; }, 2600);
}
function carArt(kind) {
  var stroke = "#3555FF";
  var paths = {
    sedan: "M20,70 Q25,45 55,42 L80,42 Q95,30 120,30 L150,30 Q170,30 178,42 L205,44 Q222,48 224,66 L224,72 L20,72 Z",
    suv: "M18,68 L18,44 Q18,34 30,34 L70,34 Q85,20 115,20 L165,20 Q185,20 190,34 L212,36 Q228,40 228,58 L228,72 L18,72 Z",
    convertible: "M22,68 Q26,50 60,48 L95,48 Q110,36 145,36 Q165,36 178,48 L210,50 Q224,54 224,66 L224,72 L22,72 Z",
    sports: "M14,70 Q30,50 62,48 Q80,32 118,32 Q150,32 168,44 L216,50 Q230,54 230,64 L230,72 L14,72 Z",
    electric: "M20,68 Q24,44 58,42 L85,42 Q100,28 130,28 L158,28 Q178,28 184,42 L206,44 Q222,48 224,64 L224,72 L20,72 Z",
    classic: "M16,70 L16,50 Q40,38 70,38 L110,38 Q130,26 160,26 L186,26 Q204,28 210,42 L226,46 Q234,52 234,64 L234,72 L16,72 Z",
    hatchback: "M22,70 Q26,48 52,46 L74,46 Q88,32 112,32 L150,32 Q168,32 174,46 L198,48 Q214,52 216,66 L216,72 L22,72 Z",
    muv: "M16,68 L16,42 Q16,32 28,32 L64,32 Q76,20 100,20 L172,20 Q192,20 198,32 L214,34 Q230,38 230,56 L230,72 L16,72 Z",
    suv_large: "M14,68 L14,40 Q14,28 28,28 L66,28 Q80,16 106,16 L178,16 Q198,16 204,28 L222,30 Q236,34 236,54 L236,72 L14,72 Z"
  };
  var d = paths[kind] || paths.sedan;
  return '<svg width="180" height="90" viewBox="0 0 250 90">' +
    '<path d="' + d + '" fill="none" stroke="' + stroke + '" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="62" cy="72" r="12" fill="none" stroke="' + stroke + '" stroke-width="1.4"/><circle cx="62" cy="72" r="4" fill="' + stroke + '"/>' +
    '<circle cx="182" cy="72" r="12" fill="none" stroke="' + stroke + '" stroke-width="1.4"/><circle cx="182" cy="72" r="4" fill="' + stroke + '"/>' +
    '<line x1="88" y1="42" x2="88" y2="30" stroke="' + stroke + '" stroke-width="1" opacity="0.5"/></svg>';
}

/* ---------- persistence ---------- */
var HAS_CLOUD_STORAGE = (typeof window.storage !== "undefined" && !!window.storage);
var IDB_NAME = "lane_storage_db";
var IDB_STORE = "kv";
var _idbPromise = null;

function idbOpen() {
  if (_idbPromise) return _idbPromise;
  _idbPromise = new Promise(function (resolve, reject) {
    if (typeof indexedDB === "undefined") { reject(new Error("no indexedDB")); return; }
    var req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = function () { req.result.createObjectStore(IDB_STORE); };
    req.onsuccess = function () { resolve(req.result); };
    req.onerror = function () { reject(req.error); };
  });
  return _idbPromise;
}
function idbGet(key) {
  return idbOpen().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(IDB_STORE, "readonly");
      var req = tx.objectStore(IDB_STORE).get(key);
      req.onsuccess = function () { resolve(req.result != null ? req.result : null); };
      req.onerror = function () { reject(req.error); };
    });
  });
}
function idbSet(key, value) {
  return idbOpen().then(function (db) {
    return new Promise(function (resolve, reject) {
      var tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(value, key);
      tx.oncomplete = function () { resolve(true); };
      tx.onerror = function () { reject(tx.error); };
    });
  });
}

async function storageGet(key) {
  if (HAS_CLOUD_STORAGE) {
    try {
      var r = await window.storage.get(key, true);
      if (r && r.value) return r.value;
    } catch (e) { /* fall through to local tiers */ }
  }
  try {
    var idbVal = await idbGet("lane_" + key);
    if (idbVal != null) return idbVal;
  } catch (e) { /* fall through */ }
  try { return localStorage.getItem("lane_" + key); } catch (e) { return null; }
}

async function storageSet(key, value) {
  var cloudOk = true;
  if (HAS_CLOUD_STORAGE) {
    try { var r = await window.storage.set(key, value, true); cloudOk = !!r; }
    catch (e) { cloudOk = false; }
  }
  var localOk = true;
  try {
    await idbSet("lane_" + key, value);
  } catch (e) {
    try { localStorage.setItem("lane_" + key, value); }
    catch (e2) { localOk = false; }
  }
  var success = HAS_CLOUD_STORAGE ? cloudOk : localOk;
  if (!success) {
    showToast("Could not save — your device may be out of storage space");
  }
  return success;
}

async function init() {
  render();
  try {
    var f = await storageGet("fleet");
    if (f) APP.fleet = JSON.parse(f);
    else { APP.fleet = DEFAULT_FLEET; await storageSet("fleet", JSON.stringify(DEFAULT_FLEET)); }
  } catch (e) { APP.fleet = DEFAULT_FLEET; }
  try {
    var b = await storageGet("bookings");
    if (b) APP.bookings = JSON.parse(b);
    else { APP.bookings = []; await storageSet("bookings", JSON.stringify([])); }
  } catch (e) { APP.bookings = []; }
  try {
    var u = await storageGet("users");
    if (u) APP.users = JSON.parse(u);
    else { APP.users = DEFAULT_USERS; await storageSet("users", JSON.stringify(DEFAULT_USERS)); }
  } catch (e) { APP.users = DEFAULT_USERS; }
  try {
    var l = await storageGet("locations");
    if (l) APP.locations = JSON.parse(l);
    else { APP.locations = DEFAULT_LOCATIONS; await storageSet("locations", JSON.stringify(DEFAULT_LOCATIONS)); }
  } catch (e) { APP.locations = DEFAULT_LOCATIONS; }
  try {
    var s = await storageGet("settings");
    if (s) APP.settings = Object.assign({ siteName: "Lane", logo: null, terms: DEFAULT_TERMS, addons: DEFAULT_ADDONS, depositAmount: 3000, lateFeePerDay: 500 }, JSON.parse(s));
    else { APP.settings = DEFAULT_SETTINGS; await storageSet("settings", JSON.stringify(DEFAULT_SETTINGS)); }
  } catch (e) { APP.settings = DEFAULT_SETTINGS; }
  document.title = APP.settings.siteName + " — Car Rental";
  APP.loading = false;
  render();
}
async function saveFleet() { return await storageSet("fleet", JSON.stringify(APP.fleet)); }
async function saveBookings() { return await storageSet("bookings", JSON.stringify(APP.bookings)); }
async function saveUsers() { return await storageSet("users", JSON.stringify(APP.users)); }
async function saveLocations() { return await storageSet("locations", JSON.stringify(APP.locations)); }
async function saveSettings() { return await storageSet("settings", JSON.stringify(APP.settings)); }

/* ---------- nav / view ---------- */
function setView(v) {
  APP.view = v;
  if (v === "mybookings") APP.lookupResult = undefined;
  render();
}

/* ---------- home / search / fleet ---------- */
/* ---------- date calendar popover ---------- */
function openCalendar(which) {
  var base = APP.tripInfo[which + "Date"] || (which === "drop" ? (APP.tripInfo.pickupDate || todayStr()) : todayStr());
  var parts = base.split("-");
  APP.calendarView[which] = { y: Number(parts[0]), m: Number(parts[1]) - 1 };
  APP.calendarOpen = APP.calendarOpen === which ? null : which;
  render();
}
function closeCalendar() {
  if (APP.calendarOpen) { APP.calendarOpen = null; render(); }
}
function calendarNav(which, delta) {
  var v = APP.calendarView[which];
  var m = v.m + delta, y = v.y;
  if (m < 0) { m = 11; y -= 1; }
  if (m > 11) { m = 0; y += 1; }
  APP.calendarView[which] = { y: y, m: m };
  render();
}
function pickCalendarDate(which, dateStr) {
  APP.tripInfo[which + "Date"] = dateStr;
  if (which === "pickup" && APP.tripInfo.dropDate && APP.tripInfo.dropDate < dateStr) {
    APP.tripInfo.dropDate = "";
  }
  APP.calendarOpen = null;
  render();
}
function calendarPopoverHTML(which) {
  var view = APP.calendarView[which];
  if (!view) return "";
  var selected = APP.tripInfo[which + "Date"];
  var minDate = which === "drop" ? (APP.tripInfo.pickupDate || todayStr()) : todayStr();
  var first = new Date(view.y, view.m, 1);
  var startDow = first.getDay();
  var daysInMonth = new Date(view.y, view.m + 1, 0).getDate();
  var monthLabel = first.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  var today = todayStr();
  var cells = "";
  for (var i = 0; i < startDow; i++) cells += '<span class="aur-cal-cell empty"></span>';
  for (var d = 1; d <= daysInMonth; d++) {
    var dateStr = view.y + "-" + pad2(view.m + 1) + "-" + pad2(d);
    var disabled = dateStr < minDate;
    var isSel = dateStr === selected;
    var isToday = dateStr === today;
    cells += '<button type="button" class="aur-cal-cell' + (disabled ? " disabled" : "") + (isSel ? " selected" : "") + (isToday ? " today" : "") + '"' +
      (disabled ? " disabled" : ' onclick="pickCalendarDate(\'' + which + "','" + dateStr + '\')"') + '>' + d + '</button>';
  }
  return '<div class="aur-calendar" onclick="event.stopPropagation()">' +
    '<div class="aur-cal-head">' +
    '<button type="button" onclick="calendarNav(\'' + which + '\',-1)">&#8249;</button>' +
    '<span class="mono">' + monthLabel + '</span>' +
    '<button type="button" onclick="calendarNav(\'' + which + '\',1)">&#8250;</button>' +
    '</div>' +
    '<div class="aur-cal-dow"><span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span></div>' +
    '<div class="aur-cal-grid">' + cells + '</div>' +
    '</div>';
}

function scrollToFleet() {
  if (!APP.tripInfo.pickupDate || !APP.tripInfo.dropDate) { showToast("Pick both dates"); return; }
  var el = document.getElementById("aur-fleet-anchor");
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
function reserveCar(id) {
  if (!APP.tripInfo.pickupDate || !APP.tripInfo.dropDate) { showToast("Choose your pickup and drop-off dates first"); return; }
  APP.bookingCar = APP.fleet.find(function (c) { return c.id === id; });
  APP.bookingStep = 1;
  APP.bookingAddons = [];
  APP.driverTemp = { name: "", email: "", phone: "" };
  APP.agreedToTerms = false;
  render();
}
function toggleAddon(id, checked) {
  var i = APP.bookingAddons.indexOf(id);
  if (checked && i === -1) APP.bookingAddons.push(id);
  if (!checked && i > -1) APP.bookingAddons.splice(i, 1);
}
function toggleTerms(checked) { APP.agreedToTerms = checked; }
function bookingGoStep(n) {
  if (n === 3) {
    var nameEl = document.getElementById("driver-name");
    var emailEl = document.getElementById("driver-email");
    var phoneEl = document.getElementById("driver-phone");
    if (nameEl) APP.driverTemp.name = nameEl.value;
    if (emailEl) APP.driverTemp.email = emailEl.value;
    if (phoneEl) APP.driverTemp.phone = phoneEl.value;
  }
  if (APP.bookingStep === 3 && n === 4) {
    var name = document.getElementById("driver-name").value.trim();
    var email = document.getElementById("driver-email").value.trim();
    var phone = document.getElementById("driver-phone").value.trim();
    if (!name || !email) { showToast("Enter your name and email to continue"); return; }
    APP.driverTemp = { name: name, email: email, phone: phone };
  }
  APP.bookingStep = n;
  render();
}
function closeBookingModal() { APP.bookingCar = null; render(); }

async function confirmBooking() {
  if (!APP.agreedToTerms) { showToast("Please read and accept the Terms & Conditions to continue"); return; }
  var car = APP.bookingCar;
  var days = daysBetween(APP.tripInfo.pickupDate, APP.tripInfo.dropDate);
  var carTotal = car.pricePerDay * days;
  var addonTotal = APP.bookingAddons.reduce(function (sum, id) {
    var a = (APP.settings.addons || DEFAULT_ADDONS).find(function (x) { return x.id === id; });
    return sum + (a ? a.price : 0) * days;
  }, 0);
  var record = {
    id: "bk_" + Date.now(),
    code: genCode(),
    carId: car.id, carName: car.name, vehicleNumber: car.vehicleNumber, kind: car.kind,
    pickupLocation: APP.tripInfo.pickupLocation, pickupDate: APP.tripInfo.pickupDate, pickupTime: APP.tripInfo.pickupTime,
    dropLocation: APP.tripInfo.dropLocation, dropDate: APP.tripInfo.dropDate, dropTime: APP.tripInfo.dropTime,
    days: days,
    driver: { name: APP.driverTemp.name, email: APP.driverTemp.email, phone: APP.driverTemp.phone },
    addons: APP.bookingAddons.slice(), addonTotal: addonTotal, carTotal: carTotal, total: carTotal + addonTotal,
    deposit: (APP.settings.depositAmount != null) ? APP.settings.depositAmount : 3000,
    status: "confirmed", createdAt: new Date().toISOString()
  };
  APP.bookings.unshift(record);
  var okRes = await saveBookings();
  APP.lastTicket = record;
  APP.bookingCar = null;
  showToast(okRes ? "Reservation confirmed" : "Reservation confirmed, but saving failed — it may not persist");
  render();
}

/* ---------- my bookings ---------- */
function findBooking() {
  var code = document.getElementById("lookup-code").value.trim();
  var email = document.getElementById("lookup-email").value.trim();
  APP.lookupTemp = { code: code, email: email };
  var found = APP.bookings.find(function (b) {
    return b.code.toLowerCase() === code.toLowerCase() && b.driver.email.toLowerCase() === email.toLowerCase();
  });
  APP.lookupResult = found || null;
  render();
}
async function cancelBooking(id) {
  var b = APP.bookings.find(function (x) { return x.id === id; });
  if (b) b.status = "cancelled";
  var okCancel = await saveBookings();
  if (APP.lookupResult && APP.lookupResult.id === id) APP.lookupResult = b;
  showToast(okCancel ? "Reservation cancelled" : "Cancelled, but saving failed — it may revert");
  render();
}

/* ---------- admin ---------- */
function tryAdminLogin() {
  var username = document.getElementById("login-username").value.trim();
  var password = document.getElementById("login-password").value;
  var match = APP.users.find(function (u) {
    return u.username.toLowerCase() === username.toLowerCase() && u.password === password;
  });
  if (match) { APP.adminAuthed = true; APP.currentUser = match; APP.passError = false; }
  else { APP.passError = true; }
  render();
}
function adminSignOut() { APP.adminAuthed = false; APP.currentUser = null; APP.view = "home"; render(); }

function openAddUser() { APP.editingUser = null; APP.showAddUser = true; render(); }
function openEditUser(id) { APP.editingUser = APP.users.find(function (u) { return u.id === id; }); APP.showAddUser = false; render(); }
function closeUserForm() { APP.editingUser = null; APP.showAddUser = false; render(); }
async function saveUserForm() {
  var username = document.getElementById("uf-username").value.trim();
  var password = document.getElementById("uf-password").value;
  var role = document.getElementById("uf-role").value;
  if (!username) { showToast("Username is required"); return; }
  if (!APP.editingUser && !password) { showToast("Password is required for a new user"); return; }
  var dup = APP.users.find(function (u) {
    return u.username.toLowerCase() === username.toLowerCase() && (!APP.editingUser || u.id !== APP.editingUser.id);
  });
  if (dup) { showToast("That username is already taken"); return; }
  if (APP.editingUser) {
    APP.editingUser.username = username;
    if (password) APP.editingUser.password = password;
    APP.editingUser.role = role;
    if (APP.currentUser && APP.currentUser.id === APP.editingUser.id) APP.currentUser = APP.editingUser;
  } else {
    APP.users.push({ id: "u" + Date.now(), username: username, password: password, role: role, createdAt: new Date().toISOString() });
  }
  var ok = await saveUsers();
  APP.editingUser = null; APP.showAddUser = false;
  showToast(ok ? "User saved" : "User saved locally, but the sync to storage failed — reopening this app elsewhere may not see it");
  render();
}
async function deleteUser(id) {
  if (APP.users.length <= 1) { showToast("Can't delete the last remaining user"); return; }
  if (APP.currentUser && APP.currentUser.id === id) { showToast("You can't delete the account you're signed in as"); return; }
  APP.users = APP.users.filter(function (u) { return u.id !== id; });
  var okDel = await saveUsers();
  showToast(okDel ? "User removed" : "Removed, but saving failed — it may reappear");
  render();
}

/* ---------- locations (admin-managed pickup/drop-off list) ---------- */
async function addLocation() {
  var input = document.getElementById("loc-new");
  var name = input.value.trim();
  if (!name) return;
  var dup = APP.locations.find(function (l) { return l.toLowerCase() === name.toLowerCase(); });
  if (dup) { showToast("That location already exists"); return; }
  APP.locations.push(name);
  var okAdd = await saveLocations();
  showToast(okAdd ? "Location added" : "Added, but saving failed — it may not persist");
  render();
}
async function deleteLocation(name) {
  if (APP.locations.length <= 1) { showToast("Can't remove the last remaining location"); return; }
  APP.locations = APP.locations.filter(function (l) { return l !== name; });
  var okDelLoc = await saveLocations();
  showToast(okDelLoc ? "Location removed" : "Removed, but saving failed — it may reappear");
  render();
}
async function addAllIndiaCities() {
  var existing = APP.locations.map(function (l) { return l.toLowerCase(); });
  var added = 0;
  INDIA_CITIES.forEach(function (c) {
    if (existing.indexOf(c.toLowerCase()) === -1) { APP.locations.push(c); existing.push(c.toLowerCase()); added++; }
  });
  if (added === 0) { showToast("All major Indian cities are already in your list"); return; }
  var okIndia = await saveLocations();
  showToast(okIndia ? ("Added " + added + " Indian cities") : "Added locally, but saving failed — they may not persist");
  render();
}
async function addTamilNaduCities() {
  var existing = APP.locations.map(function (l) { return l.toLowerCase(); });
  var added = 0;
  TAMIL_NADU_CITIES.forEach(function (c) {
    if (existing.indexOf(c.toLowerCase()) === -1) { APP.locations.push(c); existing.push(c.toLowerCase()); added++; }
  });
  if (added === 0) { showToast("All Tamil Nadu cities are already in your list"); return; }
  var okTN = await saveLocations();
  showToast(okTN ? ("Added " + added + " Tamil Nadu cities") : "Added locally, but saving failed — they may not persist");
  render();
}

/* ---------- branding (site name + logo) ---------- */
async function saveSiteName() {
  var name = document.getElementById("brand-name").value.trim();
  if (!name) { showToast("Site name can't be empty"); return; }
  APP.settings.siteName = name;
  var ok = await saveSettings();
  document.title = APP.settings.siteName + " — Car Rental";
  showToast(ok ? "Site name saved" : "Saved locally, but sync failed");
  render();
}
async function saveTerms() {
  var raw = document.getElementById("terms-editor").value;
  var lines = raw.split("\n").map(function (l) { return l.trim(); }).filter(function (l) { return l.length > 0; });
  if (lines.length === 0) { showToast("Add at least one term before saving"); return; }
  APP.settings.terms = lines;
  var okTerms = await saveSettings();
  showToast(okTerms ? "Terms & Conditions saved" : "Saved locally, but sync failed");
  render();
}
async function resetTerms() {
  APP.settings.terms = DEFAULT_TERMS.slice();
  var okReset = await saveSettings();
  showToast(okReset ? "Terms reset to default" : "Reset locally, but sync failed");
  render();
}
function renderBrandLogoAreaHTML() {
  if (!APP.settings.logo) {
    return '<div class="aur-upload"><input type="file" accept="image/*" onchange="handleBrandLogo(event)">' +
      '<div class="lbl">Upload a logo (square image works best)</div></div>';
  }
  return '<div class="aur-doc-thumb" style="width:110px;height:110px;"><img src="' + APP.settings.logo + '">' +
    '<button class="aur-thumb" style="position:absolute;top:6px;right:6px;width:22px;height:22px;border:none;" onclick="removeBrandLogo()">×</button></div>';
}
function updateBrandLogoArea() {
  var el = document.getElementById("brand-logo-area");
  if (el) el.innerHTML = renderBrandLogoAreaHTML();
}
async function handleBrandLogo(event) {
  var file = event.target.files[0];
  if (!file) return;
  try {
    APP.settings.logo = await fileToCompressedBase64(file, 400, 0.8);
    var ok = await saveSettings();
    if (!ok) showToast("Saved locally, but sync failed");
  } catch (e) { console.error(e); showToast("Could not process image"); }
  updateBrandLogoArea();
}
async function removeBrandLogo() {
  APP.settings.logo = null;
  await saveSettings();
  updateBrandLogoArea();
}

function addonsManagementHTML() {
  var list = APP.settings.addons || DEFAULT_ADDONS;
  var rows = list.map(function (a) {
    return '<div class="aur-addon-edit-row" data-id="' + esc(a.id) + '">' +
      '<input class="ao-title" value="' + esc(a.title) + '" placeholder="Title">' +
      '<input class="ao-sub" value="' + esc(a.sub) + '" placeholder="Description">' +
      '<input class="ao-price" type="number" min="0" step="1" value="' + a.price + '" placeholder="Price / day">' +
      '<button class="aur-btn ghost small" onclick="deleteAddonRow(\'' + esc(a.id) + '\')">Remove</button>' +
      '</div>';
  }).join('');
  return '<div class="aur-section-head" style="margin-top:36px;"><h2 class="disp" style="font-size:24px;">Add-ons</h2><button class="aur-btn small" onclick="addAddonRow()">+ Add add-on</button></div>' +
    '<div id="addons-editor">' + (rows || '<div class="aur-empty">No add-ons yet.</div>') + '</div>' +
    '<button class="aur-btn small" style="margin-top:14px;" onclick="saveAddons()">Save add-ons</button>' +
    '<div style="margin-bottom:60px;"></div>';
}
function addAddonRow() {
  if (!APP.settings.addons) APP.settings.addons = (DEFAULT_ADDONS.slice());
  APP.settings.addons.push({ id: "addon_" + Date.now(), title: "", sub: "", price: 0 });
  render();
}
function deleteAddonRow(id) {
  APP.settings.addons = (APP.settings.addons || DEFAULT_ADDONS).filter(function (a) { return a.id !== id; });
  render();
}
async function saveAddons() {
  var rowsEl = document.querySelectorAll("#addons-editor .aur-addon-edit-row");
  var next = [];
  for (var i = 0; i < rowsEl.length; i++) {
    var row = rowsEl[i];
    var title = row.querySelector(".ao-title").value.trim();
    var sub = row.querySelector(".ao-sub").value.trim();
    var price = Number(row.querySelector(".ao-price").value);
    if (!title) { showToast("Every add-on needs a title"); return; }
    if (isNaN(price) || price < 0) { showToast("Enter a valid price for every add-on"); return; }
    next.push({ id: row.getAttribute("data-id"), title: title, sub: sub, price: price });
  }
  APP.settings.addons = next;
  var okAddons = await saveSettings();
  showToast(okAddons ? "Add-ons saved" : "Saved locally, but sync failed");
  render();
}

function pricingPolicyHTML() {
  var deposit = (APP.settings.depositAmount != null) ? APP.settings.depositAmount : 3000;
  var lateFee = (APP.settings.lateFeePerDay != null) ? APP.settings.lateFeePerDay : 500;
  return '<div class="aur-section-head" style="margin-top:36px;"><h2 class="disp" style="font-size:24px;">Pricing policies</h2></div>' +
    '<div class="aur-row">' +
    '<div class="aur-formfield"><label>Security deposit (₹, refundable)</label>' +
    '<input id="policy-deposit" type="number" min="0" step="1" value="' + deposit + '">' +
    '</div>' +
    '<div class="aur-formfield"><label>Late return fee (₹ per day late)</label>' +
    '<input id="policy-latefee" type="number" min="0" step="1" value="' + lateFee + '">' +
    '</div>' +
    '</div>' +
    '<button class="aur-btn small" style="margin-top:10px;" onclick="savePricingPolicy()">Save pricing policies</button>' +
    '<div style="margin-bottom:60px;"></div>';
}
async function savePricingPolicy() {
  var deposit = Number(document.getElementById("policy-deposit").value);
  var lateFee = Number(document.getElementById("policy-latefee").value);
  if (isNaN(deposit) || deposit < 0) { showToast("Enter a valid deposit amount"); return; }
  if (isNaN(lateFee) || lateFee < 0) { showToast("Enter a valid late fee amount"); return; }
  APP.settings.depositAmount = deposit;
  APP.settings.lateFeePerDay = lateFee;
  var okPolicy = await saveSettings();
  showToast(okPolicy ? "Pricing policies saved" : "Saved locally, but sync failed");
  render();
}

function brandingManagementHTML() {
  var termsText = (APP.settings.terms || DEFAULT_TERMS).join("\n");
  return '<div class="aur-section-head"><h2 class="disp" style="font-size:24px;">Branding</h2></div>' +
    '<div class="aur-row">' +
    '<div class="aur-formfield"><label>Logo</label><div id="brand-logo-area">' + renderBrandLogoAreaHTML() + '</div></div>' +
    '<div class="aur-formfield"><label>Site name</label>' +
    '<input id="brand-name" value="' + esc(APP.settings.siteName) + '" onkeydown="if(event.key===\'Enter\')saveSiteName()">' +
    '<button class="aur-btn small" style="margin-top:10px;" onclick="saveSiteName()">Save name</button></div>' +
    '</div>' +
    '<div class="aur-section-head" style="margin-top:36px;"><h2 class="disp" style="font-size:24px;">Terms &amp; Conditions</h2></div>' +
    '<div class="aur-formfield" style="margin-bottom:14px;">' +
    '<label>One term per line — shown to customers before booking, on the bill, and on the PDF invoice</label>' +
    '<textarea id="terms-editor" rows="10" style="width:100%;font-size:13px;line-height:1.6;font-family:\'Work Sans\';padding:12px;border-radius:6px;background:var(--ink);border:1px solid var(--line);color:var(--ivory);resize:vertical;">' + esc(termsText) + '</textarea>' +
    '</div>' +
    '<button class="aur-btn small" onclick="saveTerms()">Save terms</button>' +
    '<button class="aur-btn ghost small" style="margin-left:10px;" onclick="resetTerms()">Reset to default</button>' +
    '<div style="margin-bottom:60px;"></div>';
}

/* ---------- backup & restore ---------- */
function downloadBackup() {
  var payload = {
    version: 1, exportedAt: new Date().toISOString(),
    settings: APP.settings, fleet: APP.fleet, bookings: APP.bookings, users: APP.users, locations: APP.locations
  };
  var blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  var url = URL.createObjectURL(blob);
  var a = document.createElement("a");
  var stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = APP.settings.siteName.replace(/\s+/g, "-").toLowerCase() + "-backup-" + stamp + ".json";
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
  showToast("Backup downloaded");
}
async function handleRestoreFile(event) {
  var file = event.target.files[0];
  if (!file) return;
  try {
    var text = await file.text();
    var data = JSON.parse(text);
    if (!data || typeof data !== "object") { showToast("That doesn't look like a valid backup file"); event.target.value = ""; return; }
    var ok = window.confirm("This will replace all current fleet, bookings, staff accounts, locations, and branding with the contents of this backup. This can't be undone. Continue?");
    if (!ok) { event.target.value = ""; return; }
    if (Array.isArray(data.fleet)) APP.fleet = data.fleet;
    if (Array.isArray(data.bookings)) APP.bookings = data.bookings;
    if (Array.isArray(data.users) && data.users.length) APP.users = data.users;
    if (Array.isArray(data.locations) && data.locations.length) APP.locations = data.locations;
    if (data.settings && typeof data.settings === "object") APP.settings = Object.assign({ siteName: "Lane", logo: null, terms: DEFAULT_TERMS, addons: DEFAULT_ADDONS, depositAmount: 3000, lateFeePerDay: 500 }, data.settings);
    await Promise.all([saveFleet(), saveBookings(), saveUsers(), saveLocations(), saveSettings()]);
    document.title = APP.settings.siteName + " — Car Rental";
    showToast("Backup restored");
    render();
  } catch (e) { console.error(e); showToast("Could not read that backup file"); }
  event.target.value = "";
}
function backupManagementHTML() {
  return '<div class="aur-section-head"><h2 class="disp" style="font-size:24px;">Backup &amp; restore</h2></div>' +
    '<div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:12px;">' +
    '<button class="aur-btn small" onclick="downloadBackup()">Download backup (.json)</button>' +
    '<div class="aur-upload" style="display:inline-block;padding:8px 16px;width:auto;">' +
    '<input type="file" accept="application/json" onchange="handleRestoreFile(event)">' +
    '<span class="lbl">Restore from backup file</span></div>' +
    '</div>' +
    '<div style="font-size:12px;color:var(--ivory-dim);margin-bottom:60px;">Restoring replaces all current data with the contents of the file you choose — download a fresh backup first if you want to keep what is here now.</div>';
}
async function updateStatus(id, status) {
  var b = APP.bookings.find(function (x) { return x.id === id; });
  if (b) b.status = status;
  var okStatus = await saveBookings();
  if (!okStatus) showToast("Status changed, but saving failed — it may revert");
  render();
}
async function toggleAvailable(id) {
  var c = APP.fleet.find(function (x) { return x.id === id; });
  if (c) c.available = !c.available;
  var okToggle = await saveFleet();
  if (!okToggle) showToast("Changed, but saving failed — it may revert");
  render();
}
async function deleteCar(id) {
  APP.fleet = APP.fleet.filter(function (c) { return c.id !== id; });
  var okDelCar = await saveFleet();
  showToast(okDelCar ? "Vehicle removed" : "Removed, but saving failed — it may reappear");
  render();
}
function openEditCar(id) { APP.editingCar = APP.fleet.find(function (c) { return c.id === id; }); APP.showAddCar = false; APP.carFormPhoto = APP.editingCar.photo || null; render(); }
function openAddCar() { APP.editingCar = null; APP.showAddCar = true; APP.carFormPhoto = null; render(); }
function closeCarForm() { APP.editingCar = null; APP.showAddCar = false; APP.carFormPhoto = null; render(); }

function renderCarPhotoAreaHTML() {
  if (!APP.carFormPhoto) {
    return '<div class="aur-upload"><input type="file" accept="image/*" onchange="handleCarPhoto(event)">' +
      '<div class="lbl">Upload a photo of this actual vehicle</div></div>';
  }
  return '<div class="aur-doc-thumb" style="width:100%;height:150px;"><img src="' + APP.carFormPhoto + '">' +
    '<button class="aur-thumb" style="position:absolute;top:6px;right:6px;width:22px;height:22px;border:none;" onclick="removeCarPhoto()">×</button></div>';
}
function updateCarPhotoArea() {
  var el = document.getElementById("cf-photo-area");
  if (el) el.innerHTML = renderCarPhotoAreaHTML();
}
async function handleCarPhoto(event) {
  var file = event.target.files[0];
  if (!file) return;
  try { APP.carFormPhoto = await fileToCompressedBase64(file, 1000, 0.62); }
  catch (e) { console.error(e); showToast("Could not process image"); }
  updateCarPhotoArea();
}
function removeCarPhoto() { APP.carFormPhoto = null; updateCarPhotoArea(); }

async function saveCarForm() {
  var name = document.getElementById("cf-name").value.trim();
  if (!name) { showToast("Vehicle name is required"); return; }
  var car = {
    id: APP.editingCar ? APP.editingCar.id : "c" + Date.now(),
    name: name,
    vehicleNumber: document.getElementById("cf-vehicle-number").value.trim(),
    category: document.getElementById("cf-category").value,
    kind: document.getElementById("cf-kind").value,
    pricePerDay: Number(document.getElementById("cf-price").value) || 0,
    seats: Number(document.getElementById("cf-seats").value) || 1,
    transmission: document.getElementById("cf-transmission").value,
    available: APP.editingCar ? APP.editingCar.available : true,
    description: document.getElementById("cf-description").value,
    photo: APP.carFormPhoto
  };
  if (APP.editingCar) {
    APP.fleet = APP.fleet.map(function (c) { return c.id === car.id ? car : c; });
  } else {
    APP.fleet.push(car);
  }
  var okCar = await saveFleet();
  APP.editingCar = null; APP.showAddCar = false; APP.carFormPhoto = null;
  showToast(okCar ? "Fleet updated" : "Fleet updated locally, but saving failed — it may not persist");
  render();
}

/* ---------- handover ---------- */
function openHandover(bookingId, mode) {
  var booking = APP.bookings.find(function (b) { return b.id === bookingId; });
  if (!booking) return;
  var existing = mode === "out" ? booking.handoverOut : mode === "in" ? booking.handoverIn : null;
  APP.handoverPhotos = (existing && existing.photos) ? existing.photos.slice() : [];
  APP.handoverDocs = { license: (existing && existing.licensePhoto) || null, aadhar: (existing && existing.aadharPhoto) || null };
  APP.handoverModal = { booking: booking, mode: mode };
  render();
}
function closeHandover() { APP.handoverModal = null; render(); }

function renderPhotoAreaHTML() {
  var max = 10;
  var html = "";
  if (APP.handoverPhotos.length < max) {
    html += '<div class="aur-upload"><input type="file" accept="image/*" multiple capture="environment" onchange="handleConditionPhotos(event)">' +
      '<div class="lbl">Add condition photo (' + APP.handoverPhotos.length + '/' + max + ')</div></div>';
  }
  if (APP.handoverPhotos.length > 0) {
    html += '<div class="aur-thumbs">' + APP.handoverPhotos.map(function (p, i) {
      return '<div class="aur-thumb"><img src="' + p + '"><button onclick="removeConditionPhoto(' + i + ')">×</button></div>';
    }).join("") + '</div>';
  }
  return html;
}
function updatePhotoArea() {
  var el = document.getElementById("condition-photo-area");
  if (el) el.innerHTML = renderPhotoAreaHTML();
}
async function handleConditionPhotos(event) {
  var files = event.target.files;
  if (!files || !files.length) return;
  var room = 10 - APP.handoverPhotos.length;
  var picked = Array.prototype.slice.call(files, 0, room);
  try {
    var results = await Promise.all(picked.map(function (f) { return fileToCompressedBase64(f, 900, 0.55); }));
    APP.handoverPhotos = APP.handoverPhotos.concat(results);
  } catch (e) { console.error(e); showToast("Could not process image"); }
  updatePhotoArea();
}
function removeConditionPhoto(i) { APP.handoverPhotos.splice(i, 1); updatePhotoArea(); }

function renderDocAreaHTML(kind) {
  var value = APP.handoverDocs[kind];
  var label = kind === "license" ? "Licence" : "Aadhar";
  if (!value) {
    return '<div class="aur-upload"><input type="file" accept="image/*" capture="environment" onchange="handleDocUpload(event,\'' + kind + '\')">' +
      '<div class="lbl">' + label + ' — tap to scan / upload</div></div>';
  }
  return '<div class="aur-doc-thumb"><img src="' + value + '"><button class="aur-thumb" style="position:absolute;top:2px;right:2px;width:18px;height:18px;border:none;" onclick="removeDoc(\'' + kind + '\')">×</button></div>';
}
function updateDocArea(kind) {
  var el = document.getElementById("doc-area-" + kind);
  if (el) el.innerHTML = renderDocAreaHTML(kind);
}
async function handleDocUpload(event, kind) {
  var file = event.target.files[0];
  if (!file) return;
  try {
    APP.handoverDocs[kind] = await fileToCompressedBase64(file, 900, 0.6);
  } catch (e) { console.error(e); showToast("Could not process image"); }
  updateDocArea(kind);
}
function removeDoc(kind) { APP.handoverDocs[kind] = null; updateDocArea(kind); }

async function saveHandover() {
  var odometer = document.getElementById("ho-odometer").value;
  if (!odometer) { showToast("Odometer reading is required"); return; }
  var mode = APP.handoverModal.mode;
  var retDate = "", retTime = "";
  if (mode === "in") {
    retDate = document.getElementById("ho-return-date").value || todayStr();
    retTime = document.getElementById("ho-return-time").value || nowTimeStr();
  }
  var data = {
    odometerKm: odometer,
    fuelLevel: document.getElementById("ho-fuel").value,
    conditionNotes: document.getElementById("ho-notes").value,
    photos: APP.handoverPhotos.slice(),
    recordedAt: mode === "in" ? new Date(retDate + "T" + retTime).toISOString() : new Date().toISOString()
  };
  if (mode === "out") {
    data.licenseNumber = document.getElementById("ho-license-number").value;
    data.aadharNumber = document.getElementById("ho-aadhar-number").value;
    data.licensePhoto = APP.handoverDocs.license;
    data.aadharPhoto = APP.handoverDocs.aadhar;
    data.phone = document.getElementById("ho-phone").value;
    data.email = document.getElementById("ho-email").value;
    data.address = document.getElementById("ho-address").value;
  }
  var booking = APP.handoverModal.booking;
  var field = mode === "out" ? "handoverOut" : "handoverIn";
  var b = APP.bookings.find(function (x) { return x.id === booking.id; });
  b[field] = data;
  if (mode === "out" && b.status === "confirmed") b.status = "active";
  var lateMsg = "";
  if (mode === "in") {
    var lateResult = computeLateFee(b, retDate, retTime);
    b.lateDays = lateResult.lateDays;
    b.lateFee = lateResult.lateFee;
    if (lateResult.lateDays > 0) lateMsg = " (" + lateResult.lateDays + " day" + (lateResult.lateDays > 1 ? "s" : "") + " late, " + fmt(b.lateFee) + " late fee applied)";
    if (b.status === "active") b.status = "completed";
  }
  var okHandover = await saveBookings();
  APP.handoverModal = null;
  showToast(okHandover ? (mode === "out" ? "Handover recorded — vehicle checked out" : "Return recorded — vehicle checked in" + lateMsg) : "Recorded locally, but saving failed — photos may not persist");
  render();
}

/* ---------- bill / invoice (PDF via jsPDF) ---------- */
function openBill(id) { APP.billModal = id; render(); }
function closeBill() { APP.billModal = null; render(); }

function buildInvoiceDoc(b) {
  var jsPDFCtor = window.jspdf && window.jspdf.jsPDF;
  if (!jsPDFCtor) { showToast("PDF library did not load — check your connection"); return null; }
  var doc = new jsPDFCtor({ unit: "pt", format: "a4" });
  var pageWidth = doc.internal.pageSize.getWidth();
  var mx = 50;
  var y = 56;

  doc.setFont("helvetica", "bold"); doc.setFontSize(20); doc.setTextColor(20, 18, 15);
  doc.text(APP.settings.siteName.toUpperCase(), mx, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(140, 130, 110);
  doc.text("Private fleet car rental", mx, y + 14);

  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(20, 18, 15);
  doc.text("TAX INVOICE", pageWidth - mx, y, { align: "right" });
  doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(110, 110, 110);
  doc.text("Invoice #: " + b.code, pageWidth - mx, y + 16, { align: "right" });
  doc.text("Date: " + new Date(b.createdAt).toLocaleDateString("en-IN"), pageWidth - mx, y + 29, { align: "right" });

  y += 46;
  doc.setDrawColor(255, 91, 60); doc.setLineWidth(1.2);
  doc.line(mx, y, pageWidth - mx, y);
  y += 26;

  var colW = (pageWidth - mx * 2) / 2;
  var yL = y, yR = y;

  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(255, 91, 60);
  doc.text("BILLED TO", mx, yL); yL += 16;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(20, 18, 15);
  doc.text(b.driver.name || "-", mx, yL); yL += 14;
  doc.setFontSize(9.5); doc.setTextColor(90, 90, 90);
  doc.text(b.driver.email || "-", mx, yL); yL += 13;
  if (b.driver.phone) { doc.text(b.driver.phone, mx, yL); yL += 13; }
  var addr = b.handoverOut && b.handoverOut.address;
  if (addr) { var wrapped = doc.splitTextToSize(addr, colW - 10); doc.text(wrapped, mx, yL); yL += wrapped.length * 12; }

  var rx = mx + colW;
  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(255, 91, 60);
  doc.text("VEHICLE", rx, yR); yR += 16;
  doc.setFont("helvetica", "normal"); doc.setFontSize(10.5); doc.setTextColor(20, 18, 15);
  doc.text(b.carName || "-", rx, yR); yR += 14;
  doc.setFontSize(9.5); doc.setTextColor(90, 90, 90);
  doc.text("Reg. no: " + (b.vehicleNumber || "-"), rx, yR); yR += 13;
  doc.text(b.days + " day" + (b.days !== 1 ? "s" : "") + " rental", rx, yR); yR += 13;

  y = Math.max(yL, yR) + 20;
  doc.setDrawColor(230, 225, 215); doc.setLineWidth(0.7);
  doc.line(mx, y, pageWidth - mx, y);
  y += 22;

  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(255, 91, 60);
  doc.text("TRIP", mx, y); y += 16;
  doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(20, 18, 15);
  doc.text("Pick-up:  " + (b.pickupLocation || "-") + "  ·  " + (b.pickupDate || "-") + " " + (b.pickupTime || ""), mx, y); y += 14;
  doc.text("Drop-off: " + (b.dropLocation || "-") + "  ·  " + (b.dropDate || "-") + " " + (b.dropTime || ""), mx, y); y += 26;

  doc.setDrawColor(230, 225, 215); doc.line(mx, y, pageWidth - mx, y); y += 4;

  var rowH = 22;
  function chargeRow(label, amount, bold) {
    y += rowH;
    doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(10);
    doc.setTextColor(bold ? 20 : 60, bold ? 18 : 60, bold ? 15 : 60);
    doc.text(label, mx, y);
    doc.text(fmt(amount), pageWidth - mx, y, { align: "right" });
  }
  chargeRow(b.carName + " × " + b.days + " day" + (b.days !== 1 ? "s" : "") + " (" + fmt(b.carTotal / b.days) + "/day)", b.carTotal, false);
  (b.addons || []).forEach(function (id) {
    var a = (APP.settings.addons || DEFAULT_ADDONS).find(function (x) { return x.id === id; });
    if (a) chargeRow(a.title + " × " + b.days + " day" + (b.days !== 1 ? "s" : ""), a.price * b.days, false);
  });
  y += 8;
  doc.setDrawColor(255, 91, 60); doc.line(mx, y, pageWidth - mx, y);
  chargeRow("Total (incl. applicable taxes)", b.total, true);
  if (b.deposit != null && b.deposit > 0) {
    y += rowH;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(180, 145, 91);
    doc.text("Refundable security deposit (collected separately)", mx, y);
    doc.text(fmt(b.deposit), pageWidth - mx, y, { align: "right" });
  }
  if (b.lateFee != null && b.lateFee > 0) {
    y += rowH;
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(200, 60, 40);
    doc.text("Late return fee (" + b.lateDays + " day" + (b.lateDays !== 1 ? "s" : "") + ")", mx, y);
    doc.text(fmt(b.lateFee), pageWidth - mx, y, { align: "right" });
  }
  var adjustments = b.adjustments || [];
  adjustments.forEach(function (a) {
    y += rowH;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9);
    doc.setTextColor(a.amount < 0 ? 60 : 200, a.amount < 0 ? 140 : 60, a.amount < 0 ? 80 : 40);
    doc.text(a.label, mx, y);
    doc.text((a.amount >= 0 ? "+" : "") + fmt(a.amount), pageWidth - mx, y, { align: "right" });
  });
  var adjustSum = adjustments.reduce(function (s, a) { return s + a.amount; }, 0);
  if ((b.lateFee > 0) || adjustments.length > 0) {
    y += rowH;
    doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.setTextColor(20, 18, 15);
    doc.text("Grand total", mx, y);
    doc.text(fmt(b.total + (b.lateFee || 0) + adjustSum), pageWidth - mx, y, { align: "right" });
  }

  y += 50;
  if (b.handoverOut || b.handoverIn) {
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(255, 91, 60);
    doc.text("VEHICLE HANDOVER", mx, y); y += 16;
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5); doc.setTextColor(20, 18, 15);
    if (b.handoverOut) { doc.text("Odometer at check-out: " + b.handoverOut.odometerKm + " km", mx, y); y += 14; }
    if (b.handoverIn) { doc.text("Odometer at check-in: " + b.handoverIn.odometerKm + " km", mx, y); y += 14; }
    if (b.handoverOut && b.handoverIn) {
      var dist = Math.max(0, Number(b.handoverIn.odometerKm) - Number(b.handoverOut.odometerKm));
      doc.text("Distance driven: " + dist + " km", mx, y); y += 14;
    }
    y += 20;
  }

  var pageHeight = doc.internal.pageSize.getHeight();
  var termsLines = [];
  (APP.settings.terms || DEFAULT_TERMS).forEach(function (t, i) {
    var wrapped = doc.splitTextToSize((i + 1) + ". " + t, pageWidth - mx * 2);
    termsLines = termsLines.concat(wrapped);
  });
  var termsHeight = 16 + termsLines.length * 11 + 10;
  if (y + termsHeight > pageHeight - 60) { doc.addPage(); y = 56; }
  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(255, 91, 60);
  doc.text("TERMS & CONDITIONS", mx, y); y += 14;
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(110, 105, 95);
  termsLines.forEach(function (line) {
    if (y > pageHeight - 40) { doc.addPage(); y = 56; }
    doc.text(line, mx, y); y += 11;
  });
  y += 18;

  if (y > pageHeight - 40) { doc.addPage(); y = 56; }
  doc.setFont("helvetica", "italic"); doc.setFontSize(9); doc.setTextColor(140, 130, 110);
  doc.text("Thank you for choosing " + APP.settings.siteName + ".", mx, y);
  doc.setFont("helvetica", "normal"); doc.setFontSize(7.5); doc.setTextColor(170, 165, 155);
  doc.text("System-generated invoice for booking " + b.code + ".", mx, y + 12);

  return doc;
}

function canShareFiles() {
  try {
    if (!navigator.canShare || !window.File) return false;
    var probe = new File([""], "probe.pdf", { type: "application/pdf" });
    return navigator.canShare({ files: [probe] });
  } catch (e) { return false; }
}

function downloadBill(id) {
  var b = APP.bookings.find(function (x) { return x.id === id; });
  if (!b) return;
  var doc = buildInvoiceDoc(b);
  if (!doc) return;
  doc.save("Invoice-" + b.code + ".pdf");
}

async function shareBillWhatsApp(id) {
  var b = APP.bookings.find(function (x) { return x.id === id; });
  if (!b) return;
  var doc = buildInvoiceDoc(b);
  if (!doc) return;
  var summary = "Hi " + (b.driver.name || "") + ", here is your " + APP.settings.siteName + " invoice " + b.code + " for " + b.carName + " — total " + fmt(b.total) + ".";
  if (canShareFiles()) {
    try {
      var blob = doc.output("blob");
      var file = new File([blob], "Invoice-" + b.code + ".pdf", { type: "application/pdf" });
      await navigator.share({ files: [file], title: "Invoice " + b.code, text: summary });
      return;
    } catch (e) { /* user cancelled or share failed — fall through to fallback */ }
  }
  doc.save("Invoice-" + b.code + ".pdf");
  window.open("https://wa.me/?text=" + encodeURIComponent(summary + " (PDF just downloaded — attach it here)"), "_blank");
  showToast("PDF downloaded — attach it in the WhatsApp chat that opened");
}

async function emailBill(id) {
  var b = APP.bookings.find(function (x) { return x.id === id; });
  if (!b) return;
  var doc = buildInvoiceDoc(b);
  if (!doc) return;
  var subject = "Your " + APP.settings.siteName + " invoice " + b.code;
  var body = "Hi " + (b.driver.name || "") + ",\n\nPlease find your invoice for the rental of " + b.carName + " (" + b.code + ").\nTotal: " + fmt(b.total) + "\n\nThank you for choosing " + APP.settings.siteName + ".";
  if (canShareFiles()) {
    try {
      var blob = doc.output("blob");
      var file = new File([blob], "Invoice-" + b.code + ".pdf", { type: "application/pdf" });
      await navigator.share({ files: [file], title: subject, text: body });
      return;
    } catch (e) { /* fall through */ }
  }
  doc.save("Invoice-" + b.code + ".pdf");
  window.location.href = "mailto:" + encodeURIComponent(b.driver.email || "") + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  showToast("PDF downloaded — attach it to the email draft that opened");
}


function render() {
  var app = document.getElementById("app");
  if (APP.loading) {
    app.innerHTML = '<div style="min-height:70vh;display:flex;align-items:center;justify-content:center;"><div class="disp" style="color:#FFC93D;font-size:20px;">Lane</div></div>';
    return;
  }
  var html = navHTML();
  if (APP.view === "home") html += homeHTML();
  else if (APP.view === "mybookings") html += myBookingsHTML();
  else if (APP.view === "admin") html += (APP.adminAuthed ? adminDashboardHTML() : adminGateHTML());

  if (APP.bookingCar) html += bookingModalHTML();
  if (APP.lastTicket) html += ticketModalHTML();
  if (APP.editingCar || APP.showAddCar) html += carFormModalHTML();
  if (APP.editingUser || APP.showAddUser) html += userFormModalHTML();
  if (APP.handoverModal) html += handoverModalHTML();
  if (APP.billModal) html += billModalHTML();

  app.innerHTML = html;

  var s = document.getElementById("trip-pickup-date");
  var e = document.getElementById("trip-drop-date");
  if (s && e) s.addEventListener("input", function () { e.min = s.value; });
}

function navHTML() {
  var logoImg = APP.settings.logo ? '<img src="' + APP.settings.logo + '" alt="logo" style="height:34px;width:34px;object-fit:cover;border-radius:4px;vertical-align:middle;margin-right:10px;">' : "";
  return '<nav class="aur-nav">' +
    '<div class="aur-logo disp" style="display:flex;align-items:center;">' + logoImg + '<span>' + esc(APP.settings.siteName) + '</span></div>' +
    '<div class="aur-navlinks">' +
    '<button class="' + (APP.view === "home" ? "active" : "") + '" onclick="setView(\'home\')">Fleet</button>' +
    '<button class="' + (APP.view === "mybookings" ? "active" : "") + '" onclick="setView(\'mybookings\')">Bookings</button>' +
    '<button class="' + (APP.view === "admin" ? "active" : "") + '" onclick="setView(\'admin\')">Admin</button>' +
    '</div></nav>';
}

function homeHTML() {
  var t = APP.tripInfo;
  var locOptions = APP.locations.map(function (l) { return '<option ' + (t.pickupLocation === l ? "selected" : "") + '>' + esc(l) + '</option>'; }).join("");
  var dropLocOptions = APP.locations.map(function (l) { return '<option ' + (t.dropLocation === l ? "selected" : "") + '>' + esc(l) + '</option>'; }).join("");
  var available = APP.fleet.filter(function (c) { return c.available; }).length;

  var cards = APP.fleet.map(function (car) {
    var btn = car.available
      ? '<button class="aur-btn small" onclick="reserveCar(\'' + car.id + '\')">Reserve</button>'
      : '<button class="aur-btn small ghost" disabled>Unavailable</button>';
    var art = car.photo ? '<img src="' + car.photo + '" alt="' + esc(car.name) + '" style="width:100%;height:100%;object-fit:cover;">' : carArt(car.kind);
    return '<div class="aur-card">' +
      '<div class="aur-card-art">' + art + '</div>' +
      '<div class="aur-card-body">' +
      '<span class="aur-tag">' + esc(car.category) + '</span>' +
      '<h3 class="disp">' + esc(car.name) + '</h3>' +
      '<div class="meta">' + car.seats + ' seats · ' + esc(car.transmission) + '</div>' +
      '<div class="meta plate mono" style="color:var(--gold-bright);letter-spacing:0.04em;">' + esc(car.vehicleNumber || "—") + '</div>' +
      '<div class="aur-card-foot">' +
      '<div class="aur-price mono">' + fmt(car.pricePerDay) + '<span class="per"> /day</span></div>' +
      btn + '</div></div></div>';
  }).join("");

  return '<header class="aur-hero">' +
    '<div class="aur-hero-eyebrow">Private fleet · six cities</div>' +
    '<h1 class="disp">The car should arrive<br><em>already knowing</em> the route.</h1>' +
    '<p>Reserve from a small, well-kept fleet. No lots, no counters — your vehicle is brought to you, cleaned and fuelled, at the hour you choose.</p>' +
    '<div class="aur-search">' +
    '<div class="aur-search-label">Pick-up</div>' +
    '<div class="aur-search-row">' +
    '<div class="aur-field"><label>Location</label><select id="trip-pickup-location" onchange="APP.tripInfo.pickupLocation=this.value">' + locOptions + '</select></div>' +
    '<div class="aur-field aur-datefield"><label>Date</label><div class="aur-date-wrap">' +
    '<input type="text" readonly id="trip-pickup-date" value="' + esc(formatDisplayDate(t.pickupDate)) + '" placeholder="Select date" onclick="event.stopPropagation();openCalendar(\'pickup\')">' +
    (APP.calendarOpen === "pickup" ? calendarPopoverHTML("pickup") : "") +
    '</div></div>' +
    '<div class="aur-field"><label>Time</label><input type="time" id="trip-pickup-time" value="' + esc(t.pickupTime) + '" oninput="APP.tripInfo.pickupTime=this.value"></div>' +
    '</div>' +
    '<hr class="aur-search-divider">' +
    '<div class="aur-search-label">Drop-off</div>' +
    '<div class="aur-search-row">' +
    '<div class="aur-field"><label>Location</label><select id="trip-drop-location" onchange="APP.tripInfo.dropLocation=this.value">' + dropLocOptions + '</select></div>' +
    '<div class="aur-field aur-datefield"><label>Date</label><div class="aur-date-wrap">' +
    '<input type="text" readonly id="trip-drop-date" value="' + esc(formatDisplayDate(t.dropDate)) + '" placeholder="Select date" onclick="event.stopPropagation();openCalendar(\'drop\')">' +
    (APP.calendarOpen === "drop" ? calendarPopoverHTML("drop") : "") +
    '</div></div>' +
    '<div class="aur-field"><label>Time</label><input type="time" id="trip-drop-time" value="' + esc(t.dropTime) + '" oninput="APP.tripInfo.dropTime=this.value"></div>' +
    '</div>' +
    '<button class="aur-btn" style="width:100%;" onclick="scrollToFleet()">See the fleet</button>' +
    '</div></header>' +
    '<section class="aur-section" id="aur-fleet-anchor">' +
    '<div class="aur-section-head"><h2 class="disp">Available now</h2><span class="num mono">' + available + ' of ' + APP.fleet.length + ' vehicles</span></div>' +
    '<div class="aur-grid">' + cards + '</div></section>' +
    '<footer class="aur-footer">' + esc(APP.settings.siteName) + ' — a demo booking experience. Reservation data is shared and visible to anyone using this app. All prices in INR (₹).</footer>';
}

function myBookingsHTML() {
  var lt = APP.lookupTemp;
  var html = '<section class="aur-section" style="max-width:640px;">' +
    '<div class="aur-section-head"><h2 class="disp">Find your reservation</h2></div>' +
    '<div class="aur-row">' +
    '<div class="aur-formfield"><label>Confirmation code</label><input id="lookup-code" placeholder="AU-XXXXXX" value="' + esc(lt.code) + '"></div>' +
    '<div class="aur-formfield"><label>Email used to book</label><input id="lookup-email" placeholder="you@example.com" value="' + esc(lt.email) + '"></div>' +
    '</div><button class="aur-btn" onclick="findBooking()">Look up</button>';

  if (APP.lookupResult === null) {
    html += '<div class="aur-empty" style="margin-top:30px;"><div class="disp">No match found</div>Check the code and email, then try again.</div>';
  } else if (APP.lookupResult) {
    var b = APP.lookupResult;
    html += '<div style="margin-top:34px;">' + ticketCardHTML(b) + billActionsHTML(b.id);
    if (b.status !== "cancelled" && b.status !== "completed") {
      html += '<button class="aur-btn danger small" style="margin-top:16px;" onclick="cancelBooking(\'' + b.id + '\')">Cancel reservation</button>';
    }
    html += '</div>';
  }
  html += '</section>';
  return html;
}

function ticketCardHTML(b) {
  var depositLine = (b.deposit != null && b.deposit > 0)
    ? '<div class="aur-summary-line" style="padding:3px 0;color:var(--gold-bright);"><span>Refundable deposit</span><span>' + fmt(b.deposit) + '</span></div>' : "";
  var lateLine = (b.lateFee != null && b.lateFee > 0)
    ? '<div class="aur-summary-line" style="padding:3px 0;color:var(--danger);"><span>Late return fee (' + b.lateDays + 'd)</span><span>' + fmt(b.lateFee) + '</span></div>' : "";
  var adjustments = b.adjustments || [];
  var adjustSum = adjustments.reduce(function (s, a) { return s + a.amount; }, 0);
  var adjustLines = adjustments.map(function (a) {
    return '<div class="aur-summary-line" style="padding:3px 0;color:' + (a.amount < 0 ? "var(--success)" : "var(--gold-bright)") + ';"><span>' + esc(a.label) + '</span><span>' + (a.amount >= 0 ? "+" : "") + fmt(a.amount) + '</span></div>';
  }).join("");
  var grandTotal = b.total + (b.lateFee || 0) + adjustSum;
  var showGrand = (b.lateFee > 0) || adjustments.length > 0;
  return '<div class="aur-ticket"><div class="aur-ticket-top">' +
    '<div class="aur-summary-line" style="padding:3px 0;"><span>Vehicle</span><span>' + esc(b.carName) + '</span></div>' +
    '<div class="aur-summary-line" style="padding:3px 0;"><span>Vehicle number</span><span class="mono">' + esc(b.vehicleNumber || "—") + '</span></div>' +
    '<div class="aur-summary-line" style="padding:3px 0;"><span>Pick-up</span><span>' + esc(b.pickupLocation) + ' · ' + esc(b.pickupDate) + ' ' + esc(b.pickupTime) + '</span></div>' +
    '<div class="aur-summary-line" style="padding:3px 0;"><span>Drop-off</span><span>' + esc(b.dropLocation) + ' · ' + esc(b.dropDate) + ' ' + esc(b.dropTime) + '</span></div>' +
    '<div class="aur-summary-line" style="padding:3px 0;"><span>Driver</span><span>' + esc(b.driver.name) + '</span></div>' +
    '<div class="aur-summary-line total"><span>Rental total</span><span>' + fmt(b.total) + '</span></div>' +
    depositLine + lateLine + adjustLines +
    (showGrand ? '<div class="aur-summary-line total" style="margin-top:6px;"><span>Grand total</span><span>' + fmt(grandTotal) + '</span></div>' : "") +
    '</div><div class="aur-ticket-perf"></div>' +
    '<div class="aur-ticket-bottom"><div><div class="aur-ticket-label">Confirmation code</div><div class="aur-ticket-code">' + esc(b.code) + '</div></div>' +
    '<span class="aur-status ' + b.status + '">' + b.status + '</span></div></div>';
}

function billActionsHTML(id) {
  return '<div style="display:flex;gap:10px;margin-top:16px;">' +
    '<button class="aur-btn small ghost" style="flex:1;" onclick="downloadBill(\'' + id + '\')">PDF</button>' +
    '<button class="aur-btn small ghost" style="flex:1;" onclick="shareBillWhatsApp(\'' + id + '\')">WhatsApp</button>' +
    '<button class="aur-btn small ghost" style="flex:1;" onclick="emailBill(\'' + id + '\')">Email</button>' +
    '</div>';
}

function billModalHTML() {
  var b = APP.bookings.find(function (x) { return x.id === APP.billModal; });
  if (!b) return "";
  var termsHTML = '<div style="margin-top:18px;"><div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--gold-bright);margin-bottom:8px;">Terms &amp; Conditions</div>' +
    '<div class="aur-terms-box" style="max-height:120px;">' + (APP.settings.terms || DEFAULT_TERMS).map(function (t, i) { return (i + 1) + ". " + t; }).join("<br><br>") + '</div></div>';
  var adjustments = b.adjustments || [];
  var adjustRows = adjustments.map(function (a) {
    return '<div class="aur-summary-line" style="padding:3px 0;"><span>' + esc(a.label) + '</span><span style="display:flex;align-items:center;gap:8px;">' +
      (a.amount >= 0 ? "+" : "") + fmt(a.amount) +
      '<button class="aur-close" style="position:static;width:18px;height:18px;font-size:14px;" onclick="removeAdjustment(\'' + b.id + '\',\'' + a.id + '\')">×</button></span></div>';
  }).join("");
  var editHTML = '<div style="margin-top:18px;"><div style="font-size:11px;letter-spacing:0.06em;text-transform:uppercase;color:var(--gold-bright);margin-bottom:8px;">Adjustments (discounts / extra charges)</div>' +
    adjustRows +
    '<div style="display:flex;gap:8px;margin-top:8px;">' +
    '<input id="adj-label" placeholder="e.g. Loyalty discount" style="flex:1.4;padding:9px 10px;border-radius:5px;border:1px solid var(--line);background:var(--ink);color:var(--ivory);font-size:12.5px;">' +
    '<input id="adj-amount" type="number" step="1" placeholder="₹ amount (use − for discount)" style="flex:1;padding:9px 10px;border-radius:5px;border:1px solid var(--line);background:var(--ink);color:var(--ivory);font-size:12.5px;">' +
    '<button class="aur-btn small" onclick="addAdjustment(\'' + b.id + '\')">Add</button>' +
    '</div></div>';
  return '<div class="aur-overlay" onclick="if(event.target===this)closeBill()"><div class="aur-modal" style="max-width:460px;">' +
    '<button class="aur-close" onclick="closeBill()">×</button>' +
    '<div class="aur-hero-eyebrow" style="margin-bottom:14px;">Invoice</div>' +
    ticketCardHTML(b) + editHTML + termsHTML + billActionsHTML(b.id) +
    '</div></div>';
}
async function addAdjustment(bookingId) {
  var label = document.getElementById("adj-label").value.trim();
  var amount = Number(document.getElementById("adj-amount").value);
  if (!label) { showToast("Enter a label for this adjustment"); return; }
  if (isNaN(amount) || amount === 0) { showToast("Enter a non-zero amount"); return; }
  var b = APP.bookings.find(function (x) { return x.id === bookingId; });
  if (!b) return;
  if (!b.adjustments) b.adjustments = [];
  b.adjustments.push({ id: "adj_" + Date.now(), label: label, amount: amount });
  var okAdj = await saveBookings();
  showToast(okAdj ? "Adjustment added" : "Added locally, but saving failed");
  render();
}
async function removeAdjustment(bookingId, adjId) {
  var b = APP.bookings.find(function (x) { return x.id === bookingId; });
  if (!b) return;
  b.adjustments = (b.adjustments || []).filter(function (a) { return a.id !== adjId; });
  var okRem = await saveBookings();
  showToast(okRem ? "Adjustment removed" : "Removed locally, but saving failed");
  render();
}

function adminGateHTML() {
  var logoImg = APP.settings.logo ? '<img src="' + APP.settings.logo + '" alt="logo" style="height:52px;width:52px;object-fit:cover;border-radius:8px;margin-bottom:14px;">' : "";
  return '<div class="aur-gate"><div class="aur-plate">' +
    logoImg +
    '<h3>' + esc(APP.settings.siteName.toUpperCase()) + '</h3><p>Sign in with your staff username and password.</p>' +
    '<input id="login-username" placeholder="USERNAME" style="margin-bottom:10px;" onkeydown="if(event.key===\'Enter\')document.getElementById(\'login-password\').focus()">' +
    '<input id="login-password" type="password" placeholder="PASSWORD" onkeydown="if(event.key===\'Enter\')tryAdminLogin()">' +
    (APP.passError ? '<div style="color:#8a3b34;font-size:12px;margin-bottom:10px;">Incorrect username or password.</div>' : "") +
    '<button class="aur-btn" style="width:100%;" onclick="tryAdminLogin()">Sign in</button>' +
    '</div></div>';
}

function adminDashboardHTML() {
  var revenue = APP.bookings.filter(function (b) { return b.status !== "cancelled"; }).reduce(function (s, b) {
    var adjSum = (b.adjustments || []).reduce(function (a, x) { return a + x.amount; }, 0);
    return s + b.total + (b.lateFee || 0) + adjSum;
  }, 0);
  var activeCount = APP.bookings.filter(function (b) { return b.status === "active" || b.status === "confirmed"; }).length;
  var availableCount = APP.fleet.filter(function (c) { return c.available; }).length;

  var statuses = ["pending", "confirmed", "active", "completed", "cancelled"];
  var bookingsRows = APP.bookings.map(function (b) {
    var opts = statuses.map(function (s) { return '<option value="' + s + '" ' + (b.status === s ? "selected" : "") + '>' + s + '</option>'; }).join("");
    var hoBtns = '<div class="aur-hometa">';
    if (!b.handoverOut) hoBtns += '<button class="aur-btn small aur-hb" onclick="openHandover(\'' + b.id + '\',\'out\')">Check-out</button>';
    if (b.handoverOut && !b.handoverIn) hoBtns += '<button class="aur-btn small aur-hb ghost" onclick="openHandover(\'' + b.id + '\',\'in\')">Check-in</button>';
    if (b.handoverOut) hoBtns += '<button class="aur-btn small aur-hb ghost" onclick="openHandover(\'' + b.id + '\',\'view\')">View</button>';
    hoBtns += '</div>';
    return '<tr><td class="mono">' + esc(b.code) + '</td>' +
      '<td>' + esc(b.driver.name) + '<br><span style="color:var(--ivory-dim);font-size:12px;">' + esc(b.driver.email) + '</span></td>' +
      '<td>' + esc(b.carName) + '<br><span class="mono" style="color:var(--gold-bright);font-size:11.5px;">' + esc(b.vehicleNumber || "—") + '</span></td>' +
      '<td>' + esc(b.pickupDate) + ' ' + esc(b.pickupTime) + '<br><span style="color:var(--ivory-dim);font-size:11.5px;">→ ' + esc(b.dropDate) + ' ' + esc(b.dropTime) + '</span></td>' +
      '<td class="mono">' + fmt(b.total) + '</td>' +
      '<td><select onchange="updateStatus(\'' + b.id + '\', this.value)">' + opts + '</select></td>' +
      '<td>' + hoBtns + '</td>' +
      '<td><button class="aur-btn small aur-hb ghost" onclick="openBill(\'' + b.id + '\')">Bill</button></td></tr>';
  }).join("");

  var fleetRows = APP.fleet.map(function (c) {
    var thumb = c.photo
      ? '<img src="' + c.photo + '" style="width:44px;height:32px;object-fit:cover;border-radius:3px;vertical-align:middle;margin-right:10px;">'
      : '<span style="display:inline-block;width:44px;height:32px;line-height:32px;text-align:center;vertical-align:middle;margin-right:10px;border:1px solid var(--line);border-radius:3px;font-size:10px;color:var(--ivory-dim);">no photo</span>';
    return '<tr><td>' + thumb + esc(c.name) + '<br><span class="mono" style="color:var(--gold-bright);font-size:11.5px;">' + esc(c.vehicleNumber || "—") + '</span></td><td>' + esc(c.category) + '</td><td class="mono">' + fmt(c.pricePerDay) + '</td><td>' + c.seats + '</td>' +
      '<td><span class="aur-status ' + (c.available ? "confirmed" : "cancelled") + '" style="cursor:pointer;" onclick="toggleAvailable(\'' + c.id + '\')">' + (c.available ? "available" : "unavailable") + '</span></td>' +
      '<td style="display:flex;gap:8px;"><button class="aur-btn ghost small" onclick="openEditCar(\'' + c.id + '\')">Edit</button>' +
      '<button class="aur-btn danger small" onclick="deleteCar(\'' + c.id + '\')">Delete</button></td></tr>';
  }).join("");

  return '<section class="aur-section">' +
    '<div class="aur-section-head"><h2 class="disp">Operations</h2>' +
    '<div style="display:flex;align-items:center;gap:16px;">' +
    '<span style="color:var(--ivory-dim);font-size:13px;">Signed in as <strong style="color:var(--ivory);">' + esc(APP.currentUser.username) + '</strong> · ' + esc(APP.currentUser.role) + '</span>' +
    '<button class="aur-btn ghost small" onclick="adminSignOut()">Sign out</button></div></div>' +
    '<div class="aur-stats">' +
    '<div class="aur-stat"><div class="val mono">' + fmt(revenue) + '</div><div class="lbl">Total revenue</div></div>' +
    '<div class="aur-stat"><div class="val mono">' + APP.bookings.length + '</div><div class="lbl">Reservations</div></div>' +
    '<div class="aur-stat"><div class="val mono">' + activeCount + '</div><div class="lbl">Active / confirmed</div></div>' +
    '<div class="aur-stat"><div class="val mono">' + availableCount + '/' + APP.fleet.length + '</div><div class="lbl">Fleet available</div></div>' +
    '</div>' +
    '<div class="aur-section-head" style="margin-bottom:20px;"><h2 class="disp" style="font-size:24px;">Reservations</h2></div>' +
    (APP.bookings.length === 0
      ? '<div class="aur-empty">No reservations yet.</div>'
      : '<div style="overflow-x:auto;margin-bottom:60px;"><table class="aur-table"><thead><tr><th>Code</th><th>Guest</th><th>Vehicle</th><th>Dates</th><th>Total</th><th>Status</th><th>Handover</th><th>Invoice</th></tr></thead><tbody>' + bookingsRows + '</tbody></table></div>') +
    '<div class="aur-section-head"><h2 class="disp" style="font-size:24px;">Fleet</h2><button class="aur-btn small" onclick="openAddCar()">+ Add vehicle</button></div>' +
    '<div style="overflow-x:auto;margin-bottom:' + (APP.currentUser.role === "Admin" ? "60px" : "0") + ';"><table class="aur-table"><thead><tr><th>Name</th><th>Category</th><th>Price/day</th><th>Seats</th><th>Status</th><th></th></tr></thead><tbody>' + fleetRows + '</tbody></table></div>' +
    (APP.currentUser.role === "Admin" ? locationsManagementHTML() : "") +
    (APP.currentUser.role === "Admin" ? usersManagementHTML() : "") +
    (APP.currentUser.role === "Admin" ? addonsManagementHTML() : "") +
    (APP.currentUser.role === "Admin" ? pricingPolicyHTML() : "") +
    (APP.currentUser.role === "Admin" ? brandingManagementHTML() : "") +
    (APP.currentUser.role === "Admin" ? backupManagementHTML() : "") +
    '</section>';
}

function locationsManagementHTML() {
  var rows = APP.locations.map(function (l) {
    return '<div class="aur-addon" style="padding:10px 0;"><div class="aur-addon-title">' + esc(l) + '</div>' +
      '<button class="aur-btn danger small" onclick="deleteLocation(\'' + esc(l).replace(/'/g, "\\'") + '\')">Remove</button></div>';
  }).join("");
  return '<div class="aur-section-head"><h2 class="disp" style="font-size:24px;">Pick-up &amp; drop-off locations</h2>' +
    '<div style="display:flex;gap:10px;flex-wrap:wrap;">' +
    '<button class="aur-btn ghost small" onclick="addTamilNaduCities()">+ Add Tamil Nadu cities</button>' +
    '<button class="aur-btn ghost small" onclick="addAllIndiaCities()">+ Add all major Indian cities</button>' +
    '</div></div>' +
    '<div style="margin-bottom:16px;max-height:340px;overflow-y:auto;">' + rows + '</div>' +
    '<div style="display:flex;gap:12px;margin-bottom:60px;">' +
    '<input id="loc-new" placeholder="Add a custom location" style="flex:1;background:var(--ink);border:1px solid var(--line);color:var(--ivory);padding:10px 12px;border-radius:3px;font-family:\'Work Sans\';font-size:14px;" onkeydown="if(event.key===\'Enter\')addLocation()">' +
    '<button class="aur-btn small" onclick="addLocation()">Add</button>' +
    '</div>';
}

function usersManagementHTML() {
  var rows = APP.users.map(function (u) {
    var isSelf = APP.currentUser && APP.currentUser.id === u.id;
    return '<tr><td>' + esc(u.username) + (isSelf ? ' <span style="color:var(--gold-bright);font-size:11px;">(you)</span>' : '') + '</td>' +
      '<td><span class="aur-status ' + (u.role === "Admin" ? "confirmed" : "pending") + '">' + esc(u.role) + '</span></td>' +
      '<td>' + esc((u.createdAt || "").slice(0, 10)) + '</td>' +
      '<td style="display:flex;gap:8px;"><button class="aur-btn ghost small" onclick="openEditUser(\'' + u.id + '\')">Edit</button>' +
      '<button class="aur-btn danger small" onclick="deleteUser(\'' + u.id + '\')">Delete</button></td></tr>';
  }).join("");
  return '<div class="aur-section-head"><h2 class="disp" style="font-size:24px;">Staff accounts</h2><button class="aur-btn small" onclick="openAddUser()">+ Add user</button></div>' +
    '<div style="overflow-x:auto;margin-bottom:60px;"><table class="aur-table"><thead><tr><th>Username</th><th>Role</th><th>Added</th><th></th></tr></thead><tbody>' + rows + '</tbody></table></div>';
}

function userFormModalHTML() {
  var u = APP.editingUser || { username: "", password: "", role: "Staff" };
  return '<div class="aur-overlay" onclick="if(event.target===this)closeUserForm()"><div class="aur-modal" style="max-width:420px;">' +
    '<button class="aur-close" onclick="closeUserForm()">×</button>' +
    '<h3 class="disp" style="font-size:22px;margin-bottom:20px;">' + (APP.editingUser ? "Edit user" : "Add user") + '</h3>' +
    '<div class="aur-formfield" style="margin-bottom:14px;"><label>Username</label><input id="uf-username" value="' + esc(u.username) + '"></div>' +
    '<div class="aur-formfield" style="margin-bottom:14px;"><label>Password' + (APP.editingUser ? ' — leave blank to keep current' : '') + '</label><input id="uf-password" type="text" value="" placeholder="' + (APP.editingUser ? "Enter a new password, or leave blank" : "Enter password") + '"></div>' +
    '<div class="aur-formfield" style="margin-bottom:6px;"><label>Role</label><select id="uf-role">' +
    '<option ' + (u.role === "Admin" ? "selected" : "") + '>Admin</option>' +
    '<option ' + (u.role === "Staff" ? "selected" : "") + '>Staff</option>' +
    '</select></div>' +
    '<div style="font-size:12px;color:var(--ivory-dim);margin-bottom:18px;">Admin can manage staff accounts. Staff can manage bookings and the fleet.</div>' +
    '<button class="aur-btn" style="width:100%;" onclick="saveUserForm()">Save user</button>' +
    '</div></div>';
}

function bookingModalHTML() {
  var car = APP.bookingCar;
  var days = daysBetween(APP.tripInfo.pickupDate, APP.tripInfo.dropDate);
  var carTotal = car.pricePerDay * days;
  var step = APP.bookingStep;
  var steps = [1, 2, 3, 4].map(function (n) { return '<div class="aur-step ' + (n <= step ? "done" : "") + '"></div>'; }).join("");

  var body = "";
  if (step === 1) {
    body = '<h3 class="disp" style="font-size:26px;margin-bottom:6px;">' + esc(car.name) + '</h3>' +
      '<p style="color:var(--ivory-dim);font-size:14px;margin-bottom:22px;">' + esc(car.description) + '</p>' +
      '<div class="aur-summary-line"><span>Pick-up</span><span>' + esc(APP.tripInfo.pickupLocation) + ' · ' + esc(APP.tripInfo.pickupDate) + ' ' + esc(APP.tripInfo.pickupTime) + '</span></div>' +
      '<div class="aur-summary-line"><span>Drop-off</span><span>' + esc(APP.tripInfo.dropLocation) + ' · ' + esc(APP.tripInfo.dropDate) + ' ' + esc(APP.tripInfo.dropTime) + '</span></div>' +
      '<div class="aur-summary-line"><span>Duration</span><span>' + days + ' day' + (days !== 1 ? "s" : "") + '</span></div>' +
      '<div class="aur-summary-line total"><span>Vehicle subtotal</span><span>' + fmt(carTotal) + '</span></div>' +
      '<button class="aur-btn" style="margin-top:22px;width:100%;" onclick="bookingGoStep(2)">Continue</button>';
  } else if (step === 2) {
    var rows = (APP.settings.addons || DEFAULT_ADDONS).map(function (a) {
      var checked = APP.bookingAddons.indexOf(a.id) > -1 ? "checked" : "";
      return '<div class="aur-addon"><div class="aur-addon-l"><input type="checkbox" ' + checked + ' onchange="toggleAddon(\'' + a.id + '\', this.checked)">' +
        '<div><div class="aur-addon-title">' + esc(a.title) + '</div><div class="aur-addon-sub">' + esc(a.sub) + '</div></div></div>' +
        '<div class="aur-addon-price mono">+' + fmt(a.price) + '/day</div></div>';
    }).join("");
    body = '<h3 class="disp" style="font-size:22px;margin-bottom:18px;">Add to your trip</h3>' + rows +
      '<div style="display:flex;gap:12px;margin-top:22px;"><button class="aur-btn ghost" onclick="bookingGoStep(1)">Back</button>' +
      '<button class="aur-btn" style="flex:1;" onclick="bookingGoStep(3)">Continue</button></div>';
  } else if (step === 3) {
    var d = APP.driverTemp;
    body = '<h3 class="disp" style="font-size:22px;margin-bottom:18px;">Driver details</h3>' +
      '<div class="aur-formfield" style="margin-bottom:14px;"><label>Full name</label><input id="driver-name" value="' + esc(d.name) + '"></div>' +
      '<div class="aur-formfield" style="margin-bottom:14px;"><label>Email</label><input id="driver-email" type="email" value="' + esc(d.email) + '"></div>' +
      '<div class="aur-formfield" style="margin-bottom:14px;"><label>Phone</label><input id="driver-phone" value="' + esc(d.phone) + '"></div>' +
      '<div style="display:flex;gap:12px;margin-top:10px;"><button class="aur-btn ghost" onclick="bookingGoStep(2)">Back</button>' +
      '<button class="aur-btn" style="flex:1;" onclick="bookingGoStep(4)">Continue</button></div>';
  } else if (step === 4) {
    var addonLines = APP.bookingAddons.map(function (id) {
      var a = (APP.settings.addons || DEFAULT_ADDONS).find(function (x) { return x.id === id; });
      return '<div class="aur-summary-line"><span>' + esc(a.title) + '</span><span>' + fmt(a.price * days) + '</span></div>';
    }).join("");
    var addonTotal = APP.bookingAddons.reduce(function (sum, id) {
      var a = (APP.settings.addons || DEFAULT_ADDONS).find(function (x) { return x.id === id; });
      return sum + (a ? a.price : 0) * days;
    }, 0);
    body = '<h3 class="disp" style="font-size:22px;margin-bottom:18px;">Review &amp; confirm</h3>' +
      '<div class="aur-summary-line"><span>' + esc(car.name) + ' × ' + days + 'd</span><span>' + fmt(carTotal) + '</span></div>' +
      addonLines +
      '<div class="aur-summary-line total"><span>Total due at pickup</span><span>' + fmt(carTotal + addonTotal) + '</span></div>' +
      '<div class="aur-summary-line" style="color:var(--gold-bright);"><span>Refundable security deposit</span><span>' + fmt((APP.settings.depositAmount != null) ? APP.settings.depositAmount : 3000) + '</span></div>' +
      '<div style="font-size:11.5px;color:var(--ivory-dim);margin-top:-6px;margin-bottom:6px;">Collected at pickup, refunded after check-in subject to the terms below.</div>' +
      '<div class="aur-terms-box mono">' + (APP.settings.terms || DEFAULT_TERMS).map(function (t, i) { return (i + 1) + ". " + t; }).join("<br><br>") + '</div>' +
      '<label class="aur-terms-check"><input type="checkbox" ' + (APP.agreedToTerms ? "checked" : "") + ' onchange="toggleTerms(this.checked)"> I have read and agree to the Terms &amp; Conditions</label>' +
      '<div style="display:flex;gap:12px;margin-top:22px;"><button class="aur-btn ghost" onclick="bookingGoStep(3)">Back</button>' +
      '<button class="aur-btn" style="flex:1;" onclick="confirmBooking()">Confirm reservation</button></div>';
  }

  return '<div class="aur-overlay" onclick="if(event.target===this)closeBookingModal()"><div class="aur-modal">' +
    '<button class="aur-close" onclick="closeBookingModal()">×</button>' +
    '<div class="aur-stepnum mono">STEP ' + step + ' OF 4</div><div class="aur-steps">' + steps + '</div>' +
    body + '</div></div>';
}

function ticketModalHTML() {
  var b = APP.lastTicket;
  return '<div class="aur-overlay" onclick="if(event.target===this){APP.lastTicket=null;render();}"><div class="aur-modal" style="max-width:460px;">' +
    '<button class="aur-close" onclick="APP.lastTicket=null;render();">×</button>' +
    '<div class="aur-hero-eyebrow" style="margin-bottom:14px;">Reservation confirmed</div>' +
    ticketCardHTML(b) + billActionsHTML(b.id) +
    '<button class="aur-btn" style="width:100%;margin-top:16px;" onclick="APP.lastTicket=null;setView(\'mybookings\')">Done</button>' +
    '</div></div>';
}

function carFormModalHTML() {
  var car = APP.editingCar || { name: "", category: "Sedan", kind: "sedan", pricePerDay: 3000, seats: 4, transmission: "Manual", description: "" };
  var categories = ["Hatchback", "Sedan", "SUV", "MUV", "Electric", "Luxury"];
  var kinds = ["hatchback", "sedan", "suv", "suv_large", "muv", "convertible", "sports", "electric", "classic"];
  var kindLabels = { hatchback: "Hatchback", sedan: "Sedan", suv: "SUV (compact/mid)", suv_large: "SUV (full-size)", muv: "MUV / 7-seater", convertible: "Convertible", sports: "Sports", electric: "Electric", classic: "Classic" };
  var catOpts = categories.map(function (c) { return '<option ' + (car.category === c ? "selected" : "") + '>' + c + '</option>'; }).join("");
  var kindOpts = kinds.map(function (k) { return '<option value="' + k + '" ' + (car.kind === k ? "selected" : "") + '>' + kindLabels[k] + '</option>'; }).join("");

  return '<div class="aur-overlay" onclick="if(event.target===this)closeCarForm()"><div class="aur-modal">' +
    '<button class="aur-close" onclick="closeCarForm()">×</button>' +
    '<h3 class="disp" style="font-size:22px;margin-bottom:20px;">' + (APP.editingCar ? "Edit vehicle" : "Add vehicle") + '</h3>' +
    '<div class="aur-formfield" style="margin-bottom:16px;"><label>Vehicle photo</label><div id="cf-photo-area">' + renderCarPhotoAreaHTML() + '</div></div>' +
    '<div class="aur-row">' +
    '<div class="aur-formfield"><label>Name</label><input id="cf-name" value="' + esc(car.name) + '" placeholder="e.g. Hyundai Creta"></div>' +
    '<div class="aur-formfield"><label>Vehicle number</label><input id="cf-vehicle-number" value="' + esc(car.vehicleNumber || "") + '" placeholder="e.g. KA 01 AB 1234" class="mono"></div>' +
    '</div>' +
    '<div class="aur-row">' +
    '<div class="aur-formfield"><label>Category</label><select id="cf-category">' + catOpts + '</select></div>' +
    '<div class="aur-formfield"><label>Body style (fallback icon)</label><select id="cf-kind">' + kindOpts + '</select></div>' +
    '</div><div class="aur-row">' +
    '<div class="aur-formfield"><label>Price / day (₹)</label><input id="cf-price" type="number" value="' + car.pricePerDay + '"></div>' +
    '<div class="aur-formfield"><label>Seats</label><input id="cf-seats" type="number" value="' + car.seats + '"></div>' +
    '</div><div class="aur-row">' +
    '<div class="aur-formfield"><label>Transmission</label><select id="cf-transmission"><option ' + (car.transmission === "Automatic" ? "selected" : "") + '>Automatic</option><option ' + (car.transmission === "Manual" ? "selected" : "") + '>Manual</option></select></div>' +
    '<div class="aur-formfield"></div>' +
    '</div>' +
    '<div class="aur-formfield" style="margin-bottom:16px;"><label>Description</label><input id="cf-description" value="' + esc(car.description) + '"></div>' +
    '<button class="aur-btn" style="width:100%;" onclick="saveCarForm()">Save vehicle</button>' +
    '</div></div>';
}

function handoverSummaryHTML(h) {
  var html = '<div class="aur-kyc-view"><div class="aur-kyc-view-block">' +
    '<div class="lbl">Odometer</div><div class="val mono">' + esc(h.odometerKm) + ' km</div>' +
    '<div class="lbl" style="margin-top:10px;">Fuel level</div><div class="val">' + esc(h.fuelLevel) + '</div>';
  if (h.licenseNumber) html += '<div class="lbl" style="margin-top:10px;">Driving licence</div><div class="val mono">' + esc(h.licenseNumber) + '</div>';
  if (h.aadharNumber) html += '<div class="lbl" style="margin-top:10px;">Aadhar</div><div class="val mono">' + esc(h.aadharNumber) + '</div>';
  html += '</div><div class="aur-kyc-view-block">';
  if (h.phone) html += '<div class="lbl">Phone</div><div class="val">' + esc(h.phone) + '</div>';
  if (h.email) html += '<div class="lbl" style="margin-top:10px;">Email</div><div class="val">' + esc(h.email) + '</div>';
  if (h.address) html += '<div class="lbl" style="margin-top:10px;">Address</div><div class="val">' + esc(h.address) + '</div>';
  html += '</div></div>';
  if (h.conditionNotes) html += '<div style="font-size:13.5px;color:var(--ivory-dim);margin-bottom:12px;">"' + esc(h.conditionNotes) + '"</div>';
  var thumbs = "";
  if (h.licensePhoto) thumbs += '<div class="aur-doc-thumb"><img src="' + h.licensePhoto + '"></div>';
  if (h.aadharPhoto) thumbs += '<div class="aur-doc-thumb"><img src="' + h.aadharPhoto + '"></div>';
  (h.photos || []).forEach(function (p) { thumbs += '<div class="aur-thumb"><img src="' + p + '"></div>'; });
  if (thumbs) html += '<div class="aur-thumbs" style="margin-bottom:8px;">' + thumbs + '</div>';
  return html;
}

function computeLateFee(booking, retDate, retTime) {
  var bookedDrop = new Date(booking.dropDate + "T" + (booking.dropTime || "23:59"));
  var actualReturn = new Date(retDate + "T" + (retTime || "23:59"));
  var lateMs = actualReturn - bookedDrop;
  var lateDays = lateMs > 0 ? Math.ceil(lateMs / 86400000) : 0;
  var rate = (APP.settings.lateFeePerDay != null) ? APP.settings.lateFeePerDay : 500;
  return { lateDays: lateDays, lateFee: lateDays * rate };
}
function lateFeePreviewHTML(booking, retDate, retTime) {
  var r = computeLateFee(booking, retDate, retTime);
  if (r.lateDays === 0) return '<div style="color:var(--success);font-size:13px;font-weight:600;">On time — no late fee</div>';
  return '<div style="color:var(--danger);font-size:13px;font-weight:600;">' + r.lateDays + ' day' + (r.lateDays > 1 ? "s" : "") + ' late — ' + fmt(r.lateFee) + ' late fee will be applied</div>';
}
function updateLateFeePreview() {
  var el = document.getElementById("late-fee-preview");
  if (!el || !APP.handoverModal) return;
  var retDate = document.getElementById("ho-return-date").value;
  var retTime = document.getElementById("ho-return-time").value;
  el.innerHTML = lateFeePreviewHTML(APP.handoverModal.booking, retDate, retTime);
}

function handoverModalHTML() {
  var booking = APP.handoverModal.booking;
  var mode = APP.handoverModal.mode;

  if (mode === "view") {
    var out = booking.handoverOut, inn = booking.handoverIn;
    var distHTML = "";
    if (out && inn && out.odometerKm) {
      var dist = Math.max(0, Number(inn.odometerKm) - Number(out.odometerKm));
      distHTML = '<div class="aur-summary-line total"><span>Distance driven</span><span class="aur-diff up">' + dist + ' km</span></div>';
    }
    return '<div class="aur-overlay" onclick="if(event.target===this)closeHandover()"><div class="aur-modal">' +
      '<button class="aur-close" onclick="closeHandover()">×</button>' +
      '<h3 class="disp" style="font-size:22px;margin-bottom:6px;">' + esc(booking.carName) + '</h3>' +
      '<div style="color:var(--ivory-dim);font-size:13px;margin-bottom:20px;">' + esc(booking.code) + ' · <span class="mono">' + esc(booking.vehicleNumber || "—") + '</span></div>' +
      '<div class="aur-kyc-title">Check-out</div>' +
      (out ? handoverSummaryHTML(out) : '<div style="color:var(--ivory-dim);font-size:13px;">Not recorded yet.</div>') +
      '<div class="aur-kyc-title">Check-in</div>' +
      (inn ? handoverSummaryHTML(inn) + distHTML : '<div style="color:var(--ivory-dim);font-size:13px;">Vehicle not yet returned.</div>') +
      '</div></div>';
  }

  var existing = mode === "out" ? booking.handoverOut : booking.handoverIn;
  var odometer = existing ? existing.odometerKm : "";
  var fuel = existing ? existing.fuelLevel : "Full";
  var notes = existing ? existing.conditionNotes : "";
  var fuelOpts = ["Full", "3/4", "Half", "1/4", "Empty"].map(function (f) { return '<option ' + (fuel === f ? "selected" : "") + '>' + f + '</option>'; }).join("");
  var priorNote = "";
  if (mode === "in" && booking.handoverOut && booking.handoverOut.odometerKm) {
    priorNote = '<div style="color:var(--gold-bright);font-size:12.5px;margin-bottom:18px;">Out reading was ' + esc(booking.handoverOut.odometerKm) + ' km</div>';
  }

  var returnDateBlock = "";
  if (mode === "in") {
    var existingReturn = booking.handoverIn && booking.handoverIn.recordedAt ? new Date(booking.handoverIn.recordedAt) : null;
    var retDate = existingReturn ? (existingReturn.getFullYear() + "-" + pad2(existingReturn.getMonth() + 1) + "-" + pad2(existingReturn.getDate())) : todayStr();
    var retTime = existingReturn ? (pad2(existingReturn.getHours()) + ":" + pad2(existingReturn.getMinutes())) : nowTimeStr();
    returnDateBlock = '<div class="aur-kyc-title">Actual return</div>' +
      '<div class="aur-row">' +
      '<div class="aur-formfield"><label>Return date</label><input id="ho-return-date" type="date" value="' + retDate + '" onchange="updateLateFeePreview()"></div>' +
      '<div class="aur-formfield"><label>Return time</label><input id="ho-return-time" type="time" value="' + retTime + '" onchange="updateLateFeePreview()"></div>' +
      '</div>' +
      '<div style="font-size:12px;color:var(--ivory-dim);margin-bottom:16px;">Booked drop-off was ' + esc(booking.dropDate) + ' ' + esc(booking.dropTime || "") + '</div>' +
      '<div id="late-fee-preview" style="margin-bottom:18px;">' + lateFeePreviewHTML(booking, retDate, retTime) + '</div>';
  }

  var kycBlock = "";
  if (mode === "out") {
    var lic = existing ? existing.licenseNumber : "";
    var aad = existing ? existing.aadharNumber : "";
    var phone = existing ? existing.phone : (booking.driver.phone || "");
    var email = existing ? existing.email : (booking.driver.email || "");
    var address = existing ? existing.address : "";
    kycBlock = '<div class="aur-kyc-title">Customer identity</div>' +
      '<div class="aur-row">' +
      '<div class="aur-formfield"><label>Driving licence number</label><input id="ho-license-number" value="' + esc(lic) + '"></div>' +
      '<div class="aur-formfield"><label>Aadhar number</label><input id="ho-aadhar-number" value="' + esc(aad) + '" placeholder="XXXX XXXX XXXX"></div>' +
      '</div><div class="aur-row">' +
      '<div class="aur-formfield"><label>Driving licence scan</label><div id="doc-area-license">' + renderDocAreaHTML.call(null, "license") + '</div></div>' +
      '<div class="aur-formfield"><label>Aadhar card scan</label><div id="doc-area-aadhar">' + renderDocAreaHTML.call(null, "aadhar") + '</div></div>' +
      '</div>' +
      '<div class="aur-kyc-title">Contact details</div>' +
      '<div class="aur-row">' +
      '<div class="aur-formfield"><label>Phone</label><input id="ho-phone" value="' + esc(phone) + '"></div>' +
      '<div class="aur-formfield"><label>Email</label><input id="ho-email" value="' + esc(email) + '"></div>' +
      '</div>' +
      '<div class="aur-formfield" style="margin-bottom:6px;"><label>Address</label><input id="ho-address" value="' + esc(address) + '" placeholder="Street, city, state, PIN"></div>';
  }

  return '<div class="aur-overlay" onclick="if(event.target===this)closeHandover()"><div class="aur-modal">' +
    '<button class="aur-close" onclick="closeHandover()">×</button>' +
    '<h3 class="disp" style="font-size:22px;margin-bottom:4px;">' + (mode === "out" ? "Vehicle check-out" : "Vehicle check-in") + '</h3>' +
    '<div style="color:var(--ivory-dim);font-size:13px;margin-bottom:6px;">' + esc(booking.carName) + ' · <span class="mono">' + esc(booking.vehicleNumber || "—") + '</span> · ' + esc(booking.code) + ' · ' + esc(booking.driver.name) + '</div>' +
    priorNote +
    returnDateBlock +
    '<div class="aur-kyc-title" style="margin-top:18px;">Vehicle condition</div>' +
    '<div class="aur-row">' +
    '<div class="aur-formfield"><label>Odometer (km)</label><input id="ho-odometer" type="number" value="' + esc(odometer) + '"></div>' +
    '<div class="aur-formfield"><label>Fuel level</label><select id="ho-fuel">' + fuelOpts + '</select></div>' +
    '</div>' +
    '<div class="aur-formfield" style="margin-bottom:14px;"><label>Condition notes (scratches, dents, interior)</label><input id="ho-notes" value="' + esc(notes) + '" placeholder="e.g. minor scuff on rear bumper"></div>' +
    '<div class="aur-formfield" style="margin-bottom:6px;"><label>Condition photos</label></div>' +
    '<div id="condition-photo-area">' + renderPhotoAreaHTML() + '</div>' +
    kycBlock +
    '<button class="aur-btn" style="width:100%;margin-top:22px;" onclick="saveHandover()">' + (mode === "out" ? "Save check-out record" : "Save check-in record") + '</button>' +
    '</div></div>';
}

document.addEventListener("click", function () { closeCalendar(); });

init();
