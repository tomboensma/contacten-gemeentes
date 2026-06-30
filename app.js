const data = {
  gemeenten: [
    { id: 1, naam: "Almelo", zorgregio: "Samen14" },
    { id: 2, naam: "Alphen aan den Rijn", zorgregio: "Holland Rijnland" },
    { id: 3, naam: "Amersfoort", zorgregio: "Regio Amersfoort" },
    { id: 4, naam: "Apeldoorn", zorgregio: "Midden-IJssel/Oost-Veluwe" },
    { id: 5, naam: "Arnhem", zorgregio: "Centraal Gelderland" }
  ],
  contactpersonen: [
    { id: 1, gemeenteId: 1, naam: "Jan Jansen", functie: "Jeugdconsulent", mobiel: "06-12345678", vast: "0546-123456", email: "jan.jansen@almelo.nl", opmerkingen: "Werkt ma-do", moeders: [1] },
    { id: 2, gemeenteId: 1, naam: "Harry Nak", functie: "Contractmanager", mobiel: "0612457896", vast: "", email: "", opmerkingen: "di-do", moeders: [1,2] },
    { id: 3, gemeenteId: 1, naam: "Nico de Groot", functie: "Beleidsmedewerker", mobiel: "06-12365478", vast: "", email: "", opmerkingen: "Alleen mailen", moeders: [] },
    { id: 4, gemeenteId: 2, naam: "Petra de Vries", functie: "Gezinscoach", mobiel: "06-87654321", vast: "", email: "p.devries@example.nl", opmerkingen: "", moeders: [2] }
  ],
  moeders: [
    { id: 1, naam: "Familie Jansen", opmerkingen: "Voorkeur telefonisch contact.", kinderen: [1,2] },
    { id: 2, naam: "Familie De Vries", opmerkingen: "Eerst via contactpersoon afstemmen.", kinderen: [3] }
  ],
  kinderen: [
    { id: 1, naam: "Lisa Jansen", moederId: 1, opmerkingen: "Oudste dochter" },
    { id: 2, naam: "Milan Jansen", moederId: 1, opmerkingen: "Jongste zoon" },
    { id: 3, naam: "Saar de Vries", moederId: 2, opmerkingen: "" }
  ]
};

let state = { query: "", selectedGemeenteId: 1, screen: "dashboard", id: null };

const app = document.getElementById("app");

function initials(name){ return name.split(" ").map(x=>x[0]).join("").slice(0,2).toUpperCase(); }
function gemeente(id){ return data.gemeenten.find(g=>g.id===id); }
function contact(id){ return data.contactpersonen.find(c=>c.id===id); }
function moeder(id){ return data.moeders.find(m=>m.id===id); }
function kind(id){ return data.kinderen.find(k=>k.id===id); }
function countContacts(gid){ return data.contactpersonen.filter(c=>c.gemeenteId===gid).length; }

function setScreen(screen,id=null){
  state.screen = screen; state.id = id; state.query = "";
  if(screen === "gemeente") state.selectedGemeenteId = id;
  render();
}

function setQuery(value){
  state.query = value;
  render();
}

function shell(content){
  const q = state.query.toLowerCase();
  const gemeenten = data.gemeenten.filter(g => !q || g.naam.toLowerCase().includes(q));
  return `
  <div class="app">
    <aside class="sidebar">
      <div class="brand">
        <div class="logo">👥</div>
        <div><h1>Contacten Gemeentes</h1><p>Gemeente centraal</p></div>
      </div>
      <div class="search">
        <span>🔍</span>
        <input value="${escapeHtml(state.query)}" oninput="setQuery(this.value)" placeholder="Zoek gemeente, naam, telefoon..." />
      </div>
      <nav class="nav">
        <button class="${state.screen==='dashboard'?'active':''}" onclick="setScreen('dashboard')">🏠 Dashboard</button>
        <button class="${state.screen==='gemeente'?'active':''}" onclick="setScreen('gemeente',${state.selectedGemeenteId})">🏛️ Gemeenten</button>
        <button class="${state.screen==='contacten'?'active':''}" onclick="setScreen('contacten')">👤 Contactpersonen</button>
        <button class="${state.screen==='moeders'?'active':''}" onclick="setScreen('moeders')">👩 Moeders</button>
        <button class="${state.screen==='kinderen'?'active':''}" onclick="setScreen('kinderen')">🧒 Kinderen</button>
      </nav>
      <section>
        <h2 class="side-title">Gemeenten</h2>
        <div class="gemeente-list">
          ${gemeenten.map(g => `
            <button class="gemeente-btn ${g.id===state.selectedGemeenteId?'active':''}" onclick="setScreen('gemeente',${g.id})">
              <div class="icon-round">🏛️</div>
              <div><strong>${g.naam}</strong><span>${countContacts(g.id)} contactpersonen</span></div>
              <span>›</span>
            </button>
          `).join("")}
        </div>
      </section>
    </aside>
    <main class="main">${content}</main>
  </div>`;
}

function dashboard(){
  return `
    <div class="hero">
      <div class="breadcrumb">Start</div>
      <div class="hero-row">
        <div class="hero-icon">👥</div>
        <div>
          <h2>Contacten Gemeentes</h2>
          <p>Zoek snel op gemeente, contactpersoon, moeder of kind.</p>
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><b>${data.gemeenten.length}</b><span>gemeenten in voorbeeld</span></div>
      <div class="stat"><b>${data.contactpersonen.length}</b><span>contactpersonen</span></div>
      <div class="stat"><b>${data.moeders.length}</b><span>moeders</span></div>
      <div class="stat"><b>${data.kinderen.length}</b><span>kinderen</span></div>
    </div>
    <div class="section-header"><h3>Gemeenten</h3></div>
    <div class="cards">
      ${data.gemeenten.map(g => `
        <button class="contact-card" onclick="setScreen('gemeente',${g.id})">
          <div class="avatar">🏛️</div>
          <div class="name"><strong>${g.naam}</strong><span>${g.zorgregio}</span></div>
          <div class="info"><div class="value"><span class="ico">👤</span><span>${countContacts(g.id)}</span></div><span class="label">Contactpersonen</span></div>
          <div class="info"><div class="value"><span class="ico">🌍</span><span>${g.zorgregio}</span></div><span class="label">Zorgregio</span></div>
          <div class="info"><div class="value"><span class="ico">📝</span><span>Open gemeente</span></div><span class="label">Details</span></div>
          <div class="chev">›</div>
        </button>
      `).join("")}
    </div>`;
}

function gemeenteScreen(id){
  const g = gemeente(id);
  const contacts = data.contactpersonen.filter(c=>c.gemeenteId===id);
  return `
    <div class="hero">
      <div class="breadcrumb">Gemeenten › ${g.naam}</div>
      <div class="hero-row">
        <div class="hero-icon">🏛️</div>
        <div><h2>${g.naam}</h2><p>Zorgregio: <strong>${g.zorgregio}</strong></p></div>
        <div class="actions"><button class="btn btn-outline">✏️ Bewerken</button></div>
      </div>
    </div>
    <div class="section-header">
      <h3>👤 Contactpersonen</h3>
      <button class="btn btn-primary">+ Contactpersoon toevoegen</button>
    </div>
    <div class="cards">
      ${contacts.length ? contacts.map(contactCard).join("") : `<div class="empty">Geen contactpersonen gevonden.</div>`}
    </div>`;
}

function contactCard(c){
  return `
    <button class="contact-card" onclick="setScreen('contact',${c.id})">
      <div class="avatar">${initials(c.naam)}</div>
      <div class="name"><strong>${c.naam}</strong><span>${c.functie || "Geen functie"}</span></div>
      <div class="info"><div class="value"><span class="ico">📱</span><span>${c.mobiel || "—"}</span></div><span class="label">Mobiel</span></div>
      <div class="info"><div class="value"><span class="ico">☎️</span><span>${c.vast || "—"}</span></div><span class="label">Vast</span></div>
      <div class="info"><div class="value"><span class="ico">📝</span><span>${c.opmerkingen || "—"}</span></div><span class="label">Opmerkingen</span></div>
      <div class="chev">›</div>
    </button>`;
}

function contactScreen(id){
  const c = contact(id);
  const g = gemeente(c.gemeenteId);
  const ms = data.moeders.filter(m => c.moeders.includes(m.id));
  return `
    <button class="back" onclick="setScreen('gemeente',${g.id})">← Terug naar ${g.naam}</button>
    <div class="profile">
      <div class="avatar large">${initials(c.naam)}</div>
      <div><h2>${c.naam}</h2><p>${c.functie || ""}</p><p class="purple">${g.naam}</p></div>
    </div>
    <div class="grid">
      <div class="panel">
        <h3>Contactgegevens</h3>
        ${row("📱","Mobiel",c.mobiel || "—")}
        ${row("☎️","Vast",c.vast || "—")}
        ${row("✉️","E-mail",c.email || "—")}
        ${row("📝","Opmerkingen",c.opmerkingen || "—")}
      </div>
      <div class="panel">
        <h3>Gekoppelde moeders</h3>
        <div class="chips">
          ${ms.length ? ms.map(m=>`<button onclick="setScreen('moeder',${m.id})">${m.naam}</button>`).join("") : `<p class="muted">Geen gekoppelde moeders.</p>`}
        </div>
      </div>
    </div>`;
}

function moederScreen(id){
  const m = moeder(id);
  const cs = data.contactpersonen.filter(c=>c.moeders.includes(id));
  const ks = data.kinderen.filter(k=>m.kinderen.includes(k.id));
  return `
    <button class="back" onclick="setScreen('dashboard')">← Terug</button>
    <div class="profile">
      <div class="avatar large">👩</div>
      <div><h2>${m.naam}</h2><p>Moeder</p></div>
    </div>
    <div class="grid">
      <div class="panel">
        <h3>Contactpersonen</h3>
        <div class="chips">${cs.map(c=>`<button onclick="setScreen('contact',${c.id})">${c.naam}</button>`).join("") || `<p class="muted">Geen contactpersonen.</p>`}</div>
        <h3 style="margin-top:24px">Opmerkingen</h3>
        <p>${m.opmerkingen || "—"}</p>
      </div>
      <div class="panel">
        <h3>Kinderen</h3>
        <div class="chips">${ks.map(k=>`<button onclick="setScreen('kind',${k.id})">${k.naam}</button>`).join("") || `<p class="muted">Geen kinderen.</p>`}</div>
      </div>
    </div>`;
}

function kindScreen(id){
  const k = kind(id);
  const m = moeder(k.moederId);
  return `
    <button class="back" onclick="setScreen('moeder',${m.id})">← Terug naar ${m.naam}</button>
    <div class="panel">
      <h2>${k.naam}</h2>
      ${row("👩","Moeder",m.naam)}
      ${row("📝","Opmerkingen",k.opmerkingen || "—")}
    </div>`;
}

function listScreen(type){
  if(type==="contacten") return `
    <div class="hero"><div class="breadcrumb">Contactpersonen</div><h2>Contactpersonen</h2><p>Alle voorbeeldcontactpersonen.</p></div>
    <div class="cards">${data.contactpersonen.map(contactCard).join("")}</div>`;
  if(type==="moeders") return `
    <div class="hero"><div class="breadcrumb">Moeders</div><h2>Moeders</h2><p>Alle gekoppelde moeders.</p></div>
    <div class="panel"><div class="chips">${data.moeders.map(m=>`<button onclick="setScreen('moeder',${m.id})">${m.naam}</button>`).join("")}</div></div>`;
  if(type==="kinderen") return `
    <div class="hero"><div class="breadcrumb">Kinderen</div><h2>Kinderen</h2><p>Alle gekoppelde kinderen.</p></div>
    <div class="panel"><div class="chips">${data.kinderen.map(k=>`<button onclick="setScreen('kind',${k.id})">${k.naam}</button>`).join("")}</div></div>`;
}

function searchScreen(){
  const q = state.query.toLowerCase();
  const gemeenten = data.gemeenten.filter(g=>[g.naam,g.zorgregio].some(v=>v.toLowerCase().includes(q)));
  const contacten = data.contactpersonen.filter(c=>[c.naam,c.functie,c.mobiel,c.vast,c.email,c.opmerkingen].some(v=>(v||"").toLowerCase().includes(q)));
  const moeders = data.moeders.filter(m=>[m.naam,m.opmerkingen].some(v=>(v||"").toLowerCase().includes(q)));
  const kinderen = data.kinderen.filter(k=>[k.naam,k.opmerkingen].some(v=>(v||"").toLowerCase().includes(q)));
  return `
    <div class="hero"><div class="breadcrumb">Zoeken</div><h2>Resultaten voor “${escapeHtml(state.query)}”</h2><p>Zoekt in gemeenten, contactpersonen, moeders en kinderen.</p></div>
    <div class="grid">
      <div class="panel"><h3>Gemeenten</h3><div class="chips">${gemeenten.map(g=>`<button onclick="setScreen('gemeente',${g.id})">${g.naam}</button>`).join("") || `<p class="muted">Geen resultaten.</p>`}</div></div>
      <div class="panel"><h3>Moeders</h3><div class="chips">${moeders.map(m=>`<button onclick="setScreen('moeder',${m.id})">${m.naam}</button>`).join("") || `<p class="muted">Geen resultaten.</p>`}</div></div>
    </div>
    <h3 class="section-title" style="margin:24px 0 14px">Contactpersonen</h3>
    <div class="cards">${contacten.map(contactCard).join("") || `<div class="empty">Geen contactpersonen gevonden.</div>`}</div>
    <h3 class="section-title" style="margin:24px 0 14px">Kinderen</h3>
    <div class="panel"><div class="chips">${kinderen.map(k=>`<button onclick="setScreen('kind',${k.id})">${k.naam}</button>`).join("") || `<p class="muted">Geen resultaten.</p>`}</div></div>`;
}

function row(icon,label,value){
  return `<div class="row"><div class="ico">${icon}</div><div><strong>${value}</strong><span>${label}</span></div></div>`;
}

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
}

function render(){
  let content = "";
  if(state.query) content = searchScreen();
  else if(state.screen==="dashboard") content = dashboard();
  else if(state.screen==="gemeente") content = gemeenteScreen(state.id || state.selectedGemeenteId);
  else if(state.screen==="contact") content = contactScreen(state.id);
  else if(state.screen==="moeder") content = moederScreen(state.id);
  else if(state.screen==="kind") content = kindScreen(state.id);
  else content = listScreen(state.screen);
  app.innerHTML = shell(content);
}

render();
