'use strict';
import * as pdfjsLib from 'pdfjs-dist/webpack';

document.getElementById("fillFormButton").addEventListener("click", () => {
  // Send a message to the content script to trigger the fillForm function
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "fillForm" });
  });

  // Close the popup after clicking the button
  window.close();
});

const fileInput = document.getElementById('file-input');
const readButton = document.getElementById('read-button');
const outputDiv = document.getElementById('output');

fileInput.addEventListener('change', function() {
  const selectedFile = fileInput.files[0];
  if (selectedFile && selectedFile.type === 'application/pdf') {
    chrome.storage.local.set({ 'resumePath': selectedFile.path })
    const reader = new FileReader();

    reader.onload = function() {
      const typedArray = new Uint8Array(this.result);
      pdfjsLib.getDocument(typedArray).promise.then(function(pdf) {
        let textContent = '';
        pdf.getPage(1).then(function(page) {
          page.getTextContent().then(function(content) {
            content.items.forEach(function(item) {
              textContent += item.str + ' ';
            });
            chrome.storage.local.set({ 'resumeText': textContent });
            let current_time_string = new Date().toLocaleString();
            chrome.storage.local.set({ 'resumeTime': current_time_string })
            outputDiv.textContent = 'Resume successfully processed at ' + current_time_string;
          });
        });
      });
    };
    reader.readAsArrayBuffer(selectedFile);
  } else {
    outputDiv.textContent = 'Please select a PDF file.';
  };
});

chrome.storage.local.get('resumeTime', function(data) {
  if (data.resumeTime) {
    outputDiv.textContent = 'Resume last processed at ' + data.resumeTime;
  }
});