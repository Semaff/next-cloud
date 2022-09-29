export function cutLongWord(word: string) {
    if (word.length <= 16) {
        return word
    }

    return word.slice(0, 13) + "...";
}