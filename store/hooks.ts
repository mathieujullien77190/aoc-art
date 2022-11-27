/** @format */

import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { RootState } from "./root"
import { AppDispatch } from "./initStore"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
