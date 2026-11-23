import type { Localized, SiteLocale } from "@/lib/site-data";

/**
 * MOSCOVA 20 — THE PROMO FILM AND THE 360° TOUR (OWNER «PROPERTY COMMERCIAL EXPERIENCE 2026» Parts C–D, 2026-11-23).
 *
 * FILM — a 30-second film is in production: 16:9 for the site, 9:16 for social; voice-over languages RO and RU (EN plays the RO version
 * with English subtitles). The page architecture is ready; the final files plug in here without touching the page. Until then nothing
 * renders — never a demo clip, never a generated replacement, never sound on its own (the visitor starts the film; muted autoplay is not
 * used either). AI interiors in the film are labelled as a concept visualisation by `conceptNote`.
 *
 * TOUR — exactly nine 360° scenes (OWNER list, verbatim order; the count changes only with OWNER approval). Equirectangular 2 : 1 sources,
 * self-hosted, loaded on demand (8K on large screens with a capable GPU, 4K otherwise). Navigation links join only physically connected
 * places (a stair, a doorway, the entrance, the two drone heights); everything else is reached from the scene list — never a false
 * transition. The tour renders only when all nine panoramas exist and the OWNER approved them: never an empty or simulated tour.
 * The yaw / pitch of every hotspot is set from the real panoramas when they arrive (null until then).
 */

const L = (ro: string, ru: string, en: string): Localized => ({ ro, ru, en });
const N = " ";
const base = "/assets/leasing/moscova-20";

/* ---------------------------------------------------------------- film */

export type FilmSource = { src: string; type: "video/mp4" | "video/webm" };
export type FilmVersion = {
  landscape: FilmSource[];
  portrait: FilmSource[];
  /** a real frame of the film (never a render), 16:9 and 9:16 */
  poster: { landscape: string; portrait: string };
  /** WebVTT per language */
  subtitles: Partial<Record<SiteLocale, string>>;
};

export const m20Film = {
  status: "IN_PRODUCTION" as "IN_PRODUCTION" | "DELIVERED",
  ownerApproved: false,
  durationSec: 30,
  /** the voice-over versions — null until the final files arrive (planned paths in docs/qa/2026-11-23-property-commercial-experience/VIDEO_SPEC.md) */
  versions: { ro: null, ru: null } as Record<"ro" | "ru", FilmVersion | null>,
  /** which version each page language plays first; EN offers both voice-overs (a version switch) with English subtitles when supplied */
  byLocale: { ro: "ro", ru: "ru", en: "ro" } as Record<SiteLocale, "ro" | "ru">,
  /** page languages that show the version switch */
  chooser: { ro: false, ru: false, en: true } as Record<SiteLocale, boolean>,
  subtitlesOnByDefault: { ro: false, ru: false, en: true } as Record<SiteLocale, boolean>,
  copy: {
    kicker: L("Film · Moscova 20", `Фильм · Moscova${N}20`, "Film · Moscova 20"),
    // OWNER «MOSCOVA 20 MEDIA INTEGRATION» (2026-11-23): the block's title
    title: L("Următorul pas începe aici.", `Ваш следующий шаг начинается здесь.`, "Your next step starts here."),
    language: L("Versiunea filmului", "Версия фильма", "Film version"),
    languages: { ro: L("Română", "Румынский", "Romanian"), ru: L("Rusă", "Русский", "Russian") },
    fullscreen: L("Ecran complet", "Во весь экран", "Full screen"),
    // the OWNER preview shows the finished frame of the player until the final file arrives — never on the public site
    pendingBadge: L("OWNER PREVIEW · se așteaptă fișierul final", `OWNER PREVIEW · ожидается финальный файл`, "OWNER PREVIEW · final file awaited"),
    pendingText: L("Filmul de prezentare de 30 de secunde · 16:9 · versiunile RO și RU. Aici va fi player-ul.", `Рекламный ролик 30${N}секунд · 16:9 · версии RU и${N}RO. Здесь будет плеер.`, "The 30-second promo film · 16:9 · RO and RU versions. The player goes here."),
    play: L("Porniți filmul", "Смотреть фильм", "Play the film"),
    duration: L("0:30 · cu sunet", `0:30 · со${N}звуком`, "0:30 · with sound"),
    enNote: L("", "", "Romanian voice-over with English subtitles."),
    conceptNote: L("Interioarele amenajate din film sunt vizualizări conceptuale.", `Обустроенные интерьеры в${N}фильме${N}— концептуальная визуализация.`, "The furnished interiors in the film are concept visualisations."),
  },
};

export const filmVersionFor = (locale: SiteLocale): FilmVersion | null => (m20Film.ownerApproved && m20Film.status === "DELIVERED" ? m20Film.versions[m20Film.byLocale[locale]] : null);

/* ---------------------------------------------------------------- tour */

export type TourLevel = "aerial" | "ground" | "lower" | "outside";
export type TourLink = { to: string; label: Localized; /** where the arrow sits in the panorama — set from the real file */ yaw: number | null; pitch: number | null };
export type TourInfo = { key: string; label: Localized; text: Localized; yaw: number | null; pitch: number | null };
export type TourScene = {
  id: string;
  no: string;
  level: TourLevel;
  title: Localized;
  caption: Localized;
  /** the 8K (8192 × 4096) and 4K (4096 × 2048) equirectangular files and a flat poster frame (scene 01 opens the tour) — null until delivered */
  files: { full: string; medium: string; poster: string } | null;
  /** the view on arrival (degrees) */
  start: { yaw: number; pitch: number; fov: number };
  links: TourLink[];
  info: TourInfo[];
};

const file = (id: string) => ({ full: `${base}/tour/${id}-8k.jpg`, medium: `${base}/tour/${id}-4k.jpg`, poster: `${base}/tour/${id}-poster.jpg` });
const at = (to: string, label: Localized): TourLink => ({ to, label, yaw: null, pitch: null });

export const m20Tour = {
  ownerApproved: false,
  /** a ready-made hosted tour from the photographer (instead of the nine files for our own viewer) — iframe, loaded on the visitor's click */
  embed: null as { url: string; provider: string } | null,
  /** filled with `file(id)` for each scene once the panoramas are delivered and checked (docs/…/PHOTOGRAPHER_BRIEF_360.md) */
  delivered: [] as string[],
  levels: {
    aerial: L("Din aer", "С высоты", "From above"),
    ground: L("Parter", `1‑й этаж`, "Ground floor"),
    lower: L("Demisol", "Цоколь", "Lower ground"),
    outside: L("Acces", "Подъезд", "Access"),
  } satisfies Record<TourLevel, Localized>,
  scenes: [
    { id: "m20-360-01", no: "01", level: "aerial", title: L("Cartierul de sus", "Район с высоты", "The district from above"), caption: L("Dronă, deasupra blocului de nouă etaje: bulevardul Moscova, strada Matei Basarab și cartierul.", `Дрон выше девятиэтажного дома: бульвар Москова, улица Матей Басараб и${N}район.`, "Drone above the nine-storey block: Moscova Boulevard, Matei Basarab Street and the district."), files: null, start: { yaw: 0, pitch: -20, fov: 80 }, links: [at("m20-360-02", L("Mai aproape", "Ближе", "Closer"))], info: [] },
    { id: "m20-360-02", no: "02", level: "aerial", title: L("Spațiul și intrarea", `Помещение и${N}вход`, "The premises and the entrance"), caption: L("Dronă, plan apropiat: spațiul, intrarea pentru clienți și drumul dinspre bulevard.", `Дрон, близкий план: помещение, вход для${N}покупателей и${N}путь с${N}бульвара.`, "Drone, close view: the premises, the customer entrance and the way from the boulevard."), files: null, start: { yaw: 0, pitch: -25, fov: 80 }, links: [at("m20-360-01", L("Cartierul", "Район", "The district")), at("m20-360-03", L("Intrați", "Войти", "Go inside"))], info: [] },
    { id: "m20-360-03", no: "03", level: "ground", title: L("Sala de la parter", "Торговый зал 1‑го этажа", "The ground-floor hall"), caption: L("Parterul: sala comercială cu vitrine spre bulevard.", `1‑й этаж: торговый зал с${N}витринами на${N}бульвар.`, "Ground floor: the sales hall with shopfronts on the boulevard."), files: null, start: { yaw: 0, pitch: 0, fov: 85 }, links: [at("m20-360-02", L("Afară", "На улицу", "Outside")), at("m20-360-04", L("Scara spre demisol", `Лестница в${N}цоколь`, "Stairs to the lower ground")), at("m20-360-08", L("Depozitul de la parter", "Склад 1‑го этажа", "Ground-floor store room"))], info: [] },
    { id: "m20-360-04", no: "04", level: "ground", title: L("Scara spre demisol", `Лестница в${N}цоколь`, "Stairs to the lower ground"), caption: L("Coborârea de la parter la demisol.", `Спуск с${N}1‑го этажа в${N}цоколь.`, "The way down from the ground floor to the lower ground."), files: null, start: { yaw: 0, pitch: -10, fov: 85 }, links: [at("m20-360-03", L("Sala de la parter", "Торговый зал", "The ground-floor hall")), at("m20-360-05", L("Demisol", "Цоколь", "Lower ground"))], info: [] },
    { id: "m20-360-05", no: "05", level: "lower", title: L("Demisolul · partea 1", "Цоколь · сторона 1", "Lower ground · side 1"), caption: L("Demisolul, prima parte a sălii.", `Цоколь, первая сторона зала.`, "The lower ground, the first side of the hall."), files: null, start: { yaw: 0, pitch: 0, fov: 85 }, links: [at("m20-360-04", L("Scara", "Лестница", "Stairs")), at("m20-360-06", L("Partea 2", "Сторона 2", "Side 2")), at("m20-360-07", L("Spațiul gospodăresc", "Хозяйственное помещение", "Utility room"))], info: [] },
    { id: "m20-360-06", no: "06", level: "lower", title: L("Demisolul · partea 2", "Цоколь · сторона 2", "Lower ground · side 2"), caption: L("Demisolul, a doua parte a sălii.", `Цоколь, вторая сторона зала.`, "The lower ground, the second side of the hall."), files: null, start: { yaw: 180, pitch: 0, fov: 85 }, links: [at("m20-360-05", L("Partea 1", "Сторона 1", "Side 1"))], info: [] },
    { id: "m20-360-07", no: "07", level: "lower", title: L("Spațiul gospodăresc", "Хозяйственное помещение", "Utility room"), caption: L("Spațiul gospodăresc și de depozitare.", `Хозяйственное помещение и${N}хранение.`, "The utility and storage room."), files: null, start: { yaw: 0, pitch: 0, fov: 85 }, links: [at("m20-360-05", L("Demisolul", "Цоколь", "Lower ground"))], info: [] },
    { id: "m20-360-08", no: "08", level: "ground", title: L("Depozitul de la parter", "Склад 1‑го этажа", "Ground-floor store room"), caption: L("Încăperea de depozitare de la parter.", `Складское помещение на${N}1‑м этаже.`, "The store room on the ground floor."), files: null, start: { yaw: 0, pitch: 0, fov: 85 }, links: [at("m20-360-03", L("Sala de la parter", "Торговый зал", "The ground-floor hall"))], info: [] },
    // the access side: its physical connection to the premises (which door, which level) is confirmed on site before a link is added
    { id: "m20-360-09", no: "09", level: "outside", title: L("Rampa și accesul auto", `Рампа и${N}подъезд`, "The ramp and vehicle access"), caption: L("Partea de acces: rampa, apropierea auto și descărcarea.", `Сторона доступа: рампа, подъезд автомобиля и${N}разгрузка.`, "The access side: the ramp, the vehicle approach and unloading."), files: null, start: { yaw: 0, pitch: -5, fov: 85 }, links: [], info: [] },
  ] as TourScene[],
  copy: {
    kicker: L("Tur virtual 360°", "Виртуальный тур 360°", "360° virtual tour"),
    title: L("Intrați în Moscova 20.", `Зайдите в${N}Moscova${N}20.`, "Step inside Moscova 20."),
    start: L("Porniți turul 360°", "Начать тур 360°", "Start the 360° tour"),
    prev: L("Înapoi", "Назад", "Back"),
    next: L("Mai departe", "Далее", "Next"),
    close: L("Înapoi la pagină", `Вернуться на${N}страницу`, "Back to the page"),
    scenes: L("Scenele turului", "Сцены тура", "Tour scenes"),
    fullscreen: L("Ecran complet", "Во весь экран", "Full screen"),
    plans: L("Planurile spațiului", "Планы помещения", "Space plans"),
    hint: L("Trageți pentru a privi în jur · rotița sau două degete — zoom", `Перетащите, чтобы осмотреться · колесо или два пальца${N}— масштаб`, "Drag to look around · wheel or two fingers to zoom"),
    loading: L("Se încarcă panorama…", "Загружается панорама…", "Loading the panorama…"),
    noGl: L("Browserul nu poate afișa panorama 360°. Vedeți fotografiile și planurile.", `Браузер не${N}может показать панораму 360°. Смотрите фотографии и${N}планы.`, "This browser cannot show the 360° panorama. See the photographs and plans."),
  },
};

/** the tour renders only complete and approved — never an empty or simulated tour (local QA may set NEXT_PUBLIC_TOUR_FIXTURE, never a published build) */
export const tourScenes = (): TourScene[] => {
  if (process.env.NEXT_PUBLIC_TOUR_FIXTURE === "1") return m20Tour.scenes.map((scene) => ({ ...scene, files: { full: `${base}/tour-fixture/${scene.id}.jpg`, medium: `${base}/tour-fixture/${scene.id}.jpg`, poster: `${base}/tour-fixture/${scene.id}-thumb.jpg` }, links: scene.links.map((link, i) => ({ ...link, yaw: 30 + i * 70, pitch: -8 })) }));
  const ready = m20Tour.ownerApproved && m20Tour.scenes.length === 9 && m20Tour.scenes.every((scene) => m20Tour.delivered.includes(scene.id));
  return ready ? m20Tour.scenes.map((scene) => ({ ...scene, files: file(scene.id) })) : [];
};

/* ---------------------------------------------------------------- concept frames (OWNER CLARIFICATION «Video & Virtual Tour Integration», 2026-11-23) */

/**
 * «Какой бизнес вы рассматриваете?» — the photographs with the red translucent zones are replaced by frames of the three concept interiors
 * of the finished promo film: the producer's own store («Фирменный магазин производителя»), the showroom and the client office («Офис ·
 * клиентский центр»). Each frame is labelled as a concept visualisation; the format analytics stay unchanged; the two other formats (retail,
 * client service) keep their current visual. Until the frames arrive (and the OWNER approves them) the current working version stays.
 */
export type ConceptKey = "producer" | "showroom" | "office";
export type ConceptFrame = { src: string; small: string; width: number; height: number; alt: Localized };
export const m20ConceptFrames = {
  ownerApproved: false,
  frames: { producer: null, showroom: null, office: null } as Record<ConceptKey, ConceptFrame | null>,
  label: L("Vizualizare conceptuală · cadru din filmul de prezentare", "Концептуальная визуализация · кадр из рекламного ролика", "Concept visualisation · a frame from the promo film"),
};
export const conceptFrameFor = (project: string, format: string): ConceptFrame | null =>
  project === "moscova-20" && m20ConceptFrames.ownerApproved && format in m20ConceptFrames.frames ? m20ConceptFrames.frames[format as ConceptKey] : null;
/** the format whose visual is a concept interior (whether or not its frame has arrived) */
export const conceptSlotFor = (project: string, format: string): ConceptKey | null =>
  project === "moscova-20" && format in m20ConceptFrames.frames ? (format as ConceptKey) : null;

/* ---------------------------------------------------------------- OWNER preview modes (OWNER «MOSCOVA 20 MEDIA INTEGRATION · OWNER VISUAL REVIEW», 2026-11-23) */

/**
 * The OWNER wants to see the final composition of the page before the photographer's files arrive. On the OWNER PREVIEW only:
 *   · the film block shows the finished frame of the player with a clear «ожидается финальный файл» mark;
 *   · the three concept slots of «Какой бизнес вы рассматриваете?» show neutral mock areas («кадр ожидается»);
 *   · the address view of «Адрес — часть бизнес-модели» shows the final 360° interface on neutral generated placeholders, labelled
 *     «Демонстрация интерфейса · панорамы ожидаются» — never presented as a real tour.
 * The production edition never renders any of this: no empty player, no demo panorama, no unconfirmed visualisation — until the files are
 * delivered it keeps the clean real photographs and the aerial.
 */
export const mediaPreview = (process.env.NEXT_PUBLIC_SITE_EDITION ?? "production") !== "production";

export const conceptCopy = {
  names: { producer: L("magazin", "магазин", "store"), showroom: L("showroom", "шоурум", "showroom"), office: L("birou pentru clienți", "клиентский офис", "client office") } satisfies Record<ConceptKey, Localized>,
  pendingTitle: L("Interior conceptual · {name}", "Концептуальный интерьер · {name}", "Concept interior · {name}"),
  pendingText: L("Cadrul din filmul de prezentare se așteaptă. Va fi marcat ca vizualizare conceptuală.", `Кадр из${"\u00a0"}рекламного ролика ожидается. Будет подписан как концептуальная визуализация.`, "The frame from the promo film is awaited. It will be labelled as a concept visualisation."),
  pendingBadge: L("OWNER PREVIEW · cadru în așteptare", "OWNER PREVIEW · кадр ожидается", "OWNER PREVIEW · frame awaited"),
  realPhoto: L("Fotografia spațiului", "Фото помещения", "Photograph of the space"),
};

export const tourPreviewCopy = {
  banner: L("Demonstrația interfeței · panoramele se așteaptă de la fotograf", `Демонстрация интерфейса · панорамы ожидаются от${"\u00a0"}фотографа`, "Interface demonstration · panoramas awaited from the photographer"),
  placeholder: L("PANORAMA SE AȘTEAPTĂ", "ПАНОРАМА ОЖИДАЕТСЯ", "PANORAMA AWAITED"),
  start: L("Vedeți interfața turului 360°", "Посмотреть интерфейс тура 360°", "See the 360° tour interface"),
  embed: L("Deschideți turul virtual", "Открыть виртуальный тур", "Open the virtual tour"),
};

/** the nine scenes for the interface demonstration of the OWNER preview: generated neutral placeholders, illustrative arrow positions */
export const tourPreviewScenes = (): TourScene[] => (mediaPreview && !tourScenes().length && !m20Tour.embed
  ? m20Tour.scenes.map((scene) => ({ ...scene, files: { full: `placeholder:${scene.no}`, medium: `placeholder:${scene.no}`, poster: "" }, links: scene.links.map((link, i) => ({ ...link, yaw: (scene.start.yaw + 40 + i * 95) % 360, pitch: -10 })) }))
  : []);
