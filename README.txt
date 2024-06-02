GMAIL SPAM DETECTION SYSTEM

divided into 3 part

- AI Model Analysis
- AI Model Deployment
- Chrome Extention (UI)

Python Library Requirements (pip install)
- stopwords
- punkt
- streamlit
- nltk
- sklearn
- flask
- flask_cors
- pickle

**IMPORTANT : For gmail auth CLIENT_ID need to use yours**
**Change in manifest.json line 20**
1. Go to https://console.cloud.google.com/
2. Find APIs & Services
3. Enable Gmail API
4. Go to Credentials and click "Create Credentials"
5. Select OAuth client ID 
6. Application Type select Chrome Extention
7. Item ID is your extention ID after you done step 2 in "Run in Chrome Extention (UI)"
8. Click "Create" then will popup the CLIENT_ID which you need to copy and replace in this application


#How to run?
Flask Server
1. Navigate to sms-email-spam-classifier-main folder
2. Select api.py and click run button on top right corner
3. Terminate will showing some message include your port
** You need to change ur port (E.g. http://127.0.0.1:5000/) in popup.js if not same in script

Test Run AI Model
1. Navigate to sms-email-spam-classifier-main folder
2. Right click ui.py
3. Click "Open in Integrated Terminal"
4. In the terminal write the command "streamlit run ui.py"

Run in Chrome Extention (UI)
1. Enable developer mode in Google Extentions
2. Click Load unpacked and upload the "frontend" folder
3. In this step maybe will popup a chrome to let you sign in and enable the service
4. Click on your extention in top right corner