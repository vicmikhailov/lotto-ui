import type { LottoGameState } from '@/types'
import LottoGame from './LottoGame'

const DATA = [
    [0, 1, 2, 3, 7, 8],
    [0, 1, 4, 7, 8, 9],
    [0, 2, 4, 7, 8, 9],
    [0, 1, 3, 4, 7, 9],
    [2, 3, 4, 7, 8, 9],
    [1, 2, 3, 4, 8, 9],
    [0, 1, 2, 3, 4, 9],
    [1, 2, 5, 7, 8, 9],
    [0, 1, 2, 5, 7, 9],
    [0, 3, 5, 7, 8, 9],
    [0, 1, 3, 5, 8, 9],
    [0, 2, 3, 5, 8, 9],
    [1, 2, 3, 5, 7, 9],
    [0, 1, 4, 5, 7, 9],
    [2, 4, 5, 7, 8, 9],
    [0, 1, 2, 4, 5, 8],
    [0, 3, 4, 5, 8, 9],
    [1, 3, 4, 5, 7, 8],
    [0, 2, 3, 4, 5, 7],
    [1, 2, 3, 4, 5, 9],
    [0, 1, 2, 6, 8, 9],
    [1, 3, 6, 7, 8, 9],
    [0, 2, 3, 6, 7, 9],
    [0, 4, 6, 7, 8, 9],
    [1, 2, 4, 6, 7, 9],
    [1, 2, 4, 6, 7, 8],
    [0, 1, 2, 4, 6, 7],
    [0, 3, 4, 6, 7, 8],
    [0, 1, 3, 4, 6, 8],
    [0, 1, 3, 4, 6, 9],
    [2, 3, 4, 6, 8, 9],
    [0, 2, 3, 4, 6, 8],
    [1, 2, 3, 4, 6, 7],
    [0, 1, 5, 6, 7, 8],
    [0, 1, 5, 6, 7, 9],
    [2, 5, 6, 7, 8, 9],
    [0, 2, 5, 6, 7, 8],
    [0, 3, 5, 6, 8, 9],
    [0, 1, 3, 5, 6, 7],
    [2, 3, 5, 6, 7, 8],
    [1, 2, 3, 5, 6, 9],
    [1, 2, 3, 5, 6, 8],
    [0, 1, 2, 3, 5, 6],
    [0, 4, 5, 6, 7, 8],
    [1, 4, 5, 6, 8, 9],
    [0, 2, 4, 5, 6, 9],
    [1, 2, 4, 5, 6, 7],
    [3, 4, 5, 6, 7, 9],
    [0, 1, 3, 4, 5, 6],
    [2, 3, 4, 5, 6, 8]
]

interface Lotto6510Props {
    persistedState?: LottoGameState
    onStateChange?: (state: LottoGameState) => void
}

export default function Lotto6510({ persistedState, onStateChange }: Lotto6510Props) {
    return <LottoGame data={DATA} guarantee={5} entries={10} panelName="Premium Range" persistedState={persistedState} onStateChange={onStateChange} />
}
