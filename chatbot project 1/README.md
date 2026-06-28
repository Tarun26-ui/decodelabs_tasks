# 🤖 DecodeLabs AI Chatbot — Project 1

> A Rule-Based AI Chatbot built using Python dictionaries (hash-maps) for **O(1) intent matching** — no machine learning, pure logic!

---

## 📌 Project Overview

| Field        | Details                         |
|--------------|----------------------------------|
| **Project**  | DecodeLabs Project 1             |
| **Domain**   | Artificial Intelligence — Control Flow & Logic |
| **Type**     | Rule-Based / White-Box AI        |
| **Language** | Python 3.x                       |
| **Batch**    | 2026                             |

---

## 🧠 How It Works — The IPO Model

```
  Raw Input  →  Sanitize  →  Hash-Map Lookup  →  Response Output
```

1. **Input** — User types a message
2. **Process** — Text is lowercased, stripped, and matched against a dictionary
3. **Output** — A pre-defined response is returned in O(1) constant time

---

## ✨ Features

- ⚡ **O(1) lookup speed** using Python dictionaries (hash-maps)
- 🔤 **Input sanitization** — handles case, whitespace, and empty input
- 🕐 **Dynamic time response** — tells you the current time
- 🧩 **Clean exit logic** — graceful session termination
- 💬 **Personality** — greetings, jokes, and helpful fallback messages
- 🔍 **Fully traceable** — every response has a clear Input → Logic → Output path

---

## 🗂️ Repository Structure

```
decodelabs-chatbot/
│
├── chatbot.py          # Main chatbot script
├── requirements.txt    # Python dependencies (none — stdlib only)
├── .gitignore          # Files to exclude from Git
└── README.md           # Project documentation (you're reading it!)
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.6 or higher

### Run the Chatbot

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/decodelabs-chatbot.git

# Navigate into the project folder
cd decodelabs-chatbot

# Run the chatbot
python chatbot.py
```

---

## 💬 Sample Conversation

```
=======================================================
   DecodeLabs AI Chatbot  |  Project 1  |  Batch 2026
=======================================================
  Type 'help' to see available commands.
  Type 'exit', 'quit', or 'bye' to end the session.
-------------------------------------------------------

  You: hello
  Bot: Hello! 👋 Welcome to DecodeLabs AI Assistant. How can I help you today?

  You: what is ai
  Bot: AI stands for Artificial Intelligence — the simulation of human
       intelligence by machines using logic, rules, or learning algorithms.

  You: what is the time
  Bot: The current time is ⏰ 10:45 AM

  You: joke
  Bot: Why do programmers prefer dark mode? 🌑 Because light attracts bugs! 😄

  You: bye
  Bot: Goodbye! 👋 Keep coding and building amazing things at DecodeLabs!
```

---

## 📚 Topics Covered

- `Rule-Based AI` vs Machine Learning
- Python **dictionaries** as knowledge bases
- **Hash-map** time complexity — O(1) vs O(n)
- **IPO Model** (Input → Process → Output)
- Input **sanitization** and **intent matching**
- Infinite loop with **graceful exit strategy**

---

## 🛠️ Possible Enhancements

- [ ] Add partial/fuzzy keyword matching
- [ ] Expand the knowledge base with more Q&A pairs
- [ ] Add a web UI using Flask
- [ ] Integrate with Telegram or Discord API
- [ ] Export to a JSON knowledge base file

---

## 👨‍💻 Built With

- **Python 3** — Core language
- **`datetime`** — For dynamic time responses
- **Pure stdlib** — Zero external dependencies
