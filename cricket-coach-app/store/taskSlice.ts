import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface Task {
  id: string
  title: string
  completed: boolean
  student?: any
}

interface TaskState {
  tasks: Task[]
}

const initialState: TaskState = {
  tasks: [
    { id: "1", title: "Analyze last match footage", completed: false },
    { id: "2", title: "Plan fitness session", completed: false },
    { id: "3", title: "Conduct player review", completed: true },
    { id: "4", title: "Upload practice video", completed: true },
  ],
}

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload
    },
    toggleTask: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) task.completed = !task.completed
    },
    markTaskCompleted: (state, action: PayloadAction<string>) => {
      const task = state.tasks.find((t) => t.id === action.payload)
      if (task) task.completed = true
    },
  },
})

export const { setTasks, toggleTask, markTaskCompleted } = taskSlice.actions
export default taskSlice.reducer
