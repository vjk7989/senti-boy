// Advanced sentiment analysis without external APIs
export interface SentimentScore {
  positive: number
  negative: number
  neutral: number
  compound: number
}

export interface EmotionScores {
  joy: number
  anger: number
  fear: number
  sadness: number
  surprise: number
  disgust: number
  trust: number
  anticipation: number
}

export interface SentimentAnalysis {
  overall: "positive" | "negative" | "neutral"
  confidence: number
  scores: SentimentScore
  emotions: EmotionScores
  keywords: {
    positive: string[]
    negative: string[]
    neutral: string[]
  }
  features: {
    hasEmojis: boolean
    hasHashtags: boolean
    hasMentions: boolean
    hasQuestions: boolean
    hasExclamations: boolean
    wordCount: number
    sentenceCount: number
    avgWordsPerSentence: number
  }
  engagement: {
    likelyEngagement: "high" | "medium" | "low"
    virality: number
    emotionalIntensity: number
  }
}

// Add new interfaces for comment analysis
export interface CommentAnalysis {
  id: string
  text: string
  sentiment: SentimentAnalysis
  timestamp?: string
  author?: string
}

export interface PostWithCommentsAnalysis {
  post: SentimentAnalysis
  comments: CommentAnalysis[]
  commentStats: {
    totalComments: number
    averageSentiment: number
    sentimentDistribution: {
      positive: number
      negative: number
      neutral: number
    }
    topPositiveComment?: CommentAnalysis
    topNegativeComment?: CommentAnalysis
    engagementScore: number
  }
  overallAnalysis: {
    combinedSentiment: SentimentAnalysis
    postVsCommentsAlignment: number
    controversyScore: number
  }
}

// Comprehensive sentiment lexicons
const POSITIVE_WORDS = {
  // Basic positive words
  love: 3,
  amazing: 3,
  awesome: 3,
  fantastic: 3,
  incredible: 3,
  wonderful: 3,
  perfect: 3,
  excellent: 3,
  outstanding: 3,
  brilliant: 3,
  beautiful: 2.5,
  great: 2.5,
  good: 2,
  nice: 2,
  happy: 2.5,
  excited: 2.5,
  thrilled: 3,
  delighted: 2.5,
  pleased: 2,
  satisfied: 2,
  grateful: 2.5,
  thankful: 2.5,
  blessed: 2.5,
  lucky: 2,
  fortunate: 2,
  stunning: 3,
  gorgeous: 3,
  magnificent: 3,
  spectacular: 3,
  breathtaking: 3,
  inspiring: 2.5,
  motivating: 2.5,
  uplifting: 2.5,
  encouraging: 2.5,
  fun: 2,
  enjoyable: 2,
  entertaining: 2,
  amusing: 2,
  hilarious: 2.5,
  cool: 2,
  sweet: 2,
  cute: 2,
  adorable: 2.5,
  charming: 2.5,
  successful: 2.5,
  winning: 2.5,
  victorious: 3,
  triumphant: 3,
  proud: 2.5,
  confident: 2,
  strong: 2,
  powerful: 2.5,
  capable: 2,
  fresh: 1.5,
  new: 1.5,
  innovative: 2,
  creative: 2,
  original: 2,
  peaceful: 2,
  calm: 2,
  relaxed: 2,
  comfortable: 2,
  cozy: 2,
  healthy: 2,
  fit: 2,
  energetic: 2.5,
  vibrant: 2.5,
  alive: 2.5,
}

const NEGATIVE_WORDS = {
  // Basic negative words
  hate: -3,
  terrible: -3,
  awful: -3,
  horrible: -3,
  disgusting: -3,
  worst: -3,
  pathetic: -3,
  useless: -3,
  worthless: -3,
  devastating: -3,
  bad: -2,
  poor: -2,
  sad: -2.5,
  angry: -2.5,
  mad: -2.5,
  frustrated: -2.5,
  annoyed: -2,
  irritated: -2,
  upset: -2.5,
  disappointed: -2.5,
  depressed: -3,
  miserable: -3,
  hopeless: -3,
  desperate: -3,
  devastated: -3,
  broken: -2.5,
  hurt: -2.5,
  pain: -2.5,
  suffering: -3,
  agony: -3,
  scared: -2.5,
  afraid: -2.5,
  terrified: -3,
  worried: -2,
  anxious: -2.5,
  stressed: -2.5,
  overwhelmed: -2.5,
  exhausted: -2,
  tired: -1.5,
  drained: -2,
  boring: -2,
  dull: -2,
  bland: -2,
  monotonous: -2,
  tedious: -2,
  ugly: -2.5,
  hideous: -3,
  repulsive: -3,
  gross: -2.5,
  nasty: -2.5,
  stupid: -2.5,
  dumb: -2.5,
  idiotic: -3,
  foolish: -2,
  ridiculous: -2,
  fake: -2,
  false: -2,
  dishonest: -2.5,
  lying: -2.5,
  deceptive: -2.5,
  wrong: -2,
  incorrect: -1.5,
  mistake: -1.5,
  error: -1.5,
  failure: -2.5,
  lost: -2,
  confused: -1.5,
  uncertain: -1.5,
  doubtful: -2,
  skeptical: -1.5,
}

// Intensifiers and modifiers
const INTENSIFIERS = {
  very: 1.3,
  extremely: 1.5,
  incredibly: 1.4,
  absolutely: 1.4,
  totally: 1.3,
  completely: 1.4,
  utterly: 1.5,
  quite: 1.2,
  really: 1.3,
  truly: 1.3,
  genuinely: 1.3,
  seriously: 1.3,
  super: 1.4,
  mega: 1.5,
  ultra: 1.5,
  so: 1.2,
  too: 1.2,
}

const DIMINISHERS = {
  slightly: 0.7,
  somewhat: 0.8,
  rather: 0.9,
  fairly: 0.9,
  pretty: 0.9,
  "kind of": 0.8,
  "sort of": 0.8,
  "a bit": 0.7,
  "a little": 0.7,
  barely: 0.6,
  hardly: 0.6,
  scarcely: 0.6,
}

const NEGATIONS = [
  "not",
  "no",
  "never",
  "none",
  "nobody",
  "nothing",
  "neither",
  "nowhere",
  "isn't",
  "aren't",
  "wasn't",
  "weren't",
  "haven't",
  "hasn't",
  "hadn't",
  "won't",
  "wouldn't",
  "don't",
  "doesn't",
  "didn't",
  "can't",
  "couldn't",
  "shouldn't",
  "mustn't",
  "needn't",
  "daren't",
  "mayn't",
  "oughtn't",
]

// Emoji sentiment mapping
const EMOJI_SENTIMENT = {
  // Very positive emojis
  "😍": 3,
  "🥰": 3,
  "😘": 2.5,
  "💕": 2.5,
  "💖": 3,
  "💗": 2.5,
  "💓": 2.5,
  "❤️": 2.5,
  "🧡": 2,
  "💛": 2,
  "💚": 2,
  "💙": 2,
  "💜": 2,
  "🖤": 1.5,
  "🤍": 2,
  "🤎": 1.5,
  "❣️": 2.5,
  "💞": 2.5,
  "💝": 2.5,
  "💘": 2.5,
  "😊": 2.5,
  "😄": 2.5,
  "😃": 2.5,
  "😀": 2,
  "😁": 2.5,
  "😆": 2.5,
  "🤣": 2.5,
  "😂": 2.5,
  "🙂": 2,
  "🙃": 1.5,
  "😉": 2,
  "😌": 2,
  "😋": 2,
  "😎": 2.5,
  "🤩": 3,
  "🥳": 3,
  "😇": 2.5,
  "🤗": 2.5,
  "🎉": 2.5,
  "🎊": 2.5,
  "🎈": 2,
  "🎁": 2,
  "🏆": 2.5,
  "🥇": 2.5,
  "⭐": 2,
  "🌟": 2.5,
  "✨": 2,
  "💫": 2,
  "🔥": 2.5,
  "💯": 2.5,
  "👏": 2,
  "🙌": 2.5,
  "👍": 2,
  "👌": 2,
  "✌️": 2,
  "🤞": 1.5,
  "💪": 2,
  "🦾": 2,
  "🧠": 1.5,
  "🫶": 2.5,
  "👑": 2.5,
  "💎": 2,

  // Negative emojis
  "😢": -2.5,
  "😭": -3,
  "😞": -2,
  "😔": -2,
  "😟": -2,
  "😕": -1.5,
  "🙁": -2,
  "☹️": -2,
  "😣": -2,
  "😖": -2,
  "😫": -2.5,
  "😩": -2.5,
  "🥺": -1.5,
  "😤": -2,
  "😠": -2.5,
  "😡": -3,
  "🤬": -3,
  "😱": -2.5,
  "😨": -2.5,
  "😰": -2.5,
  "😥": -2,
  "😓": -2,
  "🤢": -2.5,
  "🤮": -3,
  "🤧": -1.5,
  "🥴": -1.5,
  "😵": -2,
  "🤯": -2,
  "😬": -1.5,
  "🙄": -1.5,
  "😒": -2,
  "😑": -1.5,
  "😐": -1,
  "😶": -1,
  "🤐": -1,
  "🤫": -0.5,
  "💔": -3,
  "🖤": -1.5,
  "⚡": -1,
  "💀": -2.5,
  "☠️": -2.5,
  "👎": -2,

  // Neutral/mixed emojis
  "😐": 0,
  "😑": -0.5,
  "🤔": 0,
  "🧐": 0,
  "🤨": -0.5,
  "😏": 0.5,
  "😶": 0,
  "🙄": -1,
  "😮": 0.5,
  "😯": 0.5,
  "😲": 0.5,
  "🤯": 1,
  "🤷": 0,
  "🤷‍♀️": 0,
  "🤷‍♂️": 0,
  "🤦": -1,
  "🤦‍♀️": -1,
  "🤦‍♂️": -1,
}

// Emotion-specific word mappings
const EMOTION_WORDS = {
  joy: ["happy", "joyful", "cheerful", "delighted", "elated", "ecstatic", "blissful", "content", "pleased", "glad"],
  anger: ["angry", "furious", "mad", "irritated", "annoyed", "frustrated", "outraged", "livid", "enraged", "irate"],
  fear: [
    "scared",
    "afraid",
    "terrified",
    "frightened",
    "anxious",
    "worried",
    "nervous",
    "panicked",
    "alarmed",
    "apprehensive",
  ],
  sadness: [
    "sad",
    "depressed",
    "melancholy",
    "sorrowful",
    "mournful",
    "dejected",
    "despondent",
    "gloomy",
    "downhearted",
    "blue",
  ],
  surprise: [
    "surprised",
    "amazed",
    "astonished",
    "shocked",
    "stunned",
    "bewildered",
    "startled",
    "astounded",
    "flabbergasted",
    "dumbfounded",
  ],
  disgust: [
    "disgusted",
    "revolted",
    "repulsed",
    "sickened",
    "nauseated",
    "appalled",
    "horrified",
    "repelled",
    "grossed",
    "offended",
  ],
  trust: ["trust", "confident", "secure", "safe", "reliable", "dependable", "faithful", "loyal", "honest", "genuine"],
  anticipation: [
    "excited",
    "eager",
    "hopeful",
    "expectant",
    "optimistic",
    "enthusiastic",
    "keen",
    "anticipating",
    "looking forward",
    "can't wait",
  ],
}

export class AdvancedSentimentAnalyzer {
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s#@]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 0)
  }

  private extractEmojis(text: string): string[] {
    const emojiRegex =
      /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu
    return text.match(emojiRegex) || []
  }

  private extractHashtags(text: string): string[] {
    const hashtagRegex = /#[\w]+/g
    return text.match(hashtagRegex) || []
  }

  private extractMentions(text: string): string[] {
    const mentionRegex = /@[\w]+/g
    return text.match(mentionRegex) || []
  }

  private analyzeWordSentiment(word: string, context: string[], index: number): number {
    let score = 0
    let multiplier = 1

    // Check for word in sentiment lexicons
    if (POSITIVE_WORDS[word]) {
      score = POSITIVE_WORDS[word]
    } else if (NEGATIVE_WORDS[word]) {
      score = NEGATIVE_WORDS[word]
    }

    if (score === 0) return 0

    // Check for intensifiers/diminishers in context
    for (let i = Math.max(0, index - 2); i < Math.min(context.length, index + 3); i++) {
      if (i === index) continue

      const contextWord = context[i]
      if (INTENSIFIERS[contextWord]) {
        multiplier *= INTENSIFIERS[contextWord]
      } else if (DIMINISHERS[contextWord]) {
        multiplier *= DIMINISHERS[contextWord]
      }
    }

    // Check for negations
    let negated = false
    for (let i = Math.max(0, index - 3); i < index; i++) {
      if (NEGATIONS.includes(context[i])) {
        negated = true
        break
      }
    }

    if (negated) {
      score *= -0.8 // Flip and slightly reduce intensity
    }

    return score * multiplier
  }

  private analyzeEmotions(text: string, tokens: string[]): EmotionScores {
    const emotions: EmotionScores = {
      joy: 0,
      anger: 0,
      fear: 0,
      sadness: 0,
      surprise: 0,
      disgust: 0,
      trust: 0,
      anticipation: 0,
    }

    // Analyze words for emotions
    Object.entries(EMOTION_WORDS).forEach(([emotion, words]) => {
      let count = 0
      words.forEach((emotionWord) => {
        tokens.forEach((token) => {
          if (token.includes(emotionWord) || emotionWord.includes(token)) {
            count++
          }
        })
      })
      emotions[emotion as keyof EmotionScores] = Math.min(count * 20, 100)
    })

    // Analyze emojis for emotions
    const emojis = this.extractEmojis(text)
    emojis.forEach((emoji) => {
      const sentiment = EMOJI_SENTIMENT[emoji] || 0
      if (sentiment > 0) {
        emotions.joy += sentiment * 10
        emotions.trust += sentiment * 5
      } else if (sentiment < 0) {
        emotions.sadness += Math.abs(sentiment) * 8
        emotions.anger += Math.abs(sentiment) * 6
      }
    })

    // Normalize scores
    Object.keys(emotions).forEach((key) => {
      emotions[key as keyof EmotionScores] = Math.min(emotions[key as keyof EmotionScores], 100)
    })

    return emotions
  }

  private calculateEngagement(text: string, sentiment: SentimentScore, emotions: EmotionScores): any {
    const features = this.extractFeatures(text)

    // Calculate emotional intensity
    const emotionalIntensity = Math.max(...Object.values(emotions))

    // Calculate virality potential
    let virality = 0
    virality += Math.abs(sentiment.compound) * 30 // Strong sentiment drives engagement
    virality += features.hasEmojis ? 15 : 0
    virality += features.hasHashtags ? 10 : 0
    virality += features.hasExclamations ? 10 : 0
    virality += features.hasQuestions ? 8 : 0
    virality += emotionalIntensity * 0.3

    // Adjust for content length
    if (features.wordCount > 10 && features.wordCount < 50) {
      virality += 10 // Sweet spot for engagement
    }

    virality = Math.min(virality, 100)

    // Determine engagement level
    let likelyEngagement: "high" | "medium" | "low"
    if (virality > 70 || emotionalIntensity > 60) {
      likelyEngagement = "high"
    } else if (virality > 40 || emotionalIntensity > 30) {
      likelyEngagement = "medium"
    } else {
      likelyEngagement = "low"
    }

    return {
      likelyEngagement,
      virality,
      emotionalIntensity,
    }
  }

  private extractFeatures(text: string) {
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const words = this.tokenize(text)

    return {
      hasEmojis: this.extractEmojis(text).length > 0,
      hasHashtags: this.extractHashtags(text).length > 0,
      hasMentions: this.extractMentions(text).length > 0,
      hasQuestions: text.includes("?"),
      hasExclamations: text.includes("!"),
      wordCount: words.length,
      sentenceCount: sentences.length,
      avgWordsPerSentence: words.length / Math.max(sentences.length, 1),
    }
  }

  analyze(text: string): SentimentAnalysis {
    if (!text.trim()) {
      throw new Error("Text cannot be empty")
    }

    const tokens = this.tokenize(text)
    const emojis = this.extractEmojis(text)

    // Calculate word-based sentiment
    let totalScore = 0
    const positiveWords: string[] = []
    const negativeWords: string[] = []
    const neutralWords: string[] = []

    tokens.forEach((token, index) => {
      const score = this.analyzeWordSentiment(token, tokens, index)
      totalScore += score

      if (score > 0) {
        positiveWords.push(token)
      } else if (score < 0) {
        negativeWords.push(token)
      } else if (POSITIVE_WORDS[token] === undefined && NEGATIVE_WORDS[token] === undefined) {
        neutralWords.push(token)
      }
    })

    // Add emoji sentiment
    let emojiScore = 0
    emojis.forEach((emoji) => {
      const score = EMOJI_SENTIMENT[emoji] || 0
      emojiScore += score
      totalScore += score
    })

    // Normalize scores
    const wordCount = Math.max(tokens.length, 1)
    const compound = totalScore / wordCount

    // Calculate individual sentiment scores
    const positive = Math.max(0, compound) * 100
    const negative = Math.max(0, -compound) * 100
    const neutral = Math.max(0, 100 - positive - negative)

    const scores: SentimentScore = {
      positive,
      negative,
      neutral,
      compound,
    }

    // Determine overall sentiment
    let overall: "positive" | "negative" | "neutral"
    if (positive > negative && positive > neutral) {
      overall = "positive"
    } else if (negative > positive && negative > neutral) {
      overall = "negative"
    } else {
      overall = "neutral"
    }

    // Calculate confidence
    const confidence = Math.max(positive, negative, neutral)

    // Analyze emotions
    const emotions = this.analyzeEmotions(text, tokens)

    // Extract features
    const features = this.extractFeatures(text)

    // Calculate engagement metrics
    const engagement = this.calculateEngagement(text, scores, emotions)

    return {
      overall,
      confidence,
      scores,
      emotions,
      keywords: {
        positive: [...new Set(positiveWords)],
        negative: [...new Set(negativeWords)],
        neutral: [...new Set(neutralWords.slice(0, 10))], // Limit neutral words
      },
      features,
      engagement,
    }
  }

  // Add method to AdvancedSentimentAnalyzer class
  analyzePostWithComments(postText: string, commentsText: string): PostWithCommentsAnalysis {
    // Analyze main post
    const postAnalysis = this.analyze(postText)

    // Parse and analyze comments
    const commentLines = commentsText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    const comments: CommentAnalysis[] = commentLines.map((text, index) => {
      // Extract author if format is "username: comment"
      const authorMatch = text.match(/^(@?\w+):\s*(.+)/)
      const author = authorMatch ? authorMatch[1] : undefined
      const commentText = authorMatch ? authorMatch[2] : text

      return {
        id: `comment-${index}`,
        text: commentText,
        sentiment: this.analyze(commentText),
        author,
      }
    })

    // Calculate comment statistics
    const totalComments = comments.length
    const sentimentScores = comments.map((c) => c.sentiment.scores.compound)
    const averageSentiment = sentimentScores.reduce((sum, score) => sum + score, 0) / Math.max(totalComments, 1)

    const positiveComments = comments.filter((c) => c.sentiment.overall === "positive").length
    const negativeComments = comments.filter((c) => c.sentiment.overall === "negative").length
    const neutralComments = comments.filter((c) => c.sentiment.overall === "neutral").length

    const sentimentDistribution = {
      positive: (positiveComments / Math.max(totalComments, 1)) * 100,
      negative: (negativeComments / Math.max(totalComments, 1)) * 100,
      neutral: (neutralComments / Math.max(totalComments, 1)) * 100,
    }

    // Find top positive and negative comments
    const topPositiveComment = comments
      .filter((c) => c.sentiment.overall === "positive")
      .sort((a, b) => b.sentiment.scores.compound - a.sentiment.scores.compound)[0]

    const topNegativeComment = comments
      .filter((c) => c.sentiment.overall === "negative")
      .sort((a, b) => a.sentiment.scores.compound - b.sentiment.scores.compound)[0]

    // Calculate engagement score based on comment activity and sentiment variety
    const engagementScore = Math.min(
      totalComments * 2 +
        Math.abs(averageSentiment) * 30 +
        ((positiveComments + negativeComments) / Math.max(totalComments, 1)) * 40,
      100,
    )

    // Calculate combined sentiment (post + comments weighted)
    const combinedText = postText + " " + commentsText
    const combinedSentiment = this.analyze(combinedText)

    // Calculate post vs comments alignment
    const postVsCommentsAlignment = Math.max(0, 100 - Math.abs(postAnalysis.scores.compound - averageSentiment) * 100)

    // Calculate controversy score (high when there's mixed sentiment in comments)
    const controversyScore = Math.min(
      (Math.min(positiveComments, negativeComments) / Math.max(totalComments, 1)) * 200,
      100,
    )

    return {
      post: postAnalysis,
      comments,
      commentStats: {
        totalComments,
        averageSentiment,
        sentimentDistribution,
        topPositiveComment,
        topNegativeComment,
        engagementScore,
      },
      overallAnalysis: {
        combinedSentiment,
        postVsCommentsAlignment,
        controversyScore,
      },
    }
  }

  // Add this method to the AdvancedSentimentAnalyzer class
  parseCommentsFromText(commentsText: string): Array<{ author?: string; text: string; timestamp?: string }> {
    const lines = commentsText.split("\n").filter((line) => line.trim().length > 0)

    return lines.map((line) => {
      // Try to match different comment formats
      // Format 1: @username: comment text
      const userColonMatch = line.match(/^@?(\w+):\s*(.+)$/)
      if (userColonMatch) {
        return {
          author: "@" + userColonMatch[1],
          text: userColonMatch[2].trim(),
        }
      }

      // Format 2: username - comment text
      const userDashMatch = line.match(/^@?(\w+)\s*-\s*(.+)$/)
      if (userDashMatch) {
        return {
          author: "@" + userDashMatch[1],
          text: userDashMatch[2].trim(),
        }
      }

      // Format 3: just comment text (no username)
      return {
        text: line.trim(),
      }
    })
  }
}
