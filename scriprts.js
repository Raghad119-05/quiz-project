const questions = [
  {
    question: "When was our first video call 💻🍵?",
    choices: ["13th November", "14th November", "15th November", "None"],
    answer: 2
  },
  {
    question: "What was on the sweater Raghad wore when you came to visit us for the first time in Idlib?",
    choices: ["Baby Chick 🐤", "Giraffe 🦒", "Penguin 🐧", "Cat 🐈"],
    answer: 1
  },
  {
    question: "What is the date of our engagement?",
    choices: ["14th December", "13 December", "10 December", "12 December"],
    answer: 0
  },
  {
    question: "What are Raghad's favorite colors (She told you when you asked in Idlib)?",
    choices: ["orange", "blue", "green", "pink", "purple", "both 1 and 2", "both 2, 3 and 5", "All except orange"],
    answer: 7
  },
  {
    question: "What topic we usually disagree about? 🤕🙄",
    choices: ["Women's work and study", "The concept of gender mixing", "Roles of men and women in family life", "Other"],
    answer: null // No fixed answer for "Other"
  },
  {
    question: "What do you consider your main priority in life",
    choices: ["Building a successful career", "Achieving personal success", "Family", "Other"],
    answer: null // No fixed answer for "Other"
  },

  {
    question: "What would you do if you disagreed with your life partner about something you consider important?",
    choices: ["Try to convince her with logic and patience", "Respectfully listen and look for common ground", "Insist on my view if i believe it's right", "Avoid the topic to keep peace", "Other"],
    answer: null // No fixed answer for "Other"
  }
];

const questionEl = document.getElementById("question-text");
const choicesEl = document.getElementById("choices");
const feedbackEl = document.getElementById("feedback");
const questionNumber = document.getElementById("question-number");
const submitBtn = document.getElementById("submit-btn");

let current = 0;
let selected = null;
const answers = [];  // لتخزين الإجابات

// هذه الوظيفة ستكون مسؤولة عن تحميل الأسئلة
function loadQuestion() {
  const q = questions[current];
  questionEl.textContent = q.question;
  questionNumber.textContent = current + 1;
  choicesEl.innerHTML = "";
  feedbackEl.textContent = "";
  selected = null;

  q.choices.forEach((choice, idx) => {
    const btn = document.createElement("button");
    btn.textContent = choice;
    btn.classList.add("choice-btn");
    btn.onclick = () => {
      selected = idx;
      document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      
      // لإظهار حقل الإدخال إذا تم اختيار "Other"
      if (choice === "Other") {
        let input = document.createElement("input");
        input.id = "other-input";
        input.type = "text";
        input.placeholder = "Please specify your answer...";
        choicesEl.appendChild(input);
      } else {
        const existingInput = document.getElementById("other-input");
        if (existingInput) {
          existingInput.remove();
        }
      }
    };
    choicesEl.appendChild(btn);
  });
}

// هذه الوظيفة سيتم تنفيذها عند الضغط على زر "Submit"
submitBtn.onclick = () => {
  if (selected === null) {
    alert("Please select an answer.");
    return;
  }

  const q = questions[current];
  const isOther = q.choices[selected] === "Other";
  const input = document.getElementById("other-input");
  const answerText = isOther ? input?.value.trim() : null;

  // إذا كانت الإجابة "Other" ولم يتم كتابة شيء في النص المفتوح، نعرض تحذيرًا
  if (isOther && (!answerText || answerText === "")) {
    alert("Please write your answer in the text field.");
    return;
  }

  // إضافة الإجابة إلى المصفوفة
  answers.push({
    question: q.question,
    answer: isOther ? answerText : q.choices[selected]
  });

  // إذا كانت الإجابة مفتوحة، نعرض الملاحظات باللون الأخضر مباشرة
  if (q.answer === null) {
    feedbackEl.textContent = "Your answer has been recorded!";
    feedbackEl.style.color = "green";
  } else {
    // التحقق إذا كانت الإجابة صحيحة أم خاطئة
    const correct = q.answer;
    if (selected === correct) {
      feedbackEl.textContent = "Correct! Well done!";
      feedbackEl.style.color = "green";
    } else {
      feedbackEl.textContent = "Incorrect, i whish good luck for you in the next trying!";
      feedbackEl.style.color = "red";
    }
  }

  // إرسال الأجوبة بعد الإجابة على جميع الأسئلة
  if (current === questions.length - 1) {
    // إرسال الأجوبة إلى Google Sheets
    fetch("https://script.google.com/macros/s/AKfycbyDXb_o-uQhui6UTjVriSS5c0NQZSD37ZHZqkFzPmU76lzVchEJ6RbE1UA4LdT9JAmmpw/exec", {
      method: "POST",
      body: JSON.stringify({
        q1: answers[0].question,
        a1: answers[0].answer,
        q2: answers[1].question,
        a2: answers[1].answer,
        q3: answers[2].question,
        a3: answers[2].answer,
        q4: answers[3].question,
        a4: answers[3].answer,
        q5: answers[4].question,
        a5: answers[4].answer,
        q6: answers[5].question,
        a6: answers[5].answer,
        q7: answers[6].question,
        a7: answers[6].answer
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
    .finally(() => {
      // بعد الإرسال أو في حالة حدوث خطأ، التحويل إلى صفحة "congrats.html"
      window.location.href = "congrats.html";
    });
  } else {
    setTimeout(() => {
      current++;
      if (current < questions.length) {
        loadQuestion();
      } else {
        // في حالة الوصول إلى آخر سؤال، التحويل مباشرة
        window.location.href = "congrats.html";
      }
    }, 1500);
  }
};

// الانتقال للسؤال التالي بعد 1.5 ثانية بغض النظر عن صحة الإجابة
window.onload = loadQuestion;




// const questions = [
//     {
//       question: "When was our first video call 💻🍵?",
//       choices: ["13th November", "14th November", "15thNovember", "None"],
//       answer: 2
//     },
//     {
//       question: "What was on the sweater Raghad wore when you came to visit us for the first time in Idlib?",
//       choices: ["Baby Chick 🐤", "Giraffe 🦒", "Penguin 🐧",  "Cat 🐈"],
//       answer: 1
//     },
//     {
//       question: "What is the date of our engagement?",
//       choices: ["14th December", "13 Decemmber", "10 December" , "12 December"],
//       answer: 0
//     },
//     {
//       question: "What are Raghad's favorite colors (She told you when you asked in Idlib)?",
//       choices: ["orange", "blue", "green", "pink", "purple", "both 1 and 2", "both 2, 3 and 5", "All except orange"],
//       answer: 7
//     },
//     {
//       question: "What topic we usually disagree about? 🤕🙄",
//       choices: ["Women's work and study", "Te concept og gender mixing", "Roles of men and women in family life"],
//       answer: 1
//     },

//     {
//       question: "What do you consider your main priority in life",
//       choices: ["Building a successful career", "Achieving personal success", "Family", "Other"],
//       answer: 1
//     }
//   ];
  
//   let current = 0;
//   let selected = null;
  
//   const questionEl = document.getElementById("question-text");
//   const choicesEl = document.getElementById("choices");
//   const feedbackEl = document.getElementById("feedback");
//   const questionNumber = document.getElementById("question-number");
//   const submitBtn = document.getElementById("submit-btn");
  
//   function loadQuestion() {
//     const q = questions[current];
//     questionEl.textContent = q.question;
//     questionNumber.textContent = current + 1;
//     choicesEl.innerHTML = "";
//     feedbackEl.textContent = "";
//     selected = null;
  
//     q.choices.forEach((choice, idx) => {
//       const btn = document.createElement("button");
//       btn.textContent = choice;
//       btn.classList.add("choice-btn");
//       btn.onclick = () => {
//         selected = idx;
//         document.querySelectorAll(".choice-btn").forEach(b => b.classList.remove("selected"));
//         btn.classList.add("selected");
//       };
//       choicesEl.appendChild(btn);
//     });
//   }
  
//   submitBtn.onclick = () => {
//     if (selected === null) {
//       alert("Please select an answer.");
//       return;
//     }
  
//     const correct = questions[current].answer;
//     if (selected === correct) {
//       feedbackEl.textContent = "أحسنت!";
//       feedbackEl.style.color = "green";
//       setTimeout(() => {
//         current++;
//         if (current < questions.length) {
//           loadQuestion();
//         } else {
//           window.location.href = "congrats.html";
//         }
//       }, 1000);
//     } else {
//       feedbackEl.textContent = "خطأ، جرّب مرة أخرى!";
//       feedbackEl.style.color = "red";
//     }
//   };
  
//   window.onload = loadQuestion;