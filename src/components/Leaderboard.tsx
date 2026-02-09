"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Trophy, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface Entry {
    teamName: string
    rmse_10: number
    rmse_30: number
    rmse_60: number
    timestamp: number
}

export function Leaderboard() {
    const [entries, setEntries] = useState<Entry[]>([])
    const [loading, setLoading] = useState(true)

    const fetchLeaderboard = async () => {
        setLoading(true)
        try {
            const res = await fetch("/api/leaderboard?t=" + Date.now()) // prevent cache
            if (res.ok) {
                const data = await res.json()
                setEntries(data)
            }
        } catch (error) {
            console.error("Failed to fetch leaderboard", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeaderboard()
    }, [])

    return (
        <Card className="w-full backdrop-blur-xl bg-zinc-900/50 border-zinc-800">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle className="flex items-center space-x-2">
                        <Trophy className="w-5 h-5 text-yellow-500" />
                        <span>Leaderboard</span>
                    </CardTitle>
                    <CardDescription>Top performing models ranked by 2-month RMSE</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={fetchLeaderboard} disabled={loading}>
                    <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="rounded-md border border-zinc-800 overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-zinc-950 text-zinc-400 font-medium">
                            <tr>
                                <th className="p-3">Rank</th>
                                <th className="p-3">Team</th>
                                <th className="p-3 text-right">10 Day RMSE</th>
                                <th className="p-3 text-right">1 Month RMSE</th>
                                <th className="p-3 text-right text-white">2 Month RMSE</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                            {entries.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-4 text-center text-zinc-500">
                                        No submissions yet. Be the first!
                                    </td>
                                </tr>
                            ) : (
                                entries.map((entry, index) => (
                                    <tr key={index} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="p-3 text-zinc-500 font-mono">#{index + 1}</td>
                                        <td className="p-3 font-medium text-white">{entry.teamName}</td>
                                        <td className="p-3 text-right text-zinc-400">{entry.rmse_10.toFixed(3)}</td>
                                        <td className="p-3 text-right text-zinc-400">{entry.rmse_30.toFixed(3)}</td>
                                        <td className="p-3 text-right font-bold text-primary">{entry.rmse_60.toFixed(3)}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </CardContent>
        </Card>
    )
}
