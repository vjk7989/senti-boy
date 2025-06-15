"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Heart,
  MessageCircle,
  Share,
  Brain,
  Zap,
  Target,
  Copy,
  RotateCcw,
  Users,
  BarChart3,
  Eye,
  Filter,
  Upload,
  FileText,
  Download,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdvancedSentimentAnalyzer, type PostWithCommentsAnalysis } from "@/lib/sentiment-analyzer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WebScraperInterface } from "@/components/web-scraper-interface"
import { ExtractionMethodsGuide } from "@/components/extraction-methods-guide"

// Sample data for demonstration
const SAMPLE_POSTS = {
  travel: {
    post: `Just got back from the most incredible trip to Bali! 🌴✨ The sunsets were absolutely breathtaking and the people were so welcoming. Already planning my next adventure! 

#Bali #Travel #Wanderlust #Paradise #Grateful #Adventure #Sunset #TravelGram #Indonesia #Blessed`,
    comments: `@sarah_travels: OMG this looks amazing! 😍 I'm so jealous right now
@mike_adventures: Bali is incredible! Did you visit Ubud?
@jenny_wanderer: Your photos are stunning! What camera did you use?
@travel_buddy: This is giving me serious wanderlust 🥺
@local_guide_bali: Thank you for visiting our beautiful island! 🙏
@backpacker_life: How long were you there? Planning my own trip!
@photography_lover: The colors in this shot are perfect 📸
@beach_vibes: I need a vacation after seeing this 😭
@adventure_seeker: Bali never gets old! Such a magical place
@foodie_travels: Did you try the local cuisine? The food there is incredible!
@yoga_retreat: Perfect place for finding inner peace 🧘‍♀️
@budget_traveler: Looks expensive though... was it budget-friendly?
@island_hopper: Which part of Bali was your favorite?
@sunset_chaser: Those sunset colors are unreal! 🌅
@culture_explorer: The Balinese culture is so rich and beautiful`,
  },
  food: {
    post: `Tried making homemade pasta for the first time and... let's just say it didn't go as planned 😅 The kitchen looks like a flour bomb went off! But hey, at least it tastes decent? 

#CookingFail #HomeCooking #PastaDisaster #LearningToCook #KitchenMess #FirstTry #FoodieLife #CookingJourney`,
    comments: `@chef_maria: We've all been there! Practice makes perfect 👨‍🍳
@cooking_disasters: This belongs in my cooking fails collection 😂
@pasta_lover: Still looks better than my first attempt!
@mom_recipes: Next time try adding eggs to the dough, it helps!
@kitchen_newbie: At least you tried! I'm too scared to attempt pasta
@italian_nonna: Mamma mia! But everyone starts somewhere 🇮🇹
@foodie_friend: The mess is half the fun of cooking!
@cooking_tips: Pro tip: less flour on the counter, more in the dough
@home_chef: Your kitchen disaster stories are the best 😄
@pasta_perfectionist: It takes time to master, don't give up!
@messy_cook: My kitchen always looks like this after cooking
@beginner_baker: We should start a cooking fails support group
@food_blogger: These authentic moments are what cooking is about
@cleanup_crew: Hope you have a good vacuum cleaner! 
@cooking_student: Thanks for keeping it real! Most people only show perfect results`,
  },
  fitness: {
    post: `Completed my first 10K run today! 🏃‍♀️💪 Six months ago I could barely run for 5 minutes without getting winded. The journey has been tough but so worth it! 

To anyone starting their fitness journey - you got this! Every step counts 💯

#10K #Running #FitnessJourney #NeverGiveUp #HealthyLifestyle #RunnerHigh #PersonalRecord #Motivation #FitnessGoals #Endurance`,
    comments: `@runner_girl: Congratulations! That's such an amazing achievement! 🎉
@fitness_coach: So proud of your progress! What's your next goal?
@marathon_mom: I remember my first 10K! You should be so proud 
@gym_buddy: This is so inspiring! I need to get back to running
@couch_to_5k: You're motivating me to start my own running journey
@personal_trainer: Consistency is key and you've proven that!
@running_community: Welcome to the 10K club! 🏃‍♀️
@fitness_newbie: How did you stay motivated during tough days?
@health_journey: Your transformation is incredible! Keep going!
@running_tips: What training plan did you follow?
@endurance_athlete: The mental strength you've built is just as important
@workout_warrior: From 5 minutes to 10K - that's incredible progress!
@motivation_monday: Saving this post for when I need inspiration
@active_lifestyle: You're proof that anyone can do it with dedication
@running_shoes: Time to celebrate with some new running gear! 👟`,
  },
}

export default function AdvancedInstagramSentimentAnalyzer() {
  const [postContent, setPostContent] = useState("")
  const [commentsContent, setCommentsContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PostWithCommentsAnalysis | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [analysisMode, setAnalysisMode] = useState<"post-only" | "post-with-comments">("post-with-comments")
  const [commentFilter, setCommentFilter] = useState<"all" | "positive" | "negative" | "neutral">("all")
  const [showDetailedComments, setShowDetailedComments] = useState(true)

  // CSV-related state
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [csvData, setCsvData] = useState<any[]>([])
  const [csvResults, setCsvResults] = useState<any[]>([])
  const [isProcessingCsv, setIsProcessingCsv] = useState(false)

  const analyzer = new AdvancedSentimentAnalyzer()

  const loadSampleData = (type: keyof typeof SAMPLE_POSTS) => {
    const sample = SAMPLE_POSTS[type]
    setPostContent(sample.post)
    setCommentsContent(sample.comments)
    setAnalysisMode("post-with-comments")
  }

  const clearAll = () => {
    setPostContent("")
    setCommentsContent("")
    setResult(null)
    setError(null)
  }

  const handleScrapedData = (post: string, comments: string) => {
    setPostContent(post)
    setCommentsContent(comments)
    setAnalysisMode("post-with-comments")
  }

  const analyzeSentiment = async () => {
    if (!postContent.trim()) return

    setIsAnalyzing(true)
    setError(null)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200))

      let analysis: PostWithCommentsAnalysis

      if (analysisMode === "post-with-comments" && commentsContent.trim()) {
        analysis = analyzer.analyzePostWithComments(postContent, commentsContent)
      } else {
        const postAnalysis = analyzer.analyze(postContent)
        analysis = {
          post: postAnalysis,
          comments: [],
          commentStats: {
            totalComments: 0,
            averageSentiment: 0,
            sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
            engagementScore: 0,
          },
          overallAnalysis: {
            combinedSentiment: postAnalysis,
            postVsCommentsAlignment: 100,
            controversyScore: 0,
          },
        }
      }

      setResult(analysis)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred during analysis")
    } finally {
      setIsAnalyzing(false)
    }
  }

  // CSV handling functions
  const handleCsvUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
      parseCsvFile(file)
    }
  }

  const parseCsvFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      const lines = text.split("\n").filter((line) => line.trim())
      const headers = lines[0].split(",").map((h) => h.trim().replace(/"/g, ""))

      const data = lines.slice(1).map((line) => {
        const values = line.split(",").map((v) => v.trim().replace(/"/g, ""))
        const row: any = {}
        headers.forEach((header, index) => {
          row[header] = values[index] || ""
        })
        return row
      })

      setCsvData(data)
    }
    reader.readAsText(file)
  }

  // Update the CSV handling functions to treat each row as a comment from a single post
  const processCsvAnalysis = async () => {
    if (csvData.length === 0) return

    setIsProcessingCsv(true)

    // Check if we have a post content column or if we should treat this as comments-only
    const hasPostColumn = csvData.some((row) => row.post || row.caption || row.content)

    if (hasPostColumn) {
      // Original behavior - each row is a separate post
      const results = []

      for (let i = 0; i < csvData.length; i++) {
        const row = csvData[i]
        const postText = row.post || row.caption || row.content || ""
        const commentsText = row.comments || ""

        if (postText.trim()) {
          try {
            let analysis: PostWithCommentsAnalysis

            if (commentsText.trim()) {
              analysis = analyzer.analyzePostWithComments(postText, commentsText)
            } else {
              const postAnalysis = analyzer.analyze(postText)
              analysis = {
                post: postAnalysis,
                comments: [],
                commentStats: {
                  totalComments: 0,
                  averageSentiment: 0,
                  sentimentDistribution: { positive: 0, negative: 0, neutral: 0 },
                  engagementScore: 0,
                },
                overallAnalysis: {
                  combinedSentiment: postAnalysis,
                  postVsCommentsAlignment: 100,
                  controversyScore: 0,
                },
              }
            }

            results.push({
              rowIndex: i + 1,
              originalData: row,
              analysis,
              postText: postText.substring(0, 100) + (postText.length > 100 ? "..." : ""),
              commentsCount: commentsText ? commentsText.split("\n").filter((l) => l.trim()).length : 0,
            })
          } catch (error) {
            results.push({
              rowIndex: i + 1,
              originalData: row,
              error: error instanceof Error ? error.message : "Analysis failed",
              postText: postText.substring(0, 100) + (postText.length > 100 ? "..." : ""),
              commentsCount: 0,
            })
          }
        }

        await new Promise((resolve) => setTimeout(resolve, 100))
      }

      setCsvResults(results)
    } else {
      // New behavior - treat all rows as comments from a single post
      try {
        // Combine all comments into a single analysis
        const allComments = csvData
          .map((row, index) => {
            const commentText = row.comment || row.text || row.content || ""
            const author = row.author || row.username || row.user || ""

            if (commentText.trim()) {
              return author ? `${author}: ${commentText}` : commentText
            }
            return ""
          })
          .filter((comment) => comment.trim())
          .join("\n")

        if (allComments.trim()) {
          // Create a dummy post or use provided post content
          const postText = "Instagram Post Analysis" // Default post text
          const analysis = analyzer.analyzePostWithComments(postText, allComments)

          // Create individual comment results
          const commentResults = csvData
            .map((row, index) => {
              const commentText = row.comment || row.text || row.content || ""
              const author = row.author || row.username || row.user || ""

              if (commentText.trim()) {
                try {
                  const commentAnalysis = analyzer.analyze(commentText)
                  return {
                    rowIndex: index + 1,
                    originalData: row,
                    commentText: commentText.substring(0, 100) + (commentText.length > 100 ? "..." : ""),
                    author,
                    sentiment: commentAnalysis.overall,
                    confidence: commentAnalysis.confidence,
                    compound: commentAnalysis.scores.compound,
                    positive: commentAnalysis.scores.positive,
                    negative: commentAnalysis.scores.negative,
                    neutral: commentAnalysis.scores.neutral,
                    engagement: commentAnalysis.engagement.likelyEngagement,
                    virality: commentAnalysis.engagement.virality,
                    emotions: commentAnalysis.emotions,
                  }
                } catch (error) {
                  return {
                    rowIndex: index + 1,
                    originalData: row,
                    error: error instanceof Error ? error.message : "Analysis failed",
                    commentText: commentText.substring(0, 100) + (commentText.length > 100 ? "..." : ""),
                    author,
                  }
                }
              }
              return null
            })
            .filter((result) => result !== null)

          // Set both individual comment results and overall analysis
          setCsvResults([
            {
              type: "single-post-comments",
              overallAnalysis: analysis,
              commentResults,
              totalComments: commentResults.length,
            },
          ])
        }
      } catch (error) {
        setCsvResults([
          {
            error: error instanceof Error ? error.message : "Analysis failed",
            type: "single-post-comments",
          },
        ])
      }
    }

    setIsProcessingCsv(false)
  }

  const downloadCsvResults = () => {
    if (csvResults.length === 0) return

    // Check if this is single post with comments analysis
    if (csvResults[0]?.type === "single-post-comments") {
      const result = csvResults[0]

      if (result.error) {
        alert("Cannot export results due to analysis error")
        return
      }

      const headers = [
        "Row",
        "Author",
        "Comment Preview",
        "Sentiment",
        "Confidence",
        "Compound Score",
        "Positive %",
        "Negative %",
        "Neutral %",
        "Engagement Level",
        "Virality Score",
        "Top Emotion",
      ]

      const csvContent = [
        headers.join(","),
        ...result.commentResults.map((comment) => {
          if (comment.error) {
            return [
              comment.rowIndex,
              comment.author || "",
              `"${comment.commentText}"`,
              "ERROR",
              comment.error,
              "",
              "",
              "",
              "",
              "",
              "",
              "",
            ].join(",")
          }

          const topEmotion = Object.entries(comment.emotions).sort(([, a], [, b]) => b - a)[0]

          return [
            comment.rowIndex,
            comment.author || "",
            `"${comment.commentText}"`,
            comment.sentiment,
            comment.confidence.toFixed(1),
            comment.compound.toFixed(3),
            comment.positive.toFixed(1),
            comment.negative.toFixed(1),
            comment.neutral.toFixed(1),
            comment.engagement,
            comment.virality.toFixed(1),
            `${topEmotion[0]}: ${topEmotion[1].toFixed(0)}%`,
          ].join(",")
        }),
        "",
        "OVERALL POST ANALYSIS",
        `Total Comments: ${result.totalComments}`,
        `Average Sentiment: ${result.overallAnalysis.commentStats.averageSentiment.toFixed(2)}`,
        `Positive Comments: ${result.overallAnalysis.commentStats.sentimentDistribution.positive.toFixed(1)}%`,
        `Negative Comments: ${result.overallAnalysis.commentStats.sentimentDistribution.negative.toFixed(1)}%`,
        `Neutral Comments: ${result.overallAnalysis.commentStats.sentimentDistribution.neutral.toFixed(1)}%`,
        `Engagement Score: ${result.overallAnalysis.commentStats.engagementScore.toFixed(1)}%`,
        `Controversy Score: ${result.overallAnalysis.overallAnalysis.controversyScore.toFixed(1)}%`,
      ].join("\n")

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "instagram_comments_sentiment_analysis.csv"
      a.click()
      URL.revokeObjectURL(url)
      return
    }

    // Original multi-post export logic
    const headers = [
      "Row",
      "Post Preview",
      "Overall Sentiment",
      "Confidence",
      "Positive %",
      "Negative %",
      "Neutral %",
      "Engagement Level",
      "Virality Score",
      "Comments Count",
      "Avg Comment Sentiment",
      "Controversy Score",
    ]

    const csvContent = [
      headers.join(","),
      ...csvResults.map((result) => {
        if (result.error) {
          return [result.rowIndex, `"${result.postText}"`, "ERROR", result.error, "", "", "", "", "", "", "", ""].join(
            ",",
          )
        }

        const analysis = result.analysis
        return [
          result.rowIndex,
          `"${result.postText}"`,
          analysis.post.overall,
          analysis.post.confidence.toFixed(1),
          analysis.post.scores.positive.toFixed(1),
          analysis.post.scores.negative.toFixed(1),
          analysis.post.scores.neutral.toFixed(1),
          analysis.post.engagement.likelyEngagement,
          analysis.post.engagement.virality.toFixed(1),
          result.commentsCount,
          analysis.commentStats.averageSentiment.toFixed(2),
          analysis.overallAnalysis.controversyScore.toFixed(1),
        ].join(",")
      }),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "instagram_sentiment_analysis_results.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-600"
      case "negative":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return <TrendingUp className="w-4 h-4" />
      case "negative":
        return <TrendingDown className="w-4 h-4" />
      default:
        return <Minus className="w-4 h-4" />
    }
  }

  const getEngagementColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const filteredComments =
    result?.comments.filter((comment) => {
      if (commentFilter === "all") return true
      return comment.sentiment.overall === commentFilter
    }) || []

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Instagram Sentiment Analyzer Pro
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Advanced AI-powered sentiment analysis with comprehensive data extraction methods - completely offline and
            private
          </p>
        </div>

        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            <strong>Complete Solution!</strong> Multiple ways to extract Instagram data: web scraping, browser
            extensions, manual methods, and more. Choose the approach that fits your needs.
          </AlertDescription>
        </Alert>

        {/* Sample Data Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Quick Start - Try Sample Posts
            </CardTitle>
            <CardDescription>Click any sample to see the analyzer in action</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-3">
              <Button
                variant="outline"
                onClick={() => loadSampleData("travel")}
                className="h-auto p-4 text-left flex flex-col items-start"
              >
                <div className="font-medium text-blue-600">🌴 Travel Post</div>
                <div className="text-sm text-gray-500 mt-1">Bali vacation with 15 comments</div>
              </Button>
              <Button
                variant="outline"
                onClick={() => loadSampleData("food")}
                className="h-auto p-4 text-left flex flex-col items-start"
              >
                <div className="font-medium text-orange-600">🍝 Cooking Fail</div>
                <div className="text-sm text-gray-500 mt-1">Pasta disaster with 15 comments</div>
              </Button>
              <Button
                variant="outline"
                onClick={() => loadSampleData("fitness")}
                className="h-auto p-4 text-left flex flex-col items-start"
              >
                <div className="font-medium text-green-600">🏃‍♀️ Fitness Achievement</div>
                <div className="text-sm text-gray-500 mt-1">10K run success with 15 comments</div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Tabs defaultValue="scraper" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="scraper">Web Scraper</TabsTrigger>
            <TabsTrigger value="methods">All Methods</TabsTrigger>
            <TabsTrigger value="url">URL Fetcher</TabsTrigger>
            <TabsTrigger value="manual">Manual Input</TabsTrigger>
          </TabsList>

          <TabsContent value="scraper">
            <WebScraperInterface onDataScraped={handleScrapedData} />
          </TabsContent>

          <TabsContent value="methods">
            <ExtractionMethodsGuide />
          </TabsContent>

          <TabsContent value="url">
            <Card>
              <CardHeader>
                <CardTitle>URL Fetcher (Legacy)</CardTitle>
                <CardDescription>
                  Basic URL parsing - use Web Scraper or All Methods tabs for advanced functionality
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    The Web Scraper and All Methods tabs provide more comprehensive extraction options. This tab is kept
                    for compatibility.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manual">
            <Tabs defaultValue="text-input" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text-input">Text Input</TabsTrigger>
                <TabsTrigger value="csv-upload">CSV Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="text-input">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-5 h-5" />
                        Manual Content Input
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={clearAll}>
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Clear All
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      Manually paste Instagram post content for deep sentiment and engagement analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2 mb-4">
                      <Button
                        variant={analysisMode === "post-only" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAnalysisMode("post-only")}
                      >
                        Post Only
                      </Button>
                      <Button
                        variant={analysisMode === "post-with-comments" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setAnalysisMode("post-with-comments")}
                      >
                        Post + Comments
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="post-content">Instagram Post Content</Label>
                      <Textarea
                        id="post-content"
                        placeholder="Paste your Instagram post content here... Include captions, hashtags, emojis, and any text you want to analyze. 🚀✨"
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        className="min-h-[120px] text-base"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>
                          Characters: {postContent.length} | Words:{" "}
                          {
                            postContent
                              .trim()
                              .split(/\s+/)
                              .filter((w) => w).length
                          }
                        </span>
                        {postContent && (
                          <Button variant="ghost" size="sm" onClick={() => copyToClipboard(postContent)}>
                            <Copy className="w-3 h-3 mr-1" />
                            Copy
                          </Button>
                        )}
                      </div>
                    </div>

                    {analysisMode === "post-with-comments" && (
                      <div className="space-y-2">
                        <Label htmlFor="comments-content">Comments (one per line)</Label>
                        <Textarea
                          id="comments-content"
                          placeholder={`Paste comments here, one per line. Supported formats:
@username: This is amazing! Love it! 😍
@user2: Not really my style tbh
username - Great post!
Just a comment without username
Amazing work!`}
                          value={commentsContent}
                          onChange={(e) => setCommentsContent(e.target.value)}
                          className="min-h-[140px] text-base font-mono text-sm"
                        />
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Comments: {commentsContent.split("\n").filter((line) => line.trim()).length}</span>
                          {commentsContent && (
                            <Button variant="ghost" size="sm" onClick={() => copyToClipboard(commentsContent)}>
                              <Copy className="w-3 h-3 mr-1" />
                              Copy
                            </Button>
                          )}
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={analyzeSentiment}
                      disabled={!postContent.trim() || isAnalyzing}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <Brain className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing with AI...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Analyze Sentiment & Engagement
                        </>
                      )}
                    </Button>
                    {error && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="csv-upload">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      CSV Batch Analysis
                    </CardTitle>
                    <CardDescription>
                      Upload a CSV file with Instagram posts and comments for bulk sentiment analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <FileText className="h-4 w-4" />
                      <AlertDescription>
                        <strong>CSV Format:</strong> For multiple posts, use columns 'post'/'caption'/'content' and
                        'comments'. For single post comments, use columns 'comment'/'text'/'content' for comment text
                        and 'author'/'username'/'user' for usernames.
                      </AlertDescription>
                    </Alert>

                    {/* File Upload */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCsvUpload}
                          className="hidden"
                          id="csv-upload"
                        />
                        <label htmlFor="csv-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-sm text-gray-600 mb-1">
                            <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-500">CSV files only</p>
                        </label>
                      </div>

                      {csvFile && (
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <FileText className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-800">{csvFile.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {csvData.length} rows
                            </Badge>
                          </div>
                          <p className="text-sm text-blue-700">
                            File loaded successfully. {csvData.length} rows detected.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* CSV Preview */}
                    {csvData.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Data Preview</h4>
                          <Badge variant="outline">{csvData.length} rows</Badge>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 border-b">
                            <div className="grid grid-cols-3 gap-4 text-sm font-medium text-gray-700">
                              <div>Row</div>
                              <div>Post Content</div>
                              <div>Comments</div>
                            </div>
                          </div>
                          <div className="max-h-60 overflow-y-auto">
                            {csvData.slice(0, 5).map((row, index) => (
                              <div key={index} className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50">
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                  <div className="text-gray-500">#{index + 1}</div>
                                  <div className="text-gray-800 truncate">
                                    {(row.post || row.caption || row.content || "No post content").substring(0, 50)}...
                                  </div>
                                  <div className="text-gray-600 truncate">
                                    {row.comments ? `${row.comments.split("\n").length} comments` : "No comments"}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {csvData.length > 5 && (
                              <div className="px-4 py-2 text-center text-sm text-gray-500 bg-gray-50">
                                ... and {csvData.length - 5} more rows
                              </div>
                            )}
                          </div>
                        </div>

                        <Button
                          onClick={processCsvAnalysis}
                          disabled={isProcessingCsv}
                          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                          size="lg"
                        >
                          {isProcessingCsv ? (
                            <>
                              <Brain className="w-4 h-4 mr-2 animate-spin" />
                              Processing {csvData.length} rows...
                            </>
                          ) : (
                            <>
                              <BarChart3 className="w-4 h-4 mr-2" />
                              Analyze All Rows ({csvData.length})
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* CSV Results */}
                    {csvResults.length > 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Analysis Results</h4>
                          <div className="flex gap-2">
                            {csvResults[0]?.type === "single-post-comments" ? (
                              <>
                                <Badge variant="outline">
                                  {csvResults[0].commentResults?.filter((r) => !r.error).length || 0} comments analyzed
                                </Badge>
                                {csvResults[0].commentResults?.filter((r) => r.error).length > 0 && (
                                  <Badge variant="destructive">
                                    {csvResults[0].commentResults.filter((r) => r.error).length} errors
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <>
                                <Badge variant="outline">{csvResults.filter((r) => !r.error).length} successful</Badge>
                                {csvResults.filter((r) => r.error).length > 0 && (
                                  <Badge variant="destructive">{csvResults.filter((r) => r.error).length} errors</Badge>
                                )}
                              </>
                            )}
                            <Button variant="outline" size="sm" onClick={downloadCsvResults}>
                              <Download className="w-3 h-3 mr-1" />
                              Export Results
                            </Button>
                          </div>
                        </div>

                        {csvResults[0]?.type === "single-post-comments" ? (
                          // Single post comments analysis display
                          <div className="space-y-4">
                            {csvResults[0].error ? (
                              <div className="text-red-600 p-4 border border-red-200 rounded-lg">
                                Error: {csvResults[0].error}
                              </div>
                            ) : (
                              <>
                                {/* Overall Analysis Summary */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle>Overall Post Analysis</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                      <div className="text-center p-3 bg-blue-50 rounded-lg">
                                        <div className="text-2xl font-bold text-blue-600">
                                          {csvResults[0].totalComments}
                                        </div>
                                        <div className="text-sm text-blue-700">Total Comments</div>
                                      </div>
                                      <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                          {csvResults[0].overallAnalysis.commentStats.sentimentDistribution.positive.toFixed(
                                            0,
                                          )}
                                          %
                                        </div>
                                        <div className="text-sm text-green-700">Positive</div>
                                      </div>
                                      <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <div className="text-2xl font-bold text-red-600">
                                          {csvResults[0].overallAnalysis.commentStats.sentimentDistribution.negative.toFixed(
                                            0,
                                          )}
                                          %
                                        </div>
                                        <div className="text-sm text-red-700">Negative</div>
                                      </div>
                                      <div className="text-center p-3 bg-purple-50 rounded-lg">
                                        <div className="text-2xl font-bold text-purple-600">
                                          {csvResults[0].overallAnalysis.commentStats.engagementScore.toFixed(0)}%
                                        </div>
                                        <div className="text-sm text-purple-700">Engagement</div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Individual Comments */}
                                <div className="border rounded-lg overflow-hidden">
                                  <div className="bg-gray-50 px-4 py-2 border-b">
                                    <div className="grid grid-cols-7 gap-2 text-xs font-medium text-gray-700">
                                      <div>Row</div>
                                      <div>Author</div>
                                      <div>Comment Preview</div>
                                      <div>Sentiment</div>
                                      <div>Confidence</div>
                                      <div>Score</div>
                                      <div>Engagement</div>
                                    </div>
                                  </div>
                                  <div className="max-h-80 overflow-y-auto">
                                    {csvResults[0].commentResults.map((comment, index) => (
                                      <div key={index} className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50">
                                        {comment.error ? (
                                          <div className="grid grid-cols-7 gap-2 text-sm">
                                            <div className="text-gray-500">#{comment.rowIndex}</div>
                                            <div className="text-gray-600">{comment.author || "-"}</div>
                                            <div className="text-gray-800 truncate">{comment.commentText}</div>
                                            <div className="text-red-600 font-medium">ERROR</div>
                                            <div className="text-red-500 text-xs truncate">{comment.error}</div>
                                            <div>-</div>
                                            <div>-</div>
                                          </div>
                                        ) : (
                                          <div className="grid grid-cols-7 gap-2 text-sm">
                                            <div className="text-gray-500">#{comment.rowIndex}</div>
                                            <div className="text-blue-600 font-medium truncate">
                                              {comment.author || "-"}
                                            </div>
                                            <div className="text-gray-800 truncate">{comment.commentText}</div>
                                            <div className={`font-medium ${getSentimentColor(comment.sentiment)}`}>
                                              {comment.sentiment.toUpperCase()}
                                            </div>
                                            <div className="text-gray-600">{comment.confidence.toFixed(0)}%</div>
                                            <div
                                              className={`font-bold text-xs ${comment.compound > 0 ? "text-green-600" : comment.compound < 0 ? "text-red-600" : "text-gray-600"}`}
                                            >
                                              {comment.compound > 0 ? "+" : ""}
                                              {comment.compound.toFixed(2)}
                                            </div>
                                            <div
                                              className={`text-xs ${getEngagementColor(comment.engagement).split(" ")[0]}`}
                                            >
                                              {comment.engagement}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ) : (
                          // Original multi-post display
                          <div className="border rounded-lg overflow-hidden">
                            <div className="bg-gray-50 px-4 py-2 border-b">
                              <div className="grid grid-cols-6 gap-2 text-xs font-medium text-gray-700">
                                <div>Row</div>
                                <div>Post Preview</div>
                                <div>Sentiment</div>
                                <div>Confidence</div>
                                <div>Engagement</div>
                                <div>Comments</div>
                              </div>
                            </div>
                            <div className="max-h-80 overflow-y-auto">
                              {csvResults.map((result, index) => (
                                <div key={index} className="px-4 py-3 border-b last:border-b-0 hover:bg-gray-50">
                                  {result.error ? (
                                    <div className="grid grid-cols-6 gap-2 text-sm">
                                      <div className="text-gray-500">#{result.rowIndex}</div>
                                      <div className="text-gray-800 truncate">{result.postText}</div>
                                      <div className="text-red-600 font-medium">ERROR</div>
                                      <div className="text-red-500 text-xs truncate">{result.error}</div>
                                      <div>-</div>
                                      <div>-</div>
                                    </div>
                                  ) : (
                                    <div className="grid grid-cols-6 gap-2 text-sm">
                                      <div className="text-gray-500">#{result.rowIndex}</div>
                                      <div className="text-gray-800 truncate">{result.postText}</div>
                                      <div className={`font-medium ${getSentimentColor(result.analysis.post.overall)}`}>
                                        {result.analysis.post.overall.toUpperCase()}
                                      </div>
                                      <div className="text-gray-600">{result.analysis.post.confidence.toFixed(0)}%</div>
                                      <div
                                        className={`text-xs ${getEngagementColor(result.analysis.post.engagement.likelyEngagement).split(" ")[0]}`}
                                      >
                                        {result.analysis.post.engagement.likelyEngagement}
                                      </div>
                                      <div className="text-gray-600">{result.commentsCount}</div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Summary Stats - update for single post comments */}
                        {csvResults[0]?.type === "single-post-comments" && !csvResults[0].error && (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-3 bg-green-50 rounded-lg">
                              <div className="text-2xl font-bold text-green-600">
                                {
                                  csvResults[0].commentResults.filter((r) => !r.error && r.sentiment === "positive")
                                    .length
                                }
                              </div>
                              <div className="text-sm text-green-700">Positive Comments</div>
                            </div>
                            <div className="text-center p-3 bg-red-50 rounded-lg">
                              <div className="text-2xl font-bold text-red-600">
                                {
                                  csvResults[0].commentResults.filter((r) => !r.error && r.sentiment === "negative")
                                    .length
                                }
                              </div>
                              <div className="text-sm text-red-700">Negative Comments</div>
                            </div>
                            <div className="text-center p-3 bg-gray-50 rounded-lg">
                              <div className="text-2xl font-bold text-gray-600">
                                {
                                  csvResults[0].commentResults.filter((r) => !r.error && r.sentiment === "neutral")
                                    .length
                                }
                              </div>
                              <div className="text-sm text-gray-700">Neutral Comments</div>
                            </div>
                            <div className="text-center p-3 bg-blue-50 rounded-lg">
                              <div className="text-2xl font-bold text-blue-600">
                                {csvResults[0].commentResults.filter((r) => !r.error).length > 0
                                  ? (
                                      csvResults[0].commentResults
                                        .filter((r) => !r.error)
                                        .reduce((sum, r) => sum + r.confidence, 0) /
                                      csvResults[0].commentResults.filter((r) => !r.error).length
                                    ).toFixed(0)
                                  : 0}
                                %
                              </div>
                              <div className="text-sm text-blue-700">Avg Confidence</div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sample CSV Template */}
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">Need a template?</h4>
                      <div className="bg-gray-50 p-3 rounded text-xs font-mono space-y-2">
                        <div>
                          <div className="text-gray-600 mb-1">Multiple posts format:</div>
                          <div>post,comments</div>
                          <div>"Amazing sunset! 🌅","@user1: Beautiful!\n@user2: Love it!"</div>
                        </div>
                        <div>
                          <div className="text-gray-600 mb-1">Single post comments format:</div>
                          <div>author,comment</div>
                          <div>user1,"This is amazing! Love the colors 😍"</div>
                          <div>user2,"Where was this taken?"</div>
                          <div>user3,"Gorgeous shot! 📸"</div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const template =
                              'post,comments\n"Amazing sunset today! 🌅 #beautiful #nature","@user1: Gorgeous! Where is this?\n@user2: Love the colors 😍\n@user3: Makes me want to travel"\n"Just finished my workout 💪 #fitness","@trainer: Great job!\n@friend: Inspiring as always"'
                            const blob = new Blob([template], { type: "text/csv" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = "instagram_posts_template.csv"
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Posts Template
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const template =
                              'author,comment\nuser1,"This is absolutely stunning! 😍 Where did you take this photo?"\nuser2,"Love the composition and colors! Great work 👏"\nuser3,"This makes me want to visit there right now!"\nuser4,"Beautiful shot! What camera did you use? 📸"\nuser5,"Incredible! Thanks for sharing this amazing view 🌅"'
                            const blob = new Blob([template], { type: "text/csv" })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement("a")
                            a.href = url
                            a.download = "instagram_comments_template.csv"
                            a.click()
                            URL.revokeObjectURL(url)
                          }}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Comments Template
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Results Section - keeping the existing results display */}
        {result && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="post-analysis">Post Analysis</TabsTrigger>
              <TabsTrigger value="comments" disabled={result.comments.length === 0}>
                Comments ({result.comments.length})
              </TabsTrigger>
              <TabsTrigger value="insights">Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Main Results Row */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getSentimentIcon(result.post.overall)}
                      Overall Sentiment
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className={`text-3xl font-bold ${getSentimentColor(result.post.overall)}`}>
                        {result.post.overall.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-500">Confidence: {result.post.confidence.toFixed(1)}%</div>
                      <div className="text-xs text-gray-400 mt-1">
                        Compound Score: {result.post.scores.compound.toFixed(3)}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-600">Positive</span>
                          <span>{result.post.scores.positive.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.post.scores.positive} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-red-600">Negative</span>
                          <span>{result.post.scores.negative.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.post.scores.negative} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Neutral</span>
                          <span>{result.post.scores.neutral.toFixed(1)}%</span>
                        </div>
                        <Progress value={result.post.scores.neutral} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Engagement Forecast
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <Badge
                        className={`text-lg px-4 py-2 ${getEngagementColor(result.post.engagement.likelyEngagement)}`}
                      >
                        {result.post.engagement.likelyEngagement.toUpperCase()} ENGAGEMENT
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {result.post.engagement.virality.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Virality Score</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-pink-600">
                          {result.post.engagement.emotionalIntensity.toFixed(0)}%
                        </div>
                        <div className="text-xs text-gray-500">Emotional Impact</div>
                      </div>
                    </div>

                    <Separator />

                    <div className="flex justify-center gap-6 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        <span className="text-sm">Likes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm">Comments</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share className="w-4 h-4" />
                        <span className="text-sm">Shares</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {result.comments.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Comments Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{result.commentStats.totalComments}</div>
                        <div className="text-sm text-gray-500">Total Comments</div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {result.commentStats.engagementScore.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">Engagement</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-orange-600">
                            {result.overallAnalysis.controversyScore.toFixed(0)}%
                          </div>
                          <div className="text-xs text-gray-500">Controversy</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-green-600">Positive</span>
                            <span>{result.commentStats.sentimentDistribution.positive.toFixed(0)}%</span>
                          </div>
                          <Progress value={result.commentStats.sentimentDistribution.positive} className="h-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-red-600">Negative</span>
                            <span>{result.commentStats.sentimentDistribution.negative.toFixed(0)}%</span>
                          </div>
                          <Progress value={result.commentStats.sentimentDistribution.negative} className="h-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="post-analysis" className="space-y-6">
              {/* Content Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Content Analysis Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{result.post.features.wordCount}</div>
                      <div className="text-xs text-gray-500">Words</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{result.post.features.sentenceCount}</div>
                      <div className="text-xs text-gray-500">Sentences</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {result.post.features.avgWordsPerSentence.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-500">Avg Words/Sentence</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${result.post.features.hasEmojis ? "text-yellow-500" : "text-gray-400"}`}
                      >
                        {result.post.features.hasEmojis ? "✓" : "✗"}
                      </div>
                      <div className="text-xs text-gray-500">Emojis</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${result.post.features.hasHashtags ? "text-blue-500" : "text-gray-400"}`}
                      >
                        {result.post.features.hasHashtags ? "✓" : "✗"}
                      </div>
                      <div className="text-xs text-gray-500">Hashtags</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${result.post.features.hasMentions ? "text-indigo-500" : "text-gray-400"}`}
                      >
                        {result.post.features.hasMentions ? "✓" : "✗"}
                      </div>
                      <div className="text-xs text-gray-500">Mentions</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${result.post.features.hasQuestions ? "text-orange-500" : "text-gray-400"}`}
                      >
                        {result.post.features.hasQuestions ? "✓" : "✗"}
                      </div>
                      <div className="text-xs text-gray-500">Questions</div>
                    </div>
                    <div className="text-center">
                      <div
                        className={`text-2xl font-bold ${result.post.features.hasExclamations ? "text-red-500" : "text-gray-400"}`}
                      >
                        {result.post.features.hasExclamations ? "✓" : "✗"}
                      </div>
                      <div className="text-xs text-gray-500">Exclamations</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Emotional Profile */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Detailed Emotional Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(result.post.emotions).map(([emotion, score]) => (
                    <div key={emotion}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize font-medium">{emotion}</span>
                        <span className="font-medium">{score.toFixed(1)}%</span>
                      </div>
                      <Progress value={score} className="h-3" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Keywords Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle>Linguistic Analysis</CardTitle>
                  <CardDescription>Key words and phrases detected in the content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {result.post.keywords.positive.length > 0 && (
                    <div>
                      <h4 className="font-medium text-green-600 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Positive Keywords ({result.post.keywords.positive.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {result.post.keywords.positive.map((word, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-green-100 text-green-700 hover:bg-green-200"
                          >
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.post.keywords.negative.length > 0 && (
                    <div>
                      <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                        <TrendingDown className="w-4 h-4" />
                        Negative Keywords ({result.post.keywords.negative.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {result.post.keywords.negative.map((word, index) => (
                          <Badge key={index} variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200">
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {result.post.keywords.neutral.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-600 mb-2 flex items-center gap-2">
                        <Minus className="w-4 h-4" />
                        Neutral Keywords ({result.post.keywords.neutral.length})
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {result.post.keywords.neutral.slice(0, 15).map((word, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {word}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="comments" className="space-y-6">
              {result.comments.length > 0 ? (
                <>
                  {/* Comments Controls */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-5 h-5" />
                          Comments Analysis
                        </div>
                        <div className="flex items-center gap-2">
                          <Filter className="w-4 h-4" />
                          <Select value={commentFilter} onValueChange={(value: any) => setCommentFilter(value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All ({result.comments.length})</SelectItem>
                              <SelectItem value="positive">
                                Positive ({result.comments.filter((c) => c.sentiment.overall === "positive").length})
                              </SelectItem>
                              <SelectItem value="negative">
                                Negative ({result.comments.filter((c) => c.sentiment.overall === "negative").length})
                              </SelectItem>
                              <SelectItem value="neutral">
                                Neutral ({result.comments.filter((c) => c.sentiment.overall === "neutral").length})
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="text-center">
                          <div className="text-3xl font-bold text-blue-600">{result.commentStats.totalComments}</div>
                          <div className="text-sm text-gray-500">Total Comments</div>
                        </div>
                        <div className="text-center">
                          <div
                            className={`text-3xl font-bold ${result.commentStats.averageSentiment > 0 ? "text-green-600" : result.commentStats.averageSentiment < 0 ? "text-red-600" : "text-gray-600"}`}
                          >
                            {result.commentStats.averageSentiment > 0 ? "+" : ""}
                            {result.commentStats.averageSentiment.toFixed(2)}
                          </div>
                          <div className="text-sm text-gray-500">Avg Sentiment</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-purple-600">
                            {result.commentStats.engagementScore.toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-500">Engagement Score</div>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold text-orange-600">
                            {result.overallAnalysis.controversyScore.toFixed(0)}%
                          </div>
                          <div className="text-sm text-gray-500">Controversy Score</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* All Comments Display */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>All Comments ({filteredComments.length})</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowDetailedComments(!showDetailedComments)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {showDetailedComments ? "Simple View" : "Detailed View"}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[600px] overflow-y-auto">
                        {filteredComments.map((comment, index) => (
                          <div
                            key={comment.id}
                            className="border rounded-lg p-4 space-y-3 hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="text-xs">
                                  #{result.comments.findIndex((c) => c.id === comment.id) + 1}
                                </Badge>
                                {comment.author && (
                                  <div className="flex items-center gap-1">
                                    <Users className="w-3 h-3 text-blue-500" />
                                    <span className="text-sm font-medium text-blue-600">{comment.author}</span>
                                  </div>
                                )}
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${
                                    comment.sentiment.overall === "positive"
                                      ? "border-green-500 text-green-700 bg-green-50"
                                      : comment.sentiment.overall === "negative"
                                        ? "border-red-500 text-red-700 bg-red-50"
                                        : "border-gray-500 text-gray-700 bg-gray-50"
                                  }`}
                                >
                                  {comment.sentiment.overall}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-3">
                                <span
                                  className={`text-sm font-bold ${
                                    comment.sentiment.scores.compound > 0
                                      ? "text-green-600"
                                      : comment.sentiment.scores.compound < 0
                                        ? "text-red-600"
                                        : "text-gray-600"
                                  }`}
                                >
                                  {comment.sentiment.scores.compound > 0 ? "+" : ""}
                                  {comment.sentiment.scores.compound.toFixed(2)}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {comment.sentiment.confidence.toFixed(0)}% confidence
                                </span>
                              </div>
                            </div>

                            <div className="bg-white p-3 rounded border-l-4 border-l-gray-200">
                              <p className="text-gray-800">{comment.text}</p>
                            </div>

                            {showDetailedComments && (
                              <>
                                {/* Sentiment Breakdown */}
                                <div className="grid grid-cols-3 gap-2 text-xs">
                                  <div>
                                    <span className="text-green-600">Positive: </span>
                                    <span className="font-medium">{comment.sentiment.scores.positive.toFixed(0)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-red-600">Negative: </span>
                                    <span className="font-medium">{comment.sentiment.scores.negative.toFixed(0)}%</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Neutral: </span>
                                    <span className="font-medium">{comment.sentiment.scores.neutral.toFixed(0)}%</span>
                                  </div>
                                </div>

                                {/* Keywords */}
                                {(comment.sentiment.keywords.positive.length > 0 ||
                                  comment.sentiment.keywords.negative.length > 0) && (
                                  <div className="flex flex-wrap gap-1">
                                    {comment.sentiment.keywords.positive.slice(0, 3).map((word, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs bg-green-50 text-green-700">
                                        +{word}
                                      </Badge>
                                    ))}
                                    {comment.sentiment.keywords.negative.slice(0, 3).map((word, i) => (
                                      <Badge key={i} variant="secondary" className="text-xs bg-red-50 text-red-700">
                                        -{word}
                                      </Badge>
                                    ))}
                                  </div>
                                )}

                                {/* Top Emotions */}
                                <div className="flex flex-wrap gap-1">
                                  {Object.entries(comment.sentiment.emotions)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 3)
                                    .filter(([, score]) => score > 10)
                                    .map(([emotion, score]) => (
                                      <Badge key={emotion} variant="outline" className="text-xs">
                                        {emotion}: {score.toFixed(0)}%
                                      </Badge>
                                    ))}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Comments to Analyze</h3>
                    <p className="text-gray-500">
                      Switch to "Post + Comments" mode and add some comments to see detailed analysis.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              {result.comments.length > 0 ? (
                <>
                  {/* Post vs Comments Alignment */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Post vs Comments Analysis</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <h4 className="font-medium mb-2">Sentiment Alignment</h4>
                          <div className="text-2xl font-bold text-blue-600 mb-1">
                            {result.overallAnalysis.postVsCommentsAlignment.toFixed(0)}%
                          </div>
                          <Progress value={result.overallAnalysis.postVsCommentsAlignment} className="h-2 mb-2" />
                          <p className="text-sm text-gray-600">
                            {result.overallAnalysis.postVsCommentsAlignment > 70
                              ? "Comments align well with post sentiment"
                              : result.overallAnalysis.postVsCommentsAlignment > 40
                                ? "Mixed alignment between post and comments"
                                : "Comments sentiment differs significantly from post"}
                          </p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Discussion Quality</h4>
                          <div className="text-2xl font-bold text-purple-600 mb-1">
                            {result.overallAnalysis.controversyScore > 50
                              ? "High"
                              : result.overallAnalysis.controversyScore > 25
                                ? "Medium"
                                : "Low"}
                          </div>
                          <Progress value={result.overallAnalysis.controversyScore} className="h-2 mb-2" />
                          <p className="text-sm text-gray-600">
                            {result.overallAnalysis.controversyScore > 50
                              ? "Highly engaging with mixed opinions"
                              : result.overallAnalysis.controversyScore > 25
                                ? "Moderate discussion with some debate"
                                : "Generally agreeable discussion"}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Comments */}
                  {(result.commentStats.topPositiveComment || result.commentStats.topNegativeComment) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Notable Comments</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {result.commentStats.topPositiveComment && (
                          <div className="border-l-4 border-green-500 pl-4 bg-green-50 p-4 rounded-r">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-green-100 text-green-700">Most Positive</Badge>
                              {result.commentStats.topPositiveComment.author && (
                                <span className="text-sm font-medium text-gray-600">
                                  {result.commentStats.topPositiveComment.author}
                                </span>
                              )}
                              <span className="text-sm text-green-600 font-bold">
                                +{result.commentStats.topPositiveComment.sentiment.scores.compound.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium">{result.commentStats.topPositiveComment.text}</p>
                          </div>
                        )}

                        {result.commentStats.topNegativeComment && (
                          <div className="border-l-4 border-red-500 pl-4 bg-red-50 p-4 rounded-r">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className="bg-red-100 text-red-700">Most Negative</Badge>
                              {result.commentStats.topNegativeComment.author && (
                                <span className="text-sm font-medium text-gray-600">
                                  {result.commentStats.topNegativeComment.author}
                                </span>
                              )}
                              <span className="text-sm text-red-600 font-bold">
                                {result.commentStats.topNegativeComment.sentiment.scores.compound.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-gray-800 font-medium">{result.commentStats.topNegativeComment.text}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Comment Sentiment Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Comment Sentiment Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-green-600 font-medium">Positive Comments</span>
                          <span className="font-medium">
                            {result.commentStats.sentimentDistribution.positive.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={result.commentStats.sentimentDistribution.positive} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-red-600 font-medium">Negative Comments</span>
                          <span className="font-medium">
                            {result.commentStats.sentimentDistribution.negative.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={result.commentStats.sentimentDistribution.negative} className="h-3" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 font-medium">Neutral Comments</span>
                          <span className="font-medium">
                            {result.commentStats.sentimentDistribution.neutral.toFixed(1)}%
                          </span>
                        </div>
                        <Progress value={result.commentStats.sentimentDistribution.neutral} className="h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-600 mb-2">No Comments Insights Available</h3>
                    <p className="text-gray-500">
                      Add comments to your analysis to see detailed insights and patterns.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
