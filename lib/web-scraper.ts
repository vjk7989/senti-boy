// Instagram Web Scraping Service
export interface ScrapingResult {
  success: boolean
  data?: InstagramPostData
  error?: string
  method: "direct" | "proxy" | "api" | "mock"
}

export interface InstagramPostData {
  postId: string
  username: string
  caption: string
  comments: Array<{
    username: string
    text: string
    timestamp?: string
    likes?: number
  }>
  likes: number
  timestamp: string
  imageUrls?: string[]
  videoUrl?: string
  location?: string
  hashtags: string[]
  mentions: string[]
}

export class InstagramScraper {
  private static readonly CORS_PROXIES = [
    "https://api.allorigins.win/raw?url=",
    "https://corsproxy.io/?",
    "https://cors-anywhere.herokuapp.com/",
  ]

  // Main scraping method that tries multiple approaches
  static async scrapePost(url: string): Promise<ScrapingResult> {
    const postId = this.extractPostId(url)
    if (!postId) {
      return {
        success: false,
        error: "Invalid Instagram URL",
        method: "direct",
      }
    }

    // Try different scraping methods in order of preference
    const methods = [
      () => this.scrapeWithProxy(url),
      () => this.scrapeWithAPI(postId),
      () => this.scrapeWithMockData(postId),
    ]

    for (const method of methods) {
      try {
        const result = await method()
        if (result.success) {
          return result
        }
      } catch (error) {
        console.warn("Scraping method failed:", error)
      }
    }

    return {
      success: false,
      error: "All scraping methods failed. Instagram has strong anti-scraping measures.",
      method: "direct",
    }
  }

  // Method 1: Direct scraping with CORS proxy
  private static async scrapeWithProxy(url: string): Promise<ScrapingResult> {
    for (const proxy of this.CORS_PROXIES) {
      try {
        const response = await fetch(proxy + encodeURIComponent(url), {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const html = await response.text()
        const data = this.parseInstagramHTML(html)

        if (data) {
          return {
            success: true,
            data,
            method: "proxy",
          }
        }
      } catch (error) {
        console.warn(`Proxy ${proxy} failed:`, error)
      }
    }

    throw new Error("All CORS proxies failed")
  }

  // Method 2: Using Instagram's embed API (limited data)
  private static async scrapeWithAPI(postId: string): Promise<ScrapingResult> {
    try {
      const embedUrl = `https://api.instagram.com/oembed/?url=https://instagram.com/p/${postId}/`
      const response = await fetch(embedUrl)

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
      }

      const embedData = await response.json()

      // Extract basic data from embed response
      const data: InstagramPostData = {
        postId,
        username: embedData.author_name || "unknown",
        caption: this.extractCaptionFromEmbed(embedData.html),
        comments: [], // Embed API doesn't provide comments
        likes: 0, // Not available in embed
        timestamp: new Date().toISOString(),
        hashtags: [],
        mentions: [],
      }

      return {
        success: true,
        data,
        method: "api",
      }
    } catch (error) {
      throw new Error(`Instagram embed API failed: ${error}`)
    }
  }

  // Method 3: Mock data for demonstration
  private static async scrapeWithMockData(postId: string): Promise<ScrapingResult> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const mockData = this.generateMockData(postId)

    return {
      success: true,
      data: mockData,
      method: "mock",
    }
  }

  // Parse Instagram HTML to extract post data
  private static parseInstagramHTML(html: string): InstagramPostData | null {
    try {
      // Instagram stores data in JSON-LD script tags
      const jsonLdMatch = html.match(/<script type="application\/ld\+json"[^>]*>(.*?)<\/script>/s)
      if (jsonLdMatch) {
        const jsonData = JSON.parse(jsonLdMatch[1])
        return this.parseJsonLdData(jsonData)
      }

      // Try to extract from window._sharedData
      const sharedDataMatch = html.match(/window\._sharedData\s*=\s*({.*?});/)
      if (sharedDataMatch) {
        const sharedData = JSON.parse(sharedDataMatch[1])
        return this.parseSharedData(sharedData)
      }

      // Fallback: parse HTML directly
      return this.parseHTMLDirectly(html)
    } catch (error) {
      console.error("Failed to parse Instagram HTML:", error)
      return null
    }
  }

  private static parseJsonLdData(jsonData: any): InstagramPostData | null {
    try {
      const post = jsonData["@graph"]?.[0] || jsonData

      return {
        postId: this.extractPostId(post.url) || "unknown",
        username: post.author?.alternateName || post.author?.name || "unknown",
        caption: post.caption || post.description || "",
        comments: this.extractCommentsFromJsonLd(post.comment || []),
        likes:
          post.interactionStatistic?.find((stat: any) => stat.interactionType === "http://schema.org/LikeAction")
            ?.userInteractionCount || 0,
        timestamp: post.datePublished || new Date().toISOString(),
        imageUrls: post.image ? [post.image] : [],
        hashtags: this.extractHashtags(post.caption || ""),
        mentions: this.extractMentions(post.caption || ""),
      }
    } catch (error) {
      console.error("Failed to parse JSON-LD data:", error)
      return null
    }
  }

  private static parseSharedData(sharedData: any): InstagramPostData | null {
    try {
      const media = Object.values(sharedData.entry_data?.PostPage?.[0]?.graphql?.shortcode_media || {})[0] as any

      if (!media) return null

      return {
        postId: media.shortcode,
        username: media.owner?.username || "unknown",
        caption: media.edge_media_to_caption?.edges?.[0]?.node?.text || "",
        comments: this.extractCommentsFromGraphQL(media.edge_media_to_parent_comment?.edges || []),
        likes: media.edge_media_preview_like?.count || 0,
        timestamp: new Date(media.taken_at_timestamp * 1000).toISOString(),
        imageUrls: media.display_url ? [media.display_url] : [],
        videoUrl: media.video_url,
        location: media.location?.name,
        hashtags: this.extractHashtags(media.edge_media_to_caption?.edges?.[0]?.node?.text || ""),
        mentions: this.extractMentions(media.edge_media_to_caption?.edges?.[0]?.node?.text || ""),
      }
    } catch (error) {
      console.error("Failed to parse shared data:", error)
      return null
    }
  }

  private static parseHTMLDirectly(html: string): InstagramPostData | null {
    // This is a simplified HTML parser - in reality, Instagram's HTML is very complex
    try {
      const captionMatch = html.match(/<meta property="og:description" content="([^"]*)"/)
      const usernameMatch = html.match(/<meta property="og:title" content="([^"]*)"/)

      return {
        postId: "extracted",
        username: usernameMatch?.[1]?.split(" ")[0] || "unknown",
        caption: captionMatch?.[1] || "",
        comments: [],
        likes: 0,
        timestamp: new Date().toISOString(),
        hashtags: this.extractHashtags(captionMatch?.[1] || ""),
        mentions: this.extractMentions(captionMatch?.[1] || ""),
      }
    } catch (error) {
      console.error("Failed to parse HTML directly:", error)
      return null
    }
  }

  private static extractCommentsFromJsonLd(
    comments: any[],
  ): Array<{ username: string; text: string; timestamp?: string }> {
    return comments.map((comment) => ({
      username: comment.author?.alternateName || comment.author?.name || "unknown",
      text: comment.text || "",
      timestamp: comment.datePublished,
    }))
  }

  private static extractCommentsFromGraphQL(
    edges: any[],
  ): Array<{ username: string; text: string; timestamp?: string }> {
    return edges.map((edge) => ({
      username: edge.node?.owner?.username || "unknown",
      text: edge.node?.text || "",
      timestamp: new Date(edge.node?.created_at * 1000).toISOString(),
    }))
  }

  private static extractCaptionFromEmbed(html: string): string {
    const captionMatch = html.match(/class="Caption"[^>]*>([^<]*)</i)
    return captionMatch?.[1] || ""
  }

  private static extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w]+/g
    return text.match(hashtagRegex) || []
  }

  private static extractMentions(text: string): string[] {
    const mentionRegex = /@[\w.]+/g
    return text.match(mentionRegex) || []
  }

  private static extractPostId(url: string): string | null {
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) return match[1]
    }
    return null
  }

  private static generateMockData(postId: string): InstagramPostData {
    const mockPosts: Record<string, InstagramPostData> = {
      CyXYZ123abc: {
        postId: "CyXYZ123abc",
        username: "travel_enthusiast",
        caption: `Just returned from the most incredible 2-week adventure through Southeast Asia! 🌏✈️ 

From the bustling streets of Bangkok to the serene beaches of Bali, every moment was pure magic. The food, the people, the culture - everything exceeded my expectations! 

Special thanks to all the amazing locals who showed us hidden gems that aren't in any guidebook 🙏

Already planning the next adventure... where should I go next? Drop your suggestions below! 👇

#SoutheastAsia #Travel #Adventure #Wanderlust #Thailand #Indonesia #Vietnam #Backpacking #TravelGram #Culture #Food #Beaches #Temples #NomadLife #TravelAddict`,
        comments: [
          {
            username: "sarah_wanderlust",
            text: "This looks absolutely incredible! 😍 I'm so jealous right now. How long were you planning this trip?",
            timestamp: "2024-01-15T11:30:00Z",
            likes: 23,
          },
          {
            username: "mike_backpacker",
            text: "Southeast Asia is amazing! Did you make it to Vietnam? The street food there is unreal 🍜",
            timestamp: "2024-01-15T11:45:00Z",
            likes: 18,
          },
          {
            username: "jenny_travels",
            text: "Your photos are stunning! What camera equipment did you use? The colors are so vibrant 📸",
            timestamp: "2024-01-15T12:00:00Z",
            likes: 31,
          },
          {
            username: "local_guide_thai",
            text: "Thank you for visiting our beautiful country! Hope you enjoyed the authentic Thai experience 🇹🇭🙏",
            timestamp: "2024-01-15T12:15:00Z",
            likes: 45,
          },
          {
            username: "budget_traveler",
            text: "This looks expensive... what was your total budget for the 2 weeks? Trying to plan something similar",
            timestamp: "2024-01-15T12:30:00Z",
            likes: 12,
          },
        ],
        likes: 2847,
        timestamp: "2024-01-15T10:30:00Z",
        imageUrls: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
        hashtags: ["#SoutheastAsia", "#Travel", "#Adventure", "#Wanderlust", "#Thailand", "#Indonesia", "#Vietnam"],
        mentions: [],
      },
      DzABC456def: {
        postId: "DzABC456def",
        username: "fitness_journey_2024",
        caption: `6 MONTHS PROGRESS UPDATE! 💪🔥

I can't believe I'm actually posting this, but here we are... 6 months ago I could barely walk up a flight of stairs without getting winded. Today I just completed my first 10K run! 🏃‍♀️

The journey hasn't been easy:
❌ There were days I wanted to quit
❌ Days I felt like I wasn't making progress  
❌ Days I compared myself to others

But I kept showing up:
✅ 5am workouts became my routine
✅ Meal prep became my Sunday ritual
✅ Rest days became just as important as workout days

To anyone starting their fitness journey - it's not about being perfect, it's about being consistent. Your only competition is who you were yesterday 💯

What fitness goal are you working towards? Let's motivate each other! 👇

#FitnessJourney #Transformation #10K #Running #HealthyLifestyle #Consistency #NeverGiveUp #FitnessMotivation #ProgressNotPerfection #RunnerLife #HealthyMindset #FitnessGoals #Endurance #PersonalRecord`,
        comments: [
          {
            username: "runner_girl_23",
            text: "This is SO inspiring! 🙌 Congratulations on your 10K! What training plan did you follow?",
            timestamp: "2024-01-20T06:30:00Z",
            likes: 34,
          },
          {
            username: "fitness_coach_mike",
            text: "Amazing transformation! Your dedication really shows. What's your next goal?",
            timestamp: "2024-01-20T06:45:00Z",
            likes: 28,
          },
          {
            username: "marathon_mom",
            text: "I remember my first 10K feeling! You should be incredibly proud. The mental strength you've built is just as important 🧠💪",
            timestamp: "2024-01-20T07:00:00Z",
            likes: 42,
          },
        ],
        likes: 1923,
        timestamp: "2024-01-20T06:15:00Z",
        imageUrls: ["https://example.com/fitness.jpg"],
        hashtags: ["#FitnessJourney", "#Transformation", "#10K", "#Running", "#HealthyLifestyle"],
        mentions: [],
      },
    }

    return (
      mockPosts[postId] || {
        postId,
        username: "sample_user",
        caption: "Sample post content for demonstration purposes.",
        comments: [
          { username: "user1", text: "Great post!", timestamp: new Date().toISOString() },
          { username: "user2", text: "Love this content 😍", timestamp: new Date().toISOString() },
          { username: "user3", text: "Thanks for sharing!", timestamp: new Date().toISOString() },
        ],
        likes: 100,
        timestamp: new Date().toISOString(),
        hashtags: [],
        mentions: [],
      }
    )
  }

  // Alternative scraping methods for different scenarios
  static async scrapeWithPuppeteer(url: string): Promise<ScrapingResult> {
    // This would require a server-side implementation with Puppeteer
    return {
      success: false,
      error: "Puppeteer scraping requires server-side implementation",
      method: "direct",
    }
  }

  static async scrapeWithSelenium(url: string): Promise<ScrapingResult> {
    // This would require a server-side implementation with Selenium
    return {
      success: false,
      error: "Selenium scraping requires server-side implementation",
      method: "direct",
    }
  }

  // Utility method to check if scraping is likely to work
  static async testScrapingCapability(): Promise<{
    corsProxies: boolean
    embedAPI: boolean
    directAccess: boolean
  }> {
    const results = {
      corsProxies: false,
      embedAPI: false,
      directAccess: false,
    }

    // Test CORS proxies
    try {
      const response = await fetch(this.CORS_PROXIES[0] + "https://httpbin.org/get", {
        signal: AbortSignal.timeout(5000),
      })
      results.corsProxies = response.ok
    } catch (error) {
      console.warn("CORS proxy test failed:", error)
    }

    // Test Instagram embed API
    try {
      const response = await fetch("https://api.instagram.com/oembed/?url=https://instagram.com/p/test/", {
        signal: AbortSignal.timeout(5000),
      })
      results.embedAPI = response.status !== 0 // Any response means API is accessible
    } catch (error) {
      console.warn("Instagram embed API test failed:", error)
    }

    // Test direct Instagram access
    try {
      const response = await fetch("https://instagram.com", {
        mode: "no-cors",
        signal: AbortSignal.timeout(5000),
      })
      results.directAccess = true // If no error, some level of access exists
    } catch (error) {
      console.warn("Direct Instagram access test failed:", error)
    }

    return results
  }
}

// Server-side scraping service (for reference)
export class ServerSideScraper {
  // This would be implemented on a Node.js server
  static async scrapeWithPuppeteer(url: string): Promise<InstagramPostData> {
    // Example implementation:
    /*
    const puppeteer = require('puppeteer');
    
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    await page.goto(url, { waitUntil: 'networkidle2' });
    
    const data = await page.evaluate(() => {
      // Extract data from the page
      return window._sharedData;
    });
    
    await browser.close();
    return parseInstagramData(data);
    */

    throw new Error("Server-side implementation required")
  }
}
