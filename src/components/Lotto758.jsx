import UniversalLotto from './UniversalLotto'

export default function Lotto758() {
  const data = [
    [0, 1, 2, 4, 5, 6, 7],
    [0, 1, 3, 4, 5, 6, 7],
    [0, 2, 3, 4, 5, 6, 7],
    [1, 2, 3, 4, 5, 6, 7],
    [0, 1, 2, 3, 4, 5, 7],
    [0, 1, 2, 3, 4, 6, 7]
  ]

  return <UniversalLotto data={data} guarantee={5} entries={8} />
}
