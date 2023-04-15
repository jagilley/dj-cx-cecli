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
    readButton.disabled = false;
  } else {
    readButton.disabled = true;
  }
});

readButton.addEventListener('click', function() {
  const selectedFile = fileInput.files[0];
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
          outputDiv.textContent = textContent;
          chrome.storage.local.set({ 'resumeText': textContent });
        });
      });
    });
  };

  reader.readAsArrayBuffer(selectedFile);
});

chrome.storage.local.get('resumeText', function(data) {
  if (data.resumeText) {
    outputDiv.textContent = data.resumeText;
  }
});