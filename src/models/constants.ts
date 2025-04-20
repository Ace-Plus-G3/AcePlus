import type { TCardType, TChips } from './type'

export const Cards: Array<TCardType> = [
  {
    value: 1,
    url: new URL('@/assets/cards/front/card_a.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 2,
    url: new URL('@/assets/cards/front/card_2.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 3,
    url: new URL('@/assets/cards/front/card_3.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 4,
    url: new URL('@/assets/cards/front/card_4.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 5,
    url: new URL('@/assets/cards/front/card_5.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 6,
    url: new URL('@/assets/cards/front/card_6.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 7,
    url: new URL('@/assets/cards/front/card_7.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 8,
    url: new URL('@/assets/cards/front/card_8.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 9,
    url: new URL('@/assets/cards/front/card_9.png', import.meta.url).href,
    playerCount: 0,
  },
  {
    value: 10,
    url: new URL('@/assets/cards/front/card_10.png', import.meta.url).href,
    playerCount: 0,
  },
]

export const chips: Array<TChips> = [
  { value: 1, image: new URL('@/assets/coins/1PESO.png', import.meta.url).href },
  { value: 5, image: new URL('@/assets/coins/5PESO.png', import.meta.url).href },
  { value: 10, image: new URL('@/assets/coins/10PESO.png', import.meta.url).href },
  { value: 50, image: new URL('@/assets/coins/50PESO.png', import.meta.url).href },
  { value: 100, image: new URL('@/assets/coins/100PESO.png', import.meta.url).href },
  { value: 500, image: new URL('@/assets/coins/500PESO.png', import.meta.url).href },
  { value: 1000, image: new URL('@/assets/coins/1KPESO.png', import.meta.url).href },
  { value: 5000, image: new URL('@/assets/coins/5KPESO.png', import.meta.url).href },
  { value: 10000, image: new URL('@/assets/coins/10KPESO.png', import.meta.url).href },
]
