import type { LottoGameState } from '@/types'
import LottoGame from './LottoGame'

const DATA = [
    [1, 2, 4, 5, 6, 7],
    [0, 1, 2, 4, 6, 7],
    [0, 1, 2, 5, 6, 7],
    [0, 3, 4, 5, 6, 7],
    [0, 1, 3, 4, 5, 6],
    [0, 1, 3, 4, 5, 7],
    [0, 2, 3, 4, 5, 7],
    [0, 2, 3, 4, 5, 6],
    [1, 2, 3, 5, 6, 7],
    [1, 2, 3, 4, 6, 7],
    [0, 1, 2, 3, 4, 5],
    [0, 1, 2, 3, 6, 7]
]

interface Lotto658Props {
    persistedState?: LottoGameState
    onStateChange?: (state: LottoGameState) => void
}

export default function Lotto658({ persistedState, onStateChange }: Lotto658Props) {
    return <LottoGame data={DATA} guarantee={5} entries={8} panelName="Precision Select" persistedState={persistedState} onStateChange={onStateChange} />
}
