/**
 * PUTRACNS — OHIF Viewer v3.12.x configuration
 * Served at /viewer-ohif/app-config.js (baked into the OHIF dist at image build).
 * Data source: the app's DICOMweb proxy (/api/dicom-web, /api/wado) which
 * authenticates with the logged-in session and forwards to Orthanc.
 * Format follows OHIF's official docker-nginx-orthanc reference config.
 */
window.config = {
  name: 'config/app-config.js',
  routerBasename: '/viewer-ohif',
  defaultDataSourceName: 'dicomweb',
  extensions: [],
  modes: [],
  customizationService: {},
  // PUTRACNS — suppress OHIF's built-in "INVESTIGATIONAL USE ONLY" dialog.
  // Option values (OHIF enum): 'always' | 'configure' | 'never'.
  investigationalUseDialog: {
    option: 'never',
  },
  // PUTRACNS — replace the OHIF top-header logo with the PadiMedical mark.
  // OHIF renders whiteLabeling.createLogoComponentFn(React, config) if present,
  // otherwise falls back to the built-in OHIFLogoHorizontal. Assets are served
  // from /viewer-ohif/assets/ (copied via FrontEnd/public/viewer-ohif/assets).
  whiteLabeling: {
    // Inlined as a data URI so it needs no extra asset wiring in the CRA build.
    createLogoComponentFn: function (React, config) {
      return React.createElement('img', {
        src: 'data:image/png;base64,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',
        alt: 'PadiMedical',
        style: { height: '32px', width: 'auto', display: 'block' },
      });
    },
  },
  // PUTRACNS patient-scoped viewer: showStudyList=false removes the worklist
  // route and the top-left back arrow (isReturnEnabled=false in ViewerHeader).
  // Users enter via PUTRA CNS with ?StudyInstanceUIDs=... and cannot navigate
  // back to the general study/patient list (see ViewerHeader no-op too).
  showStudyList: false,
  maxNumberOfWebWorkers: 3,
  // Cap cornerstone's decoded-image cache. Default is 3GB. Raised from 256MB
  // → 1GB: Cornerstone 5.x (OHIF v3.13.0) throws a FATAL CACHE_SIZE_EXCEEDED
  // error when a new image can't fit the cache (4.x evicted gracefully), and
  // 256MB was too small for large volumes/series — it broke image loading.
  // 1GB still bounds worst-case memory ~2GB (CPU+GPU) on desktop while giving
  // enough headroom for large studies.
  maxCacheSize: 1073741824,
  showWarningMessageForCrossOrigin: true,
  showCPUFallbackMessage: true,
  showLoadingIndicator: true,
  experimentalStudyBrowserSort: false,
  strictZSpacingForVolumeViewport: true,
  groupEnabledModesFirst: true,
  allowMultiSelectExport: false,
  maxNumRequests: {
    interaction: 100,
    thumbnail: 75,
    prefetch: 60,
  },
  showErrorDetails: 'always',
  dataSources: [
    {
      namespace: '@ohif/extension-default.dataSourcesModule.dicomweb',
      sourceName: 'dicomweb',
      configuration: {
        friendlyName: 'PadiMedical PACS',
        name: 'PadiMedical',
        wadoUriRoot: '/api/wado',
        qidoRoot: '/api/dicom-web',
        wadoRoot: '/api/dicom-web',
        qidoSupportsIncludeField: true,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        // Serve frames as JPEG-LS (lossless) instead of raw 524KB pixel data:
        // ~281KB/frame for CT -> faster scroll, less bandwidth. Orthanc
        // transcodes on the fly; CharLS decoder is bundled in the viewer.
        requestTransferSyntaxUID: '1.2.840.10008.1.2.4.80',
        enableStudyLazyLoad: true,
        supportsFuzzyMatching: false,
        supportsWildcard: true,
        staticWado: true,
        singlepart: 'bulkdata,video',
      },
    },
  ],
  // Supported Keys: https://craig.is/killing/mice
  hotkeys: [
    // ~ Global
    {
      commandName: 'incrementActiveViewport',
      label: 'Next Viewport',
      keys: ['right'],
    },
    {
      commandName: 'decrementActiveViewport',
      label: 'Previous Viewport',
      keys: ['left'],
    },
    // ~ Cornerstone Extension
    { commandName: 'rotateViewportCW', label: 'Rotate Right', keys: ['r'] },
    { commandName: 'rotateViewportCCW', label: 'Rotate Left', keys: ['l'] },
    { commandName: 'invertViewport', label: 'Invert', keys: ['i'] },
    { commandName: 'flipViewportVertical', label: 'Flip Horizontally', keys: ['h'] },
    { commandName: 'flipViewportHorizontal', label: 'Flip Vertically', keys: ['v'] },
    { commandName: 'scaleUpViewport', label: 'Zoom In', keys: ['+'] },
    { commandName: 'scaleDownViewport', label: 'Zoom Out', keys: ['-'] },
    { commandName: 'fitViewportToWindow', label: 'Zoom to Fit', keys: ['='] },
    { commandName: 'resetViewport', label: 'Reset', keys: ['space'] },
    { commandName: 'nextImage', label: 'Next Image', keys: ['down'] },
    { commandName: 'previousImage', label: 'Previous Image', keys: ['up'] },
    { commandName: 'nextViewport', label: 'Next Viewport', keys: [']'] },
    { commandName: 'previousViewport', label: 'Previous Viewport', keys: ['['] },
  ],
};
