import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App'
import store from './store'
import './css/style.css'

const div = document.createElement('div')
document.body.appendChild(div)
createRoot(div).render(
    <Provider store={store}>
        <App />
    </Provider>,
)
