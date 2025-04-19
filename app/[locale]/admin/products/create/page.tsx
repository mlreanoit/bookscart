import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import ProductForm from '../product-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Product',
}

const CreateProductPage = async () => {
  const session = await auth()
  // ❌ Redirect if user is not an admin
  if (!session || session.user.role !== 'Admin') {
    redirect('/') // Or use redirect('/not-authorized') if you have such a page
  }

  return (
    <main className='max-w-6xl mx-auto p-4'>
      <div className='flex mb-4'>
        <Link href='/admin/products'>Products</Link>
        <span className='mx-1'>›</span>
        <Link href='/admin/products/create'>Create</Link>
      </div>

      <div className='my-8'>
        <ProductForm type='Create' />
      </div>
    </main>
  )
}

export default CreateProductPage
