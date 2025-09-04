import { useState, useEffect, useRef } from "react";
import axios from "axios";
import api from "../api/axiosConfig";

function HRChatBot({ isOpen, onClose }) {
  const [userAnswer, setUserAnswer] = useState("");
  const [currentId, setCurrentId] = useState(null);
  const [askedIds, setAskedIds] = useState([]);
  const [chatHistory, setChatHistory] = useState([
    {
      id: Date.now(),
      role: "bot",
      message:
        "Hi! I can help you practice answering interview questions. Ready to start?",
      timestamp: new Date(),
    },
  ]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [rating, setRating] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState(null);
  const [manualStop, setManualStop] = useState(false);
  const [reviewSummary, setReviewSummary] = useState([]);
  const [ratingSubmitted, setRatingSubmitted] = useState(false);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setUserAnswer(transcript);
      };

      recognitionRef.current.onend = () => {
        setIsRecording(false);
      };
    }
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  // Add message to chat history
  const addMessage = (role, message) => {
    const newMessage = {
      id: Date.now() + Math.random(), // Ensure unique IDs
      role,
      message,
      timestamp: new Date(),
    };
    setChatHistory((prev) => [...prev, newMessage]);
    return newMessage;
  };

  // Format timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Start recording
  const startRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
      setIsRecording(true);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  // Copy answer to clipboard with feedback
  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedMessageId(id);
    setTimeout(() => setCopiedMessageId(null), 2000);
  };

  const handleStartChat = () => {
    setIsLoading(true);
    api
      .get("/chatbot/hr-questions/start-chat/")
      .then((response) => {
        setCurrentId(response.data.id);
        setAskedIds([response.data.id]);
        addMessage("bot", "Great! Here's your first question:");

        // Add a small delay before showing the question to prevent duplication
        setTimeout(() => {
          simulateTyping(response.data.question);
        }, 500);
      })
      .catch((error) => {
        console.error("Error starting chat:", error);
        addMessage(
          "bot",
          "Sorry, I couldn't load the questions. Please try again later."
        );
      })
      .finally(() => setIsLoading(false));
  };

  // Simulate typing effect
  const simulateTyping = (message) => {
    const typingId = Date.now() + Math.random();
    const tempMessage = {
      id: typingId,
      role: "bot",
      message: "",
      isTyping: true,
      timestamp: new Date(),
    };

    setChatHistory((prev) => [...prev, tempMessage]);

    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < message.length) {
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === typingId
              ? { ...msg, message: message.substring(0, i + 1) }
              : msg
          )
        );
        i++;
      } else {
        clearInterval(typingInterval);
        // Remove typing indicator
        setChatHistory((prev) =>
          prev.map((msg) =>
            msg.id === typingId ? { ...msg, isTyping: false } : msg
          )
        );
      }
    }, 20);
  };

  const handleSubmitAnswer = () => {
    if (!userAnswer.trim() || isProcessingAnswer) {
      return;
    }

    // Prevent multiple submissions
    setIsProcessingAnswer(true);
    addMessage("user", userAnswer);
    setIsLoading(true);

    api
      .post("/chatbot/hr-questions/next-question/", {
        current_id: currentId,
        user_answer: userAnswer,
        asked_ids: askedIds,
      })
      .then((response) => {
        // Add feedback first
        simulateTyping(response.data.feedback);

        if (response.data.next_question) {
          // Wait for feedback to finish, then add next question
          setTimeout(() => {
            addMessage("bot", "Here's your next question:");
            setTimeout(() => {
              simulateTyping(response.data.next_question);
              setCurrentId(response.data.id);
              setAskedIds(response.data.asked_ids);
            }, 800);
          }, 2000);
        } else if (response.data.message) {
          setTimeout(() => {
            simulateTyping(response.data.message);
            setIsCompleted(true);
            setTimeout(() => setShowRating(true), 2000);
          }, 2000);
        }
        setUserAnswer("");
      })
      .catch((error) => {
        console.error("Error submitting answer:", error);
        addMessage(
          "bot",
          "Sorry, there was an error processing your answer. Please try again."
        );
      })
      .finally(() => {
        setIsLoading(false);
        setIsProcessingAnswer(false);
      });
  };

  // Stop interview manually and generate review
  const stopInterview = () => {
    setManualStop(true);
    setIsCompleted(true);

    // Generate review summary from chat history
    const userAnswers = [];
    for (let i = 0; i < chatHistory.length; i++) {
      if (
        chatHistory[i].role === "bot" &&
        chatHistory[i].message.includes("Here's your next question:")
      ) {
        if (i + 1 < chatHistory.length && chatHistory[i + 1].role === "bot") {
          const question = chatHistory[i + 1].message;
          // Look for the next user answer after this question
          for (let j = i + 2; j < chatHistory.length; j++) {
            if (chatHistory[j].role === "user") {
              userAnswers.push({
                question,
                answer: chatHistory[j].message,
              });
              break;
            }
          }
        }
      }
    }

    setReviewSummary(userAnswers);
    setShowRating(true);
  };

  const resetChat = () => {
    setChatHistory([
      {
        id: Date.now(),
        role: "bot",
        message:
          "Hi! I can help you practice answering interview questions. Ready to start?",
        timestamp: new Date(),
      },
    ]);
    setIsCompleted(false);
    setUserAnswer("");
    setCurrentId(null);
    setAskedIds([]);
    setShowRating(false);
    setRating(0);
    setManualStop(false);
    setReviewSummary([]);
    setRatingSubmitted(false);
    setIsProcessingAnswer(false);
  };

  const submitRating = () => {
    console.log("User rating:", rating);
    setRatingSubmitted(true);
    setShowRating(false);
  };

  if (!isOpen) return null;

  const chatBotStyles = {
    overlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.6)",
      backdropFilter: "blur(4px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 50,
      padding: "16px",
    },
    container: {
      backgroundColor: "white",
      width: "100%",
      maxWidth: "768px", // Increased from 448px (max-w-md) to 768px (max-w-2xl)
      height: "90vh",
      maxHeight: "800px",
      borderRadius: "16px",
      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      border: "1px solid #dbeafe",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    header: {
      background: "linear-gradient(to right, #2563eb, #4f46e5, #7c3aed)",
      padding: "16px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexShrink: 0,
    },
    headerContent: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      backgroundColor: "white",
      padding: "6px",
      borderRadius: "50%",
      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    },
    avatarInner: {
      background: "linear-gradient(to bottom right, #60a5fa, #7c3aed)",
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    headerText: {
      color: "white",
      fontWeight: "bold",
      fontSize: "20px",
      margin: 0,
    },
    headerSubtext: {
      color: "#dbeafe",
      fontSize: "12px",
      margin: 0,
    },
    closeButton: {
      color: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "transparent",
      border: "none",
      padding: "8px",
      borderRadius: "50%",
      cursor: "pointer",
      transition: "all 0.2s",
    },
    chatArea: {
      flex: 1,
      overflowY: "auto",
      padding: "24px",
      background: "linear-gradient(to bottom, #f9fafb, #f3f4f6)",
      display: "flex",
      flexDirection: "column",
      gap: "16px",
    },
    messageContainer: {
      display: "flex",
      transition: "all 0.3s",
    },
    userMessageContainer: {
      justifyContent: "flex-end",
    },
    botMessageContainer: {
      justifyContent: "flex-start",
    },
    message: {
      padding: "20px",
      borderRadius: "16px",
      maxWidth: "85%",
      wordBreak: "break-words",
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
      position: "relative",
      fontSize: "16px",
    },
    userMessage: {
      backgroundColor: "#2563eb",
      color: "white",
      borderBottomRightRadius: "4px",
    },
    botMessage: {
      backgroundColor: "white",
      color: "#1f2937",
      borderBottomLeftRadius: "4px",
      border: "1px solid #e5e7eb",
    },
    timestamp: {
      fontSize: "12px",
      marginTop: "8px",
    },
    userTimestamp: {
      color: "#bfdbfe",
    },
    botTimestamp: {
      color: "#6b7280",
    },
    inputArea: {
      padding: "24px",
      borderTop: "1px solid #e5e7eb",
      backgroundColor: "white",
      flexShrink: 0,
    },
    inputHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "16px",
    },
    stopButton: {
      display: "flex",
      alignItems: "center",
      fontSize: "14px",
      color: "#dc2626",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      gap: "4px",
    },
    statusText: {
      fontSize: "12px",
      color: "#6b7280",
    },
    inputContainer: {
      display: "flex",
      gap: "12px",
    },
    inputWrapper: {
      flexGrow: 1,
      position: "relative",
      display: "flex",
      alignItems: "center",
    },
    input: {
      width: "100%",
      border: "1px solid #d1d5db",
      borderRadius: "50px",
      fontSize: "16px",
      outline: "none",
      transition: "all 0.3s",
      padding: "16px 120px 16px 20px",
      right: "100px", // Moved left from 64px
      boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    },
    micButton: {
      position: "absolute",
      right: "64px",
      top: "50%",
      transform: "translateY(-50%)",
      padding: "8px",
      borderRadius: "50%",
      backgroundColor: "transparent",
      border: "none",
      cursor: "pointer",
      color: "#6b7280",
    },
    sendButton: {
      backgroundColor: "#2563eb",
      color: "white",
      width: "56px",
      height: "56px",
      borderRadius: "50%",
      border: "none",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s",
    },
    startButton: {
      background: "linear-gradient(to right, #2563eb, #4f46e5)",
      color: "white",
      padding: "16px 32px",
      borderRadius: "50px",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "500",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    resetButton: {
      background: "linear-gradient(to right, #10b981, #059669)",
      color: "white",
      padding: "16px 32px",
      borderRadius: "50px",
      border: "none",
      cursor: "pointer",
      fontSize: "18px",
      fontWeight: "500",
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s",
    },
    ratingContainer: {
      backgroundColor: "white",
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      padding: "24px",
      marginTop: "16px",
    },
    ratingTitle: {
      fontWeight: "500",
      textAlign: "center",
      marginBottom: "16px",
      fontSize: "18px",
    },
    starsContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "12px",
      marginBottom: "16px",
    },
    star: {
      fontSize: "32px",
      cursor: "pointer",
      transition: "transform 0.2s",
      backgroundColor: "transparent",
      border: "none",
    },
    ratingButton: {
      width: "100%",
      padding: "12px",
      borderRadius: "50px",
      border: "none",
      cursor: "pointer",
      fontWeight: "500",
      fontSize: "16px",
      transition: "all 0.3s",
    },
    loadingDots: {
      display: "flex",
      gap: "8px",
    },
    dot: {
      width: "8px",
      height: "8px",
      borderRadius: "50%",
      backgroundColor: "#9ca3af",
      animation: "bounce 1.4s ease-in-out infinite both",
    },
  };

  return (
    <div style={chatBotStyles.overlay}>
      <div style={chatBotStyles.container}>
        {/* Header */}
        <div style={chatBotStyles.header}>
          <div style={chatBotStyles.headerContent}>
            <div style={chatBotStyles.avatar}>
              <div style={chatBotStyles.avatarInner}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="white"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
            </div>
            <div>
              <h3 style={chatBotStyles.headerText}>HR Interview Coach</h3>
              <p style={chatBotStyles.headerSubtext}>Online • Ready to help</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Chat Area */}
        <div style={chatBotStyles.chatArea}>
          {chatHistory.map((chat) => (
            <div
              key={chat.id}
              style={{
                ...chatBotStyles.messageContainer,
                ...(chat.role === "user"
                  ? chatBotStyles.userMessageContainer
                  : chatBotStyles.botMessageContainer),
              }}
            >
              <div
                style={{
                  ...chatBotStyles.message,
                  ...(chat.role === "user"
                    ? chatBotStyles.userMessage
                    : chatBotStyles.botMessage),
                }}
              >
                <div>{chat.message}</div>
                <div
                  style={{
                    ...chatBotStyles.timestamp,
                    ...(chat.role === "user"
                      ? chatBotStyles.userTimestamp
                      : chatBotStyles.botTimestamp),
                  }}
                >
                  {formatTime(chat.timestamp)}
                </div>

                {/* Copy button for user messages */}
                {chat.role === "user" && (
                  <button
                    onClick={() => copyToClipboard(chat.message, chat.id)}
                    style={{
                      position: "absolute",
                      bottom: "-8px",
                      right: "8px",
                      backgroundColor: "white",
                      color: "#2563eb",
                      borderRadius: "50%",
                      padding: "4px",
                      border: "none",
                      cursor: "pointer",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    {copiedMessageId === chat.id ? (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                        <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                      </svg>
                    )}
                  </button>
                )}

                {/* Typing indicator */}
                {chat.isTyping && (
                  <div
                    style={{ position: "absolute", bottom: "-8px", left: 0 }}
                  >
                    <div style={chatBotStyles.loadingDots}>
                      <div
                        style={{ ...chatBotStyles.dot, animationDelay: "0ms" }}
                      ></div>
                      <div
                        style={{
                          ...chatBotStyles.dot,
                          animationDelay: "150ms",
                        }}
                      ></div>
                      <div
                        style={{
                          ...chatBotStyles.dot,
                          animationDelay: "300ms",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isLoading && !chatHistory.some((msg) => msg.isTyping) && (
            <div style={chatBotStyles.botMessageContainer}>
              <div
                style={{
                  ...chatBotStyles.message,
                  ...chatBotStyles.botMessage,
                }}
              >
                <div style={chatBotStyles.loadingDots}>
                  <div style={chatBotStyles.dot}></div>
                  <div
                    style={{ ...chatBotStyles.dot, animationDelay: "100ms" }}
                  ></div>
                  <div
                    style={{ ...chatBotStyles.dot, animationDelay: "200ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />

          {chatHistory.length === 1 && (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                onClick={handleStartChat}
                style={chatBotStyles.startButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
                <span>🚀 Start Interview Practice</span>
              </button>
            </div>
          )}

          {isCompleted && !showRating && (
            <div style={{ textAlign: "center", marginTop: "24px" }}>
              <button
                onClick={resetChat}
                style={chatBotStyles.resetButton}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                }}
              >
                🔄 Start Again
              </button>
            </div>
          )}

          {/* Rating System */}
          {showRating && (
            <div style={chatBotStyles.ratingContainer}>
              <h4 style={chatBotStyles.ratingTitle}>
                {manualStop
                  ? "Interview Stopped - Rate Your Experience"
                  : "How was your experience?"}
              </h4>

              {/* Review Summary for Manual Stop */}
              {manualStop && reviewSummary.length > 0 && (
                <div
                  style={{
                    marginBottom: "24px",
                    maxHeight: "192px",
                    overflowY: "auto",
                  }}
                >
                  <h5
                    style={{
                      fontWeight: "500",
                      color: "#374151",
                      marginBottom: "12px",
                      fontSize: "16px",
                    }}
                  >
                    Practice Summary:
                  </h5>
                  {reviewSummary.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        marginBottom: "16px",
                        padding: "12px",
                        backgroundColor: "#f9fafb",
                        borderRadius: "8px",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          fontWeight: "500",
                          color: "#1f2937",
                          margin: "0 0 8px 0",
                        }}
                      >
                        Q: {item.question}
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#6b7280",
                          margin: 0,
                        }}
                      >
                        A: {item.answer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div style={chatBotStyles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    style={{
                      ...chatBotStyles.star,
                      color: rating >= star ? "#fbbf24" : "#d1d5db",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                    }}
                  >
                    {rating >= star ? "★" : "☆"}
                  </button>
                ))}
              </div>
              <button
                onClick={submitRating}
                disabled={rating === 0}
                style={{
                  ...chatBotStyles.ratingButton,
                  backgroundColor: rating === 0 ? "#e5e7eb" : "#2563eb",
                  color: rating === 0 ? "#9ca3af" : "white",
                  cursor: rating === 0 ? "not-allowed" : "pointer",
                }}
              >
                Submit Rating
              </button>
            </div>
          )}
        </div>

        {/* Answer Input & Controls */}
        {chatHistory.length > 1 && !isCompleted && (
          <div style={chatBotStyles.inputArea}>
            <div style={chatBotStyles.inputHeader}>
              <button onClick={stopInterview} style={chatBotStyles.stopButton}>
                <svg
                  width="16"
                  height="16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"
                  />
                </svg>
                Stop Interview
              </button>

              <div style={chatBotStyles.statusText}>
                Questions: {askedIds.length} | Status: Active
              </div>
            </div>

            <div style={chatBotStyles.inputContainer}>
              <div style={chatBotStyles.inputWrapper}>
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type your answer..."
                  style={{
                    ...chatBotStyles.input,
                    paddingRight: isRecording ? "140px" : "100px",
                    borderColor:
                      isLoading || isRecording || isProcessingAnswer
                        ? "#d1d5db"
                        : "#2563eb",
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSubmitAnswer()}
                  disabled={isLoading || isRecording || isProcessingAnswer}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#2563eb";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(37, 99, 235, 0.1)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#d1d5db";
                    e.target.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)";
                  }}
                />
                {/* Speech-to-text button it's best */}
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    ...chatBotStyles.micButton,
                    color: isRecording ? "#dc2626" : "#6b7280",
                    right: "64px", // Fixed position (remove conditional)
                  }}
                >
                  {isRecording ? (
                    // Animated recording indicator
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        position: "relative",
                        animation: "pulse 1.5s infinite",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          width: "100%",
                          height: "100%",
                          backgroundColor: "#dc2626",
                          borderRadius: "50%",
                        }}
                      ></div>
                    </div>
                  ) : (
                    // Standard microphone icon
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                {/* <button
                  onClick={isRecording ? stopRecording : startRecording}
                  style={{
                    ...chatBotStyles.micButton,
                    color: isRecording ? "#dc2626" : "#6b7280",
                    animation: isRecording ? "pulse 1.5s infinite" : "none",
                    right: isRecording ? "100px" : "100px",
                  }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button> */}
              </div>
              <button
                onClick={handleSubmitAnswer}
                disabled={isLoading || isRecording || isProcessingAnswer}
                style={{
                  ...chatBotStyles.sendButton,
                  opacity:
                    isLoading || isRecording || isProcessingAnswer ? 0.5 : 1,
                  cursor:
                    isLoading || isRecording || isProcessingAnswer
                      ? "not-allowed"
                      : "pointer",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && !isRecording && !isProcessingAnswer) {
                    e.target.style.backgroundColor = "#1d4ed8";
                    e.target.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#2563eb";
                  e.target.style.transform = "scale(1)";
                }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%,
          80%,
          100% {
            transform: scale(0);
          }
          40% {
            transform: scale(1);
          }
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default HRChatBot;
