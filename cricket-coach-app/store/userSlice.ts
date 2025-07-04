// userSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

type UserState = {
	name: string
	email: string
	token: string
	role: "Coach" | "Player" | ""
	id: string
	profilePicture: string

}

const initialState: UserState = {
	name: "",
	email: "",
	token: "",
	role: "",
	id: "",
	profilePicture: "",

}

const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (_state, action: PayloadAction<UserState>) => action.payload,
		clearUser: () => initialState,
		logout: (state) => {
			return initialState
		},
	},
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
