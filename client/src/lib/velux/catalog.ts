/**
 * VELUX-Preiskatalog — einzige Quelle für Preistabellen und Katalog-Metadaten.
 *
 * Genutzt von: Preisrechner-UI, PDF-Ausgabe, Anfrage-Text und (ab PR-2a) den
 * WebMCP-Tools. Es gibt bewusst KEINE zweite Preistabelle im Projekt.
 *
 * Die Objektliterale unten wurden in PR-1a byte-genau aus
 * client/src/components/VeluxPreisrechner.tsx (Zeilen 9–31, Stand 889a9e8)
 * übernommen. Preisänderungen laufen ausschließlich über diese Datei; danach
 * `npm run estimate:check` ausführen und die Goldwerte bewusst per Hand
 * anpassen (siehe scripts/velux-estimate-check.ts).
 */

export type ModelCode = "GGU" | "GGL" | "GPU" | "GPL";
export type SizeCode =
  | "CK02" | "CK04" | "CK06"
  | "FK04" | "FK06" | "FK08"
  | "MK04" | "MK06" | "MK08" | "MK10"
  | "PK06" | "PK08" | "PK10"
  | "SK06" | "SK08" | "SK10"
  | "UK04" | "UK08" | "UK10";
export type GlazingCode = "T" | "E" | "P";
export type ShutterCode = "SSL" | "SML";
export type BlindCode = "DKL" | "DSL";

export interface WindowModel {
  name: string;
  short: string;
  desc: string;
  icon: string;
  /** Nicht jede Größe ist für jedes Modell verfügbar (GPU/GPL: Teilmenge). */
  prices: Partial<Record<SizeCode, Record<GlazingCode, number>>>;
}
export interface Accessory {
  name: string;
  short: string;
  prices: Partial<Record<SizeCode, number>>;
}
export interface GlazingMeta {
  l: string;
  code: string;
  uw: string;
  g: string;
}

/**
 * Katalog-Metadaten. `validFrom`/`revision` entsprechen DEPLOY-RULES §6
 * („VELUX UVP ab 01.07.2026"); die konkrete Preislisten-Revision ist vom
 * Betrieb zu bestätigen und hier nachzutragen.
 */
export const CATALOG = {
  name: "VELUX Preisliste 2026",
  pricesAre: "UVP netto",
  validFrom: "2026-07-01",
  revision: "2026-07-01",
} as const;

export const DIMS: Record<SizeCode, string> = {CK02:"55×78",CK04:"55×98",CK06:"55×118",FK04:"66×98",FK06:"66×118",FK08:"66×140",MK04:"78×98",MK06:"78×118",MK08:"78×140",MK10:"78×160",PK06:"94×118",PK08:"94×140",PK10:"94×160",SK06:"114×118",SK08:"114×140",SK10:"114×160",UK04:"134×98",UK08:"134×140",UK10:"134×160"};

export const WINDOWS: Record<ModelCode, WindowModel> = {
  GGU:{name:"Kunststoff-Schwingfenster",short:"Kunststoff Schwing",desc:"Feuchtraumgeeignet, pflegeleicht",icon:"droplets",prices:{CK02:{T:550,E:647,P:686},CK04:{T:594,E:716,P:765},CK06:{T:616,E:763,P:822},FK04:{T:616,E:763,P:822},FK06:{T:696,E:873,P:944},FK08:{T:733,E:941,P:1026},MK04:{T:667,E:839,P:909},MK06:{T:733,E:941,P:1026},MK08:{T:792,E:1038,P:1138},MK10:{T:887,E:1169,P:1284},PK06:{T:821,E:1072,P:1174},PK08:{T:894,E:1193,P:1314},PK10:{T:975,E:1316,P:1455},SK06:{T:916,E:1219,P:1342},SK08:{T:990,E:1349,P:1495},SK10:{T:1078,E:1489,P:1656},UK04:{T:916,E:1212,P:1333},UK08:{T:1085,E:1507,P:1680},UK10:{T:1261,E:1744,P:1941}}},
  GGL:{name:"Holz-Schwingfenster",short:"Holz Schwing",desc:"Natürliches Holz, weiß/klar lackiert",icon:"home",prices:{CK02:{T:423,E:520,P:560},CK04:{T:457,E:579,P:629},CK06:{T:474,E:621,P:681},FK04:{T:474,E:621,P:681},FK06:{T:536,E:712,P:784},FK08:{T:564,E:772,P:857},MK04:{T:514,E:685,P:755},MK06:{T:564,E:772,P:857},MK08:{T:610,E:856,P:956},MK10:{T:683,E:965,P:1080},PK06:{T:632,E:883,P:985},PK08:{T:689,E:987,P:1108},PK10:{T:751,E:1092,P:1231},SK06:{T:706,E:1008,P:1132},SK08:{T:762,E:1121,P:1268},SK10:{T:830,E:1241,P:1408},UK04:{T:706,E:1002,P:1122},UK08:{T:835,E:1258,P:1430},UK10:{T:971,E:1454,P:1651}}},
  GPU:{name:"Kunststoff-Klapp-Schwingfenster",short:"Kunststoff Klapp-Schwing",desc:"Panoramablick, feuchtraumgeeignet",icon:"eye",prices:{CK04:{T:877,E:999,P:1048},CK06:{T:899,E:1046,P:1105},FK06:{T:979,E:1156,P:1227},FK08:{T:1016,E:1224,P:1309},MK04:{T:950,E:1122,P:1192},MK06:{T:1016,E:1224,P:1309},MK08:{T:1075,E:1321,P:1421},MK10:{T:1170,E:1452,P:1567},PK06:{T:1104,E:1355,P:1457},PK08:{T:1177,E:1476,P:1597},PK10:{T:1258,E:1599,P:1738},SK06:{T:1199,E:1502,P:1625},SK08:{T:1273,E:1632,P:1778},SK10:{T:1361,E:1772,P:1939},UK08:{T:1368,E:1790,P:1963}}},
  GPL:{name:"Holz-Klapp-Schwingfenster",short:"Holz Klapp-Schwing",desc:"Panoramablick, natürliches Holz",icon:"sun",prices:{CK04:{T:740,E:862,P:912},CK06:{T:757,E:904,P:964},FK06:{T:819,E:995,P:1067},FK08:{T:847,E:1055,P:1140},MK04:{T:797,E:968,P:1038},MK06:{T:847,E:1055,P:1140},MK08:{T:893,E:1139,P:1239},MK10:{T:966,E:1248,P:1363},PK06:{T:915,E:1166,P:1268},PK08:{T:972,E:1270,P:1391},PK10:{T:1034,E:1375,P:1514},SK06:{T:989,E:1291,P:1415},SK08:{T:1045,E:1404,P:1551},SK10:{T:1113,E:1524,P:1691},UK04:{T:989,E:1285,P:1405},UK08:{T:1118,E:1541,P:1713}}}
};

export const EDW: Record<SizeCode, number> = {CK02:139,CK04:148,CK06:153,FK04:153,FK06:167,FK08:172,MK04:163,MK06:172,MK08:180,MK10:206,PK06:196,PK08:206,PK10:218,SK06:206,SK08:211,SK10:234,UK04:206,UK08:223,UK10:249};

export const SHUTTERS: Record<ShutterCode, Accessory> = {
  SSL:{name:"Solar-Rollladen",short:"SSL Solar",prices:{CK02:627,CK04:648,CK06:664,FK04:675,FK06:702,FK08:707,MK04:696,MK06:723,MK08:750,MK10:793,PK06:771,PK08:803,PK10:846,SK06:825,SK08:862,SK10:900,UK04:873,UK08:927,UK10:970}},
  SML:{name:"Elektro-Rollladen",short:"SML Elektro",prices:{CK02:440,CK04:461,CK06:477,FK04:488,FK06:515,FK08:520,MK04:509,MK06:536,MK08:563,MK10:606,PK06:584,PK08:616,PK10:659,SK06:638,SK08:675,SK10:713,UK04:686,UK08:740,UK10:783}}
};

export const BLINDS: Record<BlindCode, Accessory> = {
  DKL:{name:"Verdunkelungsrollo manuell",short:"DKL Manuell",prices:{CK02:82,CK04:94,CK06:104,FK04:103,FK06:113,FK08:117,MK04:108,MK06:117,MK08:121,MK10:128,PK06:125,PK08:135,PK10:146,SK06:142,SK08:150,SK10:168,UK04:150,UK08:163,UK10:180}},
  DSL:{name:"Verdunkelungsrollo solar",short:"DSL Solar",prices:{CK02:217,CK04:229,CK06:239,FK04:238,FK06:248,FK08:252,MK04:243,MK06:252,MK08:256,MK10:263,PK06:260,PK08:270,PK10:281,SK06:277,SK08:285,SK10:303,UK04:285,UK08:298,UK10:315}}
};

export const LABOR = { demontage:100, einbau:300, eindeckrahmen:150, rollladen:120, rollo:50 } as const;
export const GL: Record<GlazingCode, GlazingMeta> = { T:{l:"THERMO",code:"-70",uw:"1,3",g:"0,46"},E:{l:"ENERGIE",code:"-84",uw:"1,0",g:"0,46"},P:{l:"ENERGIE PLUS",code:"-66",uw:"1,0",g:"0,44"} };

export const fmt = (n: number): string => new Intl.NumberFormat("de-DE").format(n);

export const MODEL_CODES = Object.keys(WINDOWS) as ModelCode[];
export const SIZE_CODES = Object.keys(DIMS) as SizeCode[];

/** Verfügbare Größen eines Modells (Reihenfolge wie im Katalog). */
export function sizesForModel(model: ModelCode): SizeCode[] {
  return Object.keys(WINDOWS[model].prices) as SizeCode[];
}

/** Rollläden, für die es zu dieser Größe einen Preis gibt. */
export function shuttersForSize(size: SizeCode): ShutterCode[] {
  return (Object.keys(SHUTTERS) as ShutterCode[]).filter((s) => size in SHUTTERS[s].prices);
}

/** Verdunkelungsrollos, für die es zu dieser Größe einen Preis gibt. */
export function blindsForSize(size: SizeCode): BlindCode[] {
  return (Object.keys(BLINDS) as BlindCode[]).filter((b) => size in BLINDS[b].prices);
}

/** Förderrelevant nach BEG EM / ESanMV: Uw ≤ 1,0 → nur ENERGIE und ENERGIE PLUS. */
export function isEligibleGlazing(glazing: GlazingCode): boolean {
  return glazing === "E" || glazing === "P";
}

/** Außenmaße in cm aus dem Größencode (z. B. MK08 → 78×140). */
export function dimsCm(size: SizeCode): { widthCm: number; heightCm: number } {
  const [w, h] = DIMS[size].split("×").map(Number);
  return { widthCm: w, heightCm: h };
}
