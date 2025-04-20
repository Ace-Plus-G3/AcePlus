import type { TCardType } from '@/models/type'

export function getRandomCards(cards: Array<TCardType>): Array<TCardType> {
  const cardsDeck: Array<TCardType> = JSON.parse(JSON.stringify(cards))
  const selectedCards: Array<TCardType> = []

  // 10% chance of ace appearing
  const shouldIncludeAce: boolean = Math.random() < 0.1
  const aceIndex: number = cardsDeck.findIndex((card: TCardType) => card.value === 1)

  if (shouldIncludeAce && aceIndex !== -1) {
    // Include the ace in the selection
    selectedCards.push(cardsDeck[aceIndex])

    // remove from cardsDeck to avoid duplication
    cardsDeck.splice(aceIndex, 1)

    // Select 3 more random cards from the remaining deck
    while (selectedCards.length < 4) {
      const randomIndex: number = Math.floor(Math.random() * cardsDeck.length)
      selectedCards.push(cardsDeck[randomIndex])
      cardsDeck.splice(randomIndex, 1)
    }
  } else {
    // Remove ace from the deck if it shouldn't appear
    if (aceIndex !== -1) {
      cardsDeck.splice(aceIndex, 1)
    }

    // Select 4 random cards from the non-ace cards
    while (selectedCards.length < 4) {
      const randomIndex: number = Math.floor(Math.random() * cardsDeck.length)
      selectedCards.push(cardsDeck[randomIndex])
      cardsDeck.splice(randomIndex, 1)
    }
  }

  // Shuffle the selected cards to randomize their positions
  return selectedCards.sort(() => Math.random() - 0.5)
}
