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
      
      // Get all input and textarea elements on the page
      const inputElements = document.querySelectorAll("input, textarea");

      // Iterate through the elements and use GPT-3.5 API to determine the appropriate value
      inputElements.forEach((element) => {
        // if type of input is file, skip
        if (element.type === "file") return;
        // if input is hidden, skip
        if (element.type === "hidden") return;
        const elementType = element.tagName.toLowerCase();
        const fieldName = element.name || element.id || element.placeholder;
        console.log(fieldName);

        // iterate through this element's parents until a label is a subelement of current element
        let label = element;
        while (label && label.tagName.toLowerCase() !== "label") {
          label = label.parentElement;
        }
        console.log(label);
        // if we found a label, use its text as the field name
        let fieldNameRich = "";
        if (label) {
          fieldNameRich = label.innerText;
          console.log("fieldName is ", fieldName);
        }
        else {
          fieldNameRich = fieldName;
        }

        // Skip if the field name is empty
        if (!fieldName) return;

        chrome.runtime.sendMessage({ action: "getFieldJson", personalInfo: personalInfo, fieldName: fieldNameRich }, (response) => {
          const suggestedValue = response.data.trim();
          // remove trailing commas
          const tcRegex = /\,(?!\s*?[\{\[\"\'\w])/g;
          const svnocommas = suggestedValue.replace(tcRegex, '');
          console.log(svnocommas);
          // process JSON response, removing any trailing commas
          const suggestedValueJson = JSON.parse(svnocommas);
          const value = suggestedValueJson.field_completion;
          console.log(value);
          // Fill the form
          if (elementType === "input") {
            element.value = value;
          } else if (elementType === "textarea") {
            element.innerHTML = value;
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