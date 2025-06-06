<!-- PROJECT SHIELDS -->
[![contributors][contributors-shield]][contributors-url]
[![issues][issues-shield]][issues-url]
[![commits][commits-shield]][commits-url]

<!-- PROJECT LOGO --> 
<br />
<div align="center">
  <a href=“https://github.com/UW-INFO442-AU24/Team-Pesto”> 
    <img src="frontend/assets/PainPal_Logo.png" alt="PainPal logo (describe here)" width="200" height="200">
  </a>

  <h1 align="center">PainPal</h1>

  <p align="center">
    A mobile app that helps users track and visualize chronic migraine pain along with related health symptoms daily—without needing external medical records or hospital integration.
    <br />
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
            <ul>
                <li><a href="#frontend">Frontend</a></li>
                <li><a href="#backend">Backend</a></li>
            </ul>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](www.example.com) -->

This application is designed to support those suffering from chronic migraines by providing (list features here).

## Objective
This project aims to improve the quality of life for individuals suffering from chronic migraines by providing a personalized, data-driven digital caregiver platform. The platform will help users track, analyze, and manage their migraine symptoms, empowering them to identify triggers, reduce frequency, and improve overall well-being.

---

## Background
Chronic migraines are a debilitating condition affecting over 1 billion people worldwide, with symptoms including severe headaches, nausea, and sensitivity to light and sound. Managing migraines often requires identifying and avoiding triggers, which can vary widely between individuals (e.g., stress, weather changes, diet, or sleep patterns). However, many people lack the tools and resources to effectively track and analyze their symptoms, leading to prolonged suffering and reduced quality of life.

---

## Current Understanding
Migraines are complex and multifactorial, often influenced by a combination of genetic, environmental, and lifestyle factors. Common triggers include:
- **Environmental factors:** Weather changes, bright lights, loud noises.
- **Lifestyle factors:** Stress, poor sleep, dehydration, irregular meals.
- **Physiological factors:** Hormonal changes, medication overuse.

While treatments such as medications, lifestyle changes, and therapy exist, managing migraines effectively often requires personalized approaches tailored to an individual’s unique triggers and symptoms. Unfortunately, many existing tools for migraine tracking are either too simplistic or lack the advanced analytics needed to provide actionable insights.

---

## Approach
Our project aims to create a **digital caregiver platform** that goes beyond basic symptom tracking by leveraging **data-driven insights** and **personalized recommendations** to help users manage their migraines more effectively.

### Key Features of the Digital Caregiver Platform
1. **Daily Check-In:**
   - Simple rating scales to track migraine severity, duration, and location of pain.
   - Optional notes to record additional details (e.g., potential triggers, medications taken).

2. **Data Analysis and Insights:**
    - Advanced analytics to identify correlations between migraines and potential triggers (e.g., weather, sleep, stress, diet).
    - Visualizations (e.g., charts, graphs) to help users understand patterns and trends in their symptoms.

3. **Smart Predictions:**
    - Predictive modeling to estimate the user’s average daily migraine risk based on historical patterns.
    - Personalized warnings for potential migraine days based on recent trends.

4. **Trigger and Symptom Management:**
    - Customizable selection of common migraine triggers and symptoms during check-ins.
    - Top 10 trigger reports based on frequency and correlation with migraines.
    - Insight into which triggers most strongly contribute to migraines using SHAP interpretability.

5. **Medication Tracking:**
    - Ability to log preventative and responsive medications during or after migraine episodes.
    - Association of medications with individual migraine logs for better treatment tracking.

---

## **Why It’s Unique**
Our platform stands out by combining advanced analytics with user-centric design and community support. Unlike traditional migraine tracking apps, our solution provides personalized, actionable insights** while fostering a sense of connection and empowerment among users.

### **Differentiators:**
- **Personalization:** Tailored recommendations based on individual symptoms, triggers, and preferences.
- **Advanced Analytics:** Data-driven insights to help users identify patterns and correlations.
- **Accessibility:** A user-friendly platform that can be accessed anytime, anywhere, even offline.

---

## Next Steps
1. **Research and Development:**
   - Conduct user research to understand the specific needs and challenges of individuals with chronic migraines.
   - Develop and test prototypes of the platform’s key features.

2. **Implementation:**
   - Launch a pilot program to gather feedback and refine the platform.
   - Scale the solution to reach users globally.

3. **Evaluation:**
   - Monitor the platform’s impact on migraine frequency, severity, and overall well-being.
   - Continuously improve the platform based on user feedback and emerging research.

---

## Conclusion
Our app aims to empower individuals by providing accessible, personalized, and data-driven tools to manage their symptoms effectively. By addressing the root causes of migraines and fostering a supportive community, we hope to improve the quality of life for millions of people worldwide.

<p align=“right”>(<a href=“#readme-top”>back to top</a>)</p>


### Built With

* [![React Native][React Native]][React-url]
* [![Python][Python]][Python-url]
* [![SQLAlchemy][SQLAlchemy]][SQLAlchemy-url]
* [![FastAPI][FastAPI]][FastAPI-url]
* [![PostgreSQL][PostgreSQL]][PostgreSQL-url]
* [![Firebase][Firebase]][Firebase-url]
* [![Microsoft-Azure][Microsoft-Azure]][Microsoft-Azure-url]
* [![Figma][Figma]][Figma-url]
* [![Linear][Linear]][Linear-url]
* [![Miro][Miro]][Miro-url]

<p align=“right”>(<a href=“#readme-top”>back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started

 To get a local copy up and running follow these steps.

### Prerequisites
-   Android Studio Virtual Device Manager (Windows)
-   Xcode Simulator (MacOS)
-   Python 3.10 or above
-   PostgreSQL running and accessible
-   `pip` for Python package management
-    A .env file configured in backend/.env with the following keys:

```env
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<dbname>
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Installation

#### Frontend

1. Clone the repo
```
git clone https://github.com/INFO-Capstone-PainPal/PainPal.git
```

2. Install Expo CLI
```
npm install -g expo-cli
```

3. Navigate to the frontend 
```
cd frontend
```

4. Install frontend dependencies
```
npm install
```

5. If you are running on a real device, go through steps 5 and 6. Otherwise move to step 7.

Get your IP Address

Mac
```
ipconfig getifaddr en0 
```

If on ethernet (or en0 does not work)
```
ipconfig getifaddr en1
```

Windows
```
ipconfig | findstr /i "IPv4 (Windows)
```

6. Follow step 7 but for BASE_URL, paste in this: 
```
BASE_URL=http://{youripaddress}:8000/ 
```

7. Create file name `.env` in the root of the frontend directory. Add the following:
```
OPENWEATHER_API_KEY=
GOOGLE_API_KEY=
# For iOS Sim
# BASE_URL=http://localhost:8000
# For Android Emulator
# BASE_URL=http://10.0.2.2:8000
```

8. Start the development server
```
npx expo start --clear
```

9. Launch your simulator
- Press `a` to open the Android emulator (must be running Android Studio).
- Press `i` to open the iOS simulator (Mac only, must have Xcode installed).
- Scan the QR code to open the Expo Go app on your mobile device

10. Allow Location Services on your device or simulator. This is necessary for weather data.


#### Backend
<!-- NOTE: LOOK INTO SEEING IF NOT YOU NEED TO DO ALEMBIC COMMANDS TO GET TABLES? IDK -->
1.  Create and activate a virtual environment
```
python3 -m venv .venv
source .venv/bin/activate  # For Windows: .venv\Scripts\activate
```

2. Install dependencies
```
pip install -r requirements.txt
```

3. Install and start Redis:

    #### On macOS:
    ```sh
    brew install redis
    brew services start redis
    ```

    #### On Windows:
    Follow the instructions on the redis website linked [here](https://redis.io/docs/latest/operate/oss_and_stack/install/install-redis/install-redis-on-windows/)

4. Apply database migrations (SEE BELOW FIRST)
```
alembic upgrade head
```

Note: If you're using the shared production or staging database, you do not need to run Alembic migrations. Migrations are only necessary if you're initializing a new local PostgreSQL instance or modifying the schema. If you haven’t initialized Alembic before, make sure your alembic.ini and env.py files are configured correctly.

Additionally run the seed_script.py file under db to populate the database with list of medications, triggers, and symptoms.

5. From the root of the project, run the FastAPI backend server
```
uvicorn backend.main:app --reload --env-file backend/.env
```

Or if you had to go through steps 5 and 6 from setting up the frontend, run this command instead from the root of the project:
```
uvicorn backend.main:app --reload --host 0.0.0.0 --port 8000 --env-file backend/.env 
```

<p align=“right”>(<a href=“#readme-top”>back to top</a>)</p>

<!-- ROADMAP -->


<!-- CONTACT -->
## Contact

<p>Joey Kang - <a href="https://www.linkedin.com/in/joey--kang/">LinkedIn</a> - <a href= "mailto: joeykang96@gmail.com"> joeykang96@gmail.com </a></p>
<p>Diana Tran - <a href="https://www.linkedin.com/in/diana-tran-33b30a217/">LinkedIn</a>
<p>Cam Bun - <a href="https://www.linkedin.com/in/woncamm-bun/">LinkedIn</a>
<p>Kai Tinder - <a href="https://www.linkedin.com/in/kai-tinder/">LinkedIn</a>
<p>Eric Kim - <a href="https://www.linkedin.com/in/eric-kim-uw-info/">LinkedIn</a>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[contributors-shield]: https://img.shields.io/github/contributors/Error-By-Night/PainPal?style=for-the-badge&color=68%2C%20204%2C%2017
[contributors-url]: https://github.com/Error-By-Night/PainPal/graphs/contributors
[commits-shield]: https://img.shields.io/github/commit-activity/t/Error-By-Night/PainPal/main?style=for-the-badge
[commits-url]: https://github.com/Error-By-Night/PainPal/commits/main/
[issues-shield]: https://img.shields.io/github/issues/Error-By-Night/PainPal?style=for-the-badge
[issues-url]: https://github.com/Error-By-Night/PainPal/issues
[React Native]: https://img.shields.io/badge/React_Native-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB
[React-url]: https://reactnative.dev/
[Python]: https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54
[Python-url]: https://www.python.org/
[FastAPI]: https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi
[FastAPI-url]: https://fastapi.tiangolo.com/
[Microsoft-Azure]: https://custom-icon-badges.demolab.com/badge/Microsoft%20Azure-0089D6?style=for-the-badge&logo=msazure&logoColor=white
[Microsoft-Azure-url]: https://azure.microsoft.con
[Firebase]: https://img.shields.io/badge/firebase-ffca28?style=for-the-badge&logo=firebase&logoColor=black
[Firebase-url]: https://firebase.google.com/
[PostgreSQL]: https://img.shields.io/badge/postgresql-4169e1?style=for-the-badge&logo=postgresql&logoColor=white
[PostgreSQL-url]: https://www.postgresql.org/
[SQLAlchemy]: https://img.shields.io/badge/SQLAlchemy-F9DC3E?style=for-the-badge&logo=sqlalchemy&logoColor=black
[SQLAlchemy-url]: https://www.sqlalchemy.org/
[Figma]: https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white
[Figma-url]: https://www.figma.com/
[Linear]: https://img.shields.io/badge/Linear-5E6AD2?style=for-the-badge&logo=linear&logoColor=fff
[Linear-url]: https://linear.app/
[Miro]: https://img.shields.io/badge/Miro-050038?style=for-the-badge&logo=miro&logoColor=fff
[Miro-url]: https://miro.com/
