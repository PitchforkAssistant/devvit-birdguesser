import {describe, it, expect} from "vitest";
import {stringsToRowsSplitter} from "../src/utils/string.js";

describe("stringsSplitter", () => {
    it("should split strings correctly when total length is less than maxChars", () => {
        const strings = ["a", "b", "c"];
        const joiner = ",";
        const maxChars = 10;
        const result = stringsToRowsSplitter(strings, joiner, maxChars);
        expect(result).toEqual([["a", "b", "c"]]);
    });

    it("should split strings correctly when total length exceeds maxChars", () => {
        const strings = ["a", "b", "c"];
        const joiner = ",";
        const maxChars = 3;
        const result = stringsToRowsSplitter(strings, joiner, maxChars);
        expect(result).toEqual([["a"], ["b"], ["c"]]);
    });

    it("should handle empty strings array", () => {
        const strings: string[] = [];
        const joiner = ",";
        const maxChars = 10;
        const result = stringsToRowsSplitter(strings, joiner, maxChars);
        expect(result).toEqual([[]]);
    });

    it("should handle single long string", () => {
        const strings = ["abcdef"];
        const joiner = ",";
        const maxChars = 3;
        const result = stringsToRowsSplitter(strings, joiner, maxChars);
        expect(result).toEqual([["abcdef"]]);
    });

    it("should handle multiple strings with joiner length considered", () => {
        const strings = ["a", "bc", "def"];
        const joiner = "123";
        const maxChars = 5;
        const result = stringsToRowsSplitter(strings, joiner, maxChars);
        expect(result).toEqual([["a"], ["bc"], ["def"]]);
    });
});
