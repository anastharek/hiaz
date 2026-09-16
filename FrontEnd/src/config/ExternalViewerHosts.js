/**
 * ExternalViewerHosts
 *
 * Central configuration for externally-hosted viewer / download endpoints.
 *
 * Historically every table component hard-coded `https://strokesvr.padimedical.com`
 * (the old PADI host, now dead -> blank white page). These values are now
 * centralised here so the deployment can be repointed in exactly one place.
 *
 * FASTPACS deployment hosts:
 *   - OSIMIS viewer shim : hiazosimis.anzverse.com  (proxies this PACS' Orthanc,
 *                          expects the *Orthanc study ID* in ?study=)
 *   - Stone Web Viewer   : hiazviewer.anzverse.com  (Orthanc's own Stone viewer)
 *
 * Usage:
 *   import { OSIMIS_VIEWER_HOST, STONE_VIEWER_HOST } from '../../config/ExternalViewerHosts';
 *   `${OSIMIS_VIEWER_HOST}/osimis-viewer/app/index.html?study=${orthancId}`
 */

// Runtime config injected at page load by the backend's /config.js route
// (window.__PACS_CONFIG__). Values are env-driven and override the compiled
// defaults below, so the deployment can be repointed without a rebuild.
const runtimeCfg =
  (typeof window !== "undefined" && window.__PACS_CONFIG__) || {};

// OSIMIS Web Viewer shim — accepts the Orthanc study ID.
export const OSIMIS_VIEWER_HOST =
  runtimeCfg.osimisViewerHost || "https://hiazosimis.anzverse.com";

// Orthanc Stone Web Viewer — accepts the Orthanc study ID.
export const STONE_VIEWER_HOST =
  runtimeCfg.stoneViewerHost || "https://hiazviewer.anzverse.com";

// Legacy host that used to serve WSI (whole-slide imaging), downloads and the
// Orthanc REST archive endpoints. No anZverse equivalent is configured yet, so
// these remain on the old host until one is provisioned.
export const LEGACY_PADI_HOST =
  runtimeCfg.legacyPadiHost || "https://strokesvr.padimedical.com";

export default {
  OSIMIS_VIEWER_HOST,
  STONE_VIEWER_HOST,
  LEGACY_PADI_HOST,
};
