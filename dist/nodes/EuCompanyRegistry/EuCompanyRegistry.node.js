"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EuCompanyRegistry = void 0;

const REGISTRY_OPTIONS = [
  { name: "🇳🇴 Norway — Brønnøysundregistrene (Brreg.no Org.nr & MVA)", value: "samdhitosaja~brreg-no-norway-company-registry-scraper" },
  { name: "🇸🇪 Sweden — Bolagsverket & Hitta.se (Org.nr & +46 Contacts)", value: "samdhitosaja~bolagsverket-hitta-se-sweden-b2b-scraper" },
  { name: "🇫🇮 Finland — PRH / YTJ Official Registry (Y-tunnus & +358 Contacts)", value: "samdhitosaja~ytj-fi-finland-company-registry-scraper" },
  { name: "🇩🇰 Denmark — CVR / Virk Official Registry (8-Digit CVR & +45 Contacts)", value: "samdhitosaja~cvr-virk-dk-denmark-company-b2b-scraper" },
  { name: "🇵🇱 Poland — Ministry of Justice KRS, NIP & REGON Registry", value: "samdhitosaja~krs-ceidg-pl-poland-company-registry-scraper" },
  { name: "🇮🇹 Italy — Registro delle Imprese, Partita IVA & MisterImprese", value: "samdhitosaja~registroimprese-paginegialle-it-italy-b2b-scraper" },
  { name: "🇳🇱 Netherlands — KVK.nl (Kamer van Koophandel) Company Registry", value: "samdhitosaja~kvk-nl-company-b2b-scraper" },
  { name: "🇳🇱🇧🇪 Benelux — Belgium KBO/BCE + Netherlands KVK + Goudengids", value: "samdhitosaja~benelux-b2b-goudengids-telefoongids-kvk-scraper" },
  { name: "🇩🇪 Germany — Gelbe Seiten (gelbeseiten.de) B2B Lead Scraper", value: "samdhitosaja~gelbeseiten-de-b2b-lead-scraper" },
  { name: "🇦🇹 Austria — WKO.at & Herold.at Chamber & B2B Lead Scraper", value: "samdhitosaja~wko-herold-at-austria-b2b-lead-scraper" },
  { name: "🇨🇭 Switzerland — Local.ch Official Swiss B2B Lead Scraper", value: "samdhitosaja~local-ch-swiss-b2b-lead-scraper" },
  { name: "🇳🇱 Netherlands Healthcare — ZorgkaartNederland Providers & Clinics", value: "samdhitosaja~zorgkaartnederland-nl-healthcare-b2b-scraper" },
  { name: "🇳🇱 Netherlands Commercial Trucks — Marktplaats.nl + Dealer KVK", value: "samdhitosaja~marktplaats-nl-commercial-trucks-kvk-scraper" },
  { name: "🇪🇺 Pan-European — Freight Forwarders & Logistics Directory", value: "samdhitosaja~eu-freight-logistics-directory-scraper" },
  { name: "🇪🇺 Pan-European — 3PL Warehousing, Cold Chain & Customs Brokers", value: "samdhitosaja~eu-supply-chain-3pl-warehousing-b2b-scraper" },
  { name: "🇪🇺 Pan-European — Road Transport & Haulage Carrier Fleet", value: "samdhitosaja~eu-road-transport-carrier-fleet-scraper" },
];

class EuCompanyRegistry {
  constructor() {
    this.description = {
      displayName: "European Company Registry & B2B Leads",
      name: "euCompanyRegistry",
      group: ["transform"],
      version: 1,
      subtitle: '={{$parameter["actorId"]}}',
      description:
        "Extract verified European companies, VAT/Registry IDs (KVK, Brreg, KRS, CVR, YTJ, Bolagsverket, WKO, Partita IVA), direct emails & phones via Apify.",
      defaults: {
        name: "EU Company Registry & B2B",
      },
      inputs: ["main"],
      outputs: ["main"],
      credentials: [
        {
          name: "apifyEuRegistryApi",
          required: true,
        },
      ],
      properties: [
        {
          displayName: "European Registry / Directory",
          name: "actorId",
          type: "options",
          options: REGISTRY_OPTIONS,
          default: "samdhitosaja~brreg-no-norway-company-registry-scraper",
          required: true,
        },
        {
          displayName: "Search Query / Keyword",
          name: "query",
          type: "string",
          default: "Transport",
          required: true,
          description: "Company name or industry keyword (e.g. Transport, Logistyka, Spedition)",
        },
        {
          displayName: "City / Location Filter",
          name: "location",
          type: "string",
          default: "",
          description: "Optional city or municipality filter (e.g. Oslo, Stockholm, Warszawa, Milano, Rotterdam)",
        },
        {
          displayName: "Enrich Websites for Direct Emails & Phones",
          name: "enrichWebsites",
          type: "boolean",
          default: true,
        },
        {
          displayName: "Max Items",
          name: "maxItems",
          type: "number",
          default: 20,
        },
      ],
    };
  }

  async execute() {
    const items = this.getInputData();
    const returnData = [];
    const credentials = await this.getCredentials("apifyEuRegistryApi");
    const token = credentials.apiToken;

    for (let i = 0; i < items.length; i++) {
      const actorId = this.getNodeParameter("actorId", i);
      const query = this.getNodeParameter("query", i);
      const location = this.getNodeParameter("location", i, "");
      const enrichWebsites = this.getNodeParameter("enrichWebsites", i, true);
      const maxItems = this.getNodeParameter("maxItems", i, 20);

      const body = {
        searchQueries: [query],
        searchQuery: query,
        location,
        city: location,
        municipality: location,
        enrichWebsites,
        enrichKrsApi: enrichWebsites,
        maxItems,
      };

      const response = await this.helpers.httpRequest({
        method: "POST",
        url: `https://api.apify.com/v2/acts/${actorId}/run-sync-get-dataset-items?token=${encodeURIComponent(token)}&memory=256&timeout=90`,
        body,
        json: true,
      });

      if (Array.isArray(response)) {
        for (const row of response) {
          returnData.push({ json: row });
        }
      }
    }
    return [returnData];
  }
}
exports.EuCompanyRegistry = EuCompanyRegistry;
