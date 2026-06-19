import type { LottoGameState } from '@/types'
import LottoGame from './LottoGame'

const DATA = [
    [0,  1,  5,  7,  8,  9],
    [0,  2,  5,  6,  7,  9],
    [0,  1,  2,  6,  7,  8],
    [1,  3,  5,  6,  7,  9],
    [0,  1,  3,  5,  6,  8],
    [2,  3,  5,  6,  7,  8],
    [0,  2,  3,  5,  8,  9],
    [0,  1,  2,  3,  6,  9],
    [0,  4,  5,  6,  8,  9],
    [2,  4,  6,  7,  8,  9],
    [1,  2,  4,  5,  7,  9],
    [0,  1,  2,  4,  5,  6],
    [0,  1,  2,  4,  8,  9],
    [3,  4,  5,  7,  8,  9],
    [0,  3,  4,  5,  6,  7],
    [1,  3,  4,  6,  8,  9],
    [0,  1,  3,  4,  7,  8],
    [0,  2,  3,  4,  7,  9],
    [1,  2,  3,  4,  5,  8],
    [1,  2,  3,  4,  6,  7]
]

interface Lotto6410Props {
    persistedState?: LottoGameState
    onStateChange?: (state: LottoGameState) => void
}

export default function Lotto6410({ persistedState, onStateChange }: Lotto6410Props) {
    return <LottoGame data={DATA} guarantee={4} entries={10} panelName="Balanced Play" persistedState={persistedState} onStateChange={onStateChange} />
}
