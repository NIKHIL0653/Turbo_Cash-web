import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Progress } from "../components/ui/progress";
import {
  BookOpen,
  Star,
  Trophy,
  CheckCircle,
  Lock,
  PlayCircle,
  Award,
  Flame,
  Target,
  Calendar,
  Clock,
  Users,
  ArrowRight,
} from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  modules: Module[];
  requiredScore?: number;
  prerequisiteId?: string;
}

interface Module {
  id: string;
  title: string;
  description: string;
  duration: string;
  content: string;
  quiz?: Quiz;
}

interface Quiz {
  questions: QuizQuestion[];
  passingScore: number;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface UserProgress {
  courseId: string;
  moduleId?: string;
  completed: boolean;
  score?: number;
  completedAt?: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedAt?: string;
}

export default function Learn() {
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<{ [key: string]: number }>({});

  // Comprehensive course data with financial education content
  const courses: Course[] = [
    {
      id: "basics",
      title: "Personal Finance Fundamentals",
      description: "Master the essential principles of personal finance, budgeting, and money management.",
      duration: "4 hours",
      difficulty: "Beginner",
      modules: [
        {
          id: "intro",
          title: "Understanding Money and Financial Planning",
          description: "Learn the foundations of financial literacy and money management",
          duration: "45 minutes",
          content: `
            <h3>Welcome to Personal Finance Fundamentals!</h3>
            <p>Financial literacy is one of the most important life skills you can develop. This course will teach you how to take control of your money and build a secure financial future.</p>

            <h4>What is Personal Finance?</h4>
            <p>Personal finance encompasses all aspects of managing your money, including:</p>
            <ul>
              <li><strong>Income Management:</strong> Maximizing and diversifying your earnings</li>
              <li><strong>Budgeting:</strong> Planning and controlling your spending</li>
              <li><strong>Saving:</strong> Setting aside money for future goals and emergencies</li>
              <li><strong>Investing:</strong> Growing your wealth through various investment vehicles</li>
              <li><strong>Debt Management:</strong> Responsibly handling loans and credit</li>
              <li><strong>Insurance:</strong> Protecting yourself from financial risks</li>
              <li><strong>Tax Planning:</strong> Minimizing tax liability legally</li>
              <li><strong>Retirement Planning:</strong> Preparing for your golden years</li>
            </ul>

            <h4>The Financial Planning Process</h4>
            <ol>
              <li><strong>Assess Your Current Situation:</strong> Calculate your net worth and cash flow</li>
              <li><strong>Set Financial Goals:</strong> Define short-term and long-term objectives</li>
              <li><strong>Create a Plan:</strong> Develop strategies to achieve your goals</li>
              <li><strong>Implement the Plan:</strong> Take action on your financial strategies</li>
              <li><strong>Monitor and Adjust:</strong> Regularly review and update your plan</li>
            </ol>

            <h4>Key Financial Concepts</h4>
            <ul>
              <li><strong>Time Value of Money:</strong> Money today is worth more than the same amount in the future</li>
              <li><strong>Compound Interest:</strong> Earning interest on your interest over time</li>
              <li><strong>Risk vs. Return:</strong> Higher potential returns usually come with higher risk</li>
              <li><strong>Diversification:</strong> Spreading risk across different investments</li>
              <li><strong>Inflation:</strong> The gradual increase in prices over time</li>
            </ul>

            <h4>Building Financial Confidence</h4>
            <p>Starting your financial journey can feel overwhelming, but remember:</p>
            <ul>
              <li>Every financial expert started as a beginner</li>
              <li>Small, consistent actions compound over time</li>
              <li>Mistakes are learning opportunities</li>
              <li>The best time to start is now</li>
            </ul>
          `,
          quiz: {
            passingScore: 70,
            questions: [
              {
                id: "q1",
                question: "What is the first step in the financial planning process?",
                options: [
                  "Set financial goals",
                  "Assess your current situation",
                  "Create a budget",
                  "Start investing"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "Which principle states that money today is worth more than the same amount in the future?",
                options: [
                  "Compound interest",
                  "Risk vs. return",
                  "Time value of money",
                  "Diversification"
                ],
                correctAnswer: 2
              },
              {
                id: "q3",
                question: "What does compound interest mean?",
                options: [
                  "Paying interest on loans",
                  "Earning interest on your interest over time",
                  "Getting a discount on purchases",
                  "Borrowing money at low rates"
                ],
                correctAnswer: 1
              }
            ]
          }
        },
        {
          id: "budgeting",
          title: "Mastering Budget Creation and Management",
          description: "Complete guide to creating, implementing, and maintaining an effective budget",
          duration: "60 minutes",
          content: `
            <h3>Mastering Budget Creation and Management</h3>
            <p>A budget is your financial roadmap - it tells your money where to go instead of wondering where it went. This module will teach you how to create and maintain a budget that works for your lifestyle.</p>

            <h4>Step 1: Calculate Your Total Income</h4>
            <p>Include all sources of regular income:</p>
            <ul>
              <li><strong>Primary salary:</strong> Use your after-tax (net) pay</li>
              <li><strong>Side hustles:</strong> Freelancing, part-time work, gig economy</li>
              <li><strong>Passive income:</strong> Rental income, dividends, interest</li>
              <li><strong>Irregular income:</strong> Bonuses, gifts, tax refunds</li>
            </ul>
            <p><strong>Pro Tip:</strong> If your income varies, use the lowest monthly amount for budgeting to avoid overspending.</p>

            <h4>Step 2: Track and Categorize Your Expenses</h4>
            <h5>Fixed Expenses (stay the same each month):</h5>
            <ul>
              <li>Rent or mortgage payments</li>
              <li>Insurance premiums (health, auto, life)</li>
              <li>Loan payments (student, car, personal)</li>
              <li>Subscription services</li>
              <li>Phone and internet bills</li>
            </ul>

            <h5>Variable Expenses (change each month):</h5>
            <ul>
              <li>Groceries and dining out</li>
              <li>Utilities (electricity, gas, water)</li>
              <li>Transportation (gas, public transit)</li>
              <li>Entertainment and hobbies</li>
              <li>Clothing and personal care</li>
              <li>Medical expenses</li>
            </ul>

            <h4>Step 3: Choose Your Budgeting Method</h4>

            <h5>The 50/30/20 Rule (Beginner-Friendly)</h5>
            <ul>
              <li><strong>50% for Needs:</strong> Essential expenses like housing, utilities, groceries, minimum debt payments</li>
              <li><strong>30% for Wants:</strong> Non-essential spending like entertainment, dining out, hobbies</li>
              <li><strong>20% for Savings and Extra Debt Payments:</strong> Emergency fund, retirement, additional loan payments</li>
            </ul>

            <h5>Zero-Based Budgeting (Advanced)</h5>
            <p>Assign every dollar a purpose before the month begins. Income - Expenses = $0</p>

            <h5>Envelope Method</h5>
            <p>Allocate cash for each spending category in separate envelopes. When the envelope is empty, you're done spending in that category.</p>

            <h4>Step 4: Track Your Spending</h4>
            <ul>
              <li>Use apps like TurboCash to automatically categorize transactions</li>
              <li>Check in weekly to see how you're tracking</li>
              <li>Take photos of receipts immediately</li>
              <li>Review bank and credit card statements monthly</li>
            </ul>

            <h4>Step 5: Adjust and Optimize</h4>
            <p>Your first budget won't be perfect. Make adjustments based on:</p>
            <ul>
              <li>Actual spending patterns</li>
              <li>Changing life circumstances</li>
              <li>New financial goals</li>
              <li>Seasonal expenses</li>
            </ul>

            <h4>Common Budgeting Mistakes to Avoid</h4>
            <ul>
              <li>Being too restrictive and giving up quickly</li>
              <li>Forgetting about irregular expenses (car maintenance, gifts)</li>
              <li>Not including fun money</li>
              <li>Ignoring small purchases that add up</li>
              <li>Not adjusting for changing circumstances</li>
            </ul>

            <h4>Tips for Budget Success</h4>
            <ul>
              <li>Start simple and gradually add complexity</li>
              <li>Use the right tools (apps, spreadsheets, or pen and paper)</li>
              <li>Include your partner or family in the process</li>
              <li>Celebrate small wins</li>
              <li>Focus on progress, not perfection</li>
            </ul>
          `,
          quiz: {
            passingScore: 70,
            questions: [
              {
                id: "q1",
                question: "In the 50/30/20 rule, what percentage should go to savings and debt repayment?",
                options: ["50%", "30%", "20%", "10%"],
                correctAnswer: 2
              },
              {
                id: "q2",
                question: "Which of these is a fixed expense?",
                options: ["Groceries", "Rent payment", "Entertainment", "Gas for car"],
                correctAnswer: 1
              },
              {
                id: "q3",
                question: "What does zero-based budgeting mean?",
                options: [
                  "You spend nothing",
                  "You assign every dollar a purpose so income minus expenses equals zero",
                  "You only use cash",
                  "You don't track expenses"
                ],
                correctAnswer: 1
              }
            ]
          }
        },
        {
          id: "saving",
          title: "Emergency Funds and Smart Saving Strategies",
          description: "Build financial security through emergency funds and strategic saving",
          duration: "50 minutes",
          content: `
            <h3>Emergency Funds and Smart Saving Strategies</h3>
            <p>An emergency fund is your financial safety net - it protects you from debt when life throws unexpected expenses your way. This module will teach you how to build and maintain emergency savings while developing other saving goals.</p>

            <h4>What is an Emergency Fund?</h4>
            <p>An emergency fund is money set aside specifically for unexpected expenses or financial emergencies. It's not for planned expenses, vacations, or wants - it's for true emergencies.</p>

            <h4>Common Emergencies</h4>
            <ul>
              <li><strong>Job loss or income reduction:</strong> Most common and potentially most expensive</li>
              <li><strong>Medical emergencies:</strong> Unexpected hospital bills, prescription costs</li>
              <li><strong>Car repairs:</strong> Engine problems, accidents, major maintenance</li>
              <li><strong>Home repairs:</strong> HVAC failure, plumbing issues, roof damage</li>
              <li><strong>Family emergencies:</strong> Unexpected travel for family situations</li>
              <li><strong>Pet emergencies:</strong> Veterinary bills for beloved pets</li>
            </ul>

            <h4>How Much Should You Save?</h4>
            <h5>Phase 1: Starter Emergency Fund</h5>
            <ul>
              <li><strong>Goal:</strong> $1,000-$2,500</li>
              <li><strong>Timeline:</strong> 2-3 months</li>
              <li><strong>Purpose:</strong> Cover most minor emergencies and build the habit</li>
            </ul>

            <h5>Phase 2: Full Emergency Fund</h5>
            <ul>
              <li><strong>Goal:</strong> 3-6 months of essential expenses</li>
              <li><strong>Conservative approach:</strong> 6-12 months (for irregular income or single-income households)</li>
              <li><strong>Calculate based on:</strong> Minimum expenses you'd have if you lost your job</li>
            </ul>

            <h4>How to Calculate Your Emergency Fund Goal</h4>
            <ol>
              <li>List your essential monthly expenses:
                <ul>
                  <li>Housing (rent/mortgage, utilities)</li>
                  <li>Food (groceries, not dining out)</li>
                  <li>Transportation (car payment, insurance, gas)</li>
                  <li>Minimum debt payments</li>
                  <li>Basic insurance premiums</li>
                  <li>Essential prescriptions</li>
                </ul>
              </li>
              <li>Multiply by your chosen number of months (3-6)</li>
              <li>This is your emergency fund target</li>
            </ol>

            <h4>Where to Keep Your Emergency Fund</h4>
            <h5>Best Options:</h5>
            <ul>
              <li><strong>High-yield savings account:</strong> Easy access, earns interest, FDIC insured</li>
              <li><strong>Money market account:</strong> Slightly higher interest, may have check-writing privileges</li>
              <li><strong>Short-term CDs:</strong> Higher interest but less liquid</li>
            </ul>

            <h5>Avoid These Options:</h5>
            <ul>
              <li>Checking accounts (too easy to spend)</li>
              <li>Investment accounts (market risk)</li>
              <li>Retirement accounts (penalties for early withdrawal)</li>
              <li>Cash at home (no growth, security risk)</li>
            </ul>

            <h4>Building Your Emergency Fund</h4>
            <h5>Step 1: Start Small</h5>
            <ul>
              <li>Set up automatic transfers ($25-50 per week)</li>
              <li>Save windfalls (tax refunds, bonuses, gifts)</li>
              <li>Use the "pay yourself first" principle</li>
            </ul>

            <h5>Step 2: Find Extra Money</h5>
            <ul>
              <li>Review your budget for areas to cut temporarily</li>
              <li>Sell items you no longer need</li>
              <li>Take on extra work or side gigs</li>
              <li>Use cashback and rewards strategically</li>
            </ul>

            <h5>Step 3: Accelerate Your Savings</h5>
            <ul>
              <li>Save any raise or bonus money</li>
              <li>Put aside money from eliminated expenses</li>
              <li>Use the debt snowball: after paying off debt, redirect payments to savings</li>
            </ul>

            <h4>Other Essential Savings Goals</h4>
            <h5>Sinking Funds</h5>
            <p>Separate savings for planned expenses:</p>
            <ul>
              <li>Car maintenance and repairs</li>
              <li>Annual insurance premiums</li>
              <li>Holiday and gift expenses</li>
              <li>Home maintenance</li>
              <li>Vacation fund</li>
            </ul>

            <h5>Short-term Savings Goals (1-3 years)</h5>
            <ul>
              <li>Down payment for house or car</li>
              <li>Wedding expenses</li>
              <li>Education or certification costs</li>
              <li>Business startup costs</li>
            </ul>

            <h4>When to Use Your Emergency Fund</h4>
            <h5>DO use it for:</h5>
            <ul>
              <li>Job loss or significant income reduction</li>
              <li>Unexpected medical expenses</li>
              <li>Major car or home repairs</li>
              <li>Family emergencies requiring travel</li>
            </ul>

            <h5>DON'T use it for:</h5>
            <ul>
              <li>Planned expenses you forgot to budget for</li>
              <li>Wants or desires</li>
              <li>Investment opportunities</li>
              <li>Regular monthly expenses</li>
            </ul>

            <h4>Replenishing Your Emergency Fund</h4>
            <p>If you use your emergency fund:</p>
            <ol>
              <li>Don't panic - that's what it's for!</li>
              <li>Assess the new situation</li>
              <li>Make rebuilding the fund a priority</li>
              <li>Adjust your budget to accelerate replacement</li>
              <li>Learn from the experience</li>
            </ol>
          `,
          quiz: {
            passingScore: 75,
            questions: [
              {
                id: "q1",
                question: "How much should a full emergency fund typically contain?",
                options: [
                  "$1,000",
                  "1 month of expenses",
                  "3-6 months of essential expenses",
                  "One year of expenses"
                ],
                correctAnswer: 2
              },
              {
                id: "q2",
                question: "Which is the best place to keep your emergency fund?",
                options: [
                  "Checking account",
                  "High-yield savings account",
                  "Stock market investment",
                  "401(k) retirement account"
                ],
                correctAnswer: 1
              },
              {
                id: "q3",
                question: "Which of these is NOT a good reason to use your emergency fund?",
                options: [
                  "Job loss",
                  "Major car repair",
                  "Want to buy a new TV",
                  "Unexpected medical bill"
                ],
                correctAnswer: 2
              }
            ]
          }
        },
        {
          id: "debt",
          title: "Debt Management and Credit Building",
          description: "Learn how to manage debt effectively and build strong credit",
          duration: "55 minutes",
          content: `
            <h3>Debt Management and Credit Building</h3>
            <p>Understanding how to manage debt and build credit is crucial for your financial health. This module covers strategies for paying off debt efficiently and building a strong credit profile.</p>

            <h4>Understanding Different Types of Debt</h4>
            <h5>Good Debt vs. Bad Debt</h5>
            <p><strong>Good Debt:</strong> Helps you build wealth or increase income over time</p>
            <ul>
              <li>Mortgages (real estate appreciation)</li>
              <li>Student loans (increased earning potential)</li>
              <li>Business loans (income generation)</li>
            </ul>

            <p><strong>Bad Debt:</strong> Used for consumption, depreciates in value</p>
            <ul>
              <li>Credit card debt for purchases</li>
              <li>Auto loans (cars depreciate quickly)</li>
              <li>Personal loans for lifestyle expenses</li>
              <li>Payday loans</li>
            </ul>

            <h4>Debt Repayment Strategies</h4>
            <h5>The Debt Snowball Method</h5>
            <ol>
              <li>List all debts from smallest to largest balance</li>
              <li>Pay minimums on all debts</li>
              <li>Put extra money toward the smallest debt</li>
              <li>When smallest is paid off, roll that payment to the next smallest</li>
              <li>Repeat until all debts are eliminated</li>
            </ol>
            <p><strong>Pros:</strong> Quick wins, psychological motivation<br>
            <strong>Cons:</strong> May pay more interest overall</p>

            <h5>The Debt Avalanche Method</h5>
            <ol>
              <li>List all debts from highest to lowest interest rate</li>
              <li>Pay minimums on all debts</li>
              <li>Put extra money toward the highest interest rate debt</li>
              <li>When highest rate is paid off, move to the next highest</li>
              <li>Repeat until debt-free</li>
            </ol>
            <p><strong>Pros:</strong> Saves money on interest<br>
            <strong>Cons:</strong> May take longer to see progress</p>

            <h4>Credit Scores and Reports</h4>
            <h5>What Affects Your Credit Score</h5>
            <ul>
              <li><strong>Payment History (35%):</strong> On-time vs. late payments</li>
              <li><strong>Credit Utilization (30%):</strong> How much credit you're using</li>
              <li><strong>Length of Credit History (15%):</strong> How long you've had credit</li>
              <li><strong>Types of Credit (10%):</strong> Mix of credit cards, loans, etc.</li>
              <li><strong>New Credit (10%):</strong> Recent applications and accounts</li>
            </ul>

            <h5>Credit Score Ranges</h5>
            <ul>
              <li><strong>300-579:</strong> Very Poor</li>
              <li><strong>580-669:</strong> Fair</li>
              <li><strong>670-739:</strong> Good</li>
              <li><strong>740-799:</strong> Very Good</li>
              <li><strong>800-850:</strong> Exceptional</li>
            </ul>

            <h4>Building and Improving Credit</h4>
            <h5>For Building Credit from Scratch:</h5>
            <ul>
              <li>Apply for a secured credit card</li>
              <li>Become an authorized user on someone else's account</li>
              <li>Consider a credit-builder loan</li>
              <li>Pay all bills on time (including utilities and rent)</li>
            </ul>

            <h5>For Improving Existing Credit:</h5>
            <ul>
              <li>Pay all bills on time, every time</li>
              <li>Keep credit utilization below 30% (ideally below 10%)</li>
              <li>Don't close old credit cards</li>
              <li>Dispute errors on credit reports</li>
              <li>Consider asking for credit limit increases</li>
            </ul>

            <h4>Credit Card Best Practices</h4>
            <ul>
              <li>Pay the full balance every month</li>
              <li>Use cards for planned purchases only</li>
              <li>Take advantage of rewards and cashback</li>
              <li>Monitor statements for fraud</li>
              <li>Avoid cash advances</li>
              <li>Don't use credit to live beyond your means</li>
            </ul>
          `,
          quiz: {
            passingScore: 75,
            questions: [
              {
                id: "q1",
                question: "What is the largest factor affecting your credit score?",
                options: [
                  "Credit utilization",
                  "Payment history",
                  "Length of credit history",
                  "Types of credit"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "Which debt repayment method focuses on paying off the smallest balances first?",
                options: [
                  "Debt avalanche",
                  "Debt snowball",
                  "Minimum payments only",
                  "Debt consolidation"
                ],
                correctAnswer: 1
              },
              {
                id: "q3",
                question: "What is generally considered 'good debt'?",
                options: [
                  "Credit card debt",
                  "Payday loans",
                  "Mortgage for your home",
                  "Personal loans for vacation"
                ],
                correctAnswer: 2
              }
            ]
          }
        }
      ]
    },
    {
      id: "investing",
      title: "Introduction to Investing",
      description: "Understand investment basics and start building wealth.",
      duration: "3 hours",
      difficulty: "Intermediate",
      prerequisiteId: "basics",
      requiredScore: 70,
      modules: [
        {
          id: "investment-basics",
          title: "Investment Fundamentals",
          description: "Learn the basics of investing and compound interest",
          duration: "60 minutes",
          content: `
            <h3>Investment Fundamentals</h3>
            <p>Investing is putting money to work to generate more money over time.</p>
            <h4>Key Investment Concepts</h4>
            <ul>
              <li><strong>Compound Interest:</strong> Earning interest on your interest</li>
              <li><strong>Risk vs Return:</strong> Higher potential returns often mean higher risk</li>
              <li><strong>Diversification:</strong> Don't put all eggs in one basket</li>
              <li><strong>Time Horizon:</strong> How long you plan to invest</li>
            </ul>
            <h4>Types of Investments</h4>
            <ul>
              <li><strong>Stocks:</strong> Ownership shares in companies</li>
              <li><strong>Bonds:</strong> Loans to governments or companies</li>
              <li><strong>Mutual Funds:</strong> Professionally managed investment pools</li>
              <li><strong>ETFs:</strong> Exchange-traded funds</li>
            </ul>
          `
        }
      ]
    },
    {
      id: "advanced",
      title: "Advanced Financial Planning",
      description: "Master advanced concepts like retirement planning and tax strategies.",
      duration: "4 hours",
      difficulty: "Advanced",
      prerequisiteId: "investing",
      requiredScore: 80,
      modules: [
        {
          id: "retirement",
          title: "Retirement Planning",
          description: "Plan for your financial future and retirement",
          duration: "90 minutes",
          content: `
            <h3>Retirement Planning</h3>
            <p>Planning for retirement is crucial for financial security in your later years.</p>
            <h4>Retirement Account Types</h4>
            <ul>
              <li><strong>401(k):</strong> Employer-sponsored retirement plan</li>
              <li><strong>IRA:</strong> Individual Retirement Account</li>
              <li><strong>Roth IRA:</strong> Tax-free growth and withdrawals</li>
            </ul>
            <h4>How Much to Save</h4>
            <ul>
              <li>Aim to save 10-15% of income for retirement</li>
              <li>Start early to benefit from compound interest</li>
              <li>Take advantage of employer matching</li>
            </ul>
          `
        }
      ]
    },
    {
      id: "taxes",
      title: "Tax Planning and Optimization",
      description: "Master tax strategies, deductions, and planning to minimize your tax liability legally.",
      duration: "3 hours",
      difficulty: "Intermediate",
      prerequisiteId: "basics",
      requiredScore: 75,
      modules: [
        {
          id: "tax-basics",
          title: "Understanding the Tax System",
          description: "Learn how taxes work, tax brackets, and types of taxes",
          duration: "45 minutes",
          content: `
            <h3>Understanding the Tax System</h3>
            <p>Taxes are a crucial part of financial planning. Understanding how they work can save you thousands of dollars annually and help you make better financial decisions.</p>

            <h4>Types of Taxes You Pay</h4>
            <h5>Federal Income Tax</h5>
            <ul>
              <li><strong>Progressive tax system:</strong> Higher income = higher tax rate</li>
              <li><strong>Tax brackets:</strong> Only income above each bracket threshold is taxed at that rate</li>
              <li><strong>Marginal vs. effective tax rate:</strong> Understanding the difference is crucial</li>
            </ul>

            <h5>State and Local Taxes</h5>
            <ul>
              <li><strong>State income tax:</strong> Varies by state (some have none!)</li>
              <li><strong>Sales tax:</strong> Tax on purchases</li>
              <li><strong>Property tax:</strong> Tax on real estate ownership</li>
            </ul>

            <h5>Employment Taxes</h5>
            <ul>
              <li><strong>Social Security tax:</strong> 6.2% on income up to cap</li>
              <li><strong>Medicare tax:</strong> 1.45% on all income</li>
              <li><strong>Unemployment tax:</strong> Varies by state</li>
            </ul>

            <h4>How Tax Brackets Work</h4>
            <p>Many people misunderstand tax brackets. You don't pay your highest rate on all your income!</p>

            <h5>Example: 2024 Tax Brackets (Single Filer)</h5>
            <ul>
              <li>10% on income up to $11,000</li>
              <li>12% on income from $11,001 to $44,725</li>
              <li>22% on income from $44,726 to $95,375</li>
              <li>24% on income from $95,376 to $182,050</li>
              <li>And so on...</li>
            </ul>

            <h4>Important Tax Dates</h4>
            <ul>
              <li><strong>January 31:</strong> W-2 and 1099 forms due</li>
              <li><strong>April 15:</strong> Tax return filing deadline</li>
              <li><strong>October 15:</strong> Extension deadline</li>
              <li><strong>Quarterly:</strong> Estimated tax payments due</li>
            </ul>
          `,
          quiz: {
            passingScore: 75,
            questions: [
              {
                id: "q1",
                question: "How do tax brackets work?",
                options: [
                  "You pay your highest rate on all income",
                  "You pay different rates on different portions of income",
                  "Everyone pays the same rate",
                  "The rate depends on your age"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "Which of these is generally NOT taxable income?",
                options: [
                  "Wages from your job",
                  "Interest from savings",
                  "Gifts you receive",
                  "Freelance income"
                ],
                correctAnswer: 2
              }
            ]
          }
        }
      ]
    },
    {
      id: "insurance",
      title: "Insurance and Risk Management",
      description: "Protect your financial future with proper insurance coverage and risk management strategies.",
      duration: "2.5 hours",
      difficulty: "Intermediate",
      prerequisiteId: "basics",
      requiredScore: 70,
      modules: [
        {
          id: "insurance-basics",
          title: "Types of Insurance and Coverage Needs",
          description: "Understanding different types of insurance and determining your needs",
          duration: "50 minutes",
          content: `
            <h3>Insurance and Risk Management</h3>
            <p>Insurance is your financial safety net. It protects you from catastrophic losses that could derail your financial plans. Let's explore the essential types of insurance and how to choose the right coverage.</p>

            <h4>Why Insurance Matters</h4>
            <ul>
              <li><strong>Financial protection:</strong> Prevents large unexpected expenses</li>
              <li><strong>Peace of mind:</strong> Reduces anxiety about potential losses</li>
              <li><strong>Legal requirements:</strong> Some insurance is mandatory</li>
              <li><strong>Wealth preservation:</strong> Protects your assets and income</li>
            </ul>

            <h4>Health Insurance</h4>
            <p>Often your most important insurance, health coverage protects against medical expenses.</p>

            <h5>Key Terms</h5>
            <ul>
              <li><strong>Premium:</strong> Monthly cost for coverage</li>
              <li><strong>Deductible:</strong> Amount you pay before insurance kicks in</li>
              <li><strong>Copay:</strong> Fixed amount for specific services</li>
              <li><strong>Coinsurance:</strong> Percentage you pay after deductible</li>
              <li><strong>Out-of-pocket maximum:</strong> Most you'll pay in a year</li>
            </ul>

            <h5>Types of Plans</h5>
            <ul>
              <li><strong>HMO:</strong> Lower cost, requires referrals</li>
              <li><strong>PPO:</strong> More flexibility, higher cost</li>
              <li><strong>HDHP:</strong> High deductible, works with HSA</li>
            </ul>

            <h4>Life Insurance</h4>
            <p>Replaces your income if you die, protecting your dependents financially.</p>

            <h5>Term Life Insurance</h5>
            <ul>
              <li><strong>Temporary coverage:</strong> 10, 20, or 30 years</li>
              <li><strong>Lower cost:</strong> Much cheaper than permanent insurance</li>
              <li><strong>Best for most people:</strong> Covers income replacement needs</li>
            </ul>

            <h5>Permanent Life Insurance</h5>
            <ul>
              <li><strong>Whole life:</strong> Fixed premiums, guaranteed cash value</li>
              <li><strong>Universal life:</strong> Flexible premiums, variable returns</li>
              <li><strong>Higher cost:</strong> Significantly more expensive than term</li>
            </ul>

            <h5>How Much Coverage Do You Need?</h5>
            <ul>
              <li><strong>Income replacement:</strong> 10-12x annual income</li>
              <li><strong>Debt coverage:</strong> Enough to pay off major debts</li>
              <li><strong>Future expenses:</strong> College costs, final expenses</li>
              <li><strong>Consider existing assets:</strong> Reduce coverage accordingly</li>
            </ul>

            <h4>Disability Insurance</h4>
            <p>Protects your ability to earn income if you become disabled.</p>

            <h5>Short-term vs. Long-term</h5>
            <ul>
              <li><strong>Short-term:</strong> Covers 3-12 months</li>
              <li><strong>Long-term:</strong> Until retirement age</li>
              <li><strong>Benefit amount:</strong> Typically 60-70% of income</li>
            </ul>

            <h4>Auto Insurance</h4>
            <h5>Required Coverage</h5>
            <ul>
              <li><strong>Liability:</strong> Covers damage you cause to others</li>
              <li><strong>Personal injury protection:</strong> Your medical expenses</li>
            </ul>

            <h5>Optional but Important</h5>
            <ul>
              <li><strong>Collision:</strong> Repairs to your car</li>
              <li><strong>Comprehensive:</strong> Theft, weather, vandalism</li>
              <li><strong>Uninsured motorist:</strong> Protection from uninsured drivers</li>
            </ul>

            <h4>Homeowners/Renters Insurance</h4>
            <h5>Homeowners Insurance</h5>
            <ul>
              <li><strong>Dwelling coverage:</strong> Rebuilds your home</li>
              <li><strong>Personal property:</strong> Replaces belongings</li>
              <li><strong>Liability:</strong> Protects if someone is injured</li>
              <li><strong>Additional living expenses:</strong> Temporary housing costs</li>
            </ul>

            <h5>Renters Insurance</h5>
            <ul>
              <li><strong>Personal property:</strong> Your belongings</li>
              <li><strong>Liability:</strong> Accidents in your rental</li>
              <li><strong>Additional living expenses:</strong> If rental is uninhabitable</li>
              <li><strong>Very affordable:</strong> Often $10-20 per month</li>
            </ul>
          `,
          quiz: {
            passingScore: 70,
            questions: [
              {
                id: "q1",
                question: "What's the main purpose of insurance?",
                options: [
                  "To make money from investments",
                  "To protect against financial losses",
                  "To avoid paying taxes",
                  "To get free healthcare"
                ],
                correctAnswer: 1
              },
              {
                id: "q2",
                question: "How much life insurance coverage is typically recommended?",
                options: [
                  "1-2x annual income",
                  "5x annual income",
                  "10-12x annual income",
                  "20x annual income"
                ],
                correctAnswer: 2
              }
            ]
          }
        }
      ]
    }
  ];

  // Initialize user data from localStorage
  useEffect(() => {
    const savedProgress = localStorage.getItem('learningProgress');
    const savedStreak = localStorage.getItem('currentStreak');
    const savedPoints = localStorage.getItem('totalPoints');
    const savedBadges = localStorage.getItem('earnedBadges');

    if (savedProgress) {
      setUserProgress(JSON.parse(savedProgress));
    }
    if (savedStreak) {
      setCurrentStreak(parseInt(savedStreak));
    }
    if (savedPoints) {
      setTotalPoints(parseInt(savedPoints));
    }
    if (savedBadges) {
      setBadges(JSON.parse(savedBadges));
    } else {
      // Initialize badges
      initializeBadges();
    }
  }, []);

  const initializeBadges = () => {
    const initialBadges: Badge[] = [
      {
        id: "first-course",
        name: "Getting Started",
        description: "Complete your first course module",
        icon: "BookOpen",
        earned: false
      },
      {
        id: "quiz-master",
        name: "Quiz Master",
        description: "Pass a quiz with 100% score",
        icon: "Star",
        earned: false
      },
      {
        id: "streak-week",
        name: "Week Warrior",
        description: "Maintain a 7-day learning streak",
        icon: "Flame",
        earned: false
      },
      {
        id: "course-complete",
        name: "Course Champion",
        description: "Complete an entire course",
        icon: "Trophy",
        earned: false
      }
    ];
    setBadges(initialBadges);
    localStorage.setItem('earnedBadges', JSON.stringify(initialBadges));
  };

  const getCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;

    const completedModules = userProgress.filter(
      p => p.courseId === courseId && p.completed
    ).length;
    
    return (completedModules / course.modules.length) * 100;
  };

  const isCourseUnlocked = (course: Course) => {
    if (!course.prerequisiteId) return true;
    
    const prerequisiteProgress = getCourseProgress(course.prerequisiteId);
    return prerequisiteProgress === 100;
  };

  const isModuleUnlocked = (course: Course, moduleIndex: number) => {
    if (moduleIndex === 0) return isCourseUnlocked(course);
    
    const previousModuleProgress = userProgress.find(
      p => p.courseId === course.id && p.moduleId === course.modules[moduleIndex - 1].id
    );
    
    return previousModuleProgress?.completed || false;
  };

  const completeModule = (courseId: string, moduleId: string, score?: number) => {
    const newProgress: UserProgress = {
      courseId,
      moduleId,
      completed: true,
      score,
      completedAt: new Date().toISOString()
    };

    const updatedProgress = [
      ...userProgress.filter(p => !(p.courseId === courseId && p.moduleId === moduleId)),
      newProgress
    ];

    setUserProgress(updatedProgress);
    localStorage.setItem('learningProgress', JSON.stringify(updatedProgress));

    // Award points
    const points = score ? Math.floor(score / 10) * 10 : 50;
    const newTotalPoints = totalPoints + points;
    setTotalPoints(newTotalPoints);
    localStorage.setItem('totalPoints', newTotalPoints.toString());

    // Update streak
    updateStreak();

    // Check for badges
    checkAndAwardBadges(courseId, moduleId, score);
  };

  const updateStreak = () => {
    const today = new Date().toDateString();
    const lastLearningDate = localStorage.getItem('lastLearningDate');
    
    if (lastLearningDate === today) {
      return; // Already learned today
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    if (lastLearningDate === yesterday.toDateString()) {
      // Continue streak
      const newStreak = currentStreak + 1;
      setCurrentStreak(newStreak);
      localStorage.setItem('currentStreak', newStreak.toString());
    } else {
      // Start new streak
      setCurrentStreak(1);
      localStorage.setItem('currentStreak', '1');
    }

    localStorage.setItem('lastLearningDate', today);
  };

  const checkAndAwardBadges = (courseId: string, moduleId: string, score?: number) => {
    const updatedBadges = [...badges];
    let hasNewBadge = false;

    // First course completion
    if (!updatedBadges.find(b => b.id === "first-course")?.earned) {
      updatedBadges.find(b => b.id === "first-course")!.earned = true;
      updatedBadges.find(b => b.id === "first-course")!.earnedAt = new Date().toISOString();
      hasNewBadge = true;
    }

    // Perfect quiz score
    if (score === 100 && !updatedBadges.find(b => b.id === "quiz-master")?.earned) {
      updatedBadges.find(b => b.id === "quiz-master")!.earned = true;
      updatedBadges.find(b => b.id === "quiz-master")!.earnedAt = new Date().toISOString();
      hasNewBadge = true;
    }

    // Week streak
    if (currentStreak >= 7 && !updatedBadges.find(b => b.id === "streak-week")?.earned) {
      updatedBadges.find(b => b.id === "streak-week")!.earned = true;
      updatedBadges.find(b => b.id === "streak-week")!.earnedAt = new Date().toISOString();
      hasNewBadge = true;
    }

    // Course completion
    const course = courses.find(c => c.id === courseId);
    if (course && getCourseProgress(courseId) === 100 && !updatedBadges.find(b => b.id === "course-complete")?.earned) {
      updatedBadges.find(b => b.id === "course-complete")!.earned = true;
      updatedBadges.find(b => b.id === "course-complete")!.earnedAt = new Date().toISOString();
      hasNewBadge = true;
    }

    if (hasNewBadge) {
      setBadges(updatedBadges);
      localStorage.setItem('earnedBadges', JSON.stringify(updatedBadges));
    }
  };

  const takeQuiz = (module: Module) => {
    setSelectedModule(module);
    setShowQuiz(true);
    setQuizAnswers({});
  };

  const submitQuiz = () => {
    if (!selectedModule?.quiz || !selectedCourse) return;

    const correctAnswers = selectedModule.quiz.questions.filter(
      (q, index) => quizAnswers[q.id] === q.correctAnswer
    ).length;

    const score = Math.round((correctAnswers / selectedModule.quiz.questions.length) * 100);
    
    if (score >= selectedModule.quiz.passingScore) {
      completeModule(selectedCourse.id, selectedModule.id, score);
      setShowQuiz(false);
      setSelectedModule(null);
    } else {
      alert(`You scored ${score}%. You need ${selectedModule.quiz.passingScore}% to pass. Try again!`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Advanced": return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const renderBadgeIcon = (iconName: string) => {
    const iconProps = { className: "w-6 h-6" };
    switch (iconName) {
      case "BookOpen": return <BookOpen {...iconProps} />;
      case "Star": return <Star {...iconProps} />;
      case "Flame": return <Flame {...iconProps} />;
      case "Trophy": return <Trophy {...iconProps} />;
      default: return <Award {...iconProps} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="floating-icon">
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
            <h1 className="text-4xl font-bold text-foreground bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Financial Learning Center
            </h1>
            <div className="floating-icon" style={{animationDelay: '1s'}}>
              <Trophy className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            🚀 Master personal finance through interactive courses and earn badges along the way!
            <span className="block mt-1 text-sm">Join thousands learning to build wealth! 💰</span>
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="learn-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                  <p className="learn-stat text-2xl font-bold text-foreground">{totalPoints}</p>
                </div>
                <div className="floating-icon">
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="learn-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Current Streak</p>
                  <p className="learn-stat text-2xl font-bold text-foreground">{currentStreak}</p>
                  <p className="text-sm text-muted-foreground">days 🔥</p>
                </div>
                <div className="floating-icon" style={{animationDelay: '0.5s'}}>
                  <Flame className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="learn-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Badges Earned</p>
                  <p className="learn-stat text-2xl font-bold text-foreground">
                    {badges.filter(b => b.earned).length}
                  </p>
                  <p className="text-sm text-muted-foreground">of {badges.length} 🏆</p>
                </div>
                <div className="floating-icon" style={{animationDelay: '1s'}}>
                  <Award className="w-8 h-8 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="learn-card border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Courses</p>
                  <p className="learn-stat text-2xl font-bold text-foreground">
                    {courses.filter(c => getCourseProgress(c.id) === 100).length}
                  </p>
                  <p className="text-sm text-muted-foreground">completed 📚</p>
                </div>
                <div className="floating-icon" style={{animationDelay: '1.5s'}}>
                  <Trophy className="w-8 h-8 text-teal-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Badges Section */}
        <Card className="learn-card border-0 shadow-md mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-500" />
              Your Achievement Badges 🎖️
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 text-center transition-all cursor-pointer ${
                    badge.earned
                      ? 'badge-earned border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 opacity-50'
                  }`}
                >
                  <div className={`mb-2 ${badge.earned ? 'text-purple-600' : 'text-gray-400'}`}>
                    {renderBadgeIcon(badge.icon)}
                  </div>
                  <h3 className={`font-semibold text-sm mb-1 ${badge.earned ? 'text-purple-800 dark:text-purple-200' : 'text-gray-500'}`}>
                    {badge.name}
                  </h3>
                  <p className={`text-xs ${badge.earned ? 'text-purple-600 dark:text-purple-300' : 'text-gray-400'}`}>
                    {badge.description}
                  </p>
                  {badge.earned && badge.earnedAt && (
                    <p className="text-xs text-purple-500 mt-1">
                      Earned {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {courses.map((course, index) => {
            const progress = getCourseProgress(course.id);
            const isUnlocked = isCourseUnlocked(course);

            return (
              <Card
                key={course.id}
                className={`learn-card border-0 shadow-md ${
                  !isUnlocked ? 'opacity-50' : 'cursor-pointer course-unlock'
                }`}
                onClick={() => isUnlocked && setSelectedCourse(course)}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-foreground mb-2">
                        {course.title}
                        {!isUnlocked && <Lock className="w-4 h-4 inline ml-2" />}
                      </CardTitle>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                        {course.difficulty}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{course.description}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" />
                      {course.modules.length} modules
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress 📈</span>
                      <span className="font-bold text-teal-600">{Math.round(progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                      <div
                        className="progress-fill bg-gradient-to-r from-teal-500 to-blue-500 h-full rounded-full transition-all duration-1000 ease-out"
                        style={{'--progress-width': `${progress}%`, width: `${progress}%`} as React.CSSProperties}
                      />
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {isUnlocked ? (
                    <Button 
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => setSelectedCourse(course)}
                    >
                      {progress > 0 ? 'Continue Learning' : 'Start Course'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <Lock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Complete "{courses.find(c => c.id === course.prerequisiteId)?.title}" to unlock
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Course Detail Modal */}
        {selectedCourse && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{selectedCourse.title}</h2>
                    <p className="text-muted-foreground">{selectedCourse.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedCourse(null)}
                    className="ml-4"
                  >
                    Close
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {selectedCourse.modules.map((module, index) => {
                    const isUnlocked = isModuleUnlocked(selectedCourse, index);
                    const isCompleted = userProgress.some(
                      p => p.courseId === selectedCourse.id && p.moduleId === module.id && p.completed
                    );
                    const moduleProgress = userProgress.find(
                      p => p.courseId === selectedCourse.id && p.moduleId === module.id
                    );

                    return (
                      <Card key={module.id} className={`border-0 shadow-md ${!isUnlocked ? 'opacity-50' : ''}`}>
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg text-foreground mb-2">
                                {index + 1}. {module.title}
                                {isCompleted && <CheckCircle className="w-4 h-4 inline ml-2 text-green-500" />}
                                {!isUnlocked && <Lock className="w-4 h-4 inline ml-2 text-gray-400" />}
                              </CardTitle>
                              <p className="text-sm text-muted-foreground mb-2">{module.description}</p>
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {module.duration}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent>
                          {isCompleted && moduleProgress?.score && (
                            <div className="mb-4 p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                              <p className="text-sm text-green-800 dark:text-green-200">
                                Completed with {moduleProgress.score}% score
                              </p>
                            </div>
                          )}
                          
                          {isUnlocked ? (
                            <div className="space-y-2">
                              <Button 
                                className="w-full"
                                onClick={() => setSelectedModule(module)}
                              >
                                <PlayCircle className="w-4 h-4 mr-2" />
                                {isCompleted ? 'Review Content' : 'Start Module'}
                              </Button>
                              {module.quiz && (
                                <Button 
                                  variant="outline"
                                  className="w-full"
                                  onClick={() => takeQuiz(module)}
                                >
                                  Take Quiz
                                </Button>
                              )}
                            </div>
                          ) : (
                            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <Lock className="w-6 h-6 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-500">Complete previous module to unlock</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module Content Modal */}
        {selectedModule && !showQuiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{selectedModule.title}</h2>
                    <p className="text-muted-foreground">{selectedModule.description}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setSelectedModule(null)}
                    className="ml-4"
                  >
                    Close
                  </Button>
                </div>

                <div
                  className="course-content max-w-none mb-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  dangerouslySetInnerHTML={{ __html: selectedModule.content }}
                />

                <div className="flex gap-4">
                  {selectedModule.quiz && (
                    <Button 
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => takeQuiz(selectedModule)}
                    >
                      Take Quiz to Complete
                    </Button>
                  )}
                  {!selectedModule.quiz && selectedCourse && (
                    <Button 
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                      onClick={() => {
                        completeModule(selectedCourse.id, selectedModule.id);
                        setSelectedModule(null);
                      }}
                    >
                      Mark as Complete
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Modal */}
        {showQuiz && selectedModule?.quiz && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">Quiz: {selectedModule.title}</h2>
                    <p className="text-muted-foreground">
                      Pass with {selectedModule.quiz.passingScore}% or higher
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowQuiz(false)}
                    className="ml-4"
                  >
                    Close
                  </Button>
                </div>

                <div className="space-y-6">
                  {selectedModule.quiz.questions.map((question, index) => (
                    <Card key={question.id} className="border-0 shadow-md">
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-4">
                          {index + 1}. {question.question}
                        </h3>
                        <div className="space-y-2">
                          {question.options.map((option, optionIndex) => (
                            <label 
                              key={optionIndex}
                              className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={question.id}
                                value={optionIndex}
                                checked={quizAnswers[question.id] === optionIndex}
                                onChange={() => setQuizAnswers(prev => ({
                                  ...prev,
                                  [question.id]: optionIndex
                                }))}
                                className="text-teal-600"
                              />
                              <span className="text-foreground">{option}</span>
                            </label>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 flex justify-end">
                  <Button 
                    className="bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={submitQuiz}
                    disabled={Object.keys(quizAnswers).length !== selectedModule.quiz.questions.length}
                  >
                    Submit Quiz
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
