const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);
const adminPasswordHash = bcrypt.hashSync('admin123', salt);
const studentPasswordHash = bcrypt.hashSync('student123', salt);

const seedUsers = [
  {
    _id: 'usr_admin_001',
    name: 'Admin Examiner',
    email: 'admin@examsphere.com',
    password: adminPasswordHash,
    role: 'admin',
    createdAt: new Date('2025-01-01T00:00:00Z'),
  },
  {
    _id: 'usr_student_001',
    name: 'Alex Student',
    email: 'student@examsphere.com',
    password: studentPasswordHash,
    role: 'student',
    createdAt: new Date('2025-01-02T00:00:00Z'),
  },
];

const seedExams = [
  {
    _id: 'exam_mern_101',
    title: 'Full-Stack JavaScript & MERN Architecture',
    description: 'Evaluate your deep expertise in React hooks, Express middleware, MongoDB document design, and Node.js asynchronous architecture.',
    category: 'Web Development',
    durationMinutes: 15,
    passingPercentage: 60,
    isPublished: true,
    createdBy: 'usr_admin_001',
    createdAt: new Date('2025-01-10T10:00:00Z'),
    questions: [
      {
        id: 'q1',
        questionText: 'Which React hook is primarily designed for running side effects such as data fetching, subscriptions, and DOM mutations?',
        type: 'single',
        options: [
          'useReducer',
          'useEffect',
          'useMemo',
          'useCallback'
        ],
        correctAnswer: 'useEffect',
        marks: 5,
        explanation: 'useEffect handles side-effects in functional components after rendering occurs.'
      },
      {
        id: 'q2',
        questionText: 'In Express.js, what is the role of the "next()" function within middleware?',
        type: 'single',
        options: [
          'It terminates the current HTTP connection and sends a response',
          'It passes control to the next middleware function in the stack',
          'It redirects the browser to the next page in the history stack',
          'It restarts the Node.js event loop cycle'
        ],
        correctAnswer: 'It passes control to the next middleware function in the stack',
        marks: 5,
        explanation: 'Calling next() hands execution over to the subsequent middleware function or route handler.'
      },
      {
        id: 'q3',
        questionText: 'In MongoDB, which index type is best suited for geospatial coordinate queries such as finding nearby locations?',
        type: 'single',
        options: [
          'Compound Index',
          'Hashed Index',
          '2dsphere Index',
          'Text Index'
        ],
        correctAnswer: '2dsphere Index',
        marks: 5,
        explanation: 'The 2dsphere index supports queries that calculate geometries on an earth-like sphere.'
      },
      {
        id: 'q4',
        questionText: 'Node.js event loop: which phase executes timers scheduled by setTimeout() and setInterval()?',
        type: 'single',
        options: [
          'Poll phase',
          'Check phase',
          'Timers phase',
          'Close callbacks phase'
        ],
        correctAnswer: 'Timers phase',
        marks: 5,
        explanation: 'The timers phase of the event loop executes callbacks scheduled by setTimeout() and setInterval().'
      },
      {
        id: 'q5',
        questionText: 'True or False: In JSON Web Tokens (JWT), the payload claims are encrypted by default and cannot be read without the secret key.',
        type: 'boolean',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 'False',
        marks: 5,
        explanation: 'Standard JWT payloads are only Base64Url-encoded and digitally signed, not encrypted. Anyone can decode and read the claims unless JWE (encrypted JWT) is used.'
      },
      {
        id: 'q6',
        questionText: 'Which HTTP method should be used for operations that are idempotent and replace the entire target resource?',
        type: 'single',
        options: [
          'POST',
          'PATCH',
          'PUT',
          'HEAD'
        ],
        correctAnswer: 'PUT',
        marks: 5,
        explanation: 'PUT replaces the complete resource state and is strictly defined as idempotent in HTTP specification.'
      },
      {
        id: 'q7',
        questionText: 'What is the primary benefit of React Virtual DOM reconciliation (Fiber architecture)?',
        type: 'single',
        options: [
          'It eliminates the need for JavaScript memory management',
          'It computes minimal DOM changes to avoid expensive direct layout recalculations',
          'It replaces CSS rendering with canvas draw operations',
          'It compiles JSX into native C++ machine code'
        ],
        correctAnswer: 'It computes minimal DOM changes to avoid expensive direct layout recalculations',
        marks: 5,
        explanation: 'Reconciliation batches and diffs changes in memory, updating only the elements that actually changed in the browser DOM.'
      },
      {
        id: 'q8',
        questionText: 'When deploying an Express application on Vercel Serverless Functions, what is a key architectural consideration?',
        type: 'single',
        options: [
          'Serverless functions cannot access environment variables',
          'Functions are stateless and should not rely on persistent in-memory global state across requests',
          'All API endpoints must only return XML',
          'The server must maintain a permanent WebSocket connection at all times'
        ],
        correctAnswer: 'Functions are stateless and should not rely on persistent in-memory global state across requests',
        marks: 5,
        explanation: 'Serverless instances spin up on demand and may be destroyed or frozen, so state must be stored in external databases like MongoDB.'
      }
    ]
  },
  {
    _id: 'exam_dsa_202',
    title: 'Data Structures & Algorithms Competency Exam',
    description: 'Comprehensive test covering Big-O analysis, binary trees, dynamic programming, sorting, and graph traversals.',
    category: 'Computer Science',
    durationMinutes: 20,
    passingPercentage: 70,
    isPublished: true,
    createdBy: 'usr_admin_001',
    createdAt: new Date('2025-01-11T14:30:00Z'),
    questions: [
      {
        id: 'q_dsa_1',
        questionText: 'What is the worst-case time complexity of searching for an element in a standard unbalanced Binary Search Tree (BST)?',
        type: 'single',
        options: [
          'O(1)',
          'O(log n)',
          'O(n)',
          'O(n log n)'
        ],
        correctAnswer: 'O(n)',
        marks: 5,
        explanation: 'When an unbalanced BST degenerates into a linear chain (linked list), search degrades to O(n).'
      },
      {
        id: 'q_dsa_2',
        questionText: 'Which data structure is typically used to implement Breadth-First Search (BFS) on a graph?',
        type: 'single',
        options: [
          'Stack (LIFO)',
          'Queue (FIFO)',
          'Binary Heap',
          'Disjoint Set'
        ],
        correctAnswer: 'Queue (FIFO)',
        marks: 5,
        explanation: 'BFS explores neighbor vertices level by level, requiring a FIFO Queue.'
      },
      {
        id: 'q_dsa_3',
        questionText: 'What technique solves complex problems by breaking them down into overlapping subproblems and storing results to prevent redundant calculations?',
        type: 'single',
        options: [
          'Greedy Algorithm',
          'Dynamic Programming (Memoization / Tabulation)',
          'Divide and Conquer with independent subproblems',
          'Backtracking'
        ],
        correctAnswer: 'Dynamic Programming (Memoization / Tabulation)',
        marks: 5,
        explanation: 'Dynamic Programming stores subproblem solutions (memoization or tabulation) to optimize overlapping computation.'
      },
      {
        id: 'q_dsa_4',
        questionText: 'What is the average and worst-case time complexity of QuickSort?',
        type: 'single',
        options: [
          'Average: O(n log n), Worst: O(n log n)',
          'Average: O(n log n), Worst: O(n²)',
          'Average: O(n²), Worst: O(n²)',
          'Average: O(n), Worst: O(n log n)'
        ],
        correctAnswer: 'Average: O(n log n), Worst: O(n²)',
        marks: 5,
        explanation: 'QuickSort runs in O(n log n) on average, but degrades to O(n²) when the pivot choice consistently partitions into 0 and n-1 elements.'
      },
      {
        id: 'q_dsa_5',
        questionText: 'True or False: A hash map with open addressing handles collisions by chaining linked lists at each bucket index.',
        type: 'boolean',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 'False',
        marks: 5,
        explanation: 'Separate chaining uses linked lists. Open addressing probes alternative slots within the array (linear probing, quadratic probing, double hashing).'
      },
      {
        id: 'q_dsa_6',
        questionText: 'Dijkstra’s algorithm finds the shortest path in a weighted graph under which crucial condition?',
        type: 'single',
        options: [
          'All edge weights must be non-negative',
          'The graph must be a Directed Acyclic Graph (DAG)',
          'Every node must have an equal in-degree',
          'Weights must all be powers of 2'
        ],
        correctAnswer: 'All edge weights must be non-negative',
        marks: 5,
        explanation: 'Dijkstra’s greedy approach assumes edge weights are non-negative; negative edge weights require Bellman-Ford.'
      }
    ]
  },
  {
    _id: 'exam_cloud_303',
    title: 'Cloud DevOps & Modern CI/CD Practice',
    description: 'Test your understanding of containerization, serverless functions, Infrastructure as Code, and production reliability.',
    category: 'Cloud & DevOps',
    durationMinutes: 10,
    passingPercentage: 50,
    isPublished: true,
    createdBy: 'usr_admin_001',
    createdAt: new Date('2025-01-12T09:00:00Z'),
    questions: [
      {
        id: 'q_cloud_1',
        questionText: 'In Docker, what is the primary benefit of multi-stage builds?',
        type: 'single',
        options: [
          'Allowing containers to run multiple operating systems concurrently',
          'Drastically reducing the final production image size by separating build tools from runtime',
          'Encrypting Dockerfiles with public key cryptography',
          'Automatically setting up Kubernetes ingress controllers'
        ],
        correctAnswer: 'Drastically reducing the final production image size by separating build tools from runtime',
        marks: 5,
        explanation: 'Multi-stage builds allow compiling in an intermediate container and copying only compiled artifacts to a lean runtime image.'
      },
      {
        id: 'q_cloud_2',
        questionText: 'What HTTP status code is typically returned by an API gateway when a rate limit is exceeded?',
        type: 'single',
        options: [
          '401 Unauthorized',
          '403 Forbidden',
          '429 Too Many Requests',
          '503 Service Unavailable'
        ],
        correctAnswer: '429 Too Many Requests',
        marks: 5,
        explanation: 'HTTP 429 Too Many Requests indicates the user has sent too many requests in a given amount of time.'
      },
      {
        id: 'q_cloud_3',
        questionText: 'True or False: In a blue-green deployment strategy, the new application version is deployed alongside the old version before shifting traffic.',
        type: 'boolean',
        options: [
          'True',
          'False'
        ],
        correctAnswer: 'True',
        marks: 5,
        explanation: 'Blue-green deploys two identical environments. The router shifts production traffic from the active (blue) to the new (green) once verified.'
      },
      {
        id: 'q_cloud_4',
        questionText: 'Which DNS record type maps an alias domain name to another canonical domain name?',
        type: 'single',
        options: [
          'A record',
          'AAAA record',
          'CNAME record',
          'MX record'
        ],
        correctAnswer: 'CNAME record',
        marks: 5,
        explanation: 'CNAME (Canonical Name) records map an alias domain directly to another hostname.'
      }
    ]
  }
];

const seedAttempts = [
  {
    _id: 'att_demo_001',
    examId: 'exam_mern_101',
    examTitle: 'Full-Stack JavaScript & MERN Architecture',
    studentId: 'usr_student_001',
    studentName: 'Alex Student',
    studentEmail: 'student@examsphere.com',
    totalQuestions: 8,
    answeredCount: 8,
    correctCount: 7,
    totalMarks: 40,
    obtainedMarks: 35,
    percentage: 87.5,
    isPassed: true,
    timeTakenSeconds: 520,
    tabSwitchCount: 0,
    submittedAt: new Date('2025-01-15T11:20:00Z'),
    answers: {
      'q1': 'useEffect',
      'q2': 'It passes control to the next middleware function in the stack',
      'q3': '2dsphere Index',
      'q4': 'Timers phase',
      'q5': 'False',
      'q6': 'PUT',
      'q7': 'It computes minimal DOM changes to avoid expensive direct layout recalculations',
      'q8': 'Serverless functions cannot access environment variables' // intentional wrong answer for realism
    }
  }
];

module.exports = {
  seedUsers,
  seedExams,
  seedAttempts
};
