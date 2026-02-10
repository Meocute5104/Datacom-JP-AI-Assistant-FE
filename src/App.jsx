import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:8000/questions')
      .then(res => {
        setQuestions(res.data);
        setLoading(false);
      })
      .catch(err => console.error("Backend chưa chạy hoặc lỗi CORS:", err));
  }, []);

  const handleSelect = (qId, option) => {
    setAnswers({ ...answers, [qId]: option });
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.keys(answers).map(id => ({
      question_id: parseInt(id),
      user_answer: answers[id]
    }));
    
    try {
      const response = await axios.post('http://localhost:8000/evaluate', { answers: formattedAnswers });
      setResult(response.data);
    } catch (err) {
      alert("Lỗi khi gửi bài: Hãy đảm bảo Backend đang chạy!");
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-xl font-bold">Loading questions...</div>;

  if (result) return <ResultView result={result} reset={() => {setResult(null); setAnswers({});}} />;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-indigo-600 p-6 text-white text-center">
          <h1 className="text-3xl font-extrabold uppercase tracking-widest">JLPT Diagnostic Test</h1>
          <p className="opacity-80 mt-2">Estimate your proficiency from N5 to N3</p>
        </div>
        
        <div className="p-8">
          {questions.map((q, idx) => (
            <div key={q.id} className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200 hover:border-indigo-300 transition-colors">
              <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">Question {idx + 1} • {q.type}</span>
              <p className="text-lg font-semibold mt-1 text-gray-800">{q.question}</p>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`p-3 text-left rounded-lg border-2 transition-all ${
                      answers[q.id] === opt 
                      ? 'border-indigo-600 bg-indigo-50 text-red-700 font-bold' 
                      : 'border-transparent bg-white hover:bg-gray-100 text-white-600'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button 
            onClick={handleSubmit}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-indigo-700 shadow-lg transform hover:-translate-y-1 transition-all"
          >
            Submit My Answers
          </button>
        </div>
      </div>
    </div>
  );
};

const ResultView = ({ result, reset }) => {
  const chartData = {
    labels: ['Vocabulary', 'Grammar', 'Reading'],
    datasets: [{
      label: 'Your Competency Profile',
      data: [result.scores.vocab || 0, result.scores.grammar || 0, result.scores.reading || 0],
      backgroundColor: 'rgba(79, 70, 229, 0.2)',
      borderColor: 'rgba(79, 70, 229, 1)',
      borderWidth: 3,
      pointBackgroundColor: 'rgba(79, 70, 229, 1)',
    }]
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-2xl rounded-2xl p-8 text-center">
        <h2 className="text-5xl font-black text-gray-900 mb-2">Estimated Level: <span className="text-indigo-600">{result.level}</span></h2>
        <div className="inline-block px-4 py-1 bg-green-100 text-green-700 rounded-full font-bold text-sm mb-8">
          Confidence Score: {(result.similarity * 100).toFixed(0)}%
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="h-80">
            <Radar data={chartData} options={{ scales: { r: { min: 0, max: 1, ticks: { display: false } } }, maintainAspectRatio: false }} />
          </div>
          <div className="text-left space-y-6">
            <div className="bg-indigo-50 p-6 rounded-2xl border-l-4 border-indigo-600">
              <h3 className="font-bold text-indigo-900 text-xl mb-3">Recommended Resources</h3>
              <ul className="space-y-2">
                {result.recommendations.map((item, i) => (
                  <li key={i} className="flex items-center text-gray-700 italic">
                    <span className="mr-2 text-indigo-500">▶</span> {item}
                  </li>
                ))}
              </ul>
            </div>
            <button onClick={reset} className="text-indigo-600 font-bold hover:underline">← Take the test again</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;