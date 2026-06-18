import type { LottoGameState } from '@/types'
import LottoGame from './LottoGame'

const DATA = [
    [0, 2, 5, 6, 7, 8, 9],
    [0, 1, 2, 5, 6, 9, 10],
    [0, 3, 5, 6, 7, 8, 10],
    [1, 3, 5, 6, 8, 9, 10],
    [0, 1, 3, 5, 6, 7, 9],
    [0, 2, 3, 5, 8, 9, 10],
    [1, 2, 3, 5, 7, 8, 9],
    [0, 1, 2, 3, 5, 7, 10],
    [1, 4, 5, 6, 7, 9, 10],
    [0, 1, 4, 5, 6, 7, 8],
    [2, 4, 5, 7, 8, 9, 10],
    [0, 2, 4, 5, 6, 7, 10],
    [1, 2, 4, 5, 6, 8, 9],
    [0, 1, 2, 4, 5, 8, 10],
    [0, 3, 4, 5, 7, 9, 10],
    [1, 3, 4, 5, 7, 8, 10],
    [0, 1, 3, 4, 5, 8, 9],
    [2, 3, 4, 5, 6, 8, 10],
    [0, 2, 3, 4, 5, 6, 9],
    [1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 6, 7, 8, 10],
    [0, 3, 6, 7, 8, 9, 10],
    [1, 2, 3, 6, 7, 8, 10],
    [0, 1, 2, 3, 7, 9, 10],
    [0, 4, 6, 7, 8, 9, 10],
    [0, 1, 4, 6, 7, 8, 9],
    [0, 1, 2, 4, 8, 9, 10],
    [0, 1, 2, 4, 7, 9, 10],
    [1, 3, 4, 7, 8, 9, 10],
    [0, 1, 3, 4, 6, 8, 10],
    [2, 3, 4, 6, 8, 9, 10],
    [2, 3, 4, 6, 7, 9, 10],
    [0, 2, 3, 4, 6, 7, 8],
    [1, 2, 3, 4, 6, 7, 9],
    [0, 1, 2, 3, 4, 7, 8],
    [0, 1, 2, 3, 4, 6, 10]
]

interface Lotto7511Props {
    persistedState?: LottoGameState
    onStateChange?: (state: LottoGameState) => void
}

export default function Lotto7511({ persistedState, onStateChange }: Lotto7511Props) {
    return <LottoGame data={DATA} guarantee={5} entries={11} panelName="Master Cover" persistedState={persistedState} onStateChange={onStateChange} />
}
