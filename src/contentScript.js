'use strict';

// Function to fill out the form
function fillForm() {
  chrome.storage.local.get('resumeText', function(data) {
    if (data.resumeText) {
      const resumeText = data.resumeText;
      console.log("resumeText is", resumeText);
      const personalInfo = {
        "resumeText": resumeText
      };
      console.log("personalInfo is 1 ", personalInfo)
      
      // Get all input and textarea elements on the page
      const inputElements = document.querySelectorAll("input, textarea");

      // Iterate through the elements and use GPT-3 API to determine the appropriate value
      inputElements.forEach((element) => {
        const elementType = element.tagName.toLowerCase();
        const fieldName = element.name || element.id || element.placeholder;

        // Skip if the field name is empty
        if (!fieldName) return;

        chrome.runtime.sendMessage({ action: "getFieldJson", personalInfo: personalInfo, fieldName: fieldName }, (response) => {
          const suggestedValue = response.data.trim();
          // remove trailing commas
          const tcRegex = /\,(?!\s*?[\{\[\"\'\w])/g;
          const svnocommas = suggestedValue.replace(tcRegex, '');
          console.log(svnocommas);
          // process JSON response, removing any trailing commas
          const suggestedValueJson = JSON.parse(svnocommas);
          // if fieldName is in the JSON response, use the value
          if (fieldName in suggestedValueJson) {
            const value = suggestedValueJson[fieldName];
            console.log(value);
            // Fill the form
            if (elementType === "input") {
              element.value = value;
            } else if (elementType === "textarea") {
              element.innerHTML = value;
            }
          }
        });
      });
    }
    else {
      // raise error
      console.log("No resume text found");
    }
  });
}

// Listen for a message from the background script to fill the form
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "fillForm") {
    fillForm();
  }
});