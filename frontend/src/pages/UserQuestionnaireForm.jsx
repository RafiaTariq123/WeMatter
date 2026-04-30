import React, { useState } from "react"
import {
    Button,
    Typography,
} from "@mui/material";
import { useSelector } from "react-redux"
import { useDispatch } from "react-redux"
import { useUpdateUserMutation } from "../redux/api/authApi";
import { updateUserProfile } from "../redux/features/authSlice"
import { useNavigate } from "react-router-dom";

export default function UserQuestionnaireForm() {
    
    const questions = [
        {
            id: 1,
            question: "I found it hard to wind down",
            category: 'stress',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 2,
            question: "I was aware of dryness of my mouth",
            category: 'anxiety',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 3,
            question: "I couldn't seem to experience any positive feeling at all",
            category: 'depression',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 4,
            question: "I experienced breathing difficulty (e.g., excessively rapid breathing, breathlessness in the absence of physical exertion)",
            category: 'anxiety',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 5,
            question: "I found it difficult to work up the initiative to do things",
            category: 'depression',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 6,
            question: "I tended to over-react to situations",
            category: 'stress',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 7,
            question: "I experienced trembling (e.g., in the hands)",
            category: 'anxiety',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 8,
            question: "I felt that I was using a lot of nervous energy",
            category: 'stress',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 9,
            question: "I was worried about situations in which I might panic and make a fool of myself",
            category: 'anxiety',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 10,
            question: "I felt that I had nothing to look forward to",
            category: 'depression',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 11,
            question: "I found myself getting agitated",
            category: 'stress',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 12,
            question: "I found it difficult to relax",
            category: 'stress',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 13,
            question: "I felt down-hearted and blue",
            category: 'depression',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 14,
            question: "I was intolerant of anything that kept me from getting on with what I was doing",
            category: 'stress',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 15,
            question: "I felt I was close to panic",
            category: 'anxiety',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 16,
            question: "I was unable to become enthusiastic about anything",
            category: 'depression',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 17,
            question: "I felt I wasn't worth much as a person",
            category: 'depression',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 18,
            question: "I felt that I was rather touchy",
            category: 'stress',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 19,
            question: "I was aware of the action of my heart in the absence of physical exertion (e.g., sense of heart rate increase, heart missing a beat)",
            category: 'anxiety',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 20,
            question: "I felt scared without any good reason",
            category: 'anxiety',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        },
        {
            id: 21,
            question: "I felt that life was meaningless",
            category: 'depression',
            options: [
                { value: 0 },
                { value: 1 },
                { value: 2 },
                { value: 3 }
            ]
        }
    ];
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth)
  const [updateUser, { isLoading, isSuccess, isError, error : updateError }] = useUpdateUserMutation()
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [error, setError] = useState("");
  const [showResults, setShowResults] = useState(false);
  const [depressionScore, setDepressionScore] = useState(null);
  const [severity, setSeverity] = useState('');

  const handleChange = (questionId, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[questionId - 1] = parseInt(value);
    setAnswers(updatedAnswers);
  }

  const calculateDepressionScore = () => {
    const depressionItems = [3, 5, 10, 13, 16, 17, 21];
    const rawScore = depressionItems.reduce((sum, itemId) => {
      return sum + (answers[itemId - 1] || 0);
    }, 0) * 2; // Multiply by 2 to convert to full DASS-42 scale
    
    return rawScore;
  };

  const getDepressionSeverity = (score) => {
    if (score <= 9) return 'Normal';
    if (score <= 13) return 'Mild';
    if (score <= 20) return 'Moderate';
    if (score <= 27) return 'Severe';
    return 'Extremely Severe';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions are answered
    if (answers.some(answer => answer === null)) {
      setError("Please answer all questions before submitting.");
      return;
    }

    setError("");

    try {
      const score = calculateDepressionScore();
      const severityLevel = getDepressionSeverity(score);

      setDepressionScore(score);
      setSeverity(severityLevel);
      setShowResults(true);

      // Prepare answers data for the backend
      const answersData = questions.map((q, index) => ({
        questionId: q.id,
        question: q.question,
        category: q.category,
        answer: answers[index] || 0
      }));

      // Save to backend
      console.log('Sending request to save assessment...');
      const response = await fetch('http://localhost:8000/api/scores', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.user._id,
          depressionScore: score,
          severity: severityLevel,
          answers: answersData
        })
      });

      const responseData = await response.json().catch(() => ({}));
      console.log('Server response:', { status: response.status, data: responseData });

      if (!response.ok) {
        throw new Error(responseData.message || 'Failed to save assessment results');
      }

      // Update user's last assessment date
      try {
        const updateResult = await updateUser({
          _id: user.user._id,
          lastAssessment: new Date().toISOString()
        });
        console.log('User update result:', updateResult);
      } catch (updateError) {
        console.warn('Warning: Could not update user last assessment date:', updateError);
        // Continue even if this fails
      }
    } catch (err) {
      console.error("Error submitting assessment:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      setError(`Error: ${err.message || 'An error occurred while processing your assessment. Please try again.'}`);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4 sm:px-6">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <Typography
            variant="h5"
            color="primary.main"
            sx={{ fontWeight: 600, textAlign: 'center', mb: 2 }}
          >
            DASS-21 Assessment
          </Typography>
          <div className="text-sm text-gray-600 mb-4">
            <p className="mb-2">
              <strong>Instructions:</strong> Please read each statement and select a number (0-3) that indicates how much the statement applied to you over the past week. 
              There are no right or wrong answers. Do not spend too much time on any statement.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 mt-4">
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <div className="font-medium">0</div>
                <div className="text-sm">Did not apply to me at all</div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <div className="font-medium">1</div>
                <div className="text-sm">Applied to me to some degree, or some of the time</div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <div className="font-medium">2</div>
                <div className="text-sm">Applied to me to a considerable degree or a good part of time</div>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-100">
                <div className="font-medium">3</div>
                <div className="text-sm">Applied to me very much or most of the time</div>
              </div>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="divide-y divide-gray-100">
            {questions.map((question, index) => (
              <div key={index} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="mb-2">
                  <p className="font-medium text-gray-800 text-base">
                    {question.id}. {question.question}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    {question.category.charAt(0).toUpperCase() + question.category.slice(1)}
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {question.options.map((option) => (
                    <label 
                      key={option.value}
                      className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                        answers[question.id - 1] === option.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={option.value}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                        checked={answers[question.id - 1] === option.value}
                        onChange={() => handleChange(question.id, option.value)}
                        required
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">{option.value}</div>
                        <div className="text-sm text-gray-500">{option.label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-100">
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            
            {showResults ? (
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Depression Assessment Results</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Depression Score:</span>
                    <span className="font-medium">{depressionScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Severity Level:</span>
                    <span className={`font-medium ${
                      severity === 'Normal' ? 'text-green-600' :
                      severity === 'Mild' ? 'text-yellow-500' :
                      severity === 'Moderate' ? 'text-orange-500' : 'text-red-600'
                    }`}>
                      {severity}
                    </span>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <p className="mb-2">Score Interpretation:</p>
                    <ul className="space-y-1">
                      <li className="flex items-center"><span className="w-4 h-4 bg-green-100 border border-green-300 rounded-full mr-2"></span> 0-9: Normal</li>
                      <li className="flex items-center"><span className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded-full mr-2"></span> 10-13: Mild</li>
                      <li className="flex items-center"><span className="w-4 h-4 bg-orange-100 border border-orange-300 rounded-full mr-2"></span> 14-20: Moderate</li>
                      <li className="flex items-center"><span className="w-4 h-4 bg-red-100 border border-red-300 rounded-full mr-2"></span> 21-27: Severe</li>
                      <li className="flex items-center"><span className="w-4 h-4 bg-red-200 border border-red-400 rounded-full mr-2"></span> 28+: Extremely Severe</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 flex justify-end">
                  <Button 
                    variant="contained"
                    onClick={() => navigate('/dashboard')}
                    sx={{
                      px: 4,
                      py: 1.5,
                      fontSize: '0.9rem',
                      textTransform: 'none',
                      borderRadius: '6px',
                      fontWeight: 500,
                      '&:hover': {
                        transform: 'translateY(-1px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                      },
                      '&:active': {
                        transform: 'translateY(0)'
                      }
                    }}
                  >
                    Return to Dashboard
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-center">
                <Button 
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  sx={{
                    maxWidth: '200px',
                    py: 1.5,
                    fontSize: '1rem',
                    textTransform: 'none',
                    borderRadius: '6px',
                    fontWeight: 500,
                    '&:hover': {
                      transform: 'translateY(-1px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    }
                  }}
                >
                  Submit
                </Button>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
