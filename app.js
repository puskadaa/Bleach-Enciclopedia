const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const app = $("#app");
const normalize = value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const esc = value => String(value ?? "").replace(/[&<>'"]/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[char]));
const unique = list => [...new Set(list.filter(Boolean))];
const charById = id => DB.characters.find(character => character.id === id);
const zanByOwner = id => DB.zanpakuto.filter(item => item.ownerId === id);
const orgByName = name => DB.organizations.find(org => normalize(org.name) === normalize(name));
const state = {
  characters: { q: "", race: "Todos", affiliation: "Todas" },
  organizations: { q: "", type: "Todos" },
  zanpakuto: { q: "", type: "Todos", status: "Todos" },
  arcs: { type: "Todos" },
  terms: { q: "", category: "Todas" }
};

const mangaMedia = character => character.imageManga || character.imageAnime;
const mediaClass = (character, mode) => mode === "manga" && !character.imageManga ? "manga-fx" : "";
const mediaLabel = (character, mode) => mode === "anime" ? "ANIME" : (character.imageManga ? `MANGÁ — ${character.mangaLabel || "arte original"}` : "MANGÁ — tratamento visual");
const bankaiCount = () => DB.zanpakuto.filter(z => !["Não revelada", "Não nomeada", "Não se aplica"].includes(z.bankaiName)).length;
const affiliationName = value => {
  if (value.includes("Gotei")) return "Gotei 13";
  if (value.includes("Wandenreich") || value.includes("Sternritter")) return "Wandenreich";
  if (value.includes("Espada")) return "Espada";
  if (value.includes("Visored")) return "Visored";
  if (value.includes("Divisão Zero")) return "Divisão Zero";
  if (value.includes("Loja Urahara")) return "Loja Urahara";
  if (value.includes("Karakura") || value.includes("Família") || value.includes("Clínica")) return "Karakura";
  if (value.includes("Clã")) return "Clã Shihōin";
  return value.split(/ [/—] /)[0].trim();
};

function sectionHead(kicker, title, text) {
  return `<div class="section-head reveal"><p class="eyebrow">${esc(kicker)}</p><h2>${esc(title)}</h2><p>${esc(text)}</p></div>`;
}

function renderHome() {
  const featured = ["ichigo", "rukia", "byakuya", "aizen", "yhwach", "kenpachi"].map(charById);
  return `
    <section class="hero" aria-labelledby="home-title">
      <div class="hero-kanji" aria-hidden="true">死神</div>
      <div class="hero-copy reveal">
        <p class="eyebrow">ENCICLOPÉDIA VISUAL — 2001/2026</p>
        <h1 id="home-title">BLE<span>A</span>CH</h1>
        <p class="hero-text">Shinigamis, Hollows, Quincy, Fullbringers, organizações, Shikai, Bankai, arcos e a assinatura visual de Tite Kubo em um banco de dados navegável.</p>
        <form class="global-search" id="globalSearch" role="search">
          <label class="sr-only" for="globalQ">Buscar na enciclopédia</label>
          <input id="globalQ" type="search" placeholder="Busque por Ichigo, Bankai, Espada..." autocomplete="off">
          <button type="submit">Buscar</button>
        </form>
        <div class="hero-actions" aria-label="Atalhos principais">
          <a class="btn" href="#/personagens">Dossiês</a>
          <a class="btn btn-ghost" href="#/bankai">Bankai</a>
          <a class="btn btn-ghost" href="#/organizacoes">Facções</a>
        </div>
      </div>
      <div class="hero-panel reveal" style="--i:2">
        <div class="panel-strip" aria-hidden="true">卍解　死神代行　護廷十三隊　星十字騎士団</div>
        <img src="${featured[0].imageAnime}" alt="Arte oficial de Ichigo Kurosaki no anime" loading="eager">
        <div class="panel-caption"><span>01</span><strong>Ichigo Kurosaki</strong><small>Híbrido de quatro linhagens</small></div>
      </div>
    </section>

    <section class="stats-band reveal" aria-label="Estatísticas da enciclopédia">
      <div><strong>${DB.characters.length}</strong><span>personagens</span></div>
      <div><strong>${DB.organizations.length}</strong><span>organizações</span></div>
      <div><strong>${DB.zanpakuto.length}</strong><span>Zanpakutō</span></div>
      <div><strong>${bankaiCount()}</strong><span>Bankai reveladas</span></div>
      <div><strong>${DB.terms.length}</strong><span>termos</span></div>
    </section>

    <section class="section split-section">
      <div class="reveal">
        <p class="eyebrow">O MUNDO</p>
        <h2 class="small-title">Quatro mundos em guerra</h2>
        <p>Bleach começa como caça a Hollows em Karakura, mas cada arco abre uma camada maior: a Soul Society, Hueco Mundo, o passado dos Visored, os Fullbringers e o império Quincy oculto. No centro, está sempre a mesma pergunta: quem decide o destino das almas?</p>
        <div class="link-list">
          <a href="#/guia">Entenda reiatsu, Kidō e raças</a>
          <a href="#/arcos">Siga a cronologia completa</a>
          <a href="#/autor">Conheça o estilo de Tite Kubo</a>
        </div>
      </div>
      <div class="quote-panel reveal" style="--i:2">
        <span class="quote-mark">“</span>
        <p>A espada é uma extensão da alma. Por isso, em Bleach, aprender um nome é tão importante quanto aprender a cortar.</p>
        <small>Síntese do sistema de Zanpakutō</small>
      </div>
    </section>

    <section class="section dark-section">
      ${sectionHead("GALERIA RÁPIDA", "Figuras decisivas", "Seis personagens que representam os principais eixos da obra: proteção, nobreza, traição, força, ciência e apocalipse.")}
      <div class="featured-row">
        ${featured.map((character, index) => `
          <a class="feature-card reveal" style="--i:${index}" href="#/personagem/${character.id}">
            <img src="${character.imageAnime}" alt="${esc(character.name)}" loading="lazy">
            <span>${String(index + 1).padStart(2, "0")}</span>
            <strong>${esc(character.name)}</strong>
            <small>${esc(character.role)}</small>
          </a>`).join("")}
      </div>
    </section>

    <section class="section split-section reverse">
      <div class="manga-note reveal">
        <span>ANIME / MANGÁ</span>
        <p>Nas fichas ilustradas, você pode alternar entre arte oficial do anime e capas ou ilustrações originais do mangá. Quando uma arte de mangá não está disponível localmente, o modo mangá aplica tratamento visual preto e branco à arte oficial.</p>
      </div>
      <div class="reveal" style="--i:2">
        <p class="eyebrow">BASE LOCAL</p>
        <h2 class="small-title">Pesquisável, responsiva e expansível</h2>
        <p>Todo o conteúdo está estruturado em um banco local JavaScript. As páginas possuem busca, filtros por raça, tipo de poder, organização e status da liberação — sem depender de servidor ou conexão com banco externo.</p>
      </div>
    </section>`;
}

function characterMatches(character) {
  const { q, race, affiliation } = state.characters;
  const haystack = normalize([character.name, character.jp, character.race, character.affiliation, character.role, character.goal, character.powers, character.origin, ...character.tags].join(" "));
  return (race === "Todos" || character.race === race) &&
    (affiliation === "Todas" || affiliationName(character.affiliation) === affiliation) &&
    (!q || haystack.includes(normalize(q)));
}

function characterCard(character, index) {
  return `
    <article class="dossier-card reveal" style="--i:${index % 12}" data-character-card="${character.id}">
      <a class="portrait" href="#/personagem/${character.id}" aria-label="Abrir ficha de ${esc(character.name)}">
        <span class="archive-label" data-media-label="${character.id}">ANIME</span>
        <img data-media-img="${character.id}" src="${character.imageAnime}" alt="${esc(character.name)}" loading="lazy">
        <span class="portrait-kanji" aria-hidden="true">${esc(character.jp)}</span>
      </a>
      <div class="dossier-copy">
        <div class="card-meta"><span>${String(index + 1).padStart(3, "0")}</span><span>${esc(character.race)}</span></div>
        <h3>${esc(character.name)}</h3>
        <p class="jp-line">${esc(character.jp)}</p>
        <p class="clamp">${esc(character.description)}</p>
        <dl class="mini-facts">
          <div><dt>Idade</dt><dd>${esc(character.age)}</dd></div>
          <div><dt>Origem</dt><dd>${esc(character.origin)}</dd></div>
        </dl>
        <div class="card-actions">
          <button type="button" class="media-btn is-active" data-media="anime" data-target="${character.id}">Anime</button>
          <button type="button" class="media-btn" data-media="manga" data-target="${character.id}">Mangá</button>
          <a href="#/personagem/${character.id}">Ficha</a>
        </div>
      </div>
    </article>`;
}

function renderCharacterGrid() {
  const list = DB.characters.filter(characterMatches);
  $("#characterGrid").innerHTML = list.map(characterCard).join("") || `<div class="empty-state"><strong>Nenhuma alma encontrada.</strong><p>Altere os filtros ou busque outro nome.</p></div>`;
  $("#resultCount").textContent = `${list.length} de ${DB.characters.length} fichas`;
  observeReveals();
}

function renderCharacters() {
  const races = ["Todos", ...unique(DB.characters.map(c => c.race))];
  const affiliations = ["Todas", ...unique(DB.characters.map(c => affiliationName(c.affiliation)))];
  return `
    <section class="section page-top">
      ${sectionHead("DOSSIÊS DE ALMAS", "Personagens", "Fichas com origem, idade, objetivo, poderes, diferenças entre anime e mangá, curiosidades e arte visual.")}
      <div class="toolbar reveal" role="search">
        <label><span>Buscar</span><input id="charQ" type="search" value="${esc(state.characters.q)}" placeholder="Nome, poder, origem..." autocomplete="off"></label>
        <label><span>Raça</span><select id="charRace">${races.map(item => `<option ${item === state.characters.race ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label>
        <label><span>Afiliação</span><select id="charAffiliation">${affiliations.map(item => `<option ${item === state.characters.affiliation ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label>
        <output id="resultCount" aria-live="polite"></output>
      </div>
      <div class="character-grid" id="characterGrid"></div>
    </section>`;
}

function renderCharacterDetail(id) {
  const character = charById(id);
  if (!character) return renderNotFound();
  const index = DB.characters.indexOf(character);
  const previous = DB.characters[(index - 1 + DB.characters.length) % DB.characters.length];
  const next = DB.characters[(index + 1) % DB.characters.length];
  const swords = zanByOwner(character.id);
  return `
    <section class="section profile-page">
      <nav class="breadcrumb reveal" aria-label="Navegação"><a href="#/personagens">Personagens</a><span>/</span><strong>${esc(character.name)}</strong></nav>
      <div class="profile-layout">
        <aside class="profile-media reveal" aria-label="Mídia do personagem">
          <div class="profile-frame">
            <span class="archive-label" data-media-label="${character.id}">ANIME</span>
            <img data-media-img="${character.id}" src="${character.imageAnime}" alt="${esc(character.name)} no anime" loading="eager">
          </div>
          <div class="media-tabs" role="group" aria-label="Alternar arte">
            <button class="is-active" type="button" data-media="anime" data-target="${character.id}">Anime</button>
            <button type="button" data-media="manga" data-target="${character.id}">Mangá</button>
          </div>
          <p class="media-note" data-media-note="${character.id}">${character.imageManga ? "Mangá disponível: " + esc(character.mangaLabel || "arte original") : "Sem arte de mangá local; o modo mangá usa filtro visual."}</p>
        </aside>
        <article class="profile-info reveal" style="--i:2">
          <p class="eyebrow">${esc(character.affiliation)}</p>
          <h2>${esc(character.name)}</h2>
          <p class="jp-name">${esc(character.jp)}</p>
          <p class="lead">${esc(character.description)}</p>
          <dl class="fact-grid">
            <div><dt>Raça</dt><dd>${esc(character.race)}</dd></div>
            <div><dt>Função</dt><dd>${esc(character.role)}</dd></div>
            <div><dt>Idade</dt><dd>${esc(character.age)}</dd></div>
            <div><dt>Origem</dt><dd>${esc(character.origin)}</dd></div>
            <div><dt>Aniversário</dt><dd>${esc(character.birthday)}</dd></div>
            <div><dt>Altura</dt><dd>${esc(character.height)}</dd></div>
            <div><dt>Voz japonesa</dt><dd>${esc(character.voice)}</dd></div>
          </dl>
        </article>
      </div>

      <div class="profile-columns">
        <article class="ink-panel reveal"><span>NO ANIME</span><p>${esc(character.anime)}</p></article>
        <article class="paper-panel reveal" style="--i:1"><span>NO MANGÁ</span><p>${esc(character.manga)}</p></article>
      </div>

      <div class="detail-grid">
        <section class="detail-block reveal"><h3>Objetivo</h3><p>${esc(character.goal)}</p></section>
        <section class="detail-block reveal" style="--i:1"><h3>Poderes</h3><p>${esc(character.powers)}</p></section>
        <section class="detail-block reveal" style="--i:2"><h3>Curiosidades</h3><ul>${character.trivia.map(item => `<li>${esc(item)}</li>`).join("")}</ul></section>
        <section class="detail-block reveal" style="--i:3"><h3>Zanpakutō ligada</h3>${swords.length ? swords.map(z => `<a class="related-link" href="#/shikai/${z.id}"><strong>${esc(z.name)}</strong><span>${esc(z.bankaiName)}</span></a>`).join("") : `<p>Sem Zanpakutō registrada nesta base.</p>`}</section>
      </div>

      <nav class="profile-nav reveal" aria-label="Personagens adjacentes">
        <a href="#/personagem/${previous.id}">← ${esc(previous.name)}</a>
        <a href="#/personagens">Índice</a>
        <a href="#/personagem/${next.id}">${esc(next.name)} →</a>
      </nav>
    </section>`;
}

function organizationCard(org, index) {
  return `
    <article class="org-card reveal" style="--i:${index % 10}">
      <div class="org-number">${String(index + 1).padStart(2, "0")}</div>
      <div class="org-main">
        <p class="jp-line">${esc(org.jp)}</p>
        <h3>${esc(org.name)}</h3>
        <p>${esc(org.description)}</p>
        <dl>
          <div><dt>Base</dt><dd>${esc(org.base)}</dd></div>
          <div><dt>Liderança</dt><dd>${esc(org.leader)}</dd></div>
          <div><dt>Objetivo</dt><dd>${esc(org.purpose)}</dd></div>
        </dl>
      </div>
      <details>
        <summary>Membros e curiosidades</summary>
        <p><strong>Membros:</strong> ${esc(org.members)}</p>
        <ul>${org.trivia.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
      </details>
    </article>`;
}

function renderOrganizationGrid() {
  const { q, type } = state.organizations;
  const list = DB.organizations.filter(org => {
    const haystack = normalize([org.name, org.jp, org.type, org.base, org.leader, org.purpose, org.members, org.description].join(" "));
    return (type === "Todos" || org.type === type) && (!q || haystack.includes(normalize(q)));
  });
  $("#orgGrid").innerHTML = list.map(organizationCard).join("") || `<div class="empty-state"><strong>Nenhuma organização encontrada.</strong></div>`;
  $("#orgCount").textContent = `${list.length} de ${DB.organizations.length} facções`;
  observeReveals();
}

function renderOrganizations() {
  const types = ["Todos", ...unique(DB.organizations.map(org => org.type))];
  return `
    <section class="section page-top">
      ${sectionHead("MAPA DE PODER", "Organizações", "Do Gotei 13 ao Wandenreich: quem governa, quem protege, quem esconde o mundo e quem quer destruí-lo.")}
      <div class="toolbar reveal" role="search">
        <label><span>Buscar</span><input id="orgQ" type="search" value="${esc(state.organizations.q)}" placeholder="Gotei, Espada, Quincy..." autocomplete="off"></label>
        <label><span>Tipo</span><select id="orgType">${types.map(item => `<option ${item === state.organizations.type ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label>
        <output id="orgCount" aria-live="polite"></output>
      </div>
      <div class="org-list" id="orgGrid"></div>
    </section>`;
}

function zanMatches(zan) {
  const { q, type, status } = state.zanpakuto;
  const haystack = normalize([zan.name, zan.jp, zan.owner, zan.type, zan.command, zan.shikaiAbility, zan.bankaiName, zan.bankaiAbility].join(" "));
  return (type === "Todos" || zan.type === type) &&
    (status === "Todos" || normalize(zan.bankaiStatus).includes(normalize(status))) &&
    (!q || haystack.includes(normalize(q)));
}

function zanpakutoCard(zan, index, mode = "shikai") {
  const owner = zan.ownerId ? charById(zan.ownerId) : null;
  const isBankai = mode === "bankai";
  return `
    <article class="blade-card reveal" style="--i:${index % 12}">
      <div class="blade-symbol" aria-hidden="true">${isBankai ? "卍" : "斬"}</div>
      ${owner ? `<img class="blade-owner" src="${owner.imageAnime}" alt="${esc(owner.name)}" loading="lazy">` : ""}
      <div class="blade-copy">
        <p class="eyebrow">${esc(zan.type)}</p>
        <h3>${isBankai ? esc(zan.bankaiName) : esc(zan.name)}</h3>
        <p class="jp-line">${esc(zan.jp)} — ${esc(zan.owner)}</p>
        <dl class="blade-facts">
          ${isBankai ? `<div><dt>Status</dt><dd>${esc(zan.bankaiStatus)}</dd></div>` : `<div><dt>Comando</dt><dd>${esc(zan.command)}</dd></div>`}
          <div><dt>${isBankai ? "Poder final" : "Poder"}</dt><dd>${isBankai ? esc(zan.bankaiAbility) : esc(zan.shikaiAbility)}</dd></div>
        </dl>
        <p>${isBankai ? esc(zan.bankaiDescription) : esc(zan.shikaiDescription)}</p>
        <details><summary>${isBankai ? "Ver Shikai de origem" : "Ver Bankai associada"}</summary><p>${isBankai ? `${esc(zan.name)}: ${esc(zan.shikaiAbility)}` : `${esc(zan.bankaiName)} (${esc(zan.bankaiStatus)}): ${esc(zan.bankaiAbility)}`}</p></details>
        <ul class="trivia-list">${zan.trivia.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
        ${owner ? `<a class="related-link" href="#/personagem/${owner.id}">Ficha de ${esc(owner.name)}</a>` : ""}
      </div>
    </article>`;
}

function renderZanGrid(mode) {
  const list = DB.zanpakuto.filter(zanMatches);
  const target = mode === "bankai" ? $("#bankaiGrid") : $("#shikaiGrid");
  const count = mode === "bankai" ? $("#bankaiCount") : $("#shikaiCount");
  const filtered = mode === "bankai" ? list.filter(z => z.bankaiName) : list;
  target.innerHTML = filtered.map((zan, index) => zanpakutoCard(zan, index, mode)).join("") || `<div class="empty-state"><strong>Nenhuma lâmina encontrada.</strong></div>`;
  count.textContent = `${filtered.length} de ${DB.zanpakuto.length} registros`;
  observeReveals();
}

function renderShikai(featuredId = "") {
  const types = ["Todos", ...unique(DB.zanpakuto.map(z => z.type))];
  return `
    <section class="section page-top">
      ${sectionHead("PRIMEIRA LIBERAÇÃO", "Shikai", "A primeira verdadeira conversa entre Shinigami e espada: nome, comando, forma e habilidade inicial.")}
      <div class="explain-strip reveal"><strong>Shikai</strong><span>Conhecer o nome da Zanpakutō libera sua primeira forma. O comando não é apenas frase de efeito: é um contrato entre usuário e espírito.</span></div>
      <div class="toolbar reveal" role="search">
        <label><span>Buscar</span><input id="zanQ" type="search" value="${esc(state.zanpakuto.q)}" placeholder="Nome, dono, elemento..." autocomplete="off"></label>
        <label><span>Tipo</span><select id="zanType">${types.map(item => `<option ${item === state.zanpakuto.type ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label>
        <output id="shikaiCount" aria-live="polite"></output>
      </div>
      <div class="blade-grid" id="shikaiGrid" data-featured="${esc(featuredId)}"></div>
    </section>`;
}

function renderBankai() {
  const types = ["Todos", ...unique(DB.zanpakuto.map(z => z.type))];
  const statuses = ["Todos", "Confirmada", "Nome verdadeiro revelado", "Revelada", "Não confirmada", "Nunca", "Sugerida", "Material complementar"];
  return `
    <section class="section page-top bankai-page">
      ${sectionHead("LIBERAÇÃO FINAL", "Bankai", "A manifestação completa de uma Zanpakutō — poder, identidade e risco concentrados em uma última forma.")}
      <div class="bankai-manifesto reveal"><span>卍解</span><p>Domínio total exige materializar e subjugar o espírito da espada. Algumas Bankai alteram o corpo, outras o clima, a percepção ou até o conceito de nome.</p></div>
      <div class="toolbar reveal" role="search">
        <label><span>Buscar</span><input id="zanQ" type="search" value="${esc(state.zanpakuto.q)}" placeholder="Bankai, dono, técnica..." autocomplete="off"></label>
        <label><span>Tipo</span><select id="zanType">${types.map(item => `<option ${item === state.zanpakuto.type ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label>
        <label><span>Status</span><select id="zanStatus">${statuses.map(item => `<option value="${esc(item)}" ${item === state.zanpakuto.status ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label>
        <output id="bankaiCount" aria-live="polite"></output>
      </div>
      <div class="blade-grid bankai-grid" id="bankaiGrid"></div>
    </section>`;
}

function renderArcs() {
  const types = ["Todos", "Mangá", "Anime"];
  const filter = state.arcs.type;
  const list = DB.arcs.filter(arc => filter === "Todos" || (filter === "Mangá" ? arc.period.includes("Mangá") : arc.period.startsWith("Anime")));
  return `
    <section class="section page-top">
      ${sectionHead("CRONOLOGIA", "Arcos", "A linha principal do mangá e os arcos originais do anime, ordenados para leitura ou maratona.")}
      <div class="toolbar reveal">
        <div class="segmented" role="group" aria-label="Filtrar arcos">${types.map(type => `<button type="button" class="${type === filter ? "is-active" : ""}" data-arc-filter="${type}">${type}</button>`).join("")}</div>
      </div>
      <div class="timeline">
        ${list.map((arc, index) => `
          <article class="timeline-item reveal" style="--i:${index % 10}">
            <span class="timeline-index">${String(index + 1).padStart(2, "0")}</span>
            <div><p class="eyebrow">${esc(arc.type)}</p><h3>${esc(arc.name)}</h3><p class="period">${esc(arc.period)}</p><p>${esc(arc.summary)}</p><details><summary>Por que importa</summary><p>${esc(arc.importance)}</p></details></div>
          </article>`).join("")}
      </div>
    </section>`;
}

function renderGuide() {
  const categories = ["Todas", ...unique(DB.terms.map(term => term.category))];
  return `
    <section class="section page-top">
      ${sectionHead("MANUAL DOS MUNDOS", "Guia de termos", "Os fundamentos para ler fichas, entender lutas e separar raças, técnicas, armas e liberações.")}
      <div class="guide-grid reveal">
        <article><span>01</span><h3>Alma</h3><p>Quase todo poder nasce da alma, da memória ou de um nome.</p></article>
        <article><span>02</span><h3>Contrato</h3><p>Shikai e Bankai dependem de diálogo com o espírito da espada.</p></article>
        <article><span>03</span><h3>Equilíbrio</h3><p>Purificar preserva o ciclo; destruir almas ameaça os mundos.</p></article>
        <article><span>04</span><h3>Identidade</h3><p>Em Bleach, aceitar origem e nome costuma ser a chave do poder.</p></article>
      </div>
      <div class="toolbar reveal" role="search">
        <label><span>Buscar termo</span><input id="termQ" type="search" value="${esc(state.terms.q)}" placeholder="Reiatsu, Hollow, Kidō..." autocomplete="off"></label>
        <label><span>Categoria</span><select id="termCategory">${categories.map(item => `<option ${item === state.terms.category ? "selected" : ""}>${esc(item)}</option>`).join("")}</select></label>
      </div>
      <div class="term-grid" id="termGrid"></div>
    </section>`;
}

function renderTermGrid() {
  const { q, category } = state.terms;
  const list = DB.terms.filter(term => (category === "Todas" || term.category === category) && (!q || normalize([term.name, term.jp, term.description].join(" ")).includes(normalize(q))));
  $("#termGrid").innerHTML = list.map((term, index) => `<article class="term-card reveal" style="--i:${index % 10}"><span>${esc(term.category)}</span><h3>${esc(term.name)}</h3><p class="jp-line">${esc(term.jp)}</p><p>${esc(term.description)}</p></article>`).join("") || `<div class="empty-state"><strong>Termo não encontrado.</strong></div>`;
  observeReveals();
}

function renderAuthor() {
  return `
    <section class="section page-top author-page">
      ${sectionHead("O AUTOR", DB.author.name, "O criador que transformou moda, música, poesia e negativo visual em uma linguagem shōnen.")}
      <div class="author-layout">
        <div class="author-mark reveal"><span>久保<br>帯人</span><small>TITE KUBO</small></div>
        <article class="paper-panel reveal" style="--i:2">
          <span>BIOGRAFIA</span>
          <p><strong>${esc(DB.author.born)}</strong></p>
          <p>${esc(DB.author.career)}</p>
        </article>
      </div>
      <div class="style-grid">
        ${DB.author.style.map((item, index) => `<article class="detail-block reveal" style="--i:${index}"><h3>Assinatura ${index + 1}</h3><p>${esc(item)}</p></article>`).join("")}
      </div>
      <section class="dark-section inline reveal">
        <h3>Curiosidades</h3>
        <ul>${DB.author.facts.map(item => `<li>${esc(item)}</li>`).join("")}</ul>
      </section>
    </section>`;
}

function renderSources() {
  return `
    <section class="section page-top">
      ${sectionHead("CRÉDITOS", "Fontes e material", "Projeto de fã sem fins lucrativos. As artes e personagens pertencem aos seus detentores de direitos.")}
      <div class="source-list">
        ${DB.sources.map((source, index) => `<a class="source-card reveal" style="--i:${index}" href="${esc(source.url)}" target="_blank" rel="noopener noreferrer"><span>${String(index + 1).padStart(2, "0")}</span><strong>${esc(source.name)}</strong><p>${esc(source.note)}</p></a>`).join("")}
      </div>
      <div class="paper-panel reveal"><span>AVISO</span><p>BLEACH © Tite Kubo / Shueisha / TV Tokyo / dentsu / Pierrot. Este site organiza informações com fins educacionais e de fã, sem reivindicar propriedade das imagens ou da obra.</p></div>
    </section>`;
}

function searchEverything(term) {
  const q = normalize(term);
  const hits = [];
  DB.characters.forEach(item => { if (normalize(Object.values(item).flat().join(" ")).includes(q)) hits.push({ type: "Personagem", title: item.name, text: item.description, href: `#/personagem/${item.id}` }); });
  DB.zanpakuto.forEach(item => { if (normalize(Object.values(item).join(" ")).includes(q)) hits.push({ type: "Zanpakutō", title: item.name, text: `${item.owner} — ${item.bankaiName}`, href: `#/shikai/${item.id}` }); });
  DB.organizations.forEach(item => { if (normalize(Object.values(item).flat().join(" ")).includes(q)) hits.push({ type: "Organização", title: item.name, text: item.description, href: "#/organizacoes" }); });
  DB.terms.forEach(item => { if (normalize(Object.values(item).join(" ")).includes(q)) hits.push({ type: "Termo", title: item.name, text: item.description, href: "#/guia" }); });
  DB.arcs.forEach(item => { if (normalize(Object.values(item).join(" ")).includes(q)) hits.push({ type: "Arco", title: item.name, text: item.summary, href: "#/arcos" }); });
  return hits;
}

function renderSearch(term) {
  const hits = searchEverything(term);
  return `
    <section class="section page-top">
      ${sectionHead("BUSCA GLOBAL", `Resultados para “${term}”`, `${hits.length} registros encontrados em personagens, armas, facções, termos e arcos.`)}
      <form class="global-search page-search reveal" id="globalSearch" role="search"><input id="globalQ" type="search" value="${esc(term)}" placeholder="Refinar busca..." autocomplete="off"><button type="submit">Buscar</button></form>
      <div class="search-results">${hits.map((hit, index) => `<a class="search-hit reveal" style="--i:${index % 10}" href="${hit.href}"><span>${esc(hit.type)}</span><strong>${esc(hit.title)}</strong><p>${esc(hit.text)}</p></a>`).join("") || `<div class="empty-state"><strong>Nada encontrado.</strong><p>Tente outro termo ou explore o índice de personagens.</p></div>`}</div>
    </section>`;
}

function renderNotFound() {
  return `<section class="section page-top not-found"><p class="eyebrow">404</p><h2>Alma fora do registro</h2><p>A página solicitada não existe nesta enciclopédia.</p><a class="btn" href="#/">Voltar ao início</a></section>`;
}

const routes = {
  "": renderHome,
  "personagens": renderCharacters,
  "personagem": renderCharacterDetail,
  "organizacoes": renderOrganizations,
  "shikai": renderShikai,
  "bankai": renderBankai,
  "arcos": renderArcs,
  "guia": renderGuide,
  "autor": renderAuthor,
  "fontes": renderSources,
  "busca": renderSearch
};

function bindCharacters() {
  const q = $("#charQ"), race = $("#charRace"), affiliation = $("#charAffiliation");
  if (!q) return;
  q.addEventListener("input", event => { state.characters.q = event.target.value; renderCharacterGrid(); });
  race.addEventListener("change", event => { state.characters.race = event.target.value; renderCharacterGrid(); });
  affiliation.addEventListener("change", event => { state.characters.affiliation = event.target.value; renderCharacterGrid(); });
  renderCharacterGrid();
}

function bindOrganizations() {
  const q = $("#orgQ"), type = $("#orgType");
  if (!q) return;
  q.addEventListener("input", event => { state.organizations.q = event.target.value; renderOrganizationGrid(); });
  type.addEventListener("change", event => { state.organizations.type = event.target.value; renderOrganizationGrid(); });
  renderOrganizationGrid();
}

function bindZanpakuto(mode) {
  const q = $("#zanQ"), type = $("#zanType"), status = $("#zanStatus");
  if (!q) return;
  q.addEventListener("input", event => { state.zanpakuto.q = event.target.value; renderZanGrid(mode); });
  type.addEventListener("change", event => { state.zanpakuto.type = event.target.value; renderZanGrid(mode); });
  if (status) status.addEventListener("change", event => { state.zanpakuto.status = event.target.value; renderZanGrid(mode); });
  renderZanGrid(mode);
  const featured = $("#shikaiGrid")?.dataset.featured;
  if (featured) {
    const card = $$(".blade-card").find(item => item.textContent.includes(DB.zanpakuto.find(z => z.id === featured)?.name || ""));
    if (card) card.classList.add("is-featured");
  }
}

function bindArcs() {
  $$("[data-arc-filter]").forEach(button => button.addEventListener("click", () => { state.arcs.type = button.dataset.arcFilter; renderRoute(false); }));
}

function bindTerms() {
  const q = $("#termQ"), category = $("#termCategory");
  if (!q) return;
  q.addEventListener("input", event => { state.terms.q = event.target.value; renderTermGrid(); });
  category.addEventListener("change", event => { state.terms.category = event.target.value; renderTermGrid(); });
  renderTermGrid();
}

function bindGlobalSearch() {
  $$("#globalSearch").forEach(form => form.addEventListener("submit", event => {
    event.preventDefault();
    const term = $("#globalQ", form).value.trim();
    if (term) location.hash = `#/busca/${encodeURIComponent(term)}`;
  }));
}

function switchMedia(button) {
  const character = charById(button.dataset.target);
  const mode = button.dataset.media;
  if (!character) return;
  const scope = button.closest("article, aside") || document;
  $$(`[data-media][data-target="${character.id}"]`, scope).forEach(item => item.classList.toggle("is-active", item === button));
  const image = $(`[data-media-img="${character.id}"]`, scope);
  const label = $(`[data-media-label="${character.id}"]`, scope);
  if (image) {
    image.src = mangaMedia(character);
    image.classList.toggle("manga-fx", mode === "manga" && !character.imageManga);
    image.alt = `${character.name} — ${mode === "manga" ? "arte do mangá" : "arte do anime"}`;
    if (mode === "anime") image.src = character.imageAnime;
  }
  if (label) label.textContent = mediaLabel(character, mode);
}

function observeReveals() {
  const items = $$(".reveal:not(.is-visible)");
  if (!("IntersectionObserver" in window)) {
    items.forEach(item => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });
  items.forEach(item => observer.observe(item));
}

function renderRoute(animate = true) {
  const raw = location.hash.replace(/^#\/?/, "");
  const [route = "", ...parts] = raw.split("/");
  const key = decodeURIComponent(route || "");
  const argument = decodeURIComponent(parts.join("/") || "");
  const renderer = routes[key] || renderNotFound;
  const render = () => {
    app.innerHTML = renderer(argument);
    document.body.dataset.route = key || "home";
    $$("nav a").forEach(link => {
      const href = link.getAttribute("href").replace(/^#\/?/, "").split("/")[0];
      link.classList.toggle("is-active", href === key || (!key && href === ""));
    });
    bindGlobalSearch();
    if (key === "personagens") bindCharacters();
    if (key === "organizacoes") bindOrganizations();
    if (key === "shikai") bindZanpakuto("shikai");
    if (key === "bankai") bindZanpakuto("bankai");
    if (key === "arcos") bindArcs();
    if (key === "guia") bindTerms();
    observeReveals();
    window.scrollTo({ top: 0, behavior: "instant" });
  };
  if (!animate || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    render();
    return;
  }
  app.classList.add("is-leaving");
  setTimeout(() => {
    render();
    app.classList.remove("is-leaving");
  }, 140);
}

document.addEventListener("click", event => {
  const mediaButton = event.target.closest("[data-media]");
  if (mediaButton) switchMedia(mediaButton);
});

let lastScroll = 0;
window.addEventListener("scroll", () => {
  const header = $("header");
  const current = window.scrollY;
  header.classList.toggle("is-hidden", current > 120 && current > lastScroll && !header.matches(":focus-within"));
  lastScroll = current;
}, { passive: true });

function initAsh() {
  const canvas = $("#ash");
  const context = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let width, height, particles = [];
  const pointer = { x: -9999, y: -9999 };
  function resize() {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth; height = innerHeight;
    canvas.width = width * ratio; canvas.height = height * ratio;
    canvas.style.width = `${width}px`; canvas.style.height = `${height}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.min(90, Math.floor(width / 14)) }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.4,
      vx: (Math.random() - 0.5) * 0.18,
      vy: -(Math.random() * 0.55 + 0.18),
      alpha: Math.random() * 0.45 + 0.12
    }));
  }
  function draw() {
    context.clearRect(0, 0, width, height);
    particles.forEach(particle => {
      const dx = particle.x - pointer.x, dy = particle.y - pointer.y;
      const distance = Math.hypot(dx, dy);
      if (distance < 120) {
        particle.vx += dx / distance * 0.018;
        particle.vy += dy / distance * 0.018;
      }
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.vx *= 0.994; particle.vy = Math.max(particle.vy * 0.998, -0.8);
      if (particle.y < -10) { particle.y = height + 10; particle.x = Math.random() * width; }
      if (particle.x < -10) particle.x = width + 10;
      if (particle.x > width + 10) particle.x = -10;
      context.beginPath();
      context.fillStyle = `rgba(255, 106, 0, ${particle.alpha})`;
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(draw);
  }
  resize();
  addEventListener("resize", resize, { passive: true });
  addEventListener("pointermove", event => { pointer.x = event.clientX; pointer.y = event.clientY; }, { passive: true });
  addEventListener("pointerleave", () => { pointer.x = -9999; pointer.y = -9999; }, { passive: true });
  if (!reduced) draw();
}

addEventListener("hashchange", () => renderRoute(true));
initAsh();
renderRoute(false);
