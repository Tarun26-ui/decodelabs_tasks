# 🌸 DecodeLabs — Project 2: Data Classification Using KNN

> A complete **K-Nearest Neighbours (KNN)** machine learning pipeline built on the classic Iris dataset — from raw data to decision boundaries, using scikit-learn.

---

## 📌 Project Overview

| Field        | Details                                      |
|--------------|----------------------------------------------|
| **Project**  | DecodeLabs Project 2                         |
| **Domain**   | Supervised Machine Learning — Classification |
| **Algorithm**| K-Nearest Neighbours (KNN)                   |
| **Dataset**  | Iris Dataset (150 samples, 3 classes)        |
| **Language** | Python 3.x (Jupyter Notebook)                |
| **Batch**    | 2026                                         |

---

## 🧠 What This Project Covers

```
Raw Data → Explore → Scale → Split → Tune K → Train → Evaluate → Visualise
```

| Step | Action                        | Tool / Method              |
|------|-------------------------------|----------------------------|
| 1    | Load Iris dataset             | `sklearn.datasets`         |
| 2    | Explore & visualise           | `pandas`, `matplotlib`, `seaborn` |
| 3    | Train / Test split (80/20)    | `train_test_split`         |
| 4    | Feature scaling               | `StandardScaler`           |
| 5    | Find optimal K                | Elbow Method               |
| 6    | Train KNN model               | `KNeighborsClassifier`     |
| 7    | Evaluate performance          | Confusion Matrix, F1 Score |
| ★    | Decision boundary plot        | `matplotlib` mesh grid     |
| ★    | Predict a new flower          | `model.predict()`          |

---

## ✨ Key Concepts Demonstrated

- **KNN Algorithm** — distance-based lazy learning, no explicit training phase
- **Feature Scaling** — why `StandardScaler` is the *Gatekeeper Rule* for KNN
- **Elbow Method** — tuning hyperparameter K to balance over/underfitting
- **Evaluation Metrics** — accuracy vs. F1 score; why accuracy alone is misleading
- **Confusion Matrix** — visualising TP / FP / FN / TN
- **Decision Boundaries** — 2D visualisation of how KNN separates classes
- **Data Leakage Prevention** — fit scaler on train set only, transform both

---

## 🗂️ Repository Structure

```
decodelabs-knn/
│
├── DecodeLabs_Project2_KNN.ipynb   # Full Jupyter Notebook (all steps)
├── requirements.txt                 # Python dependencies
├── .gitignore                       # Files to exclude from Git
└── README.md                        # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.8 or higher
- Jupyter Notebook or JupyterLab

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/decodelabs-knn.git

# Navigate into the project folder
cd decodelabs-knn

# Install dependencies
pip install -r requirements.txt

# Launch Jupyter Notebook
jupyter notebook
```

Then open `DecodeLabs_Project2_KNN.ipynb` and run cells top to bottom.

---

## 📊 Outputs & Visualisations

The notebook generates the following plots:

1. **Class Distribution Bar Chart** — balanced 50/50/50 split across 3 species
2. **Petal Length vs Petal Width Scatter** — best feature pair for separation
3. **Sepal Length vs Sepal Width Scatter** — shows overlap in sepal space
4. **Feature Correlation Heatmap** — petal dimensions are highly correlated
5. **Elbow Curve** — error rate vs K, with optimal K annotated
6. **Confusion Matrix** — heatmap of predictions vs. actual labels
7. **Decision Boundary** — KNN's 2D classification regions for petal features

---

## 🎯 Try It Yourself — Custom Flower Prediction

At the end of the notebook, you can enter your own measurements:

```python
sepal_length = 5.1   # cm
sepal_width  = 3.5   # cm
petal_length = 1.4   # cm
petal_width  = 0.2   # cm
```

The model will predict the species and show a **confidence bar** for each class.

---

## 📦 Dependencies

| Library        | Purpose                            |
|----------------|------------------------------------|
| `numpy`        | Numerical operations               |
| `pandas`       | Data loading and exploration       |
| `matplotlib`   | Plotting and visualisation         |
| `seaborn`      | Statistical heatmaps               |
| `scikit-learn` | KNN model, scaling, metrics        |
| `jupyter`      | Running the notebook               |

---

## 📚 Learning Outcomes

After completing this project, you will understand:

- How the **KNN algorithm** works (distance-based voting)
- Why **feature scaling is mandatory** for distance-based models
- How to use the **Elbow Method** to choose the best K
- The difference between **accuracy and F1 score**
- How to read and interpret a **Confusion Matrix**
- How to visualise **decision boundaries** in 2D
- How to make **predictions on new, unseen data**

---

## 🔮 Possible Enhancements

- [ ] Try other distance metrics (`manhattan`, `minkowski`)
- [ ] Test on other datasets (Wine, Breast Cancer, MNIST)
- [ ] Compare KNN with Decision Trees and SVM
- [ ] Export the trained model using `joblib`
- [ ] Build a Flask web app for flower prediction
- [ ] Add cross-validation (`KFold`, `GridSearchCV`)



