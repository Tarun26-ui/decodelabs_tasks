
#   DecodeLabs | Project 1
#   Rule-Based AI Chatbot

RESPONSES = {
    # ── Greetings ───────
    "hello"        : "Hello! 👋 Welcome to DecodeLabs AI Assistant. How can I help you today?",
    "hi"           : "Hi there! 😊 I'm your DecodeLabs bot. What can I do for you?",
    "hey"          : "Hey! Great to see you. Ask me anything!",
    "good morning" : "Good morning! ☀️ Hope you have a productive day at DecodeLabs!",
    "good afternoon": "Good afternoon! 🌤️ How can I assist you?",
    "good evening" : "Good evening! 🌙 What's on your mind?",

    # ── About ──
    "who are you"  : "I'm a Rule-Based AI Chatbot built for DecodeLabs Project 1. "
                     "I use a dictionary (hash-map) to match your input and return "
                     "a pre-defined response — no machine learning, pure logic! ",
    "what are you" : "I'm an intelligent rule engine — a white-box AI system. "
                     "Every response I give is fully traceable: Input → Logic → Output.",
    "what is your name" : "I don't have a personal name yet — you can call me 'DecodeBot'! 🤖",
    "your name"    : "You can call me DecodeBot — your DecodeLabs AI assistant!",

    # ── DecodeLabs ─────
    "what is decodelabs" : "DecodeLabs is a tech training organisation that helps students "
                            "build real-world AI and software projects through hands-on internships.",
    "about decodelabs"   : "DecodeLabs provides industrial training kits to help interns like you "
                            "master AI, web development, and more through practical projects.",
    "decodelabs"         : "DecodeLabs — where future engineers are built, one project at a time! 🚀",

    # ── AI / Project ────────
    "what is ai"          : "AI stands for Artificial Intelligence — the simulation of human "
                             "intelligence by machines using logic, rules, or learning algorithms.",
    "what is rule based ai": "Rule-Based AI uses explicit if-else / dictionary logic to respond "
                              "to inputs. It is deterministic, traceable, and has zero hallucination risk. ✅",
    "what is machine learning": "Machine Learning is a branch of AI where systems learn patterns "
                                 "from data automatically — the next step after mastering rule-based logic!",
    "what is a chatbot"   : "A chatbot is a program that simulates conversation with users. "
                             "This one uses a knowledge-base dictionary for O(1) speed lookup. ⚡",
    "what is ipo model"   : "IPO stands for Input → Process → Output. It is the foundational "
                             "blueprint of any AI system: sanitize input, match intent, generate response.",
    "what is a hash map"  : "A hash map (Python dictionary) stores key-value pairs and retrieves "
                             "any value in O(1) constant time — far faster than an if-elif ladder O(n).",

    # ── Help ─────────
    "help"          : (
        "Here are some things you can ask me:\n"
        "  • hello / hi / hey\n"
        "  • who are you\n"
        "  • what is AI\n"
        "  • what is rule based AI\n"
        "  • what is machine learning\n"
        "  • what is a chatbot\n"
        "  • what is the IPO model\n"
        "  • what is a hash map\n"
        "  • what is DecodeLabs\n"
        "  • joke / tell me a joke\n"
        "  • what is the time\n"
        "  • bye / exit / quit"
    ),

    # ── Fun / Personality ───
    "joke"          : "Why do programmers prefer dark mode? 🌑 Because light attracts bugs! 😄",
    "tell me a joke": "Why did the AI go to school? 🎓 Because it wanted to improve its learning rate! 😂",
    "are you smart" : "I'm as smart as the rules I'm given! A rule-based bot is only as intelligent "
                      "as its knowledge base. That's why YOU building me matters. 💡",
    "thank you"     : "You're welcome! Keep building, keep learning. 🚀",
    "thanks"        : "Anytime! DecodeLabs is proud of your progress. 💪",

    # ── Farewell (also handled by exit logic) ───
    "bye"           : "Goodbye! 👋 Keep coding and building amazing things at DecodeLabs!",
    "goodbye"       : "Goodbye! 🌟 Remember — every great AI started with a single rule.",
}
#  PHASE 1 : INPUT SANITIZATION
#  Normalize raw text → consistent clean key
def sanitize(raw: str) -> str:
    """Convert raw input to lowercase stripped string."""
    return raw.lower().strip()

#  PHASE 2 : INTENT MATCHING  (Process)
#  O(1) dictionary lookup with graceful fallback
def get_response(clean_input: str) -> str:
    """
    Look up the clean input in the RESPONSES dictionary.
    Falls back to a default message if no match is found.
    """
    # Special dynamic intent: current time
    if "time" in clean_input:
        import datetime
        now = datetime.datetime.now().strftime("%I:%M %p")
        return f"The current time is ⏰ {now}"

    # O(1) hash-map lookup + fallback in one atomic operation
    return RESPONSES.get(clean_input, "🤔 I don't understand that yet. Type 'help' to see what I can do!")


#  PHASE 3 : THE HEARTBEAT — INFINITE LOOP


def run_chatbot():
    """Main chatbot loop — IPO Model in action."""

    print("=" * 55)
    print("   DecodeLabs AI Chatbot  |  Project 1  |  Batch 2026")
    print("=" * 55)
    print("  Type 'help' to see available commands.")
    print("  Type 'exit', 'quit', or 'bye' to end the session.")
    print("-" * 55)

    EXIT_COMMANDS = {"exit", "quit", "bye", "goodbye", "q"}

    # ── THE INFINITE LOOP (Heartbeat) ───
    while True:

        # INPUT — Raw Feed
        raw_input = input("\n  You: ")

        # PROCESS — Sanitization
        clean_input = sanitize(raw_input)

        # Guard: ignore empty input
        if not clean_input:
            print("  Bot: Please type something! (or 'help' for options)")
            continue

        # EXIT STRATEGY — Kill Command
        if clean_input in EXIT_COMMANDS:
            print("\n  Bot:", get_response(clean_input))
            print("\n" + "=" * 55)
            print("  Session ended. See you next time! 🚀")
            print("=" * 55)
            break  # Clean break — terminate the loop

        # OUTPUT — Response Generation
        response = get_response(clean_input)
        print(f"  Bot: {response}")


#  ENTRY POINT

if __name__ == "__main__":
    run_chatbot()
