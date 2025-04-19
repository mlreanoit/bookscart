'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { createProduct, updateProduct } from '@/lib/actions/product.actions'
import { IProduct } from '@/lib/db/models/product.model'
import { UploadButton } from '@/lib/uploadthing'
import { ProductInputSchema, ProductUpdateSchema } from '@/lib/validator'
import { Checkbox } from '@/components/ui/checkbox'
import { toSlug } from '@/lib/utils'
import { IProductInput } from '@/types'
import { Trash } from 'lucide-react'
import { useState } from 'react'

const productDefaultValues: IProductInput =
  process.env.NODE_ENV === 'development'
    ? {
        name: '',
        slug: '',
        category: '',
        images: [],
        brand: '',
        description: 'This is a sample description of the product.',
        price: 99.99,
        listPrice: 0,
        countInStock: 15,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }
    : {
        name: '',
        slug: '',
        category: '',
        images: [],
        brand: '',
        description: '',
        price: 0,
        listPrice: 0,
        countInStock: 0,
        numReviews: 0,
        avgRating: 0,
        numSales: 0,
        isPublished: false,
        tags: [],
        sizes: [],
        colors: [],
        ratingDistribution: [],
        reviews: [],
      }

const ProductForm = ({
  type,
  product,
  productId,
}: {
  type: 'Create' | 'Update'
  product?: IProduct
  productId?: string
}) => {
  const router = useRouter()

  const form = useForm<IProductInput>({
    resolver:
      type === 'Update'
        ? zodResolver(ProductUpdateSchema)
        : zodResolver(ProductInputSchema),
    defaultValues:
      product && type === 'Update' ? product : productDefaultValues,
  })

  const { toast } = useToast()
  async function onSubmit(values: IProductInput) {
    if (type === 'Create') {
      const res = await createProduct(values)
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        toast({
          description: res.message,
        })
        router.push(`/admin/products`)
      }
    }
    if (type === 'Update') {
      if (!productId) {
        router.push(`/admin/products`)
        return
      }
      const res = await updateProduct({ ...values, _id: productId })
      if (!res.success) {
        toast({
          variant: 'destructive',
          description: res.message,
        })
      } else {
        router.push(`/admin/products`)
      }
    }
  }
  const images = form.watch('images')
  const [sizeInput, setSizeInput] = useState('')
  const [colorInput, setColorInput] = useState('')
  const [tagInput, setTagInput] = useState('')

  return (
    <Form {...form}>
      <form
        method='post'
        onSubmit={form.handleSubmit(onSubmit)}
        className='space-y-8'
      >
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='name'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product name' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='slug'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Slug</FormLabel>

                <FormControl>
                  <div className='relative'>
                    <Input
                      placeholder='Enter product slug'
                      className='pl-8'
                      {...field}
                    />
                    <button
                      type='button'
                      onClick={() => {
                        form.setValue('slug', toSlug(form.getValues('name')))
                      }}
                      className='absolute right-2 top-2.5'
                    >
                      Generate
                    </button>
                  </div>
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='category'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Input placeholder='Enter category' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='brand'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product sku' {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='listPrice'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>List Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product list price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='price'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Net Price</FormLabel>
                <FormControl>
                  <Input placeholder='Enter product price' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='countInStock'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Count In Stock</FormLabel>
                <FormControl>
                  <Input
                    type='number'
                    placeholder='Enter product count in stock'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='flex flex-col gap-5 md:flex-row'>
          {/* Sizes Field */}
          <FormField
            control={form.control}
            name='sizes'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sizes</FormLabel>
                <div className='flex items-center space-x-2'>
                  <Input
                    placeholder='Add a size (e.g. S, M, L)'
                    value={sizeInput}
                    onChange={(e) => setSizeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && sizeInput.trim()) {
                        e.preventDefault()
                        if (!field.value.includes(sizeInput)) {
                          form.setValue('sizes', [
                            ...field.value,
                            sizeInput.trim(),
                          ])
                        }
                        setSizeInput('')
                      }
                    }}
                  />
                  <Button
                    type='button'
                    onClick={() => {
                      if (
                        sizeInput.trim() &&
                        !field.value.includes(sizeInput)
                      ) {
                        form.setValue('sizes', [
                          ...field.value,
                          sizeInput.trim(),
                        ])
                        setSizeInput('')
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {field.value.map((size) => (
                    <span
                      key={size}
                      className='px-3 py-1 text-sm bg-muted rounded-full flex items-center gap-1'
                    >
                      {size}
                      <button
                        type='button'
                        onClick={() =>
                          form.setValue(
                            'sizes',
                            field.value.filter((s) => s !== size)
                          )
                        }
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* </div>
        <div className='flex flex-col gap-5 md:flex-row'> */}
          {/* color Field */}
          <FormField
            control={form.control}
            name='colors'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Colors</FormLabel>
                <div className='flex items-center space-x-2'>
                  <Input
                    placeholder='Add a color'
                    value={colorInput}
                    onChange={(e) => setColorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && colorInput.trim()) {
                        e.preventDefault()
                        if (!field.value.includes(colorInput)) {
                          form.setValue('colors', [
                            ...field.value,
                            colorInput.trim(),
                          ])
                        }
                        setColorInput('')
                      }
                    }}
                  />
                  <Button
                    type='button'
                    onClick={() => {
                      if (
                        colorInput.trim() &&
                        !field.value.includes(colorInput)
                      ) {
                        form.setValue('colors', [
                          ...field.value,
                          colorInput.trim(),
                        ])
                        setColorInput('')
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {field.value.map((color) => (
                    <span
                      key={color}
                      className='px-3 py-1 text-sm bg-muted rounded-full flex items-center gap-1'
                    >
                      {color}
                      <button
                        type='button'
                        onClick={() =>
                          form.setValue(
                            'colors',
                            field.value.filter((s) => s !== color)
                          )
                        }
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='tags'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <div className='flex items-center space-x-2'>
                  <Input
                    placeholder='Add tag (e.g. New, Best Seller)'
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && tagInput.trim()) {
                        e.preventDefault()
                        if (!field.value.includes(tagInput.trim())) {
                          form.setValue('tags', [
                            ...field.value,
                            tagInput.trim(),
                          ])
                        }
                        setTagInput('')
                      }
                    }}
                  />
                  <Button
                    type='button'
                    onClick={() => {
                      if (
                        tagInput.trim() &&
                        !field.value.includes(tagInput.trim())
                      ) {
                        form.setValue('tags', [...field.value, tagInput.trim()])
                        setTagInput('')
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
                <div className='flex flex-wrap gap-2 mt-2'>
                  {field.value.map((tag) => (
                    <span
                      key={tag}
                      className='px-3 py-1 text-sm bg-muted rounded-full flex items-center gap-1'
                    >
                      {tag}
                      <button
                        type='button'
                        onClick={() =>
                          form.setValue(
                            'tags',
                            field.value.filter((t) => t !== tag)
                          )
                        }
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className='flex flex-col gap-5 md:flex-row'>
          <FormField
            control={form.control}
            name='images'
            render={() => (
              <FormItem className='w-full'>
                <FormLabel>Images</FormLabel>
                <Card>
                  <CardContent className='space-y-2 mt-2 min-h-48'>
                    <div className='flex justify-start items-center space-x-2'>
                      {images.map((image: string) => (
                        <Card key={image} className='relative '>
                          <Image
                            src={image}
                            alt='product image'
                            className='w-36 h-36 object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                          />
                          <Button
                            variant={'destructive'}
                            className='absolute top-1 right-1'
                            type='button'
                            size='icon'
                            onClick={() => {
                              form.setValue(
                                'images',
                                images.filter((img) => img !== image)
                              )
                            }}
                          >
                            <Trash />
                          </Button>
                        </Card>
                      ))}
                      <FormControl>
                        <UploadButton
                          endpoint='imageUploader'
                          onClientUploadComplete={(res: { url: string }[]) => {
                            form.setValue('images', [...images, res[0].url])
                          }}
                          onUploadError={(error: Error) => {
                            toast({
                              variant: 'destructive',
                              description: `ERROR! ${error.message}`,
                            })
                          }}
                        />
                      </FormControl>
                    </div>
                  </CardContent>
                </Card>

                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div>
          <FormField
            control={form.control}
            name='description'
            render={({ field }) => (
              <FormItem className='w-full'>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder='Tell us a little bit about yourself'
                    className='resize-none'
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  You can <span>@mention</span> other users and organizations to
                  link to them.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <FormField
            control={form.control}
            name='isPublished'
            render={({ field }) => (
              <FormItem className='space-x-2 items-center'>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>Is Published?</FormLabel>
              </FormItem>
            )}
          />
        </div>
        <div>
          <Button
            type='submit'
            size='lg'
            disabled={form.formState.isSubmitting}
            className='button col-span-2 w-full'
          >
            {form.formState.isSubmitting ? 'Submitting...' : `${type} Product `}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ProductForm
