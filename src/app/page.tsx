import { SubmissionForm } from "@/components/SubmissionForm"
import { Leaderboard } from "@/components/Leaderboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, FileCode, Terminal } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-100 selection:bg-blue-500/30">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-black to-black opacity-50 z-0" />
        <div className="container mx-auto px-4 relative z-10 text-center">

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Beat the Weatherman
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Develop a model to predict the temperature in Charlotte, NC for the next 2 months.

          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/data/weather_data.zip" download>
              <Button size="lg" className="h-12 px-8 text-base">
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
            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Terminal className="mr-2 h-5 w-5 text-green-400" />
                  Python Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-zinc-950 p-4 rounded-md text-sm font-mono text-gray-300 overflow-x-auto border border-zinc-800">
                  {`import pandas as pd

# Load the dataset
df = pd.read_csv('Charlotte.csv')

# Display first few rows
print(df.head())`}
                </pre>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900/50 border-zinc-800">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <FileCode className="mr-2 h-5 w-5 text-orange-400" />
                  MATLAB Loading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="bg-zinc-950 p-4 rounded-md text-sm font-mono text-gray-300 overflow-x-auto border border-zinc-800">
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
              <h2 className="text-3xl font-bold tracking-tight">Submit Your Model</h2>
              <p className="text-gray-400">
                Upload your predictions CSV. The file must contain a single column of predicted temperatures corresponding to the next 60 days starting on 12:00 AM day 1828 (Sanity check: it should have 1440 rows).
              </p>
            </div>
            <SubmissionForm />
          </div>

          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tight">Live Leaderboard</h2>
              <p className="text-gray-400">
                Rankings based on the Root Mean Squared Error (RMSE) for the 60-day prediction window.
              </p>
            </div>
            <Leaderboard />
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900 py-8 text-center text-gray-600 text-sm">
        <p>&copy; 2026</p>
      </footer>
    </div>
  )
}
