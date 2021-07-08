export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length
    let temporaryValue
    let randomIndex

    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

export function randomElement<T>(array: T[]): T {
    return array[Math.floor(Math.random() * array.length)]
}

export function removeElement<T>(array: T[], element: T): T[] {
    return array.filter(currentElement => element !== currentElement)
}
