import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiConnector } from "../services/apiConnector";
import { jobendpoints } from "../services/apis";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Interview = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [transcripts, setTranscripts] = useState({});
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const chunksRef = useRef([]);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const user = useSelector((state) => state.profile.user);

  const userId = user._id;

  // Fetch interview questions from the backend
  const fetchInterviewQuestions = async () => {
    try {
      const response = await apiConnector(
        "POST",
        `${jobendpoints.GET_INTERVIEW_QUESTIONS}`,
        {
          jobId,
          candidateId: userId,
        }
      );

      if (response.data.success) {
        setQuestions(
          response.data.questions.map((question, index) => ({
            id: index + 1,
            question: question,
            timeLimit: 120, // Default time limit
          }))
        );
      } else {
        toast.error("Failed to fetch interview questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Error loading interview questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviewQuestions();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [jobId, userId]);

  const uploadVideo = async (videoBlob, transcriptText) => {
    try {
      const formData = new FormData();
      formData.append("video", videoBlob, "interview.webm");
      formData.append("transcriptText", transcriptText);
      formData.append("jobId", jobId);
      formData.append("candidateId", userId);

      const response = await apiConnector(
        "POST",
        jobendpoints.SUBMIT_INTERVIEW,
        formData,
        {
          "Content-Type": "multipart/form-data",
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to upload interview");
      }

      return response.data;
    } catch (error) {
      throw new Error(error.message || "Failed to upload interview");
    }
  };

  const startTranscription = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Speech recognition is not supported in this browser");
      return;
    }

    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscripts((prev) => ({
          ...prev,
          [currentQuestionIndex]:
            (prev[currentQuestionIndex] || "") + " " + finalTranscript,
        }));
      }
    };

    recognition.start();
    setIsTranscribing(true);
  };

  const stopTranscription = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsTranscribing(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      streamRef.current = stream;
      videoRef.current.srcObject = stream;

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setRecordedVideo(blob);
      };

      setMediaRecorder(recorder);
      recorder.start();
      setRecording(true);
      startTranscription();
    } catch (error) {
      alert("Failed to access camera and microphone");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
      setRecording(false);
      stopTranscription();

      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleSubmit = async () => {
    if (!recordedVideo) {
      alert("Please record a video first");
      return;
    }

    if (!jobId || !userId) {
      alert("Missing job or user information");
      return;
    }

    setUploading(true);
    try {
      const transcriptText = JSON.stringify(transcripts);
      const result = await uploadVideo(recordedVideo, transcriptText);

      alert("Interview submitted successfully!");
      navigate("/applications");
    } catch (error) {
      alert("Failed to upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl">Loading interview questions...</div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-xl text-red-500">
          Failed to load interview questions. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="flex h-screen">
        {/* Main Video Area */}
        <div className="flex-1 p-4">
          <div className="relative h-full bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />

            {/* Control Bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-90 p-4">
              <div className="flex justify-center space-x-4">
                {!recording ? (
                  <button
                    onClick={startRecording}
                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
                    disabled={uploading}
                  >
                    Start Recording
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="bg-red-600 text-white p-3 rounded-full hover:bg-red-700"
                    disabled={uploading}
                  >
                    Stop Recording
                  </button>
                )}

                {recordedVideo && !recording && (
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white p-3 rounded-full hover:bg-green-700"
                    disabled={uploading}
                  >
                    {uploading ? "Submitting..." : "Submit Interview"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Questions and Transcript Panel */}
        <div className="w-96 bg-gray-800 p-6 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-4">Interview Questions</h2>
            <div className="bg-gray-700 rounded-lg p-4 mb-4">
              <p className="text-lg font-medium mb-2">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>
              <p className="text-gray-300 mb-4">
                {questions[currentQuestionIndex].question}
              </p>
              <p className="text-sm text-gray-400">
                Time limit: {questions[currentQuestionIndex].timeLimit} seconds
              </p>

              {/* Live Transcript */}
              <div className="mt-4 p-3 bg-gray-600 rounded">
                <h3 className="text-sm font-bold mb-2">Live Transcript:</h3>
                <p className="text-sm text-gray-300">
                  {transcripts[currentQuestionIndex] || "No transcript yet..."}
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1)
                  )
                }
                disabled={currentQuestionIndex === questions.length - 1}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-4">
            <h3 className="text-lg font-bold mb-3">Tips</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Speak clearly and maintain eye contact</li>
              <li>• Take a moment to gather your thoughts</li>
              <li>• Provide specific examples in your answers</li>
              <li>• Keep your responses focused and concise</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Interview;
