import {RedisClient} from "@devvit/public-api";
import {BirdNerdGamePartial, BirdNerdGuess, BirdNerdGuessedWord, defaultChances, getBirdNerdGame, getBirdNerdGuesses, storeBirdNerdGuesses} from "../utils/birdNerd.js";
import {shuffle} from "lodash";

export async function getBirdNerdGamePartial (redis: RedisClient, gameId: string): Promise<BirdNerdGamePartial | null> {
    const fullGame = await getBirdNerdGame(redis, gameId);
    if (!fullGame) {
        return null;
    }
    return {
        id: fullGame.id,
        name: fullGame.name,
        images: fullGame.images,
        choices: shuffle([...fullGame.choices.map(word => word.toLowerCase()), ...fullGame.answer.map(word => word.word.toLowerCase())]),
        answerShape: fullGame.answer.map(word => ({joiner: word.joiner})),
    };
}

export async function makeBirdNerdGuess (redis: RedisClient, userId: string, gameId: string, guess: string[]): Promise<BirdNerdGuess> {
    const fullGame = await getBirdNerdGame(redis, gameId);
    const existingGuesses = await getBirdNerdGuesses(redis, gameId, userId);
    if (!fullGame || existingGuesses && existingGuesses.length >= (fullGame.chances ?? defaultChances)) {
        return Array<BirdNerdGuessedWord>(guess.length).fill({word: " ", result: "incorrect"});
    }

    // Get a count of all the words in the answer
    const wordCounts: Record<string, number> = {};
    fullGame.answer.forEach(answer => {
        const word = answer.word.toLowerCase().trim();
        wordCounts[word] = (wordCounts[word] || 0) + 1;
    });

    // Track how many times each word has been seen
    const seenCounts: Record<string, number> = Object.fromEntries(Object.keys(wordCounts).map(word => [word, 0]));

    // Assume all guesses are incorrect
    const gameResult: BirdNerdGuess = guess.map(word => ({word, result: "incorrect"}));

    // Check for correct guesses
    fullGame.answer.forEach((answer, index) => {
        // We don't need to check the seenCounts here because it's impossible for a word to be correct and in the right spot more times than it appears in the answer
        if (answer.word.toLowerCase().trim() === guess[index].toLowerCase().trim()) {
            gameResult[index].result = "correct";
            seenCounts[answer.word.toLowerCase().trim()]++;
        }
    });

    // Check all the guessed words that are in the answer but not in the correct spot
    guess.forEach((rawWord, index) => {
        const word = rawWord.toLowerCase().trim();
        if (gameResult[index].result === "correct") {
            return;
        }
        // Only count the word as contains if it hasn't been seen more times than it appears in the answer
        // For example if the answer is "one one two three" and the guess is "one two one one" the third "one" should show as incorrect
        if (wordCounts[word] > (seenCounts[word] || 0)) {
            gameResult[index].result = "contains";
            seenCounts[word]++;
        }
    });

    await storeBirdNerdGuesses(redis, gameId, userId, [...existingGuesses || [], gameResult]);
    return gameResult;
}
