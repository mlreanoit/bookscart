import { Metadata } from 'next'
import ProductList from './product-list'
import { auth } from '@/auth'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Admin Products',
}

export default async function AdminProduct() {
  const session = await auth()

  if (session?.user.role !== 'Admin') {
    redirect('/') // or use `notFound()` to show 404 instead
  }

  return <ProductList />
}
