import { SubmissionForm } from "@/components/SubmissionForm"
import { Leaderboard } from "@/components/Leaderboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileCode, Terminal } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-duke-blue text-duke-bg selection:bg-duke-light/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-duke-light/10 via-duke-blue to-duke-blue opacity-50 z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-duke-light bg-clip-text text-transparent">
            Beat the Weatherman
          </h1>
          <p className="text-xl text-duke-light/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            Develop a model to predict the temperature in Charlotte, NC for the next 2 months.

          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/data/weather_data.zip" download>
              <Button variant="outline" size="lg" className="h-12 px-8 text-base">
                <Download className="mr-2 h-5 w-5" />
                Download Dataset
              </Button>
            </a>
            <Button variant="outline" size="lg" className="h-12 px-8 text-base">
              View Project PDF
            </Button>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 pb-24 space-y-24">
        {/* Code Snippets Section */}
        <section className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-white/5 border-duke-light/10 backdrop-blur-sm shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Terminal className="mr-2 h-5 w-5 text-green-400" />
                  Python Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-black/30 p-4 rounded-md text-sm font-mono text-duke-light overflow-x-auto border border-duke-light/10">
                  {`import pandas as pd

# Load the dataset
df = pd.read_csv('Charlotte.csv')

# Display first few rows
print(df.head())`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-duke-light/10 backdrop-blur-sm shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileCode className="mr-2 h-5 w-5 text-orange-400" />
                  MATLAB Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-black/30 p-4 rounded-md text-sm font-mono text-duke-light overflow-x-auto border border-duke-light/10">
                  {`% Load the dataset
opts = detectImportOptions('Charlotte.csv');
data = readtable('Charlotte.csv', opts);

% Display first few rows
disp(head(data))`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Main Interface Grid */}
        <section className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white">Submit Your Model</h2>
              <p className="text-duke-light/70">
                Upload your predictions CSV. The file must contain 3 columns for day, time, and predicted temperatures corresponding to the next 60 days starting on 12:00 AM day 1828 (Sanity check: it should have 1440 rows).
              </p>
              <div className="mt-2">
                <a href="/data/smartcookie_predictions.csv" download className="text-sm font-medium text-duke-light hover:text-white underline flex items-center transition-colors">
                  <Download className="mr-1 h-3 w-3" />
                  Download example format
                </a>
              </div>
            </div>
            <SubmissionForm />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight text-white">Live Leaderboard</h2>
              <p className="text-duke-light/70">
                Rankings based on the Root Mean Squared Error (RMSE) for the 60-day prediction window.
              </p>
            </div>
            <Leaderboard />
          </div>
        </section>
      </main>

      <footer className="border-t border-duke-light/10 py-8 text-center text-duke-light/40 text-sm">
        <p>&copy; 2026 Dynamical Systems Lab</p>
      </footer>
    </div>
  )
}
