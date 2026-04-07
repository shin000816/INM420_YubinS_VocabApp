
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, ArrowLeft, Flame, Volume2, X } from "lucide-react";
import { Button } from "./components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./components/ui/card";
import { Progress } from "./components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import backgroundImage from "../assets/background.jpeg";

const INITIAL_SAVED_WORD_COUNT = 10;
const DAILY_WORD_TOTAL = 3;
const REMIND_SAVED_TOTAL = 7;
const REMIND_TOTAL = 10;
const EXCLUDED_SEEDED_WORDS = ["Marvel", "Balance"];
const TAB_CONFIG = [
  { id: "today", label: "Today's Progress" },
  { id: "saved", label: "Saved Words" },
  { id: "rank", label: "My Rank" },
];
const SOFT_GLASS_CARD_CLASS = "border-white/25 bg-white/20 backdrop-blur-xl";
const SOFT_GLASS_INNER_CARD_CLASS = "border-white/20 bg-white/20 shadow-none backdrop-blur-xl";
const SOFT_GRADIENT_BADGE_CLASS = "rounded-full bg-gradient-to-r from-violet-100 to-blue-100 px-3 py-1 text-sm font-semibold text-blue-700";
const SOFT_GRADIENT_PILL_CLASS = "inline-flex w-16 items-center justify-center rounded-full bg-gradient-to-r from-violet-100 to-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700";
const NEXT_BUTTON_CLASS = "bg-blue-600 text-white hover:bg-blue-700";

const WORD_LIBRARY = [
  { word: "Resilient", phonetic: "/ri-zil-yuhnt/", definition: "Able to recover quickly after stress, change, or difficulty.", example: "Mina stayed resilient even after a long exam week.", audio: "" },
  { word: "Curate", phonetic: "/kyoo-rayt/", definition: "To carefully select and organize items for a purpose.", example: "Ravi curates a personal word list every weekend.", audio: "" },
  { word: "Vivid", phonetic: "/viv-id/", definition: "Very clear, strong, or full of detail.", example: "The teacher used a vivid story to explain the word.", audio: "" },
  { word: "Reflect", phonetic: "/ri-flekt/", definition: "To think carefully about something.", example: "Take time to reflect on the words you missed today.", audio: "" },
  { word: "Precise", phonetic: "/pri-sahys/", definition: "Exact and accurate with little room for confusion.", example: "A precise definition helps you remember faster.", audio: "" },
  { word: "Journey", phonetic: "/jur-nee/", definition: "The act of traveling from one place to another.", example: "Their journey across the island took all afternoon.", audio: "" },
  { word: "Insight", phonetic: "/in-sahyt/", definition: "A clear understanding of a person or situation.", example: "The article gave us insight into better study habits.", audio: "" },
  { word: "Diligent", phonetic: "/dil-i-juhnt/", definition: "Showing steady and careful effort.", example: "She is diligent about reviewing vocabulary every night.", audio: "" },
  { word: "Budget", phonetic: "/buhj-it/", definition: "A plan for spending and saving money.", example: "He made a budget before booking the trip.", audio: "" },
  { word: "Harmony", phonetic: "/hahr-muh-nee/", definition: "A state of agreement or pleasing arrangement.", example: "The choir sang in perfect harmony during rehearsal.", audio: "" },
  { word: "Thrive", phonetic: "/thrahyv/", definition: "To grow strongly or do well.", example: "Plants thrive with enough sunlight and water.", audio: "" },
  { word: "Curious", phonetic: "/kyoor-ee-uhs/", definition: "Eager to know or learn something.", example: "A curious student usually asks thoughtful questions.", audio: "" },
  { word: "Adapt", phonetic: "/uh-dapt/", definition: "To change in order to fit a new situation.", example: "She learned to adapt quickly to the new schedule.", audio: "" },
  { word: "Steady", phonetic: "/sted-ee/", definition: "Firm, regular, and not changing suddenly.", example: "He made steady progress throughout the semester.", audio: "" },
  { word: "Ambition", phonetic: "/am-bish-uhn/", definition: "A strong desire to achieve something.", example: "Her ambition pushed her to practice every day.", audio: "" },
  { word: "Balance", phonetic: "/bal-uhns/", definition: "A state where different elements are in the correct proportions.", example: "A healthy balance between study and rest matters.", audio: "" },
  { word: "Capture", phonetic: "/kap-cher/", definition: "To take hold of or record something.", example: "The camera captured the sunset beautifully.", audio: "" },
  { word: "Delicate", phonetic: "/del-i-kit/", definition: "Easily broken or damaged; fine in texture.", example: "She wrapped the delicate glass carefully.", audio: "" },
  { word: "Elevate", phonetic: "/el-uh-veyt/", definition: "To raise something to a higher level.", example: "Good feedback can elevate your writing.", audio: "" },
  { word: "Flexible", phonetic: "/flek-suh-buhl/", definition: "Able to change or be changed easily.", example: "A flexible plan helped the team adjust.", audio: "" },
  { word: "Genuine", phonetic: "/jen-yoo-in/", definition: "Truly what something is said to be; sincere.", example: "He gave a genuine apology.", audio: "" },
  { word: "Hesitate", phonetic: "/hez-i-teyt/", definition: "To pause before saying or doing something.", example: "Do not hesitate to ask questions in class.", audio: "" },
  { word: "Immerse", phonetic: "/ih-murs/", definition: "To involve yourself deeply in a particular activity.", example: "She likes to immerse herself in novels.", audio: "" },
  { word: "Justice", phonetic: "/juhs-tis/", definition: "Fair treatment or behavior.", example: "The campaign focused on justice and equality.", audio: "" },
  { word: "Keen", phonetic: "/keen/", definition: "Very eager or strongly interested.", example: "He is keen to improve his vocabulary.", audio: "" },
  { word: "Linger", phonetic: "/ling-ger/", definition: "To stay somewhere longer than necessary.", example: "The scent of coffee lingered in the room.", audio: "" },
  { word: "Modest", phonetic: "/mod-ist/", definition: "Not large, elaborate, or expensive; humble.", example: "They lived in a modest apartment downtown.", audio: "" },
  { word: "Nurture", phonetic: "/nur-cher/", definition: "To care for and encourage the growth of something.", example: "Teachers nurture curiosity in young learners.", audio: "" },
  { word: "Observe", phonetic: "/uhb-zurv/", definition: "To notice or watch something carefully.", example: "Observe how the meaning changes with context.", audio: "" },
  { word: "Pioneer", phonetic: "/pahy-uh-neer/", definition: "A person who is among the first to explore or develop something.", example: "She became a pioneer in clean energy research.", audio: "" },
  { word: "Quality", phonetic: "/kwol-i-tee/", definition: "How good or bad something is.", example: "The quality of the recording was excellent.", audio: "" },
  { word: "Refine", phonetic: "/ri-fahyn/", definition: "To improve something by making small changes.", example: "He refined the design after user testing.", audio: "" },
  { word: "Sincere", phonetic: "/sin-seer/", definition: "Free from pretense or deceit; honest.", example: "Her sincere smile made everyone comfortable.", audio: "" },
  { word: "Transform", phonetic: "/trans-fawrm/", definition: "To change completely in form or appearance.", example: "Daily habits can transform your progress.", audio: "" },
  { word: "Unique", phonetic: "/yoo-neek/", definition: "Being the only one of its kind.", example: "Each artist brought a unique style to the exhibit.", audio: "" },
  { word: "Venture", phonetic: "/ven-cher/", definition: "A risky or daring journey or undertaking.", example: "Starting the club was a bold venture.", audio: "" },
  { word: "Wisdom", phonetic: "/wiz-duhm/", definition: "The ability to make good judgments.", example: "Grandparents often share wisdom from experience.", audio: "" },
  { word: "Yearn", phonetic: "/yurn/", definition: "To have a strong desire for something.", example: "She yearned for a quiet weekend at home.", audio: "" },
  { word: "Zealous", phonetic: "/zel-uhs/", definition: "Showing great energy or enthusiasm.", example: "The zealous volunteers arrived before sunrise.", audio: "" },
  { word: "Assure", phonetic: "/uh-shoor/", definition: "To tell someone something confidently to remove doubt.", example: "I assure you the plan is on track.", audio: "" },
  { word: "Bloom", phonetic: "/bloom/", definition: "To produce flowers or to flourish.", example: "The garden begins to bloom in April.", audio: "" },
  { word: "Compose", phonetic: "/kuhm-pohz/", definition: "To create or put together.", example: "She took a moment to compose her thoughts.", audio: "" },
  { word: "Dedicate", phonetic: "/ded-i-keyt/", definition: "To give time or effort to something fully.", example: "He dedicated the summer to learning French.", audio: "" },
  { word: "Essence", phonetic: "/es-uhns/", definition: "The basic nature of something.", example: "The short summary captured the essence of the story.", audio: "" },
  { word: "Foster", phonetic: "/fos-ter/", definition: "To encourage the development of something.", example: "Group work can foster collaboration.", audio: "" },
  { word: "Glance", phonetic: "/glans/", definition: "A quick or brief look.", example: "She took a glance at the clock.", audio: "" },
  { word: "Honor", phonetic: "/on-er/", definition: "High respect or great esteem.", example: "It was an honor to present the award.", audio: "" },
  { word: "Invent", phonetic: "/in-vent/", definition: "To create something new.", example: "They hope to invent a better battery.", audio: "" },
  { word: "Marvel", phonetic: "/mahr-vuhl/", definition: "To feel amazed by something.", example: "We marveled at the size of the waterfall.", audio: "" },
  { word: "Notice", phonetic: "/noh-tis/", definition: "To see or become aware of something.", example: "Did you notice the change in tone?", audio: "" },
  { word: "Prosper", phonetic: "/pros-per/", definition: "To succeed or thrive.", example: "Small businesses prosper when communities support them.", audio: "" },
  { word: "Restore", phonetic: "/ri-stawr/", definition: "To bring back to an earlier or better condition.", example: "They worked to restore the old library.", audio: "" },
];

function normalizeWord(value) {
  return value.trim().toLowerCase();
}

function shuffleArray(items) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function hasWord(cards, word) {
  return cards.some((item) => normalizeWord(item.word) === normalizeWord(word));
}

function mergeUniqueWords(existingCards, nextCards) {
  const merged = [...existingCards];
  for (const card of nextCards) {
    if (!card?.word) continue;
    if (hasWord(merged, card.word)) continue;
    merged.push(card);
  }
  return merged;
}

function getLibraryWords(excludedWords = []) {
  const excludedSet = new Set(excludedWords.map((word) => normalizeWord(word)));
  return WORD_LIBRARY.filter((card) => !excludedSet.has(normalizeWord(card.word)));
}

function fetchRandomWordCards(count, excludedWords = []) {
  return shuffleArray(getLibraryWords(excludedWords)).slice(0, count);
}

function getDefinitionForWord(word, cards = WORD_LIBRARY) {
  return cards.find((item) => normalizeWord(item.word) === normalizeWord(word))?.definition || "";
}

function buildChoices(answerCard, distractorPool) {
  const normalizedAnswer = normalizeWord(answerCard.word);
  const distractors = shuffleArray(distractorPool)
    .filter((item) => normalizeWord(item.word) !== normalizedAnswer)
    .slice(0, 2);
  return shuffleArray([answerCard.word, ...distractors.map((item) => item.word)]);
}

function getInitialSavedWords() {
  const fallback = fetchRandomWordCards(INITIAL_SAVED_WORD_COUNT, EXCLUDED_SEEDED_WORDS);

  try {
    const raw = localStorage.getItem("pineapple-saved-words");
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return fallback;

    const sanitized = parsed.filter(
      (card) =>
        card &&
        typeof card.word === "string" &&
        typeof card.phonetic === "string" &&
        typeof card.definition === "string" &&
        typeof card.example === "string" &&
        typeof card.audio === "string",
    );

    return mergeUniqueWords([], sanitized);

    return fallback;
  } catch {
    return fallback;
  }
}

function getInitialStreak() {
  const today = new Date().toDateString();
  const fallback = { count: 7, lastVisit: today };

  try {
    const raw = localStorage.getItem("pineapple-streak");
    if (!raw) return fallback;

    const parsed = JSON.parse(raw);
    if (typeof parsed?.count !== "number" || typeof parsed?.lastVisit !== "string") {
      return fallback;
    }

    return parsed;
  } catch {
    return fallback;
  }
}

function completeDailyStreak(previous) {
  const today = new Date().toDateString();
  if (previous?.lastVisit === today) {
    return previous;
  }

  return {
    count: typeof previous?.count === "number" ? previous.count + 1 : 8,
    lastVisit: today,
  };
}

function buildLeaderboard(userName, streakCount) {
  const players = [
    { name: "Mina", streak: 19 },
    { name: "Jules", streak: 15 },
    { name: "Sam", streak: 12 },
    { name: userName, streak: streakCount, isUser: true },
    { name: "Rina", streak: 9 },
    { name: "Owen", streak: 7 },
  ];
  return players.sort((a, b) => b.streak - a.streak).map((player, index) => ({ ...player, rank: index + 1 }));
}

function getProgressState(completedSteps) {
  return {
    completed: completedSteps,
    total: DAILY_WORD_TOTAL,
    percent: (completedSteps / DAILY_WORD_TOTAL) * 100,
  };
}

function getEmptyQuizState() {
  return {
    currentWord: null,
    choices: [],
    choice: "",
    wrongChoices: [],
    unlocked: false,
    showBack: false,
    error: "",
    index: 0,
    completed: 0,
  };
}

function createQuizState(word, choices, overrides = {}) {
  return {
    currentWord: word,
    choices,
    choice: "",
    wrongChoices: [],
    unlocked: false,
    showBack: false,
    error: "",
    index: 0,
    completed: 0,
    ...overrides,
  };
}

function getChoiceClassName({ choice, selectedChoice, wrongChoices, correctChoice, isUnlocked }) {
  const isSelected = selectedChoice === choice;
  const isWrong = wrongChoices.includes(choice);
  const isCorrect = isUnlocked && choice === correctChoice;

  return `h-auto min-h-12 justify-start whitespace-normal text-left ${
    isSelected ? "bg-slate-100" : "bg-white"
  } ${isWrong ? "border-red-400 text-red-700" : ""} ${isCorrect ? "border-emerald-400 text-emerald-700" : ""}`;
}
function QuizCard({
  title,
  description,
  currentWord,
  choices,
  selectedChoice,
  wrongChoices,
  unlocked,
  showBack,
  error,
  selectedWrongDefinition,
  onBack,
  onChoice,
  onPlayAudio,
  onSaveWord,
  onNext,
  isSaved,
  nextLabel,
}) {
  return (
    <Card className="min-h-0 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
      <CardHeader className="px-[35px] pb-[22px] pt-[10px]">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Button variant="ghost" size="sm" className="-ml-2 mb-6" onClick={onBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription className="mt-1 text-[11px]">{description}</CardDescription>
          </div>
          {unlocked && currentWord ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSaveWord(currentWord)}
              className={isSaved ? "text-emerald-600 hover:text-emerald-700" : ""}
            >
              {isSaved ? "Saved" : "Save word"}
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-2 overflow-visible lg:flex lg:flex-1 lg:flex-col">
        <AnimatePresence mode="wait">
          {currentWord && showBack ? (
            <motion.div
              key={`${currentWord.word}-back`}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="min-h-[180px] rounded-3xl border border-white/15 bg-gradient-to-br from-violet-700 via-indigo-600 to-blue-700 p-4 text-white"
              style={{ transformStyle: "preserve-3d" }}
            >
              <div className="flex h-full flex-col gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Pronunciation</p>
                  <h3 className="mt-2.5 text-2xl font-bold">{currentWord.word}</h3>
                  <p className="mt-2 text-base text-slate-200">{currentWord.phonetic}</p>
                </div>
                <div className="flex h-full flex-col">
                  <p className="text-sm leading-6 text-slate-200">{currentWord.example}</p>
                  <div className="mt-auto pt-4 flex flex-wrap gap-2">
                    <Button variant="secondary" onClick={() => onPlayAudio(currentWord)}>
                      <Volume2 className="mr-2 h-4 w-4" />
                      Play audio
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`${currentWord?.word || "loading"}-front`}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.45 }}
              className={`min-h-[192px] rounded-3xl border p-4 ${SOFT_GLASS_CARD_CLASS}`}
            >
              {currentWord ? (
                <div className="space-y-2.5">
                  <div className="rounded-2xl border border-white/20 bg-white/20 p-3 backdrop-blur-md">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Definition clue</p>
                    <h3 className="mt-2 text-base font-semibold leading-6">{currentWord.definition}</h3>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {choices.map((choice) => (
                      <Button
                        key={`${currentWord.word}-${choice}`}
                        variant="outline"
                        className={getChoiceClassName({
                          choice,
                          selectedChoice,
                          wrongChoices,
                          correctChoice: currentWord.word,
                          isUnlocked: unlocked,
                        })}
                        onClick={() => onChoice(choice)}
                      >
                        {choice}
                      </Button>
                    ))}
                  </div>
                  {!unlocked && selectedWrongDefinition ? (
                    <div className="rounded-xl border border-red-300/80 bg-white/20 px-3 py-3 text-sm text-red-700 backdrop-blur-md">
                      <p className="font-semibold">Meaning of "{selectedChoice}"</p>
                      <p className="mt-1 leading-6">{selectedWrongDefinition}</p>
                    </div>
                  ) : null}
                  {error ? <p className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-700">{error}</p> : null}
                </div>
              ) : (
                <div className="flex min-h-[212px] items-center justify-center text-center">
                  {error ? (
                    <p className="rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-700">{error}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">Quiz will appear once enough words are loaded.</p>
                  )}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {showBack ? (
          <div className="flex w-full items-center justify-end">
            <Button className={NEXT_BUTTON_CLASS} onClick={onNext}>
              {nextLabel}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState("today");
  const [savedWords, setSavedWords] = useState(getInitialSavedWords);
  const [streak, setStreak] = useState(getInitialStreak);
  const userName = "Yubin";
  const [viewMode, setViewMode] = useState("home");
  const [showCongrats, setShowCongrats] = useState(false);
  const [remindResultsOpen, setRemindResultsOpen] = useState(false);
  const [todayWordsUsed, setTodayWordsUsed] = useState([]);
  const [todayQuiz, setTodayQuiz] = useState(getEmptyQuizState);
  const [remindWords, setRemindWords] = useState([]);
  const [remindPool, setRemindPool] = useState([]);
  const [remindQuiz, setRemindQuiz] = useState(getEmptyQuizState);
  const [remindResults, setRemindResults] = useState({ firstTry: [], corrected: [] });

  useEffect(() => {
    localStorage.setItem("pineapple-saved-words", JSON.stringify(savedWords));
  }, [savedWords]);

  useEffect(() => {
    localStorage.setItem("pineapple-streak", JSON.stringify(streak));
  }, [streak]);

  const progress = useMemo(() => getProgressState(todayQuiz.completed), [todayQuiz.completed]);
  const leaderboard = useMemo(() => buildLeaderboard(userName, streak.count), [userName, streak.count]);
  const userRank = leaderboard.find((player) => player.isUser);
  const todayWordSaved = Boolean(todayQuiz.currentWord && hasWord(savedWords, todayQuiz.currentWord.word));
  const remindWordSaved = Boolean(remindQuiz.currentWord && hasWord(savedWords, remindQuiz.currentWord.word));

  const todayWrongDefinition = useMemo(() => {
    if (!todayQuiz.choice || todayQuiz.unlocked) return "";
    return getDefinitionForWord(todayQuiz.choice);
  }, [todayQuiz.choice, todayQuiz.unlocked]);

  const remindWrongDefinition = useMemo(() => {
    if (!remindQuiz.choice || remindQuiz.unlocked) return "";
    return getDefinitionForWord(remindQuiz.choice, remindPool.length ? remindPool : WORD_LIBRARY);
  }, [remindPool, remindQuiz.choice, remindQuiz.unlocked]);
  function speakWord(word) {
    if (!("speechSynthesis" in window)) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function handlePlayAudio(card) {
    if (!card) return;
    if (card.audio) {
      const audio = new Audio(card.audio);
      audio.play().catch(() => speakWord(card.word));
      return;
    }
    speakWord(card.word);
  }

  function handleSaveWord(card) {
    if (!card) return;
    setSavedWords((previous) => {
      const withoutDuplicate = previous.filter((item) => normalizeWord(item.word) !== normalizeWord(card.word));
      return [card, ...withoutDuplicate];
    });
  }

  function handleUnsaveWord(word) {
    if (!word) return;
    setSavedWords((previous) => previous.filter((item) => normalizeWord(item.word) !== normalizeWord(word)));
  }

  function getChoicePool(excludedWords = []) {
    const savedPool = savedWords.filter((item) => !excludedWords.includes(normalizeWord(item.word)));
    const libraryPool = getLibraryWords(excludedWords);
    return mergeUniqueWords(savedPool, libraryPool).slice(0, 6);
  }

  function loadNextTodayWord() {
    const exclusions = [...savedWords.map((item) => item.word), ...todayWordsUsed.map((item) => item.word)];
    const [nextWord] = fetchRandomWordCards(1, exclusions);
    if (!nextWord) {
      setTodayQuiz((previous) => ({ ...previous, currentWord: null, choices: [], error: "No more available words right now." }));
      return;
    }

    const distractorPool = getChoicePool([normalizeWord(nextWord.word), ...exclusions.map((word) => normalizeWord(word))]);
      setTodayQuiz((previous) => ({
        ...previous,
        currentWord: nextWord,
        choices: buildChoices(nextWord, distractorPool),
        choice: "",
        wrongChoices: [],
        unlocked: false,
        showBack: false,
        error: "",
      }));

    setTodayWordsUsed((previous) => {
      if (hasWord(previous, nextWord.word)) return previous;
      return [...previous, nextWord];
    });
  }

  function startTodayQuiz() {
    setViewMode("todayQuiz");
    if (todayQuiz.currentWord) return;
    loadNextTodayWord();
  }

  function resetTodayFlow() {
    setViewMode("home");
    setShowCongrats(false);
    setTodayWordsUsed([]);
    setTodayQuiz(getEmptyQuizState());
  }

  function handleTodaySelection(choice) {
    if (!todayQuiz.currentWord) return;

    setTodayQuiz((previous) => {
      const isCorrect = choice === previous.currentWord.word;
      return {
        ...previous,
        choice,
        wrongChoices: isCorrect
          ? previous.wrongChoices
          : previous.wrongChoices.includes(choice)
            ? previous.wrongChoices
            : [...previous.wrongChoices, choice],
        unlocked: isCorrect,
      };
    });

    if (choice === todayQuiz.currentWord.word) {
      window.setTimeout(() => {
        setTodayQuiz((previous) => ({ ...previous, showBack: true }));
      }, 180);
    }
  }

  function handleNextTodayWord() {
    if (!todayQuiz.showBack) return;

    const nextCompleted = Math.min(todayQuiz.completed + 1, DAILY_WORD_TOTAL);

    if (nextCompleted === DAILY_WORD_TOTAL) {
      setStreak((previous) => completeDailyStreak(previous));
      setTodayQuiz((previous) => ({
        ...previous,
        completed: nextCompleted,
        index: DAILY_WORD_TOTAL,
        currentWord: null,
        choices: [],
        choice: "",
        wrongChoices: [],
        unlocked: false,
        showBack: false,
      }));
      setViewMode("home");
      setShowCongrats(true);
      return;
    }

    setTodayQuiz((previous) => ({
      ...previous,
      completed: nextCompleted,
      index: previous.index + 1,
    }));

    loadNextTodayWord();
  }

  function startRemindQuiz() {
    setViewMode("remindQuiz");
    setRemindResultsOpen(false);

    const baseTodayWords = [...todayWordsUsed];
    const todayExclusions = [...savedWords.map((item) => item.word), ...baseTodayWords.map((item) => item.word)];

    let todaySection = [...baseTodayWords];
    if (todaySection.length < DAILY_WORD_TOTAL) {
      const extraToday = fetchRandomWordCards(DAILY_WORD_TOTAL - todaySection.length, todayExclusions);
      todaySection = [...todaySection, ...extraToday].slice(0, DAILY_WORD_TOTAL);
      setTodayWordsUsed((previous) => mergeUniqueWords(previous, extraToday));
    }

    const savedSection = shuffleArray(savedWords.filter((item) => !hasWord(todaySection, item.word))).slice(0, REMIND_SAVED_TOTAL);
    const combined = shuffleArray([...savedSection, ...todaySection]).slice(0, REMIND_TOTAL);
    if (!combined.length) {
      setViewMode("home");
      return;
    }

    const distractorPool = mergeUniqueWords(
      [...savedWords, ...todaySection],
      getLibraryWords(combined.map((card) => card.word)),
    );

    setRemindWords(combined);
    setRemindPool(distractorPool);
    setRemindResults({ firstTry: [], corrected: [] });

    const firstWord = combined[0];
    setRemindQuiz(createQuizState(firstWord, buildChoices(firstWord, distractorPool)));
  }

  function handleRemindSelection(choice) {
    if (!remindQuiz.currentWord) return;

    setRemindQuiz((previous) => {
      const isCorrect = choice === previous.currentWord.word;
      return {
        ...previous,
        choice,
        wrongChoices: isCorrect
          ? previous.wrongChoices
          : previous.wrongChoices.includes(choice)
            ? previous.wrongChoices
            : [...previous.wrongChoices, choice],
        unlocked: isCorrect,
      };
    });

    if (choice === remindQuiz.currentWord.word) {
      const currentWord = remindQuiz.currentWord;
      const wrongAttempted = remindQuiz.wrongChoices.length > 0;
      setRemindResults((previous) => ({
        firstTry: wrongAttempted ? previous.firstTry : [...previous.firstTry, currentWord.word],
        corrected: wrongAttempted ? [...previous.corrected, currentWord.word] : previous.corrected,
      }));

      window.setTimeout(() => {
        setRemindQuiz((previous) => ({ ...previous, showBack: true }));
      }, 180);
    }
  }

  function handleNextRemindWord() {
    if (!remindQuiz.showBack) return;

    const nextIndex = remindQuiz.index + 1;
    if (nextIndex >= remindWords.length) {
      setViewMode("home");
      setRemindResultsOpen(true);
      return;
    }

    const nextWord = remindWords[nextIndex];
    setRemindQuiz(createQuizState(nextWord, buildChoices(nextWord, remindPool), { index: nextIndex, completed: nextIndex }));
  }

  return (
    <main
      className="grid min-h-screen overflow-y-auto bg-cover bg-center bg-no-repeat px-2 py-3 sm:px-5 sm:py-6 lg:h-screen lg:overflow-hidden lg:place-items-center lg:px-10 lg:py-10"
      style={{ backgroundImage: `linear-gradient(135deg, rgba(243, 240, 255, 0.58), rgba(235, 244, 255, 0.7)), url(${backgroundImage})` }}
    >
      <div className="mx-auto flex min-h-[88vh] w-full items-start justify-center lg:h-[80vh] lg:min-h-0 lg:max-h-[722px] lg:items-center lg:max-w-[1200px]">
        <Card
          className="relative min-h-[88vh] w-full border-white/30 bg-white/20 shadow-2xl backdrop-blur-2xl lg:h-[80vh] lg:min-h-0 lg:max-h-[722px] lg:overflow-hidden"
          style={{
            boxShadow: "0 24px 80px rgba(99, 102, 241, 0.18)",
          }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.16) 0%, rgba(233,225,255,0.14) 38%, rgba(219,234,254,0.08) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-32"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.16) 0%, rgba(224,231,255,0.05) 100%)",
            }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-16 top-10 h-48 w-48 rounded-full blur-3xl"
            style={{ background: "rgba(255,255,255,0.1)" }}
          />
          <CardContent className="relative z-10 flex min-h-[88vh] flex-col justify-center p-3 sm:p-6 lg:h-full lg:min-h-0 lg:justify-start lg:p-10">
            <header className="border-b border-white/30 pb-5 lg:pb-7">
              <div className="flex flex-col gap-4 lg:mx-auto lg:w-full">
                <div>
                  <p className="text-[20px] text-muted-foreground">Welcome back,</p>
                  <h1
                    className="mt-1 inline-block bg-gradient-to-r from-violet-700 via-indigo-500 to-blue-600 bg-clip-text text-[48px] font-bold tracking-tight text-transparent"
                    style={{ WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                  >
                    {userName}
                  </h1>
                </div>
              </div>
            </header>

            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                setActiveTab(value);
                if (value !== "today") setViewMode("home");
              }}
              className="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col"
            >
              <TabsList>
                {TAB_CONFIG.map((tab) => (
                  <TabsTrigger key={tab.id} value={tab.id}>
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="today" className="lg:min-h-0 lg:flex-1 lg:overflow-hidden">
                {viewMode === "home" ? (
                  <div className="space-y-5 lg:mx-auto lg:flex lg:h-full lg:w-full lg:flex-col lg:justify-center lg:gap-8 lg:space-y-0">
                    <div className="w-full">
                      <div className="inline-flex items-center gap-2 rounded-full border border-pink-300/45 bg-gradient-to-br from-pink-400/20 via-rose-300/18 to-violet-200/14 px-5 py-1.5 shadow-sm backdrop-blur-xl">
                        <span className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Day streak</span>
                        <span className="flex items-center gap-0.5 text-base font-bold text-slate-900">
                          <Flame className="h-5 w-5 text-orange-500" />
                          {streak.count}
                        </span>
                      </div>
                    </div>
                    <Card className="border-white/30 bg-white/20 backdrop-blur-xl lg:mx-auto lg:w-full">
                      <CardHeader className="pb-0">
                        <div className="flex items-end justify-between gap-3">
                          <div className="space-y-4">
                            <CardTitle>Today's Progress</CardTitle>
                            <CardDescription>{progress.completed}/{progress.total} steps completed today</CardDescription>
                          </div>
                          <Button className="self-start text-blue-600 hover:text-blue-700" variant="ghost" size="sm" onClick={resetTodayFlow}>
                            Reset
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="flex min-h-[112px] flex-col justify-center pb-0">
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="font-semibold text-slate-900">Word quiz progress</span>
                            <span className="text-slate-600">
                              {progress.completed}/{progress.total}
                            </span>
                          </div>
                          <Progress value={progress.percent} />
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex w-full flex-col items-center gap-3">
                      <Button className="h-12 w-full rounded-[5px] bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/20 hover:from-violet-600/90 hover:to-blue-600/90" onClick={startTodayQuiz}>
                        Today's Words
                      </Button>
                      <Button className="h-12 w-full rounded-[5px] border border-violet-200/60 bg-gradient-to-r from-violet-500/12 to-blue-500/12 text-slate-900 hover:from-violet-500/18 hover:to-blue-500/18" variant="secondary" onClick={startRemindQuiz}>
                        Remind Quiz
                      </Button>
                    </div>
                  </div>
                ) : null}

                {viewMode === "todayQuiz" ? (
                  <QuizCard
                    title="Today's Word"
                    description={`Word ${Math.min(todayQuiz.index + 1, DAILY_WORD_TOTAL)} of ${DAILY_WORD_TOTAL}`}
                    currentWord={todayQuiz.currentWord}
                    choices={todayQuiz.choices}
                    selectedChoice={todayQuiz.choice}
                    wrongChoices={todayQuiz.wrongChoices}
                    unlocked={todayQuiz.unlocked}
                    showBack={todayQuiz.showBack}
                    error={todayQuiz.error}
                    selectedWrongDefinition={todayWrongDefinition}
                    onBack={() => setViewMode("home")}
                    onChoice={handleTodaySelection}
                    onPlayAudio={handlePlayAudio}
                    onSaveWord={handleSaveWord}
                    onNext={handleNextTodayWord}
                    isSaved={todayWordSaved}
                    nextLabel={todayQuiz.index === DAILY_WORD_TOTAL - 1 ? "Finish set" : "Next"}
                  />
                ) : null}

                {viewMode === "remindQuiz" ? (
                  <QuizCard
                    title="Remind Quiz"
                    description={`Word ${remindQuiz.index + 1} of ${remindWords.length || REMIND_TOTAL}`}
                    currentWord={remindQuiz.currentWord}
                    choices={remindQuiz.choices}
                    selectedChoice={remindQuiz.choice}
                    wrongChoices={remindQuiz.wrongChoices}
                    unlocked={remindQuiz.unlocked}
                    showBack={remindQuiz.showBack}
                    error={remindQuiz.error}
                    selectedWrongDefinition={remindWrongDefinition}
                    onBack={() => setViewMode("home")}
                    onChoice={handleRemindSelection}
                    onPlayAudio={handlePlayAudio}
                    onSaveWord={handleSaveWord}
                    onNext={handleNextRemindWord}
                    isSaved={remindWordSaved}
                    nextLabel={remindQuiz.index === remindWords.length - 1 ? "Finish quiz" : "Next"}
                  />
                ) : null}

                <AnimatePresence>
                  {showCongrats ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
                    >
                      <motion.div
                        initial={{ y: 24, opacity: 0, scale: 0.96 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 12, opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.22 }}
                        className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-primary">Daily complete</p>
                            <h3 className="mt-2 text-2xl font-bold">Congrats!</h3>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setShowCongrats(false)} aria-label="Close congratulations">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="mt-4 text-sm leading-7 text-slate-600">
                          Day {streak.count} streak. You completed all 3 words for today! See you tomorrow.
                        </p>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>

                <AnimatePresence>
                  {remindResultsOpen ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
                    >
                      <motion.div
                        initial={{ y: 24, opacity: 0, scale: 0.96 }}
                        animate={{ y: 0, opacity: 1, scale: 1 }}
                        exit={{ y: 12, opacity: 0, scale: 0.96 }}
                        transition={{ duration: 0.22 }}
                        className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-medium text-primary">Remind quiz complete</p>
                            <h3 className="mt-2 text-2xl font-bold">Your review results</h3>
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => setRemindResultsOpen(false)} aria-label="Close remind quiz results">
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="mt-5 grid gap-4 md:grid-cols-2">
                          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
                            <p className="text-sm font-semibold text-emerald-700">Correct on first try</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {remindResults.firstTry.length ? (
                                remindResults.firstTry.map((word) => (
                                  <span key={word} className="rounded-full border border-emerald-300 px-3 py-1 text-sm text-emerald-700">
                                    {word}
                                  </span>
                                ))
                              ) : (
                                <p className="text-sm text-emerald-700">No words solved on the first try this time.</p>
                              )}
                            </div>
                          </div>
                          <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
                            <p className="text-sm font-semibold text-red-700">Correct after retrying</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {remindResults.corrected.length ? (
                                remindResults.corrected.map((word) => (
                                  <span key={word} className="rounded-full border border-red-300 px-3 py-1 text-sm text-red-700">
                                    {word}
                                  </span>
                                ))
                              ) : (
                                <p className="text-sm text-red-700">You did not need any retries in this set.</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </TabsContent>

              <TabsContent value="saved" className="lg:min-h-0 lg:flex-1 lg:overflow-auto">
                <Card className={`${SOFT_GLASS_CARD_CLASS} lg:flex lg:min-h-full lg:flex-col`}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-3">
                        <CardTitle>Saved Words</CardTitle>
                        <CardDescription>Saved words stay out of today's word quiz.</CardDescription>
                      </div>
                      <span className={SOFT_GRADIENT_BADGE_CLASS}>{savedWords.length}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="lg:flex-1 lg:overflow-auto">
                    {savedWords.length ? (
                      <div className="grid gap-4 md:grid-cols-2">
                        {savedWords.map((card) => (
                          <Card key={card.word} className={SOFT_GLASS_INNER_CARD_CLASS}>
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <p className={SOFT_GRADIENT_PILL_CLASS}>Saved</p>
                                  <h3 className="mt-3 text-xl font-bold">{card.word}</h3>
                                  <p className="text-sm text-muted-foreground">{card.phonetic}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" onClick={() => handlePlayAudio(card)}>
                                    <Volume2 className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="sm" onClick={() => handleUnsaveWord(card.word)}>
                                    Remove
                                  </Button>
                                </div>
                              </div>
                              <p className="mt-4 text-sm leading-6 text-slate-600">{card.definition}</p>
                              <p className="mt-3 text-sm italic leading-6 text-slate-700">{card.example}</p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Your saved words will appear here once they are loaded.</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="rank" className="lg:min-h-0 lg:flex-1 lg:overflow-auto">
                <Card className={`${SOFT_GLASS_CARD_CLASS} lg:flex lg:min-h-full lg:flex-col`}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <div className="space-y-3">
                        <CardTitle>My Rank</CardTitle>
                        <CardDescription>Your rank is based on day streak.</CardDescription>
                      </div>
                      <div className={SOFT_GRADIENT_BADGE_CLASS}>#{userRank?.rank || "-"}</div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 lg:flex-1 lg:overflow-auto">
                    <Card className={SOFT_GLASS_INNER_CARD_CLASS}>
                      <CardContent className="flex items-center justify-between gap-4 p-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Current streak</p>
                          <p className="mt-1 text-3xl font-bold">{streak.count}</p>
                        </div>
                        <Award className="h-10 w-10 text-blue-600" />
                      </CardContent>
                    </Card>
                    <div className="grid gap-3">
                      {leaderboard.map((player) => (
                        <div
                          key={player.name}
                          className={`flex items-center justify-between rounded-2xl border px-4 py-3 ${
                            player.isUser
                              ? "border-blue-700/70 bg-gradient-to-r from-violet-500/10 to-blue-500/14 shadow-[0_0_0_1px_rgba(29,78,216,0.55)] backdrop-blur-xl"
                              : SOFT_GLASS_INNER_CARD_CLASS
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="grid h-10 w-10 place-items-center rounded-full bg-white/12 text-sm font-bold backdrop-blur-md">#{player.rank}</div>
                            <div>
                              <p className="font-semibold">{player.name}</p>
                              <p className="text-sm text-muted-foreground">{player.streak} day streak</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold text-secondary-foreground backdrop-blur-md">
                            {player.isUser ? "You" : "Learner"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
