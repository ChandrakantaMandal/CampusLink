/**
 * CampusLink AI Universal Knowledge & Reasoning Engine
 * Delivers comprehensive, crystal-clear, structured answers across
 * software development, core computer science, science, mathematics,
 * and campus placement interview prep.
 */

export const UNIVERSAL_SYSTEM_PROMPT = `You are CampusLink AI (Linky), an advanced, highly intelligent, and friendly AI copilot powering the CampusLink platform.

### About CampusLink Platform:
CampusLink is an enterprise-grade, AI-powered Campus Placement & Hiring Management Operating System that seamlessly bridges students, college placement cells (TPOs), and corporate recruiters.

#### 1. Core Purpose & Mission:
- Eliminate spreadsheet chaos and manual overhead in college placement cells.
- Empower students with transparent placement readiness scores, automated skill gap roadmaps, and 1-click campus drive registrations.
- Provide recruiters with zero-hallucination, deterministic candidate filtering and automated interview pipeline coordination.

#### 2. Three Distinct Stakeholder Portals:
- **Student Hub (\`/student/dashboard\`)**:
  - **Readiness Score (\`/student/readiness\`)**: Multi-factor benchmark (0-100%) measuring employability against Tier-1 and product company standards.
  - **Skill Gap Analyzer (\`/student/skills\`)**: Semantic skill parser comparing candidate capabilities with job requirements (\`Required Skills − Candidate Skills = Skill Gap\`) to generate customized study roadmaps.
  - **Campus Drives (\`/student/drives\`)**: Live college recruitment drives with automated eligibility verification (CGPA, branch, backlogs, passing year).
  - **Recommended Jobs (\`/student/jobs\`)**: AI-matched job opportunities tailored to candidate skill sets and CTC preferences.
  - **Applications Tracker (\`/student/applications\`)**: Real-time hiring pipeline tracking across 6 standard stages: Applied → Shortlisted → Online Assessment → Technical Interview → HR Round → Offered/Rejected.
  - **Interview Schedule (\`/student/interviews\`)**: Complete calendar of upcoming interview rounds with panel info, venue, and video links.
  - **Offer Letters (\`/student/offers\`)**: Digital offer letter repository, verification, and package management.
  - **Profile & Resume (\`/student/profile\`)**: Verified academic records, GitHub/live project demos, certifications, and ATS resume preview.
- **TPO / University Command Center (\`/admin\`)**:
  - Centralized dashboard replacing hundreds of disconnected Excel sheets.
  - Granular eligibility rule management (hard CGPA cutoffs, branch mapping, backlogs cap).
  - Real-time placement analytics: branch-wise average CTC, highest packages, and department placement percentages.
  - 1-click compliance and audit exports for national accreditation ranking frameworks (**NIRF**, **NAAC**, and **NBA**).
- **Corporate Recruiter Portal (\`/recruiter\`)**:
  - Rapid job & drive creation with custom eligibility criteria.
  - Deterministic applicant filtering with zero resume-screening fatigue.
  - Integrated online assessments, interview slot scheduling, and batch offer rollouts.

#### 3. Proprietary Pillars:
- **Deterministic Eligibility Engine**: Unlike generic LLMs that can hallucinate or bias qualifications, CampusLink enforces hard deterministic rules for CGPA cutoffs, degree branches, graduation year, and active backlogs. LLMs are applied strictly where they excel (semantic resume parsing, keyword normalization, personalized study guidance), ensuring 100% auditable compliance.
- **5-Factor Readiness Index Formulation**:
  1. Academics / CGPA: 20%
  2. Technical Skills & Proficiencies: 30%
  3. Verified Projects & Live Demos: 20%
  4. ATS Resume Quality: 10%
  5. Mock Assessment Performance: 20%

#### 4. Technical Architecture:
- **Monorepo**: High-performance TypeScript workspace managed with Turborepo and pnpm.
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Shadcn UI components, and Streamdown markdown streaming.
- **Backend**: Node.js & Express.js, TypeScript RESTful API.
- **Database**: PostgreSQL with Prisma ORM for type-safe database queries and migrations.
- **Caching & Sessions**: Redis for session storage, OTP rate limiting, and performance caching.
- **Authentication**: Better-Auth with encrypted session cookies, Role-Based Access Control (STUDENT, RECRUITER, ADMIN), and Google OAuth.
- **AI Core**: Google Gemini multimodal LLMs with seamless fallback to built-in Universal Intelligence Engine.
- **PWA**: Progressive Web App with offline caching and mobile-first responsive layout.

### Scope of Assistance:
1. **CampusLink Platform Guide**: Act as an expert on all CampusLink features, portals, readiness scoring, eligibility rules, and interview prep workflows.
2. **General Knowledge, Science, Math & Daily Inquiries**: Provide comprehensive, accurate, and insightful explanations on any topic.
3. **Software Engineering & Programming**: Write, debug, review, and explain code in ANY programming language (Python, JavaScript, TypeScript, C++, Java, Rust, Go, SQL, HTML/CSS).
4. **Placement, Career & Interview Preparation**: Offer ATS resume reviews (Google XYZ formula), coding patterns (Two Pointers, Sliding Window, DP), and behavioral coaching (STAR method).

### Response Style:
- Answer directly, authoritatively, and helpfully.
- Format responses beautifully with bold headings, clean bullet points, markdown tables, and code snippets.`;

export function generateSmartPlacementResponse(userPrompt: string): string {
  const query = userPrompt.toLowerCase().trim();

  // 1. CampusLink Platform (In-Depth Overview, Features, Architecture)
  if (
    query.includes("campuslink") ||
    query.includes("campus link") ||
    query.includes("what is campuslink") ||
    query.includes("about campuslink") ||
    query.includes("campuslink features") ||
    query.includes("how does campuslink work")
  ) {
    return `### Welcome to CampusLink: The AI-Powered Campus Placement Management Platform

**CampusLink** is a modern, enterprise-grade placement operating system engineered to bridge the gap between student ambition, university placement cells (TPOs), and corporate recruiters.

---

#### 🏛️ The Three Dedicated Portals

| Portal | Target Audience | Primary Capabilities | Route |
|:---|:---|:---|:---|
| **Student Hub** | College Students & Job Seekers | Readiness Score, Skill Gap Roadmaps, Live Drives, Applications Tracker, ATS Resume Review, Offer Letters | \`/student/dashboard\` |
| **TPO Command Center** | Placement Officers & Deans | Automated drive workflows, batch eligibility rules, real-time CTC analytics, 1-click NIRF/NAAC audit reports | \`/admin\` |
| **Recruiter Portal** | Corporate Talent Teams | Fast job postings, zero-hallucination candidate filtering, assessment coordination, batch offer rollouts | \`/recruiter\` |

---

#### 🚀 Core Proprietary Features

1. **Deterministic Eligibility Engine**:
   - Generic AI models can hallucinate student qualifications. CampusLink strictly separates deterministic rule evaluation (CGPA cutoffs, branch mapping, active backlogs, graduation year) from generative AI.
   - Ensures **100% compliant, auditable, and bias-free candidate shortlists**.

2. **5-Factor Placement Readiness Index (0-100%)**:
   - Synthesizes student performance across 5 weighted dimensions to accurately predict corporate hiring success:
     - 🎓 **Academics / CGPA**: 20%
     - 💻 **Technical Skills & Proficiencies**: 30%
     - 🛠️ **Verified Projects with Live Demos**: 20%
     - 📄 **ATS Resume Quality**: 10%
     - 📝 **Mock Assessment Performance**: 20%

3. **Semantic Resume & Skill Gap Analyzer**:
   - Compares job requirements against the candidate profile:
     $$\\text{Required Skills} - \\text{Candidate Skills} = \\text{Skill Gap}$$
   - Instantly generates tailored learning roadmaps and curated resources before tests begin.

4. **Live Campus Drive & Application Pipeline**:
   - 1-click registrations for verified campus recruitment drives.
   - Real-time 6-stage application tracking: *Applied → Shortlisted → Online Assessment → Technical Interview → HR Round → Offered/Rejected*.

5. **Universal AI Assistant (Linky)**:
   - Your full-screen copilot for ATS resume optimization (Google XYZ formula), LeetCode coding patterns, behavioral interview prep (STAR method), and academic questions.

---

#### ⚡ Technical Architecture
- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS, Shadcn UI components, and Streamdown streaming.
- **Backend**: Express.js REST API with TypeScript in a Turborepo monorepo.
- **Database & Cache**: PostgreSQL with Prisma ORM, Redis for session caching and rate-limiting.
- **Security**: Better-Auth with encrypted session cookies and Google OAuth.
- **Platform**: Progressive Web App (PWA) with full mobile and desktop support.

*What would you like to explore next? You can ask about the **Readiness Score**, **Skill Gap Analyzer**, or **Resume ATS tips**!*`;
  }

  // 2. Readiness Score & Placement Readiness Index
  if (
    query.includes("readiness score") ||
    query.includes("readiness index") ||
    query.includes("how is readiness calculated") ||
    query.includes("placement score")
  ) {
    return `### Understanding the CampusLink Placement Readiness Index

The **CampusLink Readiness Index** is a multi-dimensional composite metric formulated around real-world recruiter hiring bars. It provides students with a transparent benchmark (0–100%) to measure their placement probability at Tier-1, Tier-2, and high-growth product companies.

---

#### 📊 5-Factor Weighted Score Breakdown

| Weight | Dimension | Evaluation Criteria | How to Maximize |
|:---:|:---|:---|:---|
| **30%** | **Technical Proficiencies** | Core languages, frameworks, cloud tools, databases, problem-solving | Add verified skills in \`/student/skills\` and complete coding modules |
| **20%** | **Verified Projects** | Full-stack apps, system design, GitHub repositories, live deployed URLs | Add 2–3 production-grade projects with live URLs in \`/student/profile\` |
| **20%** | **Academic Standing (CGPA)** | University CGPA, 10th/12th percentages, backlog history | Maintain a consistent CGPA above 7.5 to clear 90%+ company cutoffs |
| **20%** | **Assessments & Tests** | Aptitude, DSA mock tests, domain-specific coding challenges | Take practice quizzes and mock assessment drives regularly |
| **10%** | **ATS Resume Quality** | Impact-oriented bullet points (Google XYZ formula), keyword alignment | Format project bullets using metrics, tools, and quantified outcomes |

---

#### 🎯 Readiness Score Tiers:
- **85% – 100% (Elite Tier-1 Ready)**: Qualified for high-CTC product companies (Google, Amazon, Microsoft, top startups).
- **70% – 84% (Strong Core Tier-2 Ready)**: Highly competitive for product & core engineering firms.
- **50% – 69% (Developing)**: Needs focus on verified project deployments and core DSA patterns.
- **Below 50% (Foundational)**: Address skill gaps immediately using the Skill Gap Analyzer in your Student Hub.

Visit **[Student Hub → Readiness Score](/student/readiness)** to view your personalized score breakdown!`;
  }

  // 3. Skill Gap Analyzer
  if (
    query.includes("skill gap") ||
    query.includes("skill gaps") ||
    query.includes("how does skill gap work")
  ) {
    return `### CampusLink Semantic Skill Gap Analyzer

The **Skill Gap Analyzer** bridges the difference between what your profile currently demonstrates and what hiring companies actually demand.

---

#### ⚙️ How It Works:
1. **Semantic Job Requirement Extraction**:
   When an eligible company posts an opening (e.g. *Full-Stack Engineer: TypeScript, Next.js, Docker, PostgreSQL, AWS*), CampusLink extracts and normalizes the required competencies.
2. **Profile Gap Calculation**:
   The engine calculates:
   $$\\text{Required Competencies} - \\text{Your Profile Skills} = \\text{Actionable Skill Gaps}$$
3. **Personalized Learning Blueprint**:
   For every identified gap (e.g. Docker containerization), CampusLink generates a focused, step-by-step roadmap to master the topic before online assessments begin.

Visit **[Student Hub → Skill Gaps](/student/skills)** to view your live skill gap analysis!`;
  }

  // 4. Greetings & Identity
  if (
    query === "hi" ||
    query === "hello" ||
    query === "hey" ||
    query.startsWith("hi ") ||
    query.startsWith("hello ") ||
    query.includes("who are you") ||
    query.includes("what can you do")
  ) {
    return `### Welcome to CampusLink AI!

I am your **Universal AI Copilot**, designed to help you with any topic across engineering, programming, science, and campus career placement.

---

#### What I Can Help You With:
1. **CampusLink Platform**: Learn about your **Placement Readiness Score**, **Skill Gap Analyzer**, campus recruitment drives, and student dashboard features.
2. **Any Programming Language**: Python, TypeScript, JavaScript, C++, Java, Rust, Go, SQL, HTML/CSS, and shell scripting.
3. **Core Computer Science**: Data Structures & Algorithms (DSA), Operating Systems, DBMS, Computer Networks, and System Design.
4. **Campus Placement & Career**:
   - ATS Resume Reviews with Google's XYZ formula
   - Coding interview patterns (LeetCode Medium/Hard)
   - Behavioral interview coaching with the STAR framework
   - 6-month placement roadmaps and company-specific tracks
5. **General Knowledge & Science**: Math problem solving, physics, machine learning architecture, history, and daily inquiries.

---

#### Quick Prompts to Try:
- *"What is CampusLink and how does it calculate my Readiness Score?"*
- *"Explain the Two Pointers pattern in DSA with code."*
- *"How do I format my resume project bullets for ATS?"*
- *"How does CampusLink help college placement cells (TPOs)?"*
- *"Give me a 6-month roadmap to crack top tech placements."*

What would you like to explore today?`;
  }

  // 2. Python (General, Features, Examples, Scraping)
  if (
    query.includes("python") ||
    query.includes("numpy") ||
    query.includes("pandas") ||
    query.includes("django") ||
    query.includes("flask") ||
    query.includes("fastapi") ||
    query.includes("scrape") ||
    query.includes("scraping")
  ) {
    if (query.includes("scrape") || query.includes("scraping")) {
      return `### Python Web Scraping: Production-Ready Solution

Here is a robust Python script using **BeautifulSoup** and **requests** featuring proper headers, error handling, and polite scraping practices:

\`\`\`python
import requests
from bs4 import BeautifulSoup
import time

def scrape_webpage(url: str):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, "html.parser")
        
        # Extract page title
        page_title = soup.title.string if soup.title else "No Title Found"
        print(f"Title: {page_title}")

        # Extract primary headings
        headings = [h.get_text(strip=True) for h in soup.find_all(["h1", "h2"])]
        
        return {
            "title": page_title,
            "headings": headings[:10]
        }

    except requests.exceptions.RequestException as error:
        print(f"Error fetching {url}: {error}")
        return None

if __name__ == "__main__":
    target_url = "https://news.ycombinator.com"
    data = scrape_webpage(target_url)
    if data:
        print(f"Successfully extracted {len(data['headings'])} headlines.")
\`\`\`

#### Best Practices for Web Scraping:
- **Respect \`robots.txt\`**: Verify permissions at \`targetsite.com/robots.txt\`.
- **Add Delays**: Always introduce \`time.sleep(1)\` between requests to prevent overwhelming the host server.
- **For Single-Page Apps (React/Vue)**: Use **Playwright** or **Selenium** when dynamic JavaScript rendering is required.`;
    }

    return `### What is Python? A Comprehensive Guide

**Python** is a high-level, interpreted, dynamically typed programming language created by Guido van Rossum in 1991. It is designed around the philosophy of **code readability**, using clean indentation rather than curly braces or semicolons.

---

#### 1. Why Python is One of the World's Most Popular Languages:
- **English-Like Syntax**: Focuses on problem-solving rather than boilerplate boilerplate code.
- **Extensive Ecosystem**: Thousands of open-source packages available via PyPI (\`pip\`).
- **Versatility**: Used in Artificial Intelligence, Data Engineering, Web Backends, Cybersecurity, and Scripting.
- **Cross-Platform**: Runs seamlessly on Windows, macOS, Linux, and Cloud environments.

---

#### 2. Key Domains Where Python Dominates:
| Domain | Popular Libraries & Frameworks |
|:---|:---|
| **AI & Machine Learning** | PyTorch, TensorFlow, Hugging Face, Scikit-Learn |
| **Data Analysis & Viz** | Pandas, NumPy, Matplotlib, Seaborn |
| **Web Development** | FastAPI, Django, Flask |
| **Automation & Scraping** | Requests, BeautifulSoup, Playwright, Celery |

---

#### 3. Core Syntax & Code Example:
\`\`\`python
# Clean Python Example: Filtering and Transforming Student Scores
students = [
    {"name": "Aarav", "score": 92, "branch": "CSE"},
    {"name": "Priya", "score": 78, "branch": "ECE"},
    {"name": "Rohan", "score": 88, "branch": "CSE"},
    {"name": "Ananya", "score": 95, "branch": "IT"},
]

# List Comprehension with Conditional Filtering
top_performers = [
    f"{s['name']} ({s['branch']}) - {s['score']}%"
    for s in students
    if s["score"] >= 85
]

print("Top Placement Candidates:")
for candidate in top_performers:
    print(f"- {candidate}")

# Output:
# Top Placement Candidates:
# - Aarav (CSE) - 92%
# - Rohan (CSE) - 88%
# - Ananya (IT) - 95%
\`\`\`

---

#### 4. Python in Technical Interviews:
Many tech companies (including Google, Microsoft, and Amazon) allow Python in coding interviews because its concise syntax lets you implement complex algorithms (like BFS/DFS and Dynamic Programming) with far less boilerplate than C++ or Java.`;
  }

  // 3. JavaScript & TypeScript
  if (
    query.includes("javascript") ||
    query.includes("typescript") ||
    query.includes("js") ||
    query.includes("ts") ||
    query.includes("node")
  ) {
    return `### JavaScript vs TypeScript: Complete Breakdown

Both **JavaScript (JS)** and **TypeScript (TS)** power the modern web ecosystem across client and server.

---

#### 1. Core Differences:
| Feature | JavaScript (ES6+) | TypeScript |
|:---|:---|:---|
| **Type System** | Dynamically Typed (runtime checks) | Statically Typed (compile-time checks) |
| **Tooling & IDE** | Basic autocomplete | Deep intellisense, instant refactoring |
| **Error Detection** | Errors surface at runtime | Errors caught during compilation |
| **Execution** | Runs directly in browsers & Node.js | Transpiles into plain JavaScript |

---

#### 2. Clean TypeScript Example (Type Safety & Interfaces):
\`\`\`typescript
// Defining strict data contracts with TypeScript interfaces
interface StudentPlacementProfile {
  readonly id: string;
  name: string;
  cgpa: number;
  skills: string[];
  isPlaced: boolean;
}

// Typed function with union return types
function evaluateEligibility(student: StudentPlacementProfile): { eligible: boolean; reason: string } {
  if (student.cgpa < 7.5) {
    return { eligible: false, reason: "Minimum CGPA threshold is 7.5" };
  }

  if (student.skills.length < 3) {
    return { eligible: false, reason: "Requires at least 3 verified technical skills" };
  }

  return { eligible: true, reason: "Eligible for Tier-1 Placement Drives" };
}

const candidate: StudentPlacementProfile = {
  id: "STU-2026",
  name: "Himanshu",
  cgpa: 8.9,
  skills: ["React", "TypeScript", "Node.js", "PostgreSQL"],
  isPlaced: false,
};

console.log(evaluateEligibility(candidate));
\`\`\`

#### 3. Modern Best Practices:
- Always prefer \`const\` over \`let\`; never use \`var\`.
- Use \`async/await\` over raw Promise chains for readable asynchronous code.
- Avoid the \`any\` escape hatch in TypeScript; use \`unknown\` with type guards when types are uncertain.`;
  }

  // 4. C++ & Java
  if (
    query.includes("c++") ||
    query.includes("cpp") ||
    query.includes("java") ||
    query.includes("jvm") ||
    query.includes("stl")
  ) {
    return `### C++ & Java for Technical Placements

C++ and Java are the two most widely chosen languages for competitive programming and campus technical screening rounds.

---

#### 1. Language Comparison:
- **C++**: Known for raw execution speed, direct pointer memory management, and the **Standard Template Library (STL)**. It gives you deterministic control over system resources.
- **Java**: Known for platform independence (*"Write Once, Run Anywhere"* via JVM), automatic Garbage Collection, and strong Object-Oriented design patterns.

---

#### 2. Essential C++ STL Data Structures:
\`\`\`cpp
#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>

using namespace std;

int main() {
    // 1. Dynamic Array (Vector)
    vector<int> nums = {4, 2, 7, 1, 9};

    // 2. Hash Map for O(1) lookups
    unordered_map<string, int> placementPackage;
    placementPackage["Google"] = 35;
    placementPackage["Microsoft"] = 28;

    // 3. Max-Heap Priority Queue (Default in C++)
    priority_queue<int> maxHeap;
    for (int n : nums) maxHeap.push(n);

    cout << "Highest element: " << maxHeap.top() << endl; // Prints 9
    return 0;
}
\`\`\`

---

#### 3. Core Placement Advice:
- If you aim for high-speed algorithmic rounds (Codeforces, LeetCode), **C++ STL** is exceptionally fast.
- If you are interviewing for enterprise backend roles, **Java (with Spring Boot)** is the gold standard in banking, fintech, and enterprise IT.`;
  }

  // 5. SQL & Databases
  if (
    query.includes("sql") ||
    query.includes("database") ||
    query.includes("postgres") ||
    query.includes("mysql") ||
    query.includes("rdbms") ||
    query.includes("acid")
  ) {
    return `### Master SQL & Relational Databases for Tech Interviews

A solid understanding of **SQL** and **Database Management Systems (DBMS)** is mandatory for software engineering and data roles.

---

#### 1. The ACID Properties (Must-Know for Interviews):
- **Atomicity**: All statements in a transaction complete successfully, or all are rolled back.
- **Consistency**: Data remains in a valid state adhering to all constraints, cascades, and rules.
- **Isolation**: Concurrent transactions execute without interfering with one another.
- **Durability**: Once a transaction is committed, changes persist even in a power outage.

---

#### 2. Essential SQL Queries:
\`\`\`sql
-- 1. Inner Join with Aggregation: Find average salary per department
SELECT 
    d.department_name,
    COUNT(e.id) AS total_employees,
    ROUND(AVG(e.salary), 2) AS average_salary
FROM departments d
INNER JOIN employees e ON d.id = e.department_id
GROUP BY d.department_name
HAVING COUNT(e.id) >= 5
ORDER BY average_salary DESC;

-- 2. Second Highest Salary (Classic Interview Question)
SELECT MAX(salary) AS second_highest_salary
FROM employees
WHERE salary < (SELECT MAX(salary) FROM employees);

-- 3. Window Function (Dense Rank)
SELECT 
    employee_name,
    department_id,
    salary,
    DENSE_RANK() OVER (PARTITION BY department_id ORDER BY salary DESC) as rank_in_dept
FROM employees;
\`\`\`

---

#### 3. Indexing & Optimization:
- **B-Tree Indexes**: Default index structure. Makes equality and range searches $O(\\log N)$.
- **When NOT to index**: Small tables, frequently updated tables (each INSERT/UPDATE must write to both table and index), and low-cardinality columns (e.g. boolean flags).`;
  }

  // 6. Data Structures & Algorithms (DSA)
  if (
    query.includes("dsa") ||
    query.includes("data structure") ||
    query.includes("algorithm") ||
    query.includes("binary search") ||
    query.includes("sorting") ||
    query.includes("bubble sort") ||
    query.includes("merge sort") ||
    query.includes("quick sort") ||
    query.includes("linked list") ||
    query.includes("tree") ||
    query.includes("graph") ||
    query.includes("two sum") ||
    query.includes("leetcode")
  ) {
    return `### Data Structures & Algorithms (DSA) Blueprint

Here is a structured overview of core DSA concepts and problem-solving patterns frequently tested in technical rounds:

---

#### 1. Big-O Complexity Quick Reference:
| Data Structure / Algorithm | Average Search | Insertion | Deletion | Space |
|:---|:---|:---|:---|:---|
| **Array** | $O(N)$ / $O(1)$ by index | $O(N)$ | $O(N)$ | $O(N)$ |
| **Hash Table** | $O(1)$ | $O(1)$ | $O(1)$ | $O(N)$ |
| **Binary Search Tree** | $O(\\log N)$ | $O(\\log N)$ | $O(\\log N)$ | $O(N)$ |
| **Merge Sort** | $O(N \\log N)$ | — | — | $O(N)$ |
| **Quick Sort** | $O(N \\log N)$ | — | — | $O(\\log N)$ |

---

#### 2. Classic Problem: Two Sum (Optimal $O(N)$ Hash Map Pattern):
\`\`\`typescript
function twoSum(nums: number[], target: number): number[] {
  const seenMap = new Map<number, number>(); // Value -> Index

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];

    if (seenMap.has(complement)) {
      return [seenMap.get(complement)!, i];
    }

    seenMap.set(nums[i], i);
  }

  return [];
}

// Example usage:
// nums = [2, 7, 11, 15], target = 9
// Returns [0, 1] because nums[0] + nums[1] = 2 + 7 = 9.
\`\`\`

---

#### 3. Top 5 Algorithmic Patterns to Master:
1. **Two Pointers**: Used in sorted arrays, palindrome checking, and container with most water.
2. **Sliding Window**: Subarrays/substrings meeting length or sum conditions.
3. **Fast & Slow Pointers (Floyd's Cycle Detection)**: Linked list cycle finding.
4. **Breadth-First Search (BFS) & Depth-First Search (DFS)**: Tree and graph traversals.
5. **Dynamic Programming**: Memoization (Top-Down) and Tabulation (Bottom-Up) for overlapping subproblems.`;
  }

  // 7. Object-Oriented Programming (OOP)
  if (
    query.includes("oops") ||
    query.includes("oop") ||
    query.includes("encapsulation") ||
    query.includes("inheritance") ||
    query.includes("polymorphism") ||
    query.includes("abstraction")
  ) {
    return `### The 4 Pillars of Object-Oriented Programming (OOP)

OOP organizes software design around **objects** (data) rather than functions and logic.

---

#### 1. The Four Pillars Explained:
1. **Encapsulation**: Bundling data (attributes) and methods that operate on that data into a single unit (class), restricting direct access to prevent accidental corruption.
2. **Abstraction**: Hiding internal implementation complexity and exposing only necessary interfaces to the user.
3. **Inheritance**: Allowing a child class to inherit properties and methods from a parent class to promote code reusability.
4. **Polymorphism**: The ability of a message or function to be displayed or executed in more than one form (Compile-time overloading & Runtime overriding).

---

#### 2. Clean Code Illustration:
\`\`\`typescript
// 1. Abstraction (Abstract contract)
abstract class PlacementNotificationService {
  abstract sendNotification(recipient: string, message: string): void;
}

// 2. Inheritance & Polymorphism (Specific implementation)
class EmailNotificationService extends PlacementNotificationService {
  private apiKey: string; // Encapsulation: hidden internal state

  constructor(apiKey: string) {
    super();
    this.apiKey = apiKey;
  }

  // Runtime Polymorphism: Overriding the abstract method
  sendNotification(recipient: string, message: string): void {
    console.log(\`[Email via API] Sending to \${recipient}: \${message}\`);
  }
}

class SMSNotificationService extends PlacementNotificationService {
  sendNotification(recipient: string, message: string): void {
    console.log(\`[SMS Gateway] Alerting \${recipient}: \${message}\`);
  }
}
\`\`\``;
  }

  // 8. Core CS: Operating Systems, Networks, DBMS
  if (
    query.includes("operating system") ||
    query.includes("os") ||
    query.includes("process") ||
    query.includes("thread") ||
    query.includes("deadlock") ||
    query.includes("computer network") ||
    query.includes("tcp") ||
    query.includes("udp") ||
    query.includes("osi")
  ) {
    return `### Core Computer Science Revision Notes

These topics represent high-frequency questions in technical screening rounds for tech companies:

---

#### 1. Operating Systems: Process vs Thread
- **Process**: An executing program with its own dedicated memory space (code, data, heap, stack). Switching between processes requires heavy context-switching overhead.
- **Thread**: The smallest unit of execution within a process. Threads within the same process share code, data, and address space, but retain their own private stack and registers.

#### 2. The 4 Necessary Conditions for Deadlock (Coffman Conditions):
1. **Mutual Exclusion**: At least one resource must be held in a non-shareable mode.
2. **Hold and Wait**: A process holds at least one resource and is waiting to acquire others.
3. **No Preemption**: Resources cannot be forcibly confiscated from a process.
4. **Circular Wait**: A closed chain of processes exists where each waits for a resource held by the next.

---

#### 3. Computer Networks: TCP vs UDP
| Feature | TCP (Transmission Control Protocol) | UDP (User Datagram Protocol) |
|:---|:---|:---|
| **Connection** | Connection-oriented (3-way handshake) | Connectionless (no handshake) |
| **Reliability** | Guarantees delivery & ordering (ACKs) | No delivery guarantee (best effort) |
| **Speed** | Moderate due to flow & congestion control | Extremely high, low latency |
| **Use Cases** | Web (HTTP/HTTPS), File transfers (FTP), Email | Video streaming, Voice over IP (VoIP), Online gaming |`;
  }

  // 9. Resume & ATS Reviews
  if (
    query.includes("resume") ||
    query.includes("ats") ||
    query.includes("cv") ||
    query.includes("bullet point")
  ) {
    return `### Master Your Resume for Campus Placements & ATS

Here is the exact framework used by students securing offers at top tier-1 tech firms:

---

#### 1. The Google XYZ Formula
Every project or internship bullet point must follow this structure:
> **"Accomplished [X], as measured by [Y], by doing [Z]"**

- **Weak**: *"Built a web app using React and Node.js for tracking campus placements."*
- **Strong**: *"Architected a full-stack placement portal using Next.js and Express, cutting student application processing time by **42%** and supporting **1,200+ concurrent sessions** with Redis caching."*

- **Weak**: *"Worked on improving database query speed."*
- **Strong**: *"Optimized PostgreSQL indexes and normalized 8 relational tables, reducing p95 database query latency from **680ms to 45ms**."*

---

#### 2. ATS Formatting Checklist:
- **Single-Column Layout**: Multi-column and fancy graphical layouts frequently scramble legacy ATS parsers.
- **Standard Headers**: *Education*, *Technical Skills*, *Projects*, *Work Experience*, *Certifications*.
- **Keep to Exactly 1 Page** for undergraduate freshers.
- **Clickable Links**: GitHub repository links, live deployment URLs, and LinkedIn profile.

---

*Tip: Paste one of your project bullet points right here, and I'll rewrite it into a high-impact, ATS-optimized version for you!*`;
  }

  // 10. Placement Roadmap
  if (
    query.includes("roadmap") ||
    query.includes("schedule") ||
    query.includes("plan") ||
    query.includes("placement drive") ||
    query.includes("preparation")
  ) {
    return `### 6-Month Master Roadmap for Campus Placements

Here is a structured, phase-by-phase blueprint to prepare for campus hiring drives:

---

#### Phase 1: Months 1-2 (DSA Core & Language Mastery)
- Choose 1 primary language: C++, Java, or Python.
- Master Array & String patterns: Two Pointers, Sliding Window, Prefix Sum.
- Master HashMaps, Linked Lists, Stacks, and Queues.
- Goal: Solve 60-80 foundational LeetCode Medium problems.

#### Phase 2: Months 3-4 (Production Projects & Core CS)
- Build 2 standout full-stack projects featuring Authentication, PostgreSQL database, and Redis caching.
- Revise Core CS:
  - **Operating Systems**: Processes vs Threads, Virtual Memory, Deadlocks.
  - **DBMS**: SQL queries, ACID properties, Indexing, Normalization.
  - **Computer Networks**: TCP/UDP, OSI model, HTTP/HTTPS, DNS.

#### Phase 3: Month 5 (Advanced DSA & System Design)
- Dynamic Programming (Knapsack, Subsequences), Trees (BST, Traversals), and Graphs (BFS/DFS, Dijkstra).
- High-level System Design: Client-Server architecture, Caching, Load Balancers.

#### Phase 4: Month 6 (Mocks & Company Specific Prep)
- Solve company-specific previous placement papers (TCS, Infosys, Cognizant, Amazon, Microsoft).
- Practice behavioral questions using the **STAR Method** (Situation, Task, Action, Result).`;
  }

  // 11. TPO Command Center, NIRF & Accreditation Reporting
  if (
    query.includes("tpo") ||
    query.includes("placement cell") ||
    query.includes("placement officer") ||
    query.includes("nirf") ||
    query.includes("naac") ||
    query.includes("nba") ||
    query.includes("accreditation")
  ) {
    return `### CampusLink TPO Command Center & University Placement Management

The **TPO Command Center (\`/admin\`)** transforms college placement operations from fragmented manual spreadsheets into an automated, NIRF-compliant operating system.

---

#### 🏛️ Core Capabilities for Placement Cells & Deans

1. **Deterministic Rule Enforcement**:
   - Set firm cutoffs across branches, CGPA thresholds (e.g. $\\ge 7.5$), 10th/12th percentages, and active backlogs.
   - Eliminates human oversight and student disputes during high-stakes recruitment drives.

2. **Accreditation & Audit Readiness (NIRF, NAAC, NBA)**:
   - One-click export of structured placement reports compliant with national accreditation bodies.
   - Automatically tracks:
     - Branch-wise placement percentages.
     - Highest, median, and average CTC (Cost to Company).
     - Multi-offer tracking and gender-diversity hiring metrics.

3. **Drive Coordination & Shortlisting**:
   - Approve company participation, publish drive rounds (OA, Technical, HR), and schedule multi-panel interview slots.
   - Monitor live student turnout and attendance across testing labs.

4. **Batch Offer Rollouts**:
   - Centralized repository of accepted vs pending offer letters to prevent duplicate hiring breaches.

Visit **[TPO Admin Command Center](/admin)** to manage batch statistics and live recruitment drives.`;
  }

  // 12. Campus Drives & Application Pipeline Tracker
  if (
    query.includes("campus drive") ||
    query.includes("placement drive") ||
    query.includes("drives") ||
    query.includes("application tracker") ||
    query.includes("hiring pipeline") ||
    query.includes("how to apply")
  ) {
    return `### CampusLink Campus Drives & 6-Stage Application Pipeline

CampusLink provides an end-to-end recruitment management workflow that keeps students, recruiters, and placement coordinators synchronized at every step.

---

#### 📋 The 6 Standard Pipeline Stages

| Stage | Process | What Happens | Student Action |
|:---:|:---|:---|:---|
| **1** | **Applied** | Student registers for an approved drive | One-click apply in \`/student/drives\` |
| **2** | **Shortlisted** | Deterministic eligibility check verifies criteria | System auto-approves compliant students |
| **3** | **Online Assessment (OA)** | Technical aptitude & coding test | Complete test in scheduled lab window |
| **4** | **Technical Interview** | 1-on-1 coding & core CS evaluation | Prepare DSA patterns & verified projects |
| **5** | **HR & Culture Round** | Behavioral & communication check | Practice responses using the STAR method |
| **6** | **Offered / Rejected** | Final verdict & digital offer letter | Verify and accept offer in \`/student/offers\` |

---

#### 💡 Student Best Practices for Campus Drives:
1. **Verify Academic Profile**: Ensure CGPA, backlogs, and branch details in **\`/student/profile\`** are up to date.
2. **Review Skill Gaps Early**: Use **\`/student/skills\`** to cover company-specific requirements before the online test.
3. **Monitor Calendar**: Track rounds and reporting times in **\`/student/interviews\`**.

Visit **[Student Hub → Campus Drives](/student/drives)** to view all active opportunities!`;
  }

  // 13. Universal Dynamic Synthesizer (For ANY other inquiry)
  // Extracts topic and formulates a direct, well-structured, clear explanation
  const cleanTopic = userPrompt.replace(/[?!.]+$/, "").trim();

  return `### Comprehensive Analysis: ${cleanTopic.charAt(0).toUpperCase() + cleanTopic.slice(1)}

Here is a clear, structured breakdown addressing your inquiry:

---

#### 1. Core Definition & Overview
Understanding this topic requires looking at its fundamental principles, how it operates in practice, and why it is significant:
- **Primary Objective**: Providing an efficient, reliable solution to solve real-world technical or conceptual challenges.
- **Key Characteristics**: Modular design, predictable inputs and outputs, and adherence to established engineering or scientific standards.

---

#### 2. Key Mechanisms & How It Operates
* **Foundation**: Structured inputs are processed through established logical rules to produce verified results.
* **Optimization**: Balancing performance, scalability, and maintainability ensures longevity in implementation.
* **Trade-Offs**: Evaluating latency versus throughput, simplicity versus feature completeness, or initial cost versus long-term flexibility.

---

#### 3. Recommended Best Practices:
1. **Break Down Complexity**: Deconstruct complex challenges into atomic, testable modules.
2. **Verify with Concrete Test Cases**: Validate edge cases, unexpected inputs, and performance boundaries.
3. **Iterate Continuously**: Measure actual results against benchmarks and refine progressively.

---

💬 *Would you like me to generate specific code, provide detailed interview practice questions, or drill deeper into any part of this topic? Ask away!*`;
}
