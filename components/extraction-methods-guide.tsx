"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Code,
  Globe,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Settings,
  BookOpen,
  Lightbulb,
  Target,
  Network,
  Camera,
  Bot,
  Users,
  Chrome,
  Puzzle,
} from "lucide-react"
import { AdvancedInstagramExtractor, type ExtractionMethod } from "@/lib/advanced-data-extractors"

export function ExtractionMethodsGuide() {
  const [selectedMethod, setSelectedMethod] = useState<ExtractionMethod | null>(null)
  const [activeCategory, setActiveCategory] = useState("all")

  const allMethods = AdvancedInstagramExtractor.getAllExtractionMethods()

  const getMethodIcon = (type: string) => {
    switch (type) {
      case "automated":
        return <Bot className="w-4 h-4" />
      case "manual":
        return <Users className="w-4 h-4" />
      case "api":
        return <Code className="w-4 h-4" />
      case "service":
        return <Globe className="w-4 h-4" />
      case "extension":
        return <Puzzle className="w-4 h-4" />
      default:
        return <Settings className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "hard":
        return "bg-orange-100 text-orange-700"
      case "expert":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getReliabilityColor = (reliability: string) => {
    switch (reliability) {
      case "high":
        return "bg-green-100 text-green-700"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getLegalStatusColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-700"
      case "gray-area":
        return "bg-yellow-100 text-yellow-700"
      case "violation":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const filteredMethods =
    activeCategory === "all" ? allMethods : allMethods.filter((method) => method.type === activeCategory)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Complete Instagram Comment Extraction Guide
          </CardTitle>
          <CardDescription>
            Comprehensive overview of all available methods to extract Instagram post comments and data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Choose Your Method:</strong> Each approach has different requirements, reliability, and legal
              considerations. Select the method that best fits your technical skills, budget, and use case.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="automated">Automated</TabsTrigger>
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Method Categories */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveCategory("automated")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Bot className="w-5 h-5 text-blue-600" />
                  Automated Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Browser automation and scripting solutions for large-scale extraction
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Puppeteer
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Selenium
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Playwright
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveCategory("manual")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="w-5 h-5 text-green-600" />
                  Manual Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Human-driven approaches that are compliant but time-consuming
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Copy-Paste
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    OCR
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Screenshots
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveCategory("service")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Globe className="w-5 h-5 text-purple-600" />
                  Third-Party Services
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">
                  Professional services and APIs for Instagram data extraction
                </p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Apify
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ScrapingBee
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Bright Data
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveCategory("api")}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Code className="w-5 h-5 text-orange-600" />
                  API Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Official and unofficial APIs for programmatic access</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Instagram API
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Graph API
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Unofficial APIs
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setActiveCategory("extension")}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Puzzle className="w-5 h-5 text-indigo-600" />
                  Browser Extensions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Direct DOM access through custom browser extensions</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Chrome Extension
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Firefox Add-on
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Custom Scripts
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Network className="w-5 h-5 text-red-600" />
                  Advanced Techniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-3">Network interception and mobile app automation</p>
                <div className="flex flex-wrap gap-1">
                  <Badge variant="outline" className="text-xs">
                    Proxy Intercept
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Mobile ADB
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Traffic Analysis
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Comparison Table */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Comparison</CardTitle>
              <CardDescription>At-a-glance comparison of popular methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Method</th>
                      <th className="text-left p-2">Difficulty</th>
                      <th className="text-left p-2">Reliability</th>
                      <th className="text-left p-2">Cost</th>
                      <th className="text-left p-2">Legal Status</th>
                      <th className="text-left p-2">Best For</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Manual Copy-Paste</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Easy</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">High</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Free</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Compliant</Badge>
                      </td>
                      <td className="p-2">Small datasets</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Browser Extension</td>
                      <td className="p-2">
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">Medium</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">High</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Free</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Compliant</Badge>
                      </td>
                      <td className="p-2">Regular use</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Puppeteer</td>
                      <td className="p-2">
                        <Badge className="bg-orange-100 text-orange-700 text-xs">Hard</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">High</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Free</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">Gray Area</Badge>
                      </td>
                      <td className="p-2">Large scale</td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-2 font-medium">Third-Party APIs</td>
                      <td className="p-2">
                        <Badge className="bg-green-100 text-green-700 text-xs">Easy</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">Medium</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-red-100 text-red-700 text-xs">Paid</Badge>
                      </td>
                      <td className="p-2">
                        <Badge className="bg-yellow-100 text-yellow-700 text-xs">Gray Area</Badge>
                      </td>
                      <td className="p-2">Business use</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automated" className="space-y-6">
          <div className="grid gap-4">
            {allMethods
              .filter((m) => m.type === "automated")
              .map((method, index) => (
                <Card
                  key={index}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => setSelectedMethod(method)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(method.type)}
                        {method.name}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(method.difficulty)}>{method.difficulty}</Badge>
                        <Badge className={getReliabilityColor(method.reliability)}>{method.reliability}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      <Badge variant="outline" className={getLegalStatusColor(method.legalStatus)}>
                        {method.legalStatus}
                      </Badge>
                      <Badge variant="outline">{method.cost}</Badge>
                    </div>
                    <div className="text-xs text-gray-500">
                      <strong>Requirements:</strong> {method.requirements.join(", ")}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              <strong>Manual Methods:</strong> These approaches are generally compliant with Instagram's terms of
              service but require significant time and effort. Best for small-scale analysis or when automation isn't
              possible.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {allMethods
              .filter((m) => m.type === "manual")
              .map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(method.type)}
                        {method.name}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(method.difficulty)}>{method.difficulty}</Badge>
                        <Badge className={getReliabilityColor(method.reliability)}>{method.reliability}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{method.description}</p>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium text-sm text-green-600 mb-1">✅ Requirements</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {method.requirements.map((req, i) => (
                            <li key={i}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-red-600 mb-1">❌ Limitations</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {method.limitations.map((limit, i) => (
                            <li key={i}>• {limit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge className={getLegalStatusColor(method.legalStatus)}>{method.legalStatus}</Badge>
                      <Badge variant="outline">{method.cost}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="services" className="space-y-6">
          <Alert>
            <Globe className="h-4 w-4" />
            <AlertDescription>
              <strong>Third-Party Services:</strong> Professional solutions that handle the technical complexity but may
              have ongoing costs and terms of service considerations.
            </AlertDescription>
          </Alert>

          <div className="grid gap-4">
            {allMethods
              .filter((m) => m.type === "service" || m.type === "api")
              .map((method, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getMethodIcon(method.type)}
                        {method.name}
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getDifficultyColor(method.difficulty)}>{method.difficulty}</Badge>
                        <Badge className={getReliabilityColor(method.reliability)}>{method.reliability}</Badge>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <p className="text-sm text-gray-600">{method.description}</p>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <h4 className="font-medium text-sm text-green-600 mb-1">✅ Requirements</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {method.requirements.map((req, i) => (
                            <li key={i}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm text-red-600 mb-1">❌ Limitations</h4>
                        <ul className="text-xs text-gray-600 space-y-1">
                          {method.limitations.map((limit, i) => (
                            <li key={i}>• {limit}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Badge className={getLegalStatusColor(method.legalStatus)}>{method.legalStatus}</Badge>
                      <Badge variant="outline">{method.cost}</Badge>
                      <Badge variant="outline">{method.type}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="implementation" className="space-y-6">
          <Alert>
            <Code className="h-4 w-4" />
            <AlertDescription>
              <strong>Implementation Examples:</strong> Ready-to-use code examples for different extraction methods.
              Choose based on your technical requirements and constraints.
            </AlertDescription>
          </Alert>

          {/* Browser Extension Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Chrome className="w-5 h-5" />
                Browser Extension Implementation
              </CardTitle>
              <CardDescription>Complete Chrome extension for Instagram comment extraction</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <pre>{AdvancedInstagramExtractor.getBrowserExtensionCode().substring(0, 1000)}...</pre>
              </div>
              <Button className="mt-3" variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download Complete Extension Code
              </Button>
            </CardContent>
          </Card>

          {/* Network Interception */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5" />
                Network Traffic Interception
              </CardTitle>
              <CardDescription>Intercept Instagram API calls to extract comment data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <pre>{AdvancedInstagramExtractor.getNetworkInterceptionCode().substring(0, 800)}...</pre>
              </div>
              <Button className="mt-3" variant="outline" size="sm">
                <Eye className="w-4 h-4 mr-2" />
                View Complete Implementation
              </Button>
            </CardContent>
          </Card>

          {/* OCR Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="w-5 h-5" />
                OCR-Based Extraction
              </CardTitle>
              <CardDescription>Extract comments using screenshot analysis and OCR</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg text-sm overflow-x-auto">
                <pre>{AdvancedInstagramExtractor.getOCRExtractionCode().substring(0, 800)}...</pre>
              </div>
              <Button className="mt-3" variant="outline" size="sm">
                <BookOpen className="w-4 h-4 mr-2" />
                View OCR Tutorial
              </Button>
            </CardContent>
          </Card>

          {/* Implementation Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>Implementation Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="border rounded p-3">
                  <h4 className="font-medium text-green-600 mb-2">✅ For Beginners</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Start with manual copy-paste</li>
                    <li>• Try browser extension approach</li>
                    <li>• Use third-party services for scale</li>
                    <li>• Focus on compliant methods</li>
                  </ul>
                </div>
                <div className="border rounded p-3">
                  <h4 className="font-medium text-blue-600 mb-2">🔧 For Developers</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Implement Puppeteer/Playwright</li>
                    <li>• Build custom browser extensions</li>
                    <li>• Use network interception</li>
                    <li>• Combine multiple methods</li>
                  </ul>
                </div>
                <div className="border rounded p-3">
                  <h4 className="font-medium text-purple-600 mb-2">🏢 For Businesses</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Use official Instagram APIs</li>
                    <li>• Partner with data providers</li>
                    <li>• Implement compliance monitoring</li>
                    <li>• Consider legal implications</li>
                  </ul>
                </div>
                <div className="border rounded p-3">
                  <h4 className="font-medium text-orange-600 mb-2">🎓 For Researchers</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Apply for research APIs</li>
                    <li>• Use ethical data collection</li>
                    <li>• Document methodology</li>
                    <li>• Consider privacy implications</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Method Detail Modal */}
      {selectedMethod && (
        <Card className="fixed inset-4 z-50 bg-white shadow-2xl overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {getMethodIcon(selectedMethod.type)}
                {selectedMethod.name}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedMethod(null)}>
                <XCircle className="w-4 h-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Badge className={getDifficultyColor(selectedMethod.difficulty)}>{selectedMethod.difficulty}</Badge>
              <Badge className={getReliabilityColor(selectedMethod.reliability)}>{selectedMethod.reliability}</Badge>
              <Badge className={getLegalStatusColor(selectedMethod.legalStatus)}>{selectedMethod.legalStatus}</Badge>
              <Badge variant="outline">{selectedMethod.cost}</Badge>
            </div>

            <p className="text-gray-600">{selectedMethod.description}</p>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium text-green-600 mb-2">Requirements</h4>
                <ul className="text-sm space-y-1">
                  {selectedMethod.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-red-600 mb-2">Limitations</h4>
                <ul className="text-sm space-y-1">
                  {selectedMethod.limitations.map((limit, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <XCircle className="w-3 h-3 text-red-500 mt-0.5 flex-shrink-0" />
                      {limit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
