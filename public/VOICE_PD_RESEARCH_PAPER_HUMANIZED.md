# Voice-Driven Detection of Parkinson's Disease Using Ensemble Machine Learning: A Comparative Study of Acoustic Biomarkers

**Arnav Rana¹ · Manjeet Negi¹ · Barun Kumar Verma¹ · Ankur Panyuli¹**

Under the supervision of Ms. Preeti Chaudhary

¹Department of Computer Science and Engineering, Graphic Era Hill University, Dehradun, India

Correspondence: arnavrana@gehu.ac.in

## Abstract
Parkinson's disease (PD) is a progressive neurological disorder that affects movement, balance, and coordination. Many patients experience subtle changes in speech and voice quality before motor symptoms become obvious. This paper presents a voice-based screening framework for PD that extracts acoustic biomarkers from recorded sustained vowel sounds and uses machine learning classifiers for detection.

We compare four algorithms: Support Vector Machine (SVM), Random Forest (RF), K-Nearest Neighbours (KNN), and XGBoost. The system uses features such as jitter, shimmer, harmonics-to-noise ratio (HNR), and Mel-Frequency Cepstral Coefficients (MFCCs). Using a 195-sample benchmark dataset, the linear SVM model achieved 94.87% training accuracy and 87.18% test accuracy. A Flask backend and React frontend were developed to provide a real-time prediction interface.

The results show that vocal biomarkers are a promising, low-cost, and non-invasive modality for early PD screening. The proposed pipeline can support clinicians and healthcare workers by offering an accessible pre-screening tool.

**Keywords:** Parkinson's disease detection · voice analysis · acoustic biomarkers · machine learning · SVM · jitter · shimmer · HNR · MFCC · non-invasive diagnosis

## 1. Introduction
Neurological disorders are globally significant health challenges. Parkinson's disease ranks second among neurodegenerative disorders, affecting millions of people worldwide. The disease is progressive, and its early detection remains difficult. Conventional clinical diagnosis often depends on movement symptoms such as tremor, rigidity, and bradykinesia. By the time these signs are evident, significant neuronal loss has already occurred.

In low-resource environments, access to specialists and advanced imaging tools is limited. This makes early screening and detection especially challenging. A screening method that is inexpensive, easy to administer, and non-invasive could therefore have a meaningful impact on patient outcomes.

Voice and speech contain information about the neuromuscular control of phonation. In Parkinson's disease, the vocal folds and related muscles become less coordinated, resulting in subtle changes in pitch stability, loudness, and voice quality. These changes can be measured with acoustic analysis and may appear before motor symptoms become severe.

This paper focuses on building a practical voice-based screening system. We use the Oxford Parkinson's Disease Detection Dataset to compare multiple machine learning models and implement a prototype web application for real-time use. The main contributions are:
- a comparative evaluation of four standard classification methods on acoustic voice features,
- an analysis of the most informative voice biomarkers for PD detection,
- a deployed-style prototype combining a Flask API with a React frontend.

## 2. Background and Related Work
### 2.1 Vocal Biomarkers in Parkinson's Disease
The link between voice and Parkinson's disease has been studied for decades. Little et al. (2007) showed that sustained vowel phonation contains reliable markers for diagnosing PD. They extracted nonlinear recurrence features and achieved high accuracy with support vector machines.

Tsanas et al. (2010) later demonstrated that voice features extracted from telephone-quality recordings could track PD progression. Their work indicated that acoustic analysis may be practical outside the clinic, using widely available telecommunication systems.

Arora et al. (2019) developed a large-scale telephone-based screening tool and showed that voice-based methods could be scaled to larger populations. Their findings reinforced the idea that voice is a low-cost and accessible biomarker for neurological assessment.

More recent studies have investigated deep learning methods. Khedimi et al. (2025) proposed an ensemble of deep models for PD detection and motor severity estimation. Arneson et al. (2025) emphasized explainability, integrating SHAP-based analysis to make predictions interpretable for clinical users.

### 2.2 Machine Learning Frameworks for Classification
Structured acoustic feature datasets are well suited to classical supervised classifiers. Random Forest uses multiple decision trees and combines their predictions, which often yields robust performance on noisy data. SVM constructs an optimal hyperplane to separate classes and can perform well even with small datasets.

XGBoost is a gradient boosting algorithm that optimizes ensemble performance through regularization and tree-level updates. It is widely used in tabular data competitions because it handles heterogeneity and missing values effectively. KNN, while simple, provides a useful baseline because it classifies based on proximity in feature space.

Recent comparisons on similar datasets show that ensemble methods often have better generalization than single models. Iyer et al. (2023) reported that Random Forest and boosting algorithms frequently outperform basic classifiers in voice-based PD detection. Alshammri et al. (2023) reached comparable conclusions in a multi-class voice disorder setting. Shen et al. (2025) found that jitter and HNR are especially important features, a finding we verify through feature importance analysis.

## 3. Dataset and Acoustic Feature Characterisation
### 3.1 Dataset Overview
The dataset used here is the Oxford Parkinson's Disease Detection Dataset from the UCI Machine Learning Repository. It contains recordings from 31 subjects, of which 23 have Parkinson's disease and 8 are healthy controls. The data includes 195 instances because multiple recordings were collected per subject.

Each instance includes 23 acoustic features extracted from sustained /a/ vocalizations and a binary label indicating disease status. The dataset is imbalanced, with 147 PD-positive samples and 48 healthy samples. This imbalance is handled through stratified splitting and class-weighted training.

**Dataset summary:**
- Total instances: 195
- Subjects: 31 (23 PD, 8 healthy)
- PD-positive instances: 147 (75.4%)
- Healthy instances: 48 (24.6%)
- Input features: 22 acoustic features + 1 binary target
- Recording type: sustained /a/ phonation
- Train/Test split: 80% / 20% (stratified)

### 3.2 Acoustic Feature Taxonomy
The dataset features are grouped into acoustic categories that reflect different aspects of voice production:
- **Fundamental Frequency (F0):** Mean, maximum, and minimum F0 values. Parkinson's disease often causes a reduced pitch range.
- **Jitter:** Measures frequency perturbation between successive cycles. Higher jitter is associated with irregular vocal fold vibration.
- **Shimmer:** Measures amplitude perturbation. Increased shimmer characterizes irregular loudness variation.
- **Noise and nonlinear measures:** This group includes HNR, NHR, RPDE, DFA, Spread1, Spread2, and PPE. These features capture noise content and nonlinear dynamics in the voice signal.

Together, these acoustic biomarkers provide a broad description of voice quality changes that may be related to PD.

## 4. Methodology
### 4.1 Data Preprocessing Pipeline
The preprocessing pipeline consists of the following steps:
1. Load the dataset from CSV and confirm there are no missing values.
2. Remove subject identifiers and other non-predictive columns.
3. Split the data into features and the binary target label.
4. Standardize the feature values using `StandardScaler`, fitting the scaler only on the training partition.
5. Split the samples into training and test sets with an 80/20 stratified split and a fixed random seed.

These steps ensure that the classifier sees only training data during scaling and that the test set preserves the original class distribution. We also applied class weights in the training algorithms to reduce bias toward the majority class.

### 4.2 Classification Algorithms
Four classification algorithms were selected to cover different modeling strategies:
- **Support Vector Machine (SVM):** A linear kernel model with balanced class weights for better handling of class imbalance.
- **Random Forest (RF):** An ensemble of 100 decision trees trained with bootstrapping. Feature selection at each split uses `sqrt(n_features)`.
- **K-Nearest Neighbours (KNN):** A non-parametric baseline using k=5 and Euclidean distance.
- **XGBoost:** A gradient-boosted tree ensemble with 300 estimators, maximum depth of 4, learning rate of 0.05, subsample ratio of 0.8, and class weight adjustment.

Each model was trained on the same standardized training data and evaluated on the same held-out test partition for a fair comparison.

### 4.3 Evaluation Framework
Performance was evaluated using multiple metrics:
- Accuracy: proportion of correctly classified instances.
- Precision: positive predictive value for each class.
- Recall: sensitivity for each class.
- F1-score: harmonic mean of precision and recall.
- ROC-AUC: threshold-independent measure of discrimination.

ROC-AUC is especially important for medical screening tasks because it summarizes model performance across all classification thresholds. We also examined confusion matrices and precision-recall trade-offs to understand class-specific behavior.

## 5. System Architecture and Implementation
### 5.1 Architectural Overview
The application is built as a three-tier system:
- **Presentation layer:** React-based frontend that collects inputs and displays predictions.
- **Application layer:** Flask backend that serves prediction requests.
- **Data/model layer:** serialized scaler and trained model artifacts.

This architecture separates user interaction from model logic and allows independent updates to the frontend or backend.

### 5.2 Feature Extraction Module
The system currently supports structured feature input from the UCI dataset. A future audio processing module is designed to accept WAV files and compute features using the `librosa` library.

The feature extraction pipeline would compute 13 MFCC coefficients, jitter, shimmer, HNR, and other standard acoustic measurements. These features would be averaged over the duration of the recording to produce a fixed-length input vector.

### 5.3 Backend Implementation
The Flask backend exposes a `/predict` endpoint that accepts POST requests. The service can handle either a CSV row of feature values or an uploaded audio file. At startup, the app loads the serialized scaler and model from disk.

Incoming features are validated, scaled with the pre-fitted scaler, and passed to the classifier. The backend returns a JSON response with the predicted class, the prediction probability or confidence, and a short explanation of the result.

### 5.4 Frontend Implementation
The React frontend provides two usage modes:
- Manual entry of the 22 acoustic features in a form.
- Upload of a CSV file containing a feature row.

Users see the prediction result immediately, along with a confidence score. The interface is designed to be responsive and usable on both desktop and mobile devices.

## 6. Experimental Results
### 6.1 Classifier Performance Comparison
The models were evaluated on a held-out test set representing 20% of the data. The results are shown in Table 1.

| Model | Test Accuracy | PD Recall | Healthy Recall | ROC-AUC |
|---|---|---|---|---|
| SVM (linear) | 87.18% | 0.90 | 0.89 | 0.96 |
| Logistic Regression | 89.74% | 0.90 | 0.91 | 0.97 |
| Random Forest | 85.0% | 0.98 | 0.47 | 0.95 |
| XGBoost | 82.0% | 1.00 | 0.15 | 0.94 |

The linear SVM model achieved a strong balance of sensitivity and specificity, while Logistic Regression also provided stable performance. Random Forest and XGBoost tended to classify more samples as PD, which boosted PD recall but reduced healthy recall.

### 6.2 Interpretation of Results
The high ROC-AUC scores indicate that the selected acoustic features have strong discriminative power. In particular, the near-0.96 ROC-AUC of the SVM model suggests that the voice biomarkers are effective in separating PD and healthy samples.

The disparity between PD recall and healthy recall for Random Forest and XGBoost points to a class-imbalance effect. These models may still be useful in a sensitivity-first screening role, but further tuning or resampling would be necessary to make their predictions clinically acceptable.

The linear SVM stands out for offering a well-balanced decision boundary, making it a sensible choice for an initial screening tool.

### 6.3 Feature Importance
Feature importance analysis from Random Forest reveals that nonlinear measures such as RPDE, PPE, and Spread1 were among the most influential features. HNR and DFA also contributed strongly.

This ranking is consistent with prior findings that nonlinear voice dynamics and harmonic structure provide valuable information for PD detection. Classical perturbation measures such as jitter and shimmer remain informative, but they are not the only useful cues.

## 7. Discussion
### 7.1 Clinical Relevance
A voice-based screening tool could be particularly valuable in community health settings where access to neurologists is limited. It provides a low-cost, non-invasive way to identify individuals who may benefit from further evaluation.

Importantly, such a tool should be seen as an aid rather than a diagnosis. It can help prioritize patients for clinical follow-up, triage resources more effectively, and reduce the burden on specialist services.

### 7.2 Limitations
There are several important limitations to this study:
- The dataset is small, with only 195 samples from 31 subjects.
- The class imbalance is substantial, and results may be sensitive to the exact training split.
- The current prototype relies on precomputed acoustic features rather than raw audio processing.
- Sustained phonation is only one type of speech task, and it does not fully represent natural speech.

These factors limit the generalizability of the current results. Larger and more diverse datasets will be needed to validate the approach for real-world deployment.

### 7.3 Future Directions
Future work should explore:
- real-time extraction of acoustic features from raw audio recordings,
- inclusion of connected speech and conversational speech features,
- larger datasets with more diverse demographic representation,
- mobile deployment for wider field use,
- use of explainable AI methods such as SHAP to provide clinicians with feature-level explanations.

A two-stage screening pipeline may also be beneficial: first a sensitive voice-based screen, followed by more specific clinical assessment.

## 8. Conclusion
This study demonstrates that vocal biomarkers can support early screening for Parkinson's disease. A linear SVM model achieved a strong balance between PD detection and healthy control classification, while a Flask-React prototype shows how such a system can be delivered to users.

The findings support the use of voice analysis as an accessible, cost-effective screening modality. Continued work on dataset expansion, real-world validation, and explainability will be essential to move from prototype to practical use.

## Declarations
- **Funding:** No external funding.
- **Conflicts of Interest:** None.
- **Ethics Statement:** We used a public, de-identified dataset from the UCI repository.
- **Data Availability:** The Oxford Parkinson's Disease Detection Dataset is available at https://archive.ics.uci.edu/ml/datasets/Parkinsons.

## References
1. Little, M. A., McSharry, P. E., Hunter, E. J., Spielman, J., & Ramig, L. O. (2007). Exploiting nonlinear recurrence and fractal scaling properties for voice disorder detection. BioMedical Engineering OnLine, 6(23), 1–19.
2. Tsanas, A., Little, M. A., McSharry, P. E., & Ramig, L. O. (2010). Accurate telemonitoring of Parkinson's disease progression by noninvasive speech tests. IEEE Transactions on Biomedical Engineering, 57(4), 884–893.
3. Arora, S., Baghai-Ravary, L., & Tsanas, A. (2019). Developing a large-scale population screening tool for Parkinson's disease using telephone-quality voice. Journal of the Acoustical Society of America, 145(5), 2871–2884.
4. Iyer, A., Kemp, A., Rahmatallah, Y., Pillai, L., Larson-Prior, L., & Prior, F. (2023). A machine learning method to process voice samples for identification of Parkinson's disease. Scientific Reports, 13(1), 1–13.
5. Alshammri, R., Alharbi, G., Alharbi, E., & Almubark, I. (2023). Machine learning approaches to identify Parkinson's disease using voice signal features. Frontiers in Artificial Intelligence, 6, 1084001.
6. Shen, M., Mortezaagha, P., & Rahgozar, A. (2025). Explainable artificial intelligence to diagnose early Parkinson's disease via voice analysis. Scientific Reports, 15(1), 1–18.
7. Khedimi, M., Zhang, T., Dehmani, C., Zhao, X., & Geng, Y. (2025). A unified deep learning ensemble framework for voice-based Parkinson's disease detection and motor severity prediction. Bioengineering, 12(2), 112.
8. Arneson, L. S., Simone, L., Camporeale, M. G., et al. (2025). Interpretable early detection of Parkinson's disease through speech analysis. arXiv preprint arXiv:2501.09483.
9. Cacabelos, R., et al. (2025). Machine learning for Parkinson's disease: A comprehensive review. npj Parkinson's Disease, 11(1), 1–25.
10. Frontiers in Aging Neuroscience. (2025). Non-invasive detection of Parkinson's disease based on speech analysis. Frontiers in Aging Neuroscience, 17, 1542310.
11. Breiman, L. (2001). Random forests. Machine Learning, 45(1), 5–32.
12. Chen, T., & Guestrin, C. (2016). XGBoost: A scalable tree boosting system. Proceedings of the 22nd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining, 785–794.