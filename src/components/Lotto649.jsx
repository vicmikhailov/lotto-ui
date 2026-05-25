import UniversalLotto from './UniversalLotto'

const DATA = [
    [0, 1, 4, 5, 6, 7],
    [0, 2, 4, 5, 7, 8],
    [1, 2, 4, 5, 6, 8],
    [0, 1, 2, 6, 7, 8],
    [0, 3, 4, 5, 6, 8],
    [1, 3, 4, 6, 7, 8],
    [0, 1, 3, 5, 7, 8],
    [2, 3, 5, 6, 7, 8],
    [0, 2, 3, 4, 6, 7],
    [1, 2, 3, 4, 5, 7],
    [0, 1, 2, 3, 5, 6],
    [0, 1, 2, 3, 4, 8]
]

export default function Lotto649() {
    return <UniversalLotto data={DATA} guarantee={4} entries={9}/>
}
