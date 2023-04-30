# <img src="public/icons/icon_48.png" width="45" align="left"> Dreamjob Chrome Extension

## Install instructions for debugging

1. Clone this repo (`git clone https://github.com/jagilley/dj-cx-cecli`)
1. Navigate to the repo that you just cloned
1. `npm install -g chrome-extension-cli` (if you don't already have `npm` installed, run `brew install node` on MacOS)
1. `npm run build`
1. Go to Chrome/Brave's extensions page, enable dev mode, and then click "load unpacked".
1. Navigate to the `build` folder you just created, and select it. You should be good to go!

## TODO
- [ ] add more robust logic for multiple choice selections
- [ ] maybe pass each element/div to the LLM and have it infer the intent?