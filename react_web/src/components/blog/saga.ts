import { takeLatest, put, call, StrictEffect } from "redux-saga/effects";
import { blogError, blogRequest, blogSuccess } from "./slice.blog";
import { blogService } from "./service";

function* blogWorker(action: any): Generator<StrictEffect, undefined, any> {
  try {
    const res = yield call(blogService.getBlogApi, action.payload);
    if (res.status === 200) {
      yield put(blogSuccess(res.data.data));
    } else {
      yield put(blogError(res.message));
    }
  } catch (e) {
    yield put(blogError((e as Error).message));
  }
}

export default function* blogSaga() {
  yield takeLatest(blogRequest.type, blogWorker);
}
