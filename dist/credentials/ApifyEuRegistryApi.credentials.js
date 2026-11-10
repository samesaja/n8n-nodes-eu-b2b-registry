"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApifyEuRegistryApi = void 0;

class ApifyEuRegistryApi {
  constructor() {
    this.name = "apifyEuRegistryApi";
    this.displayName = "Apify European Company Registry API";
    this.documentationUrl = "https://apify.com/samdhitosaja";
    this.properties = [
      {
        displayName: "Apify API Token",
        name: "apiToken",
        type: "string",
        typeOptions: { password: true },
        default: "",
        required: true,
        description: "Get your API token from https://console.apify.com/settings/integrations",
      },
    ];
  }
}
exports.ApifyEuRegistryApi = ApifyEuRegistryApi;
