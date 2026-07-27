module.exports = {
  ci: {
    collect: {
      numberOfRuns: 2,
      settings: {
        chromeFlags: "--no-sandbox",
      },
      url: ["http://127.0.0.1:3000/", "http://127.0.0.1:3000/es"],
    },
    assert: {
      assertions: {
        "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "pessimistic" }],
        "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "pessimistic" }],
      },
    },
    upload: {
      outputDir: "./.lighthouseci",
      target: "filesystem",
    },
  },
};
