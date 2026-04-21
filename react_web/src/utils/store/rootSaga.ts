import { all, fork } from "redux-saga/effects";
import blogsSaga from "@/components/blogs/saga";
import blogSag from "@/components/blog/saga";
import loginSaga from "@/components/login/saga";

const sagas = [blogsSaga, blogSag, loginSaga];

export function* rootSaga() {
  yield all(sagas.map((saga) => fork(saga)));
}
