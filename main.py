from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from questions import questions

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "UK Exam Mock App Backend Running"}


@app.get("/questions")
def get_questions():
    return questions


@app.post("/submit")
def submit_test(answers: dict):
    correct = 0
    wrong = 0
    unanswered = 0

    for question in questions:
        question_id = str(question["id"])

        if question_id not in answers:
            # User ne answer nahi diya
            unanswered += 1

        else:
            if answers[question_id] == question["answer"]:
                correct += 1
            else:
                wrong += 1

    total = len(questions)

    # Negative marking
    # Correct = +1
    # Wrong = -0.25
    # Unanswered = 0
    score = correct - (wrong * 0.25)

    # Accuracy = sirf attempted questions par
    attempted = correct + wrong

    if attempted > 0:
        accuracy = round((correct / attempted) * 100, 2)
    else:
        accuracy = 0

    return {
        "total_questions": total,
        "correct": correct,
        "wrong": wrong,
        "unanswered": unanswered,
        "score": score,
        "accuracy": accuracy
    }