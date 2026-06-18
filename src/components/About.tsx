import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

export default function About() {
  return (
    <div className="space-y-6">
      <header key="about-header" className="space-y-4">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">About Coverlot</h1>
        <p className="text-lg text-muted-foreground">
          Coverlot is a specialized tool designed to help lotto players explore combinations and coverage.
        </p>
      </header>

      <Card className="border border-border/60 bg-card/80 backdrop-blur">
        <CardHeader>
          <CardTitle>Your money well wasted</CardTitle>
          <CardDescription>Providing mathematical insights into lottery systems.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            The chances of winning major lotteries are astronomically low. For example, in Lotto Max in Canada,
            you select 7 winning numbers out of 50 to win the jackpot. There are approximately 100 million
            possible combinations.
          </p>
          <p>
            Coverlot helps you understand the concept of "covering" sets of numbers efficiently.
            Whether you are looking at 7-5-8, 7-5-9, or more complex systems, our goal is to
            visualize and analyze these combinations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
