import React, { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import RealTimeLipSync from "./RealTimeLipSync";

const AIInterviewer = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const animationRef = useRef(null);
  const speechRef = useRef(null);

  const questions = [
    {
      text: "Hello! I'm your AI interviewer today. Could you please introduce yourself and tell me about your background?",
      duration: 6000,
    },
    {
      text: "What interests you about this position and why did you decide to apply?",
      duration: 5000,
    },
    {
      text: "Could you tell me about a challenging project you've worked on?",
      duration: 4000,
    },
    {
      text: "Where do you see yourself in five years?",
      duration: 3000,
    },
  ];

  useEffect(() => {
    loadModels();
    return () => {
      if (speechRef.current) {
        window.speechSynthesis.cancel();
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const loadModels = async () => {
    try {
      await Promise.all([
        faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
        faceapi.nets.faceDetectionNet.loadFromUri("/models"),
      ]);
      setModelsLoaded(true);
    } catch (error) {
      console.error("Error loading face-api models:", error);
    }
  };

  const detectFace = async () => {
    if (!imageRef.current || !canvasRef.current || !modelsLoaded) return;

    const detection = await faceapi
      .detectSingleFace(imageRef.current)
      .withFaceLandmarks();

    if (detection) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      // Clear previous drawing
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw the image
      context.drawImage(imageRef.current, 0, 0, canvas.width, canvas.height);

      // Get mouth landmarks
      const mouth = detection.landmarks.getMouth();

      // Animate mouth based on speech
      if (isSpeaking) {
        const mouthTop = mouth[14].y;
        const mouthBottom = mouth[18].y;
        const mouthOpen = Math.random() * 10 + 5; // Random mouth movement

        // Draw mouth animation
        context.beginPath();
        context.moveTo(mouth[0].x, mouth[0].y);
        mouth.forEach((point) => {
          context.lineTo(point.x, point.y + (isSpeaking ? mouthOpen : 0));
        });
        context.closePath();
        context.fillStyle = "rgba(0, 0, 0, 0.6)";
        context.fill();
      }

      animationRef.current = requestAnimationFrame(detectFace);
    }
  };

  const speak = (text) => {
    if (!("speechSynthesis" in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      detectFace();
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const askNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((curr) => curr + 1);
      speak(questions[currentQuestion + 1].text);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <RealTimeLipSync />
      {/* <div className="flex-1 flex flex-col">
        <div className="h-1/2 p-4 flex flex-col items-center justify-center relative">
          <div className="relative w-full h-full max-w-2xl mx-auto">
            <img
              ref={imageRef}
              src="https://images.ctfassets.net/vztl6s0hp3ro/BRYFZftVn1457gy8lwxGU/e041b995cdc11d0913aa36167f39892f/How-to-be-a-good-interviewer-A-guide-for-recruiters-and-hiring-managers.webp" // Replace with your image URL
              alt="AI Interviewer"
              className="w-full h-full object-cover rounded-lg"
              onLoad={() => {
                if (canvasRef.current) {
                  canvasRef.current.width = imageRef.current.width;
                  canvasRef.current.height = imageRef.current.height;
                }
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
          </div>

          <div className="w-full max-w-2xl bg-gray-800 rounded-lg p-6 mt-4">
            <p className="text-white text-center mb-4">
              {questions[currentQuestion].text}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => speak(questions[currentQuestion].text)}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Repeat Question
              </button>
              <button
                onClick={askNextQuestion}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                disabled={currentQuestion >= questions.length - 1}
              >
                Next Question
              </button>
            </div>
          </div>
        </div>


        <div className="h-1/2 bg-black p-4">
          <div className="w-full h-full rounded-lg overflow-hidden">
            <video
              id="candidateVideo"
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          </div>
        </div>
      </div> */}

      {/* Questions Panel */}
      {/* <div className="w-96 bg-gray-800 p-6">
        <h2 className="text-xl font-bold text-white mb-4">
          Interview Progress
        </h2>
        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`p-4 rounded ${
                index === currentQuestion
                  ? "bg-blue-600"
                  : index < currentQuestion
                  ? "bg-gray-600"
                  : "bg-gray-700"
              }`}
            >
              <p className="text-white">
                {index + 1}. {q.text}
              </p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default AIInterviewer;
