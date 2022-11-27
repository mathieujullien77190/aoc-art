/** @format */
import { combineReducers } from "redux"

import { reducer as history } from "./history"
import { reducer as global } from "./global"

export const rootReducer = combineReducers({
	history,
	global,
})

export type RootState = ReturnType<typeof rootReducer>
