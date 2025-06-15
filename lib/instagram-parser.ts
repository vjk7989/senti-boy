// Instagram URL parser and data extraction utilities
export interface InstagramPostData {
  postId: string
  username: string
  caption: string
  comments: Array<{
    username: string
    text: string
    timestamp?: string
  }>
  likes?: number
  timestamp?: string
}

export class InstagramParser {
  // Extract post ID from Instagram URL
  static extractPostId(url: string): string | null {
    const patterns = [
      /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
      /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
    ]

    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match) {
        return match[1]
      }
    }
    return null
  }

  // Extract username from Instagram URL
  static extractUsername(url: string): string | null {
    const match = url.match(/instagram\.com\/([^/]+)/)
    return match ? match[1] : null
  }

  // Validate Instagram URL
  static isValidInstagramUrl(url: string): boolean {
    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/[A-Za-z0-9_-]+/
    return instagramUrlPattern.test(url)
  }

  // Mock data for demonstration (simulates what would be fetched)
  static getMockPostData(postId: string): InstagramPostData {
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
          },
          {
            username: "mike_backpacker",
            text: "Southeast Asia is amazing! Did you make it to Vietnam? The street food there is unreal 🍜",
          },
          {
            username: "jenny_travels",
            text: "Your photos are stunning! What camera equipment did you use? The colors are so vibrant 📸",
          },
          {
            username: "local_guide_thai",
            text: "Thank you for visiting our beautiful country! Hope you enjoyed the authentic Thai experience 🇹🇭🙏",
          },
          {
            username: "budget_traveler",
            text: "This looks expensive... what was your total budget for the 2 weeks? Trying to plan something similar",
          },
          {
            username: "foodie_adventures",
            text: "The food looks incredible! What was your favorite dish? I need to know for my own trip 🤤",
          },
          {
            username: "solo_female_travel",
            text: "Did you travel solo? I'm planning a solo trip and would love some tips for safety",
          },
          {
            username: "photography_lover",
            text: "These shots belong in National Geographic! Do you have any photography tips for travel?",
          },
          {
            username: "culture_explorer",
            text: "The temple shots are breathtaking. Which temples did you visit? I want to add them to my itinerary",
          },
          {
            username: "beach_vibes_only",
            text: "Those Bali beaches though! 🏖️ Which beach was your favorite? Planning my honeymoon there",
          },
          {
            username: "adventure_seeker",
            text: "This is giving me serious wanderlust! What was the most adventurous thing you did?",
          },
          {
            username: "travel_couple",
            text: "We're planning the same route next year! Any must-do activities you'd recommend?",
          },
          {
            username: "digital_nomad",
            text: "Perfect timing! I'm working remotely from Bali next month. Any coworking space recommendations?",
          },
          {
            username: "backpack_life",
            text: "What size backpack did you use? Trying to figure out packing for my own SEA adventure",
          },
          {
            username: "sunset_chaser",
            text: "Those sunset photos are unreal! 🌅 Where was the best sunset spot you found?",
          },
          {
            username: "temple_hopper",
            text: "The architecture in those temple photos is incredible. Did you have a guide or explore on your own?",
          },
          {
            username: "street_food_fan",
            text: "I'm drooling over all the food photos! Any dishes I absolutely MUST try?",
          },
          {
            username: "island_hopper",
            text: "Which islands did you visit in Indonesia? Planning an island hopping trip myself",
          },
          {
            username: "travel_blogger",
            text: "This content is amazing! Do you have a travel blog? Would love to read more about your adventures",
          },
          {
            username: "worried_mom",
            text: "Looks amazing but I worry about safety. Did you feel safe traveling there?",
          },
        ],
        likes: 2847,
        timestamp: "2024-01-15T10:30:00Z",
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
          },
          {
            username: "fitness_coach_mike",
            text: "Amazing transformation! Your dedication really shows. What's your next goal?",
          },
          {
            username: "marathon_mom",
            text: "I remember my first 10K feeling! You should be incredibly proud. The mental strength you've built is just as important 🧠💪",
          },
          {
            username: "gym_newbie",
            text: "This gives me hope! I'm just starting my journey and some days feel impossible. How did you stay motivated?",
          },
          {
            username: "couch_to_5k",
            text: "From stairs to 10K - that's incredible! I'm still working on my first 5K. Any tips for building endurance?",
          },
          {
            username: "personal_trainer_sarah",
            text: "Love seeing real transformations like this! Consistency truly is everything. Keep crushing those goals! 🎯",
          },
          {
            username: "running_community",
            text: "Welcome to the 10K club! 🏃‍♀️ The running community is so supportive. Have you thought about joining a local running group?",
          },
          {
            username: "healthy_habits",
            text: "The meal prep mention caught my attention! What are your go-to healthy meals? Always looking for new ideas",
          },
          {
            username: "morning_workout",
            text: "5am workouts are TOUGH! How long did it take you to get used to that schedule? I'm struggling with early mornings",
          },
          {
            username: "fitness_struggles",
            text: "Thank you for being real about the hard days. Social media usually only shows the highlights. This is refreshing 🙏",
          },
          {
            username: "progress_pics",
            text: "The physical change is obvious but I bet the mental change is even bigger! How do you feel mentally?",
          },
          {
            username: "running_shoes",
            text: "Congrats! 🎉 Time to treat yourself to some new running gear! What shoes are you running in?",
          },
          {
            username: "workout_buddy",
            text: "This is exactly the motivation I needed today! Bad workout day and was feeling discouraged",
          },
          {
            username: "health_journey",
            text: "6 months of consistency - that's the real achievement! Most people give up after 2 weeks. You're inspiring!",
          },
          {
            username: "endurance_athlete",
            text: "From winded on stairs to 10K runner - that's a massive cardiovascular improvement! Your heart health must be so much better",
          },
          {
            username: "rest_day_advocate",
            text: "Love that you mentioned rest days! So many people think more is always better. Recovery is where the magic happens 💤",
          },
          {
            username: "comparison_trap",
            text: "The comparison struggle is real! Thanks for mentioning that. It's so easy to compare our beginning to someone else's middle",
          },
          {
            username: "sunday_meal_prep",
            text: "Sunday meal prep gang! 🥗 What's your favorite meal prep recipe? Always looking for new ideas",
          },
          {
            username: "fitness_mindset",
            text: "Your mindset shift is incredible. 'Only competition is who you were yesterday' - I'm writing that down! 📝",
          },
          {
            username: "beginner_runner",
            text: "How long did it take you to build up to 10K? I'm at the 2K mark and it feels impossible to go further",
          },
        ],
        likes: 1923,
        timestamp: "2024-01-20T06:15:00Z",
      },
    }

    return (
      mockPosts[postId] || {
        postId,
        username: "sample_user",
        caption: "Sample post content for demonstration purposes.",
        comments: [
          { username: "user1", text: "Great post!" },
          { username: "user2", text: "Love this content 😍" },
          { username: "user3", text: "Thanks for sharing!" },
        ],
        likes: 100,
      }
    )
  }

  // Format post data for sentiment analysis
  static formatForAnalysis(postData: InstagramPostData): { post: string; comments: string } {
    const post = postData.caption

    const comments = postData.comments.map((comment) => `@${comment.username}: ${comment.text}`).join("\n")

    return { post, comments }
  }
}
