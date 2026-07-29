import { StrictEffect, takeLatest, call, put } from "redux-saga/effects";
import { blogsService } from "./service";
import { blogsRequest, blogsSuccess, blogsError } from './slice.blogs'


function* blogsWorker(): Generator<StrictEffect, undefined, any> {
    try {
        const res = yield call(blogsService.getBlogsApi)
        if (res.status === 200 && res.data.status === 'success') {
            yield put(blogsSuccess(res.data.data))
        } else {
            yield put(blogsError(res.message))

        }
    } catch (e) {
        yield put(blogsError((e as Error).message))
    }
}

export default function* dashboardSaga() {
    yield takeLatest(blogsRequest.type, blogsWorker)
}