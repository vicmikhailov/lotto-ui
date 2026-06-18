import type { LottoGameState } from '@/types'
import LottoGame from './LottoGame'

const DATA = [
    [2, 6, 7, 8, 9, 10],
    [0, 3, 6, 7, 8, 10],
    [0, 1, 3, 6, 9, 10],
    [0, 2, 3, 7, 9, 10],
    [1, 2, 3, 6, 8, 9],
    [0, 1, 2, 3, 8, 9],
    [0, 4, 6, 7, 8, 9],
    [0, 1, 4, 8, 9, 10],
    [0, 2, 4, 7, 8, 10],
    [1, 2, 4, 6, 9, 10],
    [0, 1, 2, 4, 6, 7],
    [1, 3, 4, 7, 9, 10],
    [0, 1, 3, 4, 6, 10],
    [2, 3, 4, 6, 8, 10],
    [1, 2, 3, 4, 7, 8],
    [1, 5, 6, 7, 8, 10],
    [0, 1, 5, 7, 8, 9],
    [0, 2, 5, 6, 9, 10],
    [1, 2, 5, 6, 7, 9],
    [0, 1, 2, 5, 7, 10],
    [3, 5, 7, 8, 9, 10],
    [1, 3, 5, 6, 7, 9],
    [0, 2, 3, 5, 6, 7],
    [1, 2, 3, 5, 8, 10],
    [0, 1, 4, 5, 6, 8],
    [2, 4, 5, 7, 8, 9],
    [0, 2, 4, 5, 6, 8],
    [1, 2, 4, 5, 9, 10],
    [3, 4, 5, 6, 7, 10],
    [3, 4, 5, 6, 8, 9],
    [0, 3, 4, 5, 8, 10],
    [0, 1, 3, 4, 5, 7],
    [0, 2, 3, 4, 5, 9]
]

interface Lotto6411Props {
    persistedState?: LottoGameState
    onStateChange?: (state: LottoGameState) => void
}

export default function Lotto6411({ persistedState, onStateChange }: Lotto6411Props) {
    return <LottoGame data={DATA} guarantee={4} entries={11} panelName="Extended Range" persistedState={persistedState} onStateChange={onStateChange} />
}
