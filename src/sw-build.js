const workboxBuild = require('workbox-build');

const buildSW = () => {
  return workboxBuild.injectManifest({
    swSrc: 'src/sw-template.js',
    swDest: 'build/sw.js',
    globDirectory: 'build',
    globPatterns: [
      '**\/!(service-worker|precache-manifest.*).{js,css,html,png}',
    ],
    additionalManifestEntries: [
      {
        url: "https://kit.fontawesome.com/d98896c0aa.js",
        revision: null,
      },
      {
        url: "https://fonts.googleapis.com/css2?family=Mukta:wght@400;700&display=swap",
        revision: null,
      },
    ],
  });
}
buildSW();
