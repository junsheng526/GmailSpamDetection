import streamlit as st
import requests

st.title("Email/SMS Spam Classifier")

input_sms = st.text_area("Enter the message")

if st.button('Predict'):
    response = requests.post('http://127.0.0.1:5000/predict', json={'message': input_sms})
    result = response.json()['prediction']
    
    if result == 1:
        st.header("Spam")
    else:
        st.header("Not Spam")
