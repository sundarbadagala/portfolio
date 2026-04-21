import { takeLatest, put, call, StrictEffect } from "redux-saga/effects";
import { blogsService } from "./service";
import { IResponse } from "./interface";
import { tagsError, tagsRequest, tagsSucccess } from "./slice.tags";
import { blogsRequest, blogsSuccess, blogsError } from "./slice.blogs";
import { newsError, newsRequest, newsSuccess } from "./slice.news";

function* blogsWorker(): Generator<StrictEffect, undefined, IResponse> {
  try {
    const res: any = yield call(blogsService.getBlogsApi);
    if (res.status === 200) {
      yield put(blogsSuccess(res.data.data));
    } else {
      yield put(blogsError(res.message));
    }
  } catch (e) {
    yield put(blogsError((e as Error).message));
  }
}

function* tagsWorker(): Generator<StrictEffect, undefined, IResponse> {
  try {
    const res: any = yield call(blogsService.getTagsApi);
    if (res.status === 200) {
      yield put(tagsSucccess(res.data.data));
    } else {
      yield put(tagsError(res.message));
    }
  } catch (e) {
    yield put(tagsError((e as Error).message));
  }
}

function* newsWorker(): Generator<StrictEffect, undefined, IResponse> {
  try {
    const res: any = yield call(blogsService.getNewsApi)
    if (res.status === 200) {
      yield put(newsSuccess(res.data.data))
    } else {
      yield put(newsError(res.message))
    }
  } catch (e) {
    yield put(newsError((e as Error).message))
  }
}

export default function* blogsSaga() {
  yield takeLatest(blogsRequest.type, blogsWorker);
  yield takeLatest(tagsRequest.type, tagsWorker);
  yield takeLatest(newsRequest.type, newsWorker)
}
