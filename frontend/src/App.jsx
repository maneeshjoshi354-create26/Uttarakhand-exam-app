import { useEffect, useState } from "react";

function App() {
  const [questions, setQuestions] = useState([]);
  const [started, setStarted] = useState(false);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(600);

  // Questions backend se lana
  useEffect(() => {
    fetch("http://127.0.0.1:8000/questions")
      .then((response) => response.json())
      .then((data) => {
        setQuestions(data);
      })
      .catch((error) => {
        console.error("Questions error:", error);
        alert("Backend se questions nahi aa rahe.");
      });
  }, []);

  // Timer
  useEffect(() => {
    if (!started || result) return;

    if (timeLeft <= 0) {
      submitTest();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((time) => time - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, result]);

  const startTest = () => {
    setStarted(true);
    setCurrent(0);
    setAnswers({});
    setResult(null);
    setTimeLeft(600);
  };

  const selectAnswer = (answer) => {
    setAnswers({
      ...answers,
      [questions[current].id]: answer,
    });
  };

  const submitTest = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(answers),
      });

      if (!response.ok) {
        throw new Error("Submit failed");
      }

      const data = await response.json();

      setResult(data);
      setStarted(false);
    } catch (error) {
      console.error(error);
      alert("Test submit nahi hua. Backend check karo.");
    }
  };

  const nextQuestion = () => {
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    }
  };

  const previousQuestion = () => {
    if (current > 0) {
      setCurrent(current - 1);
    }
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Result screen
if (result) {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>🎉 Test Completed</h1>

        <h2>
          Score: {result.score} / {result.total_questions}
        </h2>

        <p>✅ Correct: {result.correct}</p>

        <p>❌ Wrong: {result.wrong}</p>

        <p>⭕ Unanswered: {result.unanswered}</p>

        <p>🎯 Accuracy: {result.accuracy}%</p>

        <button
          style={styles.button}
          onClick={startTest}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

  // Test screen
  if (started && questions.length > 0) {
    const question = questions[current];

    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.topBar}>
            <b>
              Question {current + 1} / {questions.length}
            </b>

            <b>⏱️ {formatTime()}</b>
          </div>

          <h2>{question.question}</h2>

          <div>
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => selectAnswer(option)}
                style={{
                  ...styles.option,
                  backgroundColor:
                    answers[question.id] === option
                      ? "#2563eb"
                      : "#f3f4f6",
                  color:
                    answers[question.id] === option ? "white" : "black",
                }}
              >
                {option}
              </button>
            ))}
          </div>

          <div style={styles.navigation}>
            <button
              style={styles.secondaryButton}
              onClick={previousQuestion}
              disabled={current === 0}
            >
              ← Previous
            </button>

            {current < questions.length - 1 ? (
              <button
                style={styles.button}
                onClick={nextQuestion}
              >
                Next →
              </button>
            ) : (
              <button
                style={styles.submitButton}
                onClick={submitTest}
              >
                Submit Test
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Start screen
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>UKSSSC Mock Test</h1>

        <p style={styles.subtitle}>
          Junior Assistant Practice Test
        </p>

        <div style={styles.info}>
          <p>📝 Questions: {questions.length}</p>
          <p>⏱️ Time: 10 Minutes</p>
          <p>🎯 Practice Mode</p>
        </div>

        <button
          style={styles.button}
          onClick={startTest}
          disabled={questions.length === 0}
        >
          {questions.length === 0 ? "Loading..." : "Start Test"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f7fb",
    padding: "20px",
  },

  card: {
    width: "100%",
    maxWidth: "650px",
    background: "white",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 5px 25px rgba(0,0,0,0.1)",
  },

  subtitle: {
    color: "#666",
    fontSize: "18px",
  },

  info: {
    margin: "25px 0",
    lineHeight: "1.8",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "25px",
    color: "#2563eb",
  },

  option: {
    width: "100%",
    padding: "14px",
    margin: "8px 0",
    border: "1px solid #ddd",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "16px",
  },

  navigation: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "25px",
    gap: "10px",
  },

  button: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#2563eb",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  secondaryButton: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#6b7280",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },

  submitButton: {
    padding: "12px 25px",
    border: "none",
    borderRadius: "8px",
    background: "#16a34a",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default App;