import type { LottoGameState } from '@/types'
import LottoGame from './LottoGame'

const DATA = [
    [0, 1, 2, 4, 5, 6, 7],
    [0, 1, 3, 4, 5, 6, 7],
    [0, 2, 3, 4, 5, 6, 7],
    [1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 7],
    [0, 1, 2, 3, 4, 6, 7]
]

interface Lotto758Props {
    persistedState?: LottoGameState
    onStateChange?: (state: LottoGameState) => void
}

export default function Lotto758({ persistedState, onStateChange }: Lotto758Props) {
    return <LottoGame data={DATA} guarantee={5} entries={8} panelName="Quick Strike" persistedState={persistedState} onStateChange={onStateChange} />
}
