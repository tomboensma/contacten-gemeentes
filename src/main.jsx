import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Building2, Users, UserRound, Baby, Search, Phone, Smartphone,
  Mail, StickyNote, Pencil, ChevronRight, ArrowLeft
} from 'lucide-react';
import './styles.css';

const data = {
  gemeenten: [
    { id: 1, naam: 'Almelo', zorgregio: 'Samen14' },
    { id: 2, naam: 'Alphen aan den Rijn', zorgregio: 'Holland Rijnland' },
    { id: 3, naam: 'Amersfoort', zorgregio: 'Regio Amersfoort' },
    { id: 4, naam: 'Apeldoorn', zorgregio: 'Midden-IJssel/Oost-Veluwe' },
    { id: 5, naam: 'Arnhem', zorgregio: 'Centraal Gelderland' }
  ],
  contactpersonen: [
    {
      id: 1,
      gemeenteId: 1,
      naam: 'Jan Jansen',
      functie: 'Jeugdconsulent',
      mobiel: '06-12345678',
      vast: '0546-123456',
      email: 'jan.jansen@almelo.nl',
      opmerkingen: 'Werkt ma-do',
      moeders: [1]
    },
    {
      id: 2,
      gemeenteId: 1,
      naam: 'Harry Nak',
      functie: 'Contractmanager',
      mobiel: '0612457896',
      vast: '',
      email: '',
      opmerkingen: 'di-do',
      moeders: [1, 2]
    },
    {
      id: 3,
      gemeenteId: 1,
      naam: 'Nico de Groot',
      functie: 'Beleidsmedewerker',
      mobiel: '06-12365478',
      vast: '',
      email: '',
      opmerkingen: 'Alleen mailen',
      moeders: []
    },
    {
      id: 4,
      gemeenteId: 2,
      naam: 'Petra de Vries',
      functie: 'Gezinscoach',
      mobiel: '06-87654321',
      vast: '',
      email: 'p.devries@example.nl',
      opmerkingen: '',
      moeders: [2]
    }
  ],
  moeders: [
    { id: 1, naam: 'Familie Jansen', opmerkingen: 'Voorkeur telefonisch contact.', kinderen: [1, 2] },
    { id: 2, naam: 'Familie De Vries', opmerkingen: 'Eerst via contactpersoon afstemmen.', kinderen: [3] }
  ],
  kinderen: [
    { id: 1, naam: 'Lisa Jansen', moederId: 1, opmerkingen: 'Oudste dochter' },
    { id: 2, naam: 'Milan Jansen', moederId: 1, opmerkingen: 'Jongste zoon' },
    { id: 3, naam: 'Saar de Vries', moederId: 2, opmerkingen: '' }
  ]
};

function initials(name) {
  return name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase();
}

function App() {
  const [query, setQuery] = useState('');
  const [selectedGemeenteId, setSelectedGemeenteId] = useState(1);
  const [screen, setScreen] = useState({ type: 'gemeente', id: 1 });

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;

    return {
      gemeenten: data.gemeenten.filter(g =>
        [g.naam, g.zorgregio].some(v => v.toLowerCase().includes(q))
      ),
      contactpersonen: data.contactpersonen.filter(c =>
        [c.naam, c.functie, c.mobiel, c.vast, c.email, c.opmerkingen]
          .some(v => (v || '').toLowerCase().includes(q))
      ),
      moeders: data.moeders.filter(m =>
        [m.naam, m.opmerkingen].some(v => (v || '').toLowerCase().includes(q))
      ),
      kinderen: data.kinderen.filter(k =>
        [k.naam, k.opmerkingen].some(v => (v || '').toLowerCase().includes(q))
      )
    };
  }, [query]);

  function openGemeente(id) {
    setSelectedGemeenteId(id);
    setScreen({ type: 'gemeente', id });
    setQuery('');
  }

  function openContact(id) {
    setScreen({ type: 'contact', id });
    setQuery('');
  }

  function openMoeder(id) {
    setScreen({ type: 'moeder', id });
    setQuery('');
  }

  function openKind(id) {
    setScreen({ type: 'kind', id });
    setQuery('');
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon"><Users size={28} /></div>
          <div>
            <h1>Contacten Gemeentes</h1>
            <p>Gemeente centraal</p>
          </div>
        </div>

        <div className="searchBox">
          <Search size={19} />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Zoek gemeente, naam, telefoon..."
          />
        </div>

        <nav className="tabs">
          <button className="tab active"><Building2 size={18} /> Gemeenten</button>
          <button className="tab"><UserRound size={18} /> Contactpersonen</button>
          <button className="tab"><Users size={18} /> Moeders</button>
          <button className="tab"><Baby size={18} /> Kinderen</button>
        </nav>

        <section className="sideSection">
          <h2>Gemeenten</h2>
          <div className="municipalities">
            {data.gemeenten
              .filter(g => !query || g.naam.toLowerCase().includes(query.toLowerCase()))
              .map(g => {
                const count = data.contactpersonen.filter(c => c.gemeenteId === g.id).length;
                return (
                  <button
                    key={g.id}
                    className={`municipality ${g.id === selectedGemeenteId ? 'selected' : ''}`}
                    onClick={() => openGemeente(g.id)}
                  >
                    <div className="circle"><Building2 size={19} /></div>
                    <div>
                      <strong>{g.naam}</strong>
                      <span>{count} contactpersonen</span>
                    </div>
                    <ChevronRight size={18} />
                  </button>
                );
              })}
          </div>
        </section>
      </aside>

      <main className="main">
        {query ? (
          <SearchScreen
            query={query}
            results={searchResults}
            openGemeente={openGemeente}
            openContact={openContact}
            openMoeder={openMoeder}
            openKind={openKind}
          />
        ) : (
          <>
            {screen.type === 'gemeente' && (
              <GemeenteScreen
                gemeente={data.gemeenten.find(g => g.id === screen.id)}
                contacts={data.contactpersonen.filter(c => c.gemeenteId === screen.id)}
                openContact={openContact}
              />
            )}
            {screen.type === 'contact' && (
              <ContactScreen
                contact={data.contactpersonen.find(c => c.id === screen.id)}
                gemeente={data.gemeenten.find(g => g.id === data.contactpersonen.find(c => c.id === screen.id).gemeenteId)}
                moeders={data.moeders.filter(m => data.contactpersonen.find(c => c.id === screen.id).moeders.includes(m.id))}
                openMoeder={openMoeder}
                back={() => openGemeente(selectedGemeenteId)}
              />
            )}
            {screen.type === 'moeder' && (
              <MoederScreen
                moeder={data.moeders.find(m => m.id === screen.id)}
                contactpersonen={data.contactpersonen.filter(c => c.moeders.includes(screen.id))}
                kinderen={data.kinderen.filter(k => data.moeders.find(m => m.id === screen.id).kinderen.includes(k.id))}
                openContact={openContact}
                openKind={openKind}
                back={() => openGemeente(selectedGemeenteId)}
              />
            )}
            {screen.type === 'kind' && (
              <KindScreen
                kind={data.kinderen.find(k => k.id === screen.id)}
                moeder={data.moeders.find(m => m.id === data.kinderen.find(k => k.id === screen.id).moederId)}
                openMoeder={openMoeder}
                back={() => openGemeente(selectedGemeenteId)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}

function GemeenteScreen({ gemeente, contacts, openContact }) {
  return (
    <>
      <div className="hero">
        <div className="breadcrumb">Gemeenten › {gemeente.naam}</div>
        <div className="heroRow">
          <div className="heroIcon"><Building2 size={38} /></div>
          <div>
            <h2>{gemeente.naam}</h2>
            <p>Zorgregio: <strong>{gemeente.zorgregio}</strong></p>
          </div>
          <button className="outlineButton"><Pencil size={18} /> Bewerken</button>
        </div>
      </div>

      <div className="sectionHeader">
        <h3><UserRound size={21} /> Contactpersonen</h3>
        <button className="primaryButton">+ Contactpersoon toevoegen</button>
      </div>

      <div className="cards">
        {contacts.map(c => <ContactCard key={c.id} contact={c} onClick={() => openContact(c.id)} />)}
      </div>
    </>
  );
}

function ContactCard({ contact, onClick }) {
  return (
    <button className="contactCard" onClick={onClick}>
      <div className="avatar">{initials(contact.naam)}</div>
      <div className="contactName">
        <strong>{contact.naam}</strong>
        <span>{contact.functie}</span>
      </div>
      <Info icon={<Smartphone size={18} />} value={contact.mobiel || '—'} label="Mobiel" />
      <Info icon={<Phone size={18} />} value={contact.vast || '—'} label="Vast" />
      <Info icon={<StickyNote size={18} />} value={contact.opmerkingen || '—'} label="Opmerkingen" />
      <ChevronRight className="chevron" size={23} />
    </button>
  );
}

function Info({ icon, value, label }) {
  return (
    <div className="info">
      <div className="infoValue">{icon}<span>{value}</span></div>
      <span className="infoLabel">{label}</span>
    </div>
  );
}

function ContactScreen({ contact, gemeente, moeders, openMoeder, back }) {
  return (
    <>
      <button className="back" onClick={back}><ArrowLeft size={18} /> Terug</button>
      <div className="profile">
        <div className="avatar large">{initials(contact.naam)}</div>
        <div>
          <h2>{contact.naam}</h2>
          <p>{contact.functie}</p>
          <p className="purple">{gemeente.naam}</p>
        </div>
      </div>

      <div className="grid">
        <div className="panel">
          <h3>Contactgegevens</h3>
          <Row icon={<Smartphone />} label="Mobiel" value={contact.mobiel || '—'} />
          <Row icon={<Phone />} label="Vast" value={contact.vast || '—'} />
          <Row icon={<Mail />} label="E-mail" value={contact.email || '—'} />
          <Row icon={<StickyNote />} label="Opmerkingen" value={contact.opmerkingen || '—'} />
        </div>
        <div className="panel">
          <h3>Gekoppelde moeders</h3>
          <div className="chips">
            {moeders.length ? moeders.map(m => (
              <button key={m.id} onClick={() => openMoeder(m.id)}>{m.naam}</button>
            )) : <p className="muted">Geen gekoppelde moeders.</p>}
          </div>
        </div>
      </div>
    </>
  );
}

function MoederScreen({ moeder, contactpersonen, kinderen, openContact, openKind, back }) {
  return (
    <>
      <button className="back" onClick={back}><ArrowLeft size={18} /> Terug</button>
      <div className="profile">
        <div className="avatar large"><Users /></div>
        <div>
          <h2>{moeder.naam}</h2>
          <p>Moeder</p>
        </div>
      </div>
      <div className="grid">
        <div className="panel">
          <h3>Contactpersonen</h3>
          <div className="chips">
            {contactpersonen.map(c => <button key={c.id} onClick={() => openContact(c.id)}>{c.naam}</button>)}
          </div>
          <h3>Opmerkingen</h3>
          <p>{moeder.opmerkingen || '—'}</p>
        </div>
        <div className="panel">
          <h3>Kinderen</h3>
          <div className="chips">
            {kinderen.map(k => <button key={k.id} onClick={() => openKind(k.id)}>{k.naam}</button>)}
          </div>
        </div>
      </div>
    </>
  );
}

function KindScreen({ kind, moeder, openMoeder, back }) {
  return (
    <>
      <button className="back" onClick={back}><ArrowLeft size={18} /> Terug</button>
      <div className="panel">
        <h2>{kind.naam}</h2>
        <Row icon={<Users />} label="Moeder" value={moeder.naam} />
        <Row icon={<StickyNote />} label="Opmerkingen" value={kind.opmerkingen || '—'} />
        <button className="primaryButton" onClick={() => openMoeder(moeder.id)}>Open moeder</button>
      </div>
    </>
  );
}

function Row({ icon, label, value }) {
  return (
    <div className="row">
      <div className="rowIcon">{icon}</div>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

function SearchScreen({ query, results, openGemeente, openContact, openMoeder, openKind }) {
  return (
    <>
      <div className="hero">
        <div className="breadcrumb">Zoeken</div>
        <h2>Resultaten voor “{query}”</h2>
        <p>Zoekt in gemeenten, contactpersonen, moeders en kinderen.</p>
      </div>
      <div className="grid">
        <SearchPanel title="Gemeenten" items={results.gemeenten} onClick={openGemeente} />
        <SearchPanel title="Moeders" items={results.moeders} onClick={openMoeder} />
      </div>
      <h3 className="smallTitle">Contactpersonen</h3>
      <div className="cards">
        {results.contactpersonen.map(c => <ContactCard key={c.id} contact={c} onClick={() => openContact(c.id)} />)}
      </div>
      <h3 className="smallTitle">Kinderen</h3>
      <div className="chips">
        {results.kinderen.map(k => <button key={k.id} onClick={() => openKind(k.id)}>{k.naam}</button>)}
      </div>
    </>
  );
}

function SearchPanel({ title, items, onClick }) {
  return (
    <div className="panel">
      <h3>{title}</h3>
      <div className="chips">
        {items.length ? items.map(item => <button key={item.id} onClick={() => onClick(item.id)}>{item.naam}</button>) : <p className="muted">Geen resultaten.</p>}
      </div>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
