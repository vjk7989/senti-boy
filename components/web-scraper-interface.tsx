"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  AlertTriangle,
  Globe,
  Download,
  CheckCircle,
  XCircle,
  Loader2,
  Copy,
  Settings,
  Zap,
  Shield,
  Server,
  Eye,
} from "lucide-react"
import { InstagramScraper, type ScrapingResult, type InstagramPostData } from "@/lib/web-scraper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface WebScraperInterfaceProps {
  onDataScraped: (post: string, comments: string) => void
}

export function WebScraperInterface({ onDataScraped }: WebScraperInterfaceProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ScrapingResult | null>(null)
  const [scrapedData, setScrapedData] = useState<InstagramPostData | null>(null)
  const [capabilities, setCapabilities] = useState<any>(null)
  const [testingCapabilities, setTestingCapabilities] = useState(false)

  const handleScrape = async () => {
    if (!url.trim()) return

    setIsLoading(true)
    setResult(null)
    setScrapedData(null)

    try {
      const scrapingResult = await InstagramScraper.scrapePost(url)
      setResult(scrapingResult)

      if (scrapingResult.success && scrapingResult.data) {
        setScrapedData(scrapingResult.data)

        // Format data for sentiment analysis
        const formattedComments = scrapingResult.data.comments
          .map((comment) => `@${comment.username}: ${comment.text}`)
          .join("\n")

        onDataScraped(scrapingResult.data.caption, formattedComments)
      }
    } catch (error) {
      setResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error occurred",
        method: "direct",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const testCapabilities = async () => {
    setTestingCapabilities(true)
    try {
      const caps = await InstagramScraper.testScrapingCapability()
      setCapabilities(caps)
    } catch (error) {
      console.error("Failed to test capabilities:", error)
    } finally {
      setTestingCapabilities(false)
    }
  }

  const handleDemoScrape = (demoUrl: string) => {
    setUrl(demoUrl)
  }

  const getMethodBadgeColor = (method: string) => {
    switch (method) {
      case "proxy":
        return "bg-blue-100 text-blue-700"
      case "api":
        return "bg-green-100 text-green-700"
      case "mock":
        return "bg-yellow-100 text-yellow-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Instagram Web Scraper
          </CardTitle>
          <CardDescription>
            Advanced web scraping to automatically extract Instagram post content and comments
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              <strong>Scraping Notice:</strong> Instagram has strong anti-scraping measures. This tool demonstrates
              various scraping techniques and falls back to mock data when direct scraping fails.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="scrape-url">Instagram Post URL</Label>
            <div className="flex gap-2">
              <Input
                id="scrape-url"
                placeholder="https://instagram.com/p/ABC123..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleScrape} disabled={!url.trim() || isLoading} className="min-w-[120px]">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Scraping...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Scrape Data
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleDemoScrape("https://instagram.com/p/CyXYZ123abc")}>
              Demo URL 1 (Travel)
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDemoScrape("https://instagram.com/p/DzABC456def")}>
              Demo URL 2 (Fitness)
            </Button>
            <Button variant="outline" size="sm" onClick={testCapabilities} disabled={testingCapabilities}>
              {testingCapabilities ? (
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <Settings className="w-3 h-3 mr-1" />
              )}
              Test Capabilities
            </Button>
          </div>

          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              <AlertDescription className="flex items-center justify-between">
                <span>
                  {result.success
                    ? `Successfully scraped data using ${result.method} method`
                    : `Scraping failed: ${result.error}`}
                </span>
                {result.success && (
                  <Badge className={getMethodBadgeColor(result.method)}>{result.method.toUpperCase()}</Badge>
                )}
              </AlertDescription>
            </Alert>
          )}

          {capabilities && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Scraping Capabilities Test</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">CORS Proxies</span>
                  <Badge variant={capabilities.corsProxies ? "default" : "secondary"}>
                    {capabilities.corsProxies ? "Available" : "Blocked"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Instagram Embed API</span>
                  <Badge variant={capabilities.embedAPI ? "default" : "secondary"}>
                    {capabilities.embedAPI ? "Available" : "Blocked"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Direct Access</span>
                  <Badge variant={capabilities.directAccess ? "default" : "secondary"}>
                    {capabilities.directAccess ? "Possible" : "Blocked"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {scrapedData && (
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="technical">Technical</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Scraped Post Overview</span>
                  <Badge variant="outline">@{scrapedData.username}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{scrapedData.likes.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">{scrapedData.comments.length}</div>
                    <div className="text-sm text-gray-500">Comments</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">{scrapedData.hashtags.length}</div>
                    <div className="text-sm text-gray-500">Hashtags</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-600">{scrapedData.mentions.length}</div>
                    <div className="text-sm text-gray-500">Mentions</div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Post Caption Preview</h4>
                  <div className="bg-gray-50 p-3 rounded text-sm max-h-32 overflow-y-auto">
                    {scrapedData.caption.slice(0, 300)}
                    {scrapedData.caption.length > 300 && "..."}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center justify-between">
                    <span>Recent Comments ({scrapedData.comments.length})</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const commentsText = scrapedData.comments.map((c) => `@${c.username}: ${c.text}`).join("\n")
                        navigator.clipboard.writeText(commentsText)
                      }}
                    >
                      <Copy className="w-3 h-3 mr-1" />
                      Copy All
                    </Button>
                  </h4>
                  <div className="bg-gray-50 p-3 rounded text-sm max-h-40 overflow-y-auto space-y-2">
                    {scrapedData.comments.slice(0, 5).map((comment, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-blue-600">@{comment.username}</span>
                          {comment.likes && (
                            <Badge variant="outline" className="text-xs">
                              {comment.likes} ❤️
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-700 mt-1">{comment.text}</p>
                      </div>
                    ))}
                    {scrapedData.comments.length > 5 && (
                      <div className="text-gray-500 text-xs">
                        ... and {scrapedData.comments.length - 5} more comments
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card>
              <CardHeader>
                <CardTitle>Full Content Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Complete Caption</h4>
                  <div className="bg-gray-50 p-4 rounded text-sm whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {scrapedData.caption}
                  </div>
                </div>

                {scrapedData.hashtags.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Hashtags ({scrapedData.hashtags.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {scrapedData.hashtags.map((hashtag, index) => (
                        <Badge key={index} variant="secondary" className="bg-blue-50 text-blue-700">
                          {hashtag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {scrapedData.mentions.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2">Mentions ({scrapedData.mentions.length})</h4>
                    <div className="flex flex-wrap gap-1">
                      {scrapedData.mentions.map((mention, index) => (
                        <Badge key={index} variant="secondary" className="bg-green-50 text-green-700">
                          {mention}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="font-medium mb-2">All Comments</h4>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {scrapedData.comments.map((comment, index) => (
                      <div key={index} className="border rounded p-3 bg-white">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-blue-600">@{comment.username}</span>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {comment.likes && <span>{comment.likes} ❤️</span>}
                            {comment.timestamp && <span>{new Date(comment.timestamp).toLocaleDateString()}</span>}
                          </div>
                        </div>
                        <p className="text-gray-800">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="technical">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Technical Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Post ID</Label>
                    <div className="text-sm text-gray-600 font-mono">{scrapedData.postId}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Scraping Method</Label>
                    <Badge className={getMethodBadgeColor(result?.method || "unknown")}>
                      {result?.method?.toUpperCase() || "UNKNOWN"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Post Date</Label>
                    <div className="text-sm text-gray-600">{new Date(scrapedData.timestamp).toLocaleString()}</div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Data Quality</Label>
                    <Badge variant="outline">{scrapedData.comments.length > 0 ? "Complete" : "Partial"}</Badge>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2">Scraping Challenges & Solutions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5" />
                      <div>
                        <strong>CORS Restrictions:</strong> Instagram blocks direct browser requests. Using CORS proxies
                        as workaround.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Shield className="w-4 h-4 text-red-500 mt-0.5" />
                      <div>
                        <strong>Anti-Scraping:</strong> Instagram uses bot detection and rate limiting. Implementing
                        delays and user-agent rotation.
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <strong>Dynamic Content:</strong> Comments load via JavaScript. Using multiple parsing
                        strategies.
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Alternative Approaches</h4>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div>
                      • <strong>Server-side scraping:</strong> Use Puppeteer/Selenium on your server
                    </div>
                    <div>
                      • <strong>Instagram API:</strong> Official API with authentication required
                    </div>
                    <div>
                      • <strong>Browser extension:</strong> Inject scripts directly into Instagram pages
                    </div>
                    <div>
                      • <strong>Third-party services:</strong> Use specialized scraping APIs
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Scraping Methods Explained
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border rounded p-3">
              <h4 className="font-medium text-blue-600 mb-2">CORS Proxy Method</h4>
              <p className="text-sm text-gray-600 mb-2">
                Routes requests through proxy servers to bypass CORS restrictions.
              </p>
              <div className="text-xs text-gray-500">
                ✅ Works in browser
                <br />❌ Unreliable proxies
                <br />❌ Limited by proxy availability
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium text-green-600 mb-2">Instagram Embed API</h4>
              <p className="text-sm text-gray-600 mb-2">Uses Instagram's official embed API for basic post data.</p>
              <div className="text-xs text-gray-500">
                ✅ Official API
                <br />✅ Reliable
                <br />❌ Limited data (no comments)
              </div>
            </div>

            <div className="border rounded p-3">
              <h4 className="font-medium text-purple-600 mb-2">Server-side Scraping</h4>
              <p className="text-sm text-gray-600 mb-2">Full browser automation with Puppeteer/Selenium on server.</p>
              <div className="text-xs text-gray-500">
                ✅ Complete data access
                <br />✅ Handles JavaScript
                <br />❌ Requires server setup
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
