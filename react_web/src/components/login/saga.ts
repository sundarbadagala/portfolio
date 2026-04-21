import { StrictEffect, takeLatest, call, put } from "redux-saga/effects";
import { loginError, loginRequest, loginSuccess } from "./slice.login";
import { loginService } from "./service";
import { IPayload } from "./interface";
import { PayloadAction } from "@reduxjs/toolkit";


function* loginWorker(action: PayloadAction<IPayload>): Generator<StrictEffect, undefined, any> {
    try {
        const { email, password, callback } = action.payload
        const res = yield call(loginService.loginApi, { email, password })
        if (res.status === 200 && res.data.status === 'success') {
            // const { data: { data: { token } = {} } = {} } = res || {}
            // localStorage.setItem("token", token);
            yield put(loginSuccess(res))
            yield put(callback())
        } else {
            yield put(loginError(res.message))

        }
    } catch (e) {
        yield put(loginError((e as Error).message))
    }
}

export default function* loginSaga() {
    yield takeLatest(loginRequest.type, loginWorker)
}