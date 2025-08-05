import { persistStore, persistReducer, PersistConfig } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger'; // ✅ Импорт логгера напрямую
import {
  applyMiddleware,
  compose,
  createStore,
  Store,
  Middleware,
} from 'redux';

import { rootSaga } from './root-saga';
import { rootReducer } from './root-reducer';

// Типизация состояния
export type RootState = ReturnType<typeof rootReducer>;

// Типизация window для Redux DevTools
declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

// Тип для persist config с ограничением ключей состояния
type ExtendedPersistConfig = PersistConfig<RootState> & {
  whitelist: (keyof RootState)[];
};

// Настройки persist
const persistConfig: ExtendedPersistConfig = {
  key: 'root',
  storage,
  whitelist: ['cart'], // только cart сохраняется
};

// Обернутый редюсер
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Saga middleware
const sagaMiddleware = createSagaMiddleware();

// ✅ Массив middleware: logger только в dev, фильтрация null и строгая типизация
const middlewares = [
  process.env.NODE_ENV !== 'production' ? logger : null,
  sagaMiddleware,
].filter((middleware): middleware is Middleware => Boolean(middleware));

// ✅ Поддержка Redux DevTools с проверкой window
const composeEnhancer =
  process.env.NODE_ENV !== 'production' &&
  typeof window !== 'undefined' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

// ✅ Сборка middleware
const composedEnhancers = composeEnhancer(applyMiddleware(...middlewares));

// ✅ Создание Redux store
export const store: Store = createStore(
  persistedReducer,
  undefined,
  composedEnhancers
);

// ✅ Создание persistor
export const persistor = persistStore(store);

// ✅ Запуск корневой саги
sagaMiddleware.run(rootSaga);