import { combineReducers, configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import { persistReducer, persistStore, createTransform } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Create a transform to reset loading and error states on persistence
const resetLoadingTransform = createTransform(
  // transform state on its way to being serialized and persisted
  (inboundState) => {
    return {
      ...inboundState,
      loading: false,
      error: null
    };
  },
  // transform state being rehydrated (we don't need to change anything)
  (outboundState) => outboundState,
  // only apply to user reducer
  { whitelist: ['user'] }
);

const persistConfig = {
    key: 'root',
    storage,
    transforms: [resetLoadingTransform],
};

const rootReducer = combineReducers({ user: userReducer });
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);