import { Routes, Route, Navigate } from 'react-router-dom'
import BlogEdit from './sections/blogs-edit'
import BlogsList from './sections/blogs-list'
import BlogsView from './sections/blogs-view'
import QuestionsList from './sections/questions-list'
import QuestionsEdit from './sections/questions-edit'
import QandAList from './sections/q&a-list'
import QandAEdit from './sections/q&a-edit'
import PrivateRoute from '@/utils/routing/privateRoutes'

function DashBoard() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route index element={<Navigate to="blogs/list" replace />} />
        <Route path="blogs/list" element={<BlogsList />} />
        <Route path="blogs/edit" element={<BlogEdit />} />
        <Route path="blogs/view" element={<BlogsView />} />
        <Route path="questions/list" element={<QuestionsList />} />
        <Route path="questions/edit" element={<QuestionsEdit />} />
        <Route path="q&a/list" element={<QandAList />} />
        <Route path="q&a/edit" element={<QandAEdit />} />
      </Route>
    </Routes>
  )
}

export default DashBoard
