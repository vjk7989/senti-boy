"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Link, Download, Info, CheckCircle, XCircle, Loader2, Copy } from "lucide-react"
import { InstagramParser, type InstagramPostData } from "@/lib/instagram-parser"

interface UrlFetcherProps {
  onDataFetched: (post: string, comments: string) => void
}

export function UrlFetcher({ onDataFetched }: UrlFetcherProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fetchedData, setFetchedData] = useState<InstagramPostData | null>(null)
  const [showInstructions, setShowInstructions] = useState(false)

  const handleUrlSubmit = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    setError(null)
    setFetchedData(null)

    try {
      // Validate URL
      if (!InstagramParser.isValidInstagramUrl(url)) {
        throw new Error("Please enter a valid Instagram post URL (e.g., https://instagram.com/p/ABC123)")
      }

      // Extract post ID
      const postId = InstagramParser.extractPostId(url)
      if (!postId) {
        throw new Error("Could not extract post ID from URL")
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real implementation, this would make an API call
      // For demo purposes, we'll use mock data
      const postData = InstagramParser.getMockPostData(postId)
      setFetchedData(postData)

      // Format and pass data to parent component
      const { post, comments } = InstagramParser.formatForAnalysis(postData)
      onDataFetched(post, comments)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Instagram data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoUrl = (demoPostId: string) => {
    const demoUrls = {
      CyXYZ123abc: "https://instagram.com/p/CyXYZ123abc",
      DzABC456def: "https://instagram.com/p/DzABC456def",
    }
    setUrl(demoUrls[demoPostId as keyof typeof demoUrls] || "")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="w-5 h-5" />
            Instagram URL Fetcher
          </CardTitle>
          <CardDescription>
            Paste an Instagram post URL to automatically fetch content and comments for analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <strong>Important:</strong> Due to Instagram's API restrictions and terms of service, direct URL fetching
              is limited. This demo shows how the feature would work with mock data.
              <Button
                variant="link"
                className="p-0 h-auto font-normal underline ml-1"
                onClick={() => setShowInstructions(!showInstructions)}
              >
                See manual extraction guide
              </Button>
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="instagram-url">Instagram Post URL</Label>
            <div className="flex gap-2">
              <Input
                id="instagram-url"
                placeholder="https://instagram.com/p/ABC123..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleUrlSubmit} disabled={!url.trim() || isLoading} className="min-w-[100px]">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Fetch Data
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleDemoUrl("CyXYZ123abc")}>
              Try Demo URL 1 (Travel)
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDemoUrl("DzABC456def")}>
              Try Demo URL 2 (Fitness)
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {fetchedData && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Successfully fetched data for post by <strong>@{fetchedData.username}</strong>
                with <strong>{fetchedData.comments.length} comments</strong>. Data has been loaded into the analyzer
                below.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {showInstructions && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Manual Data Extraction Guide
            </CardTitle>
            <CardDescription>How to manually get Instagram post content and comments for analysis</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Step 1</span>
                  Get the Post Content
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Open the Instagram post in your browser</li>
                  <li>• Copy the caption text (including hashtags and emojis)</li>
                  <li>• Paste it into the "Post Content" field below</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Step 2</span>
                  Get the Comments
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Scroll through the comments section</li>
                  <li>
                    • Copy comments in this format:{" "}
                    <code className="bg-gray-100 px-1 rounded">@username: comment text</code>
                  </li>
                  <li>• Put each comment on a new line</li>
                  <li>• Paste all comments into the "Comments" field below</li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Step 3</span>
                  Alternative Methods
                </h4>
                <ul className="text-sm text-gray-600 space-y-1 ml-4">
                  <li>• Use browser extensions that can export Instagram data</li>
                  <li>• Use Instagram's official "Download Your Data" feature</li>
                  <li>• Use third-party tools (check their terms of service)</li>
                  <li>• Screenshot and use OCR tools to extract text</li>
                </ul>
              </div>
            </div>

            <Separator />

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                Legal & Ethical Considerations
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Always respect Instagram's Terms of Service</li>
                <li>• Only analyze public posts or posts you have permission to analyze</li>
                <li>• Be mindful of user privacy and data protection laws</li>
                <li>• Consider getting consent before analyzing others' content</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {fetchedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Fetched Post Preview</span>
              <Badge variant="outline">@{fetchedData.username}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Post Caption</h4>
              <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">{fetchedData.caption}</div>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center justify-between">
                <span>Comments ({fetchedData.comments.length})</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const commentsText = fetchedData.comments.map((c) => `@${c.username}: ${c.text}`).join("\n")
                    navigator.clipboard.writeText(commentsText)
                  }}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy All
                </Button>
              </h4>
              <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto space-y-2">
                {fetchedData.comments.slice(0, 5).map((comment, index) => (
                  <div key={index} className="border-l-2 border-blue-200 pl-2">
                    <span className="font-medium text-blue-600">@{comment.username}:</span>{" "}
                    <span className="text-gray-700">{comment.text}</span>
                  </div>
                ))}
                {fetchedData.comments.length > 5 && (
                  <div className="text-gray-500 text-xs">... and {fetchedData.comments.length - 5} more comments</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>❤️ {fetchedData.likes?.toLocaleString()} likes</span>
              <span>💬 {fetchedData.comments.length} comments</span>
              {fetchedData.timestamp && <span>📅 {new Date(fetchedData.timestamp).toLocaleDateString()}</span>}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
