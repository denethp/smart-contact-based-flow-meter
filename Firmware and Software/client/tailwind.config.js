/** @type {import('windcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  // content: ["./*"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        dark: "#212626",
        offwhite: "#f5f5f5", //f2f2f7
        cgray: "#e3e3e8",
        tgray: "#c7c7cd0",
        tbalck: "#111111",
        two: "#13003d", // Custom amber
        three: "#608afc",
        four: "#4530b3",
        five: "#412da8",
        six: "#f15a16",
      },
      fontFamily: {
        kblack: ["KantoraBlack"],
        kbold: ["KantoraBold"],
        kblack: ["KantoraExtraBlack"],
        kebold: ["KantoraExtraBold"],
        klight: ["KantoraLight"],
        kmedium: ["KantoraMedium"],
        kregular: ["KantoraRegular"],
        ksemibold: ["KantoraSemiBold"],
        kthin: ["KantoraThin"],
      },
    },
  },
  plugins: [],
};
