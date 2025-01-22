import {BirdNerdImage} from "../../../types/birdNerd/image.js";

export const guessRowHeight = 35;
export const answerRowHeight = 52;
export const defaultAspectRatio = 2;

export const horizontalLayoutPadding = 30;
export const verticalLayoutPadding = 20;

export const choiceCharacterWidth = 9;
export const choiceHeightColumn = 51;
export const choiceHeightRow = 35;

export const placeholderBirdNerdImage: BirdNerdImage = {
    url: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgZmlsbD0iY3VycmVudENvbG9yIj48cGF0aCBkPSJNNC40NDQgMTAuNjI1SDB2LTEuMjVoNC40NDR2MS4yNVpNMjAgOS4zNzVoLTQuNDQ0djEuMjVIMjB2LTEuMjVaTTEwLjYyNSAwaC0xLjI1djQuNDQ0aDEuMjVWMFptMCAxNS41NTZoLTEuMjVWMjBoMS4yNXYtNC40NDRaTTUuNSAxMy4zMTlsLS42MjUtMS4wODMtMy44NDggMi4yMjMuNjI1IDEuMDgyTDUuNSAxMy4zMTlabTEzLjQ3My03Ljc3OC0uNjI1LTEuMDgyTDE0LjUgNi42ODFsLjYyNSAxLjA4MyAzLjg0OC0yLjIyM1ptLTExLjIxLS42NjVMNS41NDEgMS4wMjdsLTEuMDgyLjYyNUw2LjY4MSA1LjVsMS4wODItLjYyNFptNy43NzggMTMuNDcyTDEzLjMxOCAxNC41bC0xLjA4Mi42MjUgMi4yMjMgMy44NDkgMS4wODItLjYyNlptMy40MzItMy44ODktMy44NDktMi4yMjMtLjYyNCAxLjA4MyAzLjg0OSAyLjIyMi42MjQtMS4wODJaTTUuNSA2LjY4MSAxLjY1MiA0LjQ1OWwtLjYyNSAxLjA4MiAzLjg0OSAyLjIyMy42MjQtMS4wODNabTIuMjYzIDguNDQzTDYuNjgyIDE0LjVsLTIuMjIzIDMuODQ4IDEuMDgyLjYyNSAyLjIyMi0zLjg0OVptNy43NzgtMTMuNDcyLTEuMDgyLS42MjUtMi4yMjMgMy44NDkgMS4wODIuNjI1IDIuMjIzLTMuODQ5WiI+PC9wYXRoPjwvc3ZnPg==",
    aspectRatio: 1,
    attribution: "Loading...",
};

export const colors = {
    // Primary app background
    background: "#d3dac2",

    // Used everywhere for actual elements
    text: "#111",
    border: "#e3e7d8",
    backgroundSecondary: "#dce1ce",

    // Used for guess and answer slots
    backgroundCorrect: "#77dd77",
    backgroundIncorrect: "#ff746c",
    backgroundContains: "#fdfd96",
    backgroundBlank: "rgba(0, 0, 0, 0.1)",

    // Mainly used for the choices buttons
    backgroundTertiary: "#e3e7d8",
    backgroundDisabled: "rgba(0, 0, 0, 0)",
    backgroundSelected: "rgba(0, 0, 0, 0.2)",
    textDisabled: "rgba(0, 0, 0, 0.5)",

    // These are used for overlay text and background
    textOverlay: "white",
    backgroundOverlay: "rgba(0, 0, 0, 0.75)",

    // Used for attribution tags
    backgroundDarkTag: "rgba(0, 0, 0, 0.5)",
    backgroundLightTag: "rgba(255, 255, 255, 0.5)",
    textLightTag: "black",
    textDarkTag: "white",
};
