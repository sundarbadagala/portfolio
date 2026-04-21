import { configureStore, Tuple } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import { rootReducer } from "./rootReducer";
import { rootSaga } from "./rootSaga";

const reduxSagaMonitorOptions = {};
const sagaMiddleware = createSagaMiddleware(reduxSagaMonitorOptions);

export const store = configureStore({
  reducer: rootReducer,
  middleware: () => new Tuple(sagaMiddleware, logger),
});

sagaMiddleware.run(rootSaga);
