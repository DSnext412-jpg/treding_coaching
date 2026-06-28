/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, BlogPost, CourseCategory, DifficultyLevel, UserRole, UserProfile, MediaFile, UserActivity } from '../types';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'cap-1',
    title: 'Introduction to Candlestick Patterns',
    slug: 'intro-candlestick-patterns',
    description: 'Learn how to read price action on a stock chart using classic red and green candlestick charts.',
    thumbnail: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    category: CourseCategory.TECHNICAL_ANALYSIS,
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['Charts', 'Candlesticks', 'Price Action'],
    readingTime: 5,
    isPublished: true,
    createdAt: '2026-06-01T12:00:00Z',
    updatedAt: '2026-06-01T12:00:00Z',
    price: 1499,
    lectureTimes: 'Tuesdays & Thursdays @ 7:00 PM IST',
    driveLink: 'https://drive.google.com/drive/folders/1a2b3c4d5e_candlesticks',
    liveMeetingLink: 'https://meet.google.com/abc-defg-hij',
    content: `### Understanding Price Charts

Every stock transaction creates two key data points: **Price** and **Volume**. Candlesticks are the visual representation of this dynamic battle between buyers (bulls) and sellers (bears) within a specific timeframe.

#### Anatomy of a Candlestick
A standard Japanese candlestick consists of:
1. **The Body (Real Body)**: The thick rectangular part.
   - **Green (Bullish)**: Close price is *higher* than Open price.
   - **Red (Bearish)**: Close price is *lower* than Open price.
2. **The Shadows (Wicks)**: The thin lines extending above and below the body.
   - **Upper Wick**: Represents the highest traded price during that interval.
   - **Lower Wick**: Represents the lowest traded price during that interval.

#### Key Basic Patterns to Know:
- **Doji**: Open and Close prices are virtually identical. This signifies absolute indecision in the market.
- **Hammer**: A small upper body with a long lower wick (at least twice the size of the body). It suggests that sellers pushed prices down, but buyers surged back to force a close near the highs, signaling a bullish reversal.
- **Marubozu**: A solid body with little to no wicks. Indicates total dominance by either buyers or sellers throughout the session.

#### Professional Tip
Never trade a candlestick pattern in isolation. Always look for *confluence* (support levels, high volume, or moving averages) before acting on a single signal.`
  },
  {
    id: 'cap-2',
    title: 'Risk Management: The 2% Rule',
    slug: 'risk-management-two-percent-rule',
    description: 'The single most critical rule of survival in trading. Protect your capital and avoid blowing up your account.',
    thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80',
    category: CourseCategory.RISK_MANAGEMENT,
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['Capital Preservation', 'Risk Control', 'Position Sizing'],
    readingTime: 7,
    isPublished: true,
    createdAt: '2026-06-05T10:00:00Z',
    updatedAt: '2026-06-05T10:00:00Z',
    price: 999,
    lectureTimes: 'Wednesdays @ 6:00 PM IST',
    driveLink: 'https://drive.google.com/drive/folders/2b3c4d5e6f_risk_mgt',
    liveMeetingLink: 'https://meet.google.com/bcd-efgh-ijk',
    content: `### Why Traders Fail

90% of retail traders lose money. The primary culprit is not a bad trading system—it is **terrible risk management**. Without strict rules, a string of bad luck can completely deplete your trading capital.

#### What is the 2% Rule?
The **2% Rule** dictates that you should **never risk more than 2% of your total trading account value on a single trade**.

> *Note: Risk is not your position size. Risk is the actual cash amount you will lose if your stop-loss order is hit.*

#### Step-by-Step Calculation Formula
Let's see an example:
- **Account size**: $10,000
- **Max risk per trade (2%)**: $200 ($10,000 × 0.02)
- **Stock price**: $100
- **Stop-loss level**: $95
- **Risk per share**: $5 ($100 - $95)

**How many shares can you buy?**
$$\\text{Position Size} = \\frac{\\text{Max Risk}}{\\text{Risk Per Share}} = \\frac{\\$200}{\\$5} = 40 \\text{ shares}$$

Your total capital allocated is $4,000 (40 shares × $100), but your maximum loss is strictly capped at $200. If the stock drops to $95, your stop-loss triggers, you lose $200, and you still have $9,800 to trade tomorrow.

#### Core Principles of Risk Control:
1. **Always Use Stop Losses**: Never enter a trade without an automated protective stop-loss.
2. **Accept Loss as a Business Expense**: Every successful business has operating costs. In trading, minor, controlled losses are the cost of doing business.
3. **Avoid Revenge Trading**: If you hit your max daily risk budget, close your laptop and walk away.`
  },
  {
    id: 'cap-3',
    title: 'Support and Resistance Secrets',
    slug: 'support-resistance-secrets',
    description: 'Master the art of identifying high-probability turning points by analyzing previous price structures.',
    thumbnail: 'https://images.unsplash.com/photo-1598257006458-087169a1f08d?auto=format&fit=crop&w=800&q=80',
    category: CourseCategory.TECHNICAL_ANALYSIS,
    difficulty: DifficultyLevel.INTERMEDIATE,
    tags: ['Chart Patterns', 'Support', 'Resistance', 'S&R'],
    readingTime: 8,
    isPublished: true,
    createdAt: '2026-06-10T14:30:00Z',
    updatedAt: '2026-06-12T09:15:00Z',
    price: 1999,
    lectureTimes: 'Saturdays @ 11:00 AM IST',
    driveLink: 'https://drive.google.com/drive/folders/3c4d5e6f7g_support_res',
    liveMeetingLink: 'https://meet.google.com/cde-fghi-jkl',
    content: `### The Pillars of Technical Analysis

Support and resistance are the horizontal or dynamic zones where buyers and sellers historically found balance, leading to a temporary halt or complete reversal of trend.

#### Understanding Support (Floor)
Support is a price level where a downtrend tends to pause due to a concentration of buying demand. Buyers see value at these low prices, and sellers become hesitant to sell cheaper.
- **Visual**: A horizontal floor on your chart where the price repeatedly bounces upwards.

#### Understanding Resistance (Ceiling)
Resistance is a price level where an uptrend tends to pause due to an increase in selling pressure. Sellers see an opportunity to lock in profits, and buyers find the assets too expensive to bid higher.
- **Visual**: A horizontal ceiling where the price repeatedly reverses downwards.

#### Role Reversal (The Polar Principle)
Once a support level is broken, it frequently turns into a major **resistance** level during future rallies. Conversely, when resistance is broken, it often shifts to become an active **support** level.

#### Key Tactics for Trading Support/Resistance:
1. **Look for Zones, Not Lines**: Support and resistance are zones of liquidity. Drawing exact single-cent lines often leads to premature execution.
2. **Check the Volume**: A bounce with high volume indicates strong institutional interest at that level.
3. **Multi-Timeframe Confluence**: A support zone visible on both the Daily and 4-Hour charts is significantly stronger than one seen on a 5-minute chart.`
  },
  {
    id: 'cap-4',
    title: 'The Psychology of FOMO and Greed',
    slug: 'psychology-fomo-greed',
    description: 'Why your brain is wired to make bad decisions in the market, and how to program yourself for disciplined execution.',
    thumbnail: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
    category: CourseCategory.TRADING_PSYCHOLOGY,
    difficulty: DifficultyLevel.INTERMEDIATE,
    tags: ['Mindset', 'Discipline', 'Fear & Greed'],
    readingTime: 6,
    isPublished: true,
    createdAt: '2026-06-15T08:00:00Z',
    updatedAt: '2026-06-15T08:00:00Z',
    price: 1299,
    lectureTimes: 'Fridays @ 8:00 PM IST',
    driveLink: 'https://drive.google.com/drive/folders/4d5e6f7g8h_psychology',
    liveMeetingLink: 'https://meet.google.com/def-ghij-klm',
    content: `### Trading Against Human Nature

The stock market is a unique environment where standard human survival instincts—such as fleeing threat or grabbing immediate rewards—lead directly to financial ruin.

#### The FOMO (Fear Of Missing Out) Cycle
FOMO is the emotional urge to jump into a trade because you see a stock skyrocketing and fear being left behind.
1. **The Catalyst**: A stock moves up 15% rapidly.
2. **The Emotion**: "I am missing the trade of the year! Everyone else is making money."
3. **The Action**: Buying at the peak of the rally without a calculated stop-loss.
4. **The Consequence**: Institutional traders dump their shares to lock in profits, triggering a steep correction. The FOMO buyer is trapped immediately in a loss.

#### Overcoming Greed
Greed manifests as holding a winning trade for too long, expecting it to go up forever, or sizing your position excessively large to "get rich quick."

#### Tactical Mental Exercises:
- **Write a Pre-Trade Checklist**: Write down your entry price, target, stop-loss, and position size before clicking buy. If you cannot fulfill the list, do not take the trade.
- **Treat Trading as a Process**: Shift your focus from "making money" to "executing my system perfectly." The money is simply a byproduct of perfect, repeated execution.
- **Keep a Trading Journal**: Record your emotional state before and after every trade. Spot your triggers (anger, impatience, excitement) and actively counter them.`
  },
  {
    id: 'cap-5',
    title: 'Introduction to P/E Ratio & Valuations',
    slug: 'intro-pe-ratio-valuations',
    description: 'Unlock the secret to identifying undervalued stocks using fundamental metrics like the Price-to-Earnings ratio.',
    thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    category: CourseCategory.FUNDAMENTAL_ANALYSIS,
    difficulty: DifficultyLevel.BEGINNER,
    tags: ['Valuation', 'Investing', 'Earnings', 'P/E Ratio'],
    readingTime: 6,
    isPublished: true,
    createdAt: '2026-06-18T16:00:00Z',
    updatedAt: '2026-06-18T16:00:00Z',
    price: 1499,
    lectureTimes: 'Sundays @ 4:00 PM IST',
    driveLink: 'https://drive.google.com/drive/folders/5e6f7g8h9i_pe_ratio',
    liveMeetingLink: 'https://meet.google.com/efg-hijk-lmn',
    content: `### What is Fundamental Analysis?

Fundamental analysis is the process of evaluating a company's financial health, operational performance, and industry conditions to determine its *intrinsic value*—independent of its current stock price.

#### The Price-to-Earnings (P/E) Ratio
The P/E Ratio is the most widely used metric to assess a stock's valuation. It represents how much investors are willing to pay for every dollar of the company's annual earnings.

$$\\text{P/E Ratio} = \\frac{\\text{Stock Price}}{\\text{Earnings Per Share (EPS)}}$$

#### How to Interpret P/E
- **High P/E (e.g., 50x)**: Suggests that investors are anticipating high future growth rates, or the stock is currently overvalued.
- **Low P/E (e.g., 12x)**: Suggests that the company is currently undervalued, out of favor with investors, or experiencing structural financial challenges.

#### Peer Comparison is Key
A P/E ratio is meaningless without context. A software tech stock with a P/E of 30 might be cheap compared to its competitors, while a utility company with a P/E of 20 might be extremely expensive for its slow-growing sector.

#### Key Fundamentals Checklist:
1. **Compare with Competitors**: Compare P/E ratios across companies within the exact same industry.
2. **Review Historical Ranges**: Observe the company's own 5-year historical average P/E to see if it is trading at a premium or discount.
3. **Verify Debt Levels**: A company with a low P/E but mountain-loads of debt might represent a value trap.`
  }
];

export const INITIAL_BLOGS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Market Outlook 2026: Navigating High Interest Rates',
    slug: 'market-outlook-2026-interest-rates',
    content: `### The Macroeconomic Environment of 2026

As we cross the midpoint of 2026, the global financial landscape presents both challenges and lucrative opportunities. With central banks holding interest rates higher for longer to combat sticky inflation, equity markets are forcing a dramatic rotation out of speculative growth assets and into high-cash-flow value sectors.

#### The Shift to "Old Economy" Winners
Companies with solid balance sheets, high free cash flow, and low debt-to-equity ratios are leading the indices. Sectors like energy, defense, healthcare, and selective high-yield utilities are yielding consistent dividends while speculative tech trades sideways.

#### What This Means for Retail Traders
1. **Focus on Cash Flow**: Dive deep into quarterly balance sheets. Look for companies with expanding margins despite elevated cost of capital.
2. **Diversify Globally**: Don't lock all your capital into domestic indexes. Cross-border commodities and selective emerging markets are outperforming.
3. **Leverage Cash Yields**: Cash is no longer trash. Parking temporary reserves in high-yield treasury bills or money market instruments yielding 5%+ is a valid tactical asset allocation strategy.`,
    featuredImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'Market Outlook 2026: Interest Rates & Stock Rotation Strategies',
    seoDescription: 'Discover how to allocate capital in 2026 amidst persistent high interest rates and inflation.',
    isPublished: true,
    createdAt: '2026-06-20T09:00:00Z'
  },
  {
    id: 'blog-2',
    title: 'The Rise of AI-Powered Algo Trading',
    slug: 'rise-of-ai-powered-algo-trading',
    content: `### Technology Redefining Price Discovery

Algorithmic trading is no longer the exclusive playground of Wall Street quantitative hedge funds. With open-source models, high-speed API connections, and simplified cloud computing infrastructure, individual retail traders are now coding and executing their own automated strategies.

#### The Double-Edged Sword of AI
AI models can digest gigabytes of financial news, social sentiment, and historical ticker patterns in nanoseconds. However, relying purely on neural networks without understanding basic financial risk management often leads to over-optimized models that fail catastrophically during black swan events.

#### Strategic Takeaway
Successful modern traders combine the discretion of human risk evaluation with the fast, emotionless execution of programmed algorithms. In the modern market, the person who writes the code owns the edge.`,
    featuredImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
    seoTitle: 'Algorithmic Trading & AI Models in 2026 - The Market Wala',
    seoDescription: 'An analytical review of how AI and machine learning are impacting trading liquidity and retail strategies.',
    isPublished: true,
    createdAt: '2026-06-22T14:00:00Z'
  }
];

export const INITIAL_USERS: UserProfile[] = [];

export const INITIAL_MEDIA: MediaFile[] = [];

export const INITIAL_ACTIVITIES: UserActivity[] = [];

export const FAQS = [
  {
    question: 'Is "The Market Wala" platform completely free?',
    answer: 'Yes! Our primary learning courses, basic charts, and educational articles are 100% free. We believe quality financial education should be highly accessible to everyone.'
  },
  {
    question: 'Do I need any prior knowledge of trading to join?',
    answer: 'Absolutely not. We have customized paths for absolute beginners that start from the extreme fundamentals, such as what is a stock, moving systematically up to advanced quantitative models.'
  },
  {
    question: 'How do the learning progress and bookmarks work?',
    answer: 'Once you sign up for a free account, you can mark courses as completed, bookmark articles for future reference, and view your progress stats dynamically on your personal dashboard.'
  },
  {
    question: 'Can I trade directly from "The Market Wala"?',
    answer: 'No. The Market Wala is strictly an educational and simulator platform. We do not provide brokerage services or direct trading integrations, ensuring our analysis remains fully unbiased.'
  }
];
