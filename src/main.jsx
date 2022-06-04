import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'

import {
  AdaptivityProvider,
  ConfigProvider
} from '@vkontakte/vkui';
import bridge from '@vkontakte/vk-bridge';
import "@vkontakte/vkui/dist/vkui.css";

bridge.send("VKWebAppInit", {});

ReactDOM.render(
  <React.StrictMode>
    <ConfigProvider>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>
  </React.StrictMode>,
  document.getElementById('root')
);