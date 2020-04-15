import { logger, createStore, Model } from 'carl-flow';

const app = {
  namespace: 'app',
  state: {
    userId: 0
  },
  services: {
    updateUserId(userId, { put }) {
      return Promise.resolve(put({ userId }))
    }
  }
} as Model

const home = {
  namespace: 'home',
  state: {
    userId: 0
  },
  services: {
    updateUserId(userId, { put }) {
      return Promise.resolve(put({ userId }))
    }
  }
} as Model

const config = {
  namespace: 'config',
  state: {
    userId: 0
  },
  services: {
    updateUserId(userId, { put }) {
      return Promise.resolve(put({ userId }))
    }
  }
} as Model

export default createStore(
  [
    app,
    home,
    config,
  ],
  [logger]
)