import { T } from "@/data/leasing-experience-model";
import type { Confidence, LayerKey, Nature, Register, Role } from "@/data/land/model";
import type { Localized } from "@/lib/site-data";

/**
 * The interface copy of the land experience (RU master; RO / EN adapted from the meaning). Site data lives in src/data/land/<slug>.ts —
 * this file only names the controls, sections, statuses and roles.
 */

export const registerCopy: Record<Register, Localized> = {
  DOCUMENTED: T("Confirmat documentar", "Документально подтверждено", "Documented"),
  VERIFYING: T("Date primite, se verifică", "Данные получены, проверяются", "Received, being verified"),
  TO_OBTAIN: T("De obținut", "Необходимо получить", "To be obtained"),
  NOT_APPLICABLE: T("Nu se aplică", "Не применимо", "Not applicable"),
};

export const roleCopy: Record<Role, Localized> = {
  owner: T("MEGAPARC", "MEGAPARC", "MEGAPARC"),
  lawyer: T("Jurist", "Юрист", "Lawyer"),
  cadastral: T("Inginer cadastral", "Кадастровый инженер", "Cadastral engineer"),
  surveyor: T("Topograf", "Геодезист", "Surveyor"),
  geologist: T("Geolog", "Геолог", "Geologist"),
  "technical-director": T("Director tehnic", "Технический директор", "Technical Director"),
  architect: T("Arhitect", "Архитектор", "Architect"),
  utilities: T("Inginer de rețele", "Инженер по сетям", "Utilities engineer"),
  commercial: T("Departamentul comercial", "Коммерческий отдел", "Commercial team"),
  finance: T("Director financiar", "Финансовый директор", "Finance Director"),
  marketing: T("Marketing", "Маркетинг", "Marketing"),
};

export const natureCopy: Record<Nature, Localized> = {
  FACT: T("Fapt", "Факт", "Fact"),
  ESTIMATE: T("Estimare", "Оценка", "Estimate"),
  ASSUMPTION: T("Ipoteză", "Допущение", "Assumption"),
};
export const confidenceCopy: Record<Confidence, Localized> = {
  HIGH: T("încredere înaltă", "высокая достоверность", "high confidence"),
  MEDIUM: T("încredere medie", "средняя достоверность", "medium confidence"),
  LOW: T("încredere scăzută", "низкая достоверность", "low confidence"),
};

export const layerIcons: Record<LayerKey, string> = { site: "pin", boundary: "frame", access: "road", context: "grid", commerce: "shop", residential: "home", utilities: "bolt", potential: "spark" };

export const c = {
  back: T("Proiecte", "Проекты", "Projects"),
  preview: T("Previzualizare OWNER: întreaga arhitectură a paginii. Sloturile goale și modulele neaprobate nu apar în versiunea publică.", "OWNER Preview: вся архитектура страницы. Пустые слоты и неутверждённые модули на публичной версии не показываются.", "OWNER preview: the page's full architecture. Empty slots and unapproved modules are not shown on the public site."),
  explore: T("Explorați terenul", "Изучить участок", "Explore the site"),
  evaluate: T("Evaluați scenariul investițional", "Оценить инвестиционный сценарий", "Evaluate an investment scenario"),
  discuss: T("Discutați proiectul", "Обсудить проект", "Discuss the project"),
  nav: {
    explorer: T("Locația", "Локация", "Location"),
    market: T("Piața", "Рынок", "Market"),
    scenarios: T("Scenarii", "Сценарии", "Scenarios"),
    passport: T("Pașaport", "Паспорт", "Passport"),
    readiness: T("Pregătire", "Готовность", "Readiness"),
    model: T("Model", "Модель", "Model"),
    deals: T("Tranzacție", "Сделка", "Deal"),
    pack: T("Developer Pack", "Developer Pack", "Developer Pack"),
  },
  navLabel: T("Secțiunile paginii", "Разделы страницы", "Page sections"),
  media: {
    label: T("Materialele terenului", "Материалы участка", "Site materials"),
    map: T("Hartă", "Карта", "Map"),
    slot: T("Slot rezervat · materialul va apărea după filmare", "Слот зарезервирован · материал появится после съёмки", "Reserved slot · the material appears after the shoot"),
    expected: T("Ce așteptăm", "Что ожидается", "What is expected"),
    honest: T("Nu folosim imagini străine sau generate drept fotografii ale terenului.", "Мы не выдаём чужие или сгенерированные изображения за фотографии участка.", "We never present foreign or generated images as photographs of the site."),
  },
  facts: T("Datele publicate", "Опубликованные данные", "Published data"),

  // 01 · location explorer
  p1: T("01 · Explorer de locație", "01 · Location Explorer", "01 · Location Explorer"),
  p1title: T("Terenul în orașul său.", "Участок в своём городе.", "The site in its town."),
  p1lead: T("Opt straturi din date verificabile: unde se află terenul, ce îl înconjoară, cum se ajunge la el și ce funcții are orașul în jur.", "Восемь слоёв из проверяемых данных: где участок, что вокруг, как к нему подъехать и какие функции у города рядом.", "Eight layers of verifiable data: where the site is, what surrounds it, how to reach it and what the town around it does."),
  explorerAsk: T("Ce vreți să vedeți?", "Что вы хотите увидеть?", "What would you like to see?"),
  explorerHint: T("Alegeți un strat — harta se schimbă.", "Выберите слой — карта обновится.", "Choose a layer — the map updates."),
  now: T("Acum pe hartă", "Сейчас на карте", "Now on the map"),
  zoomIn: T("Mărire", "Приблизить", "Zoom in"),
  zoomOut: T("Micșorare", "Отдалить", "Zoom out"),
  reset: T("Toată harta", "Вся карта", "Whole map"),
  satellite: T("Vedere satelit (Google Maps)", "Спутниковый вид (Google Maps)", "Satellite view (Google Maps)"),
  tour: T("Panoramă 360°", "Панорама 360°", "360° panorama"),
  tourSoon: T("Panorama 360° — după filmare", "Панорама 360° — после съёмки", "360° panorama — after the shoot"),
  route: T("Traseu", "Маршрут", "Directions"),
  pending: T("Strat în așteptare", "Слой ожидает документ", "Layer pending"),
  osm: T("Date OpenStreetMap", "Данные OpenStreetMap", "OpenStreetMap data"),
  straight: T("în linie dreaptă", "по прямой", "straight line"),
  withinKm: T("în raza de 1 km", "в радиусе 1 км", "within 1 km"),
  legend: {
    site: T("Terenul (adresa geocodată)", "Участок (геокодированный адрес)", "The site (geocoded address)"),
    road: T("Drumuri principale", "Главные дороги", "Main roads"),
    rail: T("Calea ferată", "Железная дорога", "Railway"),
    residential: T("Zone rezidențiale", "Жилые зоны", "Residential zones"),
    production: T("Zone de producție", "Производственные зоны", "Production zones"),
    trade: T("Zone comerciale", "Торговые зоны", "Trade zones"),
    power: T("Linii electrice", "ЛЭП", "Power lines"),
    ring: T("Raza de 1 km", "Радиус 1 км", "1 km radius"),
  },
  kinds: {
    retail: T("Supermarketuri", "Супермаркеты", "Supermarkets"),
    market: T("Piață", "Рынок", "Market"),
    trade: T("Bricolaj, electronice, mobilă", "Стройматериалы, электроника, мебель", "DIY, electronics, furniture"),
    fuel: T("Stații de carburant", "АЗС", "Fuel stations"),
    service: T("Bănci, farmacii, poștă", "Банки, аптеки, почта", "Banks, pharmacies, post"),
    shop: T("Alte magazine", "Другие магазины", "Other shops"),
    education: T("Școli și grădinițe", "Школы и детские сады", "Schools and kindergartens"),
    health: T("Sănătate", "Медицина", "Health"),
    station: T("Gara", "Ж/д станция", "Railway station"),
    bus: T("Autogara", "Автостанция", "Bus station"),
    substation: T("Posturi de transformare", "Подстанции", "Substations"),
    water: T("Obiecte de apă", "Водные объекты", "Water facilities"),
  } as Record<string, Localized>,
  distTitle: T("Distanțe rutiere (estimare)", "Расстояния по дорогам (оценка)", "Road distances (estimate)"),
  nearest: T("Cele mai apropiate", "Ближайшие", "Nearest"),

  // 02 · market
  p2: T("02 · Studiul pieței", "02 · Исследование рынка", "02 · Market research"),
  p2title: T("Drochia în cifre — cu sursă și dată.", "Дрокия в цифрах — с источником и датой.", "Drochia in figures — with source and date."),
  p2lead: T("Fiecare indicator arată sursa, data, metoda și gradul de încredere. Faptele, estimările și ipotezele nu se amestecă.", "У каждого показателя — источник, дата, метод и достоверность. Факты, оценки и допущения не смешиваются.", "Every indicator shows its source, date, method and confidence. Facts, estimates and assumptions are never mixed."),
  conclusion: T("Concluzie", "Вывод", "Conclusion"),
  gaps: T("Ce nu publicăm", "Что мы не публикуем", "What we do not publish"),
  gapsText: T("Nu există o numărătoare a traficului auto sau pietonal lângă teren — nu publicăm cifre de trafic.", "Подсчёта автомобильного или пешеходного потока рядом с участком нет — цифр трафика мы не публикуем.", "There is no vehicle or pedestrian count near the site — we publish no traffic figures."),
  detail: T("Studiul complet, cu toate sursele — la cerere", "Полное исследование со всеми источниками — по запросу", "The full research with every source — on request"),
  source: T("Sursa", "Источник", "Source"),
  date: T("Data", "Дата", "Date"),
  method: T("Metoda", "Метод", "Method"),

  // 03 · scenarios
  p3: T("03 · Scenarii de dezvoltare", "03 · Сценарии развития", "03 · Development scenarios"),
  p3title: T("Patru direcții de evaluat.", "Четыре направления для оценки.", "Four directions to evaluate."),
  p3lead: T("Pentru fiecare: cui i se adresează, logica comercială, ce îi trebuie terenului, ce verificăm și care sunt riscurile.", "Для каждого: для кого, коммерческая логика, что нужно от участка, что проверяем и какие риски.", "For each: who it serves, the commercial logic, what it needs from the site, what we check and the risks."),
  scenAsk: T("Ce format evaluați?", "Какой формат вы рассматриваете?", "Which format are you considering?"),
  audience: T("Publicul țintă", "Целевая аудитория", "Target audience"),
  logic: T("Logica comercială", "Коммерческая логика", "Commercial logic"),
  needs: T("Cerințe față de teren", "Требования к участку", "Site requirements"),
  access: T("Accese și logistică", "Подъезды и логистика", "Access and logistics"),
  utilities: T("Necesar de rețele", "Инженерные потребности", "Utility needs"),
  checks: T("Verificări și autorizații", "Проверки и разрешения", "Checks and permits"),
  risks: T("Riscuri economice", "Экономические риски", "Economic risks"),
  calcThis: T("Calculați acest scenariu", "Рассчитать этот сценарий", "Model this scenario"),
  visualSlot: T("Loc pentru vizualizări, plan general și concept 3D — după conceptul aprobat.", "Место для визуализаций, генплана и 3D-концепции — после утверждённой концепции.", "Room for visualisations, the masterplan and a 3D concept — after an approved concept."),
  scenDisclaimer: T("Acestea nu sunt proiecte de construire și nu confirmă destinația permisă. Admisibilitatea formatului se stabilește după verificarea urbanistică.", "Это не проекты застройки и не подтверждение разрешённого использования. Допустимость формата определяется после градостроительной проверки.", "These are not building projects and do not confirm the permitted use. Whether a format is admissible is established by the planning check."),

  // 04 · passport
  p4: T("04 · Pașaportul tehnic", "04 · Технический паспорт", "04 · Technical passport"),
  p4title: T("Ce știm despre teren — și ce nu știm încă.", "Что известно об участке — и что ещё нет.", "What we know about the site — and what we do not yet."),
  p4lead: T("Fiecare parametru are valoare, sursă, data verificării și status. Unde nu există încă un document, nu scriem o cifră.", "У каждого параметра — значение, источник, дата проверки и статус. Где документа ещё нет, цифры нет.", "Every parameter has a value, a source, a check date and a status. Where there is no document yet, there is no figure."),
  groups: { land: T("Teren și drept", "Земля и право", "Land and title"), geometry: T("Geometrie și teren", "Геометрия и рельеф", "Geometry and ground"), planning: T("Urbanism", "Градостроительство", "Planning"), utilities: T("Rețele inginerești", "Инженерные сети", "Utilities") },
  col: { param: T("Parametru", "Параметр", "Parameter"), value: T("Valoare", "Значение", "Value"), source: T("Sursa · data", "Источник · дата", "Source · date"), status: T("Status", "Статус", "Status"), doc: T("Document", "Документ", "Document"), who: T("Responsabil", "Ответственный", "Responsible") },

  // 05 · readiness
  p5: T("05 · Registrul de pregătire", "05 · Реестр готовности к девелопменту", "05 · Development readiness register"),
  p5title: T("Ce este cunoscut. Ce urmează de verificat.", "Что известно. Что предстоит проверить.", "What is known. What remains to be checked."),
  p5lead: T("Un registru, nu un rating: fiecare rând spune pe ce se bazează statusul și care este pasul următor.", "Реестр, а не рейтинг: в каждой строке — на чём основан статус и какой следующий шаг.", "A register, not a rating: every line says what the status rests on and what the next step is."),
  all: T("Toate", "Все", "All"),
  categories: { title: T("Drept și cadastru", "Право и кадастр", "Title and cadastre"), planning: T("Urbanism", "Градостроительство", "Planning"), technical: T("Tehnic", "Техника", "Technical"), commercial: T("Comercial", "Коммерция", "Commercial"), materials: T("Materiale", "Материалы", "Materials") },
  evidence: T("Pe ce se bazează", "На чём основано", "Based on"),
  next: T("Pasul următor", "Следующий шаг", "Next step"),

  // 06 · model
  p6: T("06 · Model de dezvoltare 2.0", "06 · Development Calculator 2.0", "06 · Development Calculator 2.0"),
  p6title: T("Verificați economia proiectului pe ipotezele dumneavoastră.", "Проверьте экономику проекта на своих допущениях.", "Test the project's economics on your own assumptions."),
  p6lead: T("Fluxuri de numerar lunare, terenul separat de investițiile în bani, finanțarea și impozitele separat, IRR și NPV din fluxurile reale.", "Помесячные денежные потоки, земля отдельно от денежных вложений, финансирование и налоги отдельно, IRR и NPV по реальным потокам.", "Monthly cash flows, the land apart from the cash invested, financing and tax apart, IRR and NPV from the real flows."),

  // 07 · deals
  p7: T("07 · Structura tranzacției", "07 · Структуры сделки", "07 · Deal structures"),
  p7title: T("Cum se poate structura proiectul.", "Как можно структурировать проект.", "How the project can be structured."),
  possible: T("Format posibil", "Возможный формат", "Possible format"),
  agreed: T("Format confirmat", "Подтверждённый формат", "Confirmed format"),
  suits: T("Potrivit pentru", "Подходит", "Suits"),
  dealNote: T("Formatele enumerate sunt variante de discutat, nu condiții convenite. Formatele admise pentru teren le stabilește MEGAPARC; condițiile — pentru fiecare proiect separat.", "Перечисленные форматы — варианты для обсуждения, а не согласованные условия. Допустимые для участка форматы определяет MEGAPARC; условия — отдельно для каждого проекта.", "The formats listed are options to discuss, not agreed terms. MEGAPARC decides which formats are admissible for the site; the terms are set project by project."),

  // 08 · developer pack
  p8: T("08 · Developer Pack", "08 · Developer Pack", "08 · Developer Pack"),
  p8title: T("Documentele pentru decizie — într-un singur pachet.", "Документы для решения — в одном пакете.", "The documents for a decision — in one pack."),
  p8lead: T("Pachetul se completează pe măsura verificărilor. Trimitem ce este gata; nu publicăm documente goale sau cifre neconfirmate.", "Пакет дополняется по мере проверок. Отправим то, что готово; пустых документов и неподтверждённых цифр не публикуем.", "The pack grows as the checks progress. We send what is ready; we never publish empty documents or unconfirmed figures."),
  ready: T("Gata", "Готово", "Ready"),
  preparing: T("Se pregătește", "Готовим", "In preparation"),
  na: T("Nu se aplică", "Не применимо", "Not applicable"),
  requestPack: T("Solicitați Developer Pack", "Запросить Developer Pack", "Request the Developer Pack"),
  pdfNote: T("PDF RO · RU · EN — din aceleași date ca pagina, după pregătirea materialelor.", "PDF RO · RU · EN — из тех же данных, что и страница, после подготовки материалов.", "PDF RO · RU · EN — from the same data as this page, once the materials are ready."),
  call: T("Sunați", "Позвонить", "Call"),

  // 09 · technical assessment
  p9: T("09 · Evaluarea tehnică", "09 · Техническая оценка", "09 · Technical assessment"),
  p9title: T("Prima evaluare a terenului — cu directorul tehnic și arhitectul MEGAPARC.", "Первичная оценка участка — с техническим директором и архитектором MEGAPARC.", "The first assessment of the site — with MEGAPARC's Technical Director and Architect."),
  p9lead: T("Mai întâi verificăm fezabilitatea tehnică — apoi discutăm structura.", "Сначала проверяем техническую реализуемость — затем обсуждаем структуру.", "Technical feasibility first — then the structure."),
  p9note: T("Evaluarea ajută decizia; nu înlocuiește autorizațiile și avizele, care se obțin separat.", "Оценка помогает принять решение, но не заменяет разрешений и согласований — они оформляются отдельно.", "The assessment supports the decision; it does not replace permits and approvals, which are obtained separately."),
  team: [
    T("restricțiile urbanistice", "градостроительные ограничения", "planning constraints"),
    T("configurația terenului", "конфигурация участка", "site configuration"),
    T("accesele", "подъезды", "access"),
    T("rețelele", "инженерные сети", "utilities"),
    T("fezabilitatea tehnică", "техническая реализуемость", "technical feasibility"),
    T("conceptul preliminar", "предварительная концепция", "preliminary concept"),
  ],
};

/** the subject and the body of the confirmed public mailbox (qa-static accepts only subject / body on receptie@imc.md) */
export const mailCopy = {
  pack: { subject: T("Drochia — Developer Pack", "Drochia — Developer Pack", "Drochia — Developer Pack"), body: T("Bună ziua! Vă rog să-mi trimiteți Developer Pack pentru terenul Drochia (bd. Independenței 65).\n\nCompania:\nFormatul evaluat:\nTelefon:", "Здравствуйте! Прошу прислать Developer Pack по участку Drochia (бул. Индепенденцей, 65).\n\nКомпания:\nРассматриваемый формат:\nТелефон:", "Hello! Please send me the Developer Pack for the Drochia site (65 Independenței Blvd).\n\nCompany:\nFormat considered:\nPhone:") },
  research: { subject: T("Drochia — studiul pieței", "Drochia — исследование рынка", "Drochia — market research"), body: T("Bună ziua! Vă rog să-mi trimiteți studiul complet al pieței pentru terenul Drochia.\n\nCompania:\nTelefon:", "Здравствуйте! Прошу прислать полное исследование рынка по участку Drochia.\n\nКомпания:\nТелефон:", "Hello! Please send me the full market research for the Drochia site.\n\nCompany:\nPhone:") },
};
