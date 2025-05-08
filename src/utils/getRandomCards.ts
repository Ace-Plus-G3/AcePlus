import { probabilityRate } from '@/models/constants'
import type { TCardType } from '@/models/type'

export function getRandomCards(cards: Array<TCardType>): Array<TCardType> {
  const cardsDeck: Array<TCardType> = JSON.parse(JSON.stringify(cards))
  const selectedCards: Array<TCardType> = []

  const shouldIncludeAce: boolean = Math.random() < probabilityRate.aceCardRate // 10% chance of appearing
  const aceIndex: number = cardsDeck.findIndex((card: TCardType) => card.value === 1)

  if (shouldIncludeAce && aceIndex !== -1) {
    selectedCards.push(cardsDeck[aceIndex])
    cardsDeck.splice(aceIndex, 1)

    for (let i = selectedCards.length; i < 4; i++) {
      const randomIndex: number = Math.floor(Math.random() * cardsDeck.length)
      selectedCards.push(cardsDeck[randomIndex])
      cardsDeck.splice(randomIndex, 1)
    }
  } else {
    if (aceIndex !== -1) {
      cardsDeck.splice(aceIndex, 1)
    }

    for (let i = selectedCards.length; i < 4; i++) {
      const randomIndex: number = Math.floor(Math.random() * cardsDeck.length)
      selectedCards.push(cardsDeck[randomIndex])
      cardsDeck.splice(randomIndex, 1)
    }
  }

  const multipliersChanceOfAppearing = Math.random() < probabilityRate.multipliersRate // 30% chance of appearing

  if (multipliersChanceOfAppearing) {
    // multipliers
    const multi = [1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2]
    const selectedMulti: number[] = []

    const numberOfCardWithMultiplier = Math.floor(Math.random() * 4) + 1

    for (let i = 0; i < numberOfCardWithMultiplier; i++) {
      const randomMulti = Math.floor(Math.random() * multi.length)
      selectedMulti.push(multi[randomMulti])
      multi.splice(randomMulti, 1)
    }

    selectedCards.forEach((card, index) => {
      if (index < selectedMulti.length) {
        card.randomMultiplier = selectedMulti[index]
      }
    })
  }

  return selectedCards.sort(() => Math.random() - 0.5)
}
