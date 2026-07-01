const APP_VARIANT = process.env.APP_VARIANT;
const isDev = APP_VARIANT === "development";

export default {
  expo: {
    name: isDev ? "Wallyon Dev" : "Wallyon",
    slug: "Wallyon",
    owner: "duobyteapps",
    version: "1.0.4",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: isDev ? "wallyon-dev" : "wallyon",
    userInterfaceStyle: "automatic",

    ios: {
      bundleIdentifier: isDev
        ? "com.duobyteapps.wallyon.dev"
        : "com.duobyteapps.wallyon",
      supportsTablet: false,
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        CFBundleDevelopmentRegion: "tr",
        CFBundleLocalizations: ["tr"],
      },
    },

    android: {
      package: isDev
        ? "com.duobyteapps.wallyon.dev"
        : "com.duobyteapps.wallyon",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#0B0B14",
      },
      predictiveBackGestureEnabled: false,
    },

    web: {
      output: "static",
      favicon: "./assets/images/favicon.png",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          backgroundColor: "#0B0B14",
          image: "./assets/images/splash-icon.png",
          imageWidth: 120,
        },
      ],
    ],

    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },

    extra: {
      router: {},
      eas: {
        projectId: "5eb3250d-0b7a-421d-b526-b04e7a82ca4f",
      },
    },

    runtimeVersion: {
      policy: "appVersion",
    },

    updates: {
      url: "https://u.expo.dev/5eb3250d-0b7a-421d-b526-b04e7a82ca4f",
    },
  },
};
