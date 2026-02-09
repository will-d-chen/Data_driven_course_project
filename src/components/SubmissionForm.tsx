"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Upload, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function SubmissionForm() {
    const [file, setFile] = useState<File | null>(null)
    const [teamName, setTeamName] = useState("")
    const [loading, setLoading] = useState(false)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!file || !teamName) return

        setLoading(true)
        setError(null)
        setResult(null)

        const formData = new FormData()
        formData.append("file", file)
        formData.append("teamName", teamName)

        try {
            const res = await fetch("/api/submit", {
                method: "POST",
                body: formData,
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Submission failed")
            }

            setResult(data)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md mx-auto relative overflow-hidden bg-white/5 backdrop-blur-sm border-duke-light/10 shadow-md">
            <div className="absolute inset-0 bg-gradient-to-br from-duke-light/5 to-duke-bg/5 z-0 pointer-events-none" />
            <CardHeader className="relative z-10">
                <CardTitle>Submit Predictions</CardTitle>
                <CardDescription>
                    Upload your CSV file containing temperature predictions.
                </CardDescription>
            </CardHeader>
            <CardContent className="relative z-10">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Team Name
                        </label>
                        <Input
                            placeholder="Enter your team name"
                            value={teamName}
                            onChange={(e) => setTeamName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            Prediction File (CSV)
                        </label>
                        <div className="relative group">
                            <input
                                type="file"
                                accept=".csv"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                            />
                            <div className={cn(
                                "flex flex-col items-center justify-center w-full h-32 rounded-md border-2 border-dashed border-duke-light/20 bg-black/20 transition-colors group-hover:bg-black/40 group-hover:border-duke-light/40",
                                file ? "border-duke-light/50 bg-duke-light/10" : ""
                            )}>
                                {file ? (
                                    <div className="flex items-center space-x-2 text-duke-light">
                                        <CheckCircle className="w-6 h-6" />
                                        <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center space-y-2 text-duke-light/50 group-hover:text-duke-light/80">
                                        <Upload className="w-8 h-8" />
                                        <span className="text-xs">Drag & drop or click to upload</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading || !file || !teamName}>
                        {loading ? "Calculating RMSE..." : "Submit Prediction"}
                    </Button>
                </form>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-md flex items-start space-x-2 text-red-400 text-sm"
                    >
                        <AlertCircle className="w-5 h-5 shrink-0" />
                        <span>{error}</span>
                    </motion.div>
                )}

                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-2"
                    >
                        <div className="text-sm font-medium text-green-400 flex items-center space-x-2 mb-2">
                            <CheckCircle className="w-4 h-4" />
                            <span>Submission Successful!</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            <ScoreCard label="10 Day" score={result.rmse_10} />
                            <ScoreCard label="1 Month" score={result.rmse_30} />
                            <ScoreCard label="2 Month" score={result.rmse_60} />
                        </div>
                    </motion.div>
                )}
            </CardContent>
        </Card>
    )
}

function ScoreCard({ label, score }: { label: string, score: number | string }) {
    if (typeof score === 'string') return null; // Handle potential errors or "N/A" nicely if needed
    return (
        <div className="bg-black/30 border border-duke-light/10 p-2 rounded text-center shadow-sm">
            <div className="text-xs text-duke-light/60 mb-1">{label}</div>
            <div className="text-lg font-bold text-white tracking-tight">
                {Number(score).toFixed(2)}
            </div>
        </div>
    )
}
