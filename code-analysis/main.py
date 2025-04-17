from fastapi import FastAPI, HTTPException
import os
import pandas as pd
from tqdm import tqdm
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

app = FastAPI()

# Define root folder for job code
ROOT_FOLDER = "jobcode"

data = []

# Function to calculate Lines of Code (LOC)
def calculate_loc(file_path):
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            return sum(1 for line in f if line.strip())  
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return 0

# Function to calculate Cyclomatic Complexity
def calculate_cyclomatic_complexity(file_path):
    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            code = f.read()
        return code.count("if") + code.count("for") + code.count("while")
    except Exception as e:
        print(f"Error reading {file_path}: {e}")
        return 0

# Process job code directory
for problem_id in tqdm(os.listdir(ROOT_FOLDER)):
    problem_path = os.path.join(ROOT_FOLDER, problem_id)
    if os.path.isdir(problem_path): 
        for code_file in os.listdir(problem_path):
            file_path = os.path.join(problem_path, code_file)
            if file_path.endswith(".cpp"):
                loc = calculate_loc(file_path)
                complexity = calculate_cyclomatic_complexity(file_path)
                
                execution_time = loc * 0.1 
                memory_usage = loc * 0.05  
                
                data.append({
                    "problem_id": problem_id,
                    "file_name": code_file,
                    "loc": loc,
                    "cyclomatic_complexity": complexity,
                    "execution_time": execution_time,
                    "memory_usage": memory_usage
                })

# Convert data into a DataFrame
df = pd.DataFrame(data)

# Function to calculate efficiency score
def calculate_efficiency(row):
    accuracy = 1  # Assuming accuracy is constant for now
    execution_time = row["execution_time"]
    memory_usage = row["memory_usage"]

    # Weights for each parameter
    w1, w2, w3 = 0.5, 0.3, 0.2

    efficiency = (
        w1 * accuracy +
        w2 * (1 / (execution_time + 1e-5)) +  
        w3 * (1 / (memory_usage + 1e-5))
    )
    return efficiency

# Apply efficiency score calculation
df["efficiency_score"] = df.apply(calculate_efficiency, axis=1)

# Prepare training data
X = df[["loc", "cyclomatic_complexity", "execution_time", "memory_usage"]]
y = df["efficiency_score"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train the model
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

def process_job_code(job_id: str, count: int = 1):
    job_data = df[df["problem_id"] == job_id]
    if job_data.empty:
        return None
    
    job_data["predicted_efficiency"] = model.predict(job_data[["loc", "cyclomatic_complexity", "execution_time", "memory_usage"]])
    top_submissions = job_data.sort_values(by="predicted_efficiency", ascending=False).head(count)
    
    return top_submissions[["file_name", "predicted_efficiency"]].to_dict(orient="records")

@app.get("/")
def read_root():
    return {"message": "Job Code Efficiency API"}

@app.get("/efficiency/{job_id}")
def get_efficiency(job_id: str, count: int = 1):
    best_submissions = process_job_code(job_id, count)
    if best_submissions is None:
        raise HTTPException(status_code=404, detail="Job ID not found or no valid code files")
    
    return best_submissions
