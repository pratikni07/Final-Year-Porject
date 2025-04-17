const BASE_URL = "http://localhost:4000/api/v1";

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
};

export const jobendpoints = {
  POST_JOB_API: BASE_URL + "/job",
  GET_JOB_API: BASE_URL + "/job",
  GET_JOB_BY_ID: BASE_URL + "/job",
  UPDATE_STAGE_API: BASE_URL + "/job/updateStage",
  
  GET_INTERVIEW_QUESTIONS: "http://localhost:4000/api/v1/interview/questions",

  GET_USER_JOBS_API: BASE_URL + "/job/getuserjobs",
  SUBMIT_INTERVIEW: BASE_URL + "/interview/upload",
  ANALYZE_INTERVIEW: BASE_URL + "/interview/analyze",
};

export const applicationEndpoints = {
  APPLY_JOB_API: BASE_URL + "/application",
  GET_APPLICAITION_BY_USERID: BASE_URL + "/application/my-applications",
  GET_APPLICAITION_BY_ID: BASE_URL + "/application/getApplicationById",
  UPDATE_THE_STAGE: BASE_URL + "/application/applications/update-status",
};

export const codeendpoints = {
  GET_CODE_API: BASE_URL + "/code/code",
  EXECUTE_CODE_API: BASE_URL + "/code/execute",
  SUBMIT_CODE_API: BASE_URL + "/code/submit",
};

export const modelendpoints = {
  GET_MODEL_CODE: BASE_URL + "/model/shortlistsubmission",
};
