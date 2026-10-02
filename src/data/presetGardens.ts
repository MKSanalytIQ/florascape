import { GardenPlan } from '../types/garden';

export const PRESET_GARDENS: GardenPlan[] = [
  {
    id: 'english-cottage-sanctuary',
    title: 'The Whispering Foxglove Cottage Garden',
    tagline: 'A romantic tapestry of layered blooms, fragrant climbing roses, and secret flagstone paths.',
    designNarrative: 'Designed for a 35 x 25 ft space, this English Cottage design creates an immersive sense of wonder. Soft, romantic hues of lilac, blush, and ivory spill gently over hand-laid flagstone paths. A rustic cedar arbour draped with climbing heritage roses frames the garden entrance, while dense companion planting of catmint and salvia deters pests and welcomes native bumblebees.',
    style: 'cottage',
    dimensions: {
      lengthFt: 35,
      widthFt: 25,
      totalSqFt: 875,
    },
    zones: [
      {
        id: 'zone-1',
        name: 'The Rose Arbour & Entry Terrace',
        description: 'Framed with climbing David Austin roses and fragrant sweet peas on rustic timber posts.',
        x: 5,
        y: 5,
        width: 30,
        height: 35,
        themeColor: '#e0c3fc',
        sunLevel: 'full-sun',
        suggestedActivities: 'Morning tea, welcoming guests, inhaling sweet floral scents.'
      },
      {
        id: 'zone-2',
        name: 'Perennial Pollinator Tapestry',
        description: 'Dense drifts of delphiniums, foxgloves, and echinacea creating vertical rhythm and motion.',
        x: 40,
        y: 10,
        width: 55,
        height: 45,
        themeColor: '#8ecae6',
        sunLevel: 'full-sun',
        suggestedActivities: 'Butterfly watching, cutting fresh blooms for indoor vases.'
      },
      {
        id: 'zone-3',
        name: 'Shady Herb & Fern Nook',
        description: 'Cool dappled retreat featuring sweet woodruff, hostas, and culinary mint in glazed containers.',
        x: 10,
        y: 55,
        width: 35,
        height: 40,
        themeColor: '#a7c957',
        sunLevel: 'partial-sun',
        suggestedActivities: 'Reading on a stone bench, harvesting fresh culinary herbs.'
      },
      {
        id: 'zone-4',
        name: 'Flagstone Hearth & Bistro Patio',
        description: 'Sun-drenched patio paved with irregular Pennsylvania bluestone and creeping thyme joints.',
        x: 50,
        y: 60,
        width: 45,
        height: 35,
        themeColor: '#f2cc8f',
        sunLevel: 'full-sun',
        suggestedActivities: 'Al fresco dining, twilight gatherings around copper lanterns.'
      }
    ],
    elements: [
      {
        id: 'elem-1',
        type: 'pergola',
        name: 'Rustic Cedar Arbour',
        x: 12,
        y: 8,
        width: 16,
        height: 12,
        description: 'Hand-crafted cedar arch support for climbing roses.'
      },
      {
        id: 'elem-2',
        type: 'pathway',
        name: 'Curved Flagstone Walkway',
        x: 15,
        y: 22,
        width: 65,
        height: 40,
        description: 'Meandering natural stone path linking the arbour to the dining terrace.'
      },
      {
        id: 'elem-3',
        type: 'seating',
        name: 'Weathered Teak Garden Bench',
        x: 15,
        y: 80,
        width: 12,
        height: 8,
        description: 'Tucked beneath the dappled canopy of a flowering crabapple.'
      },
      {
        id: 'elem-4',
        type: 'gravel_patio',
        name: 'Stone Dining Terrace',
        x: 55,
        y: 65,
        width: 38,
        height: 28,
        description: 'Charming round bistro table and four wrought iron chairs.'
      }
    ],
    plants: [
      {
        id: 'p-1',
        commonName: 'David Austin Heritage Rose',
        botanicalName: 'Rosa "Gertrude Jekyll"',
        type: 'climber',
        x: 14,
        y: 10,
        spreadFt: 4,
        heightFt: 8,
        sunRequirement: 'Full Sun',
        waterNeed: 'Moderate',
        bloomSeason: 'Early Summer to Mid Autumn',
        bloomColor: '#f472b6',
        foliageColor: '#15803d',
        companionTips: 'Thrives next to Nepeta (Catmint) which repels aphids naturally.',
        careSummary: 'Prune dead wood in late winter; top-dress with aged organic compost every spring.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: true
      },
      {
        id: 'p-2',
        commonName: 'Common Foxglove',
        botanicalName: 'Digitalis purpurea',
        type: 'perennial',
        x: 48,
        y: 18,
        spreadFt: 2,
        heightFt: 5,
        sunRequirement: 'Partial Shade',
        waterNeed: 'Moderate',
        bloomSeason: 'Late Spring to Early Summer',
        bloomColor: '#d946ef',
        foliageColor: '#166534',
        companionTips: 'Looks majestic planted behind Lady\'s Mantle and low silver foliage.',
        careSummary: 'Self-seeds freely for annual blooms. Cut back spent spires to encourage side shoots.',
        wildlifeFriendly: true,
        fragrant: false,
        edible: false,
        toxicityWarning: 'All parts toxic if ingested. Safe for borders with supervised pets.'
      },
      {
        id: 'p-3',
        commonName: 'English Lavender',
        botanicalName: 'Lavandula angustifolia "Hidcote"',
        type: 'shrub',
        x: 65,
        y: 25,
        spreadFt: 2.5,
        heightFt: 2,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Mid Summer to Autumn',
        bloomColor: '#818cf8',
        foliageColor: '#94a3b8',
        companionTips: 'Ideal alongside Echinacea and Alliums in gritty, well-draining soil.',
        careSummary: 'Requires well-drained soil and gravel mulch; trim lightly after flowering.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: true
      },
      {
        id: 'p-4',
        commonName: 'Walker\'s Low Catmint',
        botanicalName: 'Nepeta x faassenii',
        type: 'perennial',
        x: 25,
        y: 35,
        spreadFt: 3,
        heightFt: 2.5,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Late Spring through Frost',
        bloomColor: '#6366f1',
        foliageColor: '#64748b',
        companionTips: 'A hero companion that softly masks the bare legs of tall roses.',
        careSummary: 'Shear back by half after first flush for an explosion of second-bloom waves.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: false
      },
      {
        id: 'p-5',
        commonName: 'Purple Coneflower',
        botanicalName: 'Echinacea purpurea',
        type: 'perennial',
        x: 75,
        y: 20,
        spreadFt: 2,
        heightFt: 3.5,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Summer through Early Autumn',
        bloomColor: '#c026d3',
        foliageColor: '#166534',
        companionTips: 'Pair with Rudbeckia and ornamental grasses for golden autumn seedheads.',
        careSummary: 'Leave seedheads intact over winter to feed visiting goldfinches.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: false
      },
      {
        id: 'p-6',
        commonName: 'Lady\'s Mantle',
        botanicalName: 'Alchemilla mollis',
        type: 'groundcover',
        x: 35,
        y: 45,
        spreadFt: 2,
        heightFt: 1.5,
        sunRequirement: 'Partial Shade',
        waterNeed: 'Moderate',
        bloomSeason: 'Late Spring to Summer',
        bloomColor: '#facc15',
        foliageColor: '#4ade80',
        companionTips: 'Catches glistening morning dew drops, creating magical border edging.',
        careSummary: 'Cut back foliage in midsummer if it becomes untidy; fresh leaves emerge within 2 weeks.',
        wildlifeFriendly: true,
        fragrant: false,
        edible: false
      },
      {
        id: 'p-7',
        commonName: 'Creeping Thyme',
        botanicalName: 'Thymus serpyllum',
        type: 'groundcover',
        x: 52,
        y: 62,
        spreadFt: 1.5,
        heightFt: 0.3,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Early to Mid Summer',
        bloomColor: '#ec4899',
        foliageColor: '#22c55e',
        companionTips: 'Tucked between flagstone walkway cracks; releases fragrance underfoot.',
        careSummary: 'Extremely drought tolerant and tolerates moderate foot traffic effortlessly.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: true
      },
      {
        id: 'p-8',
        commonName: 'Flowering Crabapple',
        botanicalName: 'Malus "Prairie Fire"',
        type: 'tree',
        x: 18,
        y: 72,
        spreadFt: 12,
        heightFt: 16,
        sunRequirement: 'Full Sun',
        waterNeed: 'Moderate',
        bloomSeason: 'Mid Spring',
        bloomColor: '#e11d48',
        foliageColor: '#881337',
        companionTips: 'Underplant with spring bulbs: snowdrops, grape hyacinths, and daffodils.',
        careSummary: 'Annual canopy thinning in late winter keeps framework healthy and open.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: false
      }
    ],
    bloomTimeline: [
      {
        season: 'Early Spring',
        plantsInBloom: ['Flowering Crabapple buds', 'Spring bulbs', 'Creeping Phlox'],
        keyHighlights: 'Delicate pink crabapple blossoms ignite the garden; fresh rose shoots begin unfurling.'
      },
      {
        season: 'Late Spring',
        plantsInBloom: ['Common Foxglove', 'Lady\'s Mantle', 'Catmint', 'Heritage Roses'],
        keyHighlights: 'The apex of cottage abundance: foxglove spikes ascend and roses release heavy fragrance.'
      },
      {
        season: 'Early Summer',
        plantsInBloom: ['Heritage Roses', 'English Lavender', 'Delphiniums', 'Catmint'],
        keyHighlights: 'Bumblebees and swallowtails swarm the lavender borders; rose petals shower the flagstone.'
      },
      {
        season: 'Mid Summer',
        plantsInBloom: ['Purple Coneflower', 'English Lavender', 'Second flush of Catmint'],
        keyHighlights: 'Deep magenta coneflowers glow under high summer sun alongside silver lavender spikes.'
      },
      {
        season: 'Autumn',
        plantsInBloom: ['Autumn Sedum', 'Purple Coneflower Seedheads', 'Crabapple Ruby Fruit'],
        keyHighlights: 'Foliage turns bronze and gold; glowing crabapple berries sustain migratory songbirds.'
      },
      {
        season: 'Winter Interest',
        plantsInBloom: ['Cedar Arbour architecture', 'Ornamental seedheads in frost', 'Evergreen boxwood spheres'],
        keyHighlights: 'Frost outlines the curved stone path and architectural arbour framework.'
      }
    ],
    companionPairs: [
      {
        plantA: 'David Austin Heritage Rose',
        plantB: 'Walker\'s Low Catmint',
        relationship: 'beneficial',
        reason: 'Catmint repels harmful aphids and blackfly while concealing the lower woody canes of the rose.'
      },
      {
        plantA: 'English Lavender',
        plantB: 'Purple Coneflower',
        relationship: 'beneficial',
        reason: 'Both share low water requirements, love full sun, and attract complementary pollinators.'
      },
      {
        plantA: 'Common Foxglove',
        plantB: 'Lady\'s Mantle',
        relationship: 'beneficial',
        reason: 'The horizontal chartreuse foam of Lady\'s Mantle anchors the dramatic vertical foxglove spires.'
      }
    ],
    shoppingList: [
      { category: 'Plants', item: 'David Austin Climbing Rose ("Gertrude Jekyll")', estimatedQuantity: '2 specimens', estimatedCost: '$75', priority: 'Essential' },
      { category: 'Plants', item: 'Common Foxglove (Digitalis purpurea) 1-gal', estimatedQuantity: '6 pots', estimatedCost: '$60', priority: 'Essential' },
      { category: 'Plants', item: 'English Lavender ("Hidcote") 2-gal', estimatedQuantity: '8 pots', estimatedCost: '$120', priority: 'Essential' },
      { category: 'Plants', item: 'Walker\'s Low Catmint (Nepeta)', estimatedQuantity: '5 pots', estimatedCost: '$55', priority: 'Essential' },
      { category: 'Plants', item: 'Flowering Crabapple Tree ("Prairie Fire") 15-gal', estimatedQuantity: '1 tree', estimatedCost: '$180', priority: 'Recommended' },
      { category: 'Hardscape & Edging', item: 'Pennsylvania Bluestone Flagstones', estimatedQuantity: '140 sq ft', estimatedCost: '$450', priority: 'Essential' },
      { category: 'Hardscape & Edging', item: 'Cedar Garden Arbour Kit', estimatedQuantity: '1 unit', estimatedCost: '$260', priority: 'Recommended' },
      { category: 'Soil & Mulch', item: 'Rich Organic Mushroom Compost & Dark Hemlock Mulch', estimatedQuantity: '3 cubic yards', estimatedCost: '$160', priority: 'Essential' },
      { category: 'Irrigation & Lighting', item: 'Drip Soaker Line Kit with Smart Timer', estimatedQuantity: '1 kit', estimatedCost: '$85', priority: 'Recommended' }
    ],
    maintenanceTips: {
      spring: [
        'Prune back roses to strong outer-facing buds before sap rises.',
        'Top-dress all perennial beds with 2 inches of composted leaf mould.',
        'Install bamboo supports for tall foxglove and delphinium stems.'
      ],
      summer: [
        'Deadhead roses regularly to stimulate continuous repeat flowering.',
        'Shear catmint back by 50% after the first bloom cycle to trigger lush second flush.',
        'Water deeply at the base during early morning hours to keep rose foliage dry.'
      ],
      autumn: [
        'Leave coneflower seedheads standing for winter bird forage.',
        'Plant spring-flowering bulbs (alliums, tulips, snowdrops) into pockets.',
        'Mulch rose crowns with shredded bark before the ground freezes.'
      ],
      winter: [
        'Inspect arbour timbers and tighten wire trellising.',
        'Brush heavy snow off the evergreens and tender branches.'
      ]
    },
    suggestedImagePrompts: [
      {
        perspective: 'Main Garden Landscape View',
        prompt: 'A romantic English cottage garden landscape with winding bluestone path, overflowing borders of purple foxgloves, pink heritage climbing roses on a cedar arbour, soft morning mist, warm golden sunbeams, photorealistic 8k architectural landscape photography'
      },
      {
        perspective: 'Rose Arbour & Walkway Close-up',
        prompt: 'Eye-level view through a rustic wooden garden arbour laden with blooming pink roses, looking down a curved stone walkway bordered by purple lavender and chartreuse lady\'s mantle, cinematic soft focus'
      },
      {
        perspective: 'Bistro Terrace Golden Hour View',
        prompt: 'Charming bluestone dining terrace with round bistro table and wrought iron chairs in a lush English cottage garden, glowing amber string lights at dusk, overflowing flower beds, peaceful tranquil mood'
      }
    ],
    visuals: [
      {
        id: 'vis-1',
        url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=1600&q=80',
        prompt: 'A romantic English cottage garden landscape with winding bluestone path, overflowing borders of purple foxgloves, pink heritage climbing roses on a cedar arbour, soft morning mist, warm golden sunbeams',
        aspectRatio: '16:9',
        createdAt: '2026-10-02T10:00:00Z',
        perspectiveLabel: 'Main Garden Landscape View'
      },
      {
        id: 'vis-2',
        url: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?auto=format&fit=crop&w=1200&q=80',
        prompt: 'Sunlit stone pathway through lush purple lavender and blooming cottage perennials, morning dew, vibrant botanical garden',
        aspectRatio: '4:3',
        createdAt: '2026-10-02T10:05:00Z',
        perspectiveLabel: 'Stone Pathway & Lavender Border'
      }
    ],
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'zen-japanese-courtyard',
    title: 'The Karesansui Zen Courtyard',
    tagline: 'An oasis of stillness featuring sculptural Japanese maples, raked river gravel, and stone water basins.',
    designNarrative: 'Embodying Wabi-Sabi principles, this 30 x 20 ft Japanese courtyard garden balances negative space with organic asymmetry. A weeping crimson Japanese Maple commands the focal point above a natural moss-carpeted mound. Smooth dark basalt stepping stones lead across concentric raked river gravel ripples toward a whispering bamboo fountain (tsukubai), evoking profound serenity in any urban setting.',
    style: 'zen',
    dimensions: {
      lengthFt: 30,
      widthFt: 20,
      totalSqFt: 600,
    },
    zones: [
      {
        id: 'zen-z-1',
        name: 'The Ocean of Gravel (Karesansui)',
        description: 'Fine white river gravel raked in meditative wave ripples representing water currents.',
        x: 10,
        y: 10,
        width: 45,
        height: 50,
        themeColor: '#e2e8f0',
        sunLevel: 'partial-sun',
        suggestedActivities: 'Mindful raking, peaceful visual contemplation.'
      },
      {
        id: 'zen-z-2',
        name: 'The Tsukubai Water Basin Nook',
        description: 'Traditional carved granite water basin fed by a slow bamboo spout with mossy boulders.',
        x: 60,
        y: 15,
        width: 35,
        height: 35,
        themeColor: '#0ea5e9',
        sunLevel: 'shade',
        suggestedActivities: 'Listening to the acoustic rhythm of trickling water, bird drinking.'
      },
      {
        id: 'zen-z-3',
        name: 'Maple & Moss Island',
        description: 'Sculptural red Japanese maple canopy shading emerald moss and dwarf bamboo.',
        x: 15,
        y: 65,
        width: 40,
        height: 30,
        themeColor: '#84cc16',
        sunLevel: 'partial-sun',
        suggestedActivities: 'Appreciating dramatic seasonal foliage changes.'
      },
      {
        id: 'zen-z-4',
        name: 'Cedar Engawa Viewing Deck',
        description: 'Low-slung minimalist cedar platform with cushions overlooking the courtyard landscape.',
        x: 60,
        y: 55,
        width: 35,
        height: 40,
        themeColor: '#d97706',
        sunLevel: 'partial-sun',
        suggestedActivities: 'Meditation, green tea ceremony, quiet journaling.'
      }
    ],
    elements: [
      {
        id: 'zen-e-1',
        type: 'water_feature',
        name: 'Granite Tsukubai & Bamboo Flute',
        x: 72,
        y: 25,
        width: 14,
        height: 14,
        description: 'Natural stone water basin nestled into river pebbles.'
      },
      {
        id: 'zen-e-2',
        type: 'pathway',
        name: 'Charcoal Basalt Stepping Stones',
        x: 35,
        y: 35,
        width: 45,
        height: 25,
        description: 'Smooth river-worn basalt slabs floating over raked gravel.'
      },
      {
        id: 'zen-e-3',
        type: 'seating',
        name: 'Cedar Engawa Veranda',
        x: 65,
        y: 60,
        width: 28,
        height: 30,
        description: 'Japanese-style covered wooden contemplation deck.'
      }
    ],
    plants: [
      {
        id: 'zp-1',
        commonName: 'Japanese Maple "Bloodgood"',
        botanicalName: 'Acer palmatum "Bloodgood"',
        type: 'tree',
        x: 25,
        y: 75,
        spreadFt: 15,
        heightFt: 15,
        sunRequirement: 'Partial Shade',
        waterNeed: 'Moderate',
        bloomSeason: 'Autumn Foliage Display',
        bloomColor: '#991b1b',
        foliageColor: '#7f1d1d',
        companionTips: 'Looks ethereal when underplanted with golden Japanese Forest Grass.',
        careSummary: 'Shelter from harsh drying winds; prune only in late autumn to preserve sculptural silhouette.',
        wildlifeFriendly: true,
        fragrant: false,
        edible: false
      },
      {
        id: 'zp-2',
        commonName: 'Golden Japanese Forest Grass',
        botanicalName: 'Hakonechloa macra "Aureola"',
        type: 'perennial',
        x: 38,
        y: 78,
        spreadFt: 2.5,
        heightFt: 1.5,
        sunRequirement: 'Partial Shade',
        waterNeed: 'Moderate',
        bloomSeason: 'Summer to Autumn Breeze Movement',
        bloomColor: '#ca8a04',
        foliageColor: '#eab308',
        companionTips: 'Softens stone edges and ripples like flowing water in gentle breezes.',
        careSummary: 'Cut back dried stalks to the crown in late winter.',
        wildlifeFriendly: false,
        fragrant: false,
        edible: false
      },
      {
        id: 'zp-3',
        commonName: 'Black Bamboo',
        botanicalName: 'Phyllostachys nigra',
        type: 'shrub',
        x: 82,
        y: 12,
        spreadFt: 4,
        heightFt: 12,
        sunRequirement: 'Partial Shade',
        waterNeed: 'Moderate',
        bloomSeason: 'Year-round Evergreen Canes',
        bloomColor: '#09090b',
        foliageColor: '#15803d',
        companionTips: 'Grow in root barrier containers along perimeter fences for privacy screens.',
        careSummary: 'Always install a 60-mil HDPE root barrier or plant in heavy ceramic pots.',
        wildlifeFriendly: true,
        fragrant: false,
        edible: false
      },
      {
        id: 'zp-4',
        commonName: 'Dwarf Mondo Grass',
        botanicalName: 'Ophiopogon japonicus "Nana"',
        type: 'groundcover',
        x: 65,
        y: 35,
        spreadFt: 1,
        heightFt: 0.5,
        sunRequirement: 'Partial Shade',
        waterNeed: 'Moderate',
        bloomSeason: 'Mid Summer',
        bloomColor: '#c084fc',
        foliageColor: '#022c22',
        companionTips: 'Creates rich deep-green carpets around stepping stones and boulders.',
        careSummary: 'Low maintenance evergreen; requires minimal mowing or trimming.',
        wildlifeFriendly: false,
        fragrant: false,
        edible: false
      }
    ],
    bloomTimeline: [
      {
        season: 'Early Spring',
        plantsInBloom: ['Japanese Maple budding ruby shoots', 'Moss greening'],
        keyHighlights: 'Luminous crimson buds emerge like paper origami against dark branches.'
      },
      {
        season: 'Early Summer',
        plantsInBloom: ['Hakonechloa golden ribbons', 'Dwarf Mondo grass blooms'],
        keyHighlights: 'Whispering bamboo rustle in summer breezes; cool water fountain soothing the air.'
      },
      {
        season: 'Autumn',
        plantsInBloom: ['Fiery Japanese Maple canopy', 'Amber Forest Grass'],
        keyHighlights: 'A fiery spectacle of scarlet maple leaves falling onto white raked gravel.'
      },
      {
        season: 'Winter Interest',
        plantsInBloom: ['Sculptural dark maple silhouette', 'Black bamboo canes against snow'],
        keyHighlights: 'Pristine snow settles on stone lanterns and mossy boulders.'
      }
    ],
    companionPairs: [
      {
        plantA: 'Acer palmatum "Bloodgood"',
        plantB: 'Hakonechloa macra "Aureola"',
        relationship: 'beneficial',
        reason: 'The chartreuse arching blades illuminate the deep burgundy maple canopy above.'
      }
    ],
    shoppingList: [
      { category: 'Plants', item: 'Japanese Maple "Bloodgood" Specimen Tree', estimatedQuantity: '1 tree (25-gal)', estimatedCost: '$290', priority: 'Essential' },
      { category: 'Plants', item: 'Hakonechloa Japanese Forest Grass', estimatedQuantity: '6 pots (1-gal)', estimatedCost: '$90', priority: 'Essential' },
      { category: 'Plants', item: 'Black Bamboo in root barrier planter', estimatedQuantity: '3 clumps', estimatedCost: '$160', priority: 'Recommended' },
      { category: 'Hardscape & Edging', item: 'Decomposed Granite & Crushed White Quartz Gravel', estimatedQuantity: '2 tons', estimatedCost: '$320', priority: 'Essential' },
      { category: 'Hardscape & Edging', item: 'Carved Granite Tsukubai Stone Basin with Bamboo spout', estimatedQuantity: '1 set', estimatedCost: '$240', priority: 'Essential' },
      { category: 'Hardscape & Edging', item: 'Charcoal Basalt Stepping Pavers', estimatedQuantity: '12 slabs', estimatedCost: '$180', priority: 'Essential' }
    ],
    maintenanceTips: {
      spring: ['Gently rake new patterns into river gravel using wooden zen rake.'],
      summer: ['Clean algae from stone water basin and inspect pump flow.'],
      autumn: ['Gently clear fallen maple leaves from the gravel surface each evening.'],
      winter: ['Drain water basin before hard freeze to protect granite stone.']
    },
    suggestedImagePrompts: [
      {
        perspective: 'Courtyard Overview',
        prompt: 'A tranquil Japanese zen courtyard garden with a sculptural red Japanese maple, circular raked gravel ripples, basalt stepping stones, stone water basin, clean cedar wood deck, soft indirect morning light, photorealistic architectural photography'
      }
    ],
    visuals: [
      {
        id: 'vis-zen-1',
        url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=80',
        prompt: 'A tranquil Japanese zen courtyard garden with sculptural red maple and stone water basin',
        aspectRatio: '16:9',
        createdAt: '2026-10-02T10:00:00Z',
        perspectiveLabel: 'Zen Courtyard Landscape'
      }
    ],
    createdAt: '2026-10-02T10:00:00Z'
  },
  {
    id: 'mediterranean-drought-tolerant',
    title: 'The Sunlit Olive & Terracotta Haven',
    tagline: 'A climate-resilient sanctuary of silver-leaved olive trees, fragrant herbs, and gravel courtyard charm.',
    designNarrative: 'Engineered for drought tolerance and effortless summer warmth, this 40 x 30 ft Mediterranean design combines water-wise efficiency with timeless rustic elegance. Gnarled specimen olive trees cast gentle shade over porous pea gravel. Low-water aromatics including Russian sage, French lavender, and creeping rosemary create a sensory haven requiring 70% less irrigation than traditional turf lawns.',
    style: 'mediterranean',
    dimensions: {
      lengthFt: 40,
      widthFt: 30,
      totalSqFt: 1200,
    },
    zones: [
      {
        id: 'med-z-1',
        name: 'The Olive Grove & Gravel Terrace',
        description: 'Porous limestone pea gravel underplanted with lavender mounds and dwarf olive trees.',
        x: 10,
        y: 10,
        width: 50,
        height: 50,
        themeColor: '#ca8a04',
        sunLevel: 'full-sun',
        suggestedActivities: 'Sipping chilled lemonade, enjoying Mediterranean warmth.'
      },
      {
        id: 'med-z-2',
        name: 'Terracotta Herb Alcove',
        description: 'Collection of rustic Italian terracotta urns overflowing with rosemary, thyme, and oregano.',
        x: 65,
        y: 15,
        width: 30,
        height: 40,
        themeColor: '#ea580c',
        sunLevel: 'full-sun',
        suggestedActivities: 'Snipping fresh aromatic culinary sprigs for grilling.'
      },
      {
        id: 'med-z-3',
        name: 'Pergola Shaded Dining Lounge',
        description: 'Sturdy timber pergola with canvas sails and climbing bougainvillea or grapevine.',
        x: 20,
        y: 65,
        width: 60,
        height: 30,
        themeColor: '#059669',
        sunLevel: 'partial-sun',
        suggestedActivities: 'Long summer evening dinners with friends and family.'
      }
    ],
    elements: [
      {
        id: 'med-e-1',
        type: 'pergola',
        name: 'Weathered Oak Pergola',
        x: 25,
        y: 68,
        width: 35,
        height: 25,
        description: 'Overhead shade structure with woven bamboo canopy.'
      },
      {
        id: 'med-e-2',
        type: 'gravel_patio',
        name: 'Limestone Pea Gravel Ground',
        x: 8,
        y: 8,
        width: 84,
        height: 55,
        description: 'Permeable crunch gravel allowing all rainfall to soak into root zones.'
      }
    ],
    plants: [
      {
        id: 'mp-1',
        commonName: 'European Olive Tree',
        botanicalName: 'Olea europaea "Arbequina"',
        type: 'tree',
        x: 30,
        y: 30,
        spreadFt: 14,
        heightFt: 18,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Spring Blossom, Autumn Olives',
        bloomColor: '#fef08a',
        foliageColor: '#94a3b8',
        companionTips: 'Surround base with French lavender and Russian sage in gravel mulch.',
        careSummary: 'Requires exceptionally well-draining soil; minimal summer watering once established.',
        wildlifeFriendly: true,
        fragrant: false,
        edible: true
      },
      {
        id: 'mp-2',
        commonName: 'Russian Sage',
        botanicalName: 'Salvia yangii',
        type: 'perennial',
        x: 48,
        y: 22,
        spreadFt: 3,
        heightFt: 4,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Mid Summer to Autumn Frost',
        bloomColor: '#7c3aed',
        foliageColor: '#cbd5e1',
        companionTips: 'Fluffy blue-violet spires contrast beautifully against terracotta and white gravel.',
        careSummary: 'Cut back hard in early spring; thrives in nutrient-poor dry soil.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: false
      },
      {
        id: 'mp-3',
        commonName: 'Creeping Rosemary',
        botanicalName: 'Salvia rosmarinus "Prostratus"',
        type: 'shrub',
        x: 68,
        y: 32,
        spreadFt: 4,
        heightFt: 1,
        sunRequirement: 'Full Sun',
        waterNeed: 'Low',
        bloomSeason: 'Late Winter to Early Summer',
        bloomColor: '#38bdf8',
        foliageColor: '#15803d',
        companionTips: 'Cascades over stone retaining walls and terracotta planters.',
        careSummary: 'Loves baking sun and stony soils; trim lightly after blooming.',
        wildlifeFriendly: true,
        fragrant: true,
        edible: true
      }
    ],
    bloomTimeline: [
      {
        season: 'Late Spring',
        plantsInBloom: ['Olive blossom', 'French Lavender', 'Creeping Rosemary'],
        keyHighlights: 'Air fills with herbal oils; honeybees buzz continuously.'
      },
      {
        season: 'Mid Summer',
        plantsInBloom: ['Russian Sage hazy lavender cloud', 'Lavender seedheads', 'Agapanthus'],
        keyHighlights: 'Dazzling violet blooms vibrate against silver-green olive canopies.'
      },
      {
        season: 'Autumn',
        plantsInBloom: ['Ripening olive fruits', 'Late season Russian Sage'],
        keyHighlights: 'Olives turn from emerald to deep glossy purple; gravel stays pleasantly warm.'
      },
      {
        season: 'Winter Interest',
        plantsInBloom: ['Evergreen silver olive foliage', 'Creeping rosemary winter blue flowers'],
        keyHighlights: 'Silver foliage shines during gray winter rains without needing care.'
      }
    ],
    companionPairs: [
      {
        plantA: 'Olea europaea',
        plantB: 'Salvia yangii',
        relationship: 'beneficial',
        reason: 'Both celebrate dry, stony conditions and complement each other in silver and blue tones.'
      }
    ],
    shoppingList: [
      { category: 'Plants', item: 'Fruiting Olive Tree "Arbequina" (15-gal)', estimatedQuantity: '2 trees', estimatedCost: '$340', priority: 'Essential' },
      { category: 'Plants', item: 'Russian Sage (1-gal)', estimatedQuantity: '6 pots', estimatedCost: '$72', priority: 'Essential' },
      { category: 'Hardscape & Edging', item: 'Limestone Pea Gravel (3/8 inch)', estimatedQuantity: '3 tons', estimatedCost: '$280', priority: 'Essential' },
      { category: 'Hardscape & Edging', item: 'Authentic Terracotta Planters (Assorted)', estimatedQuantity: '5 planters', estimatedCost: '$210', priority: 'Recommended' }
    ],
    maintenanceTips: {
      spring: ['Top up pea gravel where settled; thin olive center branches for light penetration.'],
      summer: ['Enjoy the garden with virtually zero watering once established.'],
      autumn: ['Harvest ripe olives for brining or table pressing.'],
      winter: ['Protect young olive trees if temperatures plunge below 15°F (-9°C).']
    },
    suggestedImagePrompts: [
      {
        perspective: 'Mediterranean Courtyard Overview',
        prompt: 'A sun-drenched Mediterranean gravel courtyard with ancient gnarled olive trees, weathered terracotta urns bursting with fragrant lavender and rosemary, rustic stone wall, golden hour sun, architectural landscape photography'
      }
    ],
    visuals: [
      {
        id: 'vis-med-1',
        url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1600&q=80',
        prompt: 'Sunlit olive tree and lavender in Mediterranean gravel terrace',
        aspectRatio: '16:9',
        createdAt: '2026-10-02T10:00:00Z',
        perspectiveLabel: 'Mediterranean Courtyard Terrace'
      }
    ],
    createdAt: '2026-10-02T10:00:00Z'
  }
];
