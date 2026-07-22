import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
// import { InterviewProvider } from "./features/interview/interview.context.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"

function App() {
  return (
    <AuthProvider>
      {/* <InterviewProvider> */}
        <RouterProvider router={router} />
      {/* </InterviewProvider> */}
    </AuthProvider>
  )
}

export default App