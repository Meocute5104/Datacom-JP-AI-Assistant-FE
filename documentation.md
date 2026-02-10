AI Japanese Proficiency Assessment Assistant (N5–N3)
1. Problem Definition

Japanese language learners often struggle to accurately assess their proficiency level in order to select appropriate learning materials. This project provides a diagnostic tool that estimates a learner’s JLPT level (from N5 to N3) and recommends suitable study resources based on actual performance.

2. System Architecture

The project is implemented as a full-stack application to demonstrate professional system design capabilities:

Backend (FastAPI / Python): Acts as the “Brain” of the assistant, responsible for evaluation logic and mathematical computation.

Frontend (ReactJS + Tailwind CSS): Provides a modern user interface, handles test execution, and visualizes results.

Communication: Frontend and backend communicate via REST APIs using JSON.

3. Core AI Logic & Decisions

The system applies a Hybrid Evaluation Strategy to ensure both accuracy and explainability:

A. Rule-based Evaluation

Before determining the final proficiency level, the system enforces minimum score thresholds for each core skill (Vocabulary, Grammar).

Example:
JLPT N3 requires Vocabulary ≥ 70% and Grammar ≥ 60%.

Decision Rationale:
This ensures that users possess solid foundational skills before being considered for higher proficiency levels.

B. Similarity Scoring

User performance is represented as a competency vector:

𝑉
𝑢
𝑠
𝑒
𝑟
=
[
𝑉
𝑜
𝑐
𝑎
𝑏
𝑢
𝑙
𝑎
𝑟
𝑦
,
𝐺
𝑟
𝑎
𝑚
𝑚
𝑎
𝑟
,
𝑅
𝑒
𝑎
𝑑
𝑖
𝑛
𝑔
]
V
user
	​

=[Vocabulary,Grammar,Reading]

The system applies Cosine Similarity to compare this vector against predefined JLPT standard profiles (N5, N4, N3).

Mathematical Formula:

Similarity
=
𝐴
⋅
𝐵
∥
𝐴
∥
∥
𝐵
∥
Similarity=
∥A∥∥B∥
A⋅B
	​


Why Cosine Similarity:
This method emphasizes the relative distribution of skills rather than raw total scores, enabling more accurate identification of a learner’s proficiency profile.

4. Technical Challenges & Reasoning

Use of Python:
Although Python was not explicitly encouraged, it was selected for the backend due to its strong support for vector computation and data processing libraries (e.g., math, collections), making it well-suited for building an AI “brain.”

Security:
The Gemini API key is managed through environment variables (.env) and excluded via .gitignore to prevent credential leakage.

Resilience:
The system includes a fallback mechanism. If the external AI service becomes unavailable, the application automatically switches to a high-quality static question set to ensure uninterrupted user experience.

5. Limitations and Bias

In compliance with ethical AI principles and known system constraints:

Lack of Listening/Speaking Skills:
Due to scope and browser limitations, the system currently focuses on reading comprehension and language knowledge.

Guessing Bias:
Short multiple-choice assessments may be influenced by random guessing.

Linguistic Bias:
The use of English in answer choices may advantage learners who are already proficient in English.