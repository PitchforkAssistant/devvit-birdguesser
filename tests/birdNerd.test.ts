import {BirdNerdWord, birdNerdWordsToString, stringToBirdNerdWords} from "../src/types/birdNerd/word.js";

describe("birdNerdWordsToString", {}, () => {
    const testData: Record<string, BirdNerdWord[]> = {
        "": [],
        "word": [{word: "word", joiner: "none"}],
        "word ": [{word: "word", joiner: "space"}],
        "word-": [{word: "word", joiner: "hyphen"}],
        "firstsecond": [{word: "first", joiner: "none"}, {word: "second", joiner: "none"}],
        "first second": [{word: "first", joiner: "space"}, {word: "second", joiner: "none"}],
        "first-second": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "none"}],
        "first-second third": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "space"}, {word: "third", joiner: "none"}],
        "first-second thirdfourth": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "space"}, {word: "third", joiner: "none"}, {word: "fourth", joiner: "none"}],
        "first-second thirdfourth-": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "space"}, {word: "third", joiner: "none"}, {word: "fourth", joiner: "hyphen"}],
    };

    test.each(Object.entries(testData))("birdNerdWordsToString(%p) should return %p", (expected, input) => {
        expect(birdNerdWordsToString(input)).toStrictEqual(expected);
    });
});

describe("stringToBirdNerdWords", {}, () => {
    const testData: Record<string, BirdNerdWord[]> = {
        "": [],
        "word": [{word: "word", joiner: "none"}],
        "word ": [{word: "word", joiner: "space"}],
        "word-": [{word: "word", joiner: "hyphen"}],
        "first_second": [{word: "first", joiner: "none"}, {word: "second", joiner: "none"}],
        "first second": [{word: "first", joiner: "space"}, {word: "second", joiner: "none"}],
        "first-second": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "none"}],
        "first-second third": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "space"}, {word: "third", joiner: "none"}],
        "first-second third_fourth": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "space"}, {word: "third", joiner: "none"}, {word: "fourth", joiner: "none"}],
        "first-second third_fourth-": [{word: "first", joiner: "hyphen"}, {word: "second", joiner: "space"}, {word: "third", joiner: "none"}, {word: "fourth", joiner: "hyphen"}],
    };

    test.each(Object.entries(testData))("stringToBirdNerdWords(%p) should return %p", (input, expected) => {
        expect(stringToBirdNerdWords(input)).toStrictEqual(expected);
    });
});
