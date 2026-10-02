import { NextRequest, NextResponse } from 'next/server'

const TYPESAFE_API_KEY = process.env.TYPESAFE_API_KEY
const TYPESAFE_URL = 'https://api.typesafe.ai/v1/systemone'

interface TypeSafeQuestion {
  type: 'choice' | 'noul' | 'score'
  instructions: string
  criteria: Record<string, string> | string[]
}

interface ScoreResult {
  type: 'score'
  score: number
  confidence: number
  probabilities: Record<string, number>
  legend: Record<string, string>
}

interface TypeSafeRequest {
  state: Record<string, unknown>
  questions: Record<string, TypeSafeQuestion>
}

async function callTypeSafe(payload: TypeSafeRequest) {
  const res = await fetch(TYPESAFE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${TYPESAFE_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'jev-latest',
      ...payload,
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`TypeSafe API error: ${res.status} ${text}`)
  }

  return res.json()
}

// Step 2: Category Selection (Choice)
async function classifyCategory(clientDescription: string) {
  const response = await callTypeSafe({
    state: { client_description: clientDescription },
    questions: {
      category: {
        type: 'choice',
        instructions:
          'Which product category best fits what the client is looking for?',
        criteria: {
          fitness_equipment:
            'Physical products for exercise, workout, or physical training',
          wellness_supplements:
            'Consumable health products, vitamins, or supplements',
          fitness_tech: 'Wearables, apps, or digital fitness tools',
          outdoor_gear: 'Equipment for outdoor activities, hiking, or adventure',
          home_gym: 'Products for setting up or enhancing a home workout space',
          beauty_skincare: 'Skincare, beauty, or personal care products',
          kitchen_gadgets: 'Kitchen tools, gadgets, or cooking accessories',
          pet_products: 'Products for pets, pet care, or pet accessories',
          other: 'A category that fits none of the above',
        },
      },
    },
  })

  return response.answers.category
}

// Step 3: Niche Filtering (Noul checklist)
async function filterNiches(
  clientDescription: string,
  category: string,
  constraints: Record<string, string>,
) {
  const response = await callTypeSafe({
    state: {
      client_description: clientDescription,
      selected_category: category,
      constraints,
    },
    questions: {
      has_high_demand: {
        type: 'noul',
        instructions:
          'Does the client description suggest a product with broad consumer demand?',
        criteria: {
          true: 'Appeals to a large or growing audience',
          false: 'Niche or limited appeal',
        },
      },
      fits_budget: {
        type: 'noul',
        instructions:
          "Can a viral product in this category realistically be sourced or made within the client's budget?",
        criteria: {
          true: 'Typical products fit within the stated budget',
          false: 'Products typically exceed the budget',
        },
      },
      matches_timeline: {
        type: 'noul',
        instructions:
          "Is the product idea realistic to launch within the client's timeline?",
        criteria: {
          true: 'Can be sourced, branded, and shipped in the stated time',
          false: 'Requires longer development or sourcing time',
        },
      },
      has_viral_potential: {
        type: 'noul',
        instructions:
          'Does the product concept have characteristics that make it shareable or visually appealing on social media?',
        criteria: {
          true: 'Visual, novel, or emotionally engaging product',
          false: 'Utilitarian or hard to showcase',
        },
      },
      low_competition: {
        type: 'noul',
        instructions:
          'Is there room for a new entrant in this space, or is it saturated?',
        criteria: {
          true: 'Few dominant players or room for differentiation',
          false: 'Crowded market with established brands',
        },
      },
    },
  })

  return response.answers
}

// Step 4: Viability Scoring (Score x N dimensions, per niche)
async function scoreNiches(
  clientDescription: string,
  category: string,
  nicheCandidates: string[],
) {
  // Build one set of Score questions per niche candidate
  // Each niche gets its own independent scoring
  const questions: Record<string, TypeSafeQuestion> = {}

  for (const niche of nicheCandidates) {
    const nicheId = niche.replace(/\s+/g, '_')
    questions[`${nicheId}_market_size`] = {
      type: 'score',
      instructions: `How large is the addressable market for "${niche}"?`,
      criteria: [
        'Very small; limited audience',
        'Moderate; established but not huge',
        'Large; broad consumer interest',
        'Massive; mainstream appeal',
      ],
    }
    questions[`${nicheId}_trend_velocity`] = {
      type: 'score',
      instructions: `How fast is the "${niche}" niche growing right now?`,
      criteria: [
        'Declining or flat',
        'Slow steady growth',
        'Rapidly growing',
        'Explosive viral growth',
      ],
    }
    questions[`${nicheId}_differentiation`] = {
      type: 'score',
      instructions: `How easy is it to stand out in the "${niche}" niche?`,
      criteria: [
        'Nearly impossible; dominated by big brands',
        'Difficult; some room with unique angle',
        'Moderate; several ways to differentiate',
        'Easy; wide open for new entrants',
      ],
    }
    questions[`${nicheId}_profit_margin`] = {
      type: 'score',
      instructions: `What is the realistic profit margin for "${niche}" products?`,
      criteria: [
        'Very thin; commoditized',
        'Moderate; competitive pricing',
        'Healthy; good margin potential',
        'Excellent; premium pricing possible',
      ],
    }
  }

  const response = await callTypeSafe({
    state: {
      client_description: clientDescription,
      selected_category: category,
      niche_candidates: nicheCandidates,
    },
    questions,
  })

  // Restructure: group scores by niche
  // Question keys are formatted as "{nicheId}_{dimension}" where dimension is one of:
  // market_size, trend_velocity, differentiation, profit_margin
  const perNiche: Record<string, Record<string, ScoreResult>> = {}
  for (const [key, result] of Object.entries(response.answers)) {
    // Find which dimension this key ends with
    const dimensions = ['market_size', 'trend_velocity', 'differentiation', 'profit_margin']
    const dimension = dimensions.find((d) => key.endsWith(`_${d}`))
    if (!dimension) continue

    const nicheId = key.slice(0, -(dimension.length + 1))
    const niche = nicheCandidates.find((n) => n.replace(/\s+/g, '_') === nicheId)
    if (!niche) continue

    if (!perNiche[niche]) perNiche[niche] = {}
    perNiche[niche][dimension] = result as ScoreResult
  }

  return perNiche
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { step, clientDescription, category, constraints, nicheCandidates } =
      body

    if (!TYPESAFE_API_KEY) {
      return NextResponse.json(
        { error: 'TYPESAFE_API_KEY not configured' },
        { status: 500 },
      )
    }

    switch (step) {
      case 'category': {
        if (!clientDescription) {
          return NextResponse.json(
            { error: 'Missing clientDescription' },
            { status: 400 },
          )
        }
        const result = await classifyCategory(clientDescription)
        return NextResponse.json({ step, result })
      }

      case 'filter': {
        if (!clientDescription || !category) {
          return NextResponse.json(
            { error: 'Missing clientDescription or category' },
            { status: 400 },
          )
        }
        const result = await filterNiches(
          clientDescription,
          category,
          constraints || {},
        )
        return NextResponse.json({ step, result })
      }

      case 'score': {
        if (!clientDescription || !category || !nicheCandidates) {
          return NextResponse.json(
            { error: 'Missing required fields' },
            { status: 400 },
          )
        }
        const result = await scoreNiches(
          clientDescription,
          category,
          nicheCandidates,
        )
        return NextResponse.json({ step, result })
      }

      default:
        return NextResponse.json({ error: 'Invalid step' }, { status: 400 })
    }
  } catch (error) {
    console.error('WildBuy API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    )
  }
}
