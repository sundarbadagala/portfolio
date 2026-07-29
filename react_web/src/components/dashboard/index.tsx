import BlogEdit from './sections/blogs-edit'
import BlogsList from './sections/blogs-list'
import BlogsView from './sections/blogs-view'
import { Routes, Route, Navigate } from 'react-router-dom'
import PrivateRoute from '@/utils/routing/privateRoutes'

function DashBoard() {
  return (
    <Routes>
      <Route element={<PrivateRoute />}>
        <Route index element={<Navigate to="blogs/list" replace />} />
        <Route path="blogs/list" element={<BlogsList />} />
        <Route path="blogs/edit" element={<BlogEdit />} />
        <Route path="blogs/view" element={<BlogsView />} />
      </Route>
    </Routes>
  )
}

export default DashBoard
