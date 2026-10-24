// Original explanations and exercises aligned with Sebastián Romero Cruz's
// CS-UY 1114 lecture sequence. See SOURCES.md for inspected source material.
const source =
  "https://github.com/sebastianromerocruz/CS1114-Problem-Solving-And-Programming/tree/main/";

export const topics = [
  {
    id: "variables",
    name: "Variables & data types",
    icon: "Variable",
    description:
      "Give your data a name. Get comfortable with values, types, input, and arithmetic.",
    sourceUrl: `${source}lectures/02-programming-fundamentals-1`,
    lessons: [
      {
        title: "Names refer to values",
        body: "Assignment evaluates the expression on the right, then binds the name on the left to that value. Reassignment changes that binding. Use descriptive names, snake_case, and ALL_CAPS for constants by convention.",
        code: "study_minutes = 25\nstudy_minutes = study_minutes + 5\nprint(study_minutes)  # 30",
      },
      {
        title: "Know the type",
        body: "int represents whole numbers, float represents approximate decimal values, str represents text, and bool represents True or False. Python does not silently concatenate a number with a string. Convert deliberately.",
        code: "print(type(14))        # <class 'int'>\nprint(type(14.0))      # <class 'float'>\nprint(\"Score: \" + str(14))",
      },
      {
        title: "Input starts as text",
        body: 'input() returns a string, even when the user types digits. Use int() or float() before numeric calculations. int("4.5") raises ValueError; int(float("4.5")) is 4.',
        code: "hours = float(input())\nminutes = hours * 60\nprint(minutes)",
      },
      {
        title: "Arithmetic without surprises",
        body: "/ produces a float. // is floor division; % is the remainder. ** is exponentiation. Evaluate parentheses, powers, multiplication/division, then addition/subtraction. Floor division rounds down, including for negative numbers.",
        code: "print(17 / 5)   # 3.4\nprint(17 // 5)  # 3\nprint(17 % 5)   # 2\nprint(-7 // 2)  # -4",
      },
    ],
  },
  {
    id: "booleans",
    name: "Booleans & expressions",
    icon: "ToggleLeft",
    description:
      "Think in True and False. Trace comparisons and combine conditions with confidence.",
    sourceUrl: `${source}lectures/03-programming-fundamentals-2`,
    lessons: [
      {
        title: "Compare, do not assign",
        body: 'Use == to test equality and = to assign. The comparisons !=, <, <=, >, and >= produce Boolean results. Comparisons distinguish values and types: 5 == "5" is False.',
        code: 'score = 85\nprint(score >= 80)  # True\nprint(score == "85")  # False',
      },
      {
        title: "Combine conditions",
        body: "For Boolean operands, and is True when both conditions are True. or is True when at least one is True. not reverses a Boolean value. Write both comparisons explicitly; score == 80 or 90 does not test two scores.",
        code: "has_id = True\nis_registered = False\nprint(has_id and is_registered)  # False\nprint(has_id or is_registered)   # True",
      },
      {
        title: "Trace precedence",
        body: "After arithmetic, evaluate comparisons, then not, then and, then or. Parentheses make your intended grouping clear. and and or short-circuit: Python skips an operand if it already knows the result.",
        code: "print(not 4 < 2 and 8 >= 8 or False)\n# not False and True or False\n# True and True or False\n# True",
      },
    ],
  },
  {
    id: "libraries",
    name: "math & random",
    icon: "Library",
    description:
      "Use Python’s standard library for precise calculations and a little unpredictability.",
    sourceUrl: `${source}lectures/04-math-and-random-modules`,
    lessons: [
      {
        title: "Import a module",
        body: "A module groups reusable functions and values. After import math, access names with math.name. math.pi is a numeric constant, so it has no parentheses. math.sqrt() is a function, so it needs a call.",
        code: 'import math\n\nradius = 3\narea = math.pi * radius ** 2\nprint(f"{area:.2f}")  # 28.27',
      },
      {
        title: "Round in the right direction",
        body: "math.floor() returns the greatest integer less than or equal to its input. math.ceil() returns the least integer greater than or equal to it. They behave differently from int() for negative numbers.",
        code: "import math\nprint(math.floor(2.8))   # 2\nprint(math.ceil(2.2))    # 3\nprint(math.floor(-2.2))  # -3\nprint(int(-2.2))         # -2",
      },
      {
        title: "Mind the endpoints",
        body: "random.random() returns a float from 0.0 inclusive to 1.0 exclusive. random.randint(start, stop) includes both endpoints. random.randrange(start, stop) excludes stop, just like range().",
        code: "import random\n\ndie = random.randint(1, 6)\nsame_choices = random.randrange(1, 7)\nprobability = random.random()",
      },
    ],
  },
  {
    id: "selection",
    name: "Selection statements",
    icon: "GitBranch",
    description:
      "Choose a path with if, elif, and else. Watch boundary values and indentation.",
    sourceUrl: `${source}lectures/05-selection-statements`,
    lessons: [
      {
        title: "Choose one branch",
        body: "An if/elif/else chain tests conditions in order and executes only its first matching branch. else handles every remaining case. Each header ends with a colon and its body is indented.",
        code: 'score = 82\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelse:\n    print("Keep practicing")',
      },
      {
        title: "Separate ifs are independent",
        body: "Two separate if statements can both execute. In a single if/elif chain, at most one branch executes. Pick the structure that matches the problem, and order overlapping conditions carefully.",
        code: 'score = 95\nif score >= 80:\n    print("At least B")\nif score >= 90:\n    print("A")\n# Both lines print.',
      },
      {
        title: "Test the boundaries",
        body: "For a threshold of 18, check 17, 18, and 19. Use chained comparisons for an inclusive interval. Indentation controls which statements belong to a branch; an unindented statement executes after the chain.",
        code: 'age = 18\nif 18 <= age <= 25:\n    print("Eligible")\nprint("Check complete")',
      },
    ],
  },
  {
    id: "loops",
    name: "Repetition structures",
    icon: "Repeat2",
    description:
      "Build counters, accumulate results, and trace for, while, and nested loops.",
    sourceUrl: `${source}lectures/07-for-loop`,
    lessons: [
      {
        title: "Count with range()",
        body: "range(start, stop, step) includes start and excludes stop. The default start is 0 and the default step is 1. A negative step counts down. If the bounds and step do not agree, the loop runs zero times.",
        code: "for number in range(2, 9, 2):\n    print(number)  # 2, 4, 6, 8\n\nfor number in range(3, 0, -1):\n    print(number)  # 3, 2, 1",
      },
      {
        title: "Repeat while a condition holds",
        body: "A while loop checks its condition before every iteration. Initialize the changing state before the loop and update it inside. For sentinel input, stop when the sentinel arrives. The course disallows break; express termination in the condition.",
        code: "number = int(input())\ntotal = 0\nwhile number != 0:\n    total += number\n    number = int(input())\nprint(total)",
      },
      {
        title: "Accumulate and trace",
        body: 'An accumulator keeps a running result. Initialize a sum to 0, a product to 1, and a result string to "". For hand tracing, make a table of the loop variable and accumulator after each iteration.',
        code: "total = 0\nfor number in range(1, 5):\n    total += number\nprint(total)  # 10",
      },
      {
        title: "Nested loops",
        body: "For each outer iteration, the inner loop starts again. Independent loops with 3 outer and 4 inner iterations execute the innermost body 12 times. When bounds depend on the outer value, count each row separately.",
        code: "count = 0\nfor row in range(1, 4):\n    for column in range(row):\n        count += 1\nprint(count)  # 1 + 2 + 3 = 6",
      },
    ],
  },
  {
    id: "strings",
    name: "Strings",
    icon: "TextCursorInput",
    description:
      "Traverse characters, slice sequences, format output, and scan words without split().",
    sourceUrl: `${source}lectures/10-manipulating-strings`,
    lessons: [
      {
        title: "Index and slice",
        body: "Indices start at 0; -1 means the last character. text[start:stop:step] excludes stop. A single invalid index raises IndexError, while slices safely clip to the string bounds. text[::-1] returns a reversed string.",
        code: 'text = "Tandon"\nprint(text[0])    # T\nprint(text[-1])   # n\nprint(text[1:4])  # and\nprint(text[::-1]) # nodnaT',
      },
      {
        title: "Strings do not change in place",
        body: "Strings are immutable. Methods such as upper(), lower(), strip(), and replace() return new strings. To keep the result, assign it. Use in to test membership and len() to find the number of characters.",
        code: 'word = "  nyu  "\nword.upper()\nprint(word)  # unchanged\nword = word.strip().upper()\nprint(word)  # NYU',
      },
      {
        title: "Scan one character at a time",
        body: "The course’s word-scanning review defines a word as a consecutive run of ASCII letters. Track whether the previous character was a letter. A new word starts when the current character is a letter and the previous one was not. Do not use split() for these exercises.",
        code: 'text = "CS1114: study-time"\nin_word = False\nword_count = 0\nfor character in text:\n    is_letter = ("a" <= character <= "z" or "A" <= character <= "Z")\n    if is_letter and not in_word:\n        word_count += 1\n    in_word = is_letter\nprint(word_count)  # 3',
      },
      {
        title: "Format precisely",
        body: "f-strings insert expressions into text. The .2f format displays two decimal places; it does not change the underlying numeric value. ord() gets a Unicode code point and chr() converts a code point to a character.",
        code: 'average = 7 / 3\nprint(f"Average: {average:.2f}")  # Average: 2.33\nprint(ord("A"))  # 65\nprint(chr(66))   # B',
      },
    ],
  },
  {
    id: "functions",
    name: "Functions",
    icon: "Braces",
    description:
      "Break problems into reusable pieces with parameters, return values, and local state.",
    sourceUrl: `${source}lectures/11-functions-parameters`,
    lessons: [
      {
        title: "Define, then call",
        body: "def creates a function; it does not execute the body. A call runs the body. Parameters are names in the definition, while arguments are the values passed by a call. Indent the function body.",
        code: 'def greet(name):\n    print("Hello,", name)\n\ngreet("Violet")  # Hello, Violet',
      },
      {
        title: "Return is different from print",
        body: "print() displays output. return sends a value back to the caller and immediately exits the function. A function that reaches its end without a return value returns None. Returning a value does not display it automatically.",
        code: "def square(number):\n    return number ** 2\n\nresult = square(5)\nprint(result)  # 25",
      },
      {
        title: "Local parameters and defaults",
        body: "Parameters are local names. Reassigning an integer parameter does not reassign the caller’s variable. A default parameter is used when its argument is omitted. Required parameters must come before parameters with defaults.",
        code: "def add_bonus(score, bonus=5):\n    score += bonus\n    return score\n\noriginal = 10\nprint(add_bonus(original))  # 15\nprint(original)            # 10",
      },
      {
        title: "Trace every return path",
        body: "A function with conditional returns may return None when no branch matches. Trace the arguments, local values, and exact return value for each call. A call missing a required argument raises TypeError.",
        code: 'def pass_label(score):\n    if score >= 60:\n        return "Pass"\n\nprint(pass_label(40))  # None',
      },
    ],
  },
];

export const flashcards = [
  {
    id: "v1",
    topic: "variables",
    question: "What type does input() always return?",
    answer:
      "str. Even input that looks numeric is text until you convert it with int() or float().",
  },
  {
    id: "v2",
    topic: "variables",
    question: "What does this print?",
    code: "print(17 // 5, 17 % 5)",
    answer:
      "3 2. Floor division gives the quotient rounded down; modulo gives the remainder.",
  },
  {
    id: "v3",
    topic: "variables",
    question: "What is the difference between 8 / 2 and 8 // 2?",
    answer:
      "8 / 2 is 4.0, a float. 8 // 2 is 4, an int when both operands are ints.",
  },
  {
    id: "v4",
    topic: "variables",
    question: "What does this print?",
    code: "count = 4\nother = count\ncount += 3\nprint(other)",
    answer:
      "4. other still refers to the original integer value. Reassigning count does not reassign other.",
  },
  {
    id: "v5",
    topic: "variables",
    question: 'Does int("3.9") produce 3?',
    answer:
      'No. It raises ValueError. int(float("3.9")) produces 3 by first converting the decimal string to a float.',
  },
  {
    id: "b1",
    topic: "booleans",
    question:
      "Which Boolean operator has the highest precedence: and, or, or not?",
    answer:
      "not, followed by and, followed by or. Comparisons are evaluated before all three.",
  },
  {
    id: "b2",
    topic: "booleans",
    question: "Evaluate this expression.",
    code: "not False and False or True",
    answer:
      "True. First not False becomes True; then True and False becomes False; finally False or True becomes True.",
  },
  {
    id: "b3",
    topic: "booleans",
    question: "How do you check that score is either 80 or 90?",
    answer:
      "score == 80 or score == 90. Writing score == 80 or 90 leaves 90 as a truthy operand instead of comparing it.",
  },
  {
    id: "b4",
    topic: "booleans",
    question: "What does this print?",
    code: 'print(5 == "5", 5 == 5.0)',
    answer:
      "False True. A numeric string differs from a number, but equal integer and float values compare equal.",
  },
  {
    id: "b5",
    topic: "booleans",
    question: "Why does this avoid division by zero?",
    code: "denominator != 0 and 10 / denominator > 2",
    answer:
      "and short-circuits. If the first condition is False, Python does not evaluate the division.",
  },
  {
    id: "m1",
    topic: "libraries",
    question: "Does math.pi need parentheses?",
    answer:
      "No. math.pi is a numeric constant. Function calls such as math.sqrt(9) need parentheses.",
  },
  {
    id: "m2",
    topic: "libraries",
    question: "What are the possible values of random.randrange(2, 6)?",
    answer: "2, 3, 4, or 5. The start is included and the stop is excluded.",
  },
  {
    id: "m3",
    topic: "libraries",
    question: "What are the possible values of random.randint(2, 6)?",
    answer: "2, 3, 4, 5, or 6. Both endpoints are included.",
  },
  {
    id: "m4",
    topic: "libraries",
    question: "What do math.floor(-2.3) and math.ceil(-2.3) return?",
    answer:
      "-3 and -2 respectively. floor moves toward negative infinity; ceil moves toward positive infinity.",
  },
  {
    id: "m5",
    topic: "libraries",
    question: "Can random.random() return 1.0?",
    answer:
      "No. Its interval is 0.0 <= result < 1.0. Zero is possible; one is excluded.",
  },
  {
    id: "s1",
    topic: "selection",
    question: "How many branches of an if/elif/else chain can execute?",
    answer:
      "At most one. Python chooses the first condition that is True, or else if none are True.",
  },
  {
    id: "s2",
    topic: "selection",
    question: "What does this print?",
    code: 'score = 95\nif score >= 80:\n    print("B")\nelif score >= 90:\n    print("A")',
    answer:
      "B. The first condition matches, so the later condition is never tested.",
  },
  {
    id: "s3",
    topic: "selection",
    question: "What is the difference between two if statements and if/elif?",
    answer:
      "Two independent if statements can both execute. An if/elif chain chooses at most one matching branch.",
  },
  {
    id: "s4",
    topic: "selection",
    question: "Which values should you test around a threshold of 18?",
    answer:
      "17, 18, and 19. Testing just below, exactly at, and just above the boundary catches < versus <= errors.",
  },
  {
    id: "s5",
    topic: "selection",
    question: "What does this print?",
    code: 'temperature = 10\nif temperature > 20:\n    print("Warm")\nprint("Done")',
    answer: "Done. The final print is outside the conditional body.",
  },
  {
    id: "l1",
    topic: "loops",
    question: "Which values does range(2, 9, 3) generate?",
    answer:
      "2, 5, 8. The start is included, each next value adds 3, and 9 is excluded.",
  },
  {
    id: "l2",
    topic: "loops",
    question: "What happens in a for loop over range(5, 2)?",
    answer:
      "It executes zero times. The default positive step cannot reach a smaller stop.",
  },
  {
    id: "l3",
    topic: "loops",
    question: "What must usually change inside a while loop?",
    answer:
      "Some state involved in the condition. Without a suitable update, a True condition can stay True forever.",
  },
  {
    id: "l4",
    topic: "loops",
    question: "What is the final value of total?",
    code: "total = 0\nfor number in range(1, 5):\n    total += number",
    answer: "10. The accumulator receives 1 + 2 + 3 + 4.",
  },
  {
    id: "l5",
    topic: "loops",
    question: "How often does the inner body execute?",
    code: 'for row in range(1, 4):\n    for column in range(row):\n        print("*")',
    answer: "6 times: 1 for row 1, 2 for row 2, and 3 for row 3.",
  },
  {
    id: "t1",
    topic: "strings",
    question: "What does this print?",
    code: 'text = "Brooklyn"\nprint(text[1:6:2])',
    answer: "rol. The slice visits indices 1, 3, and 5; index 6 is excluded.",
  },
  {
    id: "t2",
    topic: "strings",
    question: "Does word.upper() change word?",
    answer:
      "No. Strings are immutable. Assign word = word.upper() to retain the returned uppercase string.",
  },
  {
    id: "t3",
    topic: "strings",
    question:
      "What is the difference between text[99] and text[:99] for a short string?",
    answer:
      "text[99] raises IndexError. text[:99] clips to the string’s bounds and returns the available slice.",
  },
  {
    id: "t4",
    topic: "strings",
    question: "What does this print?",
    code: 'amount = 7 / 3\nprint(f"{amount:.2f}")',
    answer:
      "2.33. The format displays exactly two decimal places without changing amount.",
  },
  {
    id: "t5",
    topic: "strings",
    question: "When does a new word start in the course’s ASCII word scanner?",
    answer:
      "When the current character is a letter a–z or A–Z and the previous character was not a letter. Track that state; do not use split().",
  },
  {
    id: "f1",
    topic: "functions",
    question: "Does defining a function execute its body?",
    answer:
      "No. def creates the function. Its body executes when you call it with parentheses.",
  },
  {
    id: "f2",
    topic: "functions",
    question: "What is the difference between a parameter and an argument?",
    answer:
      "A parameter is the local name in a function definition. An argument is the value supplied in a function call.",
  },
  {
    id: "f3",
    topic: "functions",
    question:
      "What does a function return if it reaches its end without return?",
    answer:
      "None. Printing inside a function does not provide a return value to its caller.",
  },
  {
    id: "f4",
    topic: "functions",
    question: "What does this print?",
    code: 'def double(number):\n    return number * 2\n    print("Done")\n\nprint(double(4))',
    answer:
      "8. return immediately exits the function, so the later print never executes.",
  },
  {
    id: "f5",
    topic: "functions",
    question: "What does this print?",
    code: "def bonus(score, extra=5):\n    return score + extra\n\nprint(bonus(10), bonus(10, 2))",
    answer:
      "15 12. The first call uses the default extra value; the second overrides it.",
  },
];

export const challenges = [
  {
    id: "time-converter",
    topic: "variables",
    title: "The study session",
    difficulty: "Easy",
    minutes: 5,
    description:
      "Read a nonnegative integer representing a study session in minutes. Print the number of complete hours and the leftover minutes on one line, separated by a space. Use integer division and modulo. Read input without prompt text so your output matches the examples.",
    concepts: ["int()", "Floor division", "Modulo"],
    starter:
      "total_minutes = int(input())\n\n# Calculate the full hours and remaining minutes.\n",
    solution:
      "total_minutes = int(input())\nhours = total_minutes // 60\nremaining_minutes = total_minutes % 60\nprint(hours, remaining_minutes)",
    hints: [
      "There are 60 minutes in one hour. Which operator gives a whole-number quotient?",
      "Use total_minutes // 60 for hours and total_minutes % 60 for the leftover minutes.",
    ],
    examples: [
      { input: "135", output: "2 15" },
      { input: "60", output: "1 0" },
    ],
    tests: [
      { stdin: "135\n", expected: "2 15" },
      { stdin: "60\n", expected: "1 0" },
      { stdin: "0\n", expected: "0 0" },
      { stdin: "59\n", expected: "0 59" },
      { stdin: "1259\n", expected: "20 59" },
    ],
  },
  {
    id: "access-check",
    topic: "booleans",
    title: "After-hours access",
    difficulty: "Easy",
    minutes: 6,
    description:
      "Read an integer age, then a second line containing yes or no for whether the student has an ID. Print True when the student is at least 18 AND has an ID; otherwise print False. Inputs use lowercase yes or no. Print a Boolean value, with Python’s capitalization.",
    concepts: ["Comparisons", "and", "Boolean values"],
    starter:
      'age = int(input())\nhas_id = input() == "yes"\n\n# Print whether both access conditions hold.\n',
    solution:
      'age = int(input())\nhas_id = input() == "yes"\nprint(age >= 18 and has_id)',
    hints: [
      "Write one expression for the age and another for the ID.",
      "Both conditions must be True, so combine age >= 18 and has_id with and.",
    ],
    examples: [
      { input: "18\nyes", output: "True" },
      { input: "20\nno", output: "False" },
    ],
    tests: [
      { stdin: "18\nyes\n", expected: "True" },
      { stdin: "17\nyes\n", expected: "False" },
      { stdin: "20\nno\n", expected: "False" },
      { stdin: "16\nno\n", expected: "False" },
      { stdin: "25\nyes\n", expected: "True" },
    ],
  },
  {
    id: "circle-area",
    topic: "libraries",
    title: "A little math magic",
    difficulty: "Easy",
    minutes: 6,
    description:
      "Read a nonnegative radius as a float. Import math and calculate the circle’s area using math.pi × radius². Print only the area, formatted to exactly two decimal places. Do not approximate pi by typing 3.14.",
    concepts: ["import math", "math.pi", "f-strings"],
    starter:
      "import math\n\nradius = float(input())\n\n# Calculate and format the area.\n",
    solution:
      'import math\nradius = float(input())\narea = math.pi * radius ** 2\nprint(f"{area:.2f}")',
    hints: [
      "math.pi is a value, not a function; it has no parentheses.",
      'Use radius ** 2 for the square, then f"{area:.2f}" for two decimal places.',
    ],
    examples: [
      { input: "3", output: "28.27" },
      { input: "1.5", output: "7.07" },
    ],
    tests: [
      { stdin: "3\n", expected: "28.27" },
      { stdin: "1.5\n", expected: "7.07" },
      { stdin: "0\n", expected: "0.00" },
      { stdin: "10\n", expected: "314.16" },
      { stdin: "2.25\n", expected: "15.90" },
    ],
  },
  {
    id: "roll-die",
    topic: "libraries",
    title: "Roll for understanding",
    difficulty: "Easy",
    minutes: 6,
    functionName: "roll_die",
    description:
      "Write roll_die(sides), which returns one random integer from 1 through sides, both inclusive. sides is a positive integer. Use random.randint(1, sides). The practice runner seeds Python’s random generator with 42 before each test to make results reproducible; do not seed it inside your function. The displayed examples are those seeded test calls.",
    concepts: ["import random", "Inclusive endpoints", "return"],
    starter:
      "import random\n\ndef roll_die(sides):\n    # Return a random integer, including both endpoints.\n    pass\n",
    solution:
      "import random\n\ndef roll_die(sides):\n    return random.randint(1, sides)",
    hints: [
      "randint includes the upper bound; randrange does not.",
      "Return random.randint(1, sides). Printing a number will not return it to the caller.",
    ],
    examples: [
      { input: "roll_die(6)  # seed 42", output: "6" },
      { input: "roll_die(20)  # seed 42", output: "4" },
    ],
    tests: [
      { args: [6], expected: 6 },
      { args: [20], expected: 4 },
      { args: [1], expected: 1 },
      { args: [100], expected: 82 },
    ],
  },
  {
    id: "grade-classifier",
    topic: "selection",
    title: "Make the grade",
    difficulty: "Easy",
    minutes: 7,
    description:
      "Read an integer score between 0 and 100. Print A for scores at least 90, B for at least 80, C for at least 70, D for at least 60, and F otherwise. Use one if/elif/else chain. Pay special attention to scores exactly at a boundary.",
    concepts: ["if / elif / else", "Thresholds", "Branch order"],
    starter: "score = int(input())\n\n# Check the highest threshold first.\n",
    solution:
      'score = int(input())\nif score >= 90:\n    print("A")\nelif score >= 80:\n    print("B")\nelif score >= 70:\n    print("C")\nelif score >= 60:\n    print("D")\nelse:\n    print("F")',
    hints: [
      "If you test >= 60 first, a score of 95 will match too early.",
      "Order the conditions from 90 down to 60; else catches every score below 60.",
    ],
    examples: [
      { input: "90", output: "A" },
      { input: "79", output: "C" },
    ],
    tests: [
      { stdin: "90\n", expected: "A" },
      { stdin: "89\n", expected: "B" },
      { stdin: "80\n", expected: "B" },
      { stdin: "70\n", expected: "C" },
      { stdin: "69\n", expected: "D" },
      { stdin: "60\n", expected: "D" },
      { stdin: "59\n", expected: "F" },
      { stdin: "0\n", expected: "F" },
      { stdin: "100\n", expected: "A" },
    ],
  },
  {
    id: "sum-multiples",
    topic: "loops",
    title: "A sum worth repeating",
    difficulty: "Medium",
    minutes: 10,
    description:
      "Read a positive integer limit. Print the sum of all numbers from 1 through limit (inclusive) that are divisible by 3 OR by 5. Count numbers divisible by both only once. Use a for loop, a condition, and an accumulator.",
    concepts: ["range()", "Accumulator", "Modulo", "or"],
    starter:
      "limit = int(input())\ntotal = 0\n\n# Visit 1 through limit, including limit.\n\nprint(total)\n",
    solution:
      "limit = int(input())\ntotal = 0\nfor number in range(1, limit + 1):\n    if number % 3 == 0 or number % 5 == 0:\n        total += number\nprint(total)",
    hints: [
      "To include limit, use limit + 1 as the stop in range().",
      "Use one if with or. Two separate if statements would add multiples of 15 twice.",
    ],
    examples: [
      { input: "10", output: "33" },
      { input: "15", output: "60" },
    ],
    tests: [
      { stdin: "10\n", expected: "33" },
      { stdin: "15\n", expected: "60" },
      { stdin: "1\n", expected: "0" },
      { stdin: "3\n", expected: "3" },
      { stdin: "30\n", expected: "225" },
    ],
  },
  {
    id: "sentinel-sum",
    topic: "loops",
    title: "Until zero says stop",
    difficulty: "Medium",
    minutes: 9,
    description:
      "Read one integer per line until the value 0 appears. Print the sum of all earlier values, excluding the sentinel 0. Positive and negative inputs are allowed. A terminating 0 is always supplied. Use a while condition to stop; the course does not allow break.",
    concepts: ["while", "Sentinel input", "Accumulator"],
    starter:
      "total = 0\nnumber = int(input())\n\n# Keep reading while number is not the sentinel.\n\nprint(total)\n",
    solution:
      "total = 0\nnumber = int(input())\nwhile number != 0:\n    total += number\n    number = int(input())\nprint(total)",
    hints: [
      "Test the first input before adding it so an immediate zero works.",
      "Read the next number inside the loop. Otherwise the condition may stay True forever.",
    ],
    examples: [
      { input: "4\n-2\n7\n0", output: "9" },
      { input: "0", output: "0" },
    ],
    tests: [
      { stdin: "4\n-2\n7\n0\n", expected: "9" },
      { stdin: "0\n", expected: "0" },
      { stdin: "-5\n-3\n0\n", expected: "-8" },
      { stdin: "10\n0\n", expected: "10" },
      { stdin: "2\n4\n6\n8\n0\n", expected: "20" },
    ],
  },
  {
    id: "vowel-counter",
    topic: "strings",
    title: "Find your vowels",
    difficulty: "Easy",
    minutes: 7,
    description:
      "Read one line of text. Count the English vowels a, e, i, o, and u, ignoring case. Print only the count. Treat y as a consonant. Traverse the string one character at a time.",
    concepts: ["String traversal", "lower()", "in", "Counter"],
    starter:
      "text = input()\nvowel_count = 0\n\n# Inspect each character.\n\nprint(vowel_count)\n",
    solution:
      'text = input()\nvowel_count = 0\nfor character in text.lower():\n    if character in "aeiou":\n        vowel_count += 1\nprint(vowel_count)',
    hints: [
      "Convert to lowercase once, or lowercase each character.",
      'Membership in "aeiou" tells you whether a character is one of the five vowels.',
    ],
    examples: [
      { input: "NYU Tandon", output: "3" },
      { input: "AEIOU", output: "5" },
    ],
    tests: [
      { stdin: "NYU Tandon\n", expected: "3" },
      { stdin: "AEIOU\n", expected: "5" },
      { stdin: "rhythm\n", expected: "0" },
      { stdin: "\n", expected: "0" },
      { stdin: "Programming is cool!\n", expected: "6" },
    ],
  },
  {
    id: "word-scanner",
    topic: "strings",
    title: "Words between the lines",
    difficulty: "Hard",
    minutes: 15,
    description:
      "Read one line of text and print its number of words. A word is a consecutive run of ASCII letters a–z or A–Z; every digit, space, and punctuation character separates words. Inputs may begin or end with separators. Follow the course review’s rule: do not use split(). Track whether you are currently inside a word.",
    concepts: ["State tracking", "ASCII comparisons", "String scanning"],
    starter:
      "text = input()\nword_count = 0\nin_word = False\n\n# Count transitions from a non-letter to a letter.\n\nprint(word_count)\n",
    solution:
      'text = input()\nword_count = 0\nin_word = False\nfor character in text:\n    is_letter = ("a" <= character <= "z") or ("A" <= character <= "Z")\n    if is_letter and not in_word:\n        word_count += 1\n    in_word = is_letter\nprint(word_count)',
    hints: [
      "A new word begins when the current character is a letter and in_word is False.",
      "Update in_word on every iteration, including when you encounter punctuation. Count word starts so a final word needs no special handling.",
    ],
    examples: [
      { input: "  study--code, repeat! ", output: "3" },
      { input: "lab1114 is-open", output: "3" },
    ],
    tests: [
      { stdin: "  study--code, repeat! \n", expected: "3" },
      { stdin: "lab1114 is-open\n", expected: "3" },
      { stdin: "123--!!\n", expected: "0" },
      { stdin: "one\n", expected: "1" },
      { stdin: "\n", expected: "0" },
      { stdin: "a.B3c_d\n", expected: "4" },
      { stdin: "AKB café\n", expected: "3" },
      { stdin: "K\n", expected: "0" },
    ],
  },
  {
    id: "acronym-builder",
    topic: "strings",
    title: "Say it with initials",
    difficulty: "Hard",
    minutes: 15,
    description:
      "Read one line of text. Build and print an acronym from the first letter of every word, converted to uppercase. A word is a consecutive run of ASCII letters a–z or A–Z, and any non-letter is a separator. Do not use split(). Print an empty line if there are no words.",
    concepts: ["String accumulation", "Word boundaries", "upper()"],
    starter:
      'text = input()\nacronym = ""\nin_word = False\n\n# Add the first letter whenever a new word begins.\n\nprint(acronym)\n',
    solution:
      'text = input()\nacronym = ""\nin_word = False\nfor character in text:\n    is_letter = ("a" <= character <= "z") or ("A" <= character <= "Z")\n    if is_letter and not in_word:\n        acronym += character.upper()\n    in_word = is_letter\nprint(acronym)',
    hints: [
      "Reuse the word-start condition from the word counter.",
      "Instead of adding 1 to a count, append character.upper() to a string accumulator.",
    ],
    examples: [
      { input: "new--york university", output: "NYU" },
      { input: "  read, trace & code! ", output: "RTC" },
    ],
    tests: [
      { stdin: "new--york university\n", expected: "NYU" },
      { stdin: "  read, trace & code! \n", expected: "RTC" },
      { stdin: "cs1114 rocks\n", expected: "CR" },
      { stdin: "123!?\n", expected: "" },
      { stdin: "one\n", expected: "O" },
      { stdin: "AKB café\n", expected: "ABC" },
      { stdin: "K\n", expected: "" },
      { stdin: "\n", expected: "" },
    ],
  },
  {
    id: "temperature-function",
    topic: "functions",
    title: "A change of degrees",
    difficulty: "Easy",
    minutes: 7,
    functionName: "to_celsius",
    description:
      "Write to_celsius(fahrenheit), a function that returns the Celsius equivalent of a numeric Fahrenheit temperature. Use (fahrenheit − 32) × 5 / 9. Return the numeric result; do not print it or round it inside the function. The checker allows a tiny floating-point tolerance.",
    concepts: ["Parameters", "return", "Arithmetic"],
    starter:
      "def to_celsius(fahrenheit):\n    # Calculate and return a numeric value.\n    pass\n",
    solution:
      "def to_celsius(fahrenheit):\n    return (fahrenheit - 32) * 5 / 9",
    hints: [
      "Subtract 32 before multiplying by 5 / 9. Parentheses matter.",
      "Use return, not print. The caller needs a numeric value it can reuse.",
    ],
    examples: [
      { input: "to_celsius(32)", output: "0.0" },
      { input: "to_celsius(212)", output: "100.0" },
    ],
    tests: [
      { args: [32], expected: 0 },
      { args: [212], expected: 100 },
      { args: [-40], expected: -40 },
      { args: [98.6], expected: 37 },
      { args: [50], expected: 10 },
    ],
  },
  {
    id: "count-even-digits",
    topic: "functions",
    title: "Every digit counts",
    difficulty: "Medium",
    minutes: 12,
    functionName: "count_even_digits",
    description:
      "Write count_even_digits(number), which returns the number of even decimal digits in a nonnegative integer. Zero is an even digit: count_even_digits(0) must return 1. Use arithmetic with % and // and a while loop, without converting the number to a string. Do not print the result.",
    concepts: ["Function return", "while", "Digit extraction", "Edge cases"],
    starter:
      "def count_even_digits(number):\n    # Handle zero, then inspect one digit at a time.\n    pass\n",
    solution:
      "def count_even_digits(number):\n    if number == 0:\n        return 1\n    count = 0\n    while number > 0:\n        digit = number % 10\n        if digit % 2 == 0:\n            count += 1\n        number //= 10\n    return count",
    hints: [
      "number % 10 gives the last digit. number //= 10 removes it.",
      "A while number > 0 loop never runs for 0, so handle that input before the loop.",
    ],
    examples: [
      { input: "count_even_digits(2048)", output: "4" },
      { input: "count_even_digits(137)", output: "0" },
    ],
    tests: [
      { args: [2048], expected: 4 },
      { args: [137], expected: 0 },
      { args: [0], expected: 1 },
      { args: [100], expected: 2 },
      { args: [24680], expected: 5 },
      { args: [987654321], expected: 4 },
    ],
  },
];

export const courseSource = {
  title: "CS-UY 1114 course materials",
  author: "Prof. Sebastián Romero Cruz",
  url: "https://github.com/sebastianromerocruz/CS1114-Problem-Solving-And-Programming",
  reviewUrl: `${source}practice/midterm-review`,
  programmingUrl: `${source}practice/midterm-review/word-scanning`,
  inspectedCommit: "2f668e02dd1a719ddee73fe8144d8a4e94cc55b2",
};

// Original hand-tracing drills. Answers are exact stdout with trailing newlines
// removed. Use ERROR / NO OUTPUT for those cases, matching the course review.
export const traces = [
  {
    id: "trace-boolean",
    topic: "booleans",
    title: "Which condition wins?",
    code: 'age = 18\nhas_id = False\nif age >= 18 and has_id:\n    print("enter")\nelse:\n    print("wait")\nprint(not has_id or age < 18)',
    answer: "wait\nTrue",
    explanation:
      "The age comparison is True but has_id is False, so the and expression is False and else prints wait. not has_id is True, so the final or expression is True.",
  },
  {
    id: "trace-math",
    topic: "libraries",
    title: "A matter of precision",
    code: 'import math\n\nvalue = 7 // 2 + math.ceil(2.1)\nprint(value)\nprint(f"{math.sqrt(81):.1f}")',
    answer: "6\n9.0",
    explanation:
      "7 // 2 is 3, and math.ceil(2.1) is 3, making value 6. sqrt(81) is 9.0 and .1f displays one decimal place.",
  },
  {
    id: "trace-selection",
    topic: "selection",
    title: "Two independent decisions",
    code: 'score = 85\nif score >= 80:\n    print("ready")\nif score >= 90:\n    print("excellent")\nelse:\n    print("almost")',
    answer: "ready\nalmost",
    explanation:
      "The first if prints ready. The second if is independent; its condition is False, so its else prints almost. That else belongs to the second if.",
  },
  {
    id: "trace-accumulator",
    topic: "loops",
    title: "Keep a running total",
    code: "total = 0\nfor number in range(1, 8, 2):\n    if number % 3 != 0:\n        total += number\nprint(total, number)",
    answer: "13 7",
    explanation:
      "The loop visits 1, 3, 5, and 7. It skips adding 3, so total is 1 + 5 + 7 = 13. The loop variable remains 7 after the final iteration.",
  },
  {
    id: "trace-nested",
    topic: "loops",
    title: "A loop inside a loop",
    code: "total = 0\nfor row in range(1, 4):\n    for column in range(row):\n        total += row + column\nprint(total)",
    answer: "18",
    explanation:
      "Row 1 adds 1. Row 2 adds 2 + 3 = 5. Row 3 adds 3 + 4 + 5 = 12. The total is 1 + 5 + 12 = 18. The inner loop starts again for each row.",
  },
  {
    id: "trace-strings",
    topic: "strings",
    title: "A slice of Brooklyn",
    code: 'word = "Brooklyn"\nword.upper()\nresult = word[1:6:2]\nprint(result)\nprint(word[-1:-5:-1])',
    answer: "rol\nnylk",
    explanation:
      "upper() returns a new string, but it is not assigned, so word stays Brooklyn. Indices 1, 3, and 5 produce rol. The reverse slice takes indices 7, 6, 5, and 4, producing nylk.",
  },
  {
    id: "trace-return",
    topic: "functions",
    title: "Print or return?",
    code: 'def announce(name):\n    print("Hi", name)\n\ndef boost(score, extra=5):\n    return score + extra\n\nprint(announce("Ada"))\nprint(boost(10), boost(10, 2))',
    answer: "Hi Ada\nNone\n15 12",
    explanation:
      "announce prints Hi Ada, then implicitly returns None; the outer print displays that None. boost uses its default extra of 5 for the first call and the supplied 2 for the second.",
  },
  {
    id: "trace-local",
    topic: "functions",
    title: "Follow the local value",
    code: "score = 10\n\ndef double(score):\n    score *= 2\n    return score\n\nprint(double(score))\nprint(score)",
    answer: "20\n10",
    explanation:
      "The parameter score is local to double. Reassigning it computes 20 inside the function; the original global score stays 10.",
  },
];
