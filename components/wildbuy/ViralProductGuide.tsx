'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sparkles,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  Zap,
  ArrowRight,
  ArrowLeft,
  Check,
  AlertCircle,
  Target,
  BarChart3,
  Rocket,
  Film,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────

interface CategoryResult {
  type: 'choice'
  choice: string
  confidence: number
  probabilities: Record<string, number>
}

interface NoulResult {
  type: 'noul'
  noul: number
}

interface ScoreResult {
  type: 'score'
  score: number
  confidence: number
  probabilities: Record<string, number>
  legend: Record<string, string>
}

interface FilterResults {
  has_high_demand: NoulResult
  fits_budget: NoulResult
  matches_timeline: NoulResult
  has_viral_potential: NoulResult
  low_competition: NoulResult
}

interface ScoreResults {
  [niche: string]: {
    market_size: ScoreResult
    trend_velocity: ScoreResult
    differentiation: ScoreResult
    profit_margin: ScoreResult
  }
}

interface NicheCandidate {
  name: string
  scores: {
    market_size: number
    trend_velocity: number
    differentiation_opportunity: number
    profit_margin: number
  }
  composite: number
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  { id: 'fitness_equipment', label: 'Fitness Equipment', icon: '🏋️' },
  { id: 'wellness_supplements', label: 'Wellness & Supplements', icon: '💊' },
  { id: 'fitness_tech', label: 'Fitness Tech', icon: '⌚' },
  { id: 'outdoor_gear', label: 'Outdoor Gear', icon: '🏕️' },
  { id: 'home_gym', label: 'Home Gym', icon: '🏠' },
  { id: 'beauty_skincare', label: 'Beauty & Skincare', icon: '✨' },
  { id: 'kitchen_gadgets', label: 'Kitchen Gadgets', icon: '🍳' },
  { id: 'pet_products', label: 'Pet Products', icon: '🐾' },
]

const NICHE_CANDIDATES: Record<string, string[]> = {
  fitness_equipment: [
    'resistance bands',
    'massage guns',
    'smart water bottles',
    'yoga mats',
    'foam rollers',
    'jump ropes',
    'fitness trackers',
    'protein shakers',
  ],
  wellness_supplements: [
    'collagen powder',
    'probiotics',
    'vitamin gummies',
    'adaptogens',
    'protein powder',
    'omega-3',
    'electrolyte drinks',
    'sleep aids',
  ],
  fitness_tech: [
    'smart watches',
    'fitness rings',
    'posture correctors',
    'EMS trainers',
    'smart jump ropes',
    'heart rate monitors',
    'sleep trackers',
    'recovery boots',
  ],
  outdoor_gear: [
    'portable hammocks',
    'camping cookware',
    'water filtration',
    'solar chargers',
    'tactical flashlights',
    'inflatable paddleboards',
    'hiking poles',
    'survival kits',
  ],
  home_gym: [
    'adjustable dumbbells',
    'pull-up bars',
    'kettlebells',
    'gym mirrors',
    'cable machines',
    'weight benches',
    'exercise bikes',
    'rowing machines',
  ],
  beauty_skincare: [
    'LED face masks',
    'microcurrent devices',
    'derma rollers',
    'jade gua sha',
    'cryo globes',
    'SPF sunscreen',
    'retinol serums',
    'hyaluronic acid',
  ],
  kitchen_gadgets: [
    'air fryers',
    'spiralizers',
    'milk frothers',
    'electric choppers',
    'pasta makers',
    'sous vide',
    'espresso makers',
    'blenders',
  ],
  pet_products: [
    'automatic feeders',
    'pet cameras',
    'water fountains',
    'grooming tools',
    'anxiety wraps',
    'interactive toys',
    'GPS trackers',
    'litter boxes',
  ],
  other: [
    'phone accessories',
    'car gadgets',
    'desk organizers',
    'travel gear',
    'smart home devices',
    'wearable tech',
    'eco-friendly products',
    'novelty gifts',
  ],
}

const WEIGHTS = {
  market_size: 0.3,
  trend_velocity: 0.35,
  differentiation_opportunity: 0.2,
  profit_margin: 0.15,
}

// ─── Product Images & Links ──────────────────────────────────────────────────

const PRODUCT_INFO: Record<string, { image: string; link: string }> = {
  // Fitness Equipment
  'resistance bands': { image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=resistance+bands' },
  'massage guns': { image: 'https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=massage+gun' },
  'smart water bottles': { image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=smart+water+bottle' },
  'yoga mats': { image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=yoga+mat' },
  'foam rollers': { image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=foam+roller' },
  'jump ropes': { image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=jump+rope' },
  'fitness trackers': { image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=fitness+tracker' },
  'protein shakers': { image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=protein+shaker' },
  // Wellness Supplements
  'collagen powder': { image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=collagen+powder' },
  probiotics: { image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=probiotics' },
  'vitamin gummies': { image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=vitamin+gummies' },
  adaptogens: { image: 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=adaptogens' },
  'protein powder': { image: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=protein+powder' },
  omega3: { image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=omega+3' },
  'omega-3': { image: 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=omega+3' },
  'electrolyte drinks': { image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=electrolyte+drinks' },
  'sleep aids': { image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=sleep+aids' },
  // Fitness Tech
  'smart watches': { image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=smart+watch' },
  'fitness rings': { image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=fitness+ring' },
  'posture correctors': { image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=posture+corrector' },
  'EMS trainers': { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=ems+trainer' },
  'smart jump ropes': { image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=smart+jump+rope' },
  'heart rate monitors': { image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=heart+rate+monitor' },
  'sleep trackers': { image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=sleep+tracker' },
  'recovery boots': { image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=recovery+boots' },
  // Outdoor Gear
  'portable hammocks': { image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=portable+hammock' },
  'camping cookware': { image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=camping+cookware' },
  'water filtration': { image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=water+filtration' },
  'solar chargers': { image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=solar+charger' },
  'tactical flashlights': { image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=tactical+flashlight' },
  'inflatable paddleboards': { image: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=inflatable+paddleboard' },
  'hiking poles': { image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=hiking+poles' },
  'survival kits': { image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=survival+kit' },
  // Home Gym
  'adjustable dumbbells': { image: 'https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=adjustable+dumbbells' },
  'pull-up bars': { image: 'https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=pull+up+bar' },
  kettlebells: { image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=kettlebell' },
  'gym mirrors': { image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=gym+mirror' },
  'cable machines': { image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=cable+machine' },
  'weight benches': { image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=weight+bench' },
  'exercise bikes': { image: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=exercise+bike' },
  'rowing machines': { image: 'https://images.unsplash.com/photo-1591291621164-2c6367723315?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=rowing+machine' },
  // Beauty & Skincare
  'LED face masks': { image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=led+face+mask' },
  'microcurrent devices': { image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=microcurrent+device' },
  'derma rollers': { image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=derma+roller' },
  'jade gua sha': { image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=gua+sha' },
  'cryo globes': { image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=cryo+globes' },
  'SPF sunscreen': { image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=spf+sunscreen' },
  'retinol serums': { image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=retinol+serum' },
  'hyaluronic acid': { image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=hyaluronic+acid' },
  // Kitchen Gadgets
  'air fryers': { image: 'https://images.unsplash.com/photo-1626074353765-517a681e40be?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=air+fryer' },
  spiralizers: { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=spiralizer' },
  'milk frothers': { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=milk+frother' },
  'electric choppers': { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=electric+chopper' },
  'pasta makers': { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=pasta+maker' },
  'sous vide': { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=sous+vide' },
  'espresso makers': { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=espresso+maker' },
  blenders: { image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=blender' },
  // Pet Products
  'automatic feeders': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=automatic+pet+feeder' },
  'pet cameras': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=pet+camera' },
  'water fountains': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=pet+water+fountain' },
  'grooming tools': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=pet+grooming+tools' },
  'anxiety wraps': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=pet+anxiety+wrap' },
  'interactive toys': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=interactive+pet+toys' },
  'GPS trackers': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=pet+gps+tracker' },
  'litter boxes': { image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=litter+box' },
  // Other
  'phone accessories': { image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=phone+accessories' },
  'car gadgets': { image: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=car+gadgets' },
  'desk organizers': { image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=desk+organizer' },
  'travel gear': { image: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=travel+gear' },
  'smart home devices': { image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=smart+home+devices' },
  'wearable tech': { image: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=wearable+tech' },
  'eco-friendly products': { image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=eco+friendly+products' },
  'novelty gifts': { image: 'https://images.unsplash.com/photo-1513201099705-a9746e1e201f?w=400&h=300&fit=crop', link: 'https://www.amazon.com/s?k=novelty+gifts' },
}

function getProductInfo(name: string) {
  const exact = PRODUCT_INFO[name]
  if (exact) return exact
  const lower = name.toLowerCase()
  const hit = Object.keys(PRODUCT_INFO).find((k) => k.toLowerCase() === lower)
  if (hit) return PRODUCT_INFO[hit]
  return {
    image:
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop',
    link: 'https://www.amazon.com/s?k=' + encodeURIComponent(name),
  }
}

const STEPS = [
  { id: 1, label: 'Describe', icon: Target },
  { id: 2, label: 'Category', icon: BarChart3 },
  { id: 3, label: 'Filter', icon: Zap },
  { id: 4, label: 'Score', icon: TrendingUp },
  { id: 5, label: 'Result', icon: Rocket },
]

// ─── Component ───────────────────────────────────────────────────────────────

export default function ViralProductGuide() {
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Step 1: Client input
  const [clientDescription, setClientDescription] = useState('')
  const [budget, setBudget] = useState('')
  const [timeline, setTimeline] = useState('')

  // Step 2: Category
  const [categoryResult, setCategoryResult] = useState<CategoryResult | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Step 3: Filter
  const [filterResults, setFilterResults] = useState<FilterResults | null>(null)

  // Step 4: Score
  const [scoreResults, setScoreResults] = useState<ScoreResults | null>(null)

  // Step 5: Final ranking
  const [rankedNiches, setRankedNiches] = useState<NicheCandidate[]>([])

  // Reel creation
  const [creatingReel, setCreatingReel] = useState(false)
  const [reelUrl, setReelUrl] = useState<string | null>(null)
  const [reelExt, setReelExt] = useState('mp4')

  // Amazon UK first-product image for the top niche only
  const [amazonImage, setAmazonImage] = useState<string | null>(null)
  const [amazonProductUrl, setAmazonProductUrl] = useState<string | null>(null)
  const [amazonLoading, setAmazonLoading] = useState(false)
  const [amazonBlocked, setAmazonBlocked] = useState(false)

  const fetchAmazonTopImage = useCallback((topNiche: string) => {
    setAmazonLoading(true)
    setAmazonBlocked(false)
    setAmazonImage(null)
    setAmazonProductUrl(null)
    fetch(
      `/api/wildbuy/amazon-image?q=${encodeURIComponent(topNiche)}&domain=www.amazon.co.uk`,
    )
      .then(async (res) => {
        const data = await res.json().catch(() => null)
        if (res.ok && data?.image) {
          setAmazonImage(data.image)
          setAmazonProductUrl(data.productUrl || null)
        } else if (res.status === 451 || data?.blocked) {
          setAmazonBlocked(true)
        }
      })
      .catch(() => setAmazonBlocked(true))
      .finally(() => setAmazonLoading(false))
  }, [])

  const callAPI = useCallback(
    async (step: string, payload: Record<string, unknown>) => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/wildbuy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ step, ...payload }),
        })
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || 'API error')
        return data.result
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
        return null
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // Step 1 → 2: Classify category
  const handleStep1Submit = async () => {
    if (!clientDescription.trim()) return
    const result = await callAPI('category', { clientDescription })
    if (result) {
      setCategoryResult(result)
      setSelectedCategory(result.choice)
      setCurrentStep(2)
    }
  }

  // Step 2 → 3: Filter niches
  const handleStep2Submit = async () => {
    if (!selectedCategory) return
    const result = await callAPI('filter', {
      clientDescription,
      category: selectedCategory,
      constraints: { budget, timeline },
    })
    if (result) {
      setFilterResults(result)
      setCurrentStep(3)
    }
  }

  // Step 3 → 4: Score niches
  const handleStep3Submit = async () => {
    const result = await callAPI('score', {
      clientDescription,
      category: selectedCategory,
      nicheCandidates: NICHE_CANDIDATES[selectedCategory || 'other'] || NICHE_CANDIDATES.other,
    })
    if (result) {
      setScoreResults(result)
      setCurrentStep(4)
    }
  }

  // Step 4 → 5: Compute composite ranking
  const handleStep4Submit = () => {
    if (!scoreResults) return

    const normalize = (score: number | undefined, max: number) => (score ?? 0) / max

    const candidates = NICHE_CANDIDATES[selectedCategory || 'other'] || NICHE_CANDIDATES.other
    const ranked: NicheCandidate[] = candidates.map((name) => {
      const nicheScores = scoreResults[name]
      if (!nicheScores) return { name, scores: { market_size: 0, trend_velocity: 0, differentiation_opportunity: 0, profit_margin: 0 }, composite: 0 }

      const ms = normalize(nicheScores.market_size?.score, 3)
      const tv = normalize(nicheScores.trend_velocity?.score, 3)
      const do_ = normalize(nicheScores.differentiation?.score, 3)
      const pm = normalize(nicheScores.profit_margin?.score, 3)

      const composite =
        WEIGHTS.market_size * ms +
        WEIGHTS.trend_velocity * tv +
        WEIGHTS.differentiation_opportunity * do_ +
        WEIGHTS.profit_margin * pm

      return {
        name,
        scores: {
          market_size: ms,
          trend_velocity: tv,
          differentiation_opportunity: do_,
          profit_margin: pm,
        },
        composite,
      }
    }).sort((a, b) => b.composite - a.composite)

    setRankedNiches(ranked)
    setCurrentStep(5)
    if (ranked[0]) fetchAmazonTopImage(ranked[0].name)
  }

  // Create a 10-second reel from product images
  const handleCreateReel = async () => {
    if (rankedNiches.length === 0) return
    setCreatingReel(true)
    setReelUrl(null)
    setError(null)

    try {
      if (
        typeof MediaRecorder === 'undefined' ||
        typeof document.createElement('canvas').captureStream !== 'function'
      ) {
        throw new Error('This browser does not support video recording')
      }

      // Take top 5 niches for the reel
      const topNiches = rankedNiches.slice(0, 5)

      // Load images with CORS so the canvas stays untainted
      const loaded = await Promise.all(
        topNiches.map(
          (n) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const img = new Image()
              img.crossOrigin = 'anonymous'
              img.onload = () => resolve(img)
              img.onerror = () =>
                reject(new Error(`Could not load image for ${n.name}`))
              img.src = getProductInfo(n.name).image
            }),
        ),
      )

      // Pick a container the browser can actually encode.
      // Safari records real MP4; Chrome/Firefox record WebM.
      const mimeType = MediaRecorder.isTypeSupported('video/mp4')
        ? 'video/mp4'
        : MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm'
      const ext = mimeType.includes('mp4') ? 'mp4' : 'webm'

      const canvas = document.createElement('canvas')
      canvas.width = 1080 // YouTube Shorts portrait
      canvas.height = 1920
      const ctx = canvas.getContext('2d')!

      const stream = canvas.captureStream(30)
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType,
        videoBitsPerSecond: 8000000,
      })

      const chunks: Blob[] = []
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data)
      }

      const done = new Promise<Blob>((resolve) => {
        mediaRecorder.onstop = () => {
          resolve(new Blob(chunks, { type: mimeType }))
        }
      })

      const DURATION = 10 // seconds
      const perImage = DURATION / loaded.length

      const drawFrame = (img: HTMLImageElement, zoomT: number, niche: (typeof topNiches)[number]) => {
        // Cover-fit with a slow Ken Burns zoom
        const scale =
          Math.max(canvas.width / img.width, canvas.height / img.height) *
          (1 + zoomT * 0.04)
        const w = img.width * scale
        const h = img.height * scale
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)

        // Bottom label bar
        ctx.fillStyle = 'rgba(0,0,0,0.55)'
        ctx.fillRect(0, canvas.height - 260, canvas.width, 260)
        ctx.textAlign = 'center'
        ctx.fillStyle = '#fff'
        ctx.font = 'bold 64px sans-serif'
        ctx.fillText(
          niche.name.replace(/_/g, ' ').toUpperCase(),
          canvas.width / 2,
          canvas.height - 140,
        )
        ctx.font = 'bold 52px sans-serif'
        ctx.fillStyle = '#4ade80'
        ctx.fillText(
          `${(niche.composite * 100).toFixed(0)}% Match · WildBuy`,
          canvas.width / 2,
          canvas.height - 70,
        )
      }

      mediaRecorder.start(250)

      // Single animation loop driven by time relative to recording start
      const t0 = performance.now()
      await new Promise<void>((resolve) => {
        const tick = (now: number) => {
          const elapsed = (now - t0) / 1000
          if (elapsed >= DURATION) {
            resolve()
            return
          }
          const idx = Math.min(
            Math.floor(elapsed / perImage),
            loaded.length - 1,
          )
          drawFrame(loaded[idx], elapsed - idx * perImage, topNiches[idx])
          requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })

      mediaRecorder.stop()
      const blob = await done

      if (blob.size < 10000) {
        throw new Error('Recording came out empty — please try again')
      }

      setReelExt(ext)
      setReelUrl(URL.createObjectURL(blob))
    } catch (err) {
      console.error('Reel creation failed:', err)
      setError(`Reel creation failed: ${err instanceof Error ? err.message : 'Unknown error'}. Make sure your browser supports MediaRecorder.`)
    } finally {
      setCreatingReel(false)
    }
  }

  const goBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1)
  }

  const reset = () => {
    setCurrentStep(1)
    setClientDescription('')
    setBudget('')
    setTimeline('')
    setCategoryResult(null)
    setSelectedCategory(null)
    setFilterResults(null)
    setScoreResults(null)
    setRankedNiches([])
    setError(null)
    setReelUrl(null)
    setReelExt('mp4')
    setCreatingReel(false)
    setAmazonImage(null)
    setAmazonProductUrl(null)
    setAmazonBlocked(false)
    setAmazonLoading(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((step) => {
            const Icon = step.icon
            const isActive = currentStep === step.id
            const isComplete = currentStep > step.id
            return (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-primary text-primary-foreground glow-green-sm'
                        : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {isComplete ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                {step.id < STEPS.length && (
                  <div
                    className={`w-12 sm:w-20 h-0.5 mx-1 transition-all duration-300 ${
                      currentStep > step.id ? 'bg-green-500' : 'bg-muted'
                    }`}
                  />
                )}
              </div>
            )
          })}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          Step {currentStep} of {STEPS.length} — {STEPS[currentStep - 1].label}
        </p>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
          <p className="text-sm text-destructive">{error}</p>
        </motion.div>
      )}

      {/* Loading */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 p-8 rounded-xl bg-card border border-border text-center"
        >
          <div className="inline-flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-muted-foreground">Jev is thinking...</span>
          </div>
        </motion.div>
      )}

      {/* Steps */}
      <AnimatePresence mode="wait">
        {/* Step 1: Client Description */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-2xl font-bold mb-2">
              What are you looking for?
            </h2>
            <p className="text-muted-foreground mb-6">
              Describe the viral product you want to find. Be as specific as you
              can.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Product description
                </label>
                <textarea
                  value={clientDescription}
                  onChange={(e) => setClientDescription(e.target.value)}
                  placeholder="e.g., I want to find a viral fitness product for busy professionals who don't have time to go to the gym..."
                  className="w-full h-32 px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Budget
                  </label>
                  <input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    placeholder="e.g., under $50"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Timeline
                  </label>
                  <input
                    type="text"
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    placeholder="e.g., 3 months"
                    className="w-full px-4 py-3 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              <button
                onClick={handleStep1Submit}
                disabled={!clientDescription.trim() || loading}
                className="w-full mt-4 px-6 py-4 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Find My Viral Product
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Category Selection */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-2xl font-bold mb-2">Select a category</h2>
            <p className="text-muted-foreground mb-6">
              Jev analyzed your description. Pick the category that fits best, or
              choose a different one.
            </p>

            {categoryResult && (
              <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm font-medium mb-1">
                  Jev recommends:{' '}
                  <span className="text-primary">
                    {CATEGORIES.find((c) => c.id === categoryResult.choice)
                      ?.label || categoryResult.choice}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Confidence: {(categoryResult.confidence * 100).toFixed(0)}%
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-6">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    selectedCategory === cat.id
                      ? 'border-primary bg-primary/10 glow-green-sm'
                      : 'border-border bg-card hover:border-primary/50'
                  }`}
                >
                  <span className="text-2xl mb-2 block">{cat.icon}</span>
                  <span className="text-sm font-medium">{cat.label}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleStep2Submit}
                disabled={!selectedCategory || loading}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Niche Filtering */}
        {currentStep === 3 && filterResults && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-2xl font-bold mb-2">Viability check</h2>
            <p className="text-muted-foreground mb-6">
              Jev evaluated your niche against key criteria. Review the results.
            </p>

            <div className="space-y-3 mb-6">
              {[
                {
                  key: 'has_high_demand',
                  label: 'High demand',
                  icon: Users,
                  value: filterResults.has_high_demand.noul,
                },
                {
                  key: 'fits_budget',
                  label: 'Fits budget',
                  icon: DollarSign,
                  value: filterResults.fits_budget.noul,
                },
                {
                  key: 'matches_timeline',
                  label: 'Matches timeline',
                  icon: Clock,
                  value: filterResults.matches_timeline.noul,
                },
                {
                  key: 'has_viral_potential',
                  label: 'Viral potential',
                  icon: Sparkles,
                  value: filterResults.has_viral_potential.noul,
                },
                {
                  key: 'low_competition',
                  label: 'Low competition',
                  icon: Target,
                  value: filterResults.low_competition.noul,
                },
              ].map((item) => {
                const Icon = item.icon
                const passed = item.value >= 0.7
                const uncertain = item.value >= 0.3 && item.value < 0.7
                return (
                  <div
                    key={item.key}
                    className={`p-4 rounded-lg border flex items-center gap-4 ${
                      passed
                        ? 'border-green-500/30 bg-green-500/5'
                        : uncertain
                          ? 'border-yellow-500/30 bg-yellow-500/5'
                          : 'border-red-500/30 bg-red-500/5'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        passed
                          ? 'bg-green-500/20 text-green-500'
                          : uncertain
                            ? 'bg-yellow-500/20 text-yellow-500'
                            : 'bg-red-500/20 text-red-500'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {(item.value * 100).toFixed(0)}% probability
                      </p>
                    </div>
                    <div
                      className={`text-sm font-bold ${
                        passed
                          ? 'text-green-500'
                          : uncertain
                            ? 'text-yellow-500'
                            : 'text-red-500'
                      }`}
                    >
                      {passed ? 'PASS' : uncertain ? 'MAYBE' : 'FAIL'}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleStep3Submit}
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Score Niches
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 4: Scoring */}
        {currentStep === 4 && scoreResults && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-2xl font-bold mb-2">Niche scoring</h2>
            <p className="text-muted-foreground mb-6">
              Jev scored each niche across four dimensions.
            </p>

            <div className="space-y-4 mb-6">
              {Object.entries(scoreResults).map(([niche, scores]) => {
                const avgScore = (
                  (scores.market_size?.score ?? 0) +
                  (scores.trend_velocity?.score ?? 0) +
                  (scores.differentiation?.score ?? 0) +
                  (scores.profit_margin?.score ?? 0)
                ) / 4
                const normalized = avgScore / 3
                return (
                  <div
                    key={niche}
                    className="p-4 rounded-lg border border-border"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium capitalize">{niche.replace(/_/g, ' ')}</span>
                      <span className="text-sm text-muted-foreground">
                        {(normalized * 100).toFixed(0)}% avg
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${normalized * 100}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full rounded-full bg-primary"
                      />
                    </div>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[
                        { label: 'Market', score: scores.market_size.score },
                        { label: 'Trend', score: scores.trend_velocity.score },
                        { label: 'Diff', score: scores.differentiation.score },
                        { label: 'Margin', score: scores.profit_margin.score },
                      ].map((s) => (
                        <div key={s.label} className="text-center">
                          <div className="text-xs text-muted-foreground">{s.label}</div>
                          <div className="text-sm font-medium">{s.score.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex gap-3">
              <button
                onClick={goBack}
                className="px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <button
                onClick={handleStep4Submit}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
              >
                See Rankings
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}

        {/* Step 5: Final Results */}
        {currentStep === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 sm:p-8 rounded-2xl bg-card border border-border"
          >
            <h2 className="text-2xl font-bold mb-2">
              Your optimal niches
            </h2>
            <p className="text-muted-foreground mb-6">
              Ranked by composite score across all dimensions.
            </p>

            <div className="space-y-4 mb-6">
              {rankedNiches.map((niche, i) => {
                const info = getProductInfo(niche.name)
                return (
                  <motion.div
                    key={niche.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-xl border overflow-hidden ${
                      i === 0
                        ? 'border-primary bg-primary/10 glow-green-sm'
                        : 'border-border bg-card'
                    }`}
                  >
                    <a
                      href={info.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block group"
                    >
                      <div className="relative h-32 sm:h-40 overflow-hidden">
                        <img
                          src={info.image}
                          alt={niche.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                                i === 0
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-white/20 text-white backdrop-blur-sm'
                              }`}
                            >
                              {i + 1}
                            </span>
                            <span className="font-semibold text-white capitalize">
                              {niche.name}
                            </span>
                          </div>
                          <span className="text-white/80 text-sm font-medium">
                            View on Amazon
                          </span>
                        </div>
                      </div>
                    </a>
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-lg font-bold ${i === 0 ? 'text-primary' : 'text-muted-foreground'}`}>
                          {(niche.composite * 100).toFixed(0)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {[
                          { label: 'Market', value: niche.scores.market_size },
                          { label: 'Trend', value: niche.scores.trend_velocity },
                          { label: 'Diff', value: niche.scores.differentiation_opportunity },
                          { label: 'Margin', value: niche.scores.profit_margin },
                        ].map((s) => (
                          <div key={s.label} className="text-center">
                            <div className="text-xs text-muted-foreground mb-1">{s.label}</div>
                            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${s.value * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {rankedNiches[0] && (
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20 mb-6">
                <p className="text-sm font-medium text-green-500">
                  Top recommendation: {rankedNiches[0].name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  This niche has the best combination of market size, trend
                  velocity, differentiation opportunity, and profit margin for
                  your criteria.
                </p>
                <div className="mt-3 rounded-lg overflow-hidden border border-green-500/20 bg-black/20">
                  {amazonLoading && (
                    <p className="p-4 text-xs text-muted-foreground">
                      Loading first result from amazon.co.uk…
                    </p>
                  )}
                  {!amazonLoading && amazonImage && (
                    <a
                      href={
                        amazonProductUrl ||
                        `https://www.amazon.co.uk/s?k=${encodeURIComponent(rankedNiches[0].name)}`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <img
                        src={amazonImage}
                        alt={`First Amazon UK result for ${rankedNiches[0].name}`}
                        className="w-full h-48 object-contain bg-white"
                      />
                      <p className="p-2 text-xs text-muted-foreground text-center">
                        First result on amazon.co.uk — click to view
                      </p>
                    </a>
                  )}
                  {!amazonLoading && !amazonImage && (
                    <p className="p-4 text-xs text-muted-foreground">
                      {amazonBlocked
                        ? 'Amazon blocked server-side scraping (WAF). Set RAINFOREST_API_KEY or run scripts/scrape-amazon-uk.mjs locally for the live image.'
                        : 'Live Amazon image unavailable — showing catalogue preview above.'}{' '}
                      <a
                        href={`https://www.amazon.co.uk/s?k=${encodeURIComponent(rankedNiches[0].name)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        Search amazon.co.uk
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 px-6 py-3 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center gap-2"
              >
                Start Over
              </button>
              <button
                onClick={handleCreateReel}
                disabled={creatingReel}
                className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {creatingReel ? (
                  <>
                    <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Film className="w-5 h-5" />
                    Create Reel
                  </>
                )}
              </button>
            </div>

            {reelUrl && (
              <div className="mt-4 p-4 rounded-lg bg-card border border-border">
                <p className="text-sm font-medium mb-2">Your reel is ready!</p>
                <video
                  controls
                  preload="none"
                  playsInline
                  className="w-full rounded-lg"
                  style={{ maxHeight: 300 }}
                >
                  <source
                    src={reelUrl}
                    type={reelExt === 'mp4' ? 'video/mp4' : 'video/webm'}
                  />
                  Your browser does not support the video tag.
                </video>
                <div className="flex gap-2 mt-3">
                  <a
                    href={reelUrl}
                    download={`wildbuy-reel.${reelExt}`}
                    className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium text-center hover:opacity-90 transition-opacity"
                  >
                    Download {reelExt.toUpperCase()}
                  </a>
                  <a
                    href={`https://www.youtube.com/upload`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-4 py-2 rounded-lg border border-border text-sm font-medium text-center hover:bg-muted transition-colors"
                  >
                    Upload to YouTube
                  </a>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
